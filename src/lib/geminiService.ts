import {
  GoogleGenerativeAI,
  GenerativeModel,
  GenerationConfig,
  ChatSession,
  StreamGenerateContentResponse,
} from "@google/generative-ai";
import { DocumentType } from "./types";
import { systemPrompts } from "../data/prompts";

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private generationConfig: GenerationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "Gemini API key is required. Set VITE_GEMINI_API_KEY in your .env file.",
      );
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generateDocument(
    documentType: DocumentType,
    userContext: string,
    onStream?: (chunk: string) => void,
  ): Promise<string> {
    try {
      const { instruction, template } = systemPrompts[documentType];

      // Initialize model with system instruction
      const model = this.genAI.getGenerativeModel({
        model: "gemini-2.0-flash-exp",
        systemInstruction: instruction,
      });

      // Prepare user message
      const userMessage = `${template}\n\n${userContext}`;

      // Start chat session
      const chat: ChatSession = model.startChat({
        generationConfig: this.generationConfig,
        history: [
          {
            role: "user",
            parts: [{ text: userMessage }],
          },
        ],
      });

      try {
        if (onStream) {
          return await this.handleStreamingResponse(chat, onStream);
        } else {
          return await this.handleNormalResponse(chat);
        }
      } catch (error) {
        throw this.handleGeminiError(error);
      }
    } catch (error) {
      throw this.handleGeminiError(error);
    }
  }

  private async handleStreamingResponse(
    chat: ChatSession,
    onStream: (chunk: string) => void,
  ): Promise<string> {
    const result = await chat.sendMessageStream(
      "Generate the document based on the provided context.",
    );
    let fullText = "";

    try {
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullText += chunkText;
        onStream(chunkText);
      }
      return fullText;
    } catch (error) {
      throw this.handleGeminiError(error);
    }
  }

  private async handleNormalResponse(chat: ChatSession): Promise<string> {
    const result = await chat.sendMessage(
      "Generate the document based on the provided context.",
    );
    const text = result.response.text();

    if (!text) {
      throw new Error("Empty response from Gemini API");
    }

    return text;
  }

  private handleGeminiError(error: any): Error {
    console.error("Gemini API error:", error);

    // Handle rate limiting
    if (error?.response?.status === 429) {
      return new Error("Rate limit exceeded. Please try again later.");
    }

    // Handle quota exceeded
    if (error?.response?.status === 403) {
      return new Error("API quota exceeded. Please try again later.");
    }

    // Handle invalid requests
    if (error?.response?.status === 400) {
      return new Error(
        "Invalid request to Gemini API. Please check your inputs.",
      );
    }

    // Handle other API errors
    if (error?.response?.status) {
      return new Error(
        `Gemini API error (${error.response.status}): ${error.message}`,
      );
    }

    // Handle network or other errors
    const message = error?.message || "Unknown error occurred";
    return new Error(`Gemini API error: ${message}`);
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
