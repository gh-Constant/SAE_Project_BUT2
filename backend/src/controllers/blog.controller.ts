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

export const blogController = {
  /**
   * Create a new blog post
   */
  async createBlog(req: Request, res: Response): Promise<void> {
    try {
      const { title, content, id_location } = req.body;

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

      const blogs = await blogService.getBlogsByLocation(locationId);
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
      const { title, content } = req.body;

      if (isNaN(blogId)) {
        res.status(400).json({ error: 'Invalid blog ID' });
        return;
      }

      // Ownership and existence checked in middleware

      const updatedBlog = await blogService.updateBlog(blogId, {
        title,
        content,
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
