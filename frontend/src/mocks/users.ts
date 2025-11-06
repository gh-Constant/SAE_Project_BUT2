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

  phone?: string;
  email: string;
  
  avatarUrl?: string; // URL de l'avatar
  avatarType?: AvatarType; // Type de l'avatar
  level: number;
  xp: number;

  is_verified: boolean;
  password_hashed: string; // Pour le S3, on peut mettre un mot de passe en clair pour les tests
  
  role: Role;
}

export const USERS: UserMock[] = [
  {
    id: 1,
    firstname: 'Gérard',
    lastname: 'Le prestataire',
    email: 'prestataire@medieval.com',
    password_hashed: 'password123',
    role: Role.PRESTATAIRE_ROLE_ID,
    avatarUrl: '/images/Avatar-images/con15.png',
    is_verified: false,
    xp: 250,
    level: 5,
    birth_date: new Date('1990-01-01'),
    bio: 'Je suis un prestataire de service médieval',
    phone: '06 01 02 03 04',
  },
  {
    id: 2,
    firstname: 'Alice',
    lastname: 'L\'Aventurière',
    email: 'aventurier@medieval.com',
    password_hashed: 'password123',
    role: Role.AVENTURIER_ROLE_ID,
    avatarUrl: '/images/Avatar-images/con23.png',
    is_verified: false,
    xp: 80,
    level: 2,
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
    avatarUrl: '/images/Avatar-images/con1.png',
    is_verified: false,
    xp: 9999,
    level: 99,
    birth_date: new Date('1980-01-01'),
    bio: 'Je suis le Sénéchal, responsable de la sécurité du royaume',
    phone: '06 03 04 05 06',
  },
];