import { Router } from 'express';
import { getInsights, getPredictions, chat } from '../controllers/aiController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

router.get('/insights', getInsights);
router.get('/predictions', getPredictions);
router.post('/chat', chat);

export default router;