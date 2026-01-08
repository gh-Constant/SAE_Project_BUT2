
import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Configure upload middleware
export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed'));
        }
    }
});

export const uploadController = {
    uploadFile: (req: Request, res: Response) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            // Return the public URL
            const protocol = req.protocol;
            const host = req.get('host');
            const url = `${protocol}://${host}/uploads/${req.file.filename}`;

            return res.status(200).json({
                url: url,
                filename: req.file.filename,
                mimetype: req.file.mimetype,
                size: req.file.size
            });
        } catch (error) {
            console.error('Upload error:', error);
            return res.status(500).json({ error: 'File upload failed' });
        }
    }
};
