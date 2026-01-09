import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/api/v1';

export interface Message {
    id_message: number;
    content: string;
    created_at: string;
    sender: {
        id_user: number;
        firstname: string;
        lastname: string;
    };
    id_conversation: number;
}

export interface Conversation {
    id_conversation: number;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
    location: {
        id_location: number;
        name: string;
        id_prestataire: number;
        prestataire?: {
            id_user: number;
            firstname: string;
            lastname: string;
            avatar_url?: string;
        };
    };
    user?: {
        id_user: number;
        firstname: string;
        lastname: string;
        avatar_url?: string;
    };
    messages?: Message[];
}

const isMockEnabled = import.meta.env.VITE_NO_BACKEND === 'true';

class MessagingServiceImpl {
    private getHeaders() {
        const token = localStorage.getItem('authToken');
        return {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
    }

    async getConversations(): Promise<Conversation[]> {
        const response = await axios.get(`${API_URL}/conversations`, this.getHeaders());
        return response.data;
    }

    async getMessages(conversationId: number): Promise<Message[]> {
        const response = await axios.get(`${API_URL}/conversations/${conversationId}/messages`, this.getHeaders());
        return response.data;
    }

    async sendMessage(conversationId: number, content: string): Promise<Message> {
        const response = await axios.post(`${API_URL}/messages`, {
            conversationId,
            content
        }, this.getHeaders());
        return response.data;
    }

    async createConversation(locationId: number): Promise<Conversation> {
        const response = await axios.post(`${API_URL}/conversations`, {
            id_location: locationId
        }, this.getHeaders());
        return response.data;
    }
    async deleteConversation(conversationId: number): Promise<void> {
        await axios.delete(`${API_URL}/conversations/${conversationId}`, this.getHeaders());
    }
}

// Mock implementation using LocalStorage
class MockMessagingService {
    async getConversations(includeDeleted = false): Promise<Conversation[]> {
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
        const stored = localStorage.getItem('mock_conversations');
        let conversations = stored ? JSON.parse(stored) : [];

        // Fix broken data
        conversations = conversations.map((c: Conversation) => {
            if (!c.user) {
                c.user = { id_user: 0, firstname: 'Anonymous', lastname: 'Adventurer' };
            }
            // Fix generic location names
            if (c.location.name && c.location.name.startsWith('Location ')) {
                const locationNames = ['Auberge du Dragon Vert', 'Taverne des Trois Rois', 'Relais du Silence', 'Le Chaudron Baveux', 'Citadelle de l\'Ombre'];
                c.location.name = locationNames[c.location.id_location % 5] || `Lieu ${c.location.id_location}`;
            }
            return c;
        });

        if (!includeDeleted) {
            conversations = conversations.filter((c: Conversation) => !c.deleted_at);
        }

        return conversations;
    }

    async getMessages(conversationId: number): Promise<Message[]> {
        await new Promise(resolve => setTimeout(resolve, 300));
        const stored = localStorage.getItem(`mock_messages_${conversationId}`);
        return stored ? JSON.parse(stored) : [];
    }

    async sendMessage(conversationId: number, content: string): Promise<Message> {
        await new Promise(resolve => setTimeout(resolve, 300));

        // Get current user from storage (mock)
        const userStr = localStorage.getItem('currentUser');
        const user = userStr ? JSON.parse(userStr) : { id: 1, firstname: 'Mock', lastname: 'User' };

        const newMessage: Message = {
            id_message: Date.now(),
            content,
            created_at: new Date().toISOString(),
            sender: {
                id_user: user.id || user.id_user,
                firstname: user.firstname,
                lastname: user.lastname
            },
            id_conversation: conversationId
        };

        // Save message
        const key = `mock_messages_${conversationId}`;
        const messages = await this.getMessages(conversationId);
        messages.push(newMessage);
        localStorage.setItem(key, JSON.stringify(messages));

        // Update conversation updated_at and preview
        const conversations = await this.getConversations();
        const convIndex = conversations.findIndex((c: Conversation) => c.id_conversation === conversationId);
        if (convIndex !== -1) {
            conversations[convIndex].updated_at = new Date().toISOString();
            conversations[convIndex].messages = [newMessage]; // Update preview
            localStorage.setItem('mock_conversations', JSON.stringify(conversations));
        }

        return newMessage;
    }

    async createConversation(locationId: number): Promise<Conversation> {
        await new Promise(resolve => setTimeout(resolve, 500));

        const conversations = await this.getConversations();

        // Check if exists
        const existing = conversations.find((c: Conversation) => c.location.id_location === locationId);
        if (existing) return existing;

        const userStr = localStorage.getItem('currentUser');
        const user = userStr ? JSON.parse(userStr) : { id: 1, firstname: 'Mock', lastname: 'User' };

        const newConv: Conversation = {
            id_conversation: Date.now(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            location: {
                id_location: locationId,
                name: ['Auberge du Dragon Vert', 'Taverne des Trois Rois', 'Relais du Silence', 'Le Chaudron Baveux', 'Citadelle de l\'Ombre'][locationId % 5] || `Lieu ${locationId}`,
                id_prestataire: 999,
                prestataire: {
                    id_user: 999,
                    firstname: 'Jean',
                    lastname: 'Prestataire',
                    avatar_url: undefined
                }
            },
            user: {
                id_user: user.id || user.id_user,
                firstname: user.firstname,
                lastname: user.lastname,
                avatar_url: user.avatar_url
            },
            messages: []
        };

        conversations.push(newConv);
        localStorage.setItem('mock_conversations', JSON.stringify(conversations));

        return newConv;
    }

    async deleteConversation(conversationId: number): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 300));
        const conversations = await this.getConversations(true);
        const index = conversations.findIndex((c: Conversation) => c.id_conversation === conversationId);
        if (index !== -1) {
            conversations.splice(index, 1); // Hard delete
            localStorage.setItem('mock_conversations', JSON.stringify(conversations));
        }
    }
}

export const messagingService = isMockEnabled ? new MockMessagingService() : new MessagingServiceImpl();
