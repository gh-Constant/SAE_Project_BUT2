import { Router } from 'express';
import { getHealth } from '../controllers/healthController.js';
import healthRoutes from './healthRoutes.js';
import roleRoutes from './roleRoutes.js';
import { apiConfig } from '../config/app.js';

const router = Router();

// Root route - Basic health check
router.get('/', getHealth);

// API routes with versioning
const apiRouter = Router();

// Health routes
apiRouter.use('/', healthRoutes);
apiRouter.use('/', roleRoutes);

// Mount API routes with prefix
router.use(apiConfig.prefix, apiRouter);

export default router;