import { GoogleGenerativeAI } from '@google/generative-ai';
import { GeminiConfig } from './types';

export class GeminiService {
  private model;
  private config: GeminiConfig;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('Gemini API key is required');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    };

    this.model = genAI.getGenerativeModel({ 
      model: "gemini-pro",
      generationConfig,
    });

    this.config = {
      ...generationConfig,
      candidateCount: 1,
      stopSequences: [],
    };
  }

  async generateText(prompt: string): Promise<string> {
    try {
      const result = await this.model.generateText(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Error generating text with Gemini:', error);
      throw new Error('Failed to generate text');
    }
  }
}