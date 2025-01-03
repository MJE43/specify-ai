import { useState } from 'react';
import { z } from 'zod';
import { QuestionnaireResponse } from '@/lib/types';

// Validation schema for the questionnaire
const questionnaireSchema = z.object({
  projectName: z.string().min(2, "Project name is required"),
  projectDescription: z.string().min(10, "Please provide a detailed description"),
  targetAudience: z.string().min(5, "Target audience is required"),
  keyFeatures: z.string().min(10, "Please list key features"),
  technicalConstraints: z.string().optional(),
});

interface UseQuestionnaireReturn {
  currentStep: number;
  totalSteps: number;
  formData: QuestionnaireResponse;
  isValid: boolean;
  errors: Record<string, string>;
  updateField: (field: keyof QuestionnaireResponse, value: string) => void;
  goToNextStep: () => boolean;
  goToPreviousStep: () => void;
  submitQuestionnaire: () => QuestionnaireResponse | null;
  validateCurrentStep: () => boolean;
}

export function useQuestionnaire(): UseQuestionnaireReturn {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<QuestionnaireResponse>({
    projectName: "",
    projectDescription: "",
    targetAudience: "",
    keyFeatures: "",
    technicalConstraints: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalSteps = 5;

  const validateField = (field: keyof QuestionnaireResponse, value: string): string | null => {
    try {
      questionnaireSchema.shape[field].parse(value);
      return null;
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.errors[0].message;
      }
      return "Invalid input";
    }
  };

  const updateField = (field: keyof QuestionnaireResponse, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    const error = validateField(field, value);
    setErrors(prev => ({
      ...prev,
      [field]: error || ""
    }));
  };

  const validateCurrentStep = (): boolean => {
    const fieldsByStep: Record<number, keyof QuestionnaireResponse> = {
      1: "projectName",
      2: "projectDescription",
      3: "targetAudience",
      4: "keyFeatures",
      5: "technicalConstraints",
    };

    const currentField = fieldsByStep[currentStep];
    if (!currentField) return false;

    // Technical constraints (step 5) is optional
    if (currentStep === 5) return true;

    const error = validateField(currentField, formData[currentField]);
    setErrors(prev => ({
      ...prev,
      [currentField]: error || ""
    }));

    return !error;
  };

  const goToNextStep = (): boolean => {
    if (!validateCurrentStep()) return false;
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      return true;
    }
    return false;
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const submitQuestionnaire = (): QuestionnaireResponse | null => {
    try {
      const validatedData = questionnaireSchema.parse(formData);
      return validatedData;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return null;
    }
  };

  const isValid = Object.keys(errors).length === 0;

  return {
    currentStep,
    totalSteps,
    formData,
    isValid,
    errors,
    updateField,
    goToNextStep,
    goToPreviousStep,
    submitQuestionnaire,
    validateCurrentStep,
  };
}