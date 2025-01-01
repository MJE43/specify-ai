import { DocumentType, GeneratedDocuments, QuestionnaireResponse } from './types';
import { GeminiService } from './geminiService';
import { documentPrompts } from '../data/prompts';

export class DocumentGenerator {
  private geminiService: GeminiService;

  constructor() {
    this.geminiService = new GeminiService();
  }

  async generateSingleDocument(
    documentType: DocumentType,
    questionnaireResponse: QuestionnaireResponse,
    previousDocuments: Partial<GeneratedDocuments> = {}
  ): Promise<string> {
    try {
      const prompt = documentPrompts[documentType];
      const context = this.buildContext(previousDocuments);
      const formattedQuestionnaireData = this.formatQuestionnaireData(questionnaireResponse);
      
      const content = await this.geminiService.generateText(
        prompt.systemPrompt,
        `${context}\n\nProject Details:\n${formattedQuestionnaireData}\n\n${prompt.userPrompt}`
      );
      
      return content;
    } catch (error) {
      console.error(`Error generating ${documentType}:`, error);
      throw error;
    }
  }

  async generateAllDocuments(
    questionnaireResponse: QuestionnaireResponse
  ): Promise<GeneratedDocuments> {
    const documents: GeneratedDocuments = {
      requirements: '',
      backend: '',
      techStack: '',
      frontend: '',
      fileStructure: '',
      appFlow: '',
      systemPrompts: ''
    };

    try {
      // Generate each document type sequentially
      for (const documentType of Object.keys(documents) as DocumentType[]) {
        // Generate document with context from previous documents
        const previousDocs = { ...documents };
        documents[documentType] = await this.generateSingleDocument(
          documentType,
          questionnaireResponse,
          previousDocs
        );
      }

      return documents;
    } catch (error) {
      console.error('Error generating documents:', error);
      throw error;
    }
  }

  private buildContext(previousDocuments: Partial<GeneratedDocuments>): string {
    if (Object.keys(previousDocuments).length === 0) return '';

    return `Previously Generated Documents:\n\n${
      Object.entries(previousDocuments)
        .filter(([_, content]) => content)
        .map(([type, content]) => `${type}:\n${content}\n`)
        .join('\n')
    }`;
  }

  private formatQuestionnaireData(data: QuestionnaireResponse): string {
    return Object.entries(data)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n\n');
  }
}