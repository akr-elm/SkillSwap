import express from 'express';
import { body } from 'express-validator';
import {
    createExchange,
    getUserExchanges,
    updateExchangeStatus,
} from '../controllers/exchanges.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';

const router = express.Router();

// POST /api/v1/exchanges - Create exchange request
router.post(
    '/',
    authenticate,
    [
        body('skillId').isInt({ min: 1 }).withMessage('Valid skill ID is required'),
        body('duration').isInt({ min: 1 }).withMessage('Duration must be a positive integer'),
    ],
    validate,
    createExchange
);

// GET /api/v1/exchanges - Get user's exchanges
router.get('/', authenticate, getUserExchanges);

// PATCH /api/v1/exchanges/:id/status - Update exchange status (accept/reject/complete)
router.patch(
    '/:id/status',
    authenticate,
    [
        body('status')
            .isIn(['ACCEPTED', 'REJECTED', 'COMPLETED'])
            .withMessage('Invalid status'),
    ],
    validate,
    updateExchangeStatus
);

export default router;
