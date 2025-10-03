import { PRESTATAIRE_ROLE_ID, AVENTURIER_ROLE_ID, ADMIN_ROLE_ID, ROLES } from './roles';

export interface UserMock {
  id: number; // AUTO_INCREMENT integer from database
  firstname: string;
  lastname: string;
  email: string;
  password_hashed: string; // Pour le S3, on peut mettre un mot de passe en clair pour les tests
  roleId: number;
  role: { id: number; name: string; }; // On simule la jointure que l'API renverrait
  is_active: boolean;
  is_verified: boolean;
  xp: number;
  level: number;
}

export const PRESTATAIRE_USER_ID = 1;
export const AVENTURIER_USER_ID = 2;
export const ADMIN_USER_ID = 3;

export const USERS: UserMock[] = [
  {
    id: PRESTATAIRE_USER_ID,
    firstname: 'Gérard',
    lastname: 'Le Forgeron',
    email: 'prestataire@medieval.com',
    password_hashed: 'password123',
    roleId: PRESTATAIRE_ROLE_ID,
    role: ROLES.find(r => r.id === PRESTATAIRE_ROLE_ID)!,
    is_active: true,
    is_verified: false,
    xp: 250,
    level: 5,
  },
  {
    id: AVENTURIER_USER_ID,
    firstname: 'Alice',
    lastname: 'L\'Aventurière',
    email: 'aventurier@medieval.com',
    password_hashed: 'password123',
    roleId: AVENTURIER_ROLE_ID,
    role: ROLES.find(r => r.id === AVENTURIER_ROLE_ID)!,
    is_active: true,
    is_verified: false,
    xp: 80,
    level: 2,
  },
  {
    id: ADMIN_USER_ID,
    firstname: 'Godefroy',
    lastname: 'Le Sénéchal',
    email: 'admin@medieval.com',
    password_hashed: 'password123',
    roleId: ADMIN_ROLE_ID,
    role: ROLES.find(r => r.id === ADMIN_ROLE_ID)!,
    is_active: true,
    is_verified: false,
    xp: 9999,
    level: 99,
  },
];