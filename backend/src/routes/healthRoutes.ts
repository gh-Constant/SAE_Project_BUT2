/**
 * @file healthRoutes.ts
 * @description
 * Définition des routes de santé de l'application.
 * Fournit des endpoints pour vérifier l'état de l'API et du serveur.
 *
 * @utilité
 * - Permet aux outils de monitoring de vérifier que l'application est en ligne.
 * - Fournit des informations sur l'état général de l'API, l'uptime et l'environnement.
 * - Utile pour le debug et le suivi en production.
 *
 * @exports
 * - router : instance d'Express Router configurée pour les endpoints de santé.
 *
 * @remarques
 * - Utilise les contrôleurs `getApiHealth` et `getStatus` définis dans `healthController`.
 */

import { Router } from 'express';
import { getApiHealth, getStatus } from '../controllers/health.controller.js';

const router = Router();

/**
 * GET /health
 * Endpoint de vérification détaillée de l'état de l'API.
 * Renvoie des informations sur la santé, la version, l'environnement, l'uptime et l'utilisation mémoire.
 */
router.get('/health', getApiHealth);

/**
 * GET /status
 * Endpoint simple pour vérifier que le serveur est en ligne.
 * Renvoie le statut "online" et un timestamp.
 */
router.get('/status', getStatus);

export default router;
