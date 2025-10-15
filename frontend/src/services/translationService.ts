/**
 * @file translationService.ts
 * @description
 * Service de traduction qui choisit entre le mode mock et le mode réel.
 * Fournit les fonctions de traduction de texte.
 *
 * @utilité
 * - Permet de tester l'application avec des données mock sans backend.
 * - Prépare l'intégration avec un vrai backend plus tard.
 * - Fournit une interface unique pour la traduction de texte.
 * - Gère la communication avec l'API backend pour la traduction.
 *
 * @exports
 * - translationService : service de traduction utilisé dans l'application.
 *
 * @remarques
 * - Le mode mock est activé si VITE_NO_BACKEND est true.
 * - Les fonctions du mode réel appellent l'API backend avec fetch.
 */

import { translationMockService } from './mock/translationMockService'

// Vérifier si on est en mode mock ou réel selon la variable d'environnement
// VITE_NO_BACKEND=true signifie qu'on n'a pas de backend disponible
const isMockEnabled = import.meta.env.VITE_NO_BACKEND === 'true'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

// Types
export interface TranslationRequest {
  text: string
  from?: string
  to?: string
}

export interface TranslationResponse {
  translatedText: string
  originalText: string
}

// Implémentation du service réel
const translationServiceImpl = {
  translate: async (request: TranslationRequest): Promise<TranslationResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Translation failed')
    }

    return response.json()
  },
}

// On choisit dynamiquement le service à utiliser selon le mode
export const translationService = isMockEnabled ? translationMockService : translationServiceImpl

// Log pour savoir si on est en mode mock ou réel (utile pour debug)
console.log(`Translation service initialized: ${isMockEnabled ? 'MOCK' : 'REAL'} mode`)