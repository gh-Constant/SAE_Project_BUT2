/**
 * @file quizzes.ts
 * @description Mock data for quizzes
 */

import type { Quiz, QuizQuestion, UserQuizAttempt, UserQuizAnswer } from '@/types/quiz';

// Mock Quizzes
export const mockQuizzes: Quiz[] = [
    {
        id_quiz: 1,
        title: 'Quiz sur le Moyen Ã‚ge',
        description: 'Testez vos connaissances sur l\'Ã©poque mÃ©diÃ©vale !',
        image_url: '/images/quizzes/Chateau_Pierrefonds.jpg',
        is_active: true,
        created_at: '2024-12-01T10:00:00Z',
        updated_at: '2024-12-01T10:00:00Z',
        id_location: 14,
        id_creator: 1,
        location: {
            id_location: 14,
            name: 'La Rotisserie du Lion',
        },
        creator: {
            id_user: 1,
            firstname: 'GÃ©rard',
            lastname: 'Delatour',
        },
        _count: {
            attempts: 127,
            questions: 5,
        },
        uniqueParticipants: 85,
        averageScore: 72,
    },
    {
        id_quiz: 2,
        title: 'Les Chevaliers et leurs Armes',
        description: 'Connaissez-vous les Ã©quipements des chevaliers ?',
        image_url: '/images/quizzes/knight.jpg',
        is_active: true,
        created_at: '2024-12-05T14:30:00Z',
        updated_at: '2024-12-05T14:30:00Z',
        id_location: 15,
        id_creator: 1,
        location: {
            id_location: 15,
            name: 'Le Cellier des Voyageurs',
        },
        creator: {
            id_user: 1,
            firstname: 'GÃ©rard',
            lastname: 'Delatour',
        },
        _count: {
            attempts: 89,
            questions: 7,
        },
        uniqueParticipants: 65,
        averageScore: 65,
    },
    {
        id_quiz: 3,
        title: 'La Gastronomie MÃ©diÃ©vale',
        description: 'Que mangeait-on au Moyen Ã‚ge ?',
        image_url: '/images/quizzes/food.jpg',
        is_active: true,
        created_at: '2024-12-10T09:00:00Z',
        updated_at: '2024-12-10T09:00:00Z',
        id_location: 16,
        id_creator: 4,
        location: {
            id_location: 16,
            name: 'L Atelier de l Arbaletriere',
        },
        creator: {
            id_user: 4,
            firstname: 'Marie',
            lastname: 'd Auberive',
        },
        _count: {
            attempts: 56,
            questions: 6,
        },
        uniqueParticipants: 42,
        averageScore: 81,
    },
    {
        id_quiz: 4,
        title: 'Les ChÃ¢teaux Forts',
        description: 'DÃ©couvrez les secrets des forteresses mÃ©diÃ©vales !',
        image_url: '/images/quizzes/Chateau_Pierrefonds.jpg',
        is_active: true,
        created_at: '2024-12-12T11:00:00Z',
        updated_at: '2024-12-12T11:00:00Z',
        id_location: 16,
        id_creator: 4,
        location: {
            id_location: 16,
            name: 'L Atelier de l Arbaletriere',
        },
        creator: {
            id_user: 4,
            firstname: 'Marie',
            lastname: 'd Auberive',
        },
        _count: {
            attempts: 112,
            questions: 4,
        },
        uniqueParticipants: 95,
        averageScore: 58,
    },
    {
        id_quiz: 5,
        title: 'La Vie des Paysans',
        description: 'Le quotidien du peuple au Moyen Ã‚ge',
        image_url: '/images/quizzes/paysan.jpg',
        is_active: true,
        created_at: '2024-12-14T08:30:00Z',
        updated_at: '2024-12-14T08:30:00Z',
        id_location: 17,
        id_creator: 4,
        location: {
            id_location: 17,
            name: 'La Forge des Lanternes',
        },
        creator: {
            id_user: 5,
            firstname: 'Marie',
            lastname: 'd Auberive',
        },
        _count: {
            attempts: 34,
            questions: 5,
        },
        uniqueParticipants: 28,
        averageScore: 64,
    },
    {
        id_quiz: 6,
        title: 'Les Croisades',
        description: 'L\'histoire des grandes expÃ©ditions',
        image_url: '/images/quizzes/croisade.jpg',
        is_active: true,
        created_at: '2024-12-15T15:00:00Z',
        updated_at: '2024-12-15T15:00:00Z',
        id_location: 17,
        id_creator: 4,
        location: {
            id_location: 17,
            name: 'La Forge des Lanternes',
        },
        creator: {
            id_user: 5,
            firstname: 'Marie',
            lastname: 'd Auberive',
        },
        _count: {
            attempts: 78,
            questions: 5,
        },
        uniqueParticipants: 62,
        averageScore: 45,
    },
    {
        id_quiz: 7,
        title: 'L\'Art MÃ©diÃ©val',
        description: 'Enluminures, vitraux et sculptures',
        image_url: '/images/quizzes/vitrail.jpg',
        is_active: true,
        created_at: '2024-12-18T10:00:00Z',
        updated_at: '2024-12-18T10:00:00Z',
        id_location: 18,
        id_creator: 4,
        location: {
            id_location: 18,
            name: 'Le Scriptorium des Blasons',
        },
        creator: {
            id_user: 6,
            firstname: 'Marie',
            lastname: 'd Auberive',
        },
        _count: {
            attempts: 45,
            questions: 4,
        },
        uniqueParticipants: 35,
        averageScore: 88,
    },
    {
        id_quiz: 8,
        title: 'Les Rois de France',
        description: 'Les grandes dynasties franÃ§aises',
        image_url: '/images/quizzes/king.jpg',
        is_active: true,
        created_at: '2024-12-20T14:00:00Z',
        updated_at: '2024-12-20T14:00:00Z',
        id_location: 15,
        id_creator: 1,
        location: {
            id_location: 15,
            name: 'Le Cellier des Voyageurs',
        },
        creator: {
            id_user: 1,
            firstname: 'GÃ©rard',
            lastname: 'Delatour',
        },
        _count: {
            attempts: 156,
            questions: 4,
        },
        uniqueParticipants: 142,
        averageScore: 76,
    },
    {
        id_quiz: 9,
        title: 'LÃ©gendes et Mythes',
        description: 'Dragons, fÃ©es et crÃ©atures fantastiques',
        image_url: '/images/quizzes/dragon.jpg',
        is_active: true,
        created_at: '2024-12-22T09:00:00Z',
        updated_at: '2024-12-22T09:00:00Z',
        id_location: 16,
        id_creator: 4,
        location: {
            id_location: 16,
            name: 'L Atelier de l Arbaletriere',
        },
        creator: {
            id_user: 4,
            firstname: 'Marie',
            lastname: 'd Auberive',
        },
        _count: {
            attempts: 201,
            questions: 3,
        },
        uniqueParticipants: 180,
        averageScore: 92,
    },
    {
        id_quiz: 10,
        title: 'Les Tournois',
        description: 'Joutes et compÃ©titions chevaleresques',
        image_url: '/images/quizzes/tournament.png',
        is_active: true,
        created_at: '2024-12-25T16:00:00Z',
        updated_at: '2024-12-25T16:00:00Z',
        id_location: 18,
        id_creator: 4,
        location: {
            id_location: 18,
            name: 'Le Scriptorium des Blasons',
        },
        creator: {
            id_user: 6,
            firstname: 'Marie',
            lastname: 'd Auberive',
        },
        _count: {
            attempts: 67,
            questions: 3,
        },
        uniqueParticipants: 55,
        averageScore: 68,
    },
];

