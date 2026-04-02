
import { Router } from 'express';
import {
  getAllLocations,
  getLocationById,
  updateLocation,
  purchaseLocation,
  validatePurchase,
  rejectPurchase,
  removeOwner,
  updateOwner,
  deleteLocation
} from '../controllers/location.controller.js';
import { authenticateToken, authorize } from '../middleware/auth.middleware.js';
import { checkLocationAvailable } from '../middleware/location.middleware.js';

const router = Router();

// Public routes
router.get('/', getAllLocations);
router.get('/:id', getLocationById);

// Protected routes
router.patch('/:id', authenticateToken, updateLocation);
router.post('/:id/purchase', authenticateToken, checkLocationAvailable, purchaseLocation);
router.post('/:id/validate', authenticateToken, authorize(['admin']), validatePurchase);
router.post('/:id/reject', authenticateToken, authorize(['admin']), rejectPurchase);
router.delete('/:id/owner', authenticateToken, authorize(['admin']), removeOwner);
router.put('/:id/owner', authenticateToken, authorize(['admin']), updateOwner);
router.delete('/:id', authenticateToken, authorize(['admin']), deleteLocation);

export default router;
