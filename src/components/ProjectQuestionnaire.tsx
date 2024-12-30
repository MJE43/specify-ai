import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface QuestionnaireData {
  projectName: string;
  projectDescription: string;
  targetAudience: string;
  keyFeatures: string;
  technicalConstraints: string;
}

export const ProjectQuestionnaire = ({ onComplete }: { onComplete: (data: QuestionnaireData) => void }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<QuestionnaireData>({
    projectName: "",
    projectDescription: "",
    targetAudience: "",
    keyFeatures: "",
    technicalConstraints: "",
  });

  const updateField = (field: keyof QuestionnaireData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 5) {
      setStep((prev) => prev + 1);
    } else {
      if (Object.values(formData).some((value) => !value)) {
        toast.error("Please fill in all fields");
        return;
      }
      onComplete(formData);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  return (
    <Card className="w-full max-w-2xl p-6 animate-fadeIn">
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          {[1, 2, 3, 4, 5].map((number) => (
            <div
              key={number}
              className={`h-2 w-full mx-1 rounded ${
                number <= step ? "bg-primary" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-gray-500 text-center">
          Step {step} of 5
        </p>
      </div>

      <div className="space-y-4">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Project Name</h2>
            <p className="text-gray-600">What would you like to call your project?</p>
            <Input
              value={formData.projectName}
              onChange={(e) => updateField("projectName", e.target.value)}
              placeholder="Enter project name"
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Project Description</h2>
            <p className="text-gray-600">Describe your project's main purpose and goals.</p>
            <Textarea
              value={formData.projectDescription}
              onChange={(e) => updateField("projectDescription", e.target.value)}
              placeholder="Enter project description"
              className="min-h-[150px]"
            />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Target Audience</h2>
            <p className="text-gray-600">Who is this project intended for?</p>
            <Textarea
              value={formData.targetAudience}
              onChange={(e) => updateField("targetAudience", e.target.value)}
              placeholder="Describe your target audience"
              className="min-h-[150px]"
            />
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Key Features</h2>
            <p className="text-gray-600">List the main features and functionality you want to include.</p>
            <Textarea
              value={formData.keyFeatures}
              onChange={(e) => updateField("keyFeatures", e.target.value)}
              placeholder="Enter key features (one per line)"
              className="min-h-[150px]"
            />
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Technical Constraints</h2>
            <p className="text-gray-600">Any specific technical requirements or limitations?</p>
            <Textarea
              value={formData.technicalConstraints}
              onChange={(e) => updateField("technicalConstraints", e.target.value)}
              placeholder="Enter technical constraints"
              className="min-h-[150px]"
            />
          </div>
        )}

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
          >
            Back
          </Button>
          <Button onClick={handleNext}>
            {step === 5 ? "Generate Documentation" : "Next"}
          </Button>
        </div>
      </div>
    </Card>
  );
};