import { useState } from "react";
import { ProjectQuestionnaire } from "@/components/ProjectQuestionnaire";
import { Documentation } from "@/components/Documentation";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface QuestionnaireData {
  projectName: string;
  projectDescription: string;
  targetAudience: string;
  keyFeatures: string;
  technicalConstraints: string;
}

interface DocumentationSections {
  requirements: string;
  backend: string;
  techStack: string;
  frontend: string;
  fileStructure: string;
  appFlow: string;
  systemPrompts: string;
}

const Index = () => {
  const [documentation, setDocumentation] = useState<DocumentationSections | null>(null);
  const [projectName, setProjectName] = useState("");

  const saveDocumentationToSupabase = async (projectName: string, documentation: DocumentationSections) => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .insert([
          { project_name: projectName, documentation }
        ]);

      if (error) throw error;

      toast.success("Documentation saved to Supabase!");
    } catch (error) {
      console.error('Error saving documentation to Supabase:', error);
      toast.error("Failed to save documentation to Supabase.");
    }
  };

  const generateDocumentation = async (data: QuestionnaireData) => {
    // In a real application, this would call an AI service
    // For now, we'll generate some placeholder documentation
    setProjectName(data.projectName);
    
    const mockDocumentation: DocumentationSections = {
      requirements: `Project Goals:\n${data.projectDescription}\n\nTarget Audience:\n${data.targetAudience}\n\nKey Features:\n${data.keyFeatures}\n\nTechnical Constraints:\n${data.technicalConstraints}`,
      backend: "API Endpoints:\n- /api/auth\n- /api/users\n- /api/projects\n\nData Models:\n- User\n- Project\n- Documentation",
      techStack: "Frontend:\n- React\n- TypeScript\n- Tailwind CSS\n\nBackend:\n- Node.js\n- Express\n- PostgreSQL",
      frontend: "Component Structure:\n- Layout\n- Authentication\n- Project Management\n- Documentation Generator",
      fileStructure: "src/\n  components/\n  pages/\n  utils/\n  hooks/\n  types/\n  api/",
      appFlow: "1. User Authentication\n2. Project Creation\n3. Documentation Generation\n4. Export and Integration",
      systemPrompts: "Instructions for AI Code Generation:\n1. Follow the technical specifications\n2. Implement security best practices\n3. Ensure code maintainability",
    };

    toast.success("Documentation generated successfully!");
    setDocumentation(mockDocumentation);

    // Save the generated documentation to Supabase
    await saveDocumentationToSupabase(data.projectName, mockDocumentation);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {!documentation ? (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Project Specification Generator
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Create clear, AI-ready documentation for your web application
              </p>
            </div>
            <div className="flex justify-center">
              <ProjectQuestionnaire onComplete={generateDocumentation} />
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <Documentation projectName={projectName} sections={documentation} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
