import { EVENTS } from './events';
import { LOCATIONS } from './locations';

export interface ReservationMock {
  id_reservation: number;
  id_user: number;
  id_event: number;
  quantity: number;
  total_price: number;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
  created_at: string;
  event?: any;
}

export const RESERVATIONS: ReservationMock[] = [
  {
    id_reservation: 1,
    id_user: 2, // Client user
    id_event: 1,
    quantity: 2,
    total_price: 100,
    status: 'CONFIRMED',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    event: {
      ...EVENTS[0],
      location: LOCATIONS.find(l => l.id === EVENTS[0].id_location)
    }
  }
];
