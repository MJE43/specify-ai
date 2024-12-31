import { DocumentType } from './types';

interface PromptTemplate {
  role: string;
  systemPrompt: string;
  formatInstructions: string;
}

const baseFormatInstructions = `
Format your response in clean, well-structured markdown.
Use appropriate headers (##, ###), lists (-, *), and code blocks (\`\`\`) where relevant.
Ensure content is clear, concise, and professionally formatted.
`;

export const documentPrompts: Record<DocumentType, PromptTemplate> = {
  projectRequirements: {
    role: "Product Manager",
    systemPrompt: `As a seasoned Product Manager, analyze the project details and create a comprehensive requirements document.
Focus on user needs, business objectives, and key functionalities.
Include both functional and non-functional requirements.
Consider scalability, performance, and security requirements.`,
    formatInstructions: baseFormatInstructions,
  },
  techStack: {
    role: "Solutions Architect",
    systemPrompt: `As a Solutions Architect, recommend and justify an optimal technology stack for this project.
Consider scalability, maintainability, and modern development practices.
Factor in the team's needs and project constraints.
Include specific versions and explain why each technology is chosen.`,
    formatInstructions: baseFormatInstructions,
  },
  backendStructure: {
    role: "Backend Architect",
    systemPrompt: `As a Backend Architect, design a robust and scalable backend architecture.
Define API endpoints, data models, and security measures.
Consider authentication, authorization, and data validation.
Reference the chosen tech stack in your design decisions.`,
    formatInstructions: baseFormatInstructions,
  },
  frontendGuidelines: {
    role: "Frontend Architect",
    systemPrompt: `As a Frontend Architect, establish comprehensive guidelines for the frontend development.
Detail component structure, state management, and UI/UX patterns.
Consider accessibility, performance, and responsive design.
Align with the chosen tech stack and modern best practices.`,
    formatInstructions: baseFormatInstructions,
  },
  fileStructure: {
    role: "Technical Lead",
    systemPrompt: `As a Technical Lead, create a clear and organized file structure for the project.
Consider separation of concerns and maintainability.
Include naming conventions and organization principles.
Align with the chosen tech stack and architecture decisions.`,
    formatInstructions: baseFormatInstructions,
  },
  appFlow: {
    role: "System Designer",
    systemPrompt: `As a System Designer, document the key application flows and user journeys.
Include user interactions, system responses, and data flow.
Consider error handling and edge cases.
Reference the established architecture and requirements.`,
    formatInstructions: baseFormatInstructions,
  },
  systemPrompts: {
    role: "AI Integration Specialist",
    systemPrompt: `As an AI Integration Specialist, create effective system prompts for AI code generation.
Ensure prompts align with project requirements and architecture.
Include context about chosen technologies and patterns.
Focus on maintainable and scalable code generation.`,
    formatInstructions: baseFormatInstructions,
  },
};