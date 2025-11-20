import { Response, NextFunction } from 'express';
import prisma from '../prisma.js';
import { AuthenticatedRequest } from './auth.middleware.js';

/**
 * Middleware to check if the authenticated user owns the location specified in the request body.
 * Assumes id_location is in req.body.
 */
export const checkLocationOwnership = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id_location } = req.body;

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    if (!id_location) {
      res.status(400).json({ error: 'Location ID is required' });
      return;
    }

    const location = await prisma.location.findUnique({
      where: { id_location: Number(id_location) },
    });

    if (!location) {
      res.status(404).json({ error: 'Location not found' });
      return;
    }

    if (location.id_prestataire !== userId) {
      res.status(403).json({ error: 'You do not own this location' });
      return;
    }

    next();
  } catch (error) {
    console.error('Location ownership check error:', error);
    res.status(500).json({ error: 'Internal server error during location ownership check' });
  }
};

/**
 * Middleware to check if the authenticated user owns the location associated with the blog specified in route params.
 * Assumes blog ID is in req.params.id.
 */
export const checkBlogLocationOwnership = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    const blogId = parseInt(req.params.id);

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    if (isNaN(blogId)) {
      res.status(400).json({ error: 'Invalid blog ID' });
      return;
    }

    const blog = await prisma.blog.findUnique({
      where: { id_blog: blogId },
    });

    if (!blog) {
      res.status(404).json({ error: 'Blog not found' });
      return;
    }

    const location = await prisma.location.findUnique({
      where: { id_location: blog.id_location },
    });

    if (!location || location.id_prestataire !== userId) {
      res.status(403).json({ error: 'You do not own the location for this blog' });
      return;
    }

    next();
  } catch (error) {
    console.error('Blog location ownership check error:', error);
    res.status(500).json({ error: 'Internal server error during blog location ownership check' });
  }
};

/**
 * Middleware to check if a location is available for purchase.
 * Checks if location exists and is not already purchased.
 * Location ID is in req.params.id.
 */
export const checkLocationAvailable = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const locationId = parseInt(req.params.id);

    if (isNaN(locationId)) {
      res.status(400).json({ error: 'Invalid location ID' });
      return;
    }

    const location = await prisma.location.findUnique({
      where: { id_location: locationId },
    });

    if (!location) {
      res.status(404).json({ error: 'Location not found' });
      return;
    }

    // Check if location is already purchased
    if (location.purchased) {
      res.status(400).json({ error: 'Location is already purchased' });
      return;
    }

    next();
  } catch (error) {
    console.error('Location availability check error:', error);
    res.status(500).json({ error: 'Internal server error during location availability check' });
  }
};
