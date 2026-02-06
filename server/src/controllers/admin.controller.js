import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/error.middleware.js';

const prisma = new PrismaClient();

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                creditBalance: true,
                createdAt: true,
                _count: {
                    select: {
                        skills: true,
                        exchangesAsTeacher: true,
                        exchangesAsLearner: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        res.json({ users });
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const adminId = req.user.id;

        // Prevent admin from deleting themselves
        if (parseInt(id) === adminId) {
            throw new AppError('You cannot delete your own account', 400);
        }

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { id: parseInt(id) },
        });

        if (!user) {
            throw new AppError('User not found', 404);
        }

        // Delete user (cascade will handle related records)
        await prisma.user.delete({
            where: { id: parseInt(id) },
        });

        res.json({
            message: 'User deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

export const deleteSkill = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Check if skill exists
        const skill = await prisma.skill.findUnique({
            where: { id: parseInt(id) },
        });

        if (!skill) {
            throw new AppError('Skill not found', 404);
        }

        // Delete skill
        await prisma.skill.delete({
            where: { id: parseInt(id) },
        });

        res.json({
            message: 'Skill deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};
