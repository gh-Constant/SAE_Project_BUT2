import prisma from '../prisma.js';
import { ReservationStatus } from '@prisma/client';

interface ReservationSeed {
  id_reservation: number;
  quantity: number;
  total_price: number;
  status: ReservationStatus;
  id_user: number;
  id_event: number;
}

const RESERVATION_SEEDS: ReservationSeed[] = [
  { id_reservation: 1, quantity: 2, total_price: 24000, status: 'CONFIRMED' as ReservationStatus, id_user: 2, id_event: 1 },
  { id_reservation: 2, quantity: 1, total_price: 1500, status: 'CONFIRMED' as ReservationStatus, id_user: 11, id_event: 2 },
  { id_reservation: 3, quantity: 2, total_price: 3000, status: 'PENDING' as ReservationStatus, id_user: 12, id_event: 2 },
  { id_reservation: 4, quantity: 1, total_price: 1800, status: 'CONFIRMED' as ReservationStatus, id_user: 2, id_event: 3 },
  { id_reservation: 5, quantity: 1, total_price: 1800, status: 'CONFIRMED' as ReservationStatus, id_user: 13, id_event: 3 },
  { id_reservation: 6, quantity: 1, total_price: 900, status: 'CANCELLED' as ReservationStatus, id_user: 14, id_event: 4 },
  { id_reservation: 7, quantity: 2, total_price: 1200, status: 'CONFIRMED' as ReservationStatus, id_user: 15, id_event: 5 },
  { id_reservation: 8, quantity: 3, total_price: 900, status: 'PENDING' as ReservationStatus, id_user: 5, id_event: 6 },
  { id_reservation: 9, quantity: 1, total_price: 900, status: 'CONFIRMED' as ReservationStatus, id_user: 6, id_event: 4 },
  { id_reservation: 10, quantity: 4, total_price: 1200, status: 'CONFIRMED' as ReservationStatus, id_user: 7, id_event: 6 },
  { id_reservation: 11, quantity: 1, total_price: 600, status: 'CONFIRMED' as ReservationStatus, id_user: 8, id_event: 5 }
];

export async function seedReservations() {
  console.log('Seeding reservations...');

  for (const reservation of RESERVATION_SEEDS) {
    await prisma.eventReservation.upsert({
      where: { id_reservation: reservation.id_reservation },
      update: reservation,
      create: reservation,
    });
  }

  console.log('Reservations seeded');
}

