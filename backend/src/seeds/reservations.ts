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
  // === Event 4: Dégustation d'Hydromel (Price: 5) ===
  {
    id_reservation: 1,
    quantity: 2,
    total_price: 10.00,
    status: 'CONFIRMED' as ReservationStatus,
    id_user: 2, // Alice
    id_event: 4,
  },
  {
    id_reservation: 2,
    quantity: 5,
    total_price: 25.00,
    status: 'CONFIRMED' as ReservationStatus,
    id_user: 11, // Lucas
    id_event: 4,
  },
  {
    id_reservation: 3,
    quantity: 1,
    total_price: 5.00,
    status: 'PENDING' as ReservationStatus,
    id_user: 12, // Sophie
    id_event: 4,
  },

  // === Event 5: Cours de Tir à l'Arc (Price: 15) ===
  {
    id_reservation: 4,
    quantity: 1,
    total_price: 15.00,
    status: 'CONFIRMED' as ReservationStatus,
    id_user: 2, // Alice
    id_event: 5,
  },
  {
    id_reservation: 5,
    quantity: 1,
    total_price: 15.00,
    status: 'CONFIRMED' as ReservationStatus,
    id_user: 13, // Antoine
    id_event: 5,
  },
  {
    id_reservation: 6,
    quantity: 1,
    total_price: 15.00,
    status: 'CANCELLED' as ReservationStatus,
    id_user: 14, // Clara
    id_event: 5,
  },

  // === Event 6: Concours de Costume (Price: 2) ===
  {
    id_reservation: 7,
    quantity: 1,
    total_price: 2.00,
    status: 'CONFIRMED' as ReservationStatus,
    id_user: 15, // Marc
    id_event: 6,
  },
  {
    id_reservation: 8,
    quantity: 3,
    total_price: 6.00,
    status: 'PENDING' as ReservationStatus,
    id_user: 5, // Pierre
    id_event: 6,
  },
  {
    id_reservation: 9,
    quantity: 1,
    total_price: 2.00,
    status: 'CONFIRMED' as ReservationStatus,
    id_user: 6, // Jacques
    id_event: 6,
  },

  // === Event 1: Grand Tournoi (Price: 50) ===
  {
    id_reservation: 10,
    quantity: 2,
    total_price: 100.00,
    status: 'CONFIRMED' as ReservationStatus,
    id_user: 3, // Godefroy (Admin/Sénéchal attending?)
    id_event: 1,
  },
  {
    id_reservation: 11,
    quantity: 4,
    total_price: 200.00,
    status: 'CONFIRMED' as ReservationStatus,
    id_user: 7, // Thomas
    id_event: 1,
  },
];

export async function seedReservations() {
  console.log(' Seeding reservations...');

  for (const reservation of RESERVATION_SEEDS) {
    await prisma.eventReservation.upsert({
      where: { id_reservation: reservation.id_reservation },
      update: {
        quantity: reservation.quantity,
        total_price: reservation.total_price,
        status: reservation.status,
        id_user: reservation.id_user,
        id_event: reservation.id_event,
      },
      create: {
        id_reservation: reservation.id_reservation,
        quantity: reservation.quantity,
        total_price: reservation.total_price,
        status: reservation.status,
        id_user: reservation.id_user,
        id_event: reservation.id_event,
      },
    });
  }

  console.log('✅ Reservations seeded');
}
