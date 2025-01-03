// src/lib/documentGenerator.ts

import {
  DocumentType,
  GeneratedDocuments,
  QuestionnaireResponse,
  GenerationProgress,
  UserContext,
  User
} from './types';
import { GeminiService } from './geminiService';
import { DocumentStorage } from './documentStorage';

export class DocumentGenerationError extends Error {
  constructor(
    public message: string,
    public code: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'DocumentGenerationError';
  }
}

export class UserContextBuilder {
  async buildUserContext(
    questionnaireResponse: QuestionnaireResponse,
    previousDocuments: Partial<GeneratedDocuments>
  ): Promise<string> {
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

  private formatKey(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }
}

export class DocumentGenerator {
  private readonly maxRetries = 2;
  private readonly delayBetweenRetries = 1000; // 1 second
  private readonly delayBetweenDocuments = 2000; // 2 seconds
  private readonly timeout = 10000; // 10 seconds for document generation

  private documentTypes: DocumentType[] = [
    'projectRequirements',
    'backendStructure',
    'techStack',
    'frontendGuidelines',
    'fileStructure',
    'appFlow',
    'systemPrompts'
  ];

  constructor(
    private geminiService: GeminiService,
    private documentStorage: DocumentStorage,
    private userContextBuilder: UserContextBuilder
  ) {}

  async generateSingleDocument(
    documentType: DocumentType,
    questionnaireResponse: QuestionnaireResponse,
    previousDocuments: Partial<GeneratedDocuments> = {},
    onStream?: (chunk: string) => void,
    retryCount: number = 0
  ): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const userContext = await this.userContextBuilder.buildUserContext(questionnaireResponse, previousDocuments);

      const content = await this.geminiService.generateDocument(
        documentType,
        userContext,
        onStream,
        controller.signal
      );

      if (!this.validateGeneratedContent(content, documentType)) {
        throw new DocumentGenerationError(
          'Generated content validation failed',
          'CONTENT_VALIDATION_ERROR',
          new Error('Generated content did not meet validation criteria')
        );
      }

      return content;
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new DocumentGenerationError(
          'Document generation timed out',
          'TIMEOUT_ERROR',
          error
        );
      }

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
      if (!(error instanceof DocumentGenerationError)) {
        throw new DocumentGenerationError(
          `Failed to generate document of type ${documentType}`,
          'DOCUMENT_GENERATION_FAILED',
          error
        );
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
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

        if (onProgress) {
          onProgress({
            currentStep: i + 1,
            totalSteps: this.documentTypes.length,
            currentDocument: documentType,
            status: 'generating'
          });
        }

        const previousDocs = { ...documents };
        try {
          documents[documentType] = await this.generateSingleDocument(
            documentType,
            questionnaireResponse,
            previousDocs,
            onStream ? (chunk) => onStream(documentType, chunk) : undefined
          );
        } catch (error) {
          console.error(`Failed to generate ${documentType}`, error);
          // Consider how to handle individual document generation failures.
          // For now, we'll log and continue, but you might want to stop or retry differently.
          if (onProgress) {
            onProgress({
              currentStep: i + 1,
              totalSteps: this.documentTypes.length,
              currentDocument: documentType,
              status: 'error',
              error: error instanceof DocumentGenerationError ? error.message : 'Document generation failed'
            });
          }
          continue; // Or break, depending on desired behavior
        }

        if (i < this.documentTypes.length - 1) {
          await this.delay(this.delayBetweenDocuments);
        }
      }

      await this.documentStorage.saveDocuments(
        userId,
        questionnaireResponse,
        documents
      );

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
      if (onProgress) {
        onProgress({
          currentStep: 0,
          totalSteps: this.documentTypes.length,
          currentDocument: null,
          status: 'error',
          error: error instanceof Error ? error.message : 'An unexpected error occurred'
        });
      }
      throw error;
    }
  }

  private validateGeneratedContent(content: string, documentType: DocumentType): boolean {
    if (!content || content.trim().length === 0) {
      return false;
    }

    const minLength = 100; // Minimum content length
    if (content.length < minLength) {
      return false;
    }

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

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}