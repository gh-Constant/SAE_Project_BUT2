// Load environment variables from .env file
import dotenv from 'dotenv';
import path from 'path';

// Configure dotenv to load from project root
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import { createApp } from './app.js';
import { config } from './config/app.js';
import { databaseService } from './services/databaseService.js';

/**
 * Start the server
 */
const startServer = async (): Promise<void> => {
  try {
    // Initialize database
    console.log('🔧 Initializing database connection...');
    await databaseService.initialize();

    // Create Express application
    const app = createApp();

    // Start server
    const server = app.listen(config.port, config.host, () => {
      console.log(`🚀 Server running on http://${config.host}:${config.port}`);
      console.log(`📱 Environment: ${config.nodeEnv}`);
      console.log(`⏰ Started at: ${new Date().toISOString()}`);
    });

    // Graceful shutdown handling
    const gracefulShutdown = async (signal: string) => {
      console.log(`🛑 ${signal} received, shutting down gracefully...`);

      try {
        // Close database connection
        await databaseService.close();
        console.log('✅ Database connection closed');
      } catch (error) {
        console.error('❌ Error closing database connection:', error);
      }

      // Close server
      server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();
