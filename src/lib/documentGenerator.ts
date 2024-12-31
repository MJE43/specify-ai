import { DocumentType, GeneratedDocuments, QuestionnaireResponse } from './types';
import { supabase } from '@/integrations/supabase/client';
import { GeminiService } from './geminiService';

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
      const systemPrompt = this.getSystemPrompt(documentType);
      const userPrompt = this.formatQuestionnaireData(questionnaireResponse);
      
      const content = await this.geminiService.generateText(systemPrompt, userPrompt);
      return content;
    } catch (error) {
      console.error(`Error generating ${documentType}:`, error);
      throw error;
    }
  }

  async generateAllDocuments(
    questionnaireResponse: QuestionnaireResponse
  ): Promise<GeneratedDocuments> {
    try {
      const documents: GeneratedDocuments = {
        projectRequirements: '',
        techStack: '',
        backendStructure: '',
        frontendGuidelines: '',
        fileStructure: '',
        appFlow: '',
        systemPrompts: ''
      };

      // Generate each document type sequentially
      for (const documentType of Object.keys(documents) as DocumentType[]) {
        documents[documentType] = await this.generateSingleDocument(
          documentType,
          questionnaireResponse,
          documents
        );
      }

      // Save the generated documents to Supabase
      const projectId = questionnaireResponse.projectId as string;
      if (projectId) {
        await this.saveDocumentsToSupabase(projectId, documents);
      }

      return documents;
    } catch (error) {
      console.error('Error generating documents:', error);
      throw error;
    }
  }

  private getSystemPrompt(documentType: DocumentType): string {
    const basePrompt = "As a senior technical documentation specialist, analyze the project details and generate a comprehensive";
    
    switch (documentType) {
      case 'projectRequirements':
        return `${basePrompt} requirements document that includes functional and non-functional requirements.`;
      case 'techStack':
        return `${basePrompt} technical stack recommendation with justifications for each technology choice.`;
      case 'backendStructure':
        return `${basePrompt} backend architecture document including API endpoints, data models, and security considerations.`;
      case 'frontendGuidelines':
        return `${basePrompt} frontend development guidelines including component structure, state management, and UI/UX patterns.`;
      case 'fileStructure':
        return `${basePrompt} file structure document detailing the organization of the codebase.`;
      case 'appFlow':
        return `${basePrompt} application flow document describing the user journey and system interactions.`;
      case 'systemPrompts':
        return `${basePrompt} set of system prompts for AI code generation that align with the project requirements.`;
      default:
        return basePrompt;
    }
  }

  private formatQuestionnaireData(data: QuestionnaireResponse): string {
    return Object.entries(data)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n\n');
  }

  private async saveDocumentsToSupabase(projectId: string, documents: GeneratedDocuments) {
    try {
      const documentEntries = Object.entries(documents).map(([type, content]) => ({
        project_id: projectId,
        document_type: type as DocumentType,
        content: content
      }));

      const { error } = await supabase
        .from('documents')
        .upsert(documentEntries, { onConflict: 'project_id,document_type' });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving documents to Supabase:', error);
      throw error;
    }
  }
}