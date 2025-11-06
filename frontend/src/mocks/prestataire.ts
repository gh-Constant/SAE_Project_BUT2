import { PrestataireTypes } from './prestataireTypes';

export interface PrestataireMock {
  id: number;
  name: string;
  presentation: string;

  id_prestataire_type: number;
  id_user: number;
}

export const PRESTATAIRES: PrestataireMock[] = [
    {   
        id: 1,
        name: 'Prestataire 1',
        presentation: '',
        id_prestataire_type: PrestataireTypes.RESTAURATEUR_TYPE_ID,
        id_user: 1
    }
];