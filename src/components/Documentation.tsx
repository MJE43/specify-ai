import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download } from "lucide-react";

// Update the Documentation component to show generation progress
interface DocumentationProps {
  projectName: string;
  sections: {
    requirements: string;
    backend: string;
    techStack: string;
    frontend: string;
    fileStructure: string;
    appFlow: string;
    systemPrompts: string;
  };
  progress?: GenerationProgress;
}

export const Documentation = ({ projectName, sections, progress }: DocumentationProps) => {
  const handleExport = () => {
    const content = Object.entries(sections)
      .map(([key, value]) => `# ${key.charAt(0).toUpperCase() + key.slice(1)}\n\n${value}`)
      .join("\n\n");

    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${projectName.toLowerCase().replace(/\s+/g, "-")}-documentation.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="w-full max-w-4xl p-6 animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{projectName} Documentation</h1>
        <Button onClick={handleExport} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>

      {progress && progress.status === 'generating' && (
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">
              Generating {progress.currentDocument?.replace(/([A-Z])/g, ' $1').toLowerCase()}...
            </span>
            <span className="text-sm text-gray-600">
              {progress.currentStep} of {progress.totalSteps}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(progress.currentStep / progress.totalSteps) * 100}%` }}
            />
          </div>
        </div>
      )}

      <Tabs defaultValue="requirements" className="w-full">
        <TabsList className="grid grid-cols-7 w-full">
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="backend">Backend</TabsTrigger>
          <TabsTrigger value="techStack">Tech Stack</TabsTrigger>
          <TabsTrigger value="frontend">Frontend</TabsTrigger>
          <TabsTrigger value="fileStructure">Files</TabsTrigger>
          <TabsTrigger value="appFlow">App Flow</TabsTrigger>
          <TabsTrigger value="systemPrompts">Prompts</TabsTrigger>
        </TabsList>

        {Object.entries(sections).map(([key, content]) => (
          <TabsContent key={key} value={key} className="mt-4">
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                {content}
              </pre>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  );
};
