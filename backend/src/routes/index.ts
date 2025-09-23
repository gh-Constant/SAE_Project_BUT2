/**
 * @file indexRoutes.ts
 * @description
 * Routeur principal de l'application Express.
 * Configure les routes racine et les routes versionnées de l'API (health, roles, etc.).
 *
 * @utilité
 * - Centralise toutes les routes de l'application.
 * - Fournit une route racine pour un health check basique.
 * - Monte les routes API avec un préfixe défini dans la configuration (`apiConfig.prefix`).
 * - Facilite l'ajout de nouvelles routes modulaires à l'API.
 *
 * @exports
 * - router : instance d'Express Router configurée avec toutes les routes de l'application.
 */

import { Router } from 'express';
import { getHealth } from '../controllers/healthController.js';
import healthRoutes from './healthRoutes.js';
import roleRoutes from './roleRoutes.js';
import { apiConfig } from '../config/app.js';

const router = Router();

/**
 * GET /
 * Route racine pour un health check basique.
 * Renvoie un message simple et l'environnement.
 */
router.get('/', getHealth);

/**
 * API routes avec versioning ou préfixe.
 */
const apiRouter = Router();

// Ajout des routes de santé
apiRouter.use('/', healthRoutes);

// Ajout des routes liées aux rôles
apiRouter.use('/', roleRoutes);

// Montage des routes API avec le préfixe défini dans la configuration
router.use(apiConfig.prefix, apiRouter);

export default router;
