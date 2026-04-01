import express from 'express';
import { createCheckoutSession, fulfillPurchase, getBalance } from '../controllers/gold.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/checkout', authenticateToken, createCheckoutSession);
router.post('/fulfill', authenticateToken, fulfillPurchase);
router.get('/:userId', authenticateToken, getBalance);

export default router;
