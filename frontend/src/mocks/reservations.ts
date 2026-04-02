import { EVENTS, EventMock } from './events';
import { LOCATIONS, LocationMock } from './locations';

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

function getEventAnchorDate(eventId: number): Date {
  const event = EVENTS.find(e => e.id_event === eventId);
  if (!event) return new Date();

  if (event.start_time) {
    return new Date(event.start_time);
  }

  const firstSchedule = event.schedules?.[0];
  if (firstSchedule?.start_time) {
    return new Date(firstSchedule.start_time);
  }

  return new Date();
}

function reservationDateFor(eventId: number, daysBefore = 1, hour = 10): string {
  const anchor = getEventAnchorDate(eventId);
  const createdAt = new Date(anchor);
  createdAt.setDate(createdAt.getDate() - daysBefore);
  createdAt.setHours(hour, 0, 0, 0);
  return createdAt.toISOString();
}

export const RESERVATIONS: ReservationMock[] = [
  {
    id_reservation: 1,
    id_user: 2, // Client user
    id_event: 1,
    quantity: 2,
    total_price: 10000,
    status: 'CONFIRMED',
    created_at: reservationDateFor(1, 2, 10),
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
    total_price: 3000,
    status: 'CONFIRMED',
    created_at: reservationDateFor(5, 2, 9),
    event: {
      ...EVENTS.find(e => e.id_event === 5)!,
      location: LOCATIONS.find(l => l.id === EVENTS.find(e => e.id_event === 5)?.id_location)
    }
  },
  {
    id_reservation: 3,
    id_user: 12, // Sophie
    id_event: 6,
    quantity: 1,
    total_price: 200,
    status: 'PENDING',
    created_at: reservationDateFor(6, 3, 11),
    event: {
      ...EVENTS.find(e => e.id_event === 6)!,
      location: LOCATIONS.find(l => l.id === EVENTS.find(e => e.id_event === 6)?.id_location)
    }
  },
  {
    id_reservation: 4,
    id_user: 13, // Antoine
    id_event: 4,
    quantity: 3,
    total_price: 1500,
    status: 'CONFIRMED',
    created_at: reservationDateFor(4, 1, 15),
    event: {
      ...EVENTS.find(e => e.id_event === 4)!,
      location: LOCATIONS.find(l => l.id === EVENTS.find(e => e.id_event === 4)?.id_location)
    }
  },
  {
    id_reservation: 5,
    id_user: 14, // Clara
    id_event: 6,
    quantity: 2,
    total_price: 400,
    status: 'CONFIRMED',
    created_at: reservationDateFor(6, 1, 10),
    event: {
      ...EVENTS.find(e => e.id_event === 6)!,
      location: LOCATIONS.find(l => l.id === EVENTS.find(e => e.id_event === 6)?.id_location)
    }
  },
  {
    id_reservation: 6,
    id_user: 15, // Marc
    id_event: 4,
    quantity: 1,
    total_price: 500,
    status: 'CANCELLED',
    created_at: reservationDateFor(4, 1, 18),
    event: {
      ...EVENTS.find(e => e.id_event === 4)!,
      location: LOCATIONS.find(l => l.id === EVENTS.find(e => e.id_event === 4)?.id_location)
    }
  },
  {
    id_reservation: 7,
    id_user: 11, // Lucas
    id_event: 2,
    quantity: 1,
    total_price: 12000,
    status: 'CONFIRMED',
    created_at: reservationDateFor(2, 2, 9),
    event: {
      ...EVENTS.find(e => e.id_event === 2)!,
      location: LOCATIONS.find(l => l.id === EVENTS.find(e => e.id_event === 2)?.id_location)
    }
  }
];
