import { Router } from 'express';
import { 
  listTickets, 
  getTicket, 
  create, 
  updateStatus, 
  assign, 
  verifyFix, 
  rate, 
  duplicates, 
  linkDuplicate, 
  recurrence, 
  notifications, 
  reset 
} from '../controllers/tickets.controller';

const router = Router();

router.get('/', listTickets);
router.post('/', create);
router.get('/data/duplicates', duplicates);
router.post('/data/duplicates/link', linkDuplicate);
router.get('/data/recurrence', recurrence);
router.get('/data/notifications', notifications);
router.post('/data/reset', reset);

router.get('/:id', getTicket);
router.patch('/:id/status', updateStatus);
router.patch('/:id/assign', assign);
router.post('/:id/verify-fix', verifyFix);
router.post('/:id/rate', rate);

export default router;
