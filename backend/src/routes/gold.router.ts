import express from 'express';
import { createCheckoutSession, fulfillPurchase, getBalance } from '../controllers/gold.controller.js';

const router = express.Router();

router.post('/checkout', createCheckoutSession);
router.post('/fulfill', fulfillPurchase);
router.get('/:userId', getBalance);

export default router;
