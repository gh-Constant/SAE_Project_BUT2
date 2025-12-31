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
import { corsOptions, config } from './config/app.config.js';
import { requestLogger, responseTimeLogger } from './middleware/logger.middleware.js';
import { errorMiddleware, notFoundHandler } from './middleware/error.middleware.js';
import routes from './routes/index.js';
/**
 * Crée et configure l'application Express.
 * @returns {Application} Application Express configurée
 */
export const createApp = (): Application => {
  const app: Application = express();

  // Configuration CORS plus permissive
  app.use(cors(corsOptions));
  // Middleware pour parser les requêtes JSON et URL-encoded
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Middlewares de logging activés uniquement en développement
  if (config.isDevelopment) {
    app.use(requestLogger);
    app.use(responseTimeLogger);
  }
  // Routes principales de l'application
  app.use('/', routes);

  // Servir les fichiers statiques (uploads)
  app.use('/uploads', express.static('uploads'));

  // Middleware pour gérer les routes non trouvées (404)
  app.use(notFoundHandler);

  // Middleware global de gestion des erreurs (doit être en dernier)
  app.use(errorMiddleware);

  return app;
};

export default createApp;
