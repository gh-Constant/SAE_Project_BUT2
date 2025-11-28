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

import { Router } from 'express';
import { roleController } from '../controllers/role.controller.js';

const router = Router();

/**
 * GET /roles
 * Récupère tous les rôles de la base de données.
 * Utilise le contrôleur `roleController.getAllRoles`.
 */
router.get('/roles', roleController.getAllRoles);

/**
 * GET /roles/name/:name
 * Récupère un rôle spécifique par son nom.
 * Utilise le contrôleur `roleController.getRoleByName`.
 */
router.get('/roles/name/:name', roleController.getRoleByName);

/**
 * GET /roles/user/:userId
 * Récupère le rôle d'un utilisateur spécifique par son ID.
 * Utilise le contrôleur `roleController.getUserRole`.
 */
router.get('/roles/user/:userId', roleController.getUserRole);

export default router;
