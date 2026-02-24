import apiClient from './apiClient';

const isMockEnabled = import.meta.env.VITE_NO_BACKEND === 'true';

export interface ContactMessage {
    id_contact?: number;
    name: string;
    email: string;
    message: string;
    id_location: number;
    created_at?: string;
}

const contactServiceImpl = {
    sendMessage: async (message: ContactMessage): Promise<ContactMessage> => {
        try {
            const response = await apiClient.post(`/contact`, message);
            return response.data;
        } catch {
            throw new Error('Failed to send message');
        }
    },

    getMessages: async (locationId: number): Promise<ContactMessage[]> => {
        try {
            const response = await apiClient.get(`/contact/location/${locationId}`);
            return response.data;
        } catch {
            throw new Error('Failed to fetch messages');
        }
    }
};

// Mock implementation using LocalStorage
const contactMockService = {
    sendMessage: async (message: ContactMessage): Promise<ContactMessage> => {
        const key = `contact_messages_${message.id_location}`;
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        const newMessage = { ...message, id_contact: Date.now(), created_at: new Date().toISOString() };
        existing.push(newMessage);
        localStorage.setItem(key, JSON.stringify(existing));
        return newMessage;
    },

    getMessages: async (locationId: number): Promise<ContactMessage[]> => {
        const key = `contact_messages_${locationId}`;
        return JSON.parse(localStorage.getItem(key) || '[]');
    }
};

export const contactService = isMockEnabled ? contactMockService : contactServiceImpl;
