import { Router } from 'express';
import aiRoutes from './ai.routes';
import authRoutes from './auth.routes';
import ticketsRoutes from './tickets.routes';

const router = Router();

router.use('/ai', aiRoutes);
router.use('/auth', authRoutes);
router.use('/tickets', ticketsRoutes);

export default router;
