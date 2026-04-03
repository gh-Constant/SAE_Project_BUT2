import { Request, Response } from 'express';
import * as eventService from '../services/eventService.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

const getActor = (req: Request) => (req as AuthenticatedRequest).user;

export const eventController = {
  async createEvent(req: Request, res: Response): Promise<void> {
    try {
      const actor = getActor(req);
      const event = await eventService.createEvent(req.body, actor?.id, actor?.role);
      res.status(201).json(event);
    } catch (error) {
      if ((error as Error).message === 'Unauthorized') {
        res.status(403).json({ error: 'Unauthorized' });
        return;
      }
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
      const actor = getActor(req);
      const event = await eventService.updateEvent(id, req.body, actor?.id, actor?.role);
      res.json(event);
    } catch (error) {
      if ((error as Error).message === 'Unauthorized') {
        res.status(403).json({ error: 'Unauthorized' });
        return;
      }
      res.status(500).json({ error: (error as Error).message });
    }
  },

  async deleteEvent(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const actor = getActor(req);
      await eventService.deleteEvent(id, actor?.id, actor?.role);
      res.status(204).send();
    } catch (error) {
      if ((error as Error).message === 'Unauthorized') {
        res.status(403).json({ error: 'Unauthorized' });
        return;
      }
      res.status(500).json({ error: (error as Error).message });
    }
  },

  async bookEvent(req: Request, res: Response): Promise<void> {
    try {
      const { id_event, quantity, id_schedule } = req.body;
      const userId = (req as AuthenticatedRequest).user?.id;

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const reservation = await eventService.bookEvent(userId, Number(id_event), Number(quantity), id_schedule ? Number(id_schedule) : undefined);
      res.status(201).json(reservation);
    } catch (error) {
      const message = (error as Error).message;
      if ([
        'Event not found',
        'Schedule not found',
        'Schedule does not belong to this event',
        'Not enough capacity in schedule',
        'This is an activity, you must specify a schedule id',
        'Not enough capacity',
        'Not enough gold',
        'Invalid gold amount'
      ].includes(message)) {
        res.status(400).json({ error: message });
        return;
      }
      if (message === 'User not found') {
        res.status(404).json({ error: message });
        return;
      }
      res.status(500).json({ error: message });
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
  },

  async getEventReservations(req: Request, res: Response): Promise<void> {
    try {
      const eventId = Number(req.params.id);
      const actor = getActor(req);
      const reservations = await eventService.getEventReservations(eventId, actor?.id, actor?.role);
      res.json(reservations);
    } catch (error) {
      if ((error as Error).message === 'Unauthorized') {
        res.status(403).json({ error: 'Unauthorized' });
        return;
      }
      res.status(500).json({ error: (error as Error).message });
    }
  },

  async getProviderReservations(req: Request, res: Response): Promise<void> {
    try {
      const providerId = (req as AuthenticatedRequest).user?.id;
      if (!providerId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const reservations = await eventService.getProviderReservations(providerId);
      res.json(reservations);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },

  async addSchedule(req: Request, res: Response): Promise<void> {
    try {
      const eventId = Number(req.params.id);
      const actor = getActor(req);
      const schedule = await eventService.addSchedule(eventId, req.body, actor?.id, actor?.role);
      res.status(201).json(schedule);
    } catch (error) {
      if ((error as Error).message === 'Unauthorized') {
        res.status(403).json({ error: 'Unauthorized' });
        return;
      }
      res.status(500).json({ error: (error as Error).message });
    }
  },

  async updateSchedule(req: Request, res: Response): Promise<void> {
    try {
      const scheduleId = Number(req.params.id);
      const actor = getActor(req);
      const schedule = await eventService.updateSchedule(scheduleId, req.body, actor?.id, actor?.role);
      res.json(schedule);
    } catch (error) {
      if ((error as Error).message === 'Unauthorized') {
        res.status(403).json({ error: 'Unauthorized' });
        return;
      }
      res.status(500).json({ error: (error as Error).message });
    }
  },

  async deleteSchedule(req: Request, res: Response): Promise<void> {
    try {
      const scheduleId = Number(req.params.id);
      const actor = getActor(req);
      await eventService.deleteSchedule(scheduleId, actor?.id, actor?.role);
      res.status(204).send();
    } catch (error) {
      if ((error as Error).message === 'Unauthorized') {
        res.status(403).json({ error: 'Unauthorized' });
        return;
      }
      res.status(500).json({ error: (error as Error).message });
    }
  }
};
