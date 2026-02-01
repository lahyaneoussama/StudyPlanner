
import express from 'express';
const router = express.Router();
import * as userController from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

router.get('/profile', protect, userController.getProfile);
router.put('/profile', protect, userController.updateProfile);

export default router;
