
import { Router } from 'express';
import { getAdminGlobalStats, getProviderGlobalStats, getAdminLocationStats, getAdminUserStats } from '../controllers/stats.controller.js';
import { authenticateToken as authenticate, authorize } from '../middleware/auth.middleware.js';

const router = Router();

// Admin stats
router.get('/admin/global', authenticate, authorize(['admin']), getAdminGlobalStats);

// Provider stats
router.get('/provider/global', authenticate, authorize(['prestataire', 'admin']), getProviderGlobalStats);

// Admin location stats
router.get('/admin/locations', authenticate, authorize(['admin']), getAdminLocationStats);

// Admin user stats
router.get('/admin/users', authenticate, authorize(['admin']), getAdminUserStats);

export default router;
