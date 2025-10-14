/**
 * @file translationMockService.ts
 * @description
 * Service mock pour la traduction en mode développement.
 * Simule les appels API de traduction sans backend.
 *
 * @utilité
 * - Permet de tester l'interface utilisateur sans backend.
 * - Simule les délais réseau et les réponses API.
 * - Fournit des données cohérentes pour les tests.
 *
 * @exports
 * - translationMockService : service mock de traduction.
 */

import type { TranslationRequest, TranslationResponse } from '../translationService'

// Service mock pour la traduction
export const translationMockService = {
  translate: async (request: TranslationRequest): Promise<TranslationResponse> => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Logique de traduction mock
    const translatedText = `translated: ${request.text}`

    return {
      translatedText,
      originalText: request.text
    }
  },
}