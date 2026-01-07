/**
 * @file providerManager.ts
 * @description
 * Gestionnaire centralisé des fournisseurs d’IA (AI Providers).
 * Permet d’enregistrer, de récupérer ou de lister les providers disponibles.
 *
 * @utilité
 * - Stocke tous les fournisseurs disponibles dans une Map.
 * - Fournit un provider par défaut si aucun n’est spécifié.
 * - Sert de registre central pour tout le système IA.
 *
 * @exports
 * - `ProviderManager` : classe gérant les providers enregistrés.
 * - `providerManager` : instance unique utilisée globalement.
 */

import { AIProvider } from './aiProvider.interface.js'

export class ProviderManager {
  private providers: Map<string, AIProvider> = new Map()

  /** Enregistre un nouveau provider sous un nom spécifique. */
  registerProvider(name: string, provider: AIProvider): void {
    this.providers.set(name, provider)
  }

  /** Récupère un provider par son nom. */
  getProvider(name: string): AIProvider | undefined {
    return this.providers.get(name)
  }

  /** Renvoie le premier provider enregistré (utilisé comme défaut). */
  getDefaultProvider(): AIProvider | undefined {
    return this.providers.values().next().value
  }

  /** Liste tous les noms des providers enregistrés. */
  listProviders(): string[] {
    return Array.from(this.providers.keys())
  }
}

//  Instance unique partagée dans tout le projet
export const providerManager = new ProviderManager()
