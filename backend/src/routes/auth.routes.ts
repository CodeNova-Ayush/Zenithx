import { Router } from 'express';
import { login, signup, logout, me, forgotPassword } from '../controllers/auth.controller';

const router = Router();

router.post('/login', login);
router.post('/signup', signup);
router.post('/logout', logout);
router.get('/me', me);
router.post('/forgot-password', forgotPassword);

export default router;
