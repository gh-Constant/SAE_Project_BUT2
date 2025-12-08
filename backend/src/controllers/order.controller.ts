import { Request, Response } from 'express';
import orderService from '../services/orderService.js';

export const createOrder = async (req: Request, res: Response) => {
    try {
        // The frontend sends:
        // locationId: number
        // id_prestataire: number
        // items: Array<{ id_product, quantity, price }>
        // userId: number (from authStore)

        const { userId, locationId, items } = req.body;

        if (!userId || !items || !Array.isArray(items) || items.length === 0) {
            console.error('Invalid order request:', req.body);
            return res.status(400).json({ error: 'Invalid order data' });
        }

        const mappedItems = items.map((item: any) => ({
            productId: Number(item.id_product),
            quantity: Number(item.quantity),
            price: Number(item.price)
        }));

        const newOrder = await orderService.createOrder({
            userId: Number(userId),
            locationId: Number(locationId),
            items: mappedItems
        });

        return res.status(201).json(newOrder);
    } catch (error) {
        console.error('Error creating order:', error);
        return res.status(500).json({ error: 'Failed to create order' });
    }
};
