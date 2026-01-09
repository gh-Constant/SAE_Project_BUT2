import { Request, Response } from 'express';
import * as eventService from '../services/eventService.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export const eventController = {
  async createEvent(req: Request, res: Response): Promise<void> {
    try {
      const event = await eventService.createEvent(req.body);
      res.status(201).json(event);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },

  async getEvents(req: Request, res: Response): Promise<void> {
    try {
      const id_location = Number(req.query.id_location);
      const events = await eventService.getEvents(id_location);
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },

  async getEventById(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const event = await eventService.getEventById(id);
      if (!event) {
        res.status(404).json({ error: 'Event not found' });
        return;
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },

  async updateEvent(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const event = await eventService.updateEvent(id, req.body);
      res.json(event);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },

  async deleteEvent(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      await eventService.deleteEvent(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },

  async bookEvent(req: Request, res: Response): Promise<void> {
    try {
      const { id_event, quantity } = req.body;
      const userId = (req as AuthenticatedRequest).user?.id;

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const reservation = await eventService.bookEvent(userId, Number(id_event), Number(quantity));
      res.status(201).json(reservation);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },

  async getUserReservations(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthenticatedRequest).user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const reservations = await eventService.getUserReservations(userId);
      res.json(reservations);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
};
