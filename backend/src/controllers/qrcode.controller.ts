import { Request, Response } from 'express';
import qrcodeService from '../services/qrcodeService.js';

/**
 * Generate a new QR code session
 * POST /api/v1/qrcode/generate
 */
export const generateQR = async (req: Request, res: Response) => {
    try {
        const { data, userId } = req.body;

        const session = await qrcodeService.generate({
            data,
            createdById: userId ? Number(userId) : undefined,
        });

        res.status(201).json({
            id: session.id,
            token: session.token,
            status: session.status,
            data: session.data,
            createdAt: session.created_at,
        });
    } catch (error) {
        console.error('Error generating QR code:', error);
        res.status(500).json({ error: 'Failed to generate QR code' });
    }
};

/**
 * Validate a scanned QR code
 * POST /api/v1/qrcode/validate
 */
export const validateQR = async (req: Request, res: Response) => {
    try {
        const { token, scannedById } = req.body;

        if (!token) {
            return res.status(400).json({ error: 'Token is required' });
        }

        const result = await qrcodeService.validate({
            token,
            scannedById: scannedById ? Number(scannedById) : undefined,
        });

        if (!result.success) {
            return res.status(404).json({ error: result.error });
        }

        return res.json({
            success: true,
            session: {
                id: result.session!.id,
                status: result.session!.status,
                data: result.data,
                scannedAt: result.session!.scanned_at,
            },
        });
    } catch (error) {
        console.error('Error validating QR code:', error);
        return res.status(500).json({ error: 'Failed to validate QR code' });
    }
};

/**
 * Get QR code session status (for polling)
 * GET /api/v1/qrcode/status/:id
 */
export const getQRStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const session = await qrcodeService.getStatus(id);

        if (!session) {
            return res.status(404).json({ error: 'QR session not found' });
        }

        return res.json({
            id: session.id,
            status: session.status,
            data: session.data,
            createdAt: session.created_at,
            scannedAt: session.scanned_at,
            createdBy: session.created_by,
            scannedBy: session.scanned_by,
        });
    } catch (error) {
        console.error('Error fetching QR status:', error);
        return res.status(500).json({ error: 'Failed to fetch QR status' });
    }
};

/**
 * Mark QR code as used
 * POST /api/v1/qrcode/:id/use
 */
export const markQRAsUsed = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const session = await qrcodeService.markAsUsed(id);

        return res.json({
            id: session.id,
            status: session.status,
            message: 'QR code marked as used',
        });
    } catch (error) {
        console.error('Error marking QR as used:', error);
        return res.status(500).json({ error: 'Failed to mark QR as used' });
    }
};
