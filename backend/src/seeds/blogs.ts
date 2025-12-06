import prisma from '../prisma.js';

interface BlogSeed {
  id_blog: number;
  title: string;
  content: string;
  id_location: number;
}

const BLOG_SEEDS: BlogSeed[] = [
  {
    id_blog: 1,
    title: 'Welcome to our Lodge',
    content: '<p>We are happy to welcome you to our beautiful lodge in the mountains.</p>',
    id_location: 1,
  },
  {
    id_blog: 2,
    title: 'Hiking Trails Nearby',
    content: '<p>Check out the amazing hiking trails just 5 minutes from here.</p>',
    id_location: 1,
  },
  {
    id_blog: 3,
    title: 'Special Dinner Event',
    content: '<p>Join us for a special dinner this weekend!</p>',
    id_location: 2,
  },
];

export async function seedBlogs() {
  console.log('📝 Seeding blogs...');

  for (const blog of BLOG_SEEDS) {
    await prisma.blog.upsert({
      where: { id_blog: blog.id_blog },
      update: {
        title: blog.title,
        content: blog.content,
        id_location: blog.id_location,
      },
      create: {
        id_blog: blog.id_blog,
        title: blog.title,
        content: blog.content,
        id_location: blog.id_location,
      },
    });
  }

  console.log('✅ Blogs seeded');
}
