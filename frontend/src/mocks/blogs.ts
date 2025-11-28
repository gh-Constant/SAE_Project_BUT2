
export interface Blog {
  id_blog?: number;
  title: string;
  content: string;
  created_at?: string;
  updated_at?: string;
  id_location: number;
}

export const BLOGS: Blog[] = [
  {
    id_blog: 1,
    title: 'Welcome to our Lodge',
    content: '<p>We are happy to welcome you to our beautiful lodge in the mountains.</p>',
    created_at: '2023-01-15T10:00:00Z',
    updated_at: '2023-01-15T10:00:00Z',
    id_location: 1
  },
  {
    id_blog: 2,
    title: 'Hiking Trails Nearby',
    content: '<p>Check out the amazing hiking trails just 5 minutes from here.</p>',
    created_at: '2023-02-20T14:30:00Z',
    updated_at: '2023-02-20T14:30:00Z',
    id_location: 1
  },
  {
    id_blog: 3,
    title: 'Special Dinner Event',
    content: '<p>Join us for a special dinner this weekend!</p>',
    created_at: '2023-03-10T18:00:00Z',
    updated_at: '2023-03-10T18:00:00Z',
    id_location: 2
  }
];
