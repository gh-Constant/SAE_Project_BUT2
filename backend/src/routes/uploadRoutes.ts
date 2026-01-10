
import { Router } from 'express';
import { upload, uploadController } from '../controllers/upload.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

// POST /api/v1/upload
router.post('/', authenticateToken, (req, res, next) => {
    upload.single('file')(req, res, (err: any) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        next();
    });
}, uploadController.uploadFile);

export default router;
