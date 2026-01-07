/**
 * @file logger.middleware.ts
 * @description
 * Middlewares pour le logging des requêtes et du temps de réponse dans l'application Express.
 * Fournit des logs détaillés en développement pour le debug et le suivi des requêtes.
 *
 * @utilité
 * - Permet de suivre toutes les requêtes entrantes et leurs détails (méthode, URL, user-agent).
 * - Affiche le corps des requêtes POST/PUT/PATCH pour faciliter le debug (attention aux données sensibles).
 * - Mesure et logge le temps de traitement des requêtes et le code de statut HTTP.
 *
 * @exports
 * - requestLogger : middleware pour logger les informations sur les requêtes entrantes.
 * - responseTimeLogger : middleware pour logger le temps de réponse et le statut HTTP.
 *
 * @remarques
 * - Les logs ne sont affichés qu'en développement (`config.isDevelopment`).
 * - `responseTimeLogger` utilise l'événement `res.on('finish')` pour capturer la fin de la réponse.
 */

import { Request, Response, NextFunction } from 'express';
import { config } from '../config/app.config.js';

/**
 * Middleware pour logger les requêtes entrantes.
 * Affiche l'horodatage, la méthode, l'URL et le user-agent.
 * Log le corps de la requête pour les méthodes POST, PUT et PATCH.
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  if (config.isDevelopment) {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.originalUrl;
    const userAgent = req.get('User-Agent') || 'Unknown';

    console.log(` ${timestamp} | ${method} ${url} | ${userAgent}`);

    // Log du corps de la requête pour certaines méthodes (attention aux données sensibles)
    if (['POST', 'PUT', 'PATCH'].includes(method) && req.body) {
      console.log(' Request Body:', JSON.stringify(req.body, null, 2));
    }
  }

  next();
};

/**
 * Middleware pour logger le temps de traitement de la requête et le code de statut HTTP.
 * Utilise l'événement 'finish' pour capturer la fin de la réponse.
 */
export const responseTimeLogger = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();

  res.on('finish', () => {
    if (config.isDevelopment) {
      const duration = Date.now() - startTime;
      const statusCode = res.statusCode;
      const statusEmoji = statusCode >= 400 ? '❌' : statusCode >= 300 ? '️' : '✅';

      console.log(`${statusEmoji} ${req.method} ${req.originalUrl} | ${statusCode} | ${duration}ms`);
    }
  });

  next();
};
