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

  async execute(options: TranslateOptions): Promise<string> {
    const { text, targetLanguage, sourceLanguage } = options

    const prompt = this.buildTranslationPrompt(text, targetLanguage, sourceLanguage)

    const translatedText = await this.aiClient.generateText(prompt, {
      temperature: 0.3, // Lower temperature for more consistent translations
      maxTokens: 1000,
      model: 'openai/gpt-oss-20b:free' // Use OpenRouter's free GPT-OSS model
    })

    return translatedText.trim()
  }

  private buildTranslationPrompt(text: string, targetLanguage: string, sourceLanguage?: string): string {
    const sourceLang = sourceLanguage ? ` from ${sourceLanguage}` : ''
    return `Translate the following text${sourceLang} to ${targetLanguage}. Only return the translated text without any additional comments or explanations:

Text: "${text}"

Translation:`
  }
}