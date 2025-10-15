/**
 * @file aiProvider.interface.ts
 * @description
 * Définit les interfaces standard que tout provider d’IA doit implémenter.
 * Cela garantit que tous les providers (OpenAI, HuggingFace, etc.)
 * ont une API commune compatible avec `AIClient`.
 *
 * @utilité
 * - Simplifie le changement ou l’ajout de providers.
 * - Garantit une compatibilité uniforme dans le code.
 *
 * @exports
 * - `AIProvider` : interface de base pour les providers IA.
 * - `AIProviderConfig` : configuration nécessaire pour initialiser un provider.
 */

export interface AIProvider {
  generateText(prompt: string, options?: { temperature?: number; maxTokens?: number; model?: string }): Promise<string>
}

export interface AIProviderConfig {
  apiKey: string
  model?: string
  baseURL?: string
}
