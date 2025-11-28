import { blogMockService } from './mock/blogMockService';
import { Blog } from '@/mocks/blogs';

const isMockEnabled = import.meta.env.VITE_NO_BACKEND === 'true';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const blogServiceImpl = {
  getBlogsByLocationId: async (locationId: number): Promise<Blog[]> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/blogs/locations/${locationId}/blogs`);
    if (!response.ok) {
      throw new Error('Failed to fetch blogs');
    }
    return await response.json();
  },

  createBlog: async (blog: Blog): Promise<Blog> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/blogs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(blog)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create blog');
    }
    return await response.json();
  },

  updateBlog: async (blog: Blog): Promise<Blog> => {
    if (!blog.id_blog) throw new Error('Blog ID is required for update');
    
    const response = await fetch(`${API_BASE_URL}/api/v1/blogs/${blog.id_blog}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(blog)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update blog');
    }
    return await response.json();
  },

  deleteBlog: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/blogs/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete blog');
    }
  }
};

export const blogService = isMockEnabled ? blogMockService : blogServiceImpl;
export type { Blog };
