import { Router } from 'express';
import { listUsers, deleteUser, adminStats, setUserRole, deleteScore } from '../controllers/admin.controller.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

// All admin routes require auth and admin role
router.get('/users', requireAuth, requireRole('admin'), listUsers);
router.post('/users/:userId/role', requireAuth, requireRole('admin'), setUserRole);
router.delete('/users/:id', requireAuth, requireRole('admin'), deleteUser);
router.delete('/scores/:scoreId', requireAuth, requireRole('admin'), deleteScore);
router.get('/stats', requireAuth, requireRole('admin'), adminStats);

export default router;
