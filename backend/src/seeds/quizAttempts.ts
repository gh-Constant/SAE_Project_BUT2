import prisma from '../prisma.js';

export async function seedQuizAttempts() {
    console.log('Seeding quiz attempts...');

    // Clean up existing attempts
    try {
        await prisma.userQuizAnswer.deleteMany({});
        await prisma.userQuizAttempt.deleteMany({});
    } catch (e) {
        console.warn("Warning clearing quiz attempts:", e);
    }

    // Adventurer IDs: 2 (Alice), 7 (Thomas), 8 (Jeanne), 9 (Léon), 10 (Margot)
    // Quiz IDs: 1-10 (all our test quizzes)

    const attempts = [
        // Alice (id_user: 2) - 4 quiz attempts
        { id_user: 2, id_quiz: 1, score: 4, total_questions: 5, completed_at: new Date('2024-12-15T16:30:00Z') },
        { id_user: 2, id_quiz: 3, score: 3, total_questions: 5, completed_at: new Date('2024-12-16T10:00:00Z') },
        { id_user: 2, id_quiz: 5, score: 2, total_questions: 3, completed_at: new Date('2024-12-17T14:00:00Z') },
        { id_user: 2, id_quiz: 9, score: 3, total_questions: 3, completed_at: new Date('2024-12-20T11:00:00Z') },

        // Thomas (id_user: 7) - 6 quiz attempts (very active)
        { id_user: 7, id_quiz: 1, score: 5, total_questions: 5, completed_at: new Date('2024-12-10T09:00:00Z') },
        { id_user: 7, id_quiz: 2, score: 4, total_questions: 5, completed_at: new Date('2024-12-11T10:30:00Z') },
        { id_user: 7, id_quiz: 4, score: 4, total_questions: 5, completed_at: new Date('2024-12-12T14:00:00Z') },
        { id_user: 7, id_quiz: 6, score: 3, total_questions: 3, completed_at: new Date('2024-12-14T16:00:00Z') },
        { id_user: 7, id_quiz: 8, score: 3, total_questions: 3, completed_at: new Date('2024-12-18T11:00:00Z') },
        { id_user: 7, id_quiz: 10, score: 2, total_questions: 3, completed_at: new Date('2024-12-22T15:00:00Z') },

        // Jeanne (id_user: 8) - 5 quiz attempts
        { id_user: 8, id_quiz: 1, score: 3, total_questions: 5, completed_at: new Date('2024-12-08T11:00:00Z') },
        { id_user: 8, id_quiz: 3, score: 5, total_questions: 5, completed_at: new Date('2024-12-10T14:30:00Z') },
        { id_user: 8, id_quiz: 7, score: 3, total_questions: 3, completed_at: new Date('2024-12-15T09:00:00Z') },
        { id_user: 8, id_quiz: 9, score: 3, total_questions: 3, completed_at: new Date('2024-12-19T10:00:00Z') },
        { id_user: 8, id_quiz: 10, score: 2, total_questions: 3, completed_at: new Date('2024-12-21T16:30:00Z') },

        // Léon (id_user: 9) - 3 quiz attempts (casual)
        { id_user: 9, id_quiz: 2, score: 3, total_questions: 5, completed_at: new Date('2024-12-12T10:00:00Z') },
        { id_user: 9, id_quiz: 5, score: 2, total_questions: 3, completed_at: new Date('2024-12-16T15:00:00Z') },
        { id_user: 9, id_quiz: 8, score: 2, total_questions: 3, completed_at: new Date('2024-12-23T14:00:00Z') },

        // Margot (id_user: 10) - 9 quiz attempts (most active)
        { id_user: 10, id_quiz: 1, score: 5, total_questions: 5, completed_at: new Date('2024-12-05T10:00:00Z') },
        { id_user: 10, id_quiz: 2, score: 5, total_questions: 5, completed_at: new Date('2024-12-06T11:30:00Z') },
        { id_user: 10, id_quiz: 2, score: 3, total_questions: 5, completed_at: new Date('2024-12-13T16:00:00Z') },
        { id_user: 10, id_quiz: 2, score: 2, total_questions: 5, completed_at: new Date('2024-12-13T16:00:00Z') },
        { id_user: 10, id_quiz: 2, score: 2, total_questions: 5, completed_at: new Date('2024-12-13T16:00:00Z') },
        { id_user: 10, id_quiz: 3, score: 4, total_questions: 5, completed_at: new Date('2024-12-07T14:00:00Z') },
        { id_user: 10, id_quiz: 4, score: 5, total_questions: 5, completed_at: new Date('2024-12-09T09:30:00Z') },
        { id_user: 10, id_quiz: 7, score: 3, total_questions: 3, completed_at: new Date('2024-12-17T10:00:00Z') },
        { id_user: 10, id_quiz: 9, score: 3, total_questions: 3, completed_at: new Date('2024-12-24T11:00:00Z') },

        // Pierre (id_user: 5) - 2 quiz attempts (beginner)
        { id_user: 5, id_quiz: 1, score: 2, total_questions: 5, completed_at: new Date('2024-12-20T10:00:00Z') },
        { id_user: 5, id_quiz: 3, score: 1, total_questions: 5, completed_at: new Date('2024-12-22T14:00:00Z') },

        // Jacques (id_user: 6) - 4 quiz attempts (intermediate)
        { id_user: 6, id_quiz: 1, score: 4, total_questions: 5, completed_at: new Date('2024-12-08T09:00:00Z') },
        { id_user: 6, id_quiz: 2, score: 4, total_questions: 5, completed_at: new Date('2024-12-09T11:00:00Z') },
        { id_user: 6, id_quiz: 5, score: 3, total_questions: 3, completed_at: new Date('2024-12-15T15:00:00Z') },
        { id_user: 6, id_quiz: 7, score: 2, total_questions: 3, completed_at: new Date('2024-12-18T10:00:00Z') },
    ];

    for (const attempt of attempts) {
        await prisma.userQuizAttempt.create({
            data: attempt,
        });
    }

    console.log(`✅ Quiz attempts seeded: ${attempts.length} attempts created`);
}
