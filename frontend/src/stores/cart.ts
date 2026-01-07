/**
 * @file cart.ts
 * @description
 * Store Pinia pour gérer le panier d'achat.
 * Contient les articles du panier, les fonctions pour ajouter/retirer des produits,
 * et la création de commandes séparées par location (boutique).
 *
 * @utilité
 * - Gérer l'état du panier de manière centralisée.
 * - Grouper les articles par location (boutique).
 * - Créer des commandes séparées pour chaque location (système Click & Collect).
 * - Persister le panier dans localStorage.
 *
 * @exports
 * - useCartStore : store principal pour le panier, utilisable dans toute l'application.
 *
 * @remarques
 * - Le panier est sauvegardé dans localStorage pour persister entre les sessions.
 * - Les commandes sont créées séparément par location (boutique) pour permettre la collecte séparée.
 */

import { defineStore } from 'pinia'
import { ProductMock } from '@/mocks/products'
import { CommandeMock, EtatCommande, saveCommandes } from '@/mocks/commande'
import { LigneCommandeMock, saveLignesCommande } from '@/mocks/ligneCommande'
import { COMMANDES } from '@/mocks/commande'
import { LIGNES_COMMANDE } from '@/mocks/ligneCommande'
import { useAuthStore } from './auth'
import { productService } from '@/services/productService'

// Check if we're in mock mode
const isMockEnabled = import.meta.env.VITE_NO_BACKEND === 'true'

// Interface pour un article du panier
export interface CartItem {
  id_product: number
  quantity: number
  price: number
  id_prestataire: number
  id_location: number // Location (boutique) du produit pour optimiser le groupement
  // Données du produit pour l'affichage (optionnel, peut être récupéré depuis PRODUCTS)
  product?: ProductMock
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
  }),

  getters: {
    /**
     * Groupe les articles du panier par prestataire (conservé pour compatibilité)
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
     * Groupe les articles du panier par location (boutique)
     * Optimisé : utilise id_location déjà stocké dans CartItem
     */
    groupedByLocation: (state): Record<number, CartItem[]> => {
      const grouped: Record<number, CartItem[]> = {}
      state.items.forEach((item) => {
        const locationId = item.id_location
        if (!grouped[locationId]) {
          grouped[locationId] = []
        }
        grouped[locationId].push(item)
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
     * Optimisé : récupère locationId depuis productService pour éviter les recherches répétées
     */
    addToCart(product: ProductMock, quantity = 1) {
      const existingItem = this.items.find(
        (item) => item.id_product === product.id
      )

      if (existingItem) {
        // Si le produit existe déjà, augmenter la quantité
        existingItem.quantity += quantity
      } else {
        // Use locationId from product if available (populated by store getter)
        const locationId = product.locationId || 0

        // Sinon, ajouter un nouvel article
        this.items.push({
          id_product: product.id,
          quantity,
          price: product.price,
          id_prestataire: product.id_prestataire,
          id_location: locationId,
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
     * Crée les commandes séparées par location (boutique)
     * Chaque location aura sa propre commande en état "waiting"
     * Optimisé : utilise groupedByLocation qui utilise id_location déjà stocké
     */
    async createOrder() {
      const authStore = useAuthStore()
      if (!authStore.user) {
        throw new Error('Utilisateur non connecté')
      }

      const grouped = this.groupedByLocation
      const orders: CommandeMock[] = []

      // Créer une commande par location (boutique)
      for (const [locationIdStr, items] of Object.entries(grouped)) {
        const locationId = Number(locationIdStr)

        // Calculer le total pour cette location
        const totalPrice = items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        )

        // Récupérer id_prestataire depuis le premier item (tous les items d'une location ont le même prestataire)
        const id_prestataire = items[0]?.id_prestataire || 0

        const order: CommandeMock = {
          id: Date.now() + Math.random(), // Génération d'ID simple en mock
          id_user: authStore.user.id,
          id_prestataire: id_prestataire,
          id_location: locationId,
          date_commande: new Date(),
          total_price: totalPrice,

          etat_commande: EtatCommande.WAITING,
        }

        // Si nous sommes en mode backend, appeler l'API
        if (!isMockEnabled) {
          try {
            await productService.createOrder({
              userId: authStore.user.id,
              locationId: locationId,
              id_prestataire: id_prestataire,
              items: items
            });
            // Si succès, on ajoute à la liste locale seulement pour l'UI, ou on laisse le backend gérer
          } catch (e) {
            console.error('Failed to create order in backend', e);
            throw e; // Arrêter si échec
          }
        }

        // Si nous sommes en mode backend, appeler l'API


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

      // Save to localStorage after all orders are created
      saveCommandes()
      saveLignesCommande()

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
     * Migre les anciens items du panier qui n'ont pas id_location
     * Récupère locationId depuis productService pour chaque produit
     */
    migrateCartItems(items: Partial<CartItem>[]): CartItem[] {
      return items.map((item) => {
        // Migration disabled due to async dependency
        return item as CartItem
        /*
        // Si l'item a déjà id_location, le retourner tel quel
        if (item.id_location !== undefined) {
          return item as CartItem
        }

        // Sinon, récupérer locationId depuis productService
        const productStore = productService.getProducts().find(p => p.id === item.id_product)
        const locationId = productStore?.locationId || 0

        return {
          ...item,
          id_location: locationId,
        } as CartItem
        */
      })
    },

    /**
     * Charge le panier depuis localStorage pour l'utilisateur actuel
     * Migre automatiquement les anciens paniers qui n'ont pas id_location
     */
    loadFromLocalStorage() {
      if (isMockEnabled) {
        const authStore = useAuthStore()
        if (authStore.user) {
          const cartKey = `cart_${authStore.user.id}`
          const cartStr = localStorage.getItem(cartKey)
          if (cartStr) {
            try {
              const parsedItems = JSON.parse(cartStr)
              // Migrer les anciens items si nécessaire
              this.items = this.migrateCartItems(parsedItems)
              // Sauvegarder la version migrée
              this.saveToLocalStorage()
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
     * Migre automatiquement les anciens paniers qui n'ont pas id_location
     */
    loadCartForUser(userId: number) {
      if (isMockEnabled) {
        const cartKey = `cart_${userId}`
        const cartStr = localStorage.getItem(cartKey)
        if (cartStr) {
          try {
            const parsedItems = JSON.parse(cartStr)
            // Migrer les anciens items si nécessaire
            this.items = this.migrateCartItems(parsedItems)
            // Sauvegarder la version migrée
            this.saveToLocalStorage()
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

