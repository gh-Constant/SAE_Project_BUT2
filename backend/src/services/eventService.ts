import prisma from '../prisma.js';
import { ReservationStatus, Prisma } from '@prisma/client';

interface EventScheduleData {
  id_schedule?: number;
  start_time: Date | string;
  end_time: Date | string;
  capacity?: number;
  price?: number;
}

interface EventData {
  title: string;
  description?: string;
  type?: 'EVENT' | 'ACTIVITY';
  start_time?: Date | string; // Optional if ACTIVITY
  end_time?: Date | string;   // Optional if ACTIVITY
  price: number;
  capacity: number;
  id_location: number;
  schedules?: EventScheduleData[];
}


export const createEvent = async (data: EventData) => {
  const type = data.type || 'EVENT';
  
  return await prisma.event.create({
    data: {
      title: data.title,
      description: data.description,
      type: type,
      start_time: data.start_time ? new Date(data.start_time) : null,
      end_time: data.end_time ? new Date(data.end_time) : null,
      price: data.price,
      capacity: data.capacity,
      id_location: data.id_location,
      schedules: data.schedules && data.schedules.length > 0 ? {
        create: data.schedules.map(s => ({
          start_time: new Date(s.start_time),
          end_time: new Date(s.end_time),
          capacity: s.capacity,
          price: s.price
        }))
      } : undefined
    },
    include: {
      schedules: true
    }
  });
};

export const getEvents = async (id_location?: number) => {
  if (!id_location) {
    return await prisma.event.findMany({
      include: {
        location: true,
        schedules: true,
      },
      orderBy: {
        start_time: 'asc',
      },
    });
  }
  return await prisma.event.findMany({
    where: { id_location },
    include: {
      location: true,
      schedules: true,
    },
    orderBy: {
      start_time: 'asc',
    },
  });
};

export const getEventById = async (id: number) => {
  return await prisma.event.findUnique({
    where: { id_event: id },
    include: {
      schedules: true,
      location: true
    }
  });
};

export const updateEvent = async (id: number, data: Partial<EventData>) => {
  const updateData: Partial<{
    title: string;
    description: string | undefined;
    type: 'EVENT' | 'ACTIVITY';
    start_time: Date | null;
    end_time: Date | null;
    price: number;
    capacity: number;
    id_location: number;
  }> = {};

  if (data.title) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.type !== undefined) updateData.type = data.type;
  if (data.start_time !== undefined) updateData.start_time = data.start_time ? new Date(data.start_time) : null;
  if (data.end_time !== undefined) updateData.end_time = data.end_time ? new Date(data.end_time) : null;
  if (data.price !== undefined) updateData.price = data.price;
  if (data.capacity !== undefined) updateData.capacity = data.capacity;
  if (data.id_location !== undefined) updateData.id_location = data.id_location;

  return await prisma.$transaction(async (tx) => {
    await tx.event.update({
      where: { id_event: id },
      data: updateData,
    });

    if (Array.isArray(data.schedules)) {
      const existingSchedules = await tx.eventSchedule.findMany({
        where: { id_event: id },
        select: { id_schedule: true }
      });

      const existingIds = new Set(existingSchedules.map(schedule => schedule.id_schedule));
      const incomingIds = data.schedules
        .map(schedule => schedule.id_schedule)
        .filter((scheduleId): scheduleId is number => typeof scheduleId === 'number' && scheduleId > 0);

      const scheduleIdsToDelete = [...existingIds].filter(existingId => !incomingIds.includes(existingId));
      if (scheduleIdsToDelete.length > 0) {
        await tx.eventSchedule.deleteMany({
          where: {
            id_event: id,
            id_schedule: { in: scheduleIdsToDelete }
          }
        });
      }

      for (const schedule of data.schedules) {
        const schedulePayload = {
          start_time: new Date(schedule.start_time),
          end_time: new Date(schedule.end_time),
          capacity: schedule.capacity ?? null,
          price: schedule.price !== undefined ? new Prisma.Decimal(schedule.price) : null
        };

        if (schedule.id_schedule && existingIds.has(schedule.id_schedule)) {
          await tx.eventSchedule.update({
            where: { id_schedule: schedule.id_schedule },
            data: schedulePayload
          });
        } else {
          await tx.eventSchedule.create({
            data: {
              id_event: id,
              ...schedulePayload,
              sold: 0
            }
          });
        }
      }
    }

    return await tx.event.findUnique({
      where: { id_event: id },
      include: {
        schedules: true,
        location: true
      }
    });
  });
};

export const deleteEvent = async (id: number) => {
  return await prisma.event.delete({
    where: { id_event: id },
  });
};

