export interface ProductMock {
  id: number;
  name: string;
  stock: number;
  locationId: number;
  description: string;
  imageUrl: string;
  price: number;
}

export const PRODUCTS: ProductMock[] = [
  {
    id: 1,
    name: 'Épée en bois',
    stock: 15,
    locationId: 15,
    description: 'Une épée d\'entraînement parfaite pour les débutants.',
    imageUrl: '/images/products/wooden_sword.jpg',
    price: 25
  },
  {
    id: 2,
    name: 'Potion de soin',
    stock: 8,
    locationId: 14,
    description: 'Une potion qui restaure l\'énergie vitale.',
    imageUrl: '/images/products/healing_potion.jpg',
    price: 50
  },
  {
    id: 3,
    name: 'Arc d\'entraînement',
    stock: 10,
    locationId: 1,
    description: 'Un arc léger idéal pour apprendre le tir à l\'arc.',
    imageUrl: '/images/products/training_bow.jpg',
    price: 35
  },
  {
    id: 4,
    name: 'Bouclier en bois',
    stock: 12,
    locationId: 15,
    description: 'Bouclier robuste pour la pratique du combat.',
    imageUrl: '/images/products/wooden_shield.jpg',
    price: 40
  },
  {
    id: 5,
    name: 'Hydromel',
    stock: 25,
    locationId: 14,
    description: 'Boisson traditionnelle au miel, servie dans une choppe en terre cuite.',
    imageUrl: '/images/products/mead.jpg',
    price: 8
  },
  {
    id: 6,
    name: 'Grimoire ancien',
    stock: 3,
    locationId: 1,
    description: 'Un livre mystérieux contenant d\'anciens sortilèges.',
    imageUrl: '/images/products/grimoire.jpg',
    price: 150
  },
  {
    id: 7,
    name: 'Costume de chevalier',
    stock: 5,
    locationId: 2,
    description: 'Costume complet incluant une tunique et des accessoires.',
    imageUrl: '/images/products/knight_costume.jpg',
    price: 85
  }
];
