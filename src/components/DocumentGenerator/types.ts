export interface DocumentGeneratorFormValues {
  projectName: string;
  description: string;
  targetAudience: string;
  keyFeatures: string;
  technicalPreferences?: string;
  businessGoals: string;
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