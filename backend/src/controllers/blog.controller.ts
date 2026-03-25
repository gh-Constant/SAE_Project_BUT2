/**
 * @file blog.controller.ts
 * @description
 * Controller for managing blog posts for locations.
 * Provides endpoints for creating, reading, updating, deleting and purchasing blog posts.
 */

import { Request, Response } from 'express';
import * as blogService from '../services/blogService.js';
import prisma from '../prisma.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

const buildLockedContent = (content: string) =>
  `${content.substring(0, 150)}... <br/><em>(Contenu premium. Achetez cet article pour lire la suite.)</em>`;

export const blogController = {
  async createBlog(req: Request, res: Response): Promise<void> {
    try {
      const { title, content, id_location, is_sellable, price } = req.body;

      if (!title || !content || !id_location) {
        res.status(400).json({ error: 'Title, content, and location ID are required' });
        return;
      }

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

  async getBlogsByLocation(req: Request, res: Response): Promise<void> {
    try {
      const locationId = parseInt(req.params.locationId);

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

      const blogs = await blogService.getBlogsByLocation(locationId);
      const userId = (req as AuthenticatedRequest).user?.id;
      const isOwner = !!userId && location.id_prestataire === userId;

      let purchasedBlogIds: number[] = [];
      if (userId) {
        const userBlogs = await prisma.userBlog.findMany({
          where: { id_user: userId },
          select: { id_blog: true }
        });
        purchasedBlogIds = userBlogs.map((ub: any) => ub.id_blog);
      }

      const mappedBlogs = blogs.map((blog: any) => {
        const isPurchased = !blog.is_sellable || isOwner || purchasedBlogIds.includes(blog.id_blog);

        if (blog.is_sellable && !isPurchased) {
          return {
            ...blog,
            is_purchased: false,
            content: buildLockedContent(blog.content)
          };
        }

        return {
          ...blog,
          is_purchased: true
        };
      });

      res.json(mappedBlogs);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },

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

      const userId = (req as AuthenticatedRequest).user?.id;
      let isPurchased = !blog.is_sellable;

      if (blog.is_sellable && userId) {
        const [ub, location] = await Promise.all([
          prisma.userBlog.findUnique({
            where: { id_user_id_blog: { id_user: userId, id_blog: blog.id_blog } }
          }),
          prisma.location.findUnique({
            where: { id_location: blog.id_location },
            select: { id_prestataire: true }
          })
        ]);

        isPurchased = !!ub || location?.id_prestataire === userId;
      }

      res.json({
        ...blog,
        is_purchased: isPurchased,
        content: blog.is_sellable && !isPurchased ? buildLockedContent(blog.content) : blog.content
      });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },

  async updateBlog(req: Request, res: Response): Promise<void> {
    try {
      const blogId = parseInt(req.params.id);
      const { title, content, is_sellable, price } = req.body;

      if (isNaN(blogId)) {
        res.status(400).json({ error: 'Invalid blog ID' });
        return;
      }

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

  async deleteBlog(req: Request, res: Response): Promise<void> {
    try {
      const blogId = parseInt(req.params.id);

      if (isNaN(blogId)) {
        res.status(400).json({ error: 'Invalid blog ID' });
        return;
      }

      await blogService.deleteBlog(blogId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },

  async purchaseBlog(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const blogId = parseInt(req.params.id);

      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      if (isNaN(blogId)) {
        res.status(400).json({ error: 'Invalid blog ID' });
        return;
      }

      const blog = await prisma.blog.findUnique({
        where: { id_blog: blogId }
      });

      if (!blog) {
        res.status(404).json({ error: 'Blog not found' });
        return;
      }

      if (!blog.is_sellable || !blog.price) {
        res.status(400).json({ error: 'This blog is not purchasable' });
        return;
      }

      const [alreadyOwned, location] = await Promise.all([
        prisma.userBlog.findUnique({
          where: { id_user_id_blog: { id_user: userId, id_blog: blogId } }
        }),
        prisma.location.findUnique({
          where: { id_location: blog.id_location },
          select: { id_prestataire: true }
        })
      ]);

      if (alreadyOwned || location?.id_prestataire === userId) {
        res.status(400).json({ error: 'Blog already purchased' });
        return;
      }

      const blogPrice = Number(blog.price);

      const result = await prisma.$transaction(async (tx) => {
        const user = await tx.user.findUnique({
          where: { id_user: userId },
          select: { id_user: true, gold: true }
        });

        if (!user) {
          throw new Error('User not found');
        }

        if ((user.gold ?? 0) < blogPrice) {
          throw new Error('Not enough gold');
        }

        await tx.user.update({
          where: { id_user: userId },
          data: { gold: user.gold - blogPrice }
        });

        await tx.userBlog.create({
          data: {
            id_user: userId,
            id_blog: blogId
          }
        });

        return {
          remainingGold: user.gold - blogPrice
        };
      });

      res.json({
        success: true,
        id_blog: blogId,
        remainingGold: result.remainingGold
      });
    } catch (error) {
      const message = (error as Error).message;
      if (message === 'Not enough gold') {
        res.status(400).json({ error: 'Not enough gold' });
        return;
      }
      if (message === 'User not found') {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.status(500).json({ error: (error as Error).message });
    }
  },
};
