import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/error.middleware.js';

const prisma = new PrismaClient();

export const getAllSkills = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 10,
            search = '',
            category = '',
            level = '',
            sortBy = 'createdAt',
            order = 'desc',
        } = req.query;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);

        // Build where clause
        const where = {};

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (category) {
            where.category = category;
        }

        if (level) {
            where.level = level;
        }

        // Get total count
        const total = await prisma.skill.count({ where });

        // Get skills
        const skills = await prisma.skill.findMany({
            where,
            skip,
            take,
            orderBy: { [sortBy]: order },
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                _count: {
                    select: {
                        reviews: true,
                    },
                },
            },
        });

        // Calculate average rating for each skill
        const skillsWithRatings = await Promise.all(
            skills.map(async (skill) => {
                const reviews = await prisma.review.findMany({
                    where: { skillId: skill.id },
                    select: { rating: true },
                });

                const avgRating =
                    reviews.length > 0
                        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                        : 0;

                return {
                    ...skill,
                    averageRating: Math.round(avgRating * 10) / 10,
                    reviewCount: reviews.length,
                };
            })
        );

        res.json({
            skills: skillsWithRatings,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages: Math.ceil(total / parseInt(limit)),
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getSkillById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const skill = await prisma.skill.findUnique({
            where: { id: parseInt(id) },
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                reviews: {
                    include: {
                        exchange: {
                            include: {
                                learner: {
                                    select: {
                                        id: true,
                                        name: true,
                                    },
                                },
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
        });

        if (!skill) {
            throw new AppError('Skill not found', 404);
        }

        // Calculate average rating
        const avgRating =
            skill.reviews.length > 0
                ? skill.reviews.reduce((sum, r) => sum + r.rating, 0) / skill.reviews.length
                : 0;

        res.json({
            ...skill,
            averageRating: Math.round(avgRating * 10) / 10,
            reviewCount: skill.reviews.length,
        });
    } catch (error) {
        next(error);
    }
};

export const createSkill = async (req, res, next) => {
    try {
        const { title, category, level, description, duration, credits } = req.body;
        const ownerId = req.user.id;

        const skill = await prisma.skill.create({
            data: {
                title,
                category,
                level,
                description,
                duration,
                credits,
                ownerId,
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        res.status(201).json({
            message: 'Skill created successfully',
            skill,
        });
    } catch (error) {
        next(error);
    }
};

export const updateSkill = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        // Find skill
        const skill = await prisma.skill.findUnique({
            where: { id: parseInt(id) },
        });

        if (!skill) {
            throw new AppError('Skill not found', 404);
        }

        // Check ownership (unless admin)
        if (skill.ownerId !== userId && userRole !== 'ADMIN') {
            throw new AppError('You can only update your own skills', 403);
        }

        // Update skill
        const updatedSkill = await prisma.skill.update({
            where: { id: parseInt(id) },
            data: req.body,
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        res.json({
            message: 'Skill updated successfully',
            skill: updatedSkill,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteSkill = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        // Find skill
        const skill = await prisma.skill.findUnique({
            where: { id: parseInt(id) },
        });

        if (!skill) {
            throw new AppError('Skill not found', 404);
        }

        // Check ownership (unless admin)
        if (skill.ownerId !== userId && userRole !== 'ADMIN') {
            throw new AppError('You can only delete your own skills', 403);
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
