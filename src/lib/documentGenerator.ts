import { DocumentType, GeneratedDocuments, QuestionnaireResponse } from './types';
import { documentPrompts } from '../data/prompts';
import { supabase } from '@/lib/supabase';

export class DocumentGenerator {
  async generateSingleDocument(
    documentType: DocumentType,
    questionnaireResponse: QuestionnaireResponse,
    previousDocuments: Partial<GeneratedDocuments> = {}
  ): Promise<string> {
    const prompt = documentPrompts[documentType];
    if (!prompt) {
      throw new Error(`No prompt template found for document type: ${documentType}`);
    }

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
      return data as GeneratedDocuments;
    } catch (error) {
      console.error('Error generating documents:', error);
      throw error;
    }
  }
}