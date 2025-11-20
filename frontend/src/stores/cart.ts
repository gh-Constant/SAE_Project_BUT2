/**
 * @file cart.ts
 * @description
 * Store Pinia pour gérer le panier d'achat.
 * Contient les articles du panier, les fonctions pour ajouter/retirer des produits,
 * et la création de commandes séparées par prestataire.
 *
 * @utilité
 * - Gérer l'état du panier de manière centralisée.
 * - Grouper les articles par prestataire.
 * - Créer des commandes séparées pour chaque prestataire.
 * - Persister le panier dans localStorage.
 *
 * @exports
 * - useCartStore : store principal pour le panier, utilisable dans toute l'application.
 *
 * @remarques
 * - Le panier est sauvegardé dans localStorage pour persister entre les sessions.
 * - Les commandes sont créées séparément par prestataire (système Click & Collect).
 */

import { defineStore } from 'pinia'
import { ProductMock } from '@/mocks/products'
import { CommandeMock, EtatCommande } from '@/mocks/commande'
import { LigneCommandeMock } from '@/mocks/ligneCommande'
import { COMMANDES } from '@/mocks/commande'
import { LIGNES_COMMANDE } from '@/mocks/ligneCommande'
import { useAuthStore } from './auth'

// Check if we're in mock mode
const isMockEnabled = import.meta.env.VITE_NO_BACKEND === 'true'

// Interface pour un article du panier
export interface CartItem {
  id_product: number
  quantity: number
  price: number
  id_prestataire: number
  // Données du produit pour l'affichage (optionnel, peut être récupéré depuis PRODUCTS)
  product?: ProductMock
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
  }),

  getters: {
    /**
     * Groupe les articles du panier par prestataire
     */
    groupedByPrestataire: (state): Record<number, CartItem[]> => {
      const grouped: Record<number, CartItem[]> = {}
      state.items.forEach((item) => {
        if (!grouped[item.id_prestataire]) {
          grouped[item.id_prestataire] = []
        }
        grouped[item.id_prestataire].push(item)
      })
      return grouped
    },

    /**
     * Calcule le total général (tous prestataires confondus)
     */
    total: (state): number => {
      return state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    },

    /**
     * Compte le nombre total d'articles dans le panier
     */
    itemCount: (state): number => {
      return state.items.reduce((sum, item) => sum + item.quantity, 0)
    },

    /**
     * Vérifie si le panier est vide
     */
    isEmpty: (state): boolean => {
      return state.items.length === 0
    },
  },

  actions: {
    /**
     * Ajoute un produit au panier
     * Si le produit existe déjà, augmente la quantité
     */
    addToCart(product: ProductMock, quantity = 1) {
      const existingItem = this.items.find(
        (item) => item.id_product === product.id
      )

      if (existingItem) {
        // Si le produit existe déjà, augmenter la quantité
        existingItem.quantity += quantity
      } else {
        // Sinon, ajouter un nouvel article
        this.items.push({
          id_product: product.id,
          quantity,
          price: product.price,
          id_prestataire: product.id_prestataire,
          product,
        })
      }

      this.saveToLocalStorage()
    },

    /**
     * Retire un produit du panier
     */
    removeFromCart(productId: number) {
      this.items = this.items.filter((item) => item.id_product !== productId)
      this.saveToLocalStorage()
    },

    /**
     * Modifie la quantité d'un produit dans le panier
     */
    updateQuantity(productId: number, quantity: number) {
      if (quantity <= 0) {
        this.removeFromCart(productId)
        return
      }

      const item = this.items.find((item) => item.id_product === productId)
      if (item) {
        item.quantity = quantity
        this.saveToLocalStorage()
      }
    },

    /**
     * Vide complètement le panier (mémoire uniquement)
     * Ne supprime PAS le localStorage - utilisé lors de la déconnexion
     */
    clearCart() {
      this.items = []
      // Ne pas supprimer le localStorage pour permettre la reconnexion avec le même panier
    },

    /**
     * Vide complètement le panier ET supprime le localStorage
     * Utilisé après création de commande
     */
    clearCartAndStorage() {
      const authStore = useAuthStore()
      this.items = []
      
      // Supprimer le panier du localStorage pour l'utilisateur actuel
      if (authStore.user && isMockEnabled) {
        const cartKey = `cart_${authStore.user.id}`
        localStorage.removeItem(cartKey)
      }
    },

    /**
     * Crée les commandes séparées par prestataire
     * Chaque prestataire aura sa propre commande en état "waiting"
     */
    createOrder() {
      const authStore = useAuthStore()
      if (!authStore.user) {
        throw new Error('Utilisateur non connecté')
      }

      const grouped = this.groupedByPrestataire
      const orders: CommandeMock[] = []

      // Créer une commande par prestataire
      for (const [prestataireId, items] of Object.entries(grouped)) {
        const totalPrice = items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        )

        const order: CommandeMock = {
          id: Date.now() + Math.random(), // Génération d'ID simple en mock
          id_user: authStore.user.id,
          id_prestataire: Number(prestataireId),
          date_commande: new Date(),
          total_price: totalPrice,
          etat_commande: EtatCommande.WAITING,
        }

        orders.push(order)

        // Créer les lignes de commande pour cette commande
        items.forEach((item) => {
          const ligneCommande: LigneCommandeMock = {
            id_commande: order.id,
            id_product: item.id_product,
            quantite: item.quantity,
            price: item.price,
          }
          LIGNES_COMMANDE.push(ligneCommande)
        })

        COMMANDES.push(order)
      }

      // Vider le panier après création des commandes (mémoire + localStorage)
      this.clearCartAndStorage()

      return orders
    },

    /**
     * Sauvegarde le panier dans localStorage avec une clé liée à l'utilisateur
     */
    saveToLocalStorage() {
      if (isMockEnabled) {
        const authStore = useAuthStore()
        if (authStore.user) {
          // Clé unique par utilisateur
          const cartKey = `cart_${authStore.user.id}`
          localStorage.setItem(cartKey, JSON.stringify(this.items))
        }
      }
    },

    /**
     * Charge le panier depuis localStorage pour l'utilisateur actuel
     */
    loadFromLocalStorage() {
      if (isMockEnabled) {
        const authStore = useAuthStore()
        if (authStore.user) {
          const cartKey = `cart_${authStore.user.id}`
          const cartStr = localStorage.getItem(cartKey)
          if (cartStr) {
            try {
              this.items = JSON.parse(cartStr)
            } catch (error) {
              console.warn('Erreur lors du chargement du panier:', error)
              this.items = []
            }
          } else {
            // Pas de panier pour cet utilisateur, initialiser vide
            this.items = []
          }
        } else {
          // Pas d'utilisateur connecté, vider le panier
          this.items = []
        }
      }
    },

    /**
     * Charge le panier pour un nouvel utilisateur (appelé lors du login)
     */
    loadCartForUser(userId: number) {
      if (isMockEnabled) {
        const cartKey = `cart_${userId}`
        const cartStr = localStorage.getItem(cartKey)
        if (cartStr) {
          try {
            this.items = JSON.parse(cartStr)
          } catch (error) {
            console.warn('Erreur lors du chargement du panier:', error)
            this.items = []
          }
        } else {
          // Pas de panier pour cet utilisateur, initialiser vide
          this.items = []
        }
      } else {
        // En mode réel, vider le panier (sera chargé depuis l'API)
        this.items = []
      }
    },
  },
})

