import { Router } from 'express';
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from '../controllers/product.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { checkRole } from '../middleware/role.middleware.js';
import { checkProductOwnership, checkPrestataireMatch } from '../middleware/location.middleware.js';

const router = Router();

/**
 * GET /products
 * Liste tous les produits (public).
 */
router.get('/', getAllProducts);

/**
 * GET /products/:id
 * Récupère un produit par ID (public).
 */
router.get('/:id', getProductById);

/**
 * POST /products
 * Crée un produit. Réservé aux prestataires.
 */
router.post('/', authenticateToken, checkRole(['prestataire', 'admin']), checkPrestataireMatch, createProduct);

/**
 * PUT /products/:id
 * Modifie un produit. Réservé au prestataire propriétaire.
 */
router.put('/:id', authenticateToken, checkRole(['prestataire', 'admin']), checkProductOwnership, updateProduct);

/**
 * DELETE /products/:id
 * Supprime un produit. Réservé au prestataire propriétaire.
 */
router.delete('/:id', authenticateToken, checkRole(['prestataire', 'admin']), checkProductOwnership, deleteProduct);

export default router;
