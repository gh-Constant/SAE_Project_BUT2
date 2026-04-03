import { EVENTS, EventMock, EventInput, EventUpdateInput } from '@/mocks/events';
import { RESERVATIONS, ReservationMock } from '@/mocks/reservations';
import { LOCATIONS } from '@/mocks/locations';
import { USERS, UserMock } from '@/mocks/users';

const MAX_EVENT_DURATION_MS = 31 * 24 * 60 * 60 * 1000;

function validateDateRange(start: string, end: string, context: string): void {
  const startDate = new Date(start);
  const endDate = new Date(end);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    throw new Error(`${context}: invalid date format`);
  }

  if (endDate.getTime() < startDate.getTime()) {
    throw new Error(`${context}: end date must be after start date`);
  }

  if (endDate.getTime() - startDate.getTime() > MAX_EVENT_DURATION_MS) {
    throw new Error(`${context}: duration cannot exceed one month`);
  }
}

function validateEventDuration(eventData: EventInput | EventMock): void {
  if (eventData.type === 'ACTIVITY') {
    const schedules = eventData.schedules || [];
    if (schedules.length === 0) {
      return;
    }

    schedules.forEach((schedule, index) => {
      validateDateRange(schedule.start_time, schedule.end_time, `Schedule ${index + 1}`);
    });

    const starts = schedules.map(s => new Date(s.start_time).getTime());
    const ends = schedules.map(s => new Date(s.end_time).getTime());
    const totalSpan = Math.max(...ends) - Math.min(...starts);

    if (totalSpan > MAX_EVENT_DURATION_MS) {
      throw new Error('Activity schedules cannot span more than one month');
    }
    return;
  }

  if (eventData.start_time && eventData.end_time) {
    validateDateRange(eventData.start_time, eventData.end_time, 'Event');
  }
}

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
    return new Promise((resolve, reject) => {
      try {
        validateEventDuration(eventData);
      } catch (error) {
        reject(error);
        return;
      }

      const maxScheduleId = Math.max(
        0,
        ...EVENTS.flatMap(event => event.schedules?.map(schedule => schedule.id_schedule || 0) || [])
      );

      const newEvent: EventMock = {
        id_event: Math.max(...EVENTS.map(e => e.id_event), 0) + 1,
        title: eventData.title,
        description: eventData.description,
        type: eventData.type || 'EVENT',
        event_category: eventData.event_category,
        start_time: eventData.type === 'ACTIVITY' ? undefined : eventData.start_time,
        end_time: eventData.type === 'ACTIVITY' ? undefined : eventData.end_time,
        price: eventData.price,
        capacity: eventData.capacity,
        id_location: eventData.id_location,
        published: eventData.published,
        sold: 0,
        categories: [],
        schedules: eventData.type === 'ACTIVITY'
          ? (eventData.schedules || []).map((schedule, index) => ({
            id_schedule: maxScheduleId + index + 1,
            start_time: new Date(schedule.start_time).toISOString(),
            end_time: new Date(schedule.end_time).toISOString(),
            capacity: schedule.capacity,
            price: schedule.price,
            sold: 0
          }))
          : undefined
      };
      EVENTS.push(newEvent);
      resolve(newEvent);
    });
  },

  updateEvent: async (id: number, eventData: EventUpdateInput): Promise<EventMock> => {
    return new Promise((resolve, reject) => {
      const index = EVENTS.findIndex(e => e.id_event === id);
      if (index !== -1) {
        const updatedEvent = { ...EVENTS[index], ...eventData };

        try {
          validateEventDuration(updatedEvent);
        } catch (error) {
          reject(error);
          return;
        }

        EVENTS[index] = updatedEvent;
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

  bookEvent: async (eventId: number, quantity: number, scheduleId?: number): Promise<ReservationMock & { remainingGold: number }> => {
    return new Promise((resolve, reject) => {
      const event = EVENTS.find(e => e.id_event === eventId);
      if (!event) {
        reject(new Error('Event not found'));
        return;
      }

      let price = event.price;

      if (scheduleId) {
        if (!event.schedules) {
          reject(new Error('Event has no schedules'));
          return;
        }
        const schedule = event.schedules.find(s => s.id_schedule === scheduleId);
        if (!schedule) {
          reject(new Error('Schedule not found'));
          return;
        }

        const capacity = schedule.capacity ?? event.capacity;
        const sold = schedule.sold ?? 0;
        
        if (sold + quantity > capacity) {
          reject(new Error('Not enough capacity in schedule'));
          return;
        }

        schedule.sold = sold + quantity;
        if (schedule.price !== undefined) {
          price = schedule.price;
        }
      } else {
        if (event.type === 'ACTIVITY') {
            reject(new Error('Activity requires a schedule selection'));
            return;
        }

        if ((event.sold + quantity) > event.capacity) {
            reject(new Error('Not enough capacity'));
            return;
        }
        event.sold += quantity;
      }

      const totalPrice = price * quantity;
      const userId = getCurrentUserId();
      const user = USERS.find(entry => entry.id === userId);

      if (!user) {
        reject(new Error('User not found'));
        return;
      }

      if ((user.gold || 0) < totalPrice) {
        reject(new Error('Not enough gold'));
        return;
      }

      user.gold = Math.max(0, (user.gold || 0) - totalPrice);

      const currentUserStr = localStorage.getItem('currentUser');
      if (currentUserStr) {
        try {
          const currentUser = JSON.parse(currentUserStr) as UserMock;
          if (currentUser.id === user.id) {
            currentUser.gold = user.gold;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
          }
        } catch {
          // Ignore storage sync errors in mock mode and keep in-memory mock state.
        }
      }

      const newReservation: ReservationMock & { remainingGold: number } = {
        id_reservation: Math.max(...RESERVATIONS.map(r => r.id_reservation), 0) + 1,
        id_user: userId,
        id_event: eventId,
        id_schedule: scheduleId,
        quantity,
        total_price: totalPrice,
        status: 'CONFIRMED',
        created_at: new Date().toISOString(),
        remainingGold: user.gold,
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
