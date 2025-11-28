import { Response, NextFunction } from 'express';
import prisma, { Role } from '../prisma.js';
import { AuthenticatedRequest } from './auth.middleware.js';

/**
 * Middleware factory to check if the user has one of the allowed roles.
 * @param allowedRoles Array of roles allowed to access the route
 */
export const checkRole = (allowedRoles: Role[]) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const user = await prisma.user.findUnique({
        where: { id_user: userId },
      });

      if (!user) {
        res.status(401).json({ error: 'User not found' });
        return;
      }

      if (!allowedRoles.includes(user.role)) {
        res.status(403).json({ error: `Access denied. Requires one of the following roles: ${allowedRoles.join(', ')}` });
        return;
      }

      next();
    } catch (error) {
      console.error('Role verification error:', error);
      res.status(500).json({ error: 'Internal server error during role verification' });
    }
  };
};
