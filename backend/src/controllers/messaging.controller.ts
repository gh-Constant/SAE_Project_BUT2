import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import prisma from '../prisma.js';

const db = prisma as any;

export const createConversation = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { id_location } = req.body;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        // Check if conversation already exists
        const existingConversation = await db.conversation.findFirst({
            where: {
                id_user: userId,
                id_location: parseInt(id_location)
            },
            include: {
                location: true
            }
        });

        if (existingConversation) {
            res.json(existingConversation);
            return;
        }

        const conversation = await db.conversation.create({
            data: {
                id_user: userId,
                id_location: parseInt(id_location)
            },
            include: {
                location: true
            }
        });

        res.status(201).json(conversation);
    } catch (error) {
        console.error('Error creating conversation:', error);
        res.status(500).json({ message: 'Error creating conversation' });
    }
};

export const getConversations = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const userRole = req.user?.role;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        let whereClause = {};

        if (userRole === 'prestataire') {
            // For providers, find conversations for their locations
            // First get provider's locations
            const locations = await db.location.findMany({
                where: { id_prestataire: userId },
                select: { id_location: true }
            });
            const locationIds = locations.map((l: { id_location: number }) => l.id_location);

            whereClause = {
                id_location: { in: locationIds }
            };
        } else {
            // For adventurers, find their own conversations
            whereClause = {
                id_user: userId
            };
        }

        const conversations = await db.conversation.findMany({
            where: whereClause,
            include: {
                location: {
                    include: {
                        prestataire: {
                            select: {
                                id_user: true,
                                firstname: true,
                                lastname: true,
                                avatar_url: true
                            }
                        }
                    }
                },
                user: {
                    select: {
                        id_user: true,
                        firstname: true,
                        lastname: true,
                        avatar_url: true
                    }
                },
                messages: {
                    orderBy: {
                        created_at: 'desc'
                    },
                    take: 1
                }
            },
            orderBy: {
                updated_at: 'desc'
            }
        });

        res.json(conversations);
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ message: 'Error fetching conversations' });
    }
};

export const getMessages = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const conversationId = parseInt(req.params.id);

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        // Verify access to conversation
        const conversation = await db.conversation.findUnique({
            where: { id_conversation: conversationId },
            include: { location: true }
        });

        if (!conversation) {
            res.status(404).json({ message: 'Conversation not found' });
            return;
        }

        // Check if user is participant is adventurer or provider
        const isParticipant = conversation.id_user === userId;
        const isLocationOwner = conversation.location.id_prestataire === userId;

        if (!isParticipant && !isLocationOwner) {
            res.status(403).json({ message: 'Forbidden' });
            return;
        }

        const messages = await db.message.findMany({
            where: { id_conversation: conversationId },
            orderBy: { created_at: 'asc' },
            include: {
                sender: {
                    select: {
                        id_user: true,
                        firstname: true,
                        lastname: true
                    }
                }
            }
        });

        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Error fetching messages' });
    }
};

export const sendMessage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const conversationId = parseInt(req.query.conversationId as string || req.body.conversationId);
        const { content } = req.body;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        // Verify conversation exists
        const conversation = await db.conversation.findUnique({
            where: { id_conversation: conversationId }
        });

        if (!conversation) {
            res.status(404).json({ message: 'Conversation not found' });
            return;
        }

        // Create message
        const message = await db.message.create({
            data: {
                content,
                id_conversation: conversationId,
                sender_id: userId
            },
            include: {
                sender: {
                    select: {
                        id_user: true,
                        firstname: true,
                        lastname: true
                    }
                }
            }
        });

        // Update conversation updated_at
        await db.conversation.update({
            where: { id_conversation: conversationId },
            data: { updated_at: new Date() }
        });

        res.status(201).json(message);
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Error sending message' });
    }
};

export const deleteConversation = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const conversationId = parseInt(req.params.id);

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        // Verify conversation exists and user has rights
        const conversation = await db.conversation.findUnique({
            where: { id_conversation: conversationId },
            include: { location: true }
        });

        if (!conversation) {
            res.status(404).json({ message: 'Conversation not found' });
            return;
        }

        // Check ownership (participant or provider)
        const isParticipant = conversation.id_user === userId;
        const isLocationOwner = conversation.location.id_prestataire === userId;

        if (!isParticipant && !isLocationOwner) {
            res.status(403).json({ message: 'Forbidden' });
            return;
        }

        // Delete conversation (messages should cascade delete based on Prisma schema, 
        // but if not, we might need a transaction. Assuming cascade for now or valid DB constraints)
        // If strict, we can delete messages first.
        await db.message.deleteMany({
            where: { id_conversation: conversationId }
        });

        await db.conversation.delete({
            where: { id_conversation: conversationId }
        });

        res.status(200).json({ message: 'Conversation deleted successfully' });
    } catch (error) {
        console.error('Error deleting conversation:', error);
        res.status(500).json({ message: 'Error deleting conversation' });
    }
};
