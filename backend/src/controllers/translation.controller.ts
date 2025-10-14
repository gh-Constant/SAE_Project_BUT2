import { Request, Response } from 'express'
import { aiService } from '../ai/ai.service.js'

interface TranslationRequest {
  text: string
  targetLanguage?: string
}

interface TranslationResponse {
  translatedText: string
  originalText: string
}

export const translateText = async (req: Request, res: Response): Promise<void> => {
  try {
    const { text, targetLanguage = 'english' }: TranslationRequest = req.body

    if (!text || typeof text !== 'string') {
      res.status(400).json({
        error: 'Invalid request: text is required and must be a string'
      })
      return
    }

    // Use AI service for translation
    const translatedText = await aiService.translateText(text, targetLanguage)

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