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
    UserQuizAnswer,
} from '@/types/quiz';
import { mockQuizzes, mockQuestions, mockUserAttempts, mockUserAnswers, getQuizWithQuestions } from '@/mocks/quizzes';
import { useAuthStore } from '@/stores/auth';

import type { QuizzesResponse, TopAdventurer } from '@/services/quizService';

// Store for mock data 
const quizzes = [...mockQuizzes];
const attempts = [...mockUserAttempts];
let nextQuizId = Math.max(...quizzes.map(q => q.id_quiz)) + 1;
let nextAttemptId = 3;
let nextQuestionId = 100;
let nextAnswerId = 100;

// Helper to generate mock questions if missing
function generateMockQuestions(id_quiz: number, count: number): import('@/types/quiz').QuizQuestion[] {
    return Array.from({ length: count }).map((_, i) => {
        const qId = nextQuestionId++;
        return {
            id_question: qId,
            content: `<p>Question générée automatiquement #${i + 1} du quiz ${id_quiz}</p>`,
            answers: [
                { id_answer: nextAnswerId++, content: 'Vrai', is_correct: true, order_index: 0, id_question: qId },
                { id_answer: nextAnswerId++, content: 'Faux', is_correct: false, order_index: 1, id_question: qId },
                { id_answer: nextAnswerId++, content: 'Peut-être', is_correct: false, order_index: 2, id_question: qId },
                { id_answer: nextAnswerId++, content: 'Je ne sais pas', is_correct: false, order_index: 3, id_question: qId }
            ],
            order_index: i,
            id_quiz
        };
    });
}

// Mock top adventurers data
const mockTopAdventurers: TopAdventurer[] = [
    { id: 10, name: 'Margot L\'Exploratrice', completedQuizzes: 7, uniqueQuizzes: 7 },
    { id: 7, name: 'Thomas Le Brave', completedQuizzes: 6, uniqueQuizzes: 6 },
    { id: 8, name: 'Jeanne La Courageuse', completedQuizzes: 5, uniqueQuizzes: 5 },
    { id: 2, name: 'Alice L\'Aventurière', completedQuizzes: 4, uniqueQuizzes: 4 },
    { id: 9, name: 'Léon Le Curieux', completedQuizzes: 3, uniqueQuizzes: 3 },
];

