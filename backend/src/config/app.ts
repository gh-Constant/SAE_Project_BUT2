import { CorsOptions } from 'cors';

// Environment configuration
export const config = {
  host: process.env.HOST ?? 'localhost',
  port: process.env.PORT ? Number(process.env.PORT) : 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV !== 'production',
  isProduction: process.env.NODE_ENV === 'production',
} as const;

// CORS configuration
export const corsOptions: CorsOptions = {
  origin: [
    'http://localhost:4200',                    // Local development
    'https://livrable.constantsuchet.fr',       // Production frontend HTTPS
    'http://livrable.constantsuchet.fr'         // Production frontend HTTP
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

// API configuration
export const apiConfig = {
  prefix: '/api',
  version: 'v1',
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 100,
  },
} as const;