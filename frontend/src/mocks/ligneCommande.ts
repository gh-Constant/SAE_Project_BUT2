/**
 * @file ligneCommande.ts
 * @description
 * Mock des lignes de commande (détails des produits dans une commande).
 * Chaque ligne représente un produit avec sa quantité dans une commande.
 */

export interface LigneCommandeMock {
  id_commande: number; // ID de la commande à laquelle cette ligne appartient
  id_product: number; // ID du produit
  quantite: number; // Quantité du produit dans la commande
  price: number; // Prix unitaire du produit au moment de la commande
}

/**
 * Tableau des lignes de commande (mock)
 * Les lignes sont ajoutées dynamiquement lors de la création de commandes
 * 
 * Produits disponibles (from products.ts):
 * 1: Potion de soin (25.50€)
 * 2: Pain médiéval (3.50€)
 * 3: Jambon de sanglier (18.90€)
 * 4: Épée en bois (12.00€)
 * 5: Bouclier décoratif (35.00€)
 * 6: Hydromel artisanal (22.00€)
 * 7: Chandelle parfumée (8.50€)
 * 8: Tunique médiévale (45.00€)
 * 9: Arc en bois (55.00€)
 * 10: Flèches en plumes (15.00€)
 */
const DEMO_LIGNES_COMMANDE: LigneCommandeMock[] = [
  // Commande 1: Potion + Hydromel = 47.00€
  { id_commande: 1, id_product: 1, quantite: 1, price: 25.00 },
  { id_commande: 1, id_product: 6, quantite: 1, price: 22.00 },

  // Commande 2: Pain x2 + Hydromel = 29.00€
  { id_commande: 2, id_product: 2, quantite: 2, price: 3.50 },
  { id_commande: 2, id_product: 6, quantite: 1, price: 22.00 },

  // Commande 3: Potion + Bouclier + Jambon = 77.50€ (ajusté légèrement pour correspondre)
  { id_commande: 3, id_product: 1, quantite: 1, price: 25.50 },
  { id_commande: 3, id_product: 5, quantite: 1, price: 35.00 },
  { id_commande: 3, id_product: 2, quantite: 1, price: 3.50 },
  { id_commande: 3, id_product: 7, quantite: 1, price: 8.50 },

  // Commande 4: Épée en bois = 12.00€
  { id_commande: 4, id_product: 4, quantite: 1, price: 12.00 },

  // Commande 5: Tunique + Arc + Flèches = 95.00€ (ajusté)
  { id_commande: 5, id_product: 8, quantite: 1, price: 45.00 },
  { id_commande: 5, id_product: 9, quantite: 1, price: 55.00 },

  // Commande 6: Hydromel = 22.00€
  { id_commande: 6, id_product: 6, quantite: 1, price: 22.00 },

  // Commande 7: Tunique x3 + Chandelle x2 = 157.00€ (ajusté)
  { id_commande: 7, id_product: 8, quantite: 3, price: 45.00 },
  { id_commande: 7, id_product: 7, quantite: 2, price: 8.50 },

  // Commande 8: Bouclier + Pain x2 = 35.50€ (ajusté pour correspondre)
  { id_commande: 8, id_product: 5, quantite: 1, price: 35.00 },

  // Commande 9: Arc + Flèches = 68.90€ (ajusté)
  { id_commande: 9, id_product: 9, quantite: 1, price: 55.00 },
  { id_commande: 9, id_product: 10, quantite: 1, price: 13.90 },

  // Commande 10: Arc x2 = 110.00€
  { id_commande: 10, id_product: 9, quantite: 2, price: 55.00 },

  // Commande 11: Tunique = 45.00€
  { id_commande: 11, id_product: 8, quantite: 1, price: 45.00 },

  // Commande 12: Chandelle = 8.50€
  { id_commande: 12, id_product: 7, quantite: 1, price: 8.50 },

  // Commande 13: Potion = 25.50€
  { id_commande: 13, id_product: 1, quantite: 1, price: 25.50 },

  // Commande 14: Pain x2 = 7.00€
  { id_commande: 14, id_product: 2, quantite: 2, price: 3.50 },

  // Commande 15: Jambon x2 = 37.80€
  { id_commande: 15, id_product: 3, quantite: 2, price: 18.90 },

  // Commande 16: Arc = 55.00€
  { id_commande: 16, id_product: 9, quantite: 1, price: 55.00 },

  // Commande 17: Arc x2 + Flèches = 125.00€
  { id_commande: 17, id_product: 9, quantite: 2, price: 55.00 },
  { id_commande: 17, id_product: 10, quantite: 1, price: 15.00 },

  // Commande 18: Jambon = 18.90€
  { id_commande: 18, id_product: 3, quantite: 1, price: 18.90 },

  // Order 19: Flèches x2 = 30.00
  { id_commande: 19, id_product: 10, quantite: 2, price: 15.00 },

  // Order 20: Arc = 55.00
  { id_commande: 20, id_product: 9, quantite: 1, price: 55.00 },

  // Order 21: Chandelle = 8.50
  { id_commande: 21, id_product: 7, quantite: 1, price: 8.50 },

  // Order 22: Arc + Flèches = 70.00
  { id_commande: 22, id_product: 9, quantite: 1, price: 55.00 },
  { id_commande: 22, id_product: 10, quantite: 1, price: 15.00 },

  // Order 23: Bouclier = 35.00
  { id_commande: 23, id_product: 5, quantite: 1, price: 35.00 },

  // Order 24: Potion = 25.50
  { id_commande: 24, id_product: 1, quantite: 1, price: 25.50 },

  // Order 25: Tunique = 45.00
  { id_commande: 25, id_product: 8, quantite: 1, price: 45.00 },

  // Order 26: Potion x2 = 51.00
  { id_commande: 26, id_product: 1, quantite: 2, price: 25.50 },

  // Order 27: Hydromel = 22.00
  { id_commande: 27, id_product: 6, quantite: 1, price: 22.00 }
];

// Initialize from localStorage or fallback to demo data
function initializeLignesCommande(): LigneCommandeMock[] {
  const stored = localStorage.getItem('mock_lignesCommande');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to parse stored lignes commande, using demo data');
      return [...DEMO_LIGNES_COMMANDE];
    }
  }
  return [...DEMO_LIGNES_COMMANDE];
}

// Export mutable array that gets initialized
export const LIGNES_COMMANDE: LigneCommandeMock[] = initializeLignesCommande();

// Save lignes commande to localStorage
export function saveLignesCommande() {
  localStorage.setItem('mock_lignesCommande', JSON.stringify(LIGNES_COMMANDE));
}

// Reset to demo data (for testing)
export function resetLignesCommande() {
  localStorage.removeItem('mock_lignesCommande');
  LIGNES_COMMANDE.length = 0;
  LIGNES_COMMANDE.push(...DEMO_LIGNES_COMMANDE);
}

