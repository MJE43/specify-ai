// src/lib/documentGenerator.ts

import { 
  DocumentType, 
  GeneratedDocuments, 
  QuestionnaireResponse, 
  GenerationProgress
} from './types';
import { GeminiService } from './geminiService';
import { DocumentStorage } from './documentStorage';

export class DocumentGenerator {
  private geminiService: GeminiService;
  private documentStorage: DocumentStorage;
  private readonly maxRetries = 2;
  private readonly delayBetweenRetries = 1000; // 1 second
  private readonly delayBetweenDocuments = 2000; // 2 seconds

  private documentTypes: DocumentType[] = [
    'projectRequirements',
    'backendStructure',
    'techStack',
    'frontendGuidelines',
    'fileStructure',
    'appFlow',
    'systemPrompts'
  ];

  constructor() {
    this.geminiService = new GeminiService();
    this.documentStorage = new DocumentStorage();
  }

  async generateSingleDocument(
    documentType: DocumentType,
    questionnaireResponse: QuestionnaireResponse,
    previousDocuments: Partial<GeneratedDocuments> = {},
    onStream?: (chunk: string) => void,
    retryCount: number = 0
  ): Promise<string> {
    try {
      // Build context from questionnaire and previous documents
      const userContext = this.buildUserContext(questionnaireResponse, previousDocuments);

      const content = await this.geminiService.generateDocument(
        documentType,
        userContext,
        onStream
      );

      if (!this.validateGeneratedContent(content, documentType)) {
        throw new Error('Generated content validation failed');
      }

      return content;
    } catch (error) {
      console.error(`Error generating ${documentType} (attempt ${retryCount + 1}):`, error);

      if (retryCount < this.maxRetries) {
        await this.delay(this.delayBetweenRetries * (retryCount + 1));
        return this.generateSingleDocument(
          documentType, 
          questionnaireResponse, 
          previousDocuments,
          onStream,
          retryCount + 1
        );
      }
      throw error;
    }
  }

  async generateAllDocuments(
    questionnaireResponse: QuestionnaireResponse,
    userId: string,
    onProgress?: (progress: GenerationProgress) => void,
    onStream?: (documentType: DocumentType, chunk: string) => void
  ): Promise<GeneratedDocuments> {
    const documents: GeneratedDocuments = {
      projectRequirements: '',
      backendStructure: '',
      techStack: '',
      frontendGuidelines: '',
      fileStructure: '',
      appFlow: '',
      systemPrompts: ''
    };

    try {
      for (let i = 0; i < this.documentTypes.length; i++) {
        const documentType = this.documentTypes[i];

        // Update progress
        if (onProgress) {
          onProgress({
            currentStep: i + 1,
            totalSteps: this.documentTypes.length,
            currentDocument: documentType,
            status: 'generating'
          });
        }

        // Generate document
        const previousDocs = { ...documents };
        documents[documentType] = await this.generateSingleDocument(
          documentType,
          questionnaireResponse,
          previousDocs,
          onStream ? (chunk) => onStream(documentType, chunk) : undefined
        );

        // Delay between documents to respect rate limits
        if (i < this.documentTypes.length - 1) {
          await this.delay(this.delayBetweenDocuments);
        }
      }

      // Save to Supabase
      await this.documentStorage.saveDocuments(
        userId,
        questionnaireResponse,
        documents
      );

      // Update final progress
      if (onProgress) {
        onProgress({
          currentStep: this.documentTypes.length,
          totalSteps: this.documentTypes.length,
          currentDocument: null,
          status: 'completed'
        });
      }

      return documents;
    } catch (error) {
      // Update progress on error
      if (onProgress) {
        onProgress({
          currentStep: 0,
          totalSteps: this.documentTypes.length,
          currentDocument: null,
          status: 'error'
        });
      }
      throw error;
    }
  }

  private buildUserContext(
    questionnaireResponse: QuestionnaireResponse, 
    previousDocuments: Partial<GeneratedDocuments>
  ): string {
    const questionnaireContext = this.formatQuestionnaireData(questionnaireResponse);
    const previousDocsContext = this.formatPreviousDocuments(previousDocuments);

    return `${questionnaireContext}\n\n${previousDocsContext}`.trim();
  }

  private formatQuestionnaireData(data: QuestionnaireResponse): string {
    const sections = Object.entries(data).map(([key, value]) => {
      const formattedKey = this.formatKey(key);
      return `${formattedKey}:\n${value}`;
    });

    return `Project Information:\n\n${sections.join('\n\n')}`;
  }

  private formatPreviousDocuments(documents: Partial<GeneratedDocuments>): string {
    if (Object.keys(documents).length === 0) return '';

    const sections = Object.entries(documents)
      .filter(([_, content]) => content)
      .map(([type, content]) => {
        const formattedType = this.formatKey(type);
        return `${formattedType}:\n${content}`;
      });

    return `Previously Generated Documents:\n\n${sections.join('\n\n')}`;
  }

  private validateGeneratedContent(content: string, documentType: DocumentType): boolean {
    if (!content || content.trim().length === 0) {
      return false;
    }

    const minLength = 100; // Minimum content length
    if (content.length < minLength) {
      return false;
    }

    // Add type-specific validation
    switch (documentType) {
      case 'projectRequirements':
        return content.includes('Requirements') && 
               (content.includes('Functional') || content.includes('Non-functional'));

      case 'backendStructure':
        return content.includes('API') || 
               content.includes('Database') || 
               content.includes('Architecture');

      case 'techStack':
        return content.includes('Frontend') || 
               content.includes('Backend') || 
               content.includes('Database');

      case 'frontendGuidelines':
        return content.includes('Component') || 
               content.includes('UI') || 
               content.includes('Interface');

      case 'fileStructure':
        return content.includes('/') || 
               content.includes('src') || 
               content.includes('components');

      case 'appFlow':
        return content.includes('Flow') || 
               content.includes('Step') || 
               content.includes('Process');

      case 'systemPrompts':
        return content.includes('Prompt') || 
               content.includes('Instruction') || 
               content.includes('Guide');

      default:
        return true;
    }
  }

  private formatKey(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}