export const quizMockService = {
    /**
     * Get all quizzes with optional filters
     */
    async getQuizzes(filters?: {
        id_location?: number;
        id_creator?: number;
        is_active?: boolean;
    }): Promise<QuizzesResponse> {
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

        return {
            quizzes: result,
            topAdventurers: mockTopAdventurers
        };
    },

    /**
     * Get a quiz by ID with all questions and answers
     */
    async getQuizById(id_quiz: number): Promise<Quiz | null> {
        await delay(150);
        const quiz = quizzes.find(q => q.id_quiz === id_quiz);
        if (!quiz) return null;

        // If quiz already has questions (newly created/updated), return it
        if (quiz.questions && quiz.questions.length > 0) {
            return quiz;
        }

        // Otherwise try to find matching questions in mock data
        let questions = mockQuestions.filter(q => q.id_quiz === id_quiz);

        // If still no questions but we have a count, generate them
        if (questions.length === 0 && quiz._count && quiz._count.questions && quiz._count.questions > 0) {
            questions = generateMockQuestions(id_quiz, quiz._count.questions);
            // Attach to quiz locally so they persist for this session
            quiz.questions = questions;
        }

        return {
            ...quiz,
            questions: questions.length > 0 ? questions : [],
        };
    },

    /**
     * Get quiz for playing (hides correct answers)
     */
    async getQuizForPlay(id_quiz: number): Promise<Quiz | null> {
        await delay(150);

        let quiz = quizzes.find(q => q.id_quiz === id_quiz);
        if (!quiz) return null;

        // Ensure questions are attached
        if (!quiz.questions || quiz.questions.length === 0) {
            let questions = mockQuestions.filter(q => q.id_quiz === id_quiz);
            if (questions.length === 0 && quiz._count?.questions && quiz._count.questions > 0) {
                questions = generateMockQuestions(id_quiz, quiz._count.questions);
                quiz.questions = questions;
            }

            if (questions.length > 0) {
                quiz = { ...quiz, questions };
            }
        }

        if (!quiz || !quiz.is_active) return null;

        // Clone to avoid mutating storage
        const quizForPlay = JSON.parse(JSON.stringify(quiz)) as Quiz;

        // Hide correct answers
        if (quizForPlay.questions) {
            quizForPlay.questions = quizForPlay.questions.map(q => ({
                ...q,
                answers: q.answers.map(a => ({
                    id_answer: a.id_answer,
                    content: a.content,
                    order_index: a.order_index,
                    id_question: a.id_question,
                })),
            }));
        }

        return quizForPlay;
    },

    /**
     * Create a new quiz
     */
    async createQuiz(input: CreateQuizInput): Promise<Quiz> {
        await delay(300);

        const id_quiz = nextQuizId++;

        const newQuiz: Quiz = {
            id_quiz,
            title: input.title,
            description: input.description,
            image_url: input.image_url,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            id_location: input.id_location,
            id_creator: 1,
            questions: input.questions.map(q => ({
                id_question: nextQuestionId++,
                content: q.content,
                image_url: q.image_url,
                order_index: q.order_index,
                id_quiz: id_quiz,
                answers: q.answers.map(a => ({
                    id_answer: nextAnswerId++,
                    content: a.content,
                    is_correct: a.is_correct,
                    order_index: a.order_index,
                    id_question: nextQuestionId
                }))
            })),
            _count: { attempts: 0 },
        };

        if (newQuiz.questions) {
            newQuiz.questions.forEach(q => {
                q.answers.forEach(a => {
                    a.id_question = q.id_question;
                });
            });
        }

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

        // Destructure questions to avoid type mismatch when merging with Quiz
        const { questions, ...restInput } = input;

        const updatedQuiz: Quiz = {
            ...quizzes[index],
            ...restInput,
            updated_at: new Date().toISOString(),
        };

        // Handle question transformation if questions are updated
        if (questions) {
            updatedQuiz.questions = questions.map(q => {
                const qId = nextQuestionId++;
                return {
                    id_question: qId,
                    content: q.content,
                    image_url: q.image_url,
                    order_index: q.order_index,
                    id_quiz: id_quiz,
                    answers: q.answers.map(a => ({
                        id_answer: nextAnswerId++,
                        content: a.content,
                        is_correct: a.is_correct,
                        order_index: a.order_index,
                        id_question: qId
                    }))
                };
            });
        }

        quizzes[index] = updatedQuiz;

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

        const quiz = quizzes.find(q => q.id_quiz === id_quiz);
        if (!quiz) {
            throw new Error('Quiz not found');
        }

        let questions = quiz.questions;
        if (!questions || questions.length === 0) {
            questions = mockQuestions.filter(q => q.id_quiz === id_quiz);
            if (questions.length === 0 && quiz._count?.questions && quiz._count.questions > 0) {
                questions = generateMockQuestions(id_quiz, quiz._count.questions);
                quiz.questions = questions;
            }
        }

        if (!questions || questions.length === 0) {
            throw new Error('Quiz has no questions');
        }

        // Calculate score
        let score = 0;
        const totalQuestions = questions.length;

        const userAnswers: UserQuizAnswer[] = [];

        for (const userAnswer of submission.answers) {
            const question = questions.find(q => q.id_question === userAnswer.id_question);
            if (question) {
                const correctAnswer = question.answers.find(a => a.is_correct);
                const isCorrect = correctAnswer?.id_answer === userAnswer.id_answer;

                if (isCorrect) {
                    score++;
                }

                userAnswers.push({
                    id_user_answer: nextAnswerId++, // Using nextAnswerId as a simple counter for mock IDs
                    id_attempt: nextAttemptId,
                    id_question: userAnswer.id_question,
                    id_answer: userAnswer.id_answer,
                    is_correct: isCorrect
                });
            }
        }

        const authStore = useAuthStore();
        const userId = authStore.user?.id || 2; // Fallback to 2 only if not logged in (shield for testing)

        const attempt: UserQuizAttempt = {
            id_attempt: nextAttemptId++,
            score,
            total_questions: totalQuestions,
            completed_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            id_user: userId,
            id_quiz,
            quiz: {
                id_quiz: quiz.id_quiz,
                title: quiz.title,
                image_url: quiz.image_url,
            },
            answers: userAnswers
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

        // Ensure answers are present (from static mock or dynamic attempt)
        let answers = attempt.answers;
        if (!answers || answers.length === 0) {
            answers = mockUserAnswers.filter(a => a.id_attempt === id_attempt);
        }

        return {
            ...attempt,
            answers,
            quiz: quiz || undefined,
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

    /**
     * Check if a question answer is correct
     */
    async checkQuestion(id_quiz: number, id_question: number): Promise<{ correctAnswers: number[] }> {
        await delay(150);

        const quiz = quizzes.find(q => q.id_quiz === id_quiz);
        if (!quiz) {
            throw new Error("Quiz not found");
        }

        // Ensure questions are attached for lookup
        let questions = quiz.questions;
        if (!questions || questions.length === 0) {
            questions = mockQuestions.filter(q => q.id_quiz === id_quiz);
            if (questions.length === 0 && quiz._count?.questions && quiz._count.questions > 0) {
                questions = generateMockQuestions(id_quiz, quiz._count.questions);
                // Important: persist generated questions to quiz so indices and IDs remain consistent for check
                quiz.questions = questions;
            }
        }

        if (!questions) {
            throw new Error("Quiz has no questions");
        }

        const question = questions.find(q => q.id_question === id_question);
        if (!question) {
            throw new Error("Question not found");
        }

        const correctAnswers = question.answers
            .filter(a => a.is_correct)
            .map(a => a.id_answer);

        return { correctAnswers };
    },
};

function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
