import { Router } from 'express';
import { register, login, logout, me } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', requireAuth, me);
export default router;
