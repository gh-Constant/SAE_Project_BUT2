import prisma from '../prisma.js';

interface ProductSeed {
  id_product: number;
  name: string;
  description?: string;
  price: number;
  image?: string;
  id_prestataire: number;
}

const PRODUCT_SEEDS: ProductSeed[] = [
  {
    id_product: 1,
    name: 'Potion de soin',
    description: 'Restaure 50 points de vie. Parfaite pour les aventuriers en quête.',
    price: 25.50,
    image: '/images/products/potion-soin.jpg',
    id_prestataire: 1,
  },
  {
    id_product: 2,
    name: 'Pain médiéval',
    description: 'Pain artisanal cuit au four à bois, recette traditionnelle.',
    price: 3.50,
    image: '/images/products/pain-medieval.jpg',
    id_prestataire: 1,
  },
  {
    id_product: 3,
    name: 'Jambon de sanglier',
    description: 'Jambon fumé de sanglier, spécialité de la région.',
    price: 18.90,
    image: '/images/products/jambon-sanglier.jpg',
    id_prestataire: 1,
  },
  {
    id_product: 4,
    name: 'Épée en bois',
    description: "Réplique d'épée médiévale en bois, parfaite pour les enfants.",
    price: 12.00,
    image: '/images/products/epee-bois.jpg',
    id_prestataire: 1,
  },
  {
    id_product: 5,
    name: 'Bouclier décoratif',
    description: 'Bouclier médiéval décoratif, idéal pour la décoration.',
    price: 35.00,
    image: '/images/products/bouclier.jpg',
    id_prestataire: 1,
  },
  {
    id_product: 6,
    name: 'Hydromel artisanal',
    description: 'Hydromel fait maison, saveur douce et fruitée.',
    price: 22.00,
    image: '/images/products/hydromel.jpg',
    id_prestataire: 1,
  },
  {
    id_product: 7,
    name: 'Chandelle parfumée',
    description: "Chandelle à la cire d'abeille, parfum cire et miel.",
    price: 8.50,
    image: '/images/products/chandelle.jpg',
    id_prestataire: 1,
  },
  {
    id_product: 8,
    name: 'Tunique médiévale',
    description: 'Tunique en lin, confortable et authentique.',
    price: 45.00,
    image: '/images/products/tunique.jpg',
    id_prestataire: 1,
  },
  {
    id_product: 9,
    name: 'Arc en bois',
    description: 'Arc traditionnel en bois, parfait pour la chasse.',
    price: 55.00,
    image: '/images/products/arc-bois.jpg',
    id_prestataire: 4,
  },
  {
    id_product: 10,
    name: 'Flèches en plumes',
    description: 'Paquet de 10 flèches avec plumes naturelles.',
    price: 15.00,
    image: '/images/products/fleches.jpg',
    id_prestataire: 4,
  },
];

export async function seedProducts() {
  console.log('📦 Seeding products...');

  for (const product of PRODUCT_SEEDS) {
    await prisma.product.upsert({
      where: { id_product: product.id_product },
      update: {
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        id_prestataire: product.id_prestataire,
      },
      create: {
        id_product: product.id_product,
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        id_prestataire: product.id_prestataire,
      },
    });
  }

  console.log('✅ Products seeded');
}
