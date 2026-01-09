import { Request, Response } from 'express';
import prisma from '../prisma.js';

/**
 * Créer un nouveau message de contact
 */
export const createContactMessage = async (req: Request, res: Response) => {
    try {
        const { name, email, message, id_location } = req.body;

        if (!name || !email || !message || !id_location) {
            return res.status(400).json({ error: 'Tous les champs sont requis' });
        }

        const contact = await prisma.contactMessage.create({
            data: {
                name,
                email,
                message,
                id_location: parseInt(id_location)
            }
        });

        return res.status(201).json(contact);
    } catch (error) {
        console.error('Error creating contact message:', error);
        return res.status(500).json({ error: 'Erreur lors de l\'envoi du message' });
    }
};

/**
 * Récupérer les messages d'une location (pour le propriétaire)
 */
export const getContactMessages = async (req: Request, res: Response) => {
    try {
        const { locationId } = req.params;

        const messages = await prisma.contactMessage.findMany({
            where: {
                id_location: parseInt(locationId)
            },
            orderBy: {
                created_at: 'desc'
            }
        });

        return res.json(messages);
    } catch (error) {
        console.error('Error fetching contact messages:', error);
        return res.status(500).json({ error: 'Erreur lors de la récupération des messages' });
    }
};
