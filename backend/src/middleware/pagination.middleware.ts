import { Request, Response, NextFunction } from 'express';

/**
 * Middleware pour valider les paramètres de pagination (page, limit)
 * Vérifie que ce sont des entiers positifs.
 */
export const validatePagination = (req: Request, res: Response, next: NextFunction) => {
  const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(req.query.limit as string, 10) || 10));
  const skip = (page - 1) * limit;

  (req as any).pagination = { page, limit, skip };
  next();
};
