import express from 'express';
import { body, query } from 'express-validator';
import {
    getAllSkills,
    getSkillById,
    createSkill,
    updateSkill,
    deleteSkill,
} from '../controllers/skills.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';

const router = express.Router();

// GET /api/v1/skills - Get all skills with search, filter, sort, pagination
router.get(
    '/',
    [
        query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
        query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
        query('search').optional().trim(),
        query('category').optional().trim(),
        query('level').optional().isIn(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']).withMessage('Invalid skill level'),
        query('sortBy').optional().isIn(['createdAt', 'credits', 'title']).withMessage('Invalid sort field'),
        query('order').optional().isIn(['asc', 'desc']).withMessage('Order must be asc or desc'),
    ],
    validate,
    getAllSkills
);

// GET /api/v1/skills/:id - Get single skill
router.get('/:id', getSkillById);

// POST /api/v1/skills - Create skill (protected)
router.post(
    '/',
    authenticate,
    [
        body('title').trim().notEmpty().withMessage('Title is required'),
        body('category').trim().notEmpty().withMessage('Category is required'),
        body('level')
            .isIn(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'])
            .withMessage('Invalid skill level'),
        body('description').trim().notEmpty().withMessage('Description is required'),
        body('duration').isInt({ min: 1 }).withMessage('Duration must be a positive integer'),
        body('credits').isInt({ min: 1 }).withMessage('Credits must be a positive integer'),
    ],
    validate,
    createSkill
);

// PUT /api/v1/skills/:id - Update skill (protected, owner only)
router.put(
    '/:id',
    authenticate,
    [
        body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
        body('category').optional().trim().notEmpty().withMessage('Category cannot be empty'),
        body('level')
            .optional()
            .isIn(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'])
            .withMessage('Invalid skill level'),
        body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
        body('duration').optional().isInt({ min: 1 }).withMessage('Duration must be a positive integer'),
        body('credits').optional().isInt({ min: 1 }).withMessage('Credits must be a positive integer'),
    ],
    validate,
    updateSkill
);

// DELETE /api/v1/skills/:id - Delete skill (protected, owner only)
router.delete('/:id', authenticate, deleteSkill);

export default router;
