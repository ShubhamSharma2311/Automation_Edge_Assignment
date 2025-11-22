import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { config } from './config/env';
import { swaggerSpec } from './config/swagger';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';

const app: Application = express();

// CORS Configuration
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps, Postman)
    if (!origin) {
      return callback(null, true);
    }

    // List of allowed origins for local development
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:5000',
    ];

    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Allow all Vercel preview and production deployments
    if (origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }

    // Check if config allows all origins
    if (config.corsOrigin === '*') {
      return callback(null, true);
    }

    // If none of the above, block the request
    console.log('CORS blocked origin:', origin);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Set-Cookie'],
  optionsSuccessStatus: 204,
};

// Middleware
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Code Generation API Docs',
}));

// Routes
app.use(routes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    app.listen(config.port, () => {
      console.log(`🚀 Server is running on port ${config.port}`);
      console.log(`📝 Environment: ${config.nodeEnv}`);
      console.log(`🌐 CORS enabled for: ${config.corsOrigin}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
