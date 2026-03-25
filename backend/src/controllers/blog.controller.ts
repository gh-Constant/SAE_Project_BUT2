/**
 * @file blog.controller.ts
 * @description
 * Controller for managing blog posts for locations.
 * Provides endpoints for creating, reading, updating, and deleting blog posts.
 *
 * @exports
 * - createBlog: endpoint to create a new blog post
 * - getBlogsByLocation: endpoint to get all blogs for a location
 * - getBlog: endpoint to get a single blog by ID
 * - updateBlog: endpoint to update a blog post
 * - deleteBlog: endpoint to delete a blog post
 */

import { Request, Response } from 'express';
import * as blogService from '../services/blogService.js';
import prisma from '../prisma.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export const blogController = {
  /**
   * Create a new blog post
   */
  async createBlog(req: Request, res: Response): Promise<void> {
    try {
      const { title, content, id_location, is_sellable, price } = req.body;

      // Validate required fields
      if (!title || !content || !id_location) {
        res.status(400).json({ error: 'Title, content, and location ID are required' });
        return;
      }

      // Ownership and existence checked in middleware

      const blog = await blogService.createBlog({
        title,
        content,
        id_location,
        is_sellable,
        price,
      });

      res.status(201).json(blog);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },

  /**
   * Get all blogs for a specific location
   */
  async getBlogsByLocation(req: Request, res: Response): Promise<void> {
    try {
      const locationId = parseInt(req.params.locationId);

      if (isNaN(locationId)) {
        res.status(400).json({ error: 'Invalid location ID' });
        return;
      }

      // Verify that the location exists
      const location = await prisma.location.findUnique({
        where: { id_location: locationId },
      });

      if (!location) {
        res.status(404).json({ error: 'Location not found' });
        return;
      }

      let blogs = await blogService.getBlogsByLocation(locationId);

      const userId = (req as AuthenticatedRequest).user?.id;
      let purchasedBlogIds: number[] = [];
      if (userId) {
        const userBlogs = await prisma.userBlog.findMany({
          where: { id_user: userId },
          select: { id_blog: true }
        });
        purchasedBlogIds = userBlogs.map((ub: any) => ub.id_blog);
      }

      blogs = blogs.map((blog: any) => {
        if (blog.is_sellable && !purchasedBlogIds.includes(blog.id_blog)) {
          // Si le blog est payant et non acheté (et que l'utilisateur n'est pas le proprio, optionnel)
          // On peut simplifier en vérifiant juste l'achat. (Le proprio de la location pourrait voir ses blogs via un autre endpoint, ou on vérifie le rôle prestataire ici)
          return {
            ...blog,
            content: blog.content.substring(0, 150) + '... <br/><em>(Contenu premium. Achetez cette page dans la boutique pour lire la suite.)</em>'
          };
        }
        return blog;
      });

      res.json(blogs);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },

  /**
   * Get a single blog by ID
   */
  async getBlog(req: Request, res: Response): Promise<void> {
    try {
      const blogId = parseInt(req.params.id);

      if (isNaN(blogId)) {
        res.status(400).json({ error: 'Invalid blog ID' });
        return;
      }

      const blog = await blogService.getBlogById(blogId);

      if (!blog) {
        res.status(404).json({ error: 'Blog not found' });
        return;
      }

      const userId = (req as any).user?.id;
      if (blog.is_sellable) {
        let hasPurchased = false;
        if (userId) {
          const ub = await prisma.userBlog.findUnique({
             where: { id_user_id_blog: { id_user: userId, id_blog: blog.id_blog } }
          });
          if (ub) hasPurchased = true;
        }
        if (!hasPurchased) {
           blog.content = blog.content.substring(0, 150) + '... <br/><em>(Contenu premium. Achetez cette page dans la boutique pour lire la suite.)</em>';
        }
      }

      res.json(blog);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },

  /**
   * Update a blog post
   */
  async updateBlog(req: Request, res: Response): Promise<void> {
    try {
      const blogId = parseInt(req.params.id);
      const { title, content, is_sellable, price } = req.body;

      if (isNaN(blogId)) {
        res.status(400).json({ error: 'Invalid blog ID' });
        return;
      }

      // Ownership and existence checked in middleware

      const updatedBlog = await blogService.updateBlog(blogId, {
        title,
        content,
        is_sellable,
        price,
      });

      res.json(updatedBlog);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },

  /**
   * Delete a blog post
   */
  async deleteBlog(req: Request, res: Response): Promise<void> {
    try {
      const blogId = parseInt(req.params.id);

      if (isNaN(blogId)) {
        res.status(400).json({ error: 'Invalid blog ID' });
        return;
      }

      // Ownership and existence checked in middleware

      await blogService.deleteBlog(blogId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },
};
