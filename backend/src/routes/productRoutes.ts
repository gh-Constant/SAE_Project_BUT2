import { Router } from 'express';
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from '../controllers/product.controller.js';

const router = Router();

/**
 * GET /products
 * Retrieve all products with optional filtering and sorting.
 */
router.get('/', getAllProducts);

/**
 * GET /products/:id
 * Retrieve a single product by ID.
 */
router.get('/:id', getProductById);

/**
 * POST /products
 * Create a new product.
 */
router.post('/', createProduct);

/**
 * PUT /products/:id
 * Update an existing product.
 */
router.put('/:id', updateProduct);

/**
 * DELETE /products/:id
 * Delete a product.
 */
router.delete('/:id', deleteProduct);

export default router;
