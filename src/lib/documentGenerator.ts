import { DocumentType, GeneratedDocuments, QuestionnaireResponse } from './types';
import { documentPrompts } from '../data/prompts';
import { GeminiService } from './geminiService';

export class DocumentGenerator {
  private geminiService: GeminiService;

  constructor() {
    this.geminiService = new GeminiService();
  }

  private formatQuestionnaireResponse(response: QuestionnaireResponse): string {
    return Object.entries(response)
      .map(([key, value]) => `${key}: ${JSON.stringify(value, null, 2)}`)
      .join('\n\n');
  }

  async generateSingleDocument(
    documentType: DocumentType,
    questionnaireResponse: QuestionnaireResponse,
    previousDocuments: Partial<GeneratedDocuments> = {}
  ): Promise<string> {
    const prompt = documentPrompts[documentType];
    if (!prompt) {
      throw new Error(`No prompt template found for document type: ${documentType}`);
    }

    // Format the questionnaire response and combine with any relevant previous documents
    const formattedResponse = this.formatQuestionnaireResponse(questionnaireResponse);
    const contextString = Object.entries(previousDocuments)
      .map(([key, value]) => `${key}:\n${value}`)
      .join('\n\n');

    const userInput = `${formattedResponse}\n\n${contextString}`;
    const finalUserPrompt = prompt.userPrompt.replace('[USER_INPUT]', userInput);

    try {
      return await this.geminiService.generateText(
        prompt.systemPrompt,
        finalUserPrompt
      );
    } catch (error) {
      console.error(`Error generating ${documentType}:`, error);
      throw error;
    }
  }

  async generateAllDocuments(
    questionnaireResponse: QuestionnaireResponse
  ): Promise<GeneratedDocuments> {
    const documentOrder: DocumentType[] = [
      'projectRequirements',
      'techStack',
      'backendStructure',
      'frontendGuidelines',
      'fileStructure',
      'appFlow',
      'systemPrompts',
    ];

    const documents: Partial<GeneratedDocuments> = {};

    for (const documentType of documentOrder) {
      try {
        const generatedContent = await this.generateSingleDocument(
          documentType,
          questionnaireResponse,
          documents
        );
        documents[documentType] = generatedContent;
      } catch (error) {
        console.error(`Failed to generate ${documentType}:`, error);
        throw error;
      }
    }

    return documents as GeneratedDocuments;
  }
}
