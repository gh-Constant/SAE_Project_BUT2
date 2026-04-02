import { PrestataireTypes } from "./prestataireTypes";

export enum Role {
  ADMIN_ROLE_ID = "admin",
  AVENTURIER_ROLE_ID = "aventurier",
  PRESTATAIRE_ROLE_ID = "prestataire",
}

export enum AvatarType {
  GALLERY = 'gallery',
  UPLOAD = 'upload',
}

export interface UserMock {
  id: number; // AUTO_INCREMENT integer from database
  firstname: string;
  lastname: string;
  birth_date?: Date;
  bio?: string;

  presentation?: string;

  phone?: string;
  email: string;

  avatar_url?: string; // URL de l'avatar
  avatar_type?: AvatarType; // Type de l'avatar
  level: number;
  xp: number;
  gold: number;

  is_verified: boolean;
  password_hashed: string; // Pour le S3, on peut mettre un mot de passe en clair pour les tests

  role: Role;
  id_prestataire_type?: number;
  rank?: number;
  hasPassword?: boolean;
  oauthProviders?: Array<'google' | 'discord'>;
}

export const PRESTATAIRE_USER_ID = 1;
export const PRESTATAIRE_USER_ID_2 = 4;
export const AVENTURIER_USER_ID = 2;
export const ADMIN_USER_ID = 3;

