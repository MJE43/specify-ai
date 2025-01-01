import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { DocumentGeneratorFormValues } from "./types";

interface FormFieldsProps {
  form: UseFormReturn<DocumentGeneratorFormValues>;
}

export const FormFields = ({ form }: FormFieldsProps) => {
  return (
    <>
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
        name="projectDescription"
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
        name="technicalConstraints"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Technical Constraints</FormLabel>
            <FormControl>
              <Textarea
                placeholder="List any technical requirements or limitations..."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Specify any technical constraints or requirements
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};