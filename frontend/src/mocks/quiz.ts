/**
 * @file quiz.ts
 * @description Mock data for quizzes
 */

import type { Quiz, QuizQuestion, QuizAnswer, UserQuizAttempt, UserQuizAnswer } from '@/types/quiz';

// Mock Quizzes
export const mockQuizzes: Quiz[] = [
    {
        id_quiz: 1,
        title: 'Quiz sur le Moyen Âge',
        description: 'Testez vos connaissances sur l\'époque médiévale !',
        image_url: '/images/quizzes/medieval.jpg',
        is_active: true,
        created_at: '2024-12-01T10:00:00Z',
        updated_at: '2024-12-01T10:00:00Z',
        id_location: 1,
        id_creator: 1,
        location: {
            id_location: 1,
            name: 'La Taverne du Lion',
        },
        creator: {
            id_user: 1,
            firstname: 'Gérard',
            lastname: 'Le Prestataire',
        },
        _count: {
            attempts: 45,
        },
    },
    {
        id_quiz: 2,
        title: 'Les Chevaliers et leurs Armes',
        description: 'Connaissez-vous les équipements des chevaliers ?',
        image_url: '/images/quizzes/knights.jpg',
        is_active: true,
        created_at: '2024-12-05T14:30:00Z',
        updated_at: '2024-12-05T14:30:00Z',
        id_location: 14,
        id_creator: 1,
        location: {
            id_location: 14,
            name: 'Merchant Stall #5',
        },
        creator: {
            id_user: 1,
            firstname: 'Gérard',
            lastname: 'Le Prestataire',
        },
        _count: {
            attempts: 23,
        },
    },
    {
        id_quiz: 3,
        title: 'La Gastronomie Médiévale',
        description: 'Que mangeait-on au Moyen Âge ?',
        image_url: '/images/quizzes/food.jpg',
        is_active: true,
        created_at: '2024-12-10T09:00:00Z',
        updated_at: '2024-12-10T09:00:00Z',
        id_location: 15,
        id_creator: 4,
        location: {
            id_location: 15,
            name: 'Merchant Stall #6',
        },
        creator: {
            id_user: 4,
            firstname: 'Marie',
            lastname: 'La Marchande',
        },
        _count: {
            attempts: 12,
        },
    },
];

