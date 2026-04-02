/**
 * @file app.config.ts
 * @description
 * Création et configuration de l'application Express.
 * Configure les middlewares, les routes, la gestion des erreurs et les endpoints de santé.
 *
 * @utilité
 * - Centralise la configuration de l'application Express.
 * - Applique les middlewares pour la sécurité, le parsing, le logging et la gestion des erreurs.
 * - Fournit un endpoint `/ping` pour vérifier rapidement que le serveur répond.
 * - Monte les routes principales de l'application.
 * - Fournit la documentation Swagger UI sur `/api-docs`.
 *
 * @exports
 * - createApp : fonction qui retourne l'application Express configurée.
 * - default : export par défaut de createApp..
 *
 * @remarques
 * - Les middlewares de logging ne sont activés qu'en développement (`config.isDevelopment`).
 * - `notFoundHandler` doit être déclaré après toutes les routes pour gérer les 404.
 * - `errorMiddleware` doit être le dernier middleware pour capturer toutes les erreurs.
 */

import express, { Application } from 'express';
import cors from 'cors';
import session from 'express-session';
import helmet from 'helmet';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { fileURLToPath } from 'url';
import { corsOptions, config } from './config/app.config.js';
import passport from './config/passport.config.js';
import { uploadRootDir } from './controllers/upload.controller.js';
import { requestLogger, responseTimeLogger } from './middleware/logger.middleware.js';
import { errorMiddleware, notFoundHandler } from './middleware/error.middleware.js';
import routes from './routes/index.js';

// ES Module dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Crée et configure l'application Express.
 * @returns {Application} Application Express configurée
 */
export const createApp = (): Application => {
  const app: Application = express();

  // --- Sécurité : helmet ajoute plein de headers HTTP de sécurité d'un coup ---
  // (X-Content-Type-Options, X-Frame-Options, etc.)
  // on désactive la CSP pour ne pas bloquer Swagger UI qui utilise des scripts inline
  app.use(helmet({
    contentSecurityPolicy: false,
  }));

  // --- Sécurité : CORS avec origines restrictives (pas de wildcard '*') ---
  app.use(cors(corsOptions));

  // --- Session pour OAuth (Google, Discord) ---
  app.use(session({
    secret: process.env.OAUTH_SESSION_SECRET || 'oauth_session_secret_change_me',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: config.isProduction,
      maxAge: 15 * 60 * 1000,
    },
  }));
  app.use(passport.initialize());

  // --- Sécurité : hpp nettoie les paramètres query dupliqués (HTTP Parameter Pollution) ---
  app.use(hpp());

  // --- Sécurité : rate limiting général pour éviter le spam de requêtes ---
  // 100 requêtes max par fenêtre de 15 minutes par IP
  const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Trop de requêtes, réessayez dans quelques minutes.' },
  });
  app.use(globalLimiter);

  // Swagger UI Documentation
  const swaggerDocument = YAML.load(path.join(__dirname, '../docs/swagger.yaml'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'SAE Project API Documentation',
    explorer: true
  }));

  // Middleware pour parser les requêtes JSON et URL-encoded
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Middlewares de logging activés uniquement en développement
  if (config.isDevelopment) {
    app.use(requestLogger);
    app.use(responseTimeLogger);
  }
  // Servir les fichiers statiques (uploads)
  app.use('/uploads', express.static(uploadRootDir));

  // Routes principales de l'application
  app.use('/', routes);

  // Middleware pour gérer les routes non trouvées (404)
  app.use(notFoundHandler);

  // Middleware global de gestion des erreurs (doit être en dernier)
  app.use(errorMiddleware);

  return app;
};

export default createApp;
