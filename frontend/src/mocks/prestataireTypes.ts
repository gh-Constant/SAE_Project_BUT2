export interface PrestataireTypeMock {
  id: number;
  name: 'restaurateur' | 'animateur' | 'artisan';
}

export const PRESTATAIRE_TYPES: PrestataireTypeMock[] = [
  { id: 1, name: 'restaurateur' },
  { id: 2, name: 'animateur' },
  { id: 3, name: 'artisan' },
];

export const RESTAURATEUR_TYPE_ID = 1;
export const ANIMATEUR_TYPE_ID = 2;
export const ARTISAN_TYPE_ID = 3;