export const bookEvent = async (userId: number, eventId: number, quantity: number, scheduleId?: number) => {
  // Start a transaction to ensure atomicity
  return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const event = await tx.event.findUnique({
      where: { id_event: eventId },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    // Determine target entity for capacity check (Event or EventSchedule)
    let targetCapacity = event.capacity;
    let targetSold = event.sold;
    let targetPrice = Number(event.price);
    
    // If scheduleId provided, we are booking a schedule
    if (scheduleId) {
      const schedule = await tx.eventSchedule.findUnique({
        where: { id_schedule: scheduleId },
      });
      
      if (!schedule) {
        throw new Error('Schedule not found');
      }
      
      if (schedule.id_event !== eventId) {
        throw new Error('Schedule does not belong to this event');
      }
      
      // Use schedule overrides or fallbacks
      targetCapacity = schedule.capacity ?? event.capacity;
      targetSold = schedule.sold;
      if (schedule.price !== null && schedule.price !== undefined) {
        targetPrice = Number(schedule.price);
      }
      
      if (targetSold + quantity > targetCapacity) {
        throw new Error('Not enough capacity in schedule');
      }
      
      // Update schedule sold count
      await tx.eventSchedule.update({
        where: { id_schedule: scheduleId },
        data: {
          sold: {
            increment: quantity,
          },
        },
      });

      // Also update the global event sold count
      await tx.event.update({
        where: { id_event: eventId },
        data: {
          sold: {
            increment: quantity,
          },
        },
      });
      
    } else {
      // Booking the event directly (only valid for EVENT type, strict check?)
      // User said: "Event = unique occurrence", "Activity = multiple schedules".
      // If type is ACTIVITY, user MUST provide scheduleId? The user answered "Il reserve un créneau spécifique".
      // So if type is ACTIVITY and no scheduleId => Error.
      
      // We can't strictly check 'type' here unless we generated the client and it has the type.
      // But assuming 'event' has 'type' now.
      // Since I just updated prisma schema, `tx.event.findUnique` result will have `type`.
      // However Typescript might complain if I didn't regenerate client yet. 
      // I'll cast it or assume it works at runtime.
      
      // Let's implement robust logic:
      if ((event as any).type === 'ACTIVITY') {
         throw new Error('This is an activity, you must specify a schedule id');
      }

      if (targetSold + quantity > targetCapacity) {
        throw new Error('Not enough capacity');
      }

      // Update event sold count
      await tx.event.update({
        where: { id_event: eventId },
        data: {
          sold: {
            increment: quantity,
          },
        },
      });
    }

    // Create reservation
    const reservation = await tx.eventReservation.create({
      data: {
        id_user: userId,
        id_event: eventId,
        id_schedule: scheduleId,
        quantity,
        total_price: targetPrice * quantity,
        status: ReservationStatus.CONFIRMED, // Auto-confirm
      },
    });

    return reservation;
  });
};


export const addSchedule = async (eventId: number, data: EventScheduleData) => {
  return await prisma.eventSchedule.create({
    data: {
      id_event: eventId,
      start_time: new Date(data.start_time),
      end_time: new Date(data.end_time),
      capacity: data.capacity,
      price: data.price ? new Prisma.Decimal(data.price) : undefined,
    }
  });
};

export const updateSchedule = async (scheduleId: number, data: Partial<EventScheduleData>) => {
  const updateData: any = {};
  if (data.start_time) updateData.start_time = new Date(data.start_time);
  if (data.end_time) updateData.end_time = new Date(data.end_time);
  if (data.capacity !== undefined) updateData.capacity = data.capacity;
  if (data.price !== undefined) updateData.price = new Prisma.Decimal(data.price);

  return await prisma.eventSchedule.update({
    where: { id_schedule: scheduleId },
    data: updateData
  });
};

export const deleteSchedule = async (scheduleId: number) => {
  return await prisma.eventSchedule.delete({
    where: { id_schedule: scheduleId }
  });
};

export const getUserReservations = async (userId: number) => {
  return await prisma.eventReservation.findMany({
    where: { id_user: userId },
    include: {
      event: {
        include: {
          location: true,
          schedules: true
        },
      },
      schedule: true,
    },
    orderBy: {
      created_at: 'desc',
    },
  });
};

export const getEventReservations = async (eventId: number) => {
  return await prisma.eventReservation.findMany({
    where: { id_event: eventId },
    include: {
      user: true,
      schedule: true,
    },
    orderBy: {
      created_at: 'desc',
    },
  });
};

export const getProviderReservations = async (providerId: number) => {
  // Find all locations owned by this provider
  const locations = await prisma.location.findMany({
    where: { id_prestataire: providerId },
    select: { id_location: true }
  });
  const locationIds = locations.map(l => l.id_location);

  // Find all events in these locations
  const events = await prisma.event.findMany({
    where: { id_location: { in: locationIds } },
    select: { id_event: true }
  });
  const eventIds = events.map(e => e.id_event);

  // Return reservations for these events
  return await prisma.eventReservation.findMany({
    where: { id_event: { in: eventIds } },
    include: {
      user: true,
      event: {
        include: {
          location: true,
        }
      },
      schedule: true,
    },
    orderBy: {
      created_at: 'desc',
    },
  });
};
