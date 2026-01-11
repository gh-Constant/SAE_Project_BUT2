import prisma from '../prisma.js';
import { EtatCommande } from '@prisma/client';

// Helper pour créer des dates pendant le festival (20/06/2026 - 05/07/2026)
const daysAgo = (dayOffset: number): Date => {
    const festivalStart = new Date('2026-06-20T10:00:00');
    const date = new Date(festivalStart);
    date.setDate(festivalStart.getDate() + dayOffset);
    return date;
};

interface OrderSeed {
    id_commande: number;
    date_commande: Date;
    date_collect?: Date;
    total_price: number;
    id_user: number;
    etat_commande: EtatCommande;
}

interface OrderLineSeed {
    id_commande: number;
    id_product: number;
    quantite: number;
    price: number;
}

// 27 orders matching frontend mock data
const ORDER_SEEDS: OrderSeed[] = [
    // === Commandes PAYED (environ 40%) ===
    {
        id_commande: 1,
        date_commande: daysAgo(1),
        total_price: 47.00,
        id_user: 2,
        etat_commande: 'payed' as EtatCommande,
    },
    {
        id_commande: 2,
        date_commande: daysAgo(3),
        total_price: 29.00,
        id_user: 2,
        etat_commande: 'payed' as EtatCommande,
    },
    {
        id_commande: 3,
        date_commande: daysAgo(5),
        total_price: 77.50,
        id_user: 2,
        etat_commande: 'payed' as EtatCommande,
    },
    {
        id_commande: 4,
        date_commande: daysAgo(7),
        total_price: 12.00,
        id_user: 2,
        etat_commande: 'payed' as EtatCommande,
    },
    {
        id_commande: 5,
        date_commande: daysAgo(10),
        total_price: 95.00,
        id_user: 2,
        etat_commande: 'payed' as EtatCommande,
    },
    {
        id_commande: 6,
        date_commande: daysAgo(12),
        total_price: 22.00,
        id_user: 2,
        etat_commande: 'payed' as EtatCommande,
    },
    {
        id_commande: 7,
        date_commande: daysAgo(15),
        total_price: 157.00,
        id_user: 2,
        etat_commande: 'payed' as EtatCommande,
    },

    // === Commandes COLLECTED (environ 30%) ===
    {
        id_commande: 8,
        date_commande: daysAgo(2),
        date_collect: daysAgo(1),
        total_price: 35.50,
        id_user: 2,
        etat_commande: 'collected' as EtatCommande,
    },
    {
        id_commande: 9,
        date_commande: daysAgo(8),
        date_collect: daysAgo(7),
        total_price: 68.90,
        id_user: 2,
        etat_commande: 'collected' as EtatCommande,
    },
    {
        id_commande: 10,
        date_commande: daysAgo(14),
        date_collect: daysAgo(12),
        total_price: 110.00,
        id_user: 2,
        etat_commande: 'collected' as EtatCommande,
    },
    {
        id_commande: 11,
        date_commande: daysAgo(20),
        date_collect: daysAgo(18),
        total_price: 45.00,
        id_user: 2,
        etat_commande: 'collected' as EtatCommande,
    },
    {
        id_commande: 12,
        date_commande: daysAgo(25),
        date_collect: daysAgo(23),
        total_price: 8.50,
        id_user: 2,
        etat_commande: 'collected' as EtatCommande,
    },

    // === Commandes WAITING (environ 30%) ===
    {
        id_commande: 13,
        date_commande: daysAgo(0),
        total_price: 25.50,
        id_user: 2,
        etat_commande: 'waiting' as EtatCommande,
    },
    {
        id_commande: 14,
        date_commande: daysAgo(1),
        total_price: 7.00,
        id_user: 2,
        etat_commande: 'waiting' as EtatCommande,
    },
    {
        id_commande: 15,
        date_commande: daysAgo(2),
        total_price: 37.80,
        id_user: 2,
        etat_commande: 'waiting' as EtatCommande,
    },
    {
        id_commande: 16,
        date_commande: daysAgo(4),
        total_price: 55.00,
        id_user: 2,
        etat_commande: 'waiting' as EtatCommande,
    },
    {
        id_commande: 17,
        date_commande: daysAgo(6),
        total_price: 125.00,
        id_user: 2,
        etat_commande: 'waiting' as EtatCommande,
    },
    {
        id_commande: 18,
        date_commande: daysAgo(9),
        total_price: 18.90,
        id_user: 2,
        etat_commande: 'waiting' as EtatCommande,
    },

    // === Commandes New Adventurers ===
    {
        id_commande: 19,
        date_commande: daysAgo(1),
        total_price: 30.00,
        id_user: 11, // Lucas
        etat_commande: 'payed' as EtatCommande,
    },
    {
        id_commande: 20,
        date_commande: daysAgo(0),
        total_price: 55.00,
        id_user: 11, // Lucas
        etat_commande: 'waiting' as EtatCommande,
    },
    {
        id_commande: 21,
        date_commande: daysAgo(2),
        date_collect: daysAgo(1),
        total_price: 8.50,
        id_user: 12, // Sophie
        etat_commande: 'collected' as EtatCommande,
    },
    {
        id_commande: 22,
        date_commande: daysAgo(5),
        total_price: 70.00,
        id_user: 13, // Antoine
        etat_commande: 'payed' as EtatCommande,
    },
    {
        id_commande: 23,
        date_commande: daysAgo(0),
        total_price: 35.00,
        id_user: 13, // Antoine
        etat_commande: 'waiting' as EtatCommande,
    },
    {
        id_commande: 24,
        date_commande: daysAgo(3),
        total_price: 25.50,
        id_user: 13, // Antoine
        etat_commande: 'payed' as EtatCommande,
    },
    {
        id_commande: 25,
        date_commande: daysAgo(4),
        date_collect: daysAgo(2),
        total_price: 45.00,
        id_user: 14, // Clara
        etat_commande: 'collected' as EtatCommande,
    },
    {
        id_commande: 26,
        date_commande: daysAgo(1),
        total_price: 51.00,
        id_user: 15, // Marc
        etat_commande: 'payed' as EtatCommande,
    },
    {
        id_commande: 27,
        date_commande: daysAgo(0),
        total_price: 22.00,
        id_user: 15, // Marc
        etat_commande: 'waiting' as EtatCommande,
    }
];