// Mock Questions for Quiz 1
export const mockQuestions: QuizQuestion[] = [
    {
        id_question: 1,
        content: '<p>Quelle est la durée approximative du <strong>Moyen Âge</strong> en Europe ?</p>',
        image_url: undefined,
        order_index: 0,
        id_quiz: 1,
        answers: [
            { id_answer: 1, content: '500 ans', is_correct: false, order_index: 0, id_question: 1 },
            { id_answer: 2, content: '1000 ans', is_correct: true, order_index: 1, id_question: 1 },
            { id_answer: 3, content: '200 ans', is_correct: false, order_index: 2, id_question: 1 },
            { id_answer: 4, content: '1500 ans', is_correct: false, order_index: 3, id_question: 1 },
        ],
    },
    {
        id_question: 2,
        content: '<p>Quel événement marque traditionnellement le <em>début</em> du Moyen Âge ?</p>',
        image_url: undefined,
        order_index: 1,
        id_quiz: 1,
        answers: [
            { id_answer: 5, content: 'La chute de Rome', is_correct: true, order_index: 0, id_question: 2 },
            { id_answer: 6, content: 'La découverte de l\'Amérique', is_correct: false, order_index: 1, id_question: 2 },
            { id_answer: 7, content: 'La Révolution française', is_correct: false, order_index: 2, id_question: 2 },
            { id_answer: 8, content: 'L\'invention de l\'imprimerie', is_correct: false, order_index: 3, id_question: 2 },
        ],
    },
    {
        id_question: 3,
        content: '<p>Comment appelle-t-on le système économique et social du Moyen Âge ?</p>',
        image_url: undefined,
        order_index: 2,
        id_quiz: 1,
        answers: [
            { id_answer: 9, content: 'Le capitalisme', is_correct: false, order_index: 0, id_question: 3 },
            { id_answer: 10, content: 'Le communisme', is_correct: false, order_index: 1, id_question: 3 },
            { id_answer: 11, content: 'La féodalité', is_correct: true, order_index: 2, id_question: 3 },
            { id_answer: 12, content: 'La démocratie', is_correct: false, order_index: 3, id_question: 3 },
        ],
    },
    {
        id_question: 4,
        content: '<p>Quelle construction est typique de l\'architecture médiévale religieuse ?</p>',
        image_url: '/images/quizzes/cathedral.jpg',
        order_index: 3,
        id_quiz: 1,
        answers: [
            { id_answer: 13, content: 'Les pyramides', is_correct: false, order_index: 0, id_question: 4 },
            { id_answer: 14, content: 'Les cathédrales gothiques', is_correct: true, order_index: 1, id_question: 4 },
            { id_answer: 15, content: 'Les colisées', is_correct: false, order_index: 2, id_question: 4 },
            { id_answer: 16, content: 'Les temples grecs', is_correct: false, order_index: 3, id_question: 4 },
        ],
    },
    {
        id_question: 5,
        content: '<p>Quel était le rôle principal des <strong>chevaliers</strong> au Moyen Âge ?</p>',
        image_url: undefined,
        order_index: 4,
        id_quiz: 1,
        answers: [
            { id_answer: 17, content: 'Commerçants', is_correct: false, order_index: 0, id_question: 5 },
            { id_answer: 18, content: 'Guerriers au service d\'un seigneur', is_correct: true, order_index: 1, id_question: 5 },
            { id_answer: 19, content: 'Agriculteurs', is_correct: false, order_index: 2, id_question: 5 },
            { id_answer: 20, content: 'Artistes', is_correct: false, order_index: 3, id_question: 5 },
        ],
    },
];

// Get full quiz with questions
export function getQuizWithQuestions(id_quiz: number): Quiz | undefined {
    const quiz = mockQuizzes.find(q => q.id_quiz === id_quiz);
    if (!quiz) return undefined;

    const questions = mockQuestions.filter(q => q.id_quiz === id_quiz);
    return {
        ...quiz,
        questions,
    };
}

// Mock User Attempts
export const mockUserAttempts: UserQuizAttempt[] = [
    {
        id_attempt: 1,
        score: 4,
        total_questions: 5,
        completed_at: '2024-12-15T16:30:00Z',
        created_at: '2024-12-15T16:25:00Z',
        id_user: 2,
        id_quiz: 1,
        quiz: {
            id_quiz: 1,
            title: 'Quiz sur le Moyen Âge',
            image_url: '/images/quizzes/medieval.jpg',
        },
    },
    {
        id_attempt: 2,
        score: 3,
        total_questions: 5,
        completed_at: '2024-12-16T10:00:00Z',
        created_at: '2024-12-16T09:55:00Z',
        id_user: 2,
        id_quiz: 1,
        quiz: {
            id_quiz: 1,
            title: 'Quiz sur le Moyen Âge',
            image_url: '/images/quizzes/medieval.jpg',
        },
    },
];

// Mock User Answers for attempt 1
export const mockUserAnswers: UserQuizAnswer[] = [
    { id_user_answer: 1, is_correct: true, id_attempt: 1, id_question: 1, id_answer: 2 },
    { id_user_answer: 2, is_correct: true, id_attempt: 1, id_question: 2, id_answer: 5 },
    { id_user_answer: 3, is_correct: true, id_attempt: 1, id_question: 3, id_answer: 11 },
    { id_user_answer: 4, is_correct: true, id_attempt: 1, id_question: 4, id_answer: 14 },
    { id_user_answer: 5, is_correct: false, id_attempt: 1, id_question: 5, id_answer: 17 }, // Wrong answer
];
