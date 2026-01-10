
import { Router } from 'express';
import { getAdminGlobalStats, getProviderGlobalStats } from '../controllers/stats.controller.js';
import { authenticateToken as authenticate, authorize } from '../middleware/auth.middleware.js';

const router = Router();

// Admin stats
router.get('/admin/global', authenticate, authorize(['admin']), getAdminGlobalStats);

// Provider stats
// Authorize 'prestataire' AND 'admin' (admin usually has access to everything, but req.user.id is used)
// Actually provider stats are specific to the logged-in user. An admin might have 0 locations.
// So authorize 'prestataire' only, or 'prestataire' and 'admin' if admin acts as provider too.
// Let's allow 'prestataire' and 'admin'.
router.get('/provider/global', authenticate, authorize(['prestataire', 'admin']), getProviderGlobalStats);

export default router;
