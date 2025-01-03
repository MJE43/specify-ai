export interface DocumentGeneratorFormValues {
  projectName: string;
  projectDescription: string;
  targetAudience: string;
  keyFeatures: string;
  technicalConstraints: string;
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