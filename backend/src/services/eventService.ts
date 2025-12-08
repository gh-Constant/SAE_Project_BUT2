import prisma from '../prisma.js';
import { ReservationStatus, Prisma } from '@prisma/client';

interface EventData {
  title: string;
  description?: string;
  start_time: Date | string;
  end_time: Date | string;
  price: number;
  capacity: number;
  id_location: number;
}


export const createEvent = async (data: EventData) => {
  return await prisma.event.create({
    data: {
      title: data.title,
      description: data.description,
      start_time: new Date(data.start_time),
      end_time: new Date(data.end_time),
      price: data.price,
      capacity: data.capacity,
      id_location: data.id_location,
    },
  });
};

export const getEvents = async (id_location?: number) => {
  if (!id_location) {
    return await prisma.event.findMany({
      include: {
        location: true,
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
    },
    orderBy: {
      start_time: 'asc',
    },
  });
};

export const getEventById = async (id: number) => {
  return await prisma.event.findUnique({
    where: { id_event: id }
  });
};

export const updateEvent = async (id: number, data: EventData) => {
  const updateData: any = { data };
  if (data.start_time) updateData.start_time = new Date(data.start_time);
  if (data.end_time) updateData.end_time = new Date(data.end_time);

  return await prisma.event.update({
    where: { id_event: id },
    data: updateData,
  });
};

export const deleteEvent = async (id: number) => {
  return await prisma.event.delete({
    where: { id_event: id },
  });
};

export const bookEvent = async (userId: number, eventId: number, quantity: number) => {
  // Start a transaction to ensure atomicity
  return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const event = await tx.event.findUnique({
      where: { id_event: eventId },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    if (event.sold + quantity > event.capacity) {
      throw new Error('Not enough capacity');
    }

    // Update sold count
    await tx.event.update({
      where: { id_event: eventId },
      data: {
        sold: {
          increment: quantity,
        },
      },
    });

    // Create reservation
    const reservation = await tx.eventReservation.create({
      data: {
        id_user: userId,
        id_event: eventId,
        quantity,
        total_price: Number(event.price) * quantity,
        status: ReservationStatus.CONFIRMED, // Auto-confirm for now
      },
    });

    return reservation;
  });
};

export const getUserReservations = async (userId: number) => {
  return await prisma.eventReservation.findMany({
    where: { id_user: userId },
    include: {
      event: {
        include: {
          location: true,
        },
      },
    },
    orderBy: {
      created_at: 'desc',
    },
  });
};
