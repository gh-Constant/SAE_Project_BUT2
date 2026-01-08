/**
 * @file quizRoutes.ts
 * @description Routes for quiz management (CRUD, play, submit, statistics)
 */

import { Router } from 'express';
import * as quizController from '../controllers/quiz.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { checkRole } from '../middleware/role.middleware.js';
import { Role } from '../prisma.js';

const router = Router();

// Public routes
router.get('/', quizController.getQuizzes);
router.get('/:id/play', quizController.getQuizForPlay);
router.get('/:id/question/:id_question/check', quizController.checkQuestion);

// Protected routes - any authenticated user
router.get('/my-attempts', authenticateToken, quizController.getMyAttempts);
router.get('/attempts/:attemptId', authenticateToken, quizController.getAttemptDetails);
router.post('/:id/submit', authenticateToken, quizController.submitQuiz);

// Protected routes - prestataire/admin only for full quiz details
router.get('/:id', authenticateToken, quizController.getQuizById);
router.get('/:id/statistics', authenticateToken, quizController.getQuizStatistics);

// Protected routes - prestataire/admin for CRUD
router.post(
    '/',
    authenticateToken,
    checkRole([Role.prestataire, Role.admin]),
    quizController.createQuiz
);

router.put(
    '/:id',
    authenticateToken,
    checkRole([Role.prestataire, Role.admin]),
    quizController.updateQuiz
);

router.delete(
    '/:id',
    authenticateToken,
    checkRole([Role.prestataire, Role.admin]),
    quizController.deleteQuiz
);

export default router;
