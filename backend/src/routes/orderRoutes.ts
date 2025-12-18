import { Router } from 'express';
import { createOrder, payOrder } from '../controllers/order.controller.js';

const router = Router();

router.post('/', createOrder);
router.put('/:id/pay', payOrder);

export default router;
