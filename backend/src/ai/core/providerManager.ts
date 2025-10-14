import { AIProvider } from './aiProvider.interface.js'

export class ProviderManager {
  private providers: Map<string, AIProvider> = new Map()

  registerProvider(name: string, provider: AIProvider): void {
    this.providers.set(name, provider)
  }

  getProvider(name: string): AIProvider | undefined {
    return this.providers.get(name)
  }

  getDefaultProvider(): AIProvider | undefined {
    // Return the first registered provider as default
    return this.providers.values().next().value
  }

  listProviders(): string[] {
    return Array.from(this.providers.keys())
  }
}

export const providerManager = new ProviderManager()