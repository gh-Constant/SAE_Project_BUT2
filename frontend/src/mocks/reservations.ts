import { EVENTS, EventMock } from './events';
import { LOCATIONS, LocationMock } from './locations';

export interface ReservationMock {
  id_reservation: number;
  id_user: number;
  id_event: number;
  quantity: number;
  total_price: number;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
  created_at: string;
  event?: EventMock & { location?: LocationMock };
}

export const RESERVATIONS: ReservationMock[] = [
  {
    id_reservation: 1,
    id_user: 2, // Client user
    id_event: 1,
    quantity: 2,
    total_price: 100,
    status: 'CONFIRMED',
    created_at: new Date('2026-06-19T10:00:00').toISOString(),
    event: {
      ...EVENTS[0],
      location: LOCATIONS.find(l => l.id === EVENTS[0].id_location)
    }
  },
  {
    id_reservation: 2,
    id_user: 11, // Lucas
    id_event: 5,
    quantity: 2,
    total_price: 30,
    status: 'CONFIRMED',
    created_at: new Date('2026-06-20T09:00:00').toISOString(),
  },
  {
    id_reservation: 3,
    id_user: 12, // Sophie
    id_event: 6,
    quantity: 1,
    total_price: 2,
    status: 'PENDING',
    created_at: new Date('2026-06-20T11:00:00').toISOString(),
  },
  {
    id_reservation: 4,
    id_user: 13, // Antoine
    id_event: 4,
    quantity: 3,
    total_price: 15,
    status: 'CONFIRMED',
    created_at: new Date('2026-06-19T15:00:00').toISOString(),
  },
  {
    id_reservation: 5,
    id_user: 14, // Clara
    id_event: 6,
    quantity: 2,
    total_price: 4,
    status: 'CONFIRMED',
    created_at: new Date('2026-06-21T10:00:00').toISOString(),
  },
  {
    id_reservation: 6,
    id_user: 15, // Marc
    id_event: 4,
    quantity: 1,
    total_price: 5,
    status: 'CANCELLED',
    created_at: new Date('2026-06-19T18:00:00').toISOString(),
  },
  {
    id_reservation: 7,
    id_user: 11, // Lucas
    id_event: 2,
    quantity: 1,
    total_price: 120,
    status: 'CONFIRMED',
    created_at: new Date('2026-06-23T09:00:00').toISOString(),
  }
];
