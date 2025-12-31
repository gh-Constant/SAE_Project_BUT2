/**
 * @file quizMockService.ts
 * @description Mock service for quiz operations
 */

import type {
    Quiz,
    UserQuizAttempt,
    CreateQuizInput,
    UpdateQuizInput,
    QuizSubmission,
    QuizResult,
    QuizStatistics,
} from '@/types/quiz';
import { mockQuizzes, mockQuestions, mockUserAttempts, getQuizWithQuestions } from '@/mocks/quiz';

// Store for mock data (allows modifications)
let quizzes = [...mockQuizzes];
let attempts = [...mockUserAttempts];
let nextQuizId = 4;
let nextAttemptId = 3;

export const quizMockService = {
    /**
     * Get all quizzes with optional filters
     */
    async getQuizzes(filters?: {
        id_location?: number;
        id_creator?: number;
        is_active?: boolean;
    }): Promise<Quiz[]> {
        await delay(200);

        let result = [...quizzes];

        if (filters?.id_location) {
            result = result.filter(q => q.id_location === filters.id_location);
        }
        if (filters?.id_creator) {
            result = result.filter(q => q.id_creator === filters.id_creator);
        }
        if (filters?.is_active !== undefined) {
            result = result.filter(q => q.is_active === filters.is_active);
        }

        return result;
    },

    /**
     * Get a quiz by ID with all questions and answers
     */
    async getQuizById(id_quiz: number): Promise<Quiz | null> {
        await delay(150);
        return getQuizWithQuestions(id_quiz) || null;
    },

    /**
     * Get quiz for playing (hides correct answers)
     */
    async getQuizForPlay(id_quiz: number): Promise<Quiz | null> {
        await delay(150);
        const quiz = getQuizWithQuestions(id_quiz);

        if (!quiz || !quiz.is_active) return null;

        // Hide correct answers
        if (quiz.questions) {
            quiz.questions = quiz.questions.map(q => ({
                ...q,
                answers: q.answers.map(a => ({
                    id_answer: a.id_answer,
                    content: a.content,
                    order_index: a.order_index,
                    id_question: a.id_question,
                    // is_correct is intentionally omitted
                })),
            }));
        }

        return quiz;
    },

    /**
     * Create a new quiz
     */
    async createQuiz(input: CreateQuizInput): Promise<Quiz> {
        await delay(300);

        const newQuiz: Quiz = {
            id_quiz: nextQuizId++,
            title: input.title,
            description: input.description,
            image_url: input.image_url,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            id_location: input.id_location,
            id_creator: 1, // Mock: assume current user is creator
            _count: { attempts: 0 },
        };

        quizzes.push(newQuiz);
        return newQuiz;
    },

    /**
     * Update a quiz
     */
    async updateQuiz(id_quiz: number, input: UpdateQuizInput): Promise<Quiz | null> {
        await delay(300);

        const index = quizzes.findIndex(q => q.id_quiz === id_quiz);
        if (index === -1) return null;

        quizzes[index] = {
            ...quizzes[index],
            ...input,
            updated_at: new Date().toISOString(),
        };

        return quizzes[index];
    },

    /**
     * Delete a quiz
     */
    async deleteQuiz(id_quiz: number): Promise<boolean> {
        await delay(200);

        const index = quizzes.findIndex(q => q.id_quiz === id_quiz);
        if (index === -1) return false;

        quizzes.splice(index, 1);
        return true;
    },

    /**
     * Submit quiz answers
     */
    async submitQuiz(id_quiz: number, submission: QuizSubmission): Promise<QuizResult> {
        await delay(500);

        const quiz = getQuizWithQuestions(id_quiz);
        if (!quiz || !quiz.questions) {
            throw new Error('Quiz not found');
        }

        // Calculate score
        let score = 0;
        const totalQuestions = quiz.questions.length;

        for (const userAnswer of submission.answers) {
            const question = quiz.questions.find(q => q.id_question === userAnswer.id_question);
            if (question) {
                const correctAnswer = question.answers.find(a => a.is_correct);
                if (correctAnswer?.id_answer === userAnswer.id_answer) {
                    score++;
                }
            }
        }

        const attempt: UserQuizAttempt = {
            id_attempt: nextAttemptId++,
            score,
            total_questions: totalQuestions,
            completed_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            id_user: 2, // Mock current user
            id_quiz,
            quiz: {
                id_quiz: quiz.id_quiz,
                title: quiz.title,
                image_url: quiz.image_url,
            },
        };

        attempts.push(attempt);

        return {
            attempt,
            score,
            totalQuestions,
            percentage: Math.round((score / totalQuestions) * 100),
        };
    },

    /**
     * Get user's quiz attempts
     */
    async getMyAttempts(id_quiz?: number): Promise<UserQuizAttempt[]> {
        await delay(200);

        let result = [...attempts];

        if (id_quiz) {
            result = result.filter(a => a.id_quiz === id_quiz);
        }

        return result.sort((a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    },

    /**
     * Get attempt details
     */
    async getAttemptDetails(id_attempt: number): Promise<UserQuizAttempt | null> {
        await delay(200);

        const attempt = attempts.find(a => a.id_attempt === id_attempt);
        if (!attempt) return null;

        // Add full quiz data
        const quiz = getQuizWithQuestions(attempt.id_quiz);
        return {
            ...attempt,
            quiz: quiz ? {
                id_quiz: quiz.id_quiz,
                title: quiz.title,
                image_url: quiz.image_url,
            } : undefined,
        };
    },

    /**
     * Get quiz statistics
     */
    async getQuizStatistics(id_quiz: number): Promise<QuizStatistics> {
        await delay(200);

        const quizAttempts = attempts.filter(a => a.id_quiz === id_quiz);
        const totalAttempts = quizAttempts.length;

        const averageScore = totalAttempts > 0
            ? quizAttempts.reduce((sum, a) => sum + (a.score / a.total_questions) * 100, 0) / totalAttempts
            : 0;

        return {
            totalAttempts,
            averageScore: Math.round(averageScore),
            attempts: quizAttempts,
        };
    },
};

// Helper function for simulating network delay
function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
