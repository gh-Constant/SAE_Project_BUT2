/**
 * @file quiz.ts
 * @description Types for the quiz/QCM system
 */

export interface Quiz {
    id_quiz: number;
    title: string;
    description?: string;
    image_url?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    id_location: number;
    id_creator: number;
    location?: {
        id_location: number;
        name: string;
    };
    creator?: {
        id_user: number;
        firstname: string;
        lastname: string;
    };
    questions?: QuizQuestion[];
    _count?: {
        attempts: number;
    };
}

export interface QuizQuestion {
    id_question: number;
    content: string; // HTML content from TipTap editor
    image_url?: string;
    order_index: number;
    id_quiz: number;
    answers: QuizAnswer[];
}

export interface QuizAnswer {
    id_answer: number;
    content: string;
    is_correct?: boolean; // Hidden during play
    order_index: number;
    id_question: number;
}

export interface UserQuizAttempt {
    id_attempt: number;
    score: number;
    total_questions: number;
    completed_at?: string;
    created_at: string;
    id_user: number;
    id_quiz: number;
    quiz?: {
        id_quiz: number;
        title: string;
        image_url?: string;
    };
    answers?: UserQuizAnswer[];
}

export interface UserQuizAnswer {
    id_user_answer: number;
    is_correct: boolean;
    id_attempt: number;
    id_question: number;
    id_answer: number;
    question?: QuizQuestion;
    answer?: QuizAnswer;
}

// Input types for creating/updating quizzes
export interface CreateQuizInput {
    title: string;
    description?: string;
    image_url?: string;
    id_location: number;
    questions: CreateQuestionInput[];
}

export interface CreateQuestionInput {
    content: string;
    image_url?: string;
    order_index: number;
    answers: CreateAnswerInput[];
}

export interface CreateAnswerInput {
    content: string;
    is_correct: boolean;
    order_index: number;
}

export interface UpdateQuizInput {
    title?: string;
    description?: string;
    image_url?: string;
    is_active?: boolean;
    questions?: CreateQuestionInput[];
}

// Submission types
export interface QuizSubmission {
    answers: { id_question: number; id_answer: number }[];
}

export interface QuizResult {
    attempt: UserQuizAttempt;
    score: number;
    totalQuestions: number;
    percentage: number;
}

// Statistics
export interface QuizStatistics {
    totalAttempts: number;
    averageScore: number;
    attempts: UserQuizAttempt[];
}
