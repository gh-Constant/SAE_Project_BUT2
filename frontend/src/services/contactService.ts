const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
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
        const response = await fetch(`${API_BASE_URL}/api/v1/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });

        if (!response.ok) {
            throw new Error('Failed to send message');
        }

        return await response.json();
    },

    getMessages: async (locationId: number): Promise<ContactMessage[]> => {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/api/v1/contact/location/${locationId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch messages');
        }

        return await response.json();
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
