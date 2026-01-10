
import { Router } from 'express';
import { getAdminGlobalStats, getProviderGlobalStats } from '../controllers/stats.controller.js';
import { authenticateToken as authenticate, authorize } from '../middleware/auth.middleware.js';

const router = Router();

// Admin stats
router.get('/admin/global', authenticate, authorize(['admin']), getAdminGlobalStats);

// Provider stats
router.get('/provider/global', authenticate, authorize(['prestataire', 'admin']), getProviderGlobalStats);

export default router;
