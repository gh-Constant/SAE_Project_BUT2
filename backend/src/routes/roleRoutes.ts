import express from 'express';
import { roleController } from '../controllers/roleController.js';

const router = express.Router();

// Route to get all roles
router.get('/roles', roleController.getAllRoles);

export default router;