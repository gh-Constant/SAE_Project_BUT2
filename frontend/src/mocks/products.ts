export interface ProductMock {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  image?: string;
  is_blog?: boolean;
  id_blog?: number;
  id_prestataire: number;
  locationId?: number;
}

export const PRODUCTS: ProductMock[] = [
  { id: 1, name: 'Assiette du bucheronnier', description: 'Pain rustique, viande froide et fromage fermier servis sur planche.', price: 2550, stock: 15, image: '/images/products/Potion de soin.png', id_prestataire: 1, locationId: 14 },
  { id: 2, name: 'Galette au miel', description: 'Petite douceur rapide a emporter entre deux animations.', price: 350, stock: 30, image: '/images/products/pain-medievale.png', id_prestataire: 1, locationId: 15 },
  { id: 3, name: 'Ecuelle de ragout de sanglier', description: 'Plat chaud mijote aux herbes du festival.', price: 1890, stock: 18, image: '/images/products/jambon-sanglier.png', id_prestataire: 1, locationId: 14 },
  { id: 4, name: 'Soupe paysanne du matin', description: 'Soupe epaisse servie dans une ecuelle en terre.', price: 1200, stock: 24, image: '/images/products/epaix-en-bois.png', id_prestataire: 1, locationId: 15 },
  { id: 5, name: 'Plateau du chevalier', description: 'Assortiment gourmand pour deux personnes avec viande, pain et fromage.', price: 3500, stock: 12, image: '/images/products/Bouclier dÃ©coratif.png', id_prestataire: 1, locationId: 14 },
  { id: 6, name: 'Pichet d hydromel epice', description: 'Hydromel artisanal aux epices douces, servi frais.', price: 2200, stock: 20, image: '/images/products/hydrolyme-artisanal.png', id_prestataire: 1, locationId: 15 },
  { id: 7, name: 'Tarte aux pommes et cannelle', description: 'Dessert maison tres apprecie a la sortie des spectacles.', price: 850, stock: 25, image: '/images/products/chandelle-parfumee.png', id_prestataire: 1, locationId: 14 },
  { id: 8, name: 'Formule banquet du soir', description: 'Menu complet avec entree, plat, boisson et dessert.', price: 4500, stock: 10, image: '/images/products/tunique-medievale.png', id_prestataire: 1, locationId: 14 },
  { id: 9, name: 'Carquois en cuir grave', description: 'Piece artisanale faite main pour costume ou demonstration.', price: 5500, stock: 7, image: '/images/products/arc-en-bois.png', id_prestataire: 4, locationId: 16 },
  { id: 10, name: 'Brassard de tir ajuste', description: 'Accessoire de tir confortable realise dans l atelier.', price: 1500, stock: 20, image: '/images/products/fleche-en-plume.png', id_prestataire: 4, locationId: 16 }
];
