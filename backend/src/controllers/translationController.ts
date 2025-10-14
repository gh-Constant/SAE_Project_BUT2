import { Request, Response } from 'express'

interface TranslationRequest {
  text: string
  from?: string
  to?: string
}

interface TranslationResponse {
  translatedText: string
  originalText: string
}

export const translateText = async (req: Request, res: Response): Promise<void> => {
  try {
    const { text }: TranslationRequest = req.body

    if (!text || typeof text !== 'string') {
      res.status(400).json({
        error: 'Invalid request: text is required and must be a string'
      })
      return
    }

    // For now, just add "translated:" prefix as mock translation
    // In a real implementation, you would call a translation API like Google Translate, DeepL, etc.
    const translatedText = `translated by server : ${text}`

    const response: TranslationResponse = {
      translatedText,
      originalText: text
    }

    res.json(response)
  } catch (error) {
    console.error('Translation error:', error)
    res.status(500).json({
      error: 'Internal server error during translation'
    })
  }
}