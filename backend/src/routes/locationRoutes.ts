
import { Router } from 'express';
import { getAllLocations, getLocationById, updateLocation } from '../controllers/location.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { checkLocationAvailable } from '../middleware/location.middleware.js';

const router = Router();

// Public routes
router.get('/', getAllLocations);
router.get('/:id', getLocationById);

// Protected routes - require authentication and location must be available
router.patch('/:id', authenticateToken, checkLocationAvailable, updateLocation);

export default router;
