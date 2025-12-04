
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const {
            search,
            minPrice,
            maxPrice,
            stock,
            sortBy,
            locationId,
            prestataireId
        } = req.query;

        // Build the where clause
        const where: any = {};

        // Search filter (name or description)
        if (search) {
            where.OR = [
                { name: { contains: String(search) } },
                { description: { contains: String(search) } }
            ];
        }

        // Price filter
        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) where.price.gte = Number(minPrice);
            if (maxPrice) where.price.lte = Number(maxPrice);
        }

        // Location filter (via Stock -> Service -> Location)
        if (locationId) {
            where.stock = {
                some: {
                    service: {
                        id_location: Number(locationId)
                    }
                }
            };
        }

        // Prestataire filter
        if (prestataireId) {
            where.id_prestataire = Number(prestataireId);
        }

        // Fetch products with stock relation
        const products = await prisma.product.findMany({
            where,
            include: {
                stock: {
                    include: {
                        service: true // Include service to check location if needed
                    }
                }
            }
        });

        // Post-processing for Stock Filter and Sorting (since stock is aggregated or dependent on location)
        let processedProducts = products.map((product: any) => {
            // Calculate effective stock
            let effectiveStock = 0;

            if (locationId) {
                // Sum stock only for the specific location
                effectiveStock = product.stock
                    .filter((s: any) => s.service.id_location === Number(locationId))
                    .reduce((sum: number, s: any) => sum + s.stock, 0);
            } else {
                // Sum all stock
                effectiveStock = product.stock.reduce((sum: number, s: any) => sum + s.stock, 0);
            }

            return {
                ...product,
                stock: effectiveStock, // Replace the relation array with the number
                price: Number(product.price) // Ensure price is number
            };
        });

        // Stock Filter
        if (stock) {
            if (stock === 'in-stock') {
                processedProducts = processedProducts.filter((p: any) => p.stock > 0);
            } else if (stock === 'out-of-stock') {
                processedProducts = processedProducts.filter((p: any) => p.stock === 0);
            }
        }

        // Sorting
        if (sortBy) {
            processedProducts.sort((a: any, b: any) => {
                switch (sortBy) {
                    case 'name-asc': return a.name.localeCompare(b.name);
                    case 'name-desc': return b.name.localeCompare(a.name);
                    case 'price-asc': return a.price - b.price;
                    case 'price-desc': return b.price - a.price;
                    case 'stock-asc': return a.stock - b.stock;
                    case 'stock-desc': return b.stock - a.stock;
                    default: return 0;
                }
            });
        }

        const mappedProducts = processedProducts.map((p: any) => ({
            id: p.id_product,
            name: p.name,
            stock: p.stock,
            locationId: (() => {
                if (locationId) {
                    return Number(locationId);
                }
                return 0;
            })(),
            description: p.description,
            imageUrl: p.image,
            price: p.price,
            id_prestataire: p.id_prestataire 
        }));

        res.json(mappedProducts);

    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};
