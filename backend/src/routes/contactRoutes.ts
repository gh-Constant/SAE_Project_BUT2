import { Router } from 'express';
import { createContactMessage, getContactMessages, sendGeneralContact } from '../controllers/contact.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', createContactMessage);
router.post('/general', sendGeneralContact);

router.get('/location/:locationId', authenticateToken, getContactMessages);

export default router;
