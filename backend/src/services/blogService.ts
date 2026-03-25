import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CreateBlogData {
  title: string;
  content: string;
  id_location: number;
  is_sellable?: boolean;
  price?: number;
}

interface UpdateBlogData {
  title?: string;
  content?: string;
  is_sellable?: boolean;
  price?: number;
}

/**
 * Create a new blog post for a location
 */
export const createBlog = async (data: CreateBlogData) => {
  return prisma.$transaction(async (tx) => {
    const blog = await tx.blog.create({
      data: {
        title: data.title,
        content: data.content,
        id_location: data.id_location,
        is_sellable: data.is_sellable || false,
        price: data.price ? data.price : null,
      },
    });

    if (blog.is_sellable && blog.price) {
      const location = await tx.location.findUnique({
        where: { id_location: data.id_location },
      });
      if (location && location.id_prestataire) {
        await tx.product.create({
          data: {
            name: `Blog: ${blog.title}`,
            description: `Accès numérique à la page de blog: ${blog.title}`,
            price: blog.price,
            is_blog: true,
            id_blog: blog.id_blog,
            id_prestataire: location.id_prestataire,
          },
        });
      }
    }

    return blog;
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
  return prisma.$transaction(async (tx) => {
    const initialBlog = await tx.blog.findUnique({
      where: { id_blog: blogId },
      include: { location: true }
    });
    if (!initialBlog) throw new Error('Blog not found');

    const updatePayload: any = {
      title: data.title,
      content: data.content,
    };
    if (data.is_sellable !== undefined) updatePayload.is_sellable = data.is_sellable;
    if (data.price !== undefined) updatePayload.price = data.price ? data.price : null;

    const blog = await tx.blog.update({
      where: { id_blog: blogId },
      data: updatePayload,
    });

    // Handle Product sync
    if (blog.is_sellable && blog.price && initialBlog.location.id_prestataire) {
      // Upsert product
      await tx.product.upsert({
        where: { id_blog: blogId },
        update: {
          name: `Blog: ${blog.title}`,
          price: blog.price,
        },
        create: {
          name: `Blog: ${blog.title}`,
          description: `Accès numérique à la page de blog: ${blog.title}`,
          price: blog.price,
          is_blog: true,
          id_blog: blog.id_blog,
          id_prestataire: initialBlog.location.id_prestataire,
        }
      });
    } else if (!blog.is_sellable) {
      // Remove product if not sellable
      await tx.product.deleteMany({
        where: { id_blog: blogId }
      });
    }

    return blog;
  });
};

/**
 * Delete a blog post
 */
export const deleteBlog = async (blogId: number) => {
  return prisma.$transaction(async (tx) => {
    // Delete associated UserBlogs first
    await tx.userBlog.deleteMany({
      where: { id_blog: blogId },
    });
    // Delete associated Product
    await tx.product.deleteMany({
      where: { id_blog: blogId },
    });
    // Finally delete the blog
    return tx.blog.delete({
      where: { id_blog: blogId },
    });
  });
};
