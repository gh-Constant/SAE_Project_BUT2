/**
 * @file blogRoutes.ts
 * @description
 * Route definitions for blog management endpoints.
 * Provides routes for creating, reading, updating, and deleting blog posts.
 *
 * @exports
 * - router: Express Router instance configured for blog routes.
 *
 * @remarks
 * - Uses `authenticateToken` middleware to protect routes that modify data.
 * - GET routes are public to allow viewing blogs.
 * - POST, PUT, DELETE routes require authentication.
 */

import { Router } from 'express';
import { blogController } from '../controllers/blog.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { checkRole } from '../middleware/role.middleware.js';
import { checkLocationOwnership, checkBlogLocationOwnership } from '../middleware/location.middleware.js';
import { Role } from '../prisma.js';

const router = Router();

/**
 * POST /blogs
 * Create a new blog post for a location.
 * Protected route - requires authentication, prestataire role, and location ownership.
 */
router.post(
  '/',
  authenticateToken,
  checkRole([Role.prestataire]),
  checkLocationOwnership,
  blogController.createBlog
);

/**
 * GET /locations/:locationId/blogs
 * Get all blogs for a specific location.
 * Public route - no authentication required.
 */
router.get('/locations/:locationId/blogs', blogController.getBlogsByLocation);

/**
 * GET /blogs/:id
 * Get a single blog by ID.
 * Public route - no authentication required.
 */
router.get('/:id', blogController.getBlog);

/**
 * PUT /blogs/:id
 * Update a blog post.
 * Protected route - requires authentication, prestataire role, and location ownership.
 */
router.put(
  '/:id',
  authenticateToken,
  checkRole([Role.prestataire]),
  checkBlogLocationOwnership,
  blogController.updateBlog
);

/**
 * DELETE /blogs/:id
 * Delete a blog post.
 * Protected route - requires authentication, prestataire role, and location ownership.
 */
router.delete(
  '/:id',
  authenticateToken,
  checkRole([Role.prestataire]),
  checkBlogLocationOwnership,
  blogController.deleteBlog
);

export default router;
