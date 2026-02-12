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

/**
 * PUT /auth/profile
 * Met à jour le profil de l'utilisateur connecté.
 * Route protégée par le middleware `authenticateToken`.
 * Permet de modifier : firstname, lastname, email, avatarUrl, avatarType, prestataireTypeId
 */
router.put('/profile', authenticateToken, authController.updateMe);

/**
 * PUT /auth/change-password
 * Change le mot de passe de l'utilisateur connecté.
 * Route protégée par le middleware `authenticateToken`.
 */
router.put('/change-password', authenticateToken, authController.changePassword);

/**
 * POST /auth/forgot-password
 * Initie le processus de réinitialisation de mot de passe.
 * Route publique - génère un token et envoie un email.
 */
router.post('/forgot-password', authController.forgotPassword);

/**
 * POST /auth/reset-password
 * Réinitialise le mot de passe avec le token reçu par email.
 * Route publique - vérifie le token et met à jour le mot de passe.
 */
router.post('/reset-password', authController.resetPassword);

export default router;