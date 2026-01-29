
import { Router } from 'express';
import { userController } from '../controllers/user.controller.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();

/**
 * Routes de gestion des utilisateurs
 * Toutes les routes nécessitent d'être authentifié et d'être ADMIN
 */

import { validatePagination } from '../middleware/pagination.middleware.js';

// GET /users/leaderboard - Récupère le classement global (accessible aux authentifiés)
router.get('/leaderboard', authenticateToken, validatePagination, userController.getLeaderboard);

// GET /users/:id/rank - Récupère le rang d'un utilisateur (accessible aux authentifiés)
router.get('/:id/rank', authenticateToken, userController.getUserRank);

// GET /users - Liste tous les utilisateurs (Admin seulement)
router.get('/', authenticateToken, requireAdmin, userController.getAllUsers);

// POST /users/:id/verify - Vérifie un utilisateur
router.post('/:id/verify', authenticateToken, requireAdmin, userController.verifyUser);

// DELETE /users/:id - Supprime un utilisateur
router.delete('/:id', authenticateToken, requireAdmin, userController.deleteUser);

export default router;
