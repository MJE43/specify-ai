import { ProjectQuestionnaire } from "@/components/ProjectQuestionnaire";
import { Documentation } from "@/components/Documentation";
import { useDocumentGeneration } from "@/hooks/useDocumentGeneration";
import { QuestionnaireResponse, DocumentType } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

const Index = () => {
  const { documents, isGenerating, progress, generateDocuments, error, reset } =
    useDocumentGeneration();

  const documentLabels: Record<DocumentType, string> = {
    projectRequirements: "Project Requirements",
    backendStructure: "Backend Structure",
    techStack: "Technology Stack",
    frontendGuidelines: "Frontend Guidelines",
    fileStructure: "File Structure",
    appFlow: "Application Flow",
    systemPrompts: "System Prompts",
  };

  const handleQuestionnaireSubmit = async (data: QuestionnaireResponse) => {
    try {
      await generateDocuments(data);
    } catch (error) {
      // Error is handled by the hook, but we could add additional handling here
      console.error("Error in questionnaire submission:", error);
    }
  };

  const GenerationStatus = () => (
    <Card className="w-full max-w-4xl p-6">
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              Generating project documentation
            </span>
            <span className="font-medium">
              {Math.round((progress.currentStep / progress.totalSteps) * 100)}%
            </span>
          </div>
          <Progress
            value={(progress.currentStep / progress.totalSteps) * 100}
            className="h-2"
          />
        </div>

        {progress.currentDocument && (
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-primary mb-2">
                {documentLabels[progress.currentDocument]}
              </h3>
              <p className="text-sm text-muted-foreground">
                Generating detailed documentation for your{" "}
                {progress.currentDocument
                  .replace(/([A-Z])/g, " $1")
                  .toLowerCase()}
                ...
              </p>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Step {progress.currentStep} of {progress.totalSteps}
            </p>
          </div>
        )}
      </div>
    </Card>
  );

  const ErrorState = () => (
    <Card className="w-full max-w-4xl p-6">
      <div className="text-center space-y-4">
        <h3 className="text-lg font-medium text-destructive">
          Generation Failed
        </h3>
        <p className="text-muted-foreground">
          {error?.message || "Failed to generate documentation"}
        </p>
        <Button variant="outline" onClick={reset} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto py-12 px-4 md:px-6">
        {!documents && !isGenerating && !error && (
          <div className="space-y-8">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Project Specification Generator
              </h1>
              <p className="text-xl text-gray-600">
                Transform your project idea into clear, AI-ready documentation
              </p>
              <p className="mt-4 text-muted-foreground">
                Our AI will help create comprehensive documentation that can be
                used to build your application
              </p>
            </div>

            <div className="flex justify-center">
              <ProjectQuestionnaire onComplete={handleQuestionnaireSubmit} />
            </div>
          </div>
        )}

        {isGenerating && (
          <div className="flex flex-col items-center space-y-8">
            <div className="text-center max-w-2xl mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Generating Your Documentation
              </h2>
              <p className="text-muted-foreground">
                Please wait while we create detailed documentation for your
                project
              </p>
            </div>
            <GenerationStatus />
          </div>
        )}

        {error && !isGenerating && (
          <div className="flex flex-col items-center space-y-8">
            <ErrorState />
          </div>
        )}

        {documents && !isGenerating && !error && (
          <div className="flex justify-center">
            <Documentation
              projectName={documents.projectName}
              sections={documents}
              progress={progress}
            />
          </div>
        )}
      </div>

      {/* Add a footer with some helpful information */}
      <footer className="py-6 text-center text-sm text-muted-foreground border-t bg-muted/20 mt-12">
        <div className="container mx-auto px-4">
          <p>
            This documentation will help AI code generators understand and build
            your application. Need help?{" "}
            <a href="/support" className="text-primary hover:underline">
              Contact Support
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
