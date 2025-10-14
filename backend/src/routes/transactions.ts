import { Router } from 'express';
import {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getAnalytics
} from '../controllers/transactionController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

router.post('/', createTransaction);
router.get('/', getTransactions);
router.get('/analytics', getAnalytics);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

export default router;