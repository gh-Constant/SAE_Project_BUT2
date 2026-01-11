/**
 * @file aiProvider.interface.ts
 * @description
 * Interface standardisée que tous les providers d’IA (OpenAI, Mistral, LocalAI...) doivent implémenter.
 */

export interface AIProviderConfig {
  apiKey: string
  baseURL?: string
  organization?: string
}

export interface AIProvider {
  /**
   * Génère du texte à partir d’un prompt.
   * @param prompt Le texte d’entrée.
   * @param options Options de génération (température, tokens max...).
   */
  generateText(
    prompt: string,
    options?: {
      temperature?: number
      maxTokens?: number
      model?: string
    }
  ): Promise<string>
}
