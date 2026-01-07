import prisma from '../prisma.js';

export async function seedQuizzes() {
    console.log('Seeding quizzes...');

    // Clean up existing questions to prevent duplicates and ensure fresh state
    try {
        // Clean up Ticket Office quizzes (id_location: 1) as requested
        await prisma.quiz.deleteMany({
            where: { id_location: 1 }
        });

        await prisma.quizQuestion.deleteMany({
            where: { id_quiz: { in: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] } }
        });
    } catch (e) {
        console.warn("Warning clearing quiz questions:", e);
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
            title: 'Les Châteaux Forts',
            description: 'Découvrez les secrets des forteresses médiévales !',
            image_url: '/images/quizzes/castle.jpg',
            is_active: true,
            id_location: 14,
            id_creator: 4,
            questions: { create: q4Questions }
        }
    });

    // 5. La Vie des Paysans
    const q5Questions = [
        {
            content: '<p>Comment appelait-on le paysan attaché à une terre ?</p>',
            order_index: 0,
            answers: {
                create: [
                    { content: 'Un bourgeois', is_correct: false, order_index: 0 },
                    { content: 'Un serf', is_correct: true, order_index: 1 },
                    { content: 'Un noble', is_correct: false, order_index: 2 },
                    { content: 'Un esclave', is_correct: false, order_index: 3 },
                ]
            }
        },
        {
            content: '<p>Quel pourcentage de la population était paysanne au Moyen Âge ?</p>',
            order_index: 1,
            answers: {
                create: [
                    { content: '50%', is_correct: false, order_index: 0 },
                    { content: '70%', is_correct: false, order_index: 1 },
                    { content: '90%', is_correct: true, order_index: 2 },
                    { content: '30%', is_correct: false, order_index: 3 },
                ]
            }
        },
        {
            content: '<p>Quelle taxe les paysans devaient-ils au seigneur ?</p>',
            order_index: 2,
            answers: {
                create: [
                    { content: 'La TVA', is_correct: false, order_index: 0 },
                    { content: 'La taille', is_correct: true, order_index: 1 },
                    { content: 'L\'impôt sur le revenu', is_correct: false, order_index: 2 },
                    { content: 'La cotisation', is_correct: false, order_index: 3 },
                ]
            }
        }
    ];

    await prisma.quiz.upsert({
        where: { id_quiz: 5 },
        update: { questions: { create: q5Questions } },
        create: {
            id_quiz: 5,
            title: 'La Vie des Paysans',
            description: 'Le quotidien du peuple au Moyen Âge',
            image_url: '/images/quizzes/peasants.jpg',
            is_active: true,
            id_location: 17,
            id_creator: 5,
            questions: { create: q5Questions }
        }
    });

    // 6. Les Croisades
    const q6Questions = [
        {
            content: '<p>Combien y a-t-il eu de croisades principales ?</p>',
            order_index: 0,
            answers: {
                create: [
                    { content: '3', is_correct: false, order_index: 0 },
                    { content: '8', is_correct: true, order_index: 1 },
                    { content: '12', is_correct: false, order_index: 2 },
                    { content: '5', is_correct: false, order_index: 3 },
                ]
            }
        },
        {
            content: '<p>Quelle ville était l\'objectif principal des croisades ?</p>',
            order_index: 1,
            answers: {
                create: [
                    { content: 'Rome', is_correct: false, order_index: 0 },
                    { content: 'Jérusalem', is_correct: true, order_index: 1 },
                    { content: 'Constantinople', is_correct: false, order_index: 2 },
                    { content: 'Alexandrie', is_correct: false, order_index: 3 },
                ]
            }
        },
        {
            content: '<p>Quel roi de France participa à la 7e croisade ?</p>',
            order_index: 2,
            answers: {
                create: [
                    { content: 'Philippe Auguste', is_correct: false, order_index: 0 },
                    { content: 'Saint Louis (Louis IX)', is_correct: true, order_index: 1 },
                    { content: 'Charlemagne', is_correct: false, order_index: 2 },
                    { content: 'Louis XIV', is_correct: false, order_index: 3 },
                ]
            }
        }
    ];

    await prisma.quiz.upsert({
        where: { id_quiz: 6 },
        update: { questions: { create: q6Questions } },
        create: {
            id_quiz: 6,
            title: 'Les Croisades',
            description: 'L\'histoire des grandes expéditions',
            image_url: '/images/quizzes/crusades.jpg',
            is_active: true,
            id_location: 15,
            id_creator: 5,
            questions: { create: q6Questions }
        }
    });

    // 7. L'Art Médiéval
    const q7Questions = [
        {
            content: '<p>Comment appelle-t-on les illustrations dans les manuscrits ?</p>',
            order_index: 0,
            answers: {
                create: [
                    { content: 'Des photos', is_correct: false, order_index: 0 },
                    { content: 'Des enluminures', is_correct: true, order_index: 1 },
                    { content: 'Des graffitis', is_correct: false, order_index: 2 },
                    { content: 'Des peintures', is_correct: false, order_index: 3 },
                ]
            }
        },
        {
            content: '<p>Quel style architectural précède le gothique ?</p>',
            order_index: 1,
            answers: {
                create: [
                    { content: 'Le baroque', is_correct: false, order_index: 0 },
                    { content: 'Le roman', is_correct: true, order_index: 1 },
                    { content: 'Le classique', is_correct: false, order_index: 2 },
                    { content: 'Le moderne', is_correct: false, order_index: 3 },
                ]
            }
        },
        {
            content: '<p>Quel matériau coloré orne les fenêtres des cathédrales ?</p>',
            order_index: 2,
            answers: {
                create: [
                    { content: 'Le plastique', is_correct: false, order_index: 0 },
                    { content: 'Le vitrail', is_correct: true, order_index: 1 },
                    { content: 'Le papier', is_correct: false, order_index: 2 },
                    { content: 'Le bois peint', is_correct: false, order_index: 3 },
                ]
            }
        }
    ];

    await prisma.quiz.upsert({
        where: { id_quiz: 7 },
        update: { questions: { create: q7Questions } },
        create: {
            id_quiz: 7,
            title: 'L\'Art Médiéval',
            description: 'Enluminures, vitraux et sculptures',
            image_url: '/images/quizzes/art.jpg',
            is_active: true,
            id_location: 18,
            id_creator: 6,
            questions: { create: q7Questions }
        }
    });

    // 8. Les Rois de France
    const q8Questions = [
        {
            content: '<p>Quel roi fut couronné en l\'an 800 ?</p>',
            order_index: 0,
            answers: {
                create: [
                    { content: 'Louis XIV', is_correct: false, order_index: 0 },
                    { content: 'Charlemagne', is_correct: true, order_index: 1 },
                    { content: 'Clovis', is_correct: false, order_index: 2 },
                    { content: 'Hugues Capet', is_correct: false, order_index: 3 },
                ]
            }
        },
        {
            content: '<p>Quelle dynastie fonda Hugues Capet ?</p>',
            order_index: 1,
            answers: {
                create: [
                    { content: 'Les Mérovingiens', is_correct: false, order_index: 0 },
                    { content: 'Les Capétiens', is_correct: true, order_index: 1 },
                    { content: 'Les Carolingiens', is_correct: false, order_index: 2 },
                    { content: 'Les Bourbons', is_correct: false, order_index: 3 },
                ]
            }
        },
        {
            content: '<p>Quel roi gagna la bataille de Bouvines ?</p>',
            order_index: 2,
            answers: {
                create: [
                    { content: 'Philippe Auguste', is_correct: true, order_index: 0 },
                    { content: 'Louis IX', is_correct: false, order_index: 1 },
                    { content: 'Charles VII', is_correct: false, order_index: 2 },
                    { content: 'François Ier', is_correct: false, order_index: 3 },
                ]
            }
        }
    ];

    await prisma.quiz.upsert({
        where: { id_quiz: 8 },
        update: { questions: { create: q8Questions } },
        create: {
            id_quiz: 8,
            title: 'Les Rois de France',
            description: 'Les grandes dynasties françaises',
            image_url: '/images/quizzes/kings.jpg',
            is_active: true,
            id_location: 17,
            id_creator: 1,
            questions: { create: q8Questions }
        }
    });

    // 9. Légendes et Mythes
    const q9Questions = [
        {
            content: '<p>Quel chevalier légendaire cherchait le Graal ?</p>',
            order_index: 0,
            answers: {
                create: [
                    { content: 'Lancelot', is_correct: false, order_index: 0 },
                    { content: 'Perceval', is_correct: true, order_index: 1 },
                    { content: 'Gauvain', is_correct: false, order_index: 2 },
                    { content: 'Tristan', is_correct: false, order_index: 3 },
                ]
            }
        },
        {
            content: '<p>Quel roi est associé à la Table Ronde ?</p>',
            order_index: 1,
            answers: {
                create: [
                    { content: 'Charlemagne', is_correct: false, order_index: 0 },
                    { content: 'Arthur', is_correct: true, order_index: 1 },
                    { content: 'Richard Coeur de Lion', is_correct: false, order_index: 2 },
                    { content: 'Guillaume le Conquérant', is_correct: false, order_index: 3 },
                ]
            }
        },
        {
            content: '<p>Quel être fantastique crache du feu ?</p>',
            order_index: 2,
            answers: {
                create: [
                    { content: 'La licorne', is_correct: false, order_index: 0 },
                    { content: 'Le dragon', is_correct: true, order_index: 1 },
                    { content: 'Le griffon', is_correct: false, order_index: 2 },
                    { content: 'La fée', is_correct: false, order_index: 3 },
                ]
            }
        }
    ];

    await prisma.quiz.upsert({
        where: { id_quiz: 9 },
        update: { questions: { create: q9Questions } },
        create: {
            id_quiz: 9,
            title: 'Légendes et Mythes',
            description: 'Dragons, fées et créatures fantastiques',
            image_url: '/images/quizzes/legends.jpg',
            is_active: true,
            id_location: 18,
            id_creator: 4,
            questions: { create: q9Questions }
        }
    });

    // 10. Les Tournois
    const q10Questions = [
        {
            content: '<p>Comment appelle-t-on un combat à cheval avec des lances ?</p>',
            order_index: 0,
            answers: {
                create: [
                    { content: 'Un duel', is_correct: false, order_index: 0 },
                    { content: 'Une joute', is_correct: true, order_index: 1 },
                    { content: 'Un tournoi', is_correct: false, order_index: 2 },
                    { content: 'Une mêlée', is_correct: false, order_index: 3 },
                ]
            }
        },
        {
            content: '<p>Quel accessoire le chevalier offrait-il à sa dame ?</p>',
            order_index: 1,
            answers: {
                create: [
                    { content: 'Une fleur', is_correct: false, order_index: 0 },
                    { content: 'Son écharpe (ou faveur)', is_correct: true, order_index: 1 },
                    { content: 'Sa lance', is_correct: false, order_index: 2 },
                    { content: 'Son bouclier', is_correct: false, order_index: 3 },
                ]
            }
        },
        {
            content: '<p>Quel était le prix souvent remporté par le vainqueur ?</p>',
            order_index: 2,
            answers: {
                create: [
                    { content: 'De l\'argent', is_correct: false, order_index: 0 },
                    { content: 'Le cheval et l\'armure du vaincu', is_correct: true, order_index: 1 },
                    { content: 'Une couronne', is_correct: false, order_index: 2 },
                    { content: 'Un château', is_correct: false, order_index: 3 },
                ]
            }
        }
    ];

    await prisma.quiz.upsert({
        where: { id_quiz: 10 },
        update: { questions: { create: q10Questions } },
        create: {
            id_quiz: 10,
            title: 'Les Tournois',
            description: 'Joutes et compétitions chevaleresques',
            image_url: '/images/quizzes/tournament.jpg',
            is_active: true,
            id_location: 16,
            id_creator: 6,
            questions: { create: q10Questions }
        }
    });

    console.log('✅ Quizzes seeded');
}