// Mock Questions
export const mockQuestions: QuizQuestion[] = [
    // Quiz 1: Moyen Ã‚ge
    {
        id_question: 1,
        content: '<p>Quelle est la durÃ©e approximative du <strong>Moyen Ã‚ge</strong> en Europe ?</p>',
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
        content: '<p>Quel Ã©vÃ©nement marque traditionnellement le <em>dÃ©but</em> du Moyen Ã‚ge ?</p>',
        image_url: undefined,
        order_index: 1,
        id_quiz: 1,
        answers: [
            { id_answer: 5, content: 'La chute de Rome', is_correct: true, order_index: 0, id_question: 2 },
            { id_answer: 6, content: 'La dÃ©couverte de l\'AmÃ©rique', is_correct: false, order_index: 1, id_question: 2 },
            { id_answer: 7, content: 'La RÃ©volution franÃ§aise', is_correct: false, order_index: 2, id_question: 2 },
            { id_answer: 8, content: 'L\'invention de l\'imprimerie', is_correct: false, order_index: 3, id_question: 2 },
        ],
    },
    {
        id_question: 3,
        content: '<p>Comment appelle-t-on le systÃ¨me Ã©conomique et social du Moyen Ã‚ge ?</p>',
        image_url: undefined,
        order_index: 2,
        id_quiz: 1,
        answers: [
            { id_answer: 9, content: 'Le capitalisme', is_correct: false, order_index: 0, id_question: 3 },
            { id_answer: 10, content: 'Le communisme', is_correct: false, order_index: 1, id_question: 3 },
            { id_answer: 11, content: 'La fÃ©odalitÃ©', is_correct: true, order_index: 2, id_question: 3 },
            { id_answer: 12, content: 'La dÃ©mocratie', is_correct: false, order_index: 3, id_question: 3 },
        ],
    },
    {
        id_question: 4,
        content: '<p>Quelle construction est typique de l\'architecture mÃ©diÃ©vale religieuse ?</p>',
        image_url: '/images/quizzes/cathedral.jpg',
        order_index: 3,
        id_quiz: 1,
        answers: [
            { id_answer: 13, content: 'Les pyramides', is_correct: false, order_index: 0, id_question: 4 },
            { id_answer: 14, content: 'Les cathÃ©drales gothiques', is_correct: true, order_index: 1, id_question: 4 },
            { id_answer: 15, content: 'Les colisÃ©es', is_correct: false, order_index: 2, id_question: 4 },
            { id_answer: 16, content: 'Les temples grecs', is_correct: false, order_index: 3, id_question: 4 },
        ],
    },
    {
        id_question: 5,
        content: '<p>Quel Ã©tait le rÃ´le principal des <strong>chevaliers</strong> au Moyen Ã‚ge ?</p>',
        image_url: undefined,
        order_index: 4,
        id_quiz: 1,
        answers: [
            { id_answer: 17, content: 'CommerÃ§ants', is_correct: false, order_index: 0, id_question: 5 },
            { id_answer: 18, content: 'Guerriers au service d\'un seigneur', is_correct: true, order_index: 1, id_question: 5 },
            { id_answer: 19, content: 'Agriculteurs', is_correct: false, order_index: 2, id_question: 5 },
            { id_answer: 20, content: 'Artistes', is_correct: false, order_index: 3, id_question: 5 },
        ],
    },
    // Quiz 2: Chevaliers
    {
        id_question: 6,
        content: '<p>Quelle arme est le symbole du chevalier ?</p>',
        order_index: 0,
        id_quiz: 2,
        answers: [
            { id_answer: 21, content: 'L\'arc', is_correct: false, order_index: 0, id_question: 6 },
            { id_answer: 22, content: 'L\'Ã©pÃ©e', is_correct: true, order_index: 1, id_question: 6 },
            { id_answer: 23, content: 'La masse', is_correct: false, order_index: 2, id_question: 6 },
            { id_answer: 24, content: 'Le flÃ©au', is_correct: false, order_index: 3, id_question: 6 },
        ]
    },
    {
        id_question: 7,
        content: '<p>Comment appelle-t-on le casque intÃ©gral du chevalier ?</p>',
        order_index: 1,
        id_quiz: 2,
        answers: [
            { id_answer: 25, content: 'Le kÃ©pi', is_correct: false, order_index: 0, id_question: 7 },
            { id_answer: 26, content: 'Le heaume', is_correct: true, order_index: 1, id_question: 7 },
            { id_answer: 27, content: 'Le bonnet', is_correct: false, order_index: 2, id_question: 7 },
            { id_answer: 28, content: 'La coiffe', is_correct: false, order_index: 3, id_question: 7 },
        ]
    },
    {
        id_question: 8,
        content: '<p>Quelle protection en mailles mÃ©talliques les chevaliers portaient-ils ?</p>',
        order_index: 2,
        id_quiz: 2,
        answers: [
            { id_answer: 29, content: 'La cotte de mailles', is_correct: true, order_index: 0, id_question: 8 },
            { id_answer: 30, content: 'Le pull en laine', is_correct: false, order_index: 1, id_question: 8 },
            { id_answer: 31, content: 'L\'armure de cuir', is_correct: false, order_index: 2, id_question: 8 },
            { id_answer: 32, content: 'La tunique', is_correct: false, order_index: 3, id_question: 8 },
        ]
    },
    {
        id_question: 9,
        content: '<p>Quelle arme longue Ã©tait utilisÃ©e lors des joutes Ã©questres ?</p>',
        order_index: 3,
        id_quiz: 2,
        answers: [
            { id_answer: 33, content: 'La dague', is_correct: false, order_index: 0, id_question: 9 },
            { id_answer: 34, content: 'La lance', is_correct: true, order_index: 1, id_question: 9 },
            { id_answer: 35, content: 'Le marteau', is_correct: false, order_index: 2, id_question: 9 },
            { id_answer: 36, content: 'La hache', is_correct: false, order_index: 3, id_question: 9 },
        ]
    },
    {
        id_question: 10,
        content: '<p>Comment s\'appelle le code de conduite des chevaliers ?</p>',
        order_index: 4,
        id_quiz: 2,
        answers: [
            { id_answer: 37, content: 'Le code de la route', is_correct: false, order_index: 0, id_question: 10 },
            { id_answer: 38, content: 'Le code civil', is_correct: false, order_index: 1, id_question: 10 },
            { id_answer: 39, content: 'L\'esprit chevaleresque (ou courtois)', is_correct: true, order_index: 2, id_question: 10 },
            { id_answer: 40, content: 'Le rÃ¨glement intÃ©rieur', is_correct: false, order_index: 3, id_question: 10 },
        ]
    },
    {
        id_question: 200,
        content: '<p>Quelle cÃ©rÃ©monie permet de devenir chevalier ?</p>',
        order_index: 5,
        id_quiz: 2,
        answers: [
            { id_answer: 2000, content: 'Le baptÃªme', is_correct: false, order_index: 0, id_question: 200 },
            { id_answer: 2001, content: 'L\'adoubement', is_correct: true, order_index: 1, id_question: 200 },
            { id_answer: 2002, content: 'Le mariage', is_correct: false, order_index: 2, id_question: 200 },
            { id_answer: 2003, content: 'Le sacre', is_correct: false, order_index: 3, id_question: 200 },
        ]
    },
    {
        id_question: 201,
        content: '<p>Quel objet reÃ§oit le chevalier aux talons ?</p>',
        order_index: 6,
        id_quiz: 2,
        answers: [
            { id_answer: 2004, content: 'Des Ã©perons dorÃ©s', is_correct: true, order_index: 0, id_question: 201 },
            { id_answer: 2005, content: 'Des fers Ã  cheval', is_correct: false, order_index: 1, id_question: 201 },
            { id_answer: 2006, content: 'Des bottes rouges', is_correct: false, order_index: 2, id_question: 201 },
            { id_answer: 2007, content: 'Des clochettes', is_correct: false, order_index: 3, id_question: 201 },
        ]
    },
    // Quiz 3: Gastronomie
    {
        id_question: 11,
        content: '<p>Quelle viande Ã©tait la plus consommÃ©e par les nobles ?</p>',
        order_index: 0,
        id_quiz: 3,
        answers: [
            { id_answer: 41, content: 'Le poulet', is_correct: false, order_index: 0, id_question: 11 },
            { id_answer: 42, content: 'Le gibier (cerf, sanglier)', is_correct: true, order_index: 1, id_question: 11 },
            { id_answer: 43, content: 'Le poisson', is_correct: false, order_index: 2, id_question: 11 },
            { id_answer: 44, content: 'Le boeuf', is_correct: false, order_index: 3, id_question: 11 },
        ]
    },
    {
        id_question: 12,
        content: '<p>Pourquoi utilisait-on beaucoup d\'Ã©pices ?</p>',
        order_index: 1,
        id_quiz: 3,
        answers: [
            { id_answer: 45, content: 'Pour masquer le goÃ»t avariÃ©', is_correct: false, order_index: 0, id_question: 12 },
            { id_answer: 46, content: 'Pour montrer sa richesse', is_correct: true, order_index: 1, id_question: 12 },
            { id_answer: 47, content: 'Pour la santÃ© uniquement', is_correct: false, order_index: 2, id_question: 12 },
            { id_answer: 48, content: 'C\'Ã©tait gratuit', is_correct: false, order_index: 3, id_question: 12 },
        ]
    },
    {
        id_question: 13,
        content: '<p>Quelle boisson remplaÃ§ait souvent l\'eau (souvent polluÃ©e) ?</p>',
        order_index: 2,
        id_quiz: 3,
        answers: [
            { id_answer: 49, content: 'Le soda', is_correct: false, order_index: 0, id_question: 13 },
            { id_answer: 50, content: 'Le jus d\'orange', is_correct: false, order_index: 1, id_question: 13 },
            { id_answer: 51, content: 'Le vin ou la cervoise', is_correct: true, order_index: 2, id_question: 13 },
            { id_answer: 52, content: 'Le lait', is_correct: false, order_index: 3, id_question: 13 },
        ]
    },
    {
        id_question: 14,
        content: '<p>Quel aliment Ã©tait la base de l\'alimentation paysanne ?</p>',
        order_index: 3,
        id_quiz: 3,
        answers: [
            { id_answer: 53, content: 'Le pain', is_correct: true, order_index: 0, id_question: 14 },
            { id_answer: 54, content: 'Le caviar', is_correct: false, order_index: 1, id_question: 14 },
            { id_answer: 55, content: 'Les gÃ¢teaux', is_correct: false, order_index: 2, id_question: 14 },
            { id_answer: 56, content: 'Le riz', is_correct: false, order_index: 3, id_question: 14 },
        ]
    },
    {
        id_question: 15,
        content: '<p>Avec quoi mangeait-on principalement ?</p>',
        order_index: 4,
        id_quiz: 3,
        answers: [
            { id_answer: 57, content: 'Avec des fourchettes en or', is_correct: false, order_index: 0, id_question: 15 },
            { id_answer: 58, content: 'Avec les doigts et un couteau', is_correct: true, order_index: 1, id_question: 15 },
            { id_answer: 59, content: 'Avec des baguettes', is_correct: false, order_index: 2, id_question: 15 },
            { id_answer: 60, content: 'Avec une paille', is_correct: false, order_index: 3, id_question: 15 },
        ]
    },
    // Quiz 4: ChÃ¢teaux (Multi-answers)
    /* Question removed
    {
        id_question: 16,
        content: '<p>Quelles sont les couleurs primaires ?</p>',
        ...
    },
    */
    {
        id_question: 17,
        content: '<p>Quels animaux sont des mammifÃ¨res ?</p>',
        order_index: 1,
        id_quiz: 4,
        answers: [
            { id_answer: 65, content: 'Chien', is_correct: true, order_index: 0, id_question: 17 },
            { id_answer: 66, content: 'Chat', is_correct: true, order_index: 1, id_question: 17 },
            { id_answer: 67, content: 'Serpent', is_correct: false, order_index: 2, id_question: 17 },
            { id_answer: 68, content: 'Vache', is_correct: true, order_index: 3, id_question: 17 },
            { id_answer: 69, content: 'Aigle', is_correct: false, order_index: 4, id_question: 17 },
        ]
    },
    {
        id_question: 18,
        content: '<p>Question piÃ¨ge : Une seule bonne rÃ©ponse.</p>',
        order_index: 2,
        id_quiz: 4,
        answers: [
            { id_answer: 70, content: 'Bonne rÃ©ponse', is_correct: true, order_index: 0, id_question: 18 },
            { id_answer: 71, content: 'Mauvaise', is_correct: false, order_index: 1, id_question: 18 },
            { id_answer: 72, content: 'Mauvaise', is_correct: false, order_index: 2, id_question: 18 },
        ]
    },
    {
        id_question: 19,
        content: '<p>SÃ©lectionnez tous les nombres pairs.</p>',
        order_index: 3,
        id_quiz: 4,
        answers: [
            { id_answer: 73, content: '2', is_correct: true, order_index: 0, id_question: 19 },
            { id_answer: 74, content: '3', is_correct: false, order_index: 1, id_question: 19 },
            { id_answer: 75, content: '6', is_correct: true, order_index: 2, id_question: 19 },
            { id_answer: 76, content: '9', is_correct: false, order_index: 3, id_question: 19 },
        ]
    },
    {
        id_question: 20,
        content: '<p>Quelle est la capitale de la France ? (Choix unique, vÃ©rification interface)</p>',
        order_index: 4,
        id_quiz: 4,
        answers: [
            { id_answer: 77, content: 'Lyon', is_correct: false, order_index: 0, id_question: 20 },
            { id_answer: 78, content: 'Paris', is_correct: true, order_index: 1, id_question: 20 },
            { id_answer: 79, content: 'Marseille', is_correct: false, order_index: 2, id_question: 20 },
        ]
    },
    // Quiz 5: Paysans
    {
        id_question: 21,
        content: '<p>Comment appelait-on le paysan attachÃ© Ã  une terre ?</p>',
        order_index: 0,
        id_quiz: 5,
        answers: [
            { id_answer: 80, content: 'Un bourgeois', is_correct: false, order_index: 0, id_question: 21 },
            { id_answer: 81, content: 'Un serf', is_correct: true, order_index: 1, id_question: 21 },
            { id_answer: 82, content: 'Un noble', is_correct: false, order_index: 2, id_question: 21 },
            { id_answer: 83, content: 'Un esclave', is_correct: false, order_index: 3, id_question: 21 },
        ]
    },
    {
        id_question: 22,
        content: '<p>Quel pourcentage de la population Ã©tait paysanne au Moyen Ã‚ge ?</p>',
        order_index: 1,
        id_quiz: 5,
        answers: [
            { id_answer: 84, content: '50%', is_correct: false, order_index: 0, id_question: 22 },
            { id_answer: 85, content: '70%', is_correct: false, order_index: 1, id_question: 22 },
            { id_answer: 86, content: '90%', is_correct: true, order_index: 2, id_question: 22 },
            { id_answer: 87, content: '30%', is_correct: false, order_index: 3, id_question: 22 },
        ]
    },
    {
        id_question: 23,
        content: '<p>Quelle taxe les paysans devaient-ils au seigneur ?</p>',
        order_index: 2,
        id_quiz: 5,
        answers: [
            { id_answer: 88, content: 'La TVA', is_correct: false, order_index: 0, id_question: 23 },
            { id_answer: 89, content: 'La taille', is_correct: true, order_index: 1, id_question: 23 },
            { id_answer: 90, content: 'L\'impÃ´t sur le revenu', is_correct: false, order_index: 2, id_question: 23 },
            { id_answer: 91, content: 'La cotisation', is_correct: false, order_index: 3, id_question: 23 },
        ]
    },
    {
        id_question: 203,
        content: '<p>Qu\'est-ce que la corvÃ©e ?</p>',
        order_index: 3,
        id_quiz: 5,
        answers: [
            { id_answer: 2012, content: 'Un travail gratuit pour le seigneur', is_correct: true, order_index: 0, id_question: 203 },
            { id_answer: 2013, content: 'Un impÃ´t en argent', is_correct: false, order_index: 1, id_question: 203 },
            { id_answer: 2014, content: 'Une fÃªte de village', is_correct: false, order_index: 2, id_question: 203 },
            { id_answer: 2015, content: 'Un outil agricole', is_correct: false, order_index: 3, id_question: 203 },
        ]
    },
    {
        id_question: 204,
        content: '<p>Quel outil agricole est emblÃ©matique du paysan ?</p>',
        order_index: 4,
        id_quiz: 5,
        answers: [
            { id_answer: 2016, content: 'L\'Ã©pÃ©e', is_correct: false, order_index: 0, id_question: 204 },
            { id_answer: 2017, content: 'La faux', is_correct: true, order_index: 1, id_question: 204 },
            { id_answer: 2018, content: 'Le marteau', is_correct: false, order_index: 2, id_question: 204 },
            { id_answer: 2019, content: 'La balance', is_correct: false, order_index: 3, id_question: 204 },
        ]
    },
    // Quiz 6: Croisades
    {
        id_question: 24,
        content: '<p>Combien y a-t-il eu de croisades principales ?</p>',
        order_index: 0,
        id_quiz: 6,
        answers: [
            { id_answer: 92, content: '3', is_correct: false, order_index: 0, id_question: 24 },
            { id_answer: 93, content: '8', is_correct: true, order_index: 1, id_question: 24 },
            { id_answer: 94, content: '12', is_correct: false, order_index: 2, id_question: 24 },
            { id_answer: 95, content: '5', is_correct: false, order_index: 3, id_question: 24 },
        ]
    },
    {
        id_question: 25,
        content: '<p>Quelle ville Ã©tait l\'objectif principal des croisades ?</p>',
        order_index: 1,
        id_quiz: 6,
        answers: [
            { id_answer: 96, content: 'Rome', is_correct: false, order_index: 0, id_question: 25 },
            { id_answer: 97, content: 'JÃ©rusalem', is_correct: true, order_index: 1, id_question: 25 },
            { id_answer: 98, content: 'Constantinople', is_correct: false, order_index: 2, id_question: 25 },
            { id_answer: 99, content: 'Alexandrie', is_correct: false, order_index: 3, id_question: 25 },
        ]
    },
    {
        id_question: 26,
        content: '<p>Quel roi de France participa Ã  la 7e croisade ?</p>',
        order_index: 2,
        id_quiz: 6,
        answers: [
            { id_answer: 100, content: 'Philippe Auguste', is_correct: false, order_index: 0, id_question: 26 },
            { id_answer: 101, content: 'Saint Louis (Louis IX)', is_correct: true, order_index: 1, id_question: 26 },
            { id_answer: 102, content: 'Charlemagne', is_correct: false, order_index: 2, id_question: 26 },
            { id_answer: 103, content: 'Louis XIV', is_correct: false, order_index: 3, id_question: 26 },
        ]
    },
    {
        id_question: 205,
        content: '<p>Quel ordre militaire religieux fut crÃ©Ã© pour protÃ©ger les pÃ¨lerins ?</p>',
        order_index: 3,
        id_quiz: 6,
        answers: [
            { id_answer: 2020, content: 'Les Templiers', is_correct: true, order_index: 0, id_question: 205 },
            { id_answer: 2021, content: 'Les Mousquetaires', is_correct: false, order_index: 1, id_question: 205 },
            { id_answer: 2022, content: 'La Garde Suisse', is_correct: false, order_index: 2, id_question: 205 },
            { id_answer: 2023, content: 'Les SamouraÃ¯s', is_correct: false, order_index: 3, id_question: 205 },
        ]
    },
    {
        id_question: 206,
        content: '<p>Quel grand chef musulman reprit JÃ©rusalem ?</p>',
        order_index: 4,
        id_quiz: 6,
        answers: [
            { id_answer: 2024, content: 'Saladin', is_correct: true, order_index: 0, id_question: 206 },
            { id_answer: 2025, content: 'Soliman le Magnifique', is_correct: false, order_index: 1, id_question: 206 },
            { id_answer: 2026, content: 'Mehmed II', is_correct: false, order_index: 2, id_question: 206 },
            { id_answer: 2027, content: 'Gengis Khan', is_correct: false, order_index: 3, id_question: 206 },
        ]
    },
    // Quiz 7: Art
    {
        id_question: 27,
        content: '<p>Comment appelle-t-on les illustrations dans les manuscrits ?</p>',
        order_index: 0,
        id_quiz: 7,
        answers: [
            { id_answer: 104, content: 'Des photos', is_correct: false, order_index: 0, id_question: 27 },
            { id_answer: 105, content: 'Des enluminures', is_correct: true, order_index: 1, id_question: 27 },
            { id_answer: 106, content: 'Des graffitis', is_correct: false, order_index: 2, id_question: 27 },
            { id_answer: 107, content: 'Des peintures', is_correct: false, order_index: 3, id_question: 27 },
        ]
    },
    {
        id_question: 28,
        content: '<p>Quel style architectural prÃ©cÃ¨de le gothique ?</p>',
        order_index: 1,
        id_quiz: 7,
        answers: [
            { id_answer: 108, content: 'Le baroque', is_correct: false, order_index: 0, id_question: 28 },
            { id_answer: 109, content: 'Le roman', is_correct: true, order_index: 1, id_question: 28 },
            { id_answer: 110, content: 'Le classique', is_correct: false, order_index: 2, id_question: 28 },
            { id_answer: 111, content: 'Le moderne', is_correct: false, order_index: 3, id_question: 28 },
        ]
    },
    {
        id_question: 29,
        content: '<p>Quel matÃ©riau colorÃ© orne les fenÃªtres des cathÃ©drales ?</p>',
        order_index: 2,
        id_quiz: 7,
        answers: [
            { id_answer: 112, content: 'Le plastique', is_correct: false, order_index: 0, id_question: 29 },
            { id_answer: 113, content: 'Le vitrail', is_correct: true, order_index: 1, id_question: 29 },
            { id_answer: 114, content: 'Le papier', is_correct: false, order_index: 2, id_question: 29 },
            { id_answer: 115, content: 'Le bois peint', is_correct: false, order_index: 3, id_question: 29 },
        ]
    },
    {
        id_question: 207,
        content: '<p>Quelle Å“uvre d\'art textile cÃ©lÃ¨bre raconte la conquÃªte de l\'Angleterre ?</p>',
        order_index: 3,
        id_quiz: 7,
        answers: [
            { id_answer: 2028, content: 'La Tapisserie de Bayeux', is_correct: true, order_index: 0, id_question: 207 },
            { id_answer: 2029, content: 'La Joconde', is_correct: false, order_index: 1, id_question: 207 },
            { id_answer: 2030, content: 'Les NymphÃ©as', is_correct: false, order_index: 2, id_question: 207 },
            { id_answer: 2031, content: 'La VÃ©nus de Milo', is_correct: false, order_index: 3, id_question: 207 },
        ]
    },
    // Quiz 8: Rois
    {
        id_question: 30,
        content: '<p>Quel roi fut couronnÃ© en l\'an 800 ?</p>',
        order_index: 0,
        id_quiz: 8,
        answers: [
            { id_answer: 116, content: 'Louis XIV', is_correct: false, order_index: 0, id_question: 30 },
            { id_answer: 117, content: 'Charlemagne', is_correct: true, order_index: 1, id_question: 30 },
            { id_answer: 118, content: 'Clovis', is_correct: false, order_index: 2, id_question: 30 },
            { id_answer: 119, content: 'Hugues Capet', is_correct: false, order_index: 3, id_question: 30 },
        ]
    },
    {
        id_question: 31,
        content: '<p>Quelle dynastie fonda Hugues Capet ?</p>',
        order_index: 1,
        id_quiz: 8,
        answers: [
            { id_answer: 120, content: 'Les MÃ©rovingiens', is_correct: false, order_index: 0, id_question: 31 },
            { id_answer: 121, content: 'Les CapÃ©tiens', is_correct: true, order_index: 1, id_question: 31 },
            { id_answer: 122, content: 'Les Carolingiens', is_correct: false, order_index: 2, id_question: 31 },
            { id_answer: 123, content: 'Les Bourbons', is_correct: false, order_index: 3, id_question: 31 },
        ]
    },
    {
        id_question: 32,
        content: '<p>Quel roi gagna la bataille de Bouvines ?</p>',
        order_index: 2,
        id_quiz: 8,
        answers: [
            { id_answer: 124, content: 'Philippe Auguste', is_correct: true, order_index: 0, id_question: 32 },
            { id_answer: 125, content: 'Louis IX', is_correct: false, order_index: 1, id_question: 32 },
            { id_answer: 126, content: 'Charles VII', is_correct: false, order_index: 2, id_question: 32 },
            { id_answer: 127, content: 'FranÃ§ois Ier', is_correct: false, order_index: 3, id_question: 32 },
        ]
    },
    {
        id_question: 208,
        content: '<p>Quel roi est surnommÃ© "Le Roi-Soleil" (PÃ©riode moderne mais pour le piÃ¨ge) ?</p>',
        order_index: 3,
        id_quiz: 8,
        answers: [
            { id_answer: 2032, content: 'Louis XIV', is_correct: true, order_index: 0, id_question: 208 },
            { id_answer: 2033, content: 'Louis IX', is_correct: false, order_index: 1, id_question: 208 },
            { id_answer: 2034, content: 'Henri IV', is_correct: false, order_index: 2, id_question: 208 },
            { id_answer: 2035, content: 'FranÃ§ois Ier', is_correct: false, order_index: 3, id_question: 208 },
        ]
    },
    // Quiz 9: LÃ©gendes
    {
        id_question: 33,
        content: '<p>Quel chevalier lÃ©gendaire cherchait le Graal ?</p>',
        order_index: 0,
        id_quiz: 9,
        answers: [
            { id_answer: 128, content: 'Lancelot', is_correct: false, order_index: 0, id_question: 33 },
            { id_answer: 129, content: 'Perceval', is_correct: true, order_index: 1, id_question: 33 },
            { id_answer: 130, content: 'Gauvain', is_correct: false, order_index: 2, id_question: 33 },
            { id_answer: 131, content: 'Tristan', is_correct: false, order_index: 3, id_question: 33 },
        ]
    },
    {
        id_question: 34,
        content: '<p>Quel roi est associÃ© Ã  la Table Ronde ?</p>',
        order_index: 1,
        id_quiz: 9,
        answers: [
            { id_answer: 132, content: 'Charlemagne', is_correct: false, order_index: 0, id_question: 34 },
            { id_answer: 133, content: 'Arthur', is_correct: true, order_index: 1, id_question: 34 },
            { id_answer: 134, content: 'Richard Coeur de Lion', is_correct: false, order_index: 2, id_question: 34 },
            { id_answer: 135, content: 'Guillaume le ConquÃ©rant', is_correct: false, order_index: 3, id_question: 34 },
        ]
    },
    {
        id_question: 35,
        content: '<p>Quel Ãªtre fantastique crache du feu ?</p>',
        order_index: 2,
        id_quiz: 9,
        answers: [
            { id_answer: 136, content: 'La licorne', is_correct: false, order_index: 0, id_question: 35 },
            { id_answer: 137, content: 'Le dragon', is_correct: true, order_index: 1, id_question: 35 },
            { id_answer: 138, content: 'Le griffon', is_correct: false, order_index: 2, id_question: 35 },
            { id_answer: 139, content: 'La fÃ©e', is_correct: false, order_index: 3, id_question: 35 },
        ]
    },
    // Quiz 10: Tournois
    {
        id_question: 36,
        content: '<p>Comment appelle-t-on un combat Ã  cheval avec des lances ?</p>',
        order_index: 0,
        id_quiz: 10,
        answers: [
            { id_answer: 140, content: 'Un duel', is_correct: false, order_index: 0, id_question: 36 },
            { id_answer: 141, content: 'Une joute', is_correct: true, order_index: 1, id_question: 36 },
            { id_answer: 142, content: 'Un tournoi', is_correct: false, order_index: 2, id_question: 36 },
            { id_answer: 143, content: 'Une mÃªlÃ©e', is_correct: false, order_index: 3, id_question: 36 },
        ]
    },
    {
        id_question: 37,
        content: '<p>Quel accessoire le chevalier offrait-il Ã  sa dame ?</p>',
        order_index: 1,
        id_quiz: 10,
        answers: [
            { id_answer: 144, content: 'Une fleur', is_correct: false, order_index: 0, id_question: 37 },
            { id_answer: 145, content: 'Son Ã©charpe (ou faveur)', is_correct: true, order_index: 1, id_question: 37 },
            { id_answer: 146, content: 'Sa lance', is_correct: false, order_index: 2, id_question: 37 },
            { id_answer: 147, content: 'Son bouclier', is_correct: false, order_index: 3, id_question: 37 },
        ]
    },
    {
        id_question: 38,
        content: '<p>Quel Ã©tait le prix souvent remportÃ© par le vainqueur ?</p>',
        order_index: 2,
        id_quiz: 10,
        answers: [
            { id_answer: 148, content: 'De l\'argent', is_correct: false, order_index: 0, id_question: 38 },
            { id_answer: 149, content: 'Le cheval et l\'armure du vaincu', is_correct: true, order_index: 1, id_question: 38 },
            { id_answer: 150, content: 'Une couronne', is_correct: false, order_index: 2, id_question: 38 },
            { id_answer: 151, content: 'Un chÃ¢teau', is_correct: false, order_index: 3, id_question: 38 },
        ]
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
            title: 'Quiz sur le Moyen Ã‚ge',
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
            title: 'Quiz sur le Moyen Ã‚ge',
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

