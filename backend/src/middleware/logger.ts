import { Request, Response, NextFunction } from 'express';
import { config } from '../config/app.js';

// Request logging middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  if (config.isDevelopment) {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.originalUrl;
    const userAgent = req.get('User-Agent') || 'Unknown';
    
    console.log(`🌐 ${timestamp} | ${method} ${url} | ${userAgent}`);
    
    // Log request body for POST/PUT/PATCH requests (be careful with sensitive data)
    if (['POST', 'PUT', 'PATCH'].includes(method) && req.body) {
      console.log('📝 Request Body:', JSON.stringify(req.body, null, 2));
    }
  }
  
  next();
};

// Response time logging
export const responseTimeLogger = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    if (config.isDevelopment) {
      const duration = Date.now() - startTime;
      const statusCode = res.statusCode;
      const statusEmoji = statusCode >= 400 ? '❌' : statusCode >= 300 ? '⚠️' : '✅';
      
      console.log(`${statusEmoji} ${req.method} ${req.originalUrl} | ${statusCode} | ${duration}ms`);
    }
  });
  
  next();
};