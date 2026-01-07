import prisma from '../prisma.js';

// Types for quiz operations
interface CreateQuizInput {
    title: string;
    description?: string;
    image_url?: string;
    id_location: number;
    id_creator: number;
    questions: CreateQuestionInput[];
}

interface CreateQuestionInput {
    content: string;
    image_url?: string;
    order_index: number;
    answers: CreateAnswerInput[];
}

interface CreateAnswerInput {
    content: string;
    is_correct: boolean;
    order_index: number;
}

interface UpdateQuizInput {
    title?: string;
    description?: string;
    image_url?: string;
    is_active?: boolean;
    questions?: UpdateQuestionInput[];
}

interface UpdateQuestionInput {
    id_question?: number;
    content: string;
    image_url?: string;
    order_index: number;
    answers: UpdateAnswerInput[];
}

interface UpdateAnswerInput {
    id_answer?: number;
    content: string;
    is_correct: boolean;
    order_index: number;
}

interface SubmitQuizInput {
    id_quiz: number;
    id_user: number;
    answers: { id_question: number; id_answer: number }[];
}

// Get all quizzes with optional filters
export async function getQuizzes(filters?: {
    id_location?: number;
    id_creator?: number;
    is_active?: boolean;
}) {
    const quizzes = await prisma.quiz.findMany({
        where: {
            ...(filters?.id_location && { id_location: filters.id_location }),
            ...(filters?.id_creator && { id_creator: filters.id_creator }),
            ...(filters?.is_active !== undefined && { is_active: filters.is_active }),
        },
        include: {
            location: {
                select: {
                    id_location: true,
                    name: true,
                },
            },
            creator: {
                select: {
                    id_user: true,
                    firstname: true,
                    lastname: true,
                },
            },
            questions: {
                select: {
                    id_question: true,
                },
            },
            attempts: {
                where: {
                    completed_at: { not: null }
                },
                select: {
                    id_user: true,
                    score: true,
                    total_questions: true,
                },
            },
            _count: {
                select: {
                    attempts: true,
                },
            },
        },
        orderBy: {
            created_at: 'desc',
        },
    });

    // Calculate unique participants and average score for each quiz
    return quizzes.map(quiz => {
        const uniqueUsers = new Set(quiz.attempts.map(a => a.id_user));

        // Calculate average score percentage from completed attempts
        let averageScore = 0;
        if (quiz.attempts.length > 0) {
            const totalScorePercent = quiz.attempts.reduce((sum, attempt) => {
                if (attempt.total_questions > 0) {
                    return sum + (attempt.score / attempt.total_questions * 100);
                }
                return sum;
            }, 0);
            averageScore = Math.round(totalScorePercent / quiz.attempts.length);
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { attempts, ...quizWithoutAttempts } = quiz;
        return {
            ...quizWithoutAttempts,
            uniqueParticipants: uniqueUsers.size,
            averageScore,
        };
    });
}

// Get top adventurers based on quiz completions
export async function getTopAdventurers(limit: number = 5) {
    // Fetch all completed attempts with user info
    const attempts = await prisma.userQuizAttempt.findMany({
        where: {
            completed_at: { not: null }
        },
        select: {
            id_user: true,
            id_quiz: true,
            user: {
                select: {
                    id_user: true,
                    firstname: true,
                    lastname: true,
                }
            }
        }
    });

    // Group by user and count
    const userStats = new Map<number, {
        id: number;
        name: string;
        completedQuizzes: number;
        uniqueQuizzes: Set<number>;
    }>();

    for (const attempt of attempts) {
        const userId = attempt.id_user;
        const existing = userStats.get(userId);

        if (existing) {
            existing.completedQuizzes++;
            existing.uniqueQuizzes.add(attempt.id_quiz);
        } else {
            userStats.set(userId, {
                id: userId,
                name: `${attempt.user.firstname} ${attempt.user.lastname}`,
                completedQuizzes: 1,
                uniqueQuizzes: new Set([attempt.id_quiz])
            });
        }
    }

    // Convert to array and sort by completed quizzes
    return Array.from(userStats.values())
        .map(user => ({
            id: user.id,
            name: user.name,
            completedQuizzes: user.completedQuizzes,
            uniqueQuizzes: user.uniqueQuizzes.size
        }))
        .sort((a, b) => b.completedQuizzes - a.completedQuizzes)
        .slice(0, limit);
}

// Get a single quiz by ID with all questions and answers
export async function getQuizById(id_quiz: number) {
    return prisma.quiz.findUnique({
        where: { id_quiz },
        include: {
            location: {
                select: {
                    id_location: true,
                    name: true,
                },
            },
            creator: {
                select: {
                    id_user: true,
                    firstname: true,
                    lastname: true,
                },
            },
            questions: {
                orderBy: { order_index: 'asc' },
                include: {
                    answers: {
                        orderBy: { order_index: 'asc' },
                    },
                },
            },
        },
    });
}

// Get quiz for playing (hide correct answers)
export async function getQuizForPlay(id_quiz: number) {
    const quiz = await prisma.quiz.findUnique({
        where: { id_quiz, is_active: true },
        include: {
            location: {
                select: {
                    id_location: true,
                    name: true,
                },
            },
            questions: {
                orderBy: { order_index: 'asc' },
                include: {
                    answers: {
                        orderBy: { order_index: 'asc' },
                        select: {
                            id_answer: true,
                            content: true,
                            order_index: true,
                            is_correct: true,
                        },
                    },
                },
            },
        },
    });

    if (!quiz) return null;

    // Post-process to hide correct answers but add 'multiple_correct_answers' flag
    const sanitizedQuestions = quiz.questions.map(q => {
        const correctCount = q.answers.filter(a => a.is_correct).length;
        const sanitizedAnswers = q.answers.map(({ is_correct, ...rest }) => rest);

        return {
            ...q,
            answers: sanitizedAnswers,
            multiple_correct_answers: correctCount > 1,
        };
    });

    return {
        ...quiz,
        questions: sanitizedQuestions,
    };
}

// Create a new quiz with questions and answers
export async function createQuiz(input: CreateQuizInput) {
    return prisma.quiz.create({
        data: {
            title: input.title,
            description: input.description,
            image_url: input.image_url,
            id_location: input.id_location,
            id_creator: input.id_creator,
            questions: {
                create: input.questions.map((q) => ({
                    content: q.content,
                    image_url: q.image_url,
                    order_index: q.order_index,
                    answers: {
                        create: q.answers.map((a) => ({
                            content: a.content,
                            is_correct: a.is_correct,
                            order_index: a.order_index,
                        })),
                    },
                })),
            },
        },
        include: {
            questions: {
                include: {
                    answers: true,
                },
            },
        },
    });
}

// Update a quiz
export async function updateQuiz(id_quiz: number, input: UpdateQuizInput) {
    // First update the quiz basic info
    await prisma.quiz.update({
        where: { id_quiz },
        data: {
            ...(input.title && { title: input.title }),
            ...(input.description !== undefined && { description: input.description }),
            ...(input.image_url !== undefined && { image_url: input.image_url }),
            ...(input.is_active !== undefined && { is_active: input.is_active }),
        },
    });

    // If questions are provided, update them
    if (input.questions) {
        // Delete existing questions and answers
        await prisma.quizQuestion.deleteMany({
            where: { id_quiz },
        });

        // Create new questions with answers
        for (const q of input.questions) {
            await prisma.quizQuestion.create({
                data: {
                    id_quiz,
                    content: q.content,
                    image_url: q.image_url,
                    order_index: q.order_index,
                    answers: {
                        create: q.answers.map((a) => ({
                            content: a.content,
                            is_correct: a.is_correct,
                            order_index: a.order_index,
                        })),
                    },
                },
            });
        }
    }

    return getQuizById(id_quiz);
}

// Delete a quiz
export async function deleteQuiz(id_quiz: number) {
    return prisma.quiz.delete({
        where: { id_quiz },
    });
}

// Submit quiz answers and calculate score
export async function submitQuizAttempt(input: SubmitQuizInput) {
    // Get the quiz with correct answers
    const quiz = await prisma.quiz.findUnique({
        where: { id_quiz: input.id_quiz },
        include: {
            questions: {
                include: {
                    answers: true,
                },
            },
        },
    });

    if (!quiz) {
        throw new Error('Quiz not found');
    }

    // Calculate score
    let score = 0;
    const totalQuestions = quiz.questions.length;
    const answerResults: { id_question: number; id_answer: number; is_correct: boolean }[] = [];

    // Group user answers by question ID
    const userAnswersByQuestion = new Map<number, number[]>();
    for (const ans of input.answers) {
        if (!userAnswersByQuestion.has(ans.id_question)) {
            userAnswersByQuestion.set(ans.id_question, []);
        }
        userAnswersByQuestion.get(ans.id_question)?.push(ans.id_answer);
    }

    for (const question of quiz.questions) {
        const userAnswers = userAnswersByQuestion.get(question.id_question) || [];
        const correctAnswers = question.answers.filter((a) => a.is_correct).map((a) => a.id_answer);

        const isCorrect = userAnswers.length === correctAnswers.length &&
            userAnswers.every((id) => correctAnswers.includes(id));

        if (isCorrect) score++;

        // Record individual answer results for detailed feedback
        for (const userAnswerId of userAnswers) {
            const isAnswerCorrect = correctAnswers.includes(userAnswerId);
            answerResults.push({
                id_question: question.id_question,
                id_answer: userAnswerId,
                is_correct: isAnswerCorrect,
            });
        }
    }

    // Create the attempt with answers
    const attempt = await prisma.userQuizAttempt.create({
        data: {
            id_user: input.id_user,
            id_quiz: input.id_quiz,
            score,
            total_questions: totalQuestions,
            completed_at: new Date(),
            answers: {
                create: answerResults.map((ar) => ({
                    id_question: ar.id_question,
                    id_answer: ar.id_answer,
                    is_correct: ar.is_correct,
                })),
            },
        },
        include: {
            answers: {
                include: {
                    question: true,
                    answer: true,
                },
            },
        },
    });

    return {
        attempt,
        score,
        totalQuestions,
        percentage: Math.round((score / totalQuestions) * 100),
    };
}

// Get user's quiz attempts
export async function getUserQuizAttempts(id_user: number, id_quiz?: number) {
    return prisma.userQuizAttempt.findMany({
        where: {
            id_user,
            ...(id_quiz && { id_quiz }),
        },
        include: {
            quiz: {
                select: {
                    id_quiz: true,
                    title: true,
                    image_url: true,
                },
            },
        },
        orderBy: {
            created_at: 'desc',
        },
    });
}

// Get attempt details with all answers
export async function getAttemptDetails(id_attempt: number) {
    return prisma.userQuizAttempt.findUnique({
        where: { id_attempt },
        include: {
            quiz: {
                include: {
                    questions: {
                        orderBy: { order_index: 'asc' },
                        include: {
                            answers: {
                                orderBy: { order_index: 'asc' },
                            },
                        },
                    },
                },
            },
            answers: {
                include: {
                    question: true,
                    answer: true,
                },
            },
        },
    });
}

// Get quiz statistics (for admin/prestataire)
export async function getQuizStatistics(id_quiz: number) {
    const attempts = await prisma.userQuizAttempt.findMany({
        where: { id_quiz },
        include: {
            user: {
                select: {
                    id_user: true,
                    firstname: true,
                    lastname: true,
                },
            },
        },
        orderBy: {
            created_at: 'desc',
        },
    });

    const totalAttempts = attempts.length;
    const averageScore = totalAttempts > 0
        ? attempts.reduce((sum, a) => sum + (a.score / a.total_questions) * 100, 0) / totalAttempts
        : 0;

    return {
        totalAttempts,
        averageScore: Math.round(averageScore),
        attempts,
    };
}

// Get correct answers for a question (for immediate feedback)
export async function getQuestionSolution(id_question: number) {
    const answers = await prisma.quizAnswer.findMany({
        where: {
            id_question,
            is_correct: true
        },
        select: {
            id_answer: true
        }
    });

    return answers.map(a => a.id_answer);
}
