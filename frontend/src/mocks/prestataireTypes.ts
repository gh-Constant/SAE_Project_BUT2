export interface PrestataireTypeMock {
  id: number;
  name: string;
}

export enum PrestataireTypes {
  RESTAURATEUR_TYPE_ID = 1,
  ANIMATEUR_TYPE_ID = 2,
  ARTISAN_TYPE_ID = 3,
}

export const PRESTATAIRE_TYPES: PrestataireTypeMock[] = [
  { id: PrestataireTypes.RESTAURATEUR_TYPE_ID, name: 'restaurateur' },
  { id: PrestataireTypes.ANIMATEUR_TYPE_ID, name: 'animateur' },
  { id: PrestataireTypes.ARTISAN_TYPE_ID, name: 'artisan' },
];

