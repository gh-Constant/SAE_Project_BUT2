import { Request, Response } from 'express';
import { config } from '../config/app.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// GET / - Basic health check
export const getHealth = asyncHandler(async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Hello API',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// GET /api/health - Detailed health check
export const getApiHealth = asyncHandler(async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'API is healthy',
    data: {
      status: 'healthy',
      version: '1.0.0',
      environment: config.nodeEnv,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100,
      },
    },
  });
});

// GET /api/status - Simple status endpoint
export const getStatus = asyncHandler(async (req: Request, res: Response) => {
  res.json({
    success: true,
    status: 'online',
    timestamp: new Date().toISOString(),
  });
});