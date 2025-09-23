/**
 * @file app.ts
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
 * - default : export par défaut de createApp.
 *
 * @remarques
 * - Les middlewares de logging ne sont activés qu'en développement (`config.isDevelopment`).
 * - `notFoundHandler` doit être déclaré après toutes les routes pour gérer les 404.
 * - `errorHandler` doit être le dernier middleware pour capturer toutes les erreurs.
 */

import express, { Application } from 'express';
import cors from 'cors';
import { corsOptions, config } from './config/app.js';
import { requestLogger, responseTimeLogger } from './middleware/logger.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import routes from './routes/index.js';
/**
 * Crée et configure l'application Express.
 * @returns {Application} Application Express configurée
 */
export const createApp = (): Application => {
  const app: Application = express();

  // Middleware pour la sécurité et le CORS
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

  // Middleware pour gérer les routes non trouvées (404)
  app.use(notFoundHandler);

  // Middleware global de gestion des erreurs (doit être en dernier)
  app.use(errorHandler);

  return app;
};

export default createApp;
