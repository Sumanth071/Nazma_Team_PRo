import { Router } from 'express';
import { generateReport, getReports, downloadReportPdf } from '../controllers/reportController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateJWT);

router.post('/', generateReport);
router.get('/', getReports);
router.get('/:id/download', downloadReportPdf);

export default router;
