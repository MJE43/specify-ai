import { DocumentType, GeneratedDocuments, QuestionnaireResponse, GenerationProgress, ProgressCallback } from './types';
import { supabase } from '@/integrations/supabase/client';
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
    questionnaireResponse: QuestionnaireResponse,
    onProgress?: ProgressCallback
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

      const documentTypes = Object.keys(documents) as DocumentType[];
      const totalSteps = documentTypes.length;

      // Generate each document type sequentially
      for (let i = 0; i < documentTypes.length; i++) {
        const documentType = documentTypes[i];
        
        // Update progress
        onProgress?.({
          currentStep: i + 1,
          totalSteps,
          currentDocument: documentType,
          status: 'generating'
        });

        // Generate document with context from previous documents
        const previousDocs = { ...documents };
        documents[documentType] = await this.generateSingleDocument(
          documentType,
          questionnaireResponse,
          previousDocs
        );
      }

      // Save the generated documents to Supabase
      const projectId = questionnaireResponse.projectId as string;
      if (projectId) {
        await this.saveDocumentsToSupabase(projectId, documents);
      }

      // Final progress update
      onProgress?.({
        currentStep: totalSteps,
        totalSteps,
        currentDocument: null,
        status: 'completed'
      });

      return documents;
    } catch (error) {
      console.error('Error generating documents:', error);
      onProgress?.({
        currentStep: 0,
        totalSteps: 0,
        currentDocument: null,
        status: 'error'
      });
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