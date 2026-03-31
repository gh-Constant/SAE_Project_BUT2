import { Request, Response, type RequestHandler } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

export const uploadRootDir = path.resolve(process.cwd(), 'uploads');

const ensureUploadDir = () => {
    if (!fs.existsSync(uploadRootDir)) {
        fs.mkdirSync(uploadRootDir, { recursive: true });
    }
};

export const buildPublicUploadUrl = (req: Request, filename: string) => {
    const host = req.get('host');
    if (!host) {
        return `/uploads/${filename}`;
    }

    return `${req.protocol}://${host}/uploads/${filename}`;
};

// Configure storage
const storage = multer.diskStorage({
    destination: (req: Request, file: any, cb: (error: Error | null, destination: string) => void) => {
        ensureUploadDir();
        cb(null, uploadRootDir);
    },
    filename: (req: Request, file: any, cb: (error: Error | null, filename: string) => void) => {
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
    fileFilter: (req: Request, file: any, cb: multer.FileFilterCallback) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed'));
        }
    }
});

export const handleSingleUpload = (fieldName: string): RequestHandler => {
    return (req, res, next) => {
        upload.single(fieldName)(req, res, (error: unknown) => {
            if (!error) {
                next();
                return;
            }

            if (error instanceof multer.MulterError) {
                const message = error.code === 'LIMIT_FILE_SIZE'
                    ? 'Image must not exceed 10MB'
                    : error.message;

                res.status(400).json({ error: message });
                return;
            }

            res.status(400).json({
                error: error instanceof Error ? error.message : 'File upload failed'
            });
        });
    };
};

export const uploadController = {
    uploadFile: (req: Request, res: Response) => {
        try {
            // Multer adds file to request
            const file = (req as any).file;
            
            if (!file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            // Return the public URL
            const url = buildPublicUploadUrl(req, file.filename);

            return res.status(200).json({
                url: url,
                filename: file.filename,
                mimetype: file.mimetype,
                size: file.size
            });
        } catch (error) {
            console.error('Upload error:', error);
            return res.status(500).json({ error: 'File upload failed' });
        }
    }
};
