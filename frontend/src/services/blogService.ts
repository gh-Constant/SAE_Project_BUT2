import { blogMockService } from './mock/blogMockService';
import { Blog } from '@/mocks/blogs';
import apiClient from './apiClient';

const isMockEnabled = import.meta.env.VITE_NO_BACKEND === 'true';

const blogServiceImpl = {
  getBlogsByLocationId: async (locationId: number): Promise<Blog[]> => {
    const response = await apiClient.get(`/blogs/locations/${locationId}/blogs`);
    return response.data;
  },

  createBlog: async (blog: Blog): Promise<Blog> => {
    try {
      const response = await apiClient.post('/blogs', blog);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to create blog');
    }
  },

  updateBlog: async (blog: Blog): Promise<Blog> => {
    if (!blog.id_blog) throw new Error('Blog ID is required for update');
    
    try {
      const response = await apiClient.put(`/blogs/${blog.id_blog}`, blog);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update blog');
    }
  },

  deleteBlog: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/blogs/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to delete blog');
    }
  }
};

export const blogService = isMockEnabled ? blogMockService : blogServiceImpl;
export type { Blog };
