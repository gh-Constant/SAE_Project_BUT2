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
    title: 'Le Tournoi des Chevaliers commence !',
    content: '<p>Oyez, oyez ! Les plus grands guerriers du royaume se rassemblent demain à l\'arène principale. Venez admirer les joutes et encourager vos champions préférés !</p>',
    id_location: 14, // Gérard (Merchant Stall #5)
    is_sellable: false,
  },
  {
    id_blog: 2,
    title: 'Élixir de Force : Nouvelle Potion',
    content: '<p>Notre alchimiste a enfin terminé sa dernière création. L\'Élixir de Force vous donnera une puissance inégalée pour vos prochaines quêtes. Disponible dès maintenant à la boutique !</p>',
    id_location: 16, // Marie (Merchant Stall #7)
    price: 45.00,
    is_sellable: true,
  },
  {
    id_blog: 3,
    title: 'Mystère dans la Forêt des Lions',
    content: '<p>Plusieurs voyageurs rapportent des lueurs étranges venant de la forêt profonde. Les gardes recommandent la plus grande prudence à tous les aventuriers s\'aventurant au-delà des sentiers connus.</p>',
    id_location: 16, // Marie (Merchant Stall #7)
    is_sellable: false,
  },
  {
    id_blog: 4,
    title: 'Grand Banquet au Château',
    content: '<p>Le Roi invite tous les citoyens à célébrer la fin des récoltes. Un banquet gargantuesque sera servi sur la place du marché. Ne manquez pas ce rendez-vous historique !</p>',
    id_location: 14, // Gérard (Merchant Stall #5)
    is_sellable: false,
  },
  {
    id_blog: 5,
    title: "Nouvelle collection d'automne",
    content: '<p>Venez découvrir nos nouvelles tuniques en laine, parfaites pour les soirées fraîches ! Disponibles en plusieurs coloris.</p>',
    id_location: 16, // Marie
    is_sellable: false,
  },
  {
    id_blog: 6,
    title: "Les secrets de l'herboristerie",
    content: '<p>Saviez-vous que la racine de mandragore peut soigner les maux de tête si elle est préparée correctement ? Passez à mon échoppe pour en savoir plus.</p>',
    id_location: 17, // Marie
    is_sellable: true,
    price: 5.00, // Consultation or booklet?
  },
  {
    id_blog: 7,
    title: "Retour sur le cours de tir à l'arc",
    content: '<p>Bravo à tous les participants du dernier cours ! Vous avez fait d\'énormes progrès. Le prochain cours aura lieu dans deux jours.</p>',
    id_location: 16, // Marie
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
