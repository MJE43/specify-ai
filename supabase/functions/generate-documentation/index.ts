import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
if (!geminiApiKey) {
  throw new Error('Missing Gemini API key');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { questionnaireData } = await req.json();
    
    // Format the questionnaire data for the prompt
    const formattedInput = Object.entries(questionnaireData)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n\n');

    const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${geminiApiKey}`,
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `As a senior solutions architect, analyze this project description and generate comprehensive documentation:

${formattedInput}

Generate the following sections:
1. Project Requirements
2. Technical Stack Recommendations
3. Backend Architecture
4. Frontend Guidelines
5. File Structure
6. Application Flow
7. System Prompts for AI Code Generation`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        },
      }),
    });

    const result = await response.json();
    console.log('Gemini API Response:', result);

    if (!result.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response from Gemini API');
    }

    const generatedText = result.candidates[0].content.parts[0].text;
    
    // Parse the generated text into sections
    const sections = {
      projectRequirements: '',
      techStack: '',
      backendStructure: '',
      frontendGuidelines: '',
      fileStructure: '',
      appFlow: '',
      systemPrompts: '',
    };

    let currentSection = '';
    const lines = generatedText.split('\n');
    
    for (const line of lines) {
      if (line.includes('Project Requirements')) {
        currentSection = 'projectRequirements';
      } else if (line.includes('Technical Stack')) {
        currentSection = 'techStack';
      } else if (line.includes('Backend Architecture')) {
        currentSection = 'backendStructure';
      } else if (line.includes('Frontend Guidelines')) {
        currentSection = 'frontendGuidelines';
      } else if (line.includes('File Structure')) {
        currentSection = 'fileStructure';
      } else if (line.includes('Application Flow')) {
        currentSection = 'appFlow';
      } else if (line.includes('System Prompts')) {
        currentSection = 'systemPrompts';
      } else if (currentSection) {
        sections[currentSection] += line + '\n';
      }
    }

    return new Response(JSON.stringify(sections), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating documentation:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});