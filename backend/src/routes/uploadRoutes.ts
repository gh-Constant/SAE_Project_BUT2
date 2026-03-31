
import { Router } from 'express';
import { handleSingleUpload, uploadController } from '../controllers/upload.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

// POST /api/v1/upload
router.post('/', authenticateToken, handleSingleUpload('file'), uploadController.uploadFile);

export default router;
