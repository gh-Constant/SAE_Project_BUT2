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
  credentials: true,                            // Allow cookies if needed
  optionsSuccessStatus: 200,                    // For older browsers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

// API configuration
export const apiConfig = {
  prefix: '/api',
  version: 'v1',
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  },
} as const;