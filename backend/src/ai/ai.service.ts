/**
 * @file ai.service.ts
 * @description
 * Service principal d'intelligence artificielle.
 * Gère l'initialisation des fournisseurs (providers) et des tâches (tasks),
 * et expose une interface simple pour exécuter des fonctions d’IA, comme la traduction.
 *
 * @utilité
 * - Centralise la gestion des providers (comme OpenAI, OpenRouter...).
 * - Crée et gère un client IA générique (AIClient) pour interagir avec les API IA.
 * - Fournit des méthodes prêtes à l’emploi comme `translateText`.
 *
 * @exports
 * - `AIService` : classe principale du service IA.
 * - `aiService` : instance unique (singleton) du service.
 *
 * @remarques
 * - Utilise `providerManager` pour enregistrer et gérer les fournisseurs.
 * - Supporte plusieurs apis via les variables d’environnement (OpenAI, OpenRouter, etc.).
 */

import { AIClient } from './core/aiClient.js'
import { providerManager } from './core/providerManager.js'
import { OpenAIProvider } from './providers/openAI.provider.js'
import { TranslateTask } from './tasks/translate.task.js'

export class AIService {
  private openAIClient: AIClient
  private translateTask: TranslateTask

  constructor() {
    //  Initialisation du fournisseur OpenAI (compatible OpenRouter)
    const openAIProvider = new OpenAIProvider({
      apiKey: process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY || '',
      baseURL: process.env.OPENAI_BASE_URL ||
        (process.env.OPENROUTER_API_KEY ? 'https://openrouter.ai/api/v1' : undefined),
    })

    //  Enregistrement du provider dans le gestionnaire global
    providerManager.registerProvider('openai', openAIProvider)

    //  Création d’un client IA utilisant le provider "openai"
    this.openAIClient = new AIClient("openai")

    //  Initialisation de la tâche de traduction
    this.translateTask = new TranslateTask(this.openAIClient)
  }

  /**
   * Traduit un texte donné vers une langue cible.
   * @param text Texte à traduire
   * @param targetLanguage Langue cible (ex: 'fr', 'en', 'es')
   * @param sourceLanguage Langue source (optionnelle)
   * @returns Texte traduit
   */
  async translateText(text: string, targetLanguage: string, sourceLanguage?: string): Promise<string> {
    return this.translateTask.execute({ text, targetLanguage, sourceLanguage })
  }
}

//  Export d’une instance unique pour simplifier l’usage dans le backend
export const aiService = new AIService()
