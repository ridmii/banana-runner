import { Router } from 'express';
import { saveScore, stats } from '../controllers/game.controller.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();
router.post('/score', requireAuth, saveScore);
router.get('/stats', stats);
export default router;
