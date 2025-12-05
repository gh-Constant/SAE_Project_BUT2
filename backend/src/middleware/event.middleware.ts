import { Response, NextFunction } from 'express';

import { Request } from 'express';

interface EventData {
  title: string;
  description?: string;
  start_time: Date | string;
  end_time: Date | string;
  price: number;
  capacity: number;
  id_location: number;
}

export const validateEventData = (req: Request<any, any, EventData>, res: Response, next: NextFunction) => {
  const { title, start_time, end_time, price, capacity, id_location } = req.body;

  if (!title || !start_time || !end_time || price === undefined || capacity === undefined || id_location === undefined) {
    return res.status(400).json({ message: 'Missing required event fields.' });
  }

  if (typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ message: 'Title must be a non-empty string.' });
  }

  const startDate = new Date(start_time);
  const endDate = new Date(end_time);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return res.status(400).json({ message: 'Invalid start_time or end_time format.' });
  }

  if (startDate >= endDate) {
    return res.status(400).json({ message: 'start_time must be before end_time.' });
  }

  if (typeof price !== 'number' || price < 0) {
    return res.status(400).json({ message: 'Price must be a non-negative number.' });
  }

  if (typeof capacity !== 'number' || capacity <= 0) {
    return res.status(400).json({ message: 'Capacity must be a positive number.' });
  }

  if (typeof id_location !== 'number' || id_location <= 0) {
    return res.status(400).json({ message: 'id_location must be a positive number.' });
  }

  return next();
};

interface BookingData {
  eventId: number;
  quantity: number;
}

export const validateBookingData = (req: Request<any, any, BookingData>, res: Response, next: NextFunction) => {
  const { eventId, quantity } = req.body;

  if (eventId === undefined || quantity === undefined) {
    return res.status(400).json({ message: 'Missing required booking fields (eventId, quantity).' });
  }

  if (typeof eventId !== 'number' || eventId <= 0) {
    return res.status(400).json({ message: 'eventId must be a positive number.' });
  }

  if (typeof quantity !== 'number' || quantity <= 0) {
    return res.status(400).json({ message: 'Quantity must be a positive number.' });
  }

  return next();
};



