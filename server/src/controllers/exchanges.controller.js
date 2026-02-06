import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/error.middleware.js';

const prisma = new PrismaClient();

export const createExchange = async (req, res, next) => {
    try {
        const { skillId, duration } = req.body;
        const learnerId = req.user.id;

        // Get skill details
        const skill = await prisma.skill.findUnique({
            where: { id: parseInt(skillId) },
            include: {
                owner: true,
            },
        });

        if (!skill) {
            throw new AppError('Skill not found', 404);
        }

        // Can't request exchange for own skill
        if (skill.ownerId === learnerId) {
            throw new AppError('You cannot request an exchange for your own skill', 400);
        }

        // Check if learner has enough credits
        const learner = await prisma.user.findUnique({
            where: { id: learnerId },
        });

        if (learner.creditBalance < skill.credits) {
            throw new AppError('Insufficient credits', 400);
        }

        // Create exchange
        const exchange = await prisma.exchange.create({
            data: {
                teacherId: skill.ownerId,
                learnerId,
                skillId: skill.id,
                duration,
                credits: skill.credits,
                status: 'PENDING',
            },
            include: {
                teacher: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                learner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                skill: true,
            },
        });

        res.status(201).json({
            message: 'Exchange request created successfully',
            exchange,
        });
    } catch (error) {
        next(error);
    }
};

export const getUserExchanges = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const exchanges = await prisma.exchange.findMany({
            where: {
                OR: [{ teacherId: userId }, { learnerId: userId }],
            },
            include: {
                teacher: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
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

        res.json({ exchanges });
    } catch (error) {
        next(error);
    }
};

export const updateExchangeStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const userId = req.user.id;

        // Get exchange
        const exchange = await prisma.exchange.findUnique({
            where: { id: parseInt(id) },
            include: {
                teacher: true,
                learner: true,
            },
        });

        if (!exchange) {
            throw new AppError('Exchange not found', 404);
        }

        // Validate status transitions
        if (status === 'ACCEPTED' || status === 'REJECTED') {
            // Only teacher can accept/reject
            if (exchange.teacherId !== userId) {
                throw new AppError('Only the teacher can accept or reject this exchange', 403);
            }

            if (exchange.status !== 'PENDING') {
                throw new AppError('Can only accept/reject pending exchanges', 400);
            }

            // If accepting, check teacher availability and transfer credits
            if (status === 'ACCEPTED') {
                // Transfer credits from learner to teacher
                await prisma.$transaction([
                    prisma.user.update({
                        where: { id: exchange.learnerId },
                        data: {
                            creditBalance: {
                                decrement: exchange.credits,
                            },
                        },
                    }),
                    prisma.user.update({
                        where: { id: exchange.teacherId },
                        data: {
                            creditBalance: {
                                increment: exchange.credits,
                            },
                        },
                    }),
                    prisma.exchange.update({
                        where: { id: parseInt(id) },
                        data: { status },
                    }),
                ]);

                return res.json({
                    message: 'Exchange accepted and credits transferred',
                });
            }
        } else if (status === 'COMPLETED') {
            // Either party can mark as completed
            if (exchange.teacherId !== userId && exchange.learnerId !== userId) {
                throw new AppError('You are not part of this exchange', 403);
            }

            if (exchange.status !== 'ACCEPTED') {
                throw new AppError('Can only complete accepted exchanges', 400);
            }
        }

        // Update status
        const updatedExchange = await prisma.exchange.update({
            where: { id: parseInt(id) },
            data: { status },
            include: {
                teacher: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                learner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                skill: true,
            },
        });

        res.json({
            message: `Exchange ${status.toLowerCase()} successfully`,
            exchange: updatedExchange,
        });
    } catch (error) {
        next(error);
    }
};
