"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { motion } from "framer-motion"
import { HelpCircle } from 'lucide-react'
import { useState } from "react"
import { toast } from "sonner"

interface QuestionnaireData {
  projectName: string
  projectDescription: string
  targetAudience: string
  keyFeatures: string
  technicalConstraints: string
}

const steps = [
  {
    title: "Project Name",
    description: "What would you like to call your project?",
    field: "projectName" as const,
    placeholder: "e.g. EcommerceX, TaskMaster, FitnessApp",
    help: "Choose a name that reflects your project's purpose and is easy to remember",
  },
  {
    title: "Project Description",
    description: "Describe your project's main purpose and goals.",
    field: "projectDescription" as const,
    placeholder: "e.g. A modern e-commerce platform focused on sustainable products...",
    help: "Include the main problem your project solves and its primary objectives",
  },
  {
    title: "Target Audience",
    description: "Who is this project intended for?",
    field: "targetAudience" as const,
    placeholder: "e.g. Small business owners, fitness enthusiasts, remote workers...",
    help: "Be specific about your target users' demographics and needs",
  },
  {
    title: "Key Features",
    description: "List the main features and functionality you want to include.",
    field: "keyFeatures" as const,
    placeholder: "- User authentication\n- Product catalog\n- Shopping cart\n- Order management",
    help: "List one feature per line, focusing on core functionality first",
  },
  {
    title: "Technical Constraints",
    description: "Any specific technical requirements or limitations?",
    field: "technicalConstraints" as const,
    placeholder: "e.g. Must work offline, support mobile devices, integrate with specific APIs...",
    help: "Include any technical requirements that might affect development",
  },
]

export function ProjectQuestionnaire({ onComplete }: { onComplete: (data: QuestionnaireData) => void }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<QuestionnaireData>({
    projectName: "",
    projectDescription: "",
    targetAudience: "",
    keyFeatures: "",
    technicalConstraints: "",
  })

  const currentStep = steps[step - 1]

  const updateField = (field: keyof QuestionnaireData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (!formData[currentStep.field]) {
      toast.error("Please fill in the required field")
      return
    }

    if (step < 5) {
      setStep((prev) => prev + 1)
    } else {
      if (Object.values(formData).some((value) => !value)) {
        toast.error("Please fill in all fields")
        return
      }
      onComplete(formData)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-3xl font-bold tracking-tight">
          Create Your Project Spec
        </CardTitle>
        <CardDescription className="text-lg">
          Step {step} of {steps.length}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-8">
        <div className="mb-8">
          <div className="relative">
            <div className="absolute top-2 left-0 w-full h-2 bg-secondary rounded-full">
              <motion.div
                className="absolute top-0 left-0 h-full bg-primary rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${(step / steps.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="relative flex justify-between">
              {steps.map((_, index) => (
                <motion.div
                  key={index}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                    index + 1 <= step
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-secondary bg-background text-muted-foreground"
                  }`}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: index + 1 === step ? 1 : 0.8 }}
                >
                  {index + 1}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-semibold tracking-tight">{currentStep.title}</h2>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-5 w-5 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">{currentStep.help}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-muted-foreground">{currentStep.description}</p>
          </div>

          {currentStep.field === "projectName" ? (
            <Input
              value={formData[currentStep.field]}
              onChange={(e) => updateField(currentStep.field, e.target.value)}
              placeholder={currentStep.placeholder}
              className="text-lg"
            />
          ) : (
            <Textarea
              value={formData[currentStep.field]}
              onChange={(e) => updateField(currentStep.field, e.target.value)}
              placeholder={currentStep.placeholder}
              className="min-h-[200px] text-lg leading-relaxed"
            />
          )}

          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
              size="lg"
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              size="lg"
              className="min-w-[120px]"
            >
              {step === 5 ? "Generate" : "Continue"}
            </Button>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  )
}