// Order lines matching frontend mock data
const ORDER_LINE_SEEDS: OrderLineSeed[] = [
    // Commande 1: Potion + Hydromel = 47.00€
    { id_commande: 1, id_product: 1, quantite: 1, price: 25.00 },
    { id_commande: 1, id_product: 6, quantite: 1, price: 22.00 },

    // Commande 2: Pain x2 + Hydromel = 29.00€
    { id_commande: 2, id_product: 2, quantite: 2, price: 3.50 },
    { id_commande: 2, id_product: 6, quantite: 1, price: 22.00 },

    // Commande 3: Potion + Bouclier + Pain + Chandelle = 72.50€
    { id_commande: 3, id_product: 1, quantite: 1, price: 25.50 },
    { id_commande: 3, id_product: 5, quantite: 1, price: 35.00 },
    { id_commande: 3, id_product: 2, quantite: 1, price: 3.50 },
    { id_commande: 3, id_product: 7, quantite: 1, price: 8.50 },

    // Commande 4: Épée en bois = 12.00€
    { id_commande: 4, id_product: 4, quantite: 1, price: 12.00 },

    // Commande 5: Tunique + Arc = 100.00€
    { id_commande: 5, id_product: 8, quantite: 1, price: 45.00 },
    { id_commande: 5, id_product: 9, quantite: 1, price: 55.00 },

    // Commande 6: Hydromel = 22.00€
    { id_commande: 6, id_product: 6, quantite: 1, price: 22.00 },

    // Commande 7: Tunique x3 + Chandelle x2 = 152.00€
    { id_commande: 7, id_product: 8, quantite: 3, price: 45.00 },
    { id_commande: 7, id_product: 7, quantite: 2, price: 8.50 },

    // Commande 8: Bouclier = 35.00€
    { id_commande: 8, id_product: 5, quantite: 1, price: 35.00 },

    // Commande 9: Arc + Flèches = 70.00€
    { id_commande: 9, id_product: 9, quantite: 1, price: 55.00 },
    { id_commande: 9, id_product: 10, quantite: 1, price: 15.00 },

    // Commande 10: Arc x2 = 110.00€
    { id_commande: 10, id_product: 9, quantite: 2, price: 55.00 },

    // Commande 11: Tunique = 45.00€
    { id_commande: 11, id_product: 8, quantite: 1, price: 45.00 },

    // Commande 12: Chandelle = 8.50€
    { id_commande: 12, id_product: 7, quantite: 1, price: 8.50 },

    // Commande 13: Potion = 25.50€
    { id_commande: 13, id_product: 1, quantite: 1, price: 25.50 },

    // Commande 14: Pain x2 = 7.00€
    { id_commande: 14, id_product: 2, quantite: 2, price: 3.50 },

    // Commande 15: Jambon x2 = 37.80€
    { id_commande: 15, id_product: 3, quantite: 2, price: 18.90 },

    // Commande 16: Arc = 55.00€
    { id_commande: 16, id_product: 9, quantite: 1, price: 55.00 },

    // Commande 17: Arc x2 + Flèches = 125.00€
    { id_commande: 17, id_product: 9, quantite: 2, price: 55.00 },
    { id_commande: 17, id_product: 10, quantite: 1, price: 15.00 },

    // Commande 18: Jambon = 18.90€
    { id_commande: 18, id_product: 3, quantite: 1, price: 18.90 },

    // Order 19: Flèches x2 = 30.00
    { id_commande: 19, id_product: 10, quantite: 2, price: 15.00 },

    // Order 20: Arc = 55.00
    { id_commande: 20, id_product: 9, quantite: 1, price: 55.00 },

    // Order 21: Chandelle = 8.50
    { id_commande: 21, id_product: 7, quantite: 1, price: 8.50 },

    // Order 22: Arc + Flèches = 70.00
    { id_commande: 22, id_product: 9, quantite: 1, price: 55.00 },
    { id_commande: 22, id_product: 10, quantite: 1, price: 15.00 },

    // Order 23: Bouclier = 35.00
    { id_commande: 23, id_product: 5, quantite: 1, price: 35.00 },

    // Order 24: Potion = 25.50
    { id_commande: 24, id_product: 1, quantite: 1, price: 25.50 },

    // Order 25: Tunique = 45.00
    { id_commande: 25, id_product: 8, quantite: 1, price: 45.00 },

    // Order 26: Potion x2 = 51.00
    { id_commande: 26, id_product: 1, quantite: 2, price: 25.50 },

    // Order 27: Hydromel = 22.00
    { id_commande: 27, id_product: 6, quantite: 1, price: 22.00 }
];

