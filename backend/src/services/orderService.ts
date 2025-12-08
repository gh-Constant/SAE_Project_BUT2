import prisma from '../prisma.js';

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

    // Get prestataire ID from the first item (assuming all items in a location order belong to the same provider due to frontend logic)
    // We need to fetch the product to get the prestataire ID if it's not passed, 
    // but the frontend cart groups by location which implicitly groups by provider usually.
    // However, to be safe, we should probably look up the prestataire from one of the products
    // or pass it from the frontend.
    // Looking at the frontend cart logic: 
    // const id_prestataire = items[0]?.id_prestataire || 0
    // So the frontend *knows* the prestataire ID. We should probably pass it or look it up.
    // For now, let's look it up from the first product to be secure.

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
                // Note: Commande model in shop.prisma does NOT have locationId or prestataireId directly visible in the schema I viewed earlier?
                // limit check:
                // model Commande {
                //   id_commande      Int       @id @default(autoincrement())
                //   ...
                //   id_user          Int
                //   etat_commande    EtatCommande @default(waiting)
                //   lignesCommande LigneCommande[]
                // }
                // It seems Commande ONLY links to User. The location/provider context is in the lines or implicit?
                // Wait, the frontend mock includes id_prestataire and id_location in CommandeMock.
                // Let me re-read the schema provided in step 541 carefully.
                // Line 28: model Commande ...
                // Line 37: id_user Int
                // It DOES NOT have locationId or id_prestataire.
                // This means the Current Logic in Frontend Mock (which puts id_location on Order) 
                // DOES NOT MATCH the backend schema.

                // However, we must proceed. We will create the order with what we have.
                // If the schema is missing fields, we might need to update it, but I am restricted to code edits.
                // I will create the order linked to User, and the items linked to Order + Product.
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

export default {
    createOrder
};
