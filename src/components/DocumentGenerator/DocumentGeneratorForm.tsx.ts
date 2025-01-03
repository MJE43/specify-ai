import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { DocumentGenerator } from '@/lib/documentGenerator';
import { GeneratedDocuments } from '@/lib/types';
import GeneratedDocumentDisplay from './GeneratedDocumentDisplay';

const formSchema = z.object({
  projectName: z.string().min(2, {
    message: "Project name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  targetAudience: z.string().min(5, {
    message: "Target audience must be at least 5 characters.",
  }),
  keyFeatures: z.string().min(10, {
    message: "Key features must be at least 10 characters.",
  }),
  technicalPreferences: z.string().optional(),
  businessGoals: z.string().min(10, {
    message: "Business goals must be at least 10 characters.",
  }),
});

interface DocumentGeneratorFormProps {
  documentGenerator?: DocumentGenerator;
}

export function DocumentGeneratorForm({ documentGenerator = new DocumentGenerator() }: DocumentGeneratorFormProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDocs, setGeneratedDocs] = useState<GeneratedDocuments | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: "",
      description: "",
      targetAudience: "",
      keyFeatures: "",
      technicalPreferences: "",
      businessGoals: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true);
    try {
      const documents = await documentGenerator.generateAllDocuments(values);
      setGeneratedDocs(documents);
      toast({
        title: "Documents Generated Successfully",
        description: `Documentation for project "${values.projectName}" has been created.`,
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
            <FormField
              control={form.control}
              name="projectName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Amazing App" {...field} />
                  </FormControl>
                  <FormDescription>
                    The name of your web application project
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your project in detail..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a detailed description of what your application will do
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="targetAudience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Audience</FormLabel>
                  <FormControl>
                    <Input placeholder="Who will use your application?" {...field} />
                  </FormControl>
                  <FormDescription>
                    Describe your target users
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="keyFeatures"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Key Features</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="List the main features of your application..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    List the main features and functionality
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="technicalPreferences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Technical Preferences (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any specific technical requirements or preferences..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Any specific technologies or approaches you'd like to use
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="businessGoals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Goals</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What are your business objectives..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Describe your business objectives and success metrics
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isGenerating}>
              {isGenerating ? "Generating Documents..." : "Generate Documentation"}
            </Button>
          </form>
        </Form>
      </Card>

      {generatedDocs && <GeneratedDocumentDisplay documents={generatedDocs} />}
    </div>
  );
}