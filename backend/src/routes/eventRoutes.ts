import { Router } from 'express';
import { eventController } from '../controllers/eventController.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { validateEventData, validateBookingData } from '../middleware/event.middleware.js';

const router = Router();

router.post('/', authenticateToken, validateEventData, eventController.createEvent);
router.get('/', eventController.getEvents);
router.get('/user/reservations', authenticateToken, eventController.getUserReservations); // Specific route before :id
router.get('/:id', eventController.getEventById);
router.put('/:id', authenticateToken, eventController.updateEvent);
router.delete('/:id', authenticateToken, eventController.deleteEvent);
router.post('/book', authenticateToken, validateBookingData, eventController.bookEvent);

export default router;
