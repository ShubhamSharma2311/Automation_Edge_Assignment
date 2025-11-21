import { getGeminiModel } from '../config/gemini';

export class GeminiService {
  private model;

  constructor() {
    this.model = getGeminiModel();
  }

  async generateCode(prompt: string, language: string): Promise<string> {
    try {
      const enhancedPrompt = `You are an expert programmer. Generate clean, well-commented ${language} code for the following request. Only return the code without any explanations or markdown formatting:\n\n${prompt}`;

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
    } catch (error) {
      console.error('Error generating code with Gemini:', error);
      throw new Error('Failed to generate code. Please try again.');
    }
  }
}

export default new GeminiService();
