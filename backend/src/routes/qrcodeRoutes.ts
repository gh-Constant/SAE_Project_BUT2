import { Router } from 'express';
import { generateQR, validateQR, getQRStatus, markQRAsUsed } from '../controllers/qrcode.controller.js';

const router = Router();

/**
 * POST /qrcode/generate
 * Generate a new QR code session
 */
router.post('/generate', generateQR);

/**
 * POST /qrcode/validate
 * Validate a scanned QR code token
 */
router.post('/validate', validateQR);

/**
 * GET /qrcode/status/:id
 * Get QR session status (for polling)
 */
router.get('/status/:id', getQRStatus);

/**
 * POST /qrcode/:id/use
 * Mark QR code as used
 */
router.post('/:id/use', markQRAsUsed);

export default router;
