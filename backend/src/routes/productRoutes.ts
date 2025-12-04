import { Router } from 'express';
import { getAllProducts } from '../controllers/product.controller.js';

const router = Router();

/**
 * GET /products
 * Retrieve all products with optional filtering and sorting.
 */
router.get('/', getAllProducts);

export default router;
