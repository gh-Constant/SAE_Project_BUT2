export interface ProductMock {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  image: string;
  id_prestataire: number;
  locationId?: number;
}

export const PRODUCTS: ProductMock[] = [
  {
    id: 1,
    name: 'Potion de soin',
    description: 'Restaure 50 points de vie. Parfaite pour les aventuriers en quête.',
    price: 25.50,
    stock: 15,
    image: '/images/products/potion-soin.jpg',
    id_prestataire: 1
  },
  {
    id: 2,
    name: 'Pain médiéval',
    description: 'Pain artisanal cuit au four à bois, recette traditionnelle.',
    price: 3.50,
    stock: 30,
    image: '/images/products/pain-medieval.jpg',
    id_prestataire: 1
  },
  {
    id: 3,
    name: 'Jambon de sanglier',
    description: 'Jambon fumé de sanglier, spécialité de la région.',
    price: 18.90,
    stock: 8,
    image: '/images/products/jambon-sanglier.jpg',
    id_prestataire: 1
  },
  {
    id: 4,
    name: 'Épée en bois',
    description: 'Réplique d\'épée médiévale en bois, parfaite pour les enfants.',
    price: 12.00,
    stock: 20,
    image: '/images/products/epee-bois.jpg',
    id_prestataire: 1
  },
  {
    id: 5,
    name: 'Bouclier décoratif',
    description: 'Bouclier médiéval décoratif, idéal pour la décoration.',
    price: 35.00,
    stock: 5,
    image: '/images/products/bouclier.jpg',
    id_prestataire: 1
  },
  {
    id: 6,
    name: 'Hydromel artisanal',
    description: 'Hydromel fait maison, saveur douce et fruitée.',
    price: 22.00,
    stock: 12,
    image: '/images/products/hydromel.jpg',
    id_prestataire: 1
  },
  {
    id: 7,
    name: 'Chandelle parfumée',
    description: 'Chandelle à la cire d\'abeille, parfum cire et miel.',
    price: 8.50,
    stock: 25,
    image: '/images/products/chandelle.jpg',
    id_prestataire: 1
  },
  {
    id: 8,
    name: 'Tunique médiévale',
    description: 'Tunique en lin, confortable et authentique.',
    price: 45.00,
    stock: 10,
    image: '/images/products/tunique.jpg',
    id_prestataire: 1
  },
  {
    id: 9,
    name: 'Arc en bois',
    description: 'Arc traditionnel en bois, parfait pour la chasse.',
    price: 55.00,
    stock: 7,
    image: '/images/products/arc-bois.jpg',
    id_prestataire: 4
  },
  {
    id: 10,
    name: 'Flèches en plumes',
    description: 'Paquet de 10 flèches avec plumes naturelles.',
    price: 15.00,
    stock: 20,
    image: '/images/products/fleches.jpg',
    id_prestataire: 4
  }
];
