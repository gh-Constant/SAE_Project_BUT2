/**
 * @file healthController.ts
 * @description
 * Contrôleurs pour vérifier l'état de santé de l'API et du serveur.
 * Fournit des endpoints simples et détaillés pour monitorer l'application.
 *
 * @utilité
 * - Permet aux outils de monitoring de vérifier que l'application est en ligne.
 * - Fournit des informations de base et avancées sur l'état du serveur et de l'API.
 * - Utile pour le debug et la surveillance en production.
 *
 * @exports
 * - getHealth : endpoint de vérification simple (/).
 * - getApiHealth : endpoint de vérification détaillée (/api/health).
 * - getStatus : endpoint de statut rapide (/api/status).
 *
 * @remarques
 * - Utilise asyncHandler pour gérer les erreurs async de manière centralisée.
 * - getApiHealth fournit des métriques comme l'uptime, la mémoire utilisée et l'environnement.
 */

import { Request, Response } from 'express';
import { config } from '../config/app.js';
import { asyncHandler } from '../middleware/errorHandler.js';

/**
 * GET /
 * Vérification basique du serveur.
 * Renvoie un message simple, le timestamp actuel et l'environnement Node.
 */
export const getHealth = asyncHandler(async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Hello API',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

/**
 * GET /api/health
 * Vérification détaillée de l'état de l'API.
 * Fournit des informations sur la santé, la version, l'environnement, l'uptime et l'utilisation mémoire.
 */
export const getApiHealth = asyncHandler(async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'API is healthy',
    data: {
      status: 'healthy',
      version: '1.0.0',
      environment: config.nodeEnv,
      uptime: process.uptime(), // temps en secondes depuis le démarrage du processus
      timestamp: new Date().toISOString(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100, // Mo utilisés
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100, // Mo totaux alloués
      },
    },
  });
});

/**
 * GET /api/status
 * Endpoint simple pour vérifier que le serveur est en ligne.
 * Retourne le statut "online" et le timestamp actuel.
 */
export const getStatus = asyncHandler(async (req: Request, res: Response) => {
  res.json({
    success: true,
    status: 'online',
    timestamp: new Date().toISOString(),
  });
});
