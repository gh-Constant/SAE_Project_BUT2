/**
 * @file roleRoutes.ts
 * @description
 * Définition des routes liées aux rôles dans l'application.
 * Fournit une route pour récupérer tous les rôles depuis la base de données.
 *
 * @utilité
 * - Centralise toutes les routes liées aux rôles.
 * - Facilite l'intégration avec le contrôleur `roleController`.
 * - Permet d'ajouter facilement d'autres routes liées aux rôles à l'avenir.
 *
 * @exports
 * - router : instance d'Express Router configurée pour les routes des rôles.
 *
 * @remarques
 * - Utilise `roleController.getAllRoles` pour gérer la récupération des rôles.
 * - Les routes sont définies sur `/roles`.
 */

import express from 'express';
import { roleController } from '../controllers/roleController.js';

const router = express.Router();

/**
 * GET /roles
 * Récupère tous les rôles de la base de données.
 * Utilise le contrôleur `roleController.getAllRoles`.
 */
router.get('/roles', roleController.getAllRoles);

export default router;
