import { Blog, BLOGS } from '@/mocks/blogs';

// Create a mutable copy of the mock data for the session
let mockBlogs: Blog[] = [...BLOGS];

export const blogMockService = {
  getBlogsByLocationId: async (locationId: number): Promise<Blog[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockBlogs.filter(blog => blog.id_location === locationId);
  },

  createBlog: async (blog: Blog): Promise<Blog> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newBlog = {
      ...blog,
      id_blog: Math.max(0, ...mockBlogs.map(b => b.id_blog || 0)) + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockBlogs.push(newBlog);
    return newBlog;
  },

  updateBlog: async (blog: Blog): Promise<Blog> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockBlogs.findIndex(b => b.id_blog === blog.id_blog);
    if (index !== -1) {
      mockBlogs[index] = {
        ...mockBlogs[index],
        ...blog,
        updated_at: new Date().toISOString()
      };
      return mockBlogs[index];
    }
    throw new Error('Blog not found');
  },

  deleteBlog: async (id: number): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    mockBlogs = mockBlogs.filter(b => b.id_blog !== id);
  }
};
