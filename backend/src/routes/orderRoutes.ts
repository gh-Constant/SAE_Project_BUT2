import { Router } from 'express';
import { collectOrder, createOrder, getMyOrders, payOrder } from '../controllers/order.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { checkRole } from '../middleware/role.middleware.js';
import { Role } from '../prisma.js';

const router = Router();

router.get('/my', authenticateToken, getMyOrders);
router.post('/', authenticateToken, createOrder);
router.post('/collect', authenticateToken, checkRole([Role.prestataire, Role.admin]), collectOrder);
router.put('/:id/pay', authenticateToken, payOrder);

export default router;
