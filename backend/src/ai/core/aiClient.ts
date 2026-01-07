/**
 * @file aiClient.ts
 * @description
 * Client générique pour interagir avec différents fournisseurs d’IA.
 * Permet de basculer dynamiquement entre plusieurs providers enregistrés.
 *
 * @utilité
 * - Fournit une interface uniforme pour générer du texte avec différents modèles.
 * - Évite de dépendre directement d’un fournisseur spécifique.
 *
 * @exports
 * - `AIClient` : classe principale gérant la communication avec le provider choisi.
 */

import { AIProvider } from './aiProvider.interface.js'
import { providerManager } from './providerManager.js'

export class AIClient {
  private provider: AIProvider

  constructor(providerName?: string) {
    if (providerName) {
      const provider = providerManager.getProvider(providerName)
      if (!provider) {
        throw new Error(`Provider '${providerName}' not found`)
      }
      this.provider = provider
    } else {
      //  Utilise le provider par défaut si aucun n’est spécifié
      const defaultProvider = providerManager.getDefaultProvider()
      if (!defaultProvider) {
        throw new Error('No default provider available')
      }
      this.provider = defaultProvider
    }
  }

  /**
   * Envoie un prompt texte au provider associé.
   */
  async generateText(prompt: string, options?: { temperature?: number; maxTokens?: number; model?: string }): Promise<string> {
    return this.provider.generateText(prompt, options)
  }

  /**
   * Permet de changer dynamiquement de provider IA.
   */
  setProvider(providerName: string): void {
    const provider = providerManager.getProvider(providerName)
    if (!provider) {
      throw new Error(`Provider '${providerName}' not found`)
    }
    this.provider = provider
  }
}
