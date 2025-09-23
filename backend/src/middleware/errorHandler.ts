/**
 * @file errorHandler.ts
 * @description
 * Middleware et utilitaires pour la gestion des erreurs dans l'application Express.
 * Fournit un gestionnaire d'erreurs global, un handler 404 et un wrapper pour gérer les erreurs async.
 *
 * @utilité
 * - Centralise la gestion des erreurs pour toutes les routes.
 * - Fournit un format de réponse cohérent pour les erreurs.
 * - Permet d'afficher des informations détaillées en développement sans exposer de données sensibles en production.
 * - Facilite la capture des erreurs dans les routes asynchrones avec asyncHandler.
 *
 * @exports
 * - errorHandler : middleware global pour gérer les erreurs.
 * - notFoundHandler : middleware pour gérer les routes non trouvées (404).
 * - asyncHandler : wrapper pour capturer automatiquement les erreurs dans les fonctions async.
 *
 * @remarques
 * - errorHandler logge les erreurs seulement si config.isDevelopment est true.
 * - asyncHandler permet de ne pas répéter try/catch dans chaque route async.
 */

import { Request, Response, NextFunction } from 'express';
import { config } from '../config/app.js';

/**
 * Interface pour les erreurs personnalisées.
 * @interface CustomError
 * @extends Error
 * @property {number} [statusCode] - Code HTTP à renvoyer (ex: 400, 500).
 * @property {boolean} [isOperational] - Indique si l'erreur est opérationnelle ou critique.
 */
export interface CustomError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

/**
 * Middleware global de gestion des erreurs.
 * Capture toutes les erreurs passées à next(error) et renvoie une réponse JSON cohérente.
 * @param error - Erreur capturée
 * @param req - Requête Express
 * @param res - Réponse Express
 * @param next - Fonction next d'Express
 */
export const errorHandler = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  // Log des erreurs détaillées en développement
  if (config.isDevelopment) {
    console.error('❌ Error:', {
      message: error.message,
      stack: error.stack,
      url: req.originalUrl,
      method: req.method,
      statusCode,
    });
  }

  // Réponse JSON standardisée pour les erreurs
  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(config.isDevelopment && { stack: error.stack }), // stack seulement en dev
    },
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
  });
};

/**
 * Middleware pour gérer les routes non trouvées (404).
 * @param req - Requête Express
 * @param res - Réponse Express
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: {
      message: `Route ${req.originalUrl} not found`,
    },
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
  });
};

/**
 * Wrapper pour gérer les erreurs dans les fonctions async.
 * Évite d'avoir à mettre try/catch dans chaque route async.
 * @param fn - Fonction async Express
 * @returns Fonction Express avec capture automatique des erreurs
 */
export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
