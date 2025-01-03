import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { DocumentGenerator } from '@/lib/documentGenerator';
import { FormFields } from './FormFields';
import { GeneratedContent } from './GeneratedContent';
import { QuestionnaireResponse, GeneratedDocuments } from '@/lib/types';

const formSchema = z.object({
  projectName: z.string().min(2, {
    message: "Project name must be at least 2 characters.",
  }),
  projectDescription: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  targetAudience: z.string().min(5, {
    message: "Target audience must be at least 5 characters.",
  }),
  keyFeatures: z.string().min(10, {
    message: "Key features must be at least 10 characters.",
  }),
  technicalConstraints: z.string().min(10, {
    message: "Technical constraints must be at least 10 characters.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export function DocumentGeneratorForm() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDocs, setGeneratedDocs] = useState<GeneratedDocuments | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: "",
      projectDescription: "",
      targetAudience: "",
      keyFeatures: "",
      technicalConstraints: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsGenerating(true);
    try {
      const documentGenerator = new DocumentGenerator();
      const questionnaireResponse: QuestionnaireResponse = {
        projectName: values.projectName,
        projectDescription: values.projectDescription,
        targetAudience: values.targetAudience,
        keyFeatures: values.keyFeatures,
        technicalConstraints: values.technicalConstraints,
      };
      const documents = await documentGenerator.generateAllDocuments(questionnaireResponse);
      setGeneratedDocs(documents);
      toast({
        title: "Documents Generated Successfully",
        description: "All project documentation has been created.",
      });
    } catch (error) {
      console.error('Error generating documents:', error);
      toast({
        title: "Error",
        description: "Failed to generate documents. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormFields form={form} />
            <Button type="submit" disabled={isGenerating}>
              {isGenerating ? "Generating Documents..." : "Generate Documentation"}
            </Button>
          </form>
        </Form>
      </Card>

      {generatedDocs && <GeneratedContent documents={generatedDocs} />}
    </div>
  );
}