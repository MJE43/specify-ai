// Document Types
export type DocumentType = 
  | 'projectRequirements'
  | 'backendStructure' 
  | 'techStack'
  | 'frontendGuidelines'
  | 'fileStructure'
  | 'appFlow'
  | 'systemPrompts';

// User Input Types
export interface QuestionnaireResponse {
  projectName: string;
  projectDescription: string;
  targetAudience: string;
  keyFeatures: string;
  technicalConstraints: string;
  businessGoals?: string;
  securityRequirements?: string;
  scalabilityNeeds?: string;
  budget?: string;
  timeline?: string;
}

// Generation Progress Types
export interface GenerationProgress {
  currentStep: number;
  totalSteps: number;
  currentDocument: DocumentType | null;
  status: GenerationStatus;
  error?: string;
}

export type GenerationStatus = 'idle' | 'generating' | 'completed' | 'error';

// Document Generation Types
export interface GeneratedDocuments {
  projectRequirements: string;
  backendStructure: string;
  techStack: string;
  frontendGuidelines: string;
  fileStructure: string;
  appFlow: string;
  systemPrompts: string;
}

// Progress Callback Types
export type ProgressCallback = (progress: GenerationProgress) => void;
export type StreamCallback = (documentType: DocumentType, chunk: string) => void;

// Prompt Types
export interface SystemPrompt {
  instruction: string;   // System instruction for model initialization
  template: string;      // Template for forming the user message
  validationRules?: {   // Optional validation rules specific to this document type
    requiredKeywords: string[];
    minLength: number;
    customValidation?: (content: string) => boolean;
  };
}

// Error Types
export interface GenerationError extends Error {
  documentType?: DocumentType;
  retryCount?: number;
  context?: string;
}

// Storage Types
export interface StorageResult {
  projectId: string;
  documents: GeneratedDocuments;
  timestamp: Date;
}

// Generation Options
export interface GenerationOptions {
  maxRetries?: number;
  delayBetweenRetries?: number;
  delayBetweenDocuments?: number;
  validateContent?: boolean;
  streamResponse?: boolean;
  saveToStorage?: boolean;
}

// Validation Types
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Context Building Types
export interface DocumentContext {
  questionnaire: QuestionnaireResponse;
  previousDocuments: Partial<GeneratedDocuments>;
  generationOptions?: GenerationOptions;
}