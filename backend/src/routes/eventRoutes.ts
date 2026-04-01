import { Router } from 'express';
import { eventController } from '../controllers/eventController.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { validateEventData, validateBookingData } from '../middleware/event.middleware.js';
import { checkRole } from '../middleware/role.middleware.js';
import { Role } from '../prisma.js';

const router = Router();

router.post('/', authenticateToken, checkRole([Role.prestataire, Role.admin]), validateEventData, eventController.createEvent);
router.get('/', eventController.getEvents);
router.get('/user/reservations', authenticateToken, eventController.getUserReservations); // Specific route before :id
router.get('/provider/reservations', authenticateToken, checkRole([Role.prestataire, Role.admin]), eventController.getProviderReservations);
router.get('/:id', eventController.getEventById);
router.put('/:id', authenticateToken, checkRole([Role.prestataire, Role.admin]), eventController.updateEvent);
router.delete('/:id', authenticateToken, checkRole([Role.prestataire, Role.admin]), eventController.deleteEvent);
router.get('/:id/reservations', authenticateToken, checkRole([Role.prestataire, Role.admin]), eventController.getEventReservations);
router.post('/book', authenticateToken, validateBookingData, eventController.bookEvent);

router.post('/:id/schedules', authenticateToken, checkRole([Role.prestataire, Role.admin]), eventController.addSchedule);
router.put('/schedules/:id', authenticateToken, checkRole([Role.prestataire, Role.admin]), eventController.updateSchedule);
router.delete('/schedules/:id', authenticateToken, checkRole([Role.prestataire, Role.admin]), eventController.deleteSchedule);

export default router;