export const USERS: UserMock[] = [
  {
    id: 1,
    firstname: 'Gerard',
    lastname: 'Delatour',
    email: 'prestataire@medieval.com',
    password_hashed: 'password123',
    role: Role.PRESTATAIRE_ROLE_ID,
    avatar_url: '/images/Avatar-images/con15.png',
    avatar_type: AvatarType.GALLERY,
    is_verified: false,
    xp: 250,
    level: 5,
    gold: 75000,
    birth_date: new Date('1990-01-01'),
    bio: 'Restaurateur du festival, je sers plats chauds, banquet et degustations.',
    phone: '06 01 02 03 04',
    id_prestataire_type: PrestataireTypes.RESTAURATEUR_TYPE_ID
  },
  {
    id: 2,
    firstname: 'Alice',
    lastname: 'L\'AventuriÃ¨re',
    email: 'aventurier@medieval.com',
    password_hashed: 'password123',
    role: Role.AVENTURIER_ROLE_ID,
    avatar_url: '/images/Avatar-images/con23.png',
    avatar_type: AvatarType.GALLERY,
    is_verified: false,
    xp: 80,
    level: 2,
    gold: 15000,
    birth_date: new Date('1992-01-01'),
    bio: 'Je suis une aventuriÃ¨re de service mÃ©dieval',
    phone: '06 02 03 04 05',
  },
  {
    id: 3,
    firstname: 'Godefroy',
    lastname: 'Le SÃ©nÃ©chal',
    email: 'admin@medieval.com',
    password_hashed: 'password123',
    role: Role.ADMIN_ROLE_ID,
    avatar_url: '/images/Avatar-images/con1.png',
    avatar_type: AvatarType.GALLERY,
    is_verified: true,
    xp: 9999,
    level: 99,
    gold: 9999900,
    birth_date: new Date('1980-01-01'),
    bio: 'Je suis le SÃ©nÃ©chal, responsable de la sÃ©curitÃ© du royaume',
    phone: '06 03 04 05 06',
  },
  {
    id: PRESTATAIRE_USER_ID_2,
    firstname: 'Marie',
    lastname: 'd Auberive',
    email: 'prestataire2@medieval.com',
    password_hashed: 'password123',
    role: Role.PRESTATAIRE_ROLE_ID,
    id_prestataire_type: PrestataireTypes.ARTISAN_TYPE_ID,
    avatar_url: '/images/Avatar-images/con23.png',
    avatar_type: AvatarType.GALLERY,
    is_verified: false,
    xp: 150,
    level: 3,
    gold: 50000,
    birth_date: new Date('1988-04-12'),
    bio: 'Artisane specialisee dans les accessoires de tir, le cuir et les demonstrations.',
    phone: '06 04 05 06 07',
  },
  // Additional adventurers for quiz testing
  {
    id: 5,
    firstname: 'Pierre',
    lastname: 'Le Paysan',
    email: 'pierre@medieval.com',
    password_hashed: 'password123',
    role: Role.AVENTURIER_ROLE_ID,
    avatar_url: '/images/Avatar-images/con15.png',
    avatar_type: AvatarType.GALLERY,
    is_verified: false,
    xp: 20,
    level: 1,
    gold: 5000,
    birth_date: new Date('1995-05-15'),
    bio: 'Juste un paysan qui veut aider.',
    phone: '06 05 06 07 08',
  },
  {
    id: 6,
    firstname: 'Jacques',
    lastname: 'L\'explorateur',
    email: 'jacques@medieval.com',
    password_hashed: 'password123',
    role: Role.AVENTURIER_ROLE_ID,
    avatar_url: '/images/Avatar-images/con10.png',
    avatar_type: AvatarType.GALLERY,
    is_verified: false,
    xp: 180,
    level: 4,
    gold: 60000,
    birth_date: new Date('1985-03-20'),
    bio: 'Explorateur depuis 20 ans.',
    phone: '06 05 06 07 08',
  },
  {
    id: 7,
    firstname: 'Thomas',
    lastname: 'Le Brave',
    email: 'thomas@medieval.com',
    password_hashed: 'password123',
    role: Role.AVENTURIER_ROLE_ID,
    avatar_url: '/images/Avatar-images/con5.png',
    avatar_type: AvatarType.GALLERY,
    is_verified: false,
    xp: 450,
    level: 8,
    gold: 120000,
    birth_date: new Date('1998-02-14'),
    bio: 'Aventurier expÃ©rimentÃ© en quÃªte de gloire.',
    phone: '06 07 08 09 10',
  },
  {
    id: 8,
    firstname: 'Jeanne',
    lastname: 'La Courageuse',
    email: 'jeanne@medieval.com',
    password_hashed: 'password123',
    role: Role.AVENTURIER_ROLE_ID,
    avatar_url: '/images/Avatar-images/con22.png',
    avatar_type: AvatarType.GALLERY,
    is_verified: false,
    xp: 320,
    level: 6,
    gold: 80000,
    birth_date: new Date('1999-08-22'),
    bio: 'PassionnÃ©e d\'histoire mÃ©diÃ©vale.',
    phone: '06 08 09 10 11',
  },
  {
    id: 9,
    firstname: 'LÃ©on',
    lastname: 'Le Curieux',
    email: 'leon@medieval.com',
    password_hashed: 'password123',
    role: Role.AVENTURIER_ROLE_ID,
    avatar_url: '/images/Avatar-images/con8.png',
    avatar_type: AvatarType.GALLERY,
    is_verified: false,
    xp: 180,
    level: 4,
    gold: 45000,
    birth_date: new Date('2001-11-05'),
    bio: 'Toujours prÃªt Ã  apprendre.',
    phone: '06 09 10 11 12',
  },
  {
    id: 10,
    firstname: 'Margot',
    lastname: 'L\'Exploratrice',
    email: 'margot@medieval.com',
    password_hashed: 'password123',
    role: Role.AVENTURIER_ROLE_ID,
    avatar_url: '/images/Avatar-images/con24.png',
    avatar_type: AvatarType.GALLERY,
    is_verified: false,
    xp: 520,
    level: 9,
    gold: 150000,
    birth_date: new Date('1997-04-18'),
    bio: 'Exploratrice des terres mÃ©diÃ©vales.',
    phone: '06 10 11 12 13',
  },
  {
    id: 11,
    firstname: 'Lucas',
    lastname: 'Le Rapide',
    email: 'lucas@medieval.com',
    password_hashed: 'password123',
    role: Role.AVENTURIER_ROLE_ID,
    avatar_url: '/images/Avatar-images/con3.png',
    avatar_type: AvatarType.GALLERY,
    is_verified: false,
    xp: 150,
    level: 3,
    gold: 30000,
    birth_date: new Date('2000-05-10'),
    bio: 'Vif comme l\'Ã©clair.',
    phone: '06 11 12 13 14',
  },
  {
    id: 12,
    firstname: 'Sophie',
    lastname: 'La Sage',
    email: 'sophie@medieval.com',
    password_hashed: 'password123',
    role: Role.AVENTURIER_ROLE_ID,
    avatar_url: '/images/Avatar-images/con2.png',
    avatar_type: AvatarType.GALLERY,
    is_verified: false,
    xp: 400,
    level: 7,
    gold: 90000,
    birth_date: new Date('1994-09-09'),
    bio: 'La connaissance est le vrai pouvoir.',
    phone: '06 12 13 14 15',
  },
  {
    id: 13,
    firstname: 'Antoine',
    lastname: 'Le Fort',
    email: 'antoine@medieval.com',
    password_hashed: 'password123',
    role: Role.AVENTURIER_ROLE_ID,
    avatar_url: '/images/Avatar-images/con18.png',
    avatar_type: AvatarType.GALLERY,
    is_verified: false,
    xp: 250,
    level: 5,
    gold: 60000,
    birth_date: new Date('1996-03-30'),
    bio: 'La force brute rÃ©sout bien des problÃ¨mes.',
    phone: '06 13 14 15 16',
  },
  {
    id: 14,
    firstname: 'Clara',
    lastname: 'L\'Agile',
    email: 'clara@medieval.com',
    password_hashed: 'password123',
    role: Role.AVENTURIER_ROLE_ID,
    avatar_url: '/images/Avatar-images/con20.png',
    avatar_type: AvatarType.GALLERY,
    is_verified: false,
    xp: 180,
    level: 4,
    gold: 40000,
    birth_date: new Date('2002-07-20'),
    bio: 'Insaississable et prÃ©cise.',
    phone: '06 14 15 16 17',
  },
  {
    id: 15,
    firstname: 'Marc',
    lastname: 'Le StratÃ¨ge',
    email: 'marc@medieval.com',
    password_hashed: 'password123',
    role: Role.AVENTURIER_ROLE_ID,
    avatar_url: '/images/Avatar-images/con7.png',
    avatar_type: AvatarType.GALLERY,
    is_verified: false,
    xp: 320,
    level: 6,
    gold: 75000,
    birth_date: new Date('1993-12-12'),
    bio: 'Chaque pas est calculÃ©.',
    phone: '06 15 16 17 18',
  },
];


