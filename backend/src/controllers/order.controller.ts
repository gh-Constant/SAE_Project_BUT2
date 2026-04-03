import { Request, Response } from 'express';
import orderService from '../services/orderService.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

// Interface pour les items de commande reçus du frontend
interface OrderItemInput {
    id_product: number | string;
    quantity: number | string;
    price: number | string;
}

export const createOrder = async (req: Request, res: Response) => {
    try {
        const authenticatedUserId = (req as AuthenticatedRequest).user?.id;
        const { locationId, items } = req.body;

        if (!authenticatedUserId || !items || !Array.isArray(items) || items.length === 0) {
            console.error('Invalid order request:', req.body);
            return res.status(400).json({ error: 'Invalid order data' });
        }

        const mappedItems = items.map((item: OrderItemInput) => ({
            productId: Number(item.id_product),
            quantity: Number(item.quantity),
            price: Number(item.price)
        }));

        const newOrder = await orderService.createOrder({
            userId: authenticatedUserId,
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
        const authenticatedUserId = (req as AuthenticatedRequest).user?.id;
        const orderId = Number(req.params.id);

        if (!authenticatedUserId || !orderId || isNaN(orderId)) {
            return res.status(400).json({ error: 'Invalid order ID' });
        }

        const result = await orderService.payOrder(orderId, authenticatedUserId);
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
        if (errorMessage === 'Not enough gold') {
            return res.status(400).json({ error: errorMessage });
        }
        if (errorMessage === 'Invalid gold amount') {
            return res.status(400).json({ error: errorMessage });
        }
        console.error('Error paying order:', error);
        return res.status(500).json({ error: 'Failed to pay order' });
    }
};

export const getMyOrders = async (req: Request, res: Response) => {
    try {
        const authenticatedUserId = (req as AuthenticatedRequest).user?.id;
        if (!authenticatedUserId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const orders = await orderService.getUserOrders(authenticatedUserId);
        return res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching user orders:', error);
        return res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

export const collectOrder = async (req: Request, res: Response) => {
    try {
        const authenticatedUserId = (req as AuthenticatedRequest).user?.id;
        const { token } = req.body;

        if (!authenticatedUserId || !token) {
            return res.status(400).json({ error: 'Token is required' });
        }

        const order = await orderService.collectOrder(token, authenticatedUserId);
        return res.status(200).json(order);
    } catch (error) {
        const errorMessage = (error as Error).message;
        if (['QR code not found', 'Order not found'].includes(errorMessage)) {
            return res.status(404).json({ error: errorMessage });
        }
        if (['Unauthorized', 'Order not paid', 'QR code already used'].includes(errorMessage)) {
            return res.status(400).json({ error: errorMessage });
        }
        console.error('Error collecting order:', error);
        return res.status(500).json({ error: 'Failed to collect order' });
    }
};
