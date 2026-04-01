import { Router } from 'express';
import { generateQR, validateQR, getQRStatus, markQRAsUsed } from '../controllers/qrcode.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

/**
 * POST /qrcode/generate
 * Generate a new QR code session
 */
router.post('/generate', authenticateToken, generateQR);

/**
 * POST /qrcode/validate
 * Validate a scanned QR code token
 */
router.post('/validate', authenticateToken, validateQR);

/**
 * GET /qrcode/status/:id
 * Get QR session status (for polling)
 */
router.get('/status/:id', authenticateToken, getQRStatus);

/**
 * POST /qrcode/:id/use
 * Mark QR code as used
 */
router.post('/:id/use', authenticateToken, markQRAsUsed);

export default router;
