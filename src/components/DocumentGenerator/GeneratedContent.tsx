import { Card } from "@/components/ui/card";
import { GeneratedDocuments } from "./types";

interface GeneratedContentProps {
  documents: GeneratedDocuments;
}

export const GeneratedContent = ({ documents }: GeneratedContentProps) => {
  return (
    <Card className="mt-8 p-6">
      <h2 className="text-2xl font-bold mb-4">Generated Documentation</h2>
      {Object.entries(documents).map(([key, value]) => (
        <div key={key} className="mb-6">
          <h3 className="text-xl font-semibold mb-2 capitalize">
            {key.replace(/([A-Z])/g, ' $1').trim()}
          </h3>
          <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded">
            {value}
          </pre>
        </div>
      ))}
    </Card>
  );
};