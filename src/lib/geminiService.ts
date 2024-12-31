import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { GeminiConfig } from './types';

export class GeminiService {
  private model: any;
  private config: GeminiConfig;

  constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API key not found in environment variables');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    this.model = genAI.getGenerativeModel({ model: "gemini-pro" });

    this.config = {
      temperature: 0.9,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
    };
  }

  async generateText(prompt: string): Promise<string> {
    try {
      const chat = this.model.startChat({
        generationConfig: this.config,
        history: [],
      });

      const result = await chat.sendMessage(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Error generating text with Gemini:', error);
      throw new Error('Failed to generate text with Gemini API');
    }
  }

  // Method to update configuration if needed
  updateConfig(newConfig: Partial<GeminiConfig>) {
    this.config = { ...this.config, ...newConfig };
  }
}