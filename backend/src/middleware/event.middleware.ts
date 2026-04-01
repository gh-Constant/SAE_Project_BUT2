import { Response, NextFunction } from 'express';

import { Request } from 'express';

interface EventData {
  title: string;
  description?: string;
  type?: 'EVENT' | 'ACTIVITY';
  start_time?: Date | string;
  end_time?: Date | string;
  price: number;
  capacity: number;
  id_location: number;
  schedules?: any[];
}

export const validateEventData = (req: Request<any, any, EventData>, res: Response, next: NextFunction) => {
  const {
    title,
    type,
    start_time,
    end_time,
    price,
    capacity,
    id_location,
    schedules
  } = req.body;

  if (!title || price === undefined || capacity === undefined || id_location === undefined) {
    return res.status(400).json({ message: 'Missing required event fields.' });
  }

  // EVENT type validation
  if (!type || type === 'EVENT') {
    if (!start_time || !end_time) {
      return res.status(400).json({ message: 'Missing start_time or end_time for EVENT type.' });
    }
    const startDate = new Date(start_time);
    const endDate = new Date(end_time);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ message: 'Invalid start_time or end_time format.' });
    }

    if (startDate >= endDate) {
      return res.status(400).json({ message: 'start_time must be before end_time.' });
    }
  } 
  
  // ACTIVITY type validation
  if (type === 'ACTIVITY') {
    if (!schedules || !Array.isArray(schedules) || schedules.length === 0) {
      return res.status(400).json({ message: 'ACTIVITY type requires at least one schedule.' });
    }
    // Validate schedules
    for (const schedule of schedules) {
      if (!schedule.start_time || !schedule.end_time) {
        return res.status(400).json({ message: 'Each schedule must have start_time and end_time.' });
      }
      const sStart = new Date(schedule.start_time);
      const sEnd = new Date(schedule.end_time);
      if (isNaN(sStart.getTime()) || isNaN(sEnd.getTime())) {
        return res.status(400).json({ message: 'Invalid schedule date format.' });
      }
      if (sStart >= sEnd) {
        return res.status(400).json({ message: 'Schedule start_time must be before end_time.' });
      }
    }
  }

  if (typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ message: 'Title must be a non-empty string.' });
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
  id_event: number;
  quantity: number;
  id_schedule?: number;
}

export const validateBookingData = (req: Request<any, any, BookingData>, res: Response, next: NextFunction) => {
  const { id_event, quantity, id_schedule } = req.body;

  if (id_event === undefined || quantity === undefined) {
    return res.status(400).json({ message: 'Missing required booking fields (id_event, quantity).' });
  }

  if (typeof id_event !== 'number' || id_event <= 0) {
    return res.status(400).json({ message: 'id_event must be a positive number.' });
  }

  if (typeof quantity !== 'number' || quantity <= 0) {
    return res.status(400).json({ message: 'Quantity must be a positive number.' });
  }
  
  if (id_schedule !== undefined && (typeof id_schedule !== 'number' || id_schedule <= 0)) {
    return res.status(400).json({ message: 'id_schedule must be a positive number.' });
  }

  return next();
};



