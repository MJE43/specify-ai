import { useState, useCallback } from "react";
import { DocumentGenerator } from "@/lib/documentGenerator";
import {
  DocumentType,
  GeneratedDocuments,
  GenerationProgress,
  QuestionnaireResponse,
} from "@/lib/types";
import { toast } from "sonner";

interface UseDocumentGenerationReturn {
  documents: GeneratedDocuments | null;
  isGenerating: boolean;
  progress: GenerationProgress;
  generateDocuments: (data: QuestionnaireResponse) => Promise<void>;
  error: Error | null;
  reset: () => void;
}

export function useDocumentGeneration(): UseDocumentGenerationReturn {
  const [documents, setDocuments] = useState<GeneratedDocuments | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [progress, setProgress] = useState<GenerationProgress>({
    currentStep: 0,
    totalSteps: 7,
    currentDocument: null,
    status: "idle",
  });

  const reset = useCallback(() => {
    setDocuments(null);
    setIsGenerating(false);
    setError(null);
    setProgress({
      currentStep: 0,
      totalSteps: 7,
      currentDocument: null,
      status: "idle",
    });
  }, []);

  const generateDocuments = useCallback(async (data: QuestionnaireResponse) => {
    setIsGenerating(true);
    setError(null);
    setProgress({
      currentStep: 0,
      totalSteps: 7,
      currentDocument: "projectRequirements",
      status: "generating",
    });

    const documentLabels: Record<DocumentType, string> = {
      projectRequirements: "Project Requirements",
      backendStructure: "Backend Structure",
      techStack: "Technology Stack",
      frontendGuidelines: "Frontend Guidelines",
      fileStructure: "File Structure",
      appFlow: "Application Flow",
      systemPrompts: "System Prompts",
    };

    try {
      const generator = new DocumentGenerator();

      let startTime = Date.now();
      const timeouts: Record<string, NodeJS.Timeout> = {};

      const documents = await generator.generateAllDocuments(
        data,
        (progress) => {
          setProgress(progress);

          // Clear previous timeout if exists
          if (progress.currentDocument && timeouts[progress.currentDocument]) {
            clearTimeout(timeouts[progress.currentDocument]);
          }

          // Reset start time for new document
          if (progress.currentDocument !== progress.currentDocument) {
            startTime = Date.now();
          }

          // Set timeout for current document generation
          if (progress.currentDocument) {
            timeouts[progress.currentDocument] = setTimeout(() => {
              toast.warning(`Generation taking longer than expected`, {
                description: `Still working on ${documentLabels[progress.currentDocument!]}...`,
              });
            }, 30000); // Show warning after 30 seconds
          }
        },
      );

      // Clear all timeouts
      Object.values(timeouts).forEach(clearTimeout);

      setDocuments(documents);
      setProgress((prev) => ({
        ...prev,
        status: "completed",
      }));

      toast.success("Documentation generated successfully!", {
        description: "Your project documentation is ready.",
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(err instanceof Error ? err : new Error(errorMessage));

      setProgress((prev) => ({
        ...prev,
        status: "error",
      }));

      toast.error("Failed to generate documentation", {
        description: errorMessage,
      });

      // Throw error for parent components to handle if needed
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return {
    documents,
    isGenerating,
    progress,
    generateDocuments,
    error,
    reset,
  };
}
