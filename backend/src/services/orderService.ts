import prisma from '../prisma.js';
import { Prisma } from '@prisma/client';
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

const mapOrderForFrontend = (commande: any) => {
    const lines = commande.lignesCommande ?? [];
    const firstProduct = lines[0]?.product;
    const firstLocationId = firstProduct?.stock?.[0]?.service?.id_location ?? 0;
    const firstPrestataireId = firstProduct?.id_prestataire ?? 0;

    return {
        id: commande.id_commande,
        date_commande: commande.date_commande,
        date_collect: commande.date_collect,
        total_price: Number(commande.total_price),
        id_user: commande.id_user,
        id_location: firstLocationId,
        id_prestataire: firstPrestataireId,
        etat_commande: commande.etat_commande === 'payed' ? 'paid' : commande.etat_commande,
        qrToken: commande.qrSession?.token,
        lignesCommande: lines.map((line: any) => ({
            id_product: line.id_product,
            quantite: line.quantite,
            price: Number(line.price),
            productName: line.product?.name ?? null,
        })),
    };
};

const getProductLocationId = (product: any, requestedLocationId: number) => {
    const matchingStock = product.stock.find((entry: any) => entry.service.id_location === requestedLocationId);
    return matchingStock?.service.id_location;
};

const createOrder = async (data: CreateOrderDTO) => {
    const { userId, locationId, items } = data;

    if (!Number.isInteger(locationId) || locationId <= 0) {
        throw new Error('Invalid location');
    }

    const productIds = items.map((item) => item.productId);
    const products = await prisma.product.findMany({
        where: {
            id_product: { in: productIds }
        },
        include: {
            stock: {
                include: {
                    service: true
                }
            }
        }
    });

    if (products.length !== productIds.length) {
        throw new Error('Product not found');
    }

    const productMap = new Map(products.map((product) => [product.id_product, product]));
    const providerIds = new Set<number>();
    let totalPrice = 0;

    // Use transaction to ensure order and lines are created together
    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const normalizedItems = items.map((item) => {
            const product = productMap.get(item.productId);
            if (!product) {
                throw new Error('Product not found');
            }

            if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
                throw new Error('Invalid quantity');
            }

            const locationForProduct = getProductLocationId(product, locationId);
            if (!locationForProduct) {
                throw new Error('Product does not belong to the selected location');
            }

            const availableStock = product.stock
                .filter((entry: any) => entry.service.id_location === locationId)
                .reduce((sum: number, entry: any) => sum + entry.stock, 0);

            if (availableStock < item.quantity) {
                throw new Error('Insufficient stock');
            }

            providerIds.add(product.id_prestataire);
            totalPrice += Number(product.price) * item.quantity;

            return {
                product,
                quantity: item.quantity,
                unitPrice: Number(product.price),
            };
        });

        if (providerIds.size !== 1) {
            throw new Error('Order must contain products from a single provider');
        }

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
        for (const item of normalizedItems) {
            const relevantStocks = item.product.stock.filter((entry: any) => entry.service.id_location === locationId);
            let remainingQuantity = item.quantity;

            for (const stockEntry of relevantStocks) {
                if (remainingQuantity <= 0) {
                    break;
                }

                const decrement = Math.min(stockEntry.stock, remainingQuantity);
                if (decrement <= 0) {
                    continue;
                }

                await tx.stock.update({
                    where: {
                        id_product_id_service: {
                            id_product: item.product.id_product,
                            id_service: stockEntry.id_service
                        }
                    },
                    data: {
                        stock: {
                            decrement
                        }
                    }
                });

                remainingQuantity -= decrement;
            }

            await tx.ligneCommande.create({
                data: {
                    id_commande: commande.id_commande,
                    id_product: item.product.id_product,
                    quantite: item.quantity,
                    price: item.unitPrice
                }
            });
        }

        const createdOrder = await tx.commande.findUnique({
            where: { id_commande: commande.id_commande },
            include: {
                lignesCommande: {
                    include: {
                        product: {
                            include: {
                                stock: {
                                    include: {
                                        service: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        return mapOrderForFrontend(createdOrder);
    });
};

/**
 * Pay an order and generate a QR code for it
 */
const payOrder = async (orderId: number, userId: number) => {
    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
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

        // Fetch user's gold balance to ensure they have enough
        const user = await tx.user.findUnique({
            where: { id_user: userId },
            select: { gold: true }
        });

        if (!user || user.gold < Number(commande.total_price)) {
            throw new Error('Not enough gold');
        }

        // Update user's gold
        await tx.user.update({
            where: { id_user: userId },
            data: { gold: user.gold - Number(commande.total_price) }
        });

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
                items: commande.lignesCommande.map((l: any) => ({
                    productId: l.id_product,
                    quantity: l.quantite,
                    price: Number(l.price)
                }))
            }
        });

        // Grant access to purchased blogs
        const blogProducts = await tx.product.findMany({
            where: {
                id_product: { in: commande.lignesCommande.map((l: any) => l.id_product) },
                is_blog: true
            }
        });

        for (const product of blogProducts) {
            if (product.id_blog) {
                // Ignore unique constraint error if user already has this blog somehow
                const exists = await tx.userBlog.findUnique({
                    where: { id_user_id_blog: { id_user: userId, id_blog: product.id_blog } }
                });
                if (!exists) {
                    await tx.userBlog.create({
                        data: {
                            id_user: userId,
                            id_blog: product.id_blog
                        }
                    });
                }
            }
        }

        return {
            order: {
                id: updated.id_commande,
                etat_commande: 'paid',
                date_commande: updated.date_commande,
                total_price: Number(updated.total_price)
            },
            qrToken: qrSession.token
        };
    });
};

const getUserOrders = async (userId: number) => {
    const orders = await prisma.commande.findMany({
        where: { id_user: userId },
        orderBy: { date_commande: 'desc' },
        include: {
            lignesCommande: {
                include: {
                    product: {
                        include: {
                            stock: {
                                include: {
                                    service: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    const orderIds = orders.map((order) => order.id_commande);
    const qrSessions = await prisma.qRSession.findMany();

    const qrByOrderId = new Map<number, string>();
    for (const session of qrSessions) {
        const orderId = Number((session.data as any)?.orderId);
        if (orderIds.includes(orderId) && session.status !== 'USED') {
            qrByOrderId.set(orderId, session.token);
        }
    }

    return orders.map((order) => {
        const mapped = mapOrderForFrontend(order);
        mapped.qrToken = qrByOrderId.get(order.id_commande) ?? mapped.qrToken;
        return mapped;
    });
};

const collectOrder = async (token: string, providerId: number) => {
    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const qrSession = await tx.qRSession.findUnique({
            where: { token }
        });

        if (!qrSession) {
            throw new Error('QR code not found');
        }

        if (qrSession.status === 'USED') {
            throw new Error('QR code already used');
        }

        const orderId = Number((qrSession.data as any)?.orderId);
        if (!orderId) {
            throw new Error('Order not found');
        }

        const commande = await tx.commande.findUnique({
            where: { id_commande: orderId },
            include: {
                lignesCommande: {
                    include: {
                        product: true
                    }
                }
            }
        });

        if (!commande) {
            throw new Error('Order not found');
        }

        if (commande.etat_commande !== 'payed') {
            throw new Error('Order not paid');
        }

        const ownsOrder = commande.lignesCommande.every((line) => line.product.id_prestataire === providerId);
        if (!ownsOrder) {
            throw new Error('Unauthorized');
        }

        const updatedOrder = await tx.commande.update({
            where: { id_commande: orderId },
            data: {
                etat_commande: 'collected',
                date_collect: new Date()
            },
            include: {
                lignesCommande: {
                    include: {
                        product: {
                            include: {
                                stock: {
                                    include: {
                                        service: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        await tx.qRSession.update({
            where: { id: qrSession.id },
            data: {
                status: 'USED',
                scanned_by_id: providerId,
                scanned_at: new Date()
            }
        });

        return mapOrderForFrontend(updatedOrder);
    });
};

export default {
    createOrder,
    payOrder,
    getUserOrders,
    collectOrder
};
