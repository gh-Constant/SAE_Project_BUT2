import axios from 'axios';
import { eventMockService } from './mock/eventMockService';
import { EventMock } from '@/mocks/events';
import { ReservationMock } from '@/mocks/reservations';

const isMockEnabled = import.meta.env.VITE_NO_BACKEND === 'true';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const eventServiceImpl = {
  getEvents: async (filters?: { id_location?: number; published?: boolean }): Promise<EventMock[]> => {
    const response = await axios.get(`${API_URL}/events`, { params: filters });
    return response.data;
  },

  getEventById: async (id: number): Promise<EventMock | null> => {
    const response = await axios.get(`${API_URL}/events/${id}`);
    return response.data;
  },

  createEvent: async (eventData: any): Promise<EventMock> => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/events`, eventData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  updateEvent: async (id: number, eventData: any): Promise<EventMock> => {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/events/${id}`, eventData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  deleteEvent: async (id: number): Promise<void> => {
    const token = localStorage.getItem('token');
    await axios.delete(`${API_URL}/events/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  bookEvent: async (eventId: number, quantity: number): Promise<ReservationMock> => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/events/book`, { eventId, quantity }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  getUserReservations: async (): Promise<ReservationMock[]> => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/events/user/reservations`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};

export const eventService = isMockEnabled ? eventMockService : eventServiceImpl;
