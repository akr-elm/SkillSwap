import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/error.middleware.js';

const prisma = new PrismaClient();

export const getProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                creditBalance: true,
                createdAt: true,
            },
        });

        if (!user) {
            throw new AppError('User not found', 404);
        }

        res.json({ user });
    } catch (error) {
        next(error);
    }
};

export const getDashboard = async (req, res, next) => {
    try {
        const userId = req.user.id;

        // Get user with credit balance
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                creditBalance: true,
            },
        });

        // Get user's skills
        const skills = await prisma.skill.findMany({
            where: { ownerId: userId },
            include: {
                _count: {
                    select: {
                        exchanges: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Get exchanges as teacher
        const exchangesAsTeacher = await prisma.exchange.findMany({
            where: { teacherId: userId },
            include: {
                learner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                skill: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Get exchanges as learner
        const exchangesAsLearner = await prisma.exchange.findMany({
            where: { learnerId: userId },
            include: {
                teacher: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                skill: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        res.json({
            creditBalance: user.creditBalance,
            skills,
            exchangesAsTeacher,
            exchangesAsLearner,
            stats: {
                totalSkills: skills.length,
                totalExchangesAsTeacher: exchangesAsTeacher.length,
                totalExchangesAsLearner: exchangesAsLearner.length,
                pendingRequests: exchangesAsTeacher.filter((e) => e.status === 'PENDING').length,
            },
        });
    } catch (error) {
        next(error);
    }
};
