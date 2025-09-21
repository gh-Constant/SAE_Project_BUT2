import { Router } from 'express';
import { getApiHealth, getStatus } from '../controllers/healthController.js';

const router = Router();

// Health check routes
router.get('/health', getApiHealth);
router.get('/status', getStatus);

export default router;