import { DocumentType, GeneratedDocuments, QuestionnaireResponse } from './types';
import { supabase } from '@/integrations/supabase/client';

export class DocumentGenerator {
  async generateSingleDocument(
    documentType: DocumentType,
    questionnaireResponse: QuestionnaireResponse,
    previousDocuments: Partial<GeneratedDocuments> = {}
  ): Promise<string> {
    try {
      const { data, error } = await supabase.functions.invoke('generate-documentation', {
        body: { questionnaireData: questionnaireResponse }
      });

      if (error) throw error;
      return data[documentType] || '';
    } catch (error) {
      console.error(`Error generating ${documentType}:`, error);
      throw error;
    }
  }

  async generateAllDocuments(
    questionnaireResponse: QuestionnaireResponse
  ): Promise<GeneratedDocuments> {
    try {
      const { data, error } = await supabase.functions.invoke('generate-documentation', {
        body: { questionnaireData: questionnaireResponse }
      });

      if (error) throw error;
      
      // Save the generated documents to Supabase
      const projectId = questionnaireResponse.projectId as string;
      if (projectId) {
        await this.saveDocumentsToSupabase(projectId, data);
      }

      return data as GeneratedDocuments;
    } catch (error) {
      console.error('Error generating documents:', error);
      throw error;
    }
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