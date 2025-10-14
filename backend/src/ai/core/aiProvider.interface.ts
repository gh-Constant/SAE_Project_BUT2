export interface AIProvider {
  generateText(prompt: string, options?: { temperature?: number; maxTokens?: number; model?: string }): Promise<string>
}

export interface AIProviderConfig {
  apiKey: string
  model?: string
  baseURL?: string
}