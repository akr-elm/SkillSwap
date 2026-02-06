import express from 'express';
import {
    getAllUsers,
    deleteUser,
    deleteSkill,
} from '../controllers/admin.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// All admin routes require authentication and ADMIN role
router.use(authenticate);
router.use(authorize('ADMIN'));

// GET /api/v1/admin/users - Get all users
router.get('/users', getAllUsers);

// DELETE /api/v1/admin/users/:id - Delete user
router.delete('/users/:id', deleteUser);

// DELETE /api/v1/admin/skills/:id - Delete any skill
router.delete('/skills/:id', deleteSkill);

export default router;
