import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import * as messagingController from '../controllers/messaging.controller.js';

const router = Router();

// Routes
router.post('/conversations', authenticateToken, messagingController.createConversation);
router.get('/conversations', authenticateToken, messagingController.getConversations);
router.get('/conversations/:id/messages', authenticateToken, messagingController.getMessages);
router.post('/messages', authenticateToken, messagingController.sendMessage);
router.delete('/conversations/:id', authenticateToken, messagingController.deleteConversation);

export default router;
