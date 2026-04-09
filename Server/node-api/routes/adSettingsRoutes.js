import express from 'express';
import { getAdSettings, updateAdSettings } from '../controllers/adSettingsController.js';
import { adminAuth } from '../middleware/adminAuth.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// User route - Get ad settings
router.get('/', authMiddleware, getAdSettings);

// Admin route - Update ad settings
router.put('/', adminAuth, updateAdSettings);

export default router;
