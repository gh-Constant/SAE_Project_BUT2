import { ARTISAN_ROLE_ID, AVENTURIER_ROLE_ID, SENECHAL_ROLE_ID, ROLES } from './roles';

export interface UserMock {
  id: string; // UUID
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

export const ARTISAN_USER_ID = 'a1b2c3d4-e5f6-7890-1234-567890abcdef';
export const AVENTURIER_USER_ID = 'b2c3d4e5-f6a7-8901-2345-67890abcdef0';
export const SENECHAL_USER_ID = 'c3d4e5f6-a7b8-9012-3456-7890abcdef01';

export const USERS: UserMock[] = [
  {
    id: ARTISAN_USER_ID,
    firstname: 'Gérard',
    lastname: 'Le Forgeron',
    email: 'artisan@medieval.com',
    password_hashed: 'password123',
    roleId: ARTISAN_ROLE_ID,
    role: ROLES.find(r => r.id === ARTISAN_ROLE_ID)!,
    is_active: true,
    is_verified: true,
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
    is_verified: true,
    xp: 80,
    level: 2,
  },
  {
    id: SENECHAL_USER_ID,
    firstname: 'Godefroy',
    lastname: 'Le Sénéchal',
    email: 'admin@medieval.com',
    password_hashed: 'password123',
    roleId: SENECHAL_ROLE_ID,
    role: ROLES.find(r => r.id === SENECHAL_ROLE_ID)!,
    is_active: true,
    is_verified: true,
    xp: 9999,
    level: 99,
  },
];