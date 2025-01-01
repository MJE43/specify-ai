export type DocumentType = 
  | 'requirements'
  | 'backend'
  | 'techStack'
  | 'frontend'
  | 'fileStructure'
  | 'appFlow'
  | 'systemPrompts';

export interface QuestionnaireResponse {
  projectName: string;
  projectDescription: string;
  targetAudience: string;
  keyFeatures: string;
  technicalConstraints: string;
}

export interface GenerationProgress {
  currentStep: number;
  totalSteps: number;
  currentDocument: DocumentType | null;
  status: 'idle' | 'generating' | 'completed' | 'error';
}

export interface PromptTemplate {
  systemPrompt: string;
  userPrompt: string;
}

export interface GeneratedDocuments {
  requirements: string;
  backend: string;
  techStack: string;
  frontend: string;
  fileStructure: string;
  appFlow: string;
  systemPrompts: string;
}