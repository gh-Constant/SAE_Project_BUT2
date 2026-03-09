
import { Router } from 'express';
import { getAdminGlobalStats, getProviderGlobalStats, getAdminLocationStats } from '../controllers/stats.controller.js';
import { authenticateToken as authenticate, authorize } from '../middleware/auth.middleware.js';

const router = Router();

// Admin stats
router.get('/admin/global', authenticate, authorize(['admin']), getAdminGlobalStats);

// Provider stats
router.get('/provider/global', authenticate, authorize(['prestataire', 'admin']), getProviderGlobalStats);

// Admin location stats
router.get('/admin/locations', authenticate, authorize(['admin']), getAdminLocationStats);

export default router;
