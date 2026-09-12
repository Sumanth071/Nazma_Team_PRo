import { Router } from 'express';
import {
  getCases,
  getCaseById,
  createCase,
  updateCase,
  deleteCase,
} from '../controllers/caseController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateJWT);

router.get('/', getCases);
router.get('/:id', getCaseById);
router.post('/', createCase);
router.put('/:id', updateCase);
router.delete('/:id', deleteCase);

export default router;
