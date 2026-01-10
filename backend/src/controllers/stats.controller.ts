
import { Request, Response } from 'express';
import prisma from '../prisma.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

/**
 * Get global statistics for Admin dashboard
 * - Total Users
 * - Paying Users (who have at least one PAID order)
 * - Total Revenue (sum of all PAID orders)
 */
export const getAdminGlobalStats = async (req: Request, res: Response) => {
    try {
        const userCount = await prisma.user.count({
            where: { role: 'user' }
        });

        const payingUserCount = await prisma.user.count({
            where: {
                role: 'user',
                orders: {
                    some: {
                        status: 'PAID'
                    }
                }
            }
        });

        const revenueResult = await prisma.order.aggregate({
            _sum: {
                total: true
            },
            where: {
                status: 'PAID'
            }
        });

        const totalRevenue = revenueResult._sum.total || 0;

        const lastUsers = await prisma.user.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: { id: true, firstname: true, lastname: true, createdAt: true }
        });

        const lastLocations = await prisma.location.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: { id: true, name: true, createdAt: true }
        });

        const recentActivity = [
            ...lastUsers.map(u => ({
                type: 'USER_CREATED',
                id: u.id,
                name: `${u.firstname} ${u.lastname}`,
                date: u.createdAt
            })),
            ...lastLocations.map(l => ({
                type: 'LOCATION_ADDED',
                id: l.id,
                name: l.name,
                date: l.createdAt
            }))
        ]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5);

        return res.json({
            userCount,
            payingUserCount,
            totalRevenue,
            recentActivity
        });

    } catch (error) {
        console.error('Error fetching admin stats:', error);
        return res.status(500).json({ error: 'Failed to fetch admin stats' });
    }
};

/**
 * Get global statistics for Provider dashboard
 * - My Locations (count)
 * - Monthly Revenue (from my locations)
 * - Total Orders (containing my products)
 */
export const getProviderGlobalStats = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const locationsCount = await prisma.location.count({
            where: {
                providerId: userId
            }
        });

        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const monthlyRevenueResult = await prisma.orderItem.aggregate({
            _sum: {
                price: true
            },
            where: {
                order: {
                    status: 'PAID',
                    createdAt: {
                        gte: firstDayOfMonth
                    }
                },
                product: {
                    location: {
                        providerId: userId
                    }
                }
            }
        });

        const monthlyRevenue = monthlyRevenueResult._sum.price || 0;

        const orderCount = await prisma.order.count({
            where: {
                status: 'PAID',
                items: {
                    some: {
                        product: {
                            location: {
                                providerId: userId
                            }
                        }
                    }
                }
            }
        });

        return res.json({
            locationsCount,
            monthlyRevenue,
            orderCount
        });

    } catch (error) {
        console.error('Error fetching provider stats:', error);
        return res.status(500).json({ error: 'Failed to fetch provider stats' });
    }
};
