import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { errorHandler } from './middlewares/errorHandler';

// Route imports
import travelRoutes from './routes/travelRoutes';
import productRoutes from './routes/productRoutes';
import arbitrageRoutes from './routes/arbitrageRoutes';
import customsRoutes from './routes/customsRoutes';

export function createApp(): Application {
  const app = express();

  // Security Middlewares
  app.use(helmet());
  app.use(
    cors({
      origin: '*', // Allow frontend dev & production
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Rate Limiting: 200 requests per 15 mins per IP
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: { success: false, error: 'Too many requests, please try again later.' },
  });
  app.use('/api/', limiter);

  // Parsing & Logging
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  if (config.nodeEnv !== 'test') {
    app.use(morgan('dev'));
  }

  // Healthcheck
  app.get('/health', (req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      platform: 'Travel & Cross-Border Shopping Arbitrage Platform',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    });
  });

  // Mount API Gateway Modules
  app.use('/api/v1/travel', travelRoutes);
  app.use('/api/v1/products', productRoutes);
  app.use('/api/v1/arbitrage', arbitrageRoutes);
  app.use('/api/v1/customs', customsRoutes);

  // 404 Catch-all
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: `Route not found: ${req.method} ${req.originalUrl}`,
    });
  });

  // Centralized Error Handling Middleware
  app.use(errorHandler);

  return app;
}
