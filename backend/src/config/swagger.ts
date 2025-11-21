import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './env';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Code Generation Copilot API',
      version: '1.0.0',
      description: 'API for AI-powered code generation using Google Gemini AI with user authentication',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.port}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token',
          description: 'JWT token stored in HTTP-only cookie',
        },
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token in Authorization header (fallback)',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            name: { type: 'string', example: 'John Doe' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Language: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Python' },
            code: { type: 'string', example: 'python' },
          },
        },
        Generation: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            prompt: { type: 'string', example: 'Create a function to reverse a string' },
            language: { type: 'string', example: 'python' },
            code: { type: 'string', example: 'def reverse_string(s):\n    return s[::-1]' },
            timestamp: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Bad Request' },
            message: { type: 'string', example: 'Invalid input' },
          },
        },
      },
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication endpoints (signup, login, logout)',
      },
      {
        name: 'Languages',
        description: 'Available programming languages',
      },
      {
        name: 'Code Generation',
        description: 'AI-powered code generation and history',
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Path to the API routes
};

export const swaggerSpec = swaggerJsdoc(options);
