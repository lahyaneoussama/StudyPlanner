
import express from 'express';
const router = express.Router();
import * as sessionController from '../controllers/sessionController.js';
import { protect } from '../middleware/authMiddleware.js';

router.get('/', protect, sessionController.getSessions);
router.post('/', protect, sessionController.upsertSession);
router.delete('/:id', protect, sessionController.deleteSession);

export default router;
