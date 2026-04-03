import { CorsOptions } from 'cors';

export const config = {
  host: process.env.HOST ?? 'localhost',
  port: process.env.PORT ? Number(process.env.PORT) : 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV !== 'production',
  isProduction: process.env.NODE_ENV === 'production',
} as const;

const configuredFrontendOrigin = process.env.FRONTEND_URL?.trim();
const corsOrigins = [
  'http://localhost:4200',
  'http://localhost:4201',
  'https://livrable.constantsuchet.fr',
  configuredFrontendOrigin,
].filter((origin): origin is string => Boolean(origin));

export const corsOptions: CorsOptions = {
  origin: corsOrigins,
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

export const apiConfig = {
  prefix: '/api',
  version: 'v1',
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 100,
  },
} as const;
