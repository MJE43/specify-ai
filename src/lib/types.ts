export type DocumentType = 
  | 'projectRequirements'
  | 'techStack'
  | 'backendStructure'
  | 'frontendGuidelines'
  | 'fileStructure'
  | 'appFlow'
  | 'systemPrompts';

export interface GeneratedDocuments {
  projectRequirements: string;
  techStack: string;
  backendStructure: string;
  frontendGuidelines: string;
  fileStructure: string;
  appFlow: string;
  systemPrompts: string;
}

export interface GeminiConfig {
  temperature: number;
  topP: number;
  topK: number;
  maxOutputTokens: number;
}

export interface PromptTemplate {
  systemPrompt: string;
  userPrompt: string;
}

export interface QuestionnaireResponse {
  [key: string]: string | number | boolean | object;
}
