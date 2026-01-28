import { Router } from 'express';
import * as questController from '../controllers/quest.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
// import { isPrestataireOfLocation } from '../middleware/location.middleware'; // Assuming this exists or similar

const router = Router();

// Admin routes (requires auth)
router.get('/', authenticateToken, questController.getAllQuests);
router.get('/statistics', authenticateToken, questController.getStatistics);

// Public routes - viewing quests doesn't require auth
router.get('/locations/:locationId', questController.getQuestsByLocation);

// Authenticated routes
router.get('/my-quests', authenticateToken, questController.getUserQuests);

// Create quest - Needs to be prestataire of the location
import { checkLocationOwnership, checkQuestLocationOwnership } from '../middleware/location.middleware.js';

router.post('/', authenticateToken, checkLocationOwnership, questController.createQuest);

// Accept/Complete/Cancel
router.post('/:questId/accept', authenticateToken, questController.acceptQuest);
router.post('/:questId/complete', authenticateToken, questController.completeQuest);
router.post('/:questId/cancel', authenticateToken, questController.cancelQuest);

// Prestataire update/delete (requires ownership of location)
router.put('/:questId', authenticateToken, checkQuestLocationOwnership, questController.updateQuest);
router.delete('/:questId', authenticateToken, checkQuestLocationOwnership, questController.deleteQuest);

export default router;
