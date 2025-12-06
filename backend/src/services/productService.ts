/**
 * @file productService.ts
 * @description Service for managing product-related operations.
 */

// import { PrismaClient } from '@prisma/client';
import prisma from '../prisma.js';

/**
 * Filter and sort options for fetching products.
 */
export interface ProductQueryOptions {
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    stock?: 'in-stock' | 'out-of-stock';
    sortBy?: 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'stock-asc' | 'stock-desc';
    locationId?: number;
    prestataireId?: number;
}

/**
 * Interface for creating a product.
 */
export interface CreateProductDTO {
    name: string;
    description?: string;
    price: number;
    image?: string;
    id_prestataire: number;
}

/**
 * Interface for updating a product.
 */
export interface UpdateProductDTO {
    name?: string;
    description?: string;
    price?: number;
    image?: string;
    stock?: number; // Might need special handling if stock is relational
}

const productService = {

    /**
     * Fetch all products based on filter options.
     */
    async getAllProducts(options: ProductQueryOptions) {
        const {
            search,
            minPrice,
            maxPrice,
            stock,
            sortBy,
            locationId,
            prestataireId
        } = options;

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

        // Post-processing for Stock Filter and Sorting
        let processedProducts = products.map((product) => {
            // Calculate effective stock
            let effectiveStock = 0;

            // LOGGING FOR DEBUG
            // console.log(`Processing product ${product.id_product} (${product.name}): Stock entries: ${product.stock.length}`);
            product.stock.forEach((s, i) => {
                // console.log(`  Stock[${i}]: serviceId=${s.id_service}, locId=${s.service?.id_location}, stock=${s.stock}`);
            });

            if (locationId) {
                // Sum stock only for the specific location
                effectiveStock = product.stock
                    .filter((s) => s.service.id_location === Number(locationId))
                    .reduce((sum, s) => sum + s.stock, 0);
            } else {
                // Sum all stock
                effectiveStock = product.stock.reduce((sum, s) => sum + s.stock, 0);
            }

            // Determine locationId from stock if available
            const firstStock = product.stock[0];
            const locationIdFromStock = firstStock?.service?.id_location;

            console.log(`Product ${product.id_product} resolved locationId: ${locationIdFromStock} (from stock[0] service location)`);

            return {
                ...product,
                stock: effectiveStock,
                price: Number(product.price),
                locationId: locationIdFromStock
            };
        });

        // Stock Filter
        if (stock) {
            if (stock === 'in-stock') {
                processedProducts = processedProducts.filter((p) => p.stock > 0);
            } else if (stock === 'out-of-stock') {
                processedProducts = processedProducts.filter((p) => p.stock === 0);
            }
        }

        // Sorting
        if (sortBy) {
            processedProducts.sort((a, b) => {
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

        return processedProducts;
    },

    /**
     * Get a single product by ID.
     */
    async getProductById(id: number) {
        const product = await prisma.product.findUnique({
            where: { id_product: id },
            include: {
                stock: {
                    include: {
                        service: true
                    }
                },
                prestataire: {
                    select: {
                        id_user: true,
                        firstname: true,
                        lastname: true,
                        email: true
                    }
                }
            }
        });

        if (!product) return null;

        // Calculate total stock
        const totalStock = product.stock.reduce((sum, s) => sum + s.stock, 0);

        return {
            ...product,
            price: Number(product.price),
            stock: totalStock
        };
    },

    /**
     * Create a new product.
     */
    async createProduct(data: CreateProductDTO & { locationId?: number; stock?: number }) {
        const product = await prisma.product.create({
            data: {
                name: data.name,
                description: data.description,
                price: data.price,
                image: data.image,
                id_prestataire: data.id_prestataire
            }
        });

        if (data.locationId && data.stock !== undefined) {
            // Find the shop service for this location (Assuming Service Type 1 is Shop)
            let service = await prisma.service.findFirst({
                where: {
                    id_location: data.locationId,
                    id_service_type: 1
                }
            });

            // If no shop service exists for this location, create one
            if (!service) {
                service = await prisma.service.create({
                    data: {
                        name: 'Boutique',
                        description: 'Échoppe automatique',
                        id_service_type: 1,
                        id_location: data.locationId,
                        id_prestataire: data.id_prestataire
                    }
                });
            }

            if (service) {
                await prisma.stock.create({
                    data: {
                        id_product: product.id_product,
                        id_service: service.id_service,
                        stock: data.stock
                    }
                });
            }
        }

        return product;
    },

    /**
     * Update an existing product.
     */
    async updateProduct(id: number, data: UpdateProductDTO) {
        return prisma.product.update({
            where: { id_product: id },
            data: {
                name: data.name,
                description: data.description,
                price: data.price,
                image: data.image
            }
        });
    },

    /**
     * Delete a product.
     */
    async deleteProduct(id: number) {
        // Find existing product to ensure it exists
        const exists = await prisma.product.findUnique({ where: { id_product: id } });
        if (!exists) throw new Error("Product not found");

        // Delete dependencies if any (stock, etc.) - Prisma Cascade might handle this depending on schema
        // For safety, proceed to delete product
        return prisma.product.delete({
            where: { id_product: id }
        });
    }
};

export default productService;
