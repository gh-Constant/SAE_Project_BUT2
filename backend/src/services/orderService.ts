import prisma from '../prisma.js';
import qrcodeService from './qrcodeService.js';

interface CreateOrderItemDTO {
    productId: number;
    quantity: number;
    price: number;
}

interface CreateOrderDTO {
    userId: number;
    locationId: number;
    items: CreateOrderItemDTO[];
}

const createOrder = async (data: CreateOrderDTO) => {
    const { userId, locationId: _locationId, items } = data;

    // Calculate total price
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Get prestataire ID from the first item 
    let _id_prestataire = 0;
    if (items.length > 0) {
        const firstProduct = await prisma.product.findUnique({
            where: { id_product: items[0].productId },
            select: { id_prestataire: true }
        });
        if (firstProduct) {
            _id_prestataire = firstProduct.id_prestataire;
        }
    }
    console.log('Order Details - Provider:', _id_prestataire);

    // Use transaction to ensure order and lines are created together
    return prisma.$transaction(async (tx) => {
        // Create the order
        const commande = await tx.commande.create({
            data: {
                id_user: userId,
                total_price: totalPrice,
                date_commande: new Date(),
                etat_commande: 'waiting'
            }
        });

        // Create order lines
        for (const item of items) {
            await tx.ligneCommande.create({
                data: {
                    id_commande: commande.id_commande,
                    id_product: item.productId,
                    quantite: item.quantity,
                    price: item.price
                }
            });
        }

        return commande;
    });
};

/**
 * Pay an order and generate a QR code for it
 */
const payOrder = async (orderId: number, userId: number) => {
    return prisma.$transaction(async (tx) => {
        // Find the order
        const commande = await tx.commande.findUnique({
            where: { id_commande: orderId },
            include: { lignesCommande: true }
        });

        if (!commande) {
            throw new Error('Order not found');
        }

        if (commande.id_user !== userId) {
            throw new Error('Unauthorized');
        }

        if (commande.etat_commande !== 'waiting') {
            throw new Error('Order already processed');
        }

        // Update order status to payed
        const updated = await tx.commande.update({
            where: { id_commande: orderId },
            data: { etat_commande: 'payed' }
        });

        // Generate QR code with order data
        const qrSession = await qrcodeService.generate({
            createdById: userId,
            data: {
                orderId: commande.id_commande,
                userId: commande.id_user,
                totalPrice: Number(commande.total_price),
                items: commande.lignesCommande.map(l => ({
                    productId: l.id_product,
                    quantity: l.quantite,
                    price: Number(l.price)
                }))
            }
        });

        return { order: updated, qrToken: qrSession.token };
    });
};

export default {
    createOrder,
    payOrder
};
