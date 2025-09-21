export interface RoleMock {
  id: number;
  name: 'aventurer' | 'artisan' | 'admin';
}

export const ROLES: RoleMock[] = [
  { id: 1, name: 'aventurer' },
  { id: 2, name: 'artisan' },
  { id: 3, name: 'admin' },
];

export const AVENTURER_ROLE_ID = 1;
export const ARTISAN_ROLE_ID = 2;
export const ADMIN_ROLE_ID = 3;