export async function seedOrders() {
    console.log(' Seeding orders...');

    // Seed orders
    for (const order of ORDER_SEEDS) {
        await prisma.commande.upsert({
            where: { id_commande: order.id_commande },
            update: {
                date_commande: order.date_commande,
                date_collect: order.date_collect,
                total_price: order.total_price,
                id_user: order.id_user,
                etat_commande: order.etat_commande,
            },
            create: {
                id_commande: order.id_commande,
                date_commande: order.date_commande,
                date_collect: order.date_collect,
                total_price: order.total_price,
                id_user: order.id_user,
                etat_commande: order.etat_commande,
            },
        });
    }

    console.log(`✅ Seeded ${ORDER_SEEDS.length} orders`);

    // Seed order lines
    console.log(' Seeding order lines...');

    for (const line of ORDER_LINE_SEEDS) {
        await prisma.ligneCommande.upsert({
            where: {
                id_product_id_commande: {
                    id_product: line.id_product,
                    id_commande: line.id_commande,
                },
            },
            update: {
                quantite: line.quantite,
                price: line.price,
            },
            create: {
                id_commande: line.id_commande,
                id_product: line.id_product,
                quantite: line.quantite,
                price: line.price,
            },
        });
    }

    console.log(`✅ Seeded ${ORDER_LINE_SEEDS.length} order lines`);
}
