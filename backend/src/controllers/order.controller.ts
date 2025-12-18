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

export const payOrder = async (req: Request, res: Response) => {
    try {
        const orderId = Number(req.params.id);
        const { userId } = req.body;

        if (!orderId || isNaN(orderId)) {
            return res.status(400).json({ error: 'Invalid order ID' });
        }

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const result = await orderService.payOrder(orderId, Number(userId));
        return res.status(200).json(result);
    } catch (error) {
        const errorMessage = (error as Error).message;
        if (errorMessage === 'Order not found') {
            return res.status(404).json({ error: errorMessage });
        }
        if (errorMessage === 'Unauthorized') {
            return res.status(403).json({ error: errorMessage });
        }
        if (errorMessage === 'Order already processed') {
            return res.status(400).json({ error: errorMessage });
        }
        console.error('Error paying order:', error);
        return res.status(500).json({ error: 'Failed to pay order' });
    }
};
