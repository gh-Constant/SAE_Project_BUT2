/**
 * @file main.ts
 * @description
 * Point d'entree principal de l'application.
 */
import 'dotenv/config';
import { createApp } from './app.js';
import { config } from './config/app.config.js';

const startServer = async (): Promise<void> => {
  try {
    const app = createApp();

    const server = app.listen(config.port, config.host, () => {
      console.log(` Server running on http://${config.host}:${config.port}`);
      console.log(` Environment: ${config.nodeEnv}`);
      console.log(` Started at: ${new Date().toISOString()}`);
    });

    const gracefulShutdown = async (signal: string) => {
      console.log(` ${signal} received, shutting down gracefully...`);
      server.close(() => {
        console.log(' Server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch (error) {
    console.error(' Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
