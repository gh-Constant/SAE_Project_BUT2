/**
 * @file quizzes.ts
 * @description Mock data for quizzes
 */

import type { Quiz, QuizQuestion, UserQuizAttempt, UserQuizAnswer } from '@/types/quiz';

// Mock Quizzes
export const mockQuizzes: Quiz[] = [
    {
        id_quiz: 1,
        title: 'Les Indispensables de l\'Aventurier',
        description: 'Testez vos connaissances sur nos meilleures ventes : potions et équipements !',
        image_url: '/images/products/potion-soin.jpg',
        is_active: true,
        created_at: '2024-12-01T10:00:00Z',
        updated_at: '2024-12-01T10:00:00Z',
        id_location: 14,
        id_creator: 1,
        location: {
            id_location: 14,
            name: 'Stand Marchand #5',
        },
        creator: {
            id_user: 1,
            firstname: 'Gérard',
            lastname: 'Le Prestataire',
        },
        _count: {
            attempts: 127,
            questions: 3,
        },
        uniqueParticipants: 85,
        averageScore: 72,
    },
    {
        id_quiz: 2,
        title: 'Nos Armes et Boucliers',
        description: 'Tout savoir sur la fabrication de nos épées et boucliers en bois.',
        image_url: '/images/products/epee-bois.jpg',
        is_active: true,
        created_at: '2024-12-05T14:30:00Z',
        updated_at: '2024-12-05T14:30:00Z',
        id_location: 15,
        id_creator: 1,
        location: {
            id_location: 15,
            name: 'Stand Marchand #6',
        },
        creator: {
            id_user: 1,
            firstname: 'Gérard',
            lastname: 'Le Prestataire',
        },
        _count: {
            attempts: 89,
            questions: 3,
        },
        uniqueParticipants: 65,
        averageScore: 65,
    },
    {
        id_quiz: 3,
        title: 'Saveurs du Terroir',
        description: 'Découvrez les secrets de notre Jambon de Sanglier et Hydromel.',
        image_url: '/images/products/hydromel.jpg',
        is_active: true,
        created_at: '2024-12-10T09:00:00Z',
        updated_at: '2024-12-10T09:00:00Z',
        id_location: 16,
        id_creator: 4,
        location: {
            id_location: 16,
            name: 'Stand Marchand #7',
        },
        creator: {
            id_user: 4,
            firstname: 'Marie',
            lastname: 'La Marchande',
        },
        _count: {
            attempts: 56,
            questions: 3,
        },
        uniqueParticipants: 42,
        averageScore: 81,
    },
    {
        id_quiz: 4,
        title: 'Archers d\'Élite',
        description: 'Quel bois utilisons-nous pour nos arcs et flèches ?',
        image_url: '/images/products/arc-bois.jpg',
        is_active: true,
        created_at: '2024-12-12T11:00:00Z',
        updated_at: '2024-12-12T11:00:00Z',
        id_location: 16,
        id_creator: 4,
        location: {
            id_location: 16,
            name: 'Stand Marchand #7',
        },
        creator: {
            id_user: 4,
            firstname: 'Marie',
            lastname: 'La Marchande',
        },
        _count: {
            attempts: 112,
            questions: 3,
        },
        uniqueParticipants: 95,
        averageScore: 58,
    },
    {
        id_quiz: 5,
        title: 'La Vie des Paysans',
        description: 'Le quotidien du peuple au Moyen Âge',
        image_url: '/images/quizzes/peasants.jpg',
        is_active: true,
        created_at: '2024-12-14T08:30:00Z',
        updated_at: '2024-12-14T08:30:00Z',
        id_location: 17,
        id_creator: 5,
        location: {
            id_location: 17,
            name: 'Stand Marchand #8',
        },
        creator: {
            id_user: 5,
            firstname: 'Pierre',
            lastname: 'Le Paysan',
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
        description: 'L\'histoire des grandes expéditions',
        image_url: '/images/quizzes/crusades.jpg',
        is_active: true,
        created_at: '2024-12-15T15:00:00Z',
        updated_at: '2024-12-15T15:00:00Z',
        id_location: 17,
        id_creator: 5,
        location: {
            id_location: 17,
            name: 'Stand Marchand #8',
        },
        creator: {
            id_user: 5,
            firstname: 'Pierre',
            lastname: 'Le Paysan',
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
        title: 'L\'Art Médiéval',
        description: 'Enluminures, vitraux et sculptures',
        image_url: '/images/quizzes/art.jpg',
        is_active: true,
        created_at: '2024-12-18T10:00:00Z',
        updated_at: '2024-12-18T10:00:00Z',
        id_location: 18,
        id_creator: 6,
        location: {
            id_location: 18,
            name: 'Stand Marchand #9',
        },
        creator: {
            id_user: 6,
            firstname: 'Jacques',
            lastname: 'L\'explorateur',
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
        description: 'Les grandes dynasties françaises',
        image_url: '/images/quizzes/kings.jpg',
        is_active: true,
        created_at: '2024-12-20T14:00:00Z',
        updated_at: '2024-12-20T14:00:00Z',
        id_location: 15,
        id_creator: 1,
        location: {
            id_location: 15,
            name: 'Stand Marchand #6',
        },
        creator: {
            id_user: 1,
            firstname: 'Gérard',
            lastname: 'Le Prestataire',
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
        title: 'Légendes et Mythes',
        description: 'Dragons, fées et créatures fantastiques',
        image_url: '/images/quizzes/legends.jpg',
        is_active: true,
        created_at: '2024-12-22T09:00:00Z',
        updated_at: '2024-12-22T09:00:00Z',
        id_location: 16,
        id_creator: 4,
        location: {
            id_location: 16,
            name: 'Stand Marchand #7',
        },
        creator: {
            id_user: 4,
            firstname: 'Marie',
            lastname: 'La Marchande',
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
        description: 'Joutes et compétitions chevaleresques',
        image_url: '/images/quizzes/tournament.jpg',
        is_active: true,
        created_at: '2024-12-25T16:00:00Z',
        updated_at: '2024-12-25T16:00:00Z',
        id_location: 18,
        id_creator: 6,
        location: {
            id_location: 18,
            name: 'Stand Marchand #9',
        },
        creator: {
            id_user: 6,
            firstname: 'Jacques',
            lastname: 'L\'explorateur',
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
    // Quiz 1: Produits Essentiels (Potion, Pain)
    {
        id_question: 1,
        content: '<p>Combien de points de vie restaure notre <strong>Potion de soin</strong> ?</p>',
        image_url: '/images/products/potion-soin.jpg',
        order_index: 0,
        id_quiz: 1,
        answers: [
            { id_answer: 1, content: '10 PV', is_correct: false, order_index: 0, id_question: 1 },
            { id_answer: 2, content: '50 PV', is_correct: true, order_index: 1, id_question: 1 },
            { id_answer: 3, content: '100 PV', is_correct: false, order_index: 2, id_question: 1 },
            { id_answer: 4, content: 'Elle est empoisonnée', is_correct: false, order_index: 3, id_question: 1 },
        ],
    },
    {
        id_question: 2,
        content: '<p>Quel ingrédient rend notre <strong>Pain médiéval</strong> si spécial ?</p>',
        image_url: '/images/products/pain-medieval.jpg',
        order_index: 1,
        id_quiz: 1,
        answers: [
            { id_answer: 5, content: 'La levure chimique', is_correct: false, order_index: 0, id_question: 2 },
            { id_answer: 6, content: 'Une cuisson au four à bois', is_correct: true, order_index: 1, id_question: 2 },
            { id_answer: 7, content: 'Le sucre glace', is_correct: false, order_index: 2, id_question: 2 },
            { id_answer: 8, content: 'Le chocolat', is_correct: false, order_index: 3, id_question: 2 },
        ],
    },
    {
        id_question: 3,
        content: '<p>Quelle est la durée de combustion de nos <strong>Chandelles parfumées</strong> ?</p>',
        image_url: '/images/products/chandelle.jpg',
        order_index: 2,
        id_quiz: 1,
        answers: [
            { id_answer: 9, content: '1 heure', is_correct: false, order_index: 0, id_question: 3 },
            { id_answer: 10, content: 'Toute la nuit', is_correct: true, order_index: 1, id_question: 3 },
            { id_answer: 11, content: '5 minutes', is_correct: false, order_index: 2, id_question: 3 },
            { id_answer: 12, content: 'Elles n\'éclairent pas', is_correct: false, order_index: 3, id_question: 3 },
        ],
    },

    // Quiz 2: Armes et Boucliers
    {
        id_question: 6,
        content: '<p>En quelle matière est fabriquée notre <strong>Épée d\'entraînement</strong> ?</p>',
        image_url: '/images/products/epee-bois.jpg',
        order_index: 0,
        id_quiz: 2,
        answers: [
            { id_answer: 21, content: 'En acier Valyrien', is_correct: false, order_index: 0, id_question: 6 },
            { id_answer: 22, content: 'En Bois résistant', is_correct: true, order_index: 1, id_question: 6 },
            { id_answer: 23, content: 'En mousse', is_correct: false, order_index: 2, id_question: 6 },
            { id_answer: 24, content: 'En diamant', is_correct: false, order_index: 3, id_question: 6 },
        ]
    },
    {
        id_question: 7,
        content: '<p>Quel est l\'usage principal du <strong>Bouclier décoratif</strong> ?</p>',
        image_url: '/images/products/bouclier.jpg',
        order_index: 1,
        id_quiz: 2,
        answers: [
            { id_answer: 25, content: 'Parer les flèches', is_correct: false, order_index: 0, id_question: 7 },
            { id_answer: 26, content: 'Décorer votre demeure', is_correct: true, order_index: 1, id_question: 7 },
            { id_answer: 27, content: 'Servir de plateau repas', is_correct: false, order_index: 2, id_question: 7 },
            { id_answer: 28, content: 'Faire de la luge', is_correct: false, order_index: 3, id_question: 7 },
        ]
    },
    {
        id_question: 8,
        content: '<p>Pour qui est conçue la <strong>Tunique médiévale</strong> ?</p>',
        image_url: '/images/products/tunique.jpg',
        order_index: 2,
        id_quiz: 2,
        answers: [
            { id_answer: 29, content: 'Les aventuriers en quête de confort', is_correct: true, order_index: 0, id_question: 8 },
            { id_answer: 30, content: 'Les chevaux', is_correct: false, order_index: 1, id_question: 8 },
            { id_answer: 31, content: 'Les fantômes', is_correct: false, order_index: 2, id_question: 8 },
            { id_answer: 32, content: 'La royauté uniquement', is_correct: false, order_index: 3, id_question: 8 },
        ]
    },

    // Quiz 3: Gastronomie (Jambon, Hydromel)
    {
        id_question: 11,
        content: '<p>Quelle est la saveur principale de notre <strong>Hydromel artisanal</strong> ?</p>',
        image_url: '/images/products/hydromel.jpg',
        order_index: 0,
        id_quiz: 3,
        answers: [
            { id_answer: 41, content: 'Amère', is_correct: false, order_index: 0, id_question: 11 },
            { id_answer: 42, content: 'Douce et fruitée', is_correct: true, order_index: 1, id_question: 11 },
            { id_answer: 43, content: 'Salée', is_correct: false, order_index: 2, id_question: 11 },
            { id_answer: 44, content: 'Piquante', is_correct: false, order_index: 3, id_question: 11 },
        ]
    },
    {
        id_question: 12,
        content: '<p>De quel animal provient notre célèbre <strong>Jambon fumé</strong> ?</p>',
        image_url: '/images/products/jambon-sanglier.jpg',
        order_index: 1,
        id_quiz: 3,
        answers: [
            { id_answer: 45, content: 'Du poulet', is_correct: false, order_index: 0, id_question: 12 },
            { id_answer: 46, content: 'Du Sanglier', is_correct: true, order_index: 1, id_question: 12 },
            { id_answer: 47, content: 'Du dragon', is_correct: false, order_index: 2, id_question: 12 },
            { id_answer: 48, content: 'Du poisson', is_correct: false, order_index: 3, id_question: 12 },
        ]
    },
    {
        id_question: 13,
        content: '<p>Quel produit accompagne le mieux le jambon ?</p>',
        image_url: '/images/products/pain-medieval.jpg',
        order_index: 2,
        id_quiz: 3,
        answers: [
            { id_answer: 49, content: 'Le sable', is_correct: false, order_index: 0, id_question: 13 },
            { id_answer: 50, content: 'L\'eau de mer', is_correct: false, order_index: 1, id_question: 13 },
            { id_answer: 51, content: 'Notre Pain artisanal', is_correct: true, order_index: 2, id_question: 13 },
            { id_answer: 52, content: 'Des cailloux', is_correct: false, order_index: 3, id_question: 13 },
        ]
    },
    // Quiz 4: Châteaux (Multi-answers)
    /* Question removed
    {
        id_question: 16,
        content: '<p>Quelles sont les couleurs primaires ?</p>',
        ...
    },
    */
    {
        id_question: 17,
        content: '<p>Quels animaux sont des mammifères ?</p>',
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
        content: '<p>Question piège : Une seule bonne réponse.</p>',
        order_index: 2,
        id_quiz: 4,
        answers: [
            { id_answer: 70, content: 'Bonne réponse', is_correct: true, order_index: 0, id_question: 18 },
            { id_answer: 71, content: 'Mauvaise', is_correct: false, order_index: 1, id_question: 18 },
            { id_answer: 72, content: 'Mauvaise', is_correct: false, order_index: 2, id_question: 18 },
        ]
    },
    {
        id_question: 19,
        content: '<p>Sélectionnez tous les nombres pairs.</p>',
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
        content: '<p>Quelle est la capitale de la France ? (Choix unique, vérification interface)</p>',
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
        content: '<p>Comment appelait-on le paysan attaché à une terre ?</p>',
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
        content: '<p>Quel pourcentage de la population était paysanne au Moyen Âge ?</p>',
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
            { id_answer: 90, content: 'L\'impôt sur le revenu', is_correct: false, order_index: 2, id_question: 23 },
            { id_answer: 91, content: 'La cotisation', is_correct: false, order_index: 3, id_question: 23 },
        ]
    },
    {
        id_question: 203,
        content: '<p>Qu\'est-ce que la corvée ?</p>',
        order_index: 3,
        id_quiz: 5,
        answers: [
            { id_answer: 2012, content: 'Un travail gratuit pour le seigneur', is_correct: true, order_index: 0, id_question: 203 },
            { id_answer: 2013, content: 'Un impôt en argent', is_correct: false, order_index: 1, id_question: 203 },
            { id_answer: 2014, content: 'Une fête de village', is_correct: false, order_index: 2, id_question: 203 },
            { id_answer: 2015, content: 'Un outil agricole', is_correct: false, order_index: 3, id_question: 203 },
        ]
    },
    {
        id_question: 204,
        content: '<p>Quel outil agricole est emblématique du paysan ?</p>',
        order_index: 4,
        id_quiz: 5,
        answers: [
            { id_answer: 2016, content: 'L\'épée', is_correct: false, order_index: 0, id_question: 204 },
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
        content: '<p>Quelle ville était l\'objectif principal des croisades ?</p>',
        order_index: 1,
        id_quiz: 6,
        answers: [
            { id_answer: 96, content: 'Rome', is_correct: false, order_index: 0, id_question: 25 },
            { id_answer: 97, content: 'Jérusalem', is_correct: true, order_index: 1, id_question: 25 },
            { id_answer: 98, content: 'Constantinople', is_correct: false, order_index: 2, id_question: 25 },
            { id_answer: 99, content: 'Alexandrie', is_correct: false, order_index: 3, id_question: 25 },
        ]
    },
    {
        id_question: 26,
        content: '<p>Quel roi de France participa à la 7e croisade ?</p>',
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
        content: '<p>Quel ordre militaire religieux fut créé pour protéger les pèlerins ?</p>',
        order_index: 3,
        id_quiz: 6,
        answers: [
            { id_answer: 2020, content: 'Les Templiers', is_correct: true, order_index: 0, id_question: 205 },
            { id_answer: 2021, content: 'Les Mousquetaires', is_correct: false, order_index: 1, id_question: 205 },
            { id_answer: 2022, content: 'La Garde Suisse', is_correct: false, order_index: 2, id_question: 205 },
            { id_answer: 2023, content: 'Les Samouraïs', is_correct: false, order_index: 3, id_question: 205 },
        ]
    },
    {
        id_question: 206,
        content: '<p>Quel grand chef musulman reprit Jérusalem ?</p>',
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
        content: '<p>Quel style architectural précède le gothique ?</p>',
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
        content: '<p>Quel matériau coloré orne les fenêtres des cathédrales ?</p>',
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
        content: '<p>Quelle œuvre d\'art textile célèbre raconte la conquête de l\'Angleterre ?</p>',
        order_index: 3,
        id_quiz: 7,
        answers: [
            { id_answer: 2028, content: 'La Tapisserie de Bayeux', is_correct: true, order_index: 0, id_question: 207 },
            { id_answer: 2029, content: 'La Joconde', is_correct: false, order_index: 1, id_question: 207 },
            { id_answer: 2030, content: 'Les Nymphéas', is_correct: false, order_index: 2, id_question: 207 },
            { id_answer: 2031, content: 'La Vénus de Milo', is_correct: false, order_index: 3, id_question: 207 },
        ]
    },
    // Quiz 8: Rois
    {
        id_question: 30,
        content: '<p>Quel roi fut couronné en l\'an 800 ?</p>',
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
            { id_answer: 120, content: 'Les Mérovingiens', is_correct: false, order_index: 0, id_question: 31 },
            { id_answer: 121, content: 'Les Capétiens', is_correct: true, order_index: 1, id_question: 31 },
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
            { id_answer: 127, content: 'François Ier', is_correct: false, order_index: 3, id_question: 32 },
        ]
    },
    {
        id_question: 208,
        content: '<p>Quel roi est surnommé "Le Roi-Soleil" (Période moderne mais pour le piège) ?</p>',
        order_index: 3,
        id_quiz: 8,
        answers: [
            { id_answer: 2032, content: 'Louis XIV', is_correct: true, order_index: 0, id_question: 208 },
            { id_answer: 2033, content: 'Louis IX', is_correct: false, order_index: 1, id_question: 208 },
            { id_answer: 2034, content: 'Henri IV', is_correct: false, order_index: 2, id_question: 208 },
            { id_answer: 2035, content: 'François Ier', is_correct: false, order_index: 3, id_question: 208 },
        ]
    },
    // Quiz 9: Légendes
    {
        id_question: 33,
        content: '<p>Quel chevalier légendaire cherchait le Graal ?</p>',
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
        content: '<p>Quel roi est associé à la Table Ronde ?</p>',
        order_index: 1,
        id_quiz: 9,
        answers: [
            { id_answer: 132, content: 'Charlemagne', is_correct: false, order_index: 0, id_question: 34 },
            { id_answer: 133, content: 'Arthur', is_correct: true, order_index: 1, id_question: 34 },
            { id_answer: 134, content: 'Richard Coeur de Lion', is_correct: false, order_index: 2, id_question: 34 },
            { id_answer: 135, content: 'Guillaume le Conquérant', is_correct: false, order_index: 3, id_question: 34 },
        ]
    },
    {
        id_question: 35,
        content: '<p>Quel être fantastique crache du feu ?</p>',
        order_index: 2,
        id_quiz: 9,
        answers: [
            { id_answer: 136, content: 'La licorne', is_correct: false, order_index: 0, id_question: 35 },
            { id_answer: 137, content: 'Le dragon', is_correct: true, order_index: 1, id_question: 35 },
            { id_answer: 138, content: 'Le griffon', is_correct: false, order_index: 2, id_question: 35 },
            { id_answer: 139, content: 'La fée', is_correct: false, order_index: 3, id_question: 35 },
        ]
    },
    // Quiz 10: Tournois
    {
        id_question: 36,
        content: '<p>Comment appelle-t-on un combat à cheval avec des lances ?</p>',
        order_index: 0,
        id_quiz: 10,
        answers: [
            { id_answer: 140, content: 'Un duel', is_correct: false, order_index: 0, id_question: 36 },
            { id_answer: 141, content: 'Une joute', is_correct: true, order_index: 1, id_question: 36 },
            { id_answer: 142, content: 'Un tournoi', is_correct: false, order_index: 2, id_question: 36 },
            { id_answer: 143, content: 'Une mêlée', is_correct: false, order_index: 3, id_question: 36 },
        ]
    },
    {
        id_question: 37,
        content: '<p>Quel accessoire le chevalier offrait-il à sa dame ?</p>',
        order_index: 1,
        id_quiz: 10,
        answers: [
            { id_answer: 144, content: 'Une fleur', is_correct: false, order_index: 0, id_question: 37 },
            { id_answer: 145, content: 'Son écharpe (ou faveur)', is_correct: true, order_index: 1, id_question: 37 },
            { id_answer: 146, content: 'Sa lance', is_correct: false, order_index: 2, id_question: 37 },
            { id_answer: 147, content: 'Son bouclier', is_correct: false, order_index: 3, id_question: 37 },
        ]
    },
    {
        id_question: 38,
        content: '<p>Quel était le prix souvent remporté par le vainqueur ?</p>',
        order_index: 2,
        id_quiz: 10,
        answers: [
            { id_answer: 148, content: 'De l\'argent', is_correct: false, order_index: 0, id_question: 38 },
            { id_answer: 149, content: 'Le cheval et l\'armure du vaincu', is_correct: true, order_index: 1, id_question: 38 },
            { id_answer: 150, content: 'Une couronne', is_correct: false, order_index: 2, id_question: 38 },
            { id_answer: 151, content: 'Un château', is_correct: false, order_index: 3, id_question: 38 },
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
