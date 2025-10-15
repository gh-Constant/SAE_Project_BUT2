/**
 * @file openAI.provider.ts
 * @description
 * Fournisseur (provider) pour interagir avec les API OpenAI ou OpenRouter.
 * Il implémente l’interface `AIProvider` pour garantir une compatibilité générique.
 *
 * @utilité
 * - Sert d’adaptateur entre le code interne et l’API OpenAI.
 * - Permet de changer de backend IA sans modifier le reste du code.
 *
 * @exports
 * - `OpenAIProvider` : implémentation concrète du provider pour OpenAI.
 */

import OpenAI from 'openai'
import { AIProvider, AIProviderConfig } from '../core/aiProvider.interface.js'

export class OpenAIProvider implements AIProvider {
  private client: OpenAI

  constructor(config: AIProviderConfig) {
    // 🔐 Création du client OpenAI avec clé API et URL (personnalisable)
    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseURL || 'https://api.openai.com/v1',
    })
  }

  /**
   * Envoie un prompt texte à OpenAI et renvoie la réponse générée.
   */
  async generateText(prompt: string, options?: { temperature?: number; maxTokens?: number; model?: string }): Promise<string> {
    try {
      const response = await this.client.chat.completions.create({
        model: options?.model || 'openai/gpt-oss-20b:free', // modèle par défaut
        messages: [{ role: 'user', content: prompt }], // le role 'user' est un type de requéte dans l'api de openAI, pas nos users
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 1000,
      })

      // 📤 Retourne le texte généré par le modèle
      return response.choices[0]?.message?.content || ''
    } catch (error) {
      console.error('OpenAI API error:', error)
      throw new Error('Failed to generate text with OpenAI')
    }
  }
}
