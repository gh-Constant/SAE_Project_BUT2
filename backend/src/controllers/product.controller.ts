import { Request, Response } from 'express';
import productService, { ProductQueryOptions } from '../services/productService.js';

// Interface pour les produits retournés par le service
interface ProcessedProduct {
    id_product: number;
    name: string;
    description?: string | null;
    price: number;
    image?: string | null;
    id_prestataire: number;
    stock: number;
    locationId?: number;
}

export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const options: ProductQueryOptions = {
            search: req.query.search as string,
            minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
            maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
            stock: req.query.stock as 'in-stock' | 'out-of-stock',
            sortBy: req.query.sortBy as ProductQueryOptions['sortBy'],
            locationId: req.query.locationId ? Number(req.query.locationId) : undefined,
            prestataireId: req.query.prestataireId ? Number(req.query.prestataireId) : undefined
        };

        const products = await productService.getAllProducts(options);

        // Map to frontend expected format
        const mappedProducts = products.map((p: ProcessedProduct) => ({
            id: p.id_product,
            name: p.name,
            stock: p.stock,
            locationId: p.locationId || options.locationId || 0,
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

export const getProductById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid product ID' });
        }

        const product = await productService.getProductById(id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        return res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        return res.status(500).json({ error: 'Failed to fetch product' });
    }
};

export const createProduct = async (req: Request, res: Response) => {
    try {
        const { name, description, price, image, id_prestataire, locationId, stock } = req.body;

        console.log('Received createProduct request:', req.body);

        // Basic validation
        if (!name || price === undefined || !id_prestataire) {
            console.error('Missing required fields:', { name, price, id_prestataire });
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const newProduct = await productService.createProduct({
            name,
            description,
            price: Number(price),
            image,
            id_prestataire: Number(id_prestataire),
            locationId: locationId ? Number(locationId) : undefined,
            stock: stock ? Number(stock) : undefined
        });

        const mappedProduct = {
            id: newProduct.id_product,
            name: newProduct.name,
            stock: stock ? Number(stock) : 0,
            locationId: locationId ? Number(locationId) : 0,
            description: newProduct.description,
            imageUrl: newProduct.image,
            price: Number(newProduct.price),
            id_prestataire: newProduct.id_prestataire
        };

        return res.status(201).json(mappedProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        return res.status(500).json({ error: 'Failed to create product' });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid product ID' });
        }

        const updatedProduct = await productService.updateProduct(id, req.body);
        return res.json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        return res.status(500).json({ error: 'Failed to update product' });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid product ID' });
        }

        await productService.deleteProduct(id);
        return res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        return res.status(500).json({ error: 'Failed to delete product' });
    }
};
