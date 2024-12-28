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

  async generateText(systemPrompt: string, userPrompt: string): Promise<string> {
    try {
      const chat = this.model.startChat({
        generationConfig: this.config,
        history: [],
      });

      // First, set the context with the system prompt
      await chat.sendMessage(systemPrompt);

      // Then send the user's prompt and get the response
      const result = await chat.sendMessage(userPrompt);
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
