import { FORGE_LOCATION_ID } from './locations';

export interface ActivityMock {
  id: number;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  locationId: number;
}

export const ACTIVITIES: ActivityMock[] = [
  {
    id: 1,
    title: 'Démonstration de Forge',
    description: 'Assistez à la création d\'une lame damassée en direct.',
    startTime: new Date('2025-10-25T14:00:00'),
    endTime: new Date('2025-10-25T15:00:00'),
    locationId: FORGE_LOCATION_ID,
  },
];