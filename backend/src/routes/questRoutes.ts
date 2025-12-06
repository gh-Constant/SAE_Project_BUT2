import { Router } from 'express';
import * as questController from '../controllers/quest.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
// import { isPrestataireOfLocation } from '../middleware/location.middleware'; // Assuming this exists or similar

const router = Router();

// Public routes - viewing quests doesn't require auth
router.get('/locations/:locationId', questController.getQuestsByLocation);

// Authenticated routes
router.get('/my-quests', authenticateToken, questController.getUserQuests);

// Create quest - Needs to be prestataire of the location
import { checkLocationOwnership } from '../middleware/location.middleware.js';

router.post('/', authenticateToken, checkLocationOwnership, questController.createQuest); 

// Accept/Complete
router.post('/:questId/accept', authenticateToken, questController.acceptQuest);
router.post('/:questId/complete', authenticateToken, questController.completeQuest);

export default router;
