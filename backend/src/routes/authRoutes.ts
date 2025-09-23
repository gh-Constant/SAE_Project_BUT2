import { Router } from 'express';
import { authController } from '../controllers/authController.js';

const router = Router()

/**
 * POST /auth/login
 * Authenticates a user and returns a token.
 */
router.post('/login', authController.login);

/**
 * POST /auth/register
 * Registers a new user.
 */
router.post('/register', authController.register);

export default router;