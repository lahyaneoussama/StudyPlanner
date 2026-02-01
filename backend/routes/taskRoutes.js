
import express from 'express';
const router = express.Router();
import * as taskController from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

router.get('/', protect, taskController.getTasks);
router.post('/', protect, taskController.upsertTask);
router.delete('/:id', protect, taskController.deleteTask);

export default router;
