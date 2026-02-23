import apiClient from './apiClient';
import { eventMockService } from './mock/eventMockService';
import { EventMock, EventInput, EventUpdateInput } from '@/mocks/events';
import { ReservationMock } from '@/mocks/reservations';

const isMockEnabled = import.meta.env.VITE_NO_BACKEND === 'true';

const eventServiceImpl = {
  getEvents: async (filters?: { id_location?: number; published?: boolean }): Promise<EventMock[]> => {
    const response = await apiClient.get('/events', { params: filters });
    return response.data;
  },

  getEventById: async (id: number): Promise<EventMock | null> => {
    const response = await apiClient.get(`/events/${id}`);
    return response.data;
  },

  createEvent: async (eventData: EventInput): Promise<EventMock> => {
    const response = await apiClient.post('/events', eventData);
    return response.data;
  },

  updateEvent: async (id: number, eventData: EventUpdateInput): Promise<EventMock> => {
    const response = await apiClient.put(`/events/${id}`, eventData);
    return response.data;
  },

  deleteEvent: async (id: number): Promise<void> => {
    await apiClient.delete(`/events/${id}`);
  },

  bookEvent: async (eventId: number, quantity: number, scheduleId?: number): Promise<ReservationMock> => {
    const response = await apiClient.post('/events/book', { id_event: eventId, quantity, id_schedule: scheduleId });
    return response.data;
  },

  getUserReservations: async (): Promise<ReservationMock[]> => {
    const response = await apiClient.get('/events/user/reservations');
    return response.data;
  },

  getEventReservations: async (eventId: number): Promise<any[]> => {
    const response = await apiClient.get(`/events/${eventId}/reservations`);
    return response.data;
  },

  getProviderReservations: async (): Promise<any[]> => {
    const response = await apiClient.get('/events/provider/reservations');
    return response.data;
  }
};

export const eventService = isMockEnabled ? eventMockService : eventServiceImpl;
