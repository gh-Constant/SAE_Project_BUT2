import { EVENTS, EventMock, EventInput, EventUpdateInput } from '@/mocks/events';
import { RESERVATIONS, ReservationMock } from '@/mocks/reservations';
import { LOCATIONS } from '@/mocks/locations';
import { USERS, UserMock } from '@/mocks/users';

// Helper to get current user ID from localStorage
const getCurrentUserId = (): number => {
  const currentUserStr = localStorage.getItem('currentUser');
  if (currentUserStr) {
    try {
      const user = JSON.parse(currentUserStr);
      return user.id;
    } catch {
      return 2; // Default to Alice (aventurier)
    }
  }
  return 2; // Default to Alice (aventurier)
};

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

  createEvent: async (eventData: EventInput): Promise<EventMock> => {
    return new Promise((resolve) => {
      const newEvent: EventMock = {
        id_event: Math.max(...EVENTS.map(e => e.id_event), 0) + 1,
        title: eventData.title,
        description: eventData.description,
        start_time: eventData.start_time,
        end_time: eventData.end_time,
        price: eventData.price,
        capacity: eventData.capacity,
        id_location: eventData.id_location,
        published: eventData.published,
        sold: 0,
        categories: []
      };
      EVENTS.push(newEvent);
      resolve(newEvent);
    });
  },

  updateEvent: async (id: number, eventData: EventUpdateInput): Promise<EventMock> => {
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
        id_user: getCurrentUserId(), // Use actual logged-in user ID
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
      const userId = getCurrentUserId();
      const userReservations = RESERVATIONS.filter(r => r.id_user === userId).map(r => {
        const event = EVENTS.find(e => e.id_event === r.id_event);
        if (event) {
          return {
            ...r,
            event: {
              ...event,
              location: LOCATIONS.find(l => l.id === event.id_location)
            }
          };
        }
        return r;
      });
      resolve(userReservations);
    });
  },

  getEventReservations: async (eventId: number): Promise<(ReservationMock & { user?: UserMock })[]> => {
    return new Promise((resolve) => {
      const eventReservations = RESERVATIONS.filter(r => r.id_event === eventId).map(r => ({
        ...r,
        user: USERS.find(u => u.id === r.id_user)
      }));
      resolve(eventReservations);
    });
  },

  getProviderReservations: async (): Promise<(ReservationMock & { user?: UserMock })[]> => {
    return new Promise((resolve) => {
      const userId = getCurrentUserId();
      const providerLocationIds = LOCATIONS.filter(l => l.id_prestataire === userId).map(l => l.id);
      const providerEventIds = EVENTS.filter(e => providerLocationIds.includes(e.id_location)).map(e => e.id_event);
      const providerReservations = RESERVATIONS.filter(r => providerEventIds.includes(r.id_event)).map(r => {
        const event = EVENTS.find(e => e.id_event === r.id_event);
        const user = USERS.find(u => u.id === r.id_user);

        return {
          ...r,
          user,
          event: event ? {
            ...event,
            location: LOCATIONS.find(l => l.id === event.id_location)
          } : undefined
        };
      });

      resolve(providerReservations);
    });
  }
};
