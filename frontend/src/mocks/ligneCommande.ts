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
 */
export const LIGNES_COMMANDE: LigneCommandeMock[] = [];

