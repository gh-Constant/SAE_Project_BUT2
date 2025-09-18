export interface RoleMock {
  id: number;
  name: 'Aventurier' | 'Artisan' | 'Sénéchal';
}

export const ROLES: RoleMock[] = [
  { id: 1, name: 'Aventurier' },
  { id: 2, name: 'Artisan' },
  { id: 3, name: 'Sénéchal' },
];

export const AVENTURIER_ROLE_ID = 1;
export const ARTISAN_ROLE_ID = 2;
export const SENECHAL_ROLE_ID = 3;