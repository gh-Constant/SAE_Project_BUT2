import prisma from '../prisma.js';

export async function seedQuizzes() {
    console.log('📝 Seeding quizzes...');

    // Clean up existing questions to prevent duplicates and ensure fresh state
    try {
        // Clean up Ticket Office quizzes (id_location: 1) as requested
        await prisma.quiz.deleteMany({
            where: { id_location: 1 }
        });

        await prisma.quizQuestion.deleteMany({
            where: { id_quiz: { in: [1, 2, 3, 4] } }
        });
    } catch (e) {
        console.warn("⚠️ Warning clearing quiz questions:", e);
    }

    // 1. Quiz sur le Moyen Âge
    const q1Questions = [
        {
            content: '<p>Quelle est la durée approximative du <strong>Moyen Âge</strong> en Europe ?</p>',
            order_index: 0,
            answers: {
                create: [
                    { content: '500 ans', is_correct: false, order_index: 0 },
                    { content: '1000 ans', is_correct: true, order_index: 1 },
                    { content: '200 ans', is_correct: false, order_index: 2 },
                    { content: '1500 ans', is_correct: false, order_index: 3 },
                ]
            }
        },
        {
            content: '<p>Quel événement marque traditionnellement le <em>début</em> du Moyen Âge ?</p>',
            order_index: 1,
            answers: {
                create: [
                    { content: 'La chute de Rome', is_correct: true, order_index: 0 },
                    { content: 'La découverte de l\'Amérique', is_correct: false, order_index: 1 },
                    { content: 'La Révolution française', is_correct: false, order_index: 2 },
                    { content: 'L\'invention de l\'imprimerie', is_correct: false, order_index: 3 },
                ]
            }
        },
        {
            content: '<p>Comment appelle-t-on le système économique et social du Moyen Âge ?</p>',
            order_index: 2,
            answers: {
                create: [
                    { content: 'Le capitalisme', is_correct: false, order_index: 0 },
                    { content: 'Le communisme', is_correct: false, order_index: 1 },
                    { content: 'La féodalité', is_correct: true, order_index: 2 },
                    { content: 'La démocratie', is_correct: false, order_index: 3 },
                ]
            }
        },
        {
            content: '<p>Quelle construction est typique de l\'architecture médiévale religieuse ?</p>',
            order_index: 3,
            answers: {
                create: [
                    { content: 'Les pyramides', is_correct: false, order_index: 0 },
                    { content: 'Les cathédrales gothiques', is_correct: true, order_index: 1 },
                    { content: 'Les colisées', is_correct: false, order_index: 2 },
                    { content: 'Les temples grecs', is_correct: false, order_index: 3 },
                ]
            }
        },
        {
            content: '<p>Quel était le rôle principal des <strong>chevaliers</strong> au Moyen Âge ?</p>',
            order_index: 4,
            answers: {
                create: [
                    { content: 'Commerçants', is_correct: false, order_index: 0 },
                    { content: 'Guerriers au service d\'un seigneur', is_correct: true, order_index: 1 },
                    { content: 'Agriculteurs', is_correct: false, order_index: 2 },
                    { content: 'Artistes', is_correct: false, order_index: 3 },
                ]
            }
        }
    ];

    await prisma.quiz.upsert({
        where: { id_quiz: 1 },
        update: { questions: { create: q1Questions } },
        create: {
            id_quiz: 1,
            title: 'Quiz sur le Moyen Âge',
            description: 'Testez vos connaissances sur l\'époque médiévale !',
            image_url: '/images/quizzes/medieval.jpg',
            is_active: true,
            id_location: 14,
            id_creator: 1,
            questions: { create: q1Questions }
        }
    });

    // 2. Les Chevaliers et leurs Armes
    const q2Questions = [
        {
            content: '<p>Quelle arme est le symbole du chevalier ?</p>',
            order_index: 0,
            answers: {
                create: [
                    { content: 'L\'arc', is_correct: false, order_index: 0 },
                    { content: 'L\'épée', is_correct: true, order_index: 1 },
                    { content: 'La masse', is_correct: false, order_index: 2 },
                    { content: 'Le fléau', is_correct: false, order_index: 3 },
                ]
            }
        },
        {
            content: '<p>Comment appelle-t-on le casque intégral du chevalier ?</p>',
            order_index: 1,
            answers: {
                create: [
                    { content: 'Le képi', is_correct: false, order_index: 0 },
                    { content: 'Le heaume', is_correct: true, order_index: 1 },
                    { content: 'Le bonnet', is_correct: false, order_index: 2 },
                    { content: 'La coiffe', is_correct: false, order_index: 3 },
                ]
            }
        },
        {
            content: '<p>Quelle protection en mailles métalliques les chevaliers portaient-ils ?</p>',
            order_index: 2,
            answers: {
                create: [
                    { content: 'La cotte de mailles', is_correct: true, order_index: 0 },
                    { content: 'Le pull en laine', is_correct: false, order_index: 1 },
                    { content: 'L\'armure de cuir', is_correct: false, order_index: 2 },
                    { content: 'La tunique', is_correct: false, order_index: 3 },
                ]
            }
        },
        {
            content: '<p>Quelle arme longue était utilisée lors des joutes équestres ?</p>',
            order_index: 3,
            answers: {
                create: [
                    { content: 'La dague', is_correct: false, order_index: 0 },
                    { content: 'La lance', is_correct: true, order_index: 1 },
                    { content: 'Le marteau', is_correct: false, order_index: 2 },
                    { content: 'La hache', is_correct: false, order_index: 3 },
                ]
            }
        },
        {
            content: '<p>Comment s\'appelle le code de conduite des chevaliers ?</p>',
            order_index: 4,
            answers: {
                create: [
                    { content: 'Le code de la route', is_correct: false, order_index: 0 },
                    { content: 'Le code civil', is_correct: false, order_index: 1 },
                    { content: 'L\'esprit chevaleresque (ou courtois)', is_correct: true, order_index: 2 },
                    { content: 'Le règlement intérieur', is_correct: false, order_index: 3 },
                ]
            }
        }
    ];

    await prisma.quiz.upsert({
        where: { id_quiz: 2 },
        update: { questions: { create: q2Questions } },
        create: {
            id_quiz: 2,
            title: 'Les Chevaliers et leurs Armes',
            description: 'Connaissez-vous les équipements des chevaliers ?',
            image_url: '/images/quizzes/knights.jpg',
            is_active: true,
            id_location: 15,
            id_creator: 1,
            questions: { create: q2Questions }
        }
    });

    // 3. La Gastronomie Médiévale
    const q3Questions = [
        {
            content: '<p>Quelle viande était la plus consommée par les nobles ?</p>',
            order_index: 0,
            answers: {
                create: [
                    { content: 'Le poulet', is_correct: false, order_index: 0 },
                    { content: 'Le gibier (cerf, sanglier)', is_correct: true, order_index: 1 },
                    { content: 'Le poisson', is_correct: false, order_index: 2 },
                    { content: 'Le boeuf', is_correct: false, order_index: 3 },
                ]
            }
        },
        {
            content: '<p>Pourquoi utilisait-on beaucoup d\'épices ?</p>',
            order_index: 1,
            answers: {
                create: [
                    { content: 'Pour masquer le goût avarié', is_correct: false, order_index: 0 },
                    { content: 'Pour montrer sa richesse', is_correct: true, order_index: 1 },
                    { content: 'Pour la santé uniquement', is_correct: false, order_index: 2 },
                    { content: 'C\'était gratuit', is_correct: false, order_index: 3 },
                ]
            }
        },
        {
            content: '<p>Quelle boisson remplaçait souvent l\'eau (souvent polluée) ?</p>',
            order_index: 2,
            answers: {
                create: [
                    { content: 'Le soda', is_correct: false, order_index: 0 },
                    { content: 'Le jus d\'orange', is_correct: false, order_index: 1 },
                    { content: 'Le vin ou la cervoise', is_correct: true, order_index: 2 },
                    { content: 'Le lait', is_correct: false, order_index: 3 },
                ]
            }
        },
        {
            content: '<p>Quel aliment était la base de l\'alimentation paysanne ?</p>',
            order_index: 3,
            answers: {
                create: [
                    { content: 'Le pain', is_correct: true, order_index: 0 },
                    { content: 'Le caviar', is_correct: false, order_index: 1 },
                    { content: 'Les gâteaux', is_correct: false, order_index: 2 },
                    { content: 'Le riz', is_correct: false, order_index: 3 },
                ]
            }
        },
        {
            content: '<p>Avec quoi mangeait-on principalement ?</p>',
            order_index: 4,
            answers: {
                create: [
                    { content: 'Avec des fourchettes en or', is_correct: false, order_index: 0 },
                    { content: 'Avec les doigts et un couteau', is_correct: true, order_index: 1 },
                    { content: 'Avec des baguettes', is_correct: false, order_index: 2 },
                    { content: 'Avec une paille', is_correct: false, order_index: 3 },
                ]
            }
        }
    ];

    await prisma.quiz.upsert({
        where: { id_quiz: 3 },
        update: { questions: { create: q3Questions } },
        create: {
            id_quiz: 3,
            title: 'La Gastronomie Médiévale',
            description: 'Que mangeait-on au Moyen Âge ?',
            image_url: '/images/quizzes/food.jpg',
            is_active: true,
            id_location: 16,
            id_creator: 4,
            questions: { create: q3Questions }
        }
    });

    // 4. Test Multi-Réponses
    const q4Questions = [
        {
            content: '<p>Quelles sont les couleurs primaires ?</p>',
            order_index: 0,
            answers: {
                create: [
                    { content: 'Rouge', is_correct: true, order_index: 0 },
                    { content: 'Vert', is_correct: false, order_index: 1 },
                    { content: 'Bleu', is_correct: true, order_index: 2 },
                    { content: 'Orange', is_correct: false, order_index: 3 },
                ]
            }
        },
        {
            content: '<p>Quels animaux sont des mammifères ?</p>',
            order_index: 1,
            answers: {
                create: [
                    { content: 'Chien', is_correct: true, order_index: 0 },
                    { content: 'Chat', is_correct: true, order_index: 1 },
                    { content: 'Serpent', is_correct: false, order_index: 2 },
                    { content: 'Vache', is_correct: true, order_index: 3 },
                    { content: 'Aigle', is_correct: false, order_index: 4 },
                ]
            }
        },
        {
            content: '<p>Question piège : Une seule bonne réponse.</p>',
            order_index: 2,
            answers: {
                create: [
                    { content: 'Bonne réponse', is_correct: true, order_index: 0 },
                    { content: 'Mauvaise', is_correct: false, order_index: 1 },
                    { content: 'Mauvaise', is_correct: false, order_index: 2 },
                ]
            }
        },
        {
            content: '<p>Sélectionnez tous les nombres pairs.</p>',
            order_index: 3,
            answers: {
                create: [
                    { content: '2', is_correct: true, order_index: 0 },
                    { content: '3', is_correct: false, order_index: 1 },
                    { content: '6', is_correct: true, order_index: 2 },
                    { content: '9', is_correct: false, order_index: 3 },
                ]
            }
        },
        {
            content: '<p>Quelle est la capitale de la France ? (Choix unique, vérification interface)</p>',
            order_index: 4,
            answers: {
                create: [
                    { content: 'Lyon', is_correct: false, order_index: 0 },
                    { content: 'Paris', is_correct: true, order_index: 1 },
                    { content: 'Marseille', is_correct: false, order_index: 2 },
                ]
            }
        }
    ];

    await prisma.quiz.upsert({
        where: { id_quiz: 4 },
        update: { questions: { create: q4Questions } },
        create: {
            id_quiz: 4,
            title: 'Test Multi-Réponses',
            description: 'Quiz technique pour tester les questions à choix multiples.',
            image_url: '/images/quizzes/medieval.jpg',
            is_active: true,
            id_location: 14,
            id_creator: 1,
            questions: { create: q4Questions }
        }
    });

    console.log('✅ Quizzes seeded');
}
