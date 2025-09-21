import express, { Application } from 'express';
import cors from 'cors';
import { corsOptions, config } from './config/app.js';
import { requestLogger, responseTimeLogger } from './middleware/logger.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import routes from './routes/index.js';

/**
 * Create and configure Express application
 * @returns {Application} Configured Express app
 */
export const createApp = (): Application => {
  const app: Application = express();

  // Security & CORS middleware
  app.use(cors(corsOptions));
  
  // Request parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  
  // Development logging middleware
  if (config.isDevelopment) {
    app.use(requestLogger);
    app.use(responseTimeLogger);
  }

  // Health check endpoint (before routes)
  app.get('/ping', (req, res) => {
    res.json({ 
      success: true, 
      message: 'pong',
      timestamp: new Date().toISOString()
    });
  });

  // Main application routes
  app.use('/', routes);

  // 404 handler (must be after all routes)
  app.use(notFoundHandler);

  // Error handler (must be last middleware)
  app.use(errorHandler);

  return app;
};

export default createApp;