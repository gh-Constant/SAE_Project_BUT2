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
}

export const PRESTATAIRE_USER_ID = 1;
export const PRESTATAIRE_USER_ID_2 = 4;
export const AVENTURIER_USER_ID = 2;
export const ADMIN_USER_ID = 3;

export const USERS: UserMock[] = [
  {
    id: 1,
    firstname: 'Gérard',
    lastname: 'Le prestataire',
    email: 'prestataire@medieval.com',
    password_hashed: 'password123',
    role: Role.PRESTATAIRE_ROLE_ID,
    avatar_url: '/images/Avatar-images/con15.png',
    avatar_type: AvatarType.GALLERY,
    is_verified: false,
    xp: 250,
    level: 5,
    gold: 750,
    birth_date: new Date('1990-01-01'),
    bio: 'Je suis un prestataire de service médieval',
    phone: '06 01 02 03 04',
    id_prestataire_type: PrestataireTypes.RESTAURATEUR_TYPE_ID
  },
  {
    id: 2,
    firstname: 'Alice',
    lastname: 'L\'Aventurière',
    email: 'aventurier@medieval.com',
    password_hashed: 'password123',
    role: Role.AVENTURIER_ROLE_ID,
    avatar_url: '/images/Avatar-images/con23.png',
    avatar_type: AvatarType.GALLERY,
    is_verified: false,
    xp: 80,
    level: 2,
    gold: 150,
    birth_date: new Date('1992-01-01'),
    bio: 'Je suis une aventurière de service médieval',
    phone: '06 02 03 04 05',
  },
  {
    id: 3,
    firstname: 'Godefroy',
    lastname: 'Le Sénéchal',
    email: 'admin@medieval.com',
    password_hashed: 'password123',
    role: Role.ADMIN_ROLE_ID,
    avatar_url: '/images/Avatar-images/con1.png',
    avatar_type: AvatarType.GALLERY,
    is_verified: true,
    xp: 9999,
    level: 99,
    gold: 99999,
    birth_date: new Date('1980-01-01'),
    bio: 'Je suis le Sénéchal, responsable de la sécurité du royaume',
    phone: '06 03 04 05 06',
  },
  {
    id: PRESTATAIRE_USER_ID_2,
    firstname: 'Marie',
    lastname: 'La marchande',
    email: 'prestataire2@medieval.com',
    password_hashed: 'password123',
    role: Role.PRESTATAIRE_ROLE_ID,
    id_prestataire_type: PrestataireTypes.RESTAURATEUR_TYPE_ID,
    avatar_url: '/images/Avatar-images/con23.png',
    avatar_type: AvatarType.GALLERY,
    is_verified: false,
    xp: 150,
    level: 3,
    gold: 500,
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
    gold: 50,
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
    gold: 600,
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
    gold: 1200,
    birth_date: new Date('1998-02-14'),
    bio: 'Aventurier expérimenté en quête de gloire.',
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
    gold: 800,
    birth_date: new Date('1999-08-22'),
    bio: 'Passionnée d\'histoire médiévale.',
    phone: '06 08 09 10 11',
  },
  {
    id: 9,
    firstname: 'Léon',
    lastname: 'Le Curieux',
    email: 'leon@medieval.com',
    password_hashed: 'password123',
    role: Role.AVENTURIER_ROLE_ID,
    avatar_url: '/images/Avatar-images/con8.png',
    avatar_type: AvatarType.GALLERY,
    is_verified: false,
    xp: 180,
    level: 4,
    gold: 450,
    birth_date: new Date('2001-11-05'),
    bio: 'Toujours prêt à apprendre.',
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
    gold: 1500,
    birth_date: new Date('1997-04-18'),
    bio: 'Exploratrice des terres médiévales.',
    phone: '06 10 11 12 13',
  },
];