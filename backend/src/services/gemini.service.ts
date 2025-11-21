import { getGeminiModel } from '../config/gemini';

export class GeminiService {
  private model;

  constructor() {
    this.model = getGeminiModel();
  }

  async generateCode(prompt: string, language: string): Promise<string> {
    try {
      const enhancedPrompt = `You are an expert programmer. Generate CONCISE, CLEAN ${language} code for the following request.

IMPORTANT RULES:
- Keep the code SHORT and SIMPLE - avoid over-engineering
- Add ONLY essential comments (1-2 lines max) - NO lengthy explanations
- NO repetitive overloads or unnecessary template variations
- Focus on the MOST PRACTICAL and COMMONLY USED implementation
- Return ONLY the code - NO markdown, NO explanations outside the code
- If multiple approaches exist, choose the SIMPLEST one

Request: ${prompt}`;

      const result = await this.model.generateContent(enhancedPrompt);
      const response = result.response;
      const generatedCode = response.text();

      // Clean up the response - remove markdown code blocks if present
      let cleanedCode = generatedCode.trim();
      
      // Remove markdown code blocks
      if (cleanedCode.startsWith('```')) {
        cleanedCode = cleanedCode.replace(/^```[\w]*\n/, '').replace(/\n```$/, '');
      }

      return cleanedCode.trim();
    } catch (error: any) {
      console.error('Error generating code with Gemini:', error);
      console.error('Error status:', error.status);
      console.error('Error message:', error.message);
      
      // Check if it's a rate limit error
      if (error.status === 429) {
        const retryAfter = error.errorDetails?.find((detail: any) => 
          detail['@type'] === 'type.googleapis.com/google.rpc.RetryInfo'
        )?.retryDelay;
        
        throw new Error(
          `Rate limit exceeded. Please try again after ${retryAfter || 'a few moments'}. ` +
          'Consider upgrading your API key quota at https://ai.google.dev/pricing'
        );
      }
      
      // Check if it's a 404 error (model not found)
      if (error.status === 404) {
        throw new Error(
          `Model not found. The model 'gemini-1.5-flash-latest' may not be available. ` +
          'Please check your API key or try a different model.'
        );
      }
      
      // Check if it's an authentication error
      if (error.status === 401 || error.status === 403) {
        throw new Error(
          'Authentication failed. Please check your GEMINI_API_KEY in the .env file.'
        );
      }
      
      // Return more detailed error for debugging
      throw new Error(`Failed to generate code: ${error.message || 'Unknown error'}`);
    }
  }
}

export default new GeminiService();
