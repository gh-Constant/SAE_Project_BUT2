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

router.post('/:id/schedules', authenticateToken, eventController.addSchedule);
router.put('/schedules/:id', authenticateToken, eventController.updateSchedule);
router.delete('/schedules/:id', authenticateToken, eventController.deleteSchedule);

export default router;
