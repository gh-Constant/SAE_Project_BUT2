import OpenAI from 'openai'
import { AIProvider, AIProviderConfig } from '../core/aiProvider.interface.js'

export class OpenAIProvider implements AIProvider {
  private client: OpenAI

  constructor(config: AIProviderConfig) {
    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseURL || 'https://api.openai.com/v1', // Default to OpenAI, but allow custom baseURL for OpenRouter
    })
  }

  async generateText(prompt: string, options?: { temperature?: number; maxTokens?: number; model?: string }): Promise<string> {
    try {
      const response = await this.client.chat.completions.create({
        model: options?.model || 'gpt-3.5-turbo', // Use provided model or default
        messages: [{ role: 'user', content: prompt }],
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 1000,
      })

      return response.choices[0]?.message?.content || ''
    } catch (error) {
      console.error('OpenAI API error:', error)
      throw new Error('Failed to generate text with OpenAI')
    }
  }
}