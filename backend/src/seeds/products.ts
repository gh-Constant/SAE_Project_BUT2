import prisma from '../prisma.js';

interface ProductSeed {
  id_product: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  image?: string;
  id_prestataire: number;
}

const PRODUCT_SEEDS: ProductSeed[] = [
  { id_product: 1, name: 'Assiette du bucheronnier', description: 'Pain rustique, viande froide et fromage fermier servis sur planche.', price: 2550, stock: 15, image: '/images/products/Potion de soin.png', id_prestataire: 1 },
  { id_product: 2, name: 'Galette au miel', description: 'Petite douceur rapide a emporter entre deux animations.', price: 350, stock: 30, image: '/images/products/pain-medievale.png', id_prestataire: 1 },
  { id_product: 3, name: 'Ecuelle de ragout de sanglier', description: 'Plat chaud mijote aux herbes du festival.', price: 1890, stock: 18, image: '/images/products/jambon-sanglier.png', id_prestataire: 1 },
  { id_product: 4, name: 'Soupe paysanne du matin', description: 'Soupe epaisse servie dans une ecuelle en terre.', price: 1200, stock: 24, image: '/images/products/epaix-en-bois.png', id_prestataire: 1 },
  { id_product: 5, name: 'Plateau du chevalier', description: 'Assortiment gourmand pour deux personnes avec viande, pain et fromage.', price: 3500, stock: 12, image: '/images/products/Bouclier dÃ©coratif.png', id_prestataire: 1 },
  { id_product: 6, name: 'Pichet d hydromel epice', description: 'Hydromel artisanal aux epices douces, servi frais.', price: 2200, stock: 20, image: '/images/products/hydrolyme-artisanal.png', id_prestataire: 1 },
  { id_product: 7, name: 'Tarte aux pommes et cannelle', description: 'Dessert maison tres apprecie a la sortie des spectacles.', price: 850, stock: 25, image: '/images/products/chandelle-parfumee.png', id_prestataire: 1 },
  { id_product: 8, name: 'Formule banquet du soir', description: 'Menu complet avec entree, plat, boisson et dessert.', price: 4500, stock: 10, image: '/images/products/tunique-medievale.png', id_prestataire: 1 },
  { id_product: 9, name: 'Carquois en cuir grave', description: 'Piece artisanale faite main pour costume ou demonstration.', price: 5500, stock: 7, image: '/images/products/arc-en-bois.png', id_prestataire: 4 },
  { id_product: 10, name: 'Brassard de tir ajuste', description: 'Accessoire de tir confortable realise dans l atelier.', price: 1500, stock: 20, image: '/images/products/fleche-en-plume.png', id_prestataire: 4 }
];

function getShopServiceId(prestataireId: number): number {
  return prestataireId === 4 ? 6 : 1;
}

export async function seedProducts() {
  console.log('Seeding products...');

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

    const shopServiceId = getShopServiceId(product.id_prestataire);

    await prisma.stock.upsert({
      where: {
        id_product_id_service: {
          id_product: product.id_product,
          id_service: shopServiceId,
        },
      },
      update: {
        stock: product.stock,
      },
      create: {
        id_product: product.id_product,
        id_service: shopServiceId,
        stock: product.stock,
      },
    });
  }

  console.log('Products and stocks seeded');
}
