import express from 'express';
import { getProfile, getDashboard } from '../controllers/users.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// GET /api/v1/users/profile - Get current user profile
router.get('/profile', authenticate, getProfile);

// GET /api/v1/users/dashboard - Get dashboard data
router.get('/dashboard', authenticate, getDashboard);

export default router;
