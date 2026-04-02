import { LOCATIONS, LocationMock } from './locations';
import { EVENTS, EventMock } from './events';

export interface ReservationMock {
  id_reservation: number;
  id_user: number;
  id_event: number;
  id_schedule?: number;
  quantity: number;
  total_price: number;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
  created_at: string;
  event?: EventMock & { location?: LocationMock };
}

function getLocationForEvent(eventId: number) {
  const event = EVENTS.find(e => e.id_event === eventId);
  return LOCATIONS.find(l => l.id === event?.id_location);
}

export const RESERVATIONS: ReservationMock[] = [
  { id_reservation: 1, id_user: 2, id_event: 1, quantity: 2, total_price: 24000, status: 'CONFIRMED', created_at: '2026-06-19T10:00:00.000Z', event: { ...EVENTS[0], location: getLocationForEvent(1) } },
  { id_reservation: 2, id_user: 11, id_event: 2, id_schedule: 1, quantity: 1, total_price: 1500, status: 'CONFIRMED', created_at: '2026-06-20T09:00:00.000Z', event: { ...EVENTS[1], location: getLocationForEvent(2) } },
  { id_reservation: 3, id_user: 12, id_event: 2, id_schedule: 2, quantity: 2, total_price: 3000, status: 'PENDING', created_at: '2026-06-20T11:00:00.000Z', event: { ...EVENTS[1], location: getLocationForEvent(2) } },
  { id_reservation: 4, id_user: 2, id_event: 3, id_schedule: 4, quantity: 1, total_price: 1800, status: 'CONFIRMED', created_at: '2026-06-22T08:00:00.000Z', event: { ...EVENTS[2], location: getLocationForEvent(3) } },
  { id_reservation: 5, id_user: 13, id_event: 3, id_schedule: 5, quantity: 1, total_price: 1800, status: 'CONFIRMED', created_at: '2026-06-22T12:00:00.000Z', event: { ...EVENTS[2], location: getLocationForEvent(3) } },
  { id_reservation: 6, id_user: 14, id_event: 4, id_schedule: 7, quantity: 1, total_price: 900, status: 'CANCELLED', created_at: '2026-06-24T17:00:00.000Z', event: { ...EVENTS[3], location: getLocationForEvent(4) } },
  { id_reservation: 7, id_user: 15, id_event: 5, quantity: 2, total_price: 1200, status: 'CONFIRMED', created_at: '2026-06-25T15:30:00.000Z', event: { ...EVENTS[4], location: getLocationForEvent(5) } },
  { id_reservation: 8, id_user: 5, id_event: 6, quantity: 3, total_price: 900, status: 'PENDING', created_at: '2026-06-27T13:00:00.000Z', event: { ...EVENTS[5], location: getLocationForEvent(6) } },
  { id_reservation: 9, id_user: 6, id_event: 4, id_schedule: 8, quantity: 1, total_price: 900, status: 'CONFIRMED', created_at: '2026-06-25T16:30:00.000Z', event: { ...EVENTS[3], location: getLocationForEvent(4) } },
  { id_reservation: 10, id_user: 7, id_event: 6, quantity: 4, total_price: 1200, status: 'CONFIRMED', created_at: '2026-06-28T11:00:00.000Z', event: { ...EVENTS[5], location: getLocationForEvent(6) } },
  { id_reservation: 11, id_user: 8, id_event: 5, quantity: 1, total_price: 600, status: 'CONFIRMED', created_at: '2026-06-27T18:00:00.000Z', event: { ...EVENTS[4], location: getLocationForEvent(5) } }
];
