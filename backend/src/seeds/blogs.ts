import prisma from '../prisma.js';

interface BlogSeed {
  id_blog: number;
  title: string;
  content: string;
  id_location: number;
  price?: number | null;
  is_sellable?: boolean;
}

const BLOG_SEEDS: BlogSeed[] = [
  {
    id_blog: 1,
    title: 'Welcome to our Lodge',
    content: '<p>We are happy to welcome you to our beautiful lodge in the mountains.</p>',
    id_location: 1,
    price: undefined,
    is_sellable: false,
  },
  {
    id_blog: 2,
    title: 'Hiking Trails Nearby',
    content: '<p>Check out the amazing hiking trails just 5 minutes from here.</p>',
    id_location: 1,
    price: 50.00,
    is_sellable: true,
  },
  {
    id_blog: 3,
    title: 'Special Dinner Event',
    content: '<p>Join us for a special dinner this weekend!</p>',
    id_location: 2,
    price: undefined,
    is_sellable: false,
  },
];

export async function seedBlogs() {
  console.log(' Seeding blogs...');

  for (const blog of BLOG_SEEDS) {
    const updateData: any = {
      title: blog.title,
      content: blog.content,
      id_location: blog.id_location,
      is_sellable: blog.is_sellable !== undefined ? blog.is_sellable : false,
    };
    
    if (blog.price !== undefined) {
      updateData.price = blog.price;
    }

    const createData = { ...updateData, id_blog: blog.id_blog };

    await (prisma as any).blog.upsert({
      where: { id_blog: blog.id_blog },
      update: updateData,
      create: createData,
    });
  }

  console.log(' Blogs seeded');
}
