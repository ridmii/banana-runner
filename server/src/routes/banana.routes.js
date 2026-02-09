import { Router } from 'express';
import { getBanana, getBananaTypes } from '../controllers/banana.controller.js';

const router = Router();
router.get('/', getBanana);
router.get('/types', getBananaTypes);
export default router;
