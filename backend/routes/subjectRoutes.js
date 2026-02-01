
import express from 'express';
const router = express.Router();
import * as subjectController from '../controllers/subjectController.js';
import { protect } from '../middleware/authMiddleware.js';

router.get('/', protect, subjectController.getSubjects);
router.post('/', protect, subjectController.upsertSubject);
router.delete('/:id', protect, subjectController.deleteSubject);

export default router;
