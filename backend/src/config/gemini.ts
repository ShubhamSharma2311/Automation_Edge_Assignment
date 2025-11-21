import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getGeminiModel = () => {
  // Using gemini-2.5-flash - stable, fast, supports up to 1M tokens
  // You can override this by setting GEMINI_MODEL in your .env file
  const modelName = process.env.GEMINI_MODEL || 'models/gemini-2.5-flash';
  console.log(`Using Gemini model: ${modelName}`);
  return genAI.getGenerativeModel({ model: modelName });
};

export default genAI;
