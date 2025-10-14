import { Router } from 'express'
import { translateText } from '../controllers/translationController.js'

const router = Router()

// POST /api/translate
router.post('/translate', translateText)

export default router