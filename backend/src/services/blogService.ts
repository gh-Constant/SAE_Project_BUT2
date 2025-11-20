import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CreateBlogData {
  title: string;
  content: string;
  id_location: number;
}

interface UpdateBlogData {
  title?: string;
  content?: string;
}

/**
 * Create a new blog post for a location
 */
export const createBlog = async (data: CreateBlogData) => {
  return await prisma.blog.create({
    data: {
      title: data.title,
      content: data.content,
      id_location: data.id_location,
    },
  });
};

/**
 * Get all blogs for a specific location
 */
export const getBlogsByLocation = async (locationId: number) => {
  return await prisma.blog.findMany({
    where: {
      id_location: locationId,
    },
    orderBy: {
      created_at: 'desc',
    },
  });
};

/**
 * Get a single blog by ID
 */
export const getBlogById = async (blogId: number) => {
  return await prisma.blog.findUnique({
    where: {
      id_blog: blogId,
    },
  });
};

/**
 * Update a blog post
 */
export const updateBlog = async (blogId: number, data: UpdateBlogData) => {
  return await prisma.blog.update({
    where: {
      id_blog: blogId,
    },
    data,
  });
};

/**
 * Delete a blog post
 */
export const deleteBlog = async (blogId: number) => {
  return await prisma.blog.delete({
    where: {
      id_blog: blogId,
    },
  });
};
