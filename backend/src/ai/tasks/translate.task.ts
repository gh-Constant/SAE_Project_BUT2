/**
 * @file translate.task.ts
 * @description
 * Définition de la tâche de traduction, utilisant un modèle de langage.
 * Cette tâche prend en entrée un texte et le traduit via le client IA.
 *
 * @utilité
 * - Fournit une logique claire pour la traduction.
 * - Formate un prompt cohérent pour les modèles d'IA.
 * - Peut être étendue ou remplacée par d’autres implémentations (résumé, correction, etc.).
 *
 * @exports
 * - `TranslateTask` : classe gérant la logique de traduction.
 *
 * @defauts
 * - Les taches ne peuvent utiliser qu'un client AI vu qu'ils sont attaché à un client seulement.
 */

import { AIClient } from '../core/aiClient.js'

export interface TranslateOptions {
  text: string
  targetLanguage: string
  sourceLanguage?: string
}

export class TranslateTask {
  private aiClient: AIClient

  constructor(aiClient: AIClient) {
    this.aiClient = aiClient
  }

  /**
   * Exécute la tâche de traduction.
   */
  async execute(options: TranslateOptions): Promise<string> {
    const { text, targetLanguage, sourceLanguage } = options

    //  Génération du prompt clair et structuré pour le modèle
    const prompt = this.buildTranslationPrompt(text, targetLanguage, sourceLanguage)

    //  Appel au modèle IA pour générer le texte traduit
    const translatedText = await this.aiClient.generateText(prompt, {
      temperature: 0.3, // Température faible → traduction plus cohérente
      maxTokens: 1000,  // Longueur maximale de la réponse
      model: 'openai/gpt-oss-20b:free' // Modèle par défaut (modifiable)
    })

    return translatedText.trim()
  }

  /**
   * Construit un prompt explicite pour le modèle IA.
   */
  private buildTranslationPrompt(text: string, targetLanguage: string, sourceLanguage?: string): string {
    const sourceLang = sourceLanguage ? ` from ${sourceLanguage}` : ''
    return `Translate the following text${sourceLang} to ${targetLanguage}. Only return the translated text without any additional comments or explanations: Text: "${text}" Translation:`
  }
}
