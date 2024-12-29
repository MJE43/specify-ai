"use client"

import { Documentation } from "@/components/Documentation"
import { ProjectQuestionnaire } from "@/components/ProjectQuestionnaire"
import { motion } from "framer-motion"
import { Sparkles } from 'lucide-react'
import { useState } from "react"
import { toast } from "sonner"

interface QuestionnaireData {
  projectName: string
  projectDescription: string
  targetAudience: string
  keyFeatures: string
  technicalConstraints: string
}

interface DocumentationSections {
  requirements: string
  backend: string
  techStack: string
  frontend: string
  fileStructure: string
  appFlow: string
  systemPrompts: string
}

export default function Page() {
  const [documentation, setDocumentation] = useState<DocumentationSections | null>(null)
  const [projectName, setProjectName] = useState("")

  const generateDocumentation = async (data: QuestionnaireData) => {
    setProjectName(data.projectName)

    const mockDocumentation: DocumentationSections = {
      requirements: `Project Goals:\n${data.projectDescription}\n\nTarget Audience:\n${data.targetAudience}\n\nKey Features:\n${data.keyFeatures}\n\nTechnical Constraints:\n${data.technicalConstraints}`,
      backend: "API Endpoints:\n- /api/auth\n- /api/users\n- /api/projects\n\nData Models:\n- User\n- Project\n- Documentation",
      techStack: "Frontend:\n- React\n- TypeScript\n- Tailwind CSS\n\nBackend:\n- Node.js\n- Express\n- PostgreSQL",
      frontend: "Component Structure:\n- Layout\n- Authentication\n- Project Management\n- Documentation Generator",
      fileStructure: "src/\n  components/\n  pages/\n  utils/\n  hooks/\n  types/\n  api/",
      appFlow: "1. User Authentication\n2. Project Creation\n3. Documentation Generation\n4. Export and Integration",
      systemPrompts: "Instructions for AI Code Generation:\n1. Follow the technical specifications\n2. Implement security best practices\n3. Ensure code maintainability",
    }

    toast.success("Documentation generated successfully!")
    setDocumentation(mockDocumentation)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {!documentation ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">AI-Powered Documentation</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-50 tracking-tight">
                Project Specification Generator
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Create clear, AI-ready documentation for your web application in minutes
              </p>
            </div>
            <div className="flex justify-center">
              <ProjectQuestionnaire onComplete={generateDocumentation} />
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-center"
          >
            <Documentation projectName={projectName} sections={documentation} />
          </motion.div>
        )}
      </div>
    </div>
  )
}
