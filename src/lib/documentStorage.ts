import { createClient } from "@supabase/supabase-js"
import { GeneratedDocuments, QuestionnaireResponse } from "./types"

export class DocumentStorage {
  private supabase

  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase environment variables")
    }

    this.supabase = createClient(supabaseUrl, supabaseKey)
  }

  async saveDocuments(
    userId: string,
    questionnaireResponse: QuestionnaireResponse,
    documents: GeneratedDocuments
  ): Promise<void> {
    try {
      // First create a project entry
      const { data: project, error: projectError } = await this.supabase
        .from("projects")
        .insert({
          user_id: userId,
          name: questionnaireResponse.projectName,
          description: questionnaireResponse.projectDescription,
          questionnaire_data: questionnaireResponse,
        })
        .select()
        .single()

      if (projectError) throw projectError

      // Then save each document
      const documentPromises = Object.entries(documents).map(
        ([type, content]) => {
          return this.supabase.from("documents").insert({
            project_id: project.id,
            document_type: type,
            content: content,
          })
        }
      )

      await Promise.all(documentPromises)
    } catch (error) {
      console.error("Error saving documents:", error)
      throw error
    }
  }
}
