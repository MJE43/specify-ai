import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('Missing Gemini API key');
    }

    const { questionnaireData } = await req.json();
    
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const systemPrompt = `As a senior technical documentation specialist, analyze this project description and generate comprehensive documentation sections. Be detailed and professional.`;

    const formattedInput = Object.entries(questionnaireData)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n\n');

    const prompt = `${systemPrompt}\n\nProject Details:\n${formattedInput}\n\nGenerate the following sections:\n1. Project Requirements\n2. Technical Stack\n3. Backend Architecture\n4. Frontend Guidelines\n5. File Structure\n6. Application Flow\n7. System Prompts`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

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
    const lines = text.split('\n');
    
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

    console.log('Generated documentation sections:', Object.keys(sections));

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