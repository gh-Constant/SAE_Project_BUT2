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
import { getHealth } from '../controllers/health.controller.js';
import healthRoutes from './healthRoutes.js';
import roleRoutes from './roleRoutes.js';
import authRoutes from './authRoutes.js';
import translationRoutes from './translationRoutes.js';
import blogRoutes from './blogRoutes.js';
import locationRoutes from './locationRoutes.js';
import productRoutes from './productRoutes.js';
import eventRoutes from './eventRoutes.js';
import questRoutes from './questRoutes.js';
import orderRoutes from './orderRoutes.js';
import userRoutes from './userRoutes.js';
import qrcodeRoutes from './qrcodeRoutes.js';
import quizRoutes from './quizRoutes.js';
import uploadRoutes from './uploadRoutes.js';
import { apiConfig } from '../config/app.config.js';

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

// Ajout des routes d'authentification
apiRouter.use('/auth', authRoutes);

// Ajout des routes de traduction
apiRouter.use('/', translationRoutes);

// Ajout des routes de blog
apiRouter.use('/blogs', blogRoutes);

// Ajout des routes de location
apiRouter.use('/locations', locationRoutes);

// Ajout des routes de produits
apiRouter.use('/products', productRoutes);

// Ajout des routes d'événements
apiRouter.use('/events', eventRoutes);

// Ajout des routes de quêtes
apiRouter.use('/quests', questRoutes);

// Ajout des routes de commandes
apiRouter.use('/orders', orderRoutes);

// Ajout des routes utilisateurs
apiRouter.use('/users', userRoutes);

// Ajout des routes de QR code
apiRouter.use('/qrcode', qrcodeRoutes);

// Ajout des routes de quiz
apiRouter.use('/quizzes', quizRoutes);

// Ajout des routes d'upload
apiRouter.use('/upload', uploadRoutes);

// Ajout des routes de contact
import contactRoutes from './contactRoutes.js';
apiRouter.use('/contact', contactRoutes);

// Ajout des routes de messagerie
// Ajout des routes de messagerie
import messagingRoutes from './messagingRoutes.js';
apiRouter.use('/', messagingRoutes);

// Ajout des routes de statistiques
import statsRoutes from './statsRoutes.js';
apiRouter.use('/stats', statsRoutes);

// Montage des routes API avec le préfixe défini dans la configuration et la version de l'api
router.use(`${apiConfig.prefix}/${apiConfig.version}`, apiRouter);

export default router;
