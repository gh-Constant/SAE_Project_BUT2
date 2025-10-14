import { AIClient } from './core/aiClient.js'
import { providerManager } from './core/providerManager.js'
import { OpenAIProvider } from './providers/openAI.provider.js'
import { TranslateTask } from './tasks/translate.task.js'

export class AIService {
  private aiClient: AIClient
  private translateTask: TranslateTask

  constructor() {
    // Initialize OpenAI provider (supports both OpenAI and OpenRouter)
    const openAIProvider = new OpenAIProvider({
      apiKey: process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY || '',
      baseURL: process.env.OPENAI_BASE_URL || (process.env.OPENROUTER_API_KEY ? 'https://openrouter.ai/api/v1' : undefined),
    })

    // Register the provider
    providerManager.registerProvider('openai', openAIProvider)

    // Initialize AI client with default provider
    this.aiClient = new AIClient()

    // Initialize tasks
    this.translateTask = new TranslateTask(this.aiClient)
  }

  async translateText(text: string, targetLanguage: string, sourceLanguage?: string): Promise<string> {
    return this.translateTask.execute({
      text,
      targetLanguage,
      sourceLanguage,
    })
  }
}

// Export singleton instance
export const aiService = new AIService()