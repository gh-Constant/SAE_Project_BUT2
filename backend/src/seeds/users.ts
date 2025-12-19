import prisma from '../prisma.js';
import bcrypt from 'bcrypt';
import { Role, AvatarType } from '@prisma/client';

export async function seedUsers() {
    const commonPassword = await bcrypt.hash('password123', 10);

    const users = [
        {
            id_user: 1,
            firstname: 'Gérard',
            lastname: 'Le prestataire',
            email: 'prestataire@medieval.com',
            password_hashed: commonPassword,
            role: 'prestataire' as Role, // PRESTATAIRE_ROLE_ID
            avatar_url: '/images/Avatar-images/con15.png',
            avatar_type: AvatarType.gallery,
            is_verified: false,
            xp: 250,
            level: 5,
            gold: 750,
            birth_date: new Date('1990-01-01'),
            bio: 'Je suis un prestataire',
            phone: '06 01 02 03 04',
            id_prestataire_type: 1 // PrestataireTypes.RESTAURATEUR_TYPE_ID
        },
        {
            id_user: 2,
            firstname: 'Alice',
            lastname: "L'Aventurière",
            email: 'aventurier@medieval.com',
            password_hashed: commonPassword,
            role: 'aventurier' as Role, // AVENTURIER_ROLE_ID
            avatar_url: '/images/Avatar-images/con23.png',
            avatar_type: AvatarType.gallery,
            is_verified: false,
            xp: 80,
            level: 2,
            gold: 150,
            birth_date: new Date('1992-01-01'),
            bio: 'Je suis une aventurière',
            phone: '06 02 03 04 05',
        },
        {
            id_user: 3,
            firstname: 'Godefroy',
            lastname: 'Le Sénéchal',
            email: 'admin@medieval.com',
            password_hashed: commonPassword,
            role: 'admin' as Role, // ADMIN_ROLE_ID
            avatar_url: '/images/Avatar-images/con1.png',
            avatar_type: AvatarType.gallery,
            is_verified: false,
            xp: 9999,
            level: 99,
            gold: 99999,
            birth_date: new Date('1980-01-01'),
            bio: 'Je suis le Sénéchal, responsable de la sécurité du royaume',
            phone: '06 03 04 05 06',
        },
        {
            id_user: 4,
            firstname: 'Marie',
            lastname: 'La marchande',
            email: 'prestataire2@medieval.com',
            password_hashed: commonPassword,
            role: 'prestataire' as Role, // PRESTATAIRE_ROLE_ID
            id_prestataire_type: 1, // PrestataireTypes.RESTAURATEUR_TYPE_ID
            avatar_url: '/images/Avatar-images/con23.png',
            avatar_type: AvatarType.gallery,
            is_verified: false,
            xp: 150,
            level: 3,
            gold: 500,
        },
        {
            id_user: 5,
            firstname: 'Pierre',
            lastname: 'Le Paysan',
            email: 'pierre@medieval.com',
            password_hashed: commonPassword,
            role: 'aventurier' as Role,
            avatar_url: '/images/Avatar-images/con15.png',
            avatar_type: AvatarType.gallery,
            is_verified: false,
            xp: 20,
            level: 1,
            gold: 50,
            birth_date: new Date('1995-05-15'),
            bio: 'Juste un paysan qui veut aider.',
            phone: '06 05 06 07 08',
        },
    ];

    console.log('Seeding users...');

    for (const user of users) {
        // Determine default id_prestataire_type if needed for non-prestataires to avoid constraint errors
        // Assuming schema allows it to be arbitrary if not relationally enforced for non-prestataires, 
        // or we set it to 1 (default) if required.
        // Based on previous simple seed, we defaulted it to 1.
        const prestataireTypeId = user.id_prestataire_type || 1;

        await prisma.user.upsert({
            where: { email: user.email },
            update: {
                firstname: user.firstname,
                lastname: user.lastname,
                role: user.role,
                avatar_url: user.avatar_url,
                avatar_type: user.avatar_type,
                xp: user.xp,
                level: user.level,
                gold: user.gold,
                birth_date: user.birth_date,
                bio: user.bio,
                phone: user.phone,
                id_prestataire_type: prestataireTypeId,
                password_hashed: commonPassword, // Ensure password matches mocks
            },
            create: {
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                password_hashed: commonPassword,
                role: user.role,
                avatar_url: user.avatar_url,
                avatar_type: user.avatar_type,
                level: user.level,
                xp: user.xp,
                gold: user.gold,
                is_verified: user.is_verified,
                birth_date: user.birth_date,
                bio: user.bio,
                phone: user.phone,
                id_prestataire_type: prestataireTypeId,
            },
        });
    }

    console.log('Users seeded');
}
