import { GoogleGenerativeAI } from '@google/generative-ai';
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
    this.model = genAI.getGenerativeModel({ 
      model: "gemini-pro",
      systemInstruction: "You are a senior technical product manager creating a software requirements document.\nFormat your response in markdown.\n\nYour task is to analyze questionnaire responses and create a comprehensive project requirements document.\n\nInclude these sections:\n1. Project Overview\n   - Core purpose and objectives\n   - Target users and use cases\n   - Key features and functionalities\n\n2. Functional Requirements\n   - User flows and interactions\n   - Feature specifications\n   - Business logic and rules\n   - Data management requirements\n\n3. Technical Requirements\n   - Performance expectations\n   - Security requirements\n   - Integration needs\n   - Scalability considerations\n\n4. MVP Definition\n   - Core features vs future enhancements\n   - Launch requirements\n   - Success criteria\n\nFocus on clarity and actionable specifications that will guide development. Use specific examples where helpful.",
    });

    this.config = {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
    };
  }

  async generateText(systemPrompt: string, userPrompt: string): Promise<string> {
    try {
      const chatSession = this.model.startChat({
        generationConfig: this.config,
        history: [
          {
            role: "user",
            parts: [{ text: systemPrompt }]
          }
        ],
      });

      const result = await chatSession.sendMessage(userPrompt);
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