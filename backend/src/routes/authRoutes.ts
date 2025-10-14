/**
 * @file authRoutes.ts
 * @description
 * Définition des routes liées à l'authentification dans l'application.
 * Fournit des endpoints pour la connexion, l'inscription et la gestion des informations utilisateur.
 *
 * @utilité
 * - Centralise toutes les routes liées à l'authentification.
 * - Facilite l'intégration avec le contrôleur `authController`.
 * - Applique le middleware d'authentification aux routes protégées.
 *
 * @exports
 * - router : instance d'Express Router configurée pour les routes d'authentification.
 *
 * @remarques
 * - Utilise le middleware `authenticateToken` pour protéger les routes sensibles.
 * - Les routes publiques (login, register) n'ont pas de middleware d'authentification.
 * - Les routes sont définies sur `/auth`.
 */

import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router()

/**
 * POST /auth/login
 * Authentifie un utilisateur et retourne un token.
 * Route publique, pas de middleware d'authentification requis.
 */
router.post('/login', authController.login);

/**
 * POST /auth/register
 * Enregistre un nouvel utilisateur.
 * Route publique, pas de middleware d'authentification requis.
 */
router.post('/register', authController.register);

/**
 * GET /auth/me
 * Récupère les informations de l'utilisateur connecté à partir du token.
 * Route protégée par le middleware `authenticateToken`.
 */
router.get('/me', authenticateToken, authController.getMe);

/**
 * GET /auth/role
 * Récupère les informations de rôle de l'utilisateur connecté à partir du token.
 * Route protégée par le middleware `authenticateToken`.
 */
router.get('/role', authenticateToken, authController.getMyRole);

export default router;