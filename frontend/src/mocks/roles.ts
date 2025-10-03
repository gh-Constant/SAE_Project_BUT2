export interface RoleMock {
  id: number;
  name: 'aventurier' | 'prestataire' | 'admin';
}

export const ROLES: RoleMock[] = [
  { id: 1, name: 'aventurier' },
  { id: 2, name: 'prestataire' },
  { id: 3, name: 'admin' },
];

export const AVENTURIER_ROLE_ID = 1;
export const PRESTATAIRE_ROLE_ID = 2;
export const ADMIN_ROLE_ID = 3;