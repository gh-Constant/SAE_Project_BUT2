import { Request, Response } from 'express';
import * as quizService from '../services/quizService.js';
import { asyncHandler } from '../middleware/error.middleware.js';

// Get all quizzes
export const getQuizzes = asyncHandler(async (req: Request, res: Response) => {
    const { location_id, creator_id, active } = req.query;

    const quizzes = await quizService.getQuizzes({
        id_location: location_id ? Number(location_id) : undefined,
        id_creator: creator_id ? Number(creator_id) : undefined,
        is_active: active !== undefined ? active === 'true' : undefined,
    });

    res.json(quizzes);
});

// Get a single quiz by ID
export const getQuizById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const quiz = await quizService.getQuizById(Number(id));

    if (!quiz) {
        res.status(404).json({ error: 'Quiz not found' });
        return;
    }

    res.json(quiz);
});

// Get quiz for playing (hides correct answers)
export const getQuizForPlay = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const quiz = await quizService.getQuizForPlay(Number(id));

    if (!quiz) {
        res.status(404).json({ error: 'Quiz not found or inactive' });
        return;
    }

    res.json(quiz);
});

// Create a new quiz
export const createQuiz = asyncHandler(async (req: Request, res: Response) => {
    const { title, description, image_url, id_location, questions } = req.body;
    const userId = (req as Request & { user?: { id_user: number } }).user?.id_user;

    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    if (!title || !id_location || !questions || !Array.isArray(questions)) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }

    const quiz = await quizService.createQuiz({
        title,
        description,
        image_url,
        id_location: Number(id_location),
        id_creator: userId,
        questions,
    });

    res.status(201).json(quiz);
});

// Update a quiz
export const updateQuiz = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req as Request & { user?: { id_user: number; role: string } }).user?.id_user;
    const userRole = (req as Request & { user?: { id_user: number; role: string } }).user?.role;

    const existingQuiz = await quizService.getQuizById(Number(id));

    if (!existingQuiz) {
        res.status(404).json({ error: 'Quiz not found' });
        return;
    }

    // Check ownership or admin role
    if (existingQuiz.id_creator !== userId && userRole !== 'admin') {
        res.status(403).json({ error: 'Not authorized to update this quiz' });
        return;
    }

    const quiz = await quizService.updateQuiz(Number(id), req.body);
    res.json(quiz);
});

// Delete a quiz
export const deleteQuiz = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req as Request & { user?: { id_user: number; role: string } }).user?.id_user;
    const userRole = (req as Request & { user?: { id_user: number; role: string } }).user?.role;

    const existingQuiz = await quizService.getQuizById(Number(id));

    if (!existingQuiz) {
        res.status(404).json({ error: 'Quiz not found' });
        return;
    }

    // Check ownership or admin role
    if (existingQuiz.id_creator !== userId && userRole !== 'admin') {
        res.status(403).json({ error: 'Not authorized to delete this quiz' });
        return;
    }

    await quizService.deleteQuiz(Number(id));
    res.status(204).send();
});

// Submit quiz answers
export const submitQuiz = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { answers } = req.body;
    const userId = (req as Request & { user?: { id_user: number } }).user?.id_user;

    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    if (!answers || !Array.isArray(answers)) {
        res.status(400).json({ error: 'Answers are required' });
        return;
    }

    const result = await quizService.submitQuizAttempt({
        id_quiz: Number(id),
        id_user: userId,
        answers,
    });

    res.json(result);
});

// Get user's quiz attempts
export const getMyAttempts = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as Request & { user?: { id_user: number } }).user?.id_user;
    const { quiz_id } = req.query;

    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    const attempts = await quizService.getUserQuizAttempts(
        userId,
        quiz_id ? Number(quiz_id) : undefined
    );

    res.json(attempts);
});

// Get attempt details
export const getAttemptDetails = asyncHandler(async (req: Request, res: Response) => {
    const { attemptId } = req.params;
    const userId = (req as Request & { user?: { id_user: number } }).user?.id_user;

    const attempt = await quizService.getAttemptDetails(Number(attemptId));

    if (!attempt) {
        res.status(404).json({ error: 'Attempt not found' });
        return;
    }

    // Check if the user owns this attempt
    if (attempt.id_user !== userId) {
        res.status(403).json({ error: 'Not authorized to view this attempt' });
        return;
    }

    res.json(attempt);
});

// Get quiz statistics (for admin/prestataire)
export const getQuizStatistics = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req as Request & { user?: { id_user: number; role: string } }).user?.id_user;
    const userRole = (req as Request & { user?: { id_user: number; role: string } }).user?.role;

    const quiz = await quizService.getQuizById(Number(id));

    if (!quiz) {
        res.status(404).json({ error: 'Quiz not found' });
        return;
    }

    // Check ownership or admin role
    if (quiz.id_creator !== userId && userRole !== 'admin') {
        res.status(403).json({ error: 'Not authorized to view statistics' });
        return;
    }

    const statistics = await quizService.getQuizStatistics(Number(id));
    res.json(statistics);
});
