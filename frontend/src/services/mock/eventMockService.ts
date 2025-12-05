import { EVENTS, EventMock } from '@/mocks/events';
import { RESERVATIONS, ReservationMock } from '@/mocks/reservations';
import { LOCATIONS } from '@/mocks/locations';

export const eventMockService = {
  getEvents: async (filters?: { id_location?: number; published?: boolean }): Promise<EventMock[]> => {
    return new Promise((resolve) => {
      let filteredEvents = [...EVENTS];
      
      if (filters?.id_location) {
        filteredEvents = filteredEvents.filter(e => e.id_location === filters.id_location);
      }
      
      if (filters?.published !== undefined) {
        filteredEvents = filteredEvents.filter(e => e.published === filters.published);
      }

      // Enrich with location data
      filteredEvents = filteredEvents.map(event => ({
        ...event,
        location: LOCATIONS.find(l => l.id === event.id_location)
      }));

      resolve(filteredEvents);
    });
  },

  getEventById: async (id: number): Promise<EventMock | null> => {
    return new Promise((resolve) => {
      const event = EVENTS.find(e => e.id_event === id);
      if (event) {
        resolve({
          ...event,
          location: LOCATIONS.find(l => l.id === event.id_location)
        });
      } else {
        resolve(null);
      }
    });
  },

  createEvent: async (eventData: any): Promise<EventMock> => {
    return new Promise((resolve) => {
      const newEvent: EventMock = {
        ...eventData,
        id_event: Math.max(...EVENTS.map(e => e.id_event), 0) + 1,
        sold: 0,
        published: true
      };
      EVENTS.push(newEvent);
      resolve(newEvent);
    });
  },

  updateEvent: async (id: number, eventData: any): Promise<EventMock> => {
    return new Promise((resolve, reject) => {
      const index = EVENTS.findIndex(e => e.id_event === id);
      if (index !== -1) {
        EVENTS[index] = { ...EVENTS[index], ...eventData };
        resolve(EVENTS[index]);
      } else {
        reject(new Error('Event not found'));
      }
    });
  },

  deleteEvent: async (id: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      const index = EVENTS.findIndex(e => e.id_event === id);
      if (index !== -1) {
        EVENTS.splice(index, 1);
        resolve();
      } else {
        reject(new Error('Event not found'));
      }
    });
  },

  bookEvent: async (eventId: number, quantity: number): Promise<ReservationMock> => {
    return new Promise((resolve, reject) => {
      const event = EVENTS.find(e => e.id_event === eventId);
      if (!event) {
        reject(new Error('Event not found'));
        return;
      }

      if ((event.sold + quantity) > event.capacity) {
        reject(new Error('Not enough capacity'));
        return;
      }

      event.sold += quantity;

      const newReservation: ReservationMock = {
        id_reservation: Math.max(...RESERVATIONS.map(r => r.id_reservation), 0) + 1,
        id_user: 2, // Mock user ID
        id_event: eventId,
        quantity,
        total_price: event.price * quantity,
        status: 'CONFIRMED',
        created_at: new Date().toISOString(),
        event: {
          ...event,
          location: LOCATIONS.find(l => l.id === event.id_location)
        }
      };

      RESERVATIONS.push(newReservation);
      resolve(newReservation);
    });
  },

  getUserReservations: async (): Promise<ReservationMock[]> => {
    return new Promise((resolve) => {
      const userReservations = RESERVATIONS.filter(r => r.id_user === 2).map(r => ({
        ...r,
        event: {
          ...EVENTS.find(e => e.id_event === r.id_event),
          location: LOCATIONS.find(l => l.id === EVENTS.find(e => e.id_event === r.id_event)?.id_location)
        }
      }));
      resolve(userReservations);
    });
  }
};
