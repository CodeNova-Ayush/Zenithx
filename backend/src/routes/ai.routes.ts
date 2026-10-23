import { Router } from 'express';
import { analyzeComplaint, campusBrain, reviewResolution } from '../controllers/ai.controller';

const router = Router();

router.post('/analyze-complaint', analyzeComplaint);
router.post('/campus-brain', campusBrain);
router.post('/review-resolution', reviewResolution);

export default router;
