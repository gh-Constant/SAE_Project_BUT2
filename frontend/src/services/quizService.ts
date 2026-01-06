/**
 * @file quizService.ts
 * @description Unified quiz service that switches between mock and API implementation
 */

import { quizMockService } from './mock/quizMockService';
import type {
    Quiz,
    UserQuizAttempt,
    CreateQuizInput,
    UpdateQuizInput,
    QuizSubmission,
    QuizResult,
    QuizStatistics,
} from '@/types/quiz';

const isMockEnabled = import.meta.env.VITE_NO_BACKEND === 'true';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Helper for API requests
async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = localStorage.getItem('authToken');

    const response = await fetch(`${API_BASE_URL}/api/v1${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || error.error || 'Request failed');
    }

    // Handle 204 No Content
    if (response.status === 204) {
        return {} as T;
    }

    return response.json();
}

// API implementation
const quizApiService = {
    async getQuizzes(filters?: {
        id_location?: number;
        id_creator?: number;
        is_active?: boolean;
    }): Promise<Quiz[]> {
        const params = new URLSearchParams();
        if (filters?.id_location) params.set('location_id', String(filters.id_location));
        if (filters?.id_creator) params.set('creator_id', String(filters.id_creator));
        if (filters?.is_active !== undefined) params.set('active', String(filters.is_active));

        const queryString = params.toString();
        return apiRequest<Quiz[]>(`/quizzes${queryString ? `?${queryString}` : ''}`);
    },

    async getQuizById(id_quiz: number): Promise<Quiz | null> {
        try {
            return await apiRequest<Quiz>(`/quizzes/${id_quiz}`);
        } catch {
            return null;
        }
    },

    async getQuizForPlay(id_quiz: number): Promise<Quiz | null> {
        try {
            return await apiRequest<Quiz>(`/quizzes/${id_quiz}/play`);
        } catch {
            return null;
        }
    },

    async createQuiz(input: CreateQuizInput): Promise<Quiz> {
        return apiRequest<Quiz>('/quizzes', {
            method: 'POST',
            body: JSON.stringify(input),
        });
    },

    async updateQuiz(id_quiz: number, input: UpdateQuizInput): Promise<Quiz | null> {
        try {
            return await apiRequest<Quiz>(`/quizzes/${id_quiz}`, {
                method: 'PUT',
                body: JSON.stringify(input),
            });
        } catch {
            return null;
        }
    },

    async deleteQuiz(id_quiz: number): Promise<boolean> {
        try {
            await apiRequest<void>(`/quizzes/${id_quiz}`, { method: 'DELETE' });
            return true;
        } catch {
            return false;
        }
    },

    async submitQuiz(id_quiz: number, submission: QuizSubmission): Promise<QuizResult> {
        return apiRequest<QuizResult>(`/quizzes/${id_quiz}/submit`, {
            method: 'POST',
            body: JSON.stringify(submission),
        });
    },

    async getMyAttempts(id_quiz?: number): Promise<UserQuizAttempt[]> {
        const params = id_quiz ? `?quiz_id=${id_quiz}` : '';
        return apiRequest<UserQuizAttempt[]>(`/quizzes/my-attempts${params}`);
    },

    async getAttemptDetails(id_attempt: number): Promise<UserQuizAttempt | null> {
        try {
            return await apiRequest<UserQuizAttempt>(`/quizzes/attempts/${id_attempt}`);
        } catch {
            return null;
        }
    },

    async getQuizStatistics(id_quiz: number): Promise<QuizStatistics> {
        return apiRequest<QuizStatistics>(`/quizzes/${id_quiz}/statistics`);
    },

    async checkQuestion(id_quiz: number, id_question: number): Promise<{ correctAnswers: number[] }> {
        return apiRequest<{ correctAnswers: number[] }>(`/quizzes/${id_quiz}/question/${id_question}/check`);
    },
};

// Export the appropriate service based on environment
export const quizService = isMockEnabled ? quizMockService : quizApiService;

// Re-export types for convenience
export type {
    Quiz,
    QuizQuestion,
    QuizAnswer,
    UserQuizAttempt,
    UserQuizAnswer,
    CreateQuizInput,
    UpdateQuizInput,
    QuizSubmission,
    QuizResult,
    QuizStatistics,
} from '@/types/quiz';
