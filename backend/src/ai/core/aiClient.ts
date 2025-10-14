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
      const defaultProvider = providerManager.getDefaultProvider()
      if (!defaultProvider) {
        throw new Error('No default provider available')
      }
      this.provider = defaultProvider
    }
  }

  async generateText(prompt: string, options?: { temperature?: number; maxTokens?: number; model?: string }): Promise<string> {
    return this.provider.generateText(prompt, options)
  }

  setProvider(providerName: string): void {
    const provider = providerManager.getProvider(providerName)
    if (!provider) {
      throw new Error(`Provider '${providerName}' not found`)
    }
    this.provider = provider
  }
}