import { Router } from 'express';
import { getDashboardStats, getPredictionAnalytics } from '../controllers/analyticsController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateJWT);

router.get('/dashboard', getDashboardStats);
router.get('/predictions', getPredictionAnalytics);

export default router;
