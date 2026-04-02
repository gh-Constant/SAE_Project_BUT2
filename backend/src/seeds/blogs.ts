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
  { id_blog: 1, title: 'Le menu des grandes faims est arrive', content: '<p>La Rotisserie du Lion sert des assiettes completes toute la journee. Viande rotie, legumes braises et galettes au miel sont pretes des l ouverture.</p>', id_location: 14, is_sellable: false },
  { id_blog: 2, title: 'Carnet de recettes a l hydromel', content: '<p>Un petit guide premium avec trois recettes testees pendant le festival: sauce a l hydromel, poires pochees et marinade de banquet.</p>', id_location: 14, price: 250, is_sellable: true },
  { id_blog: 3, title: 'Comment choisir son accord mets et boisson', content: '<p>Au Cellier des Voyageurs, on vous explique comment associer tourtes, ragouts et hydromels selon vos gouts.</p>', id_location: 15, is_sellable: false },
  { id_blog: 4, title: 'Guide pratique pour entretenir son equipement de tir', content: '<p>Marie partage ses gestes de pro pour entretenir cuir, corde et pieces en bois apres une journee d animation.</p>', id_location: 16, price: 700, is_sellable: true },
  { id_blog: 5, title: 'Dans la forge des lanternes, tout commence par un croquis', content: '<p>Avant de marteler le metal, chaque lanterne est pensee pour raconter une histoire. Voici comment naissent les pieces exposees sur le stand.</p>', id_location: 17, is_sellable: false },
  { id_blog: 6, title: 'Lire un blason sans se tromper', content: '<p>Ce carnet premium vous apprend a reconnaitre les formes, couleurs et symboles les plus frequents dans les blasons du festival.</p>', id_location: 18, price: 500, is_sellable: true },
  { id_blog: 7, title: 'Trois objets a observer avant de quitter l atelier', content: '<p>Entre le carquois grave, la lanterne ajouree et le panneau heraldique, plusieurs pieces cachent de petits details a reperer sur place.</p>', id_location: 17, is_sellable: false }
];

export async function seedBlogs() {
  console.log('Seeding blogs...');

  for (const blog of BLOG_SEEDS) {
    const updateData: any = {
      title: blog.title,
      content: blog.content,
      id_location: blog.id_location,
      is_sellable: blog.is_sellable ?? false,
    };

    if (blog.price !== undefined) {
      updateData.price = blog.price;
    }

    await (prisma as any).blog.upsert({
      where: { id_blog: blog.id_blog },
      update: updateData,
      create: { id_blog: blog.id_blog, ...updateData },
    });
  }

  console.log('Blogs seeded');
}
