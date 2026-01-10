
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
        const userCountResult = await prisma.$queryRaw<[{ count: bigint }]>`SELECT COUNT(*) as count FROM users WHERE role = 'user'`;
        const userCount = Number(userCountResult[0].count);

        const payingUserCountResult = await prisma.$queryRaw<[{ count: bigint }]>`
            SELECT COUNT(DISTINCT id_user) as count 
            FROM commande 
            WHERE etat_commande = 'payed' OR etat_commande = 'collected'
        `;
        const payingUserCount = Number(payingUserCountResult[0].count);

        const revenueResult = await prisma.$queryRaw<[{ total: number | null }]>`
            SELECT SUM(total_price) as total 
            FROM commande 
            WHERE etat_commande = 'payed' OR etat_commande = 'collected'
        `;
        const totalRevenue = Number(revenueResult[0].total) || 0;

        const lastUsers = await prisma.$queryRaw<{ id: number; firstname: string; lastname: string; createdAt: Date }[]>`
            SELECT id_user as id, firstname, lastname, created_at as createdAt 
            FROM users 
            ORDER BY created_at DESC 
            LIMIT 5
        `;

        const lastLocations = await prisma.$queryRaw<{ id: number; name: string; createdAt: Date }[]>`
            SELECT id_location as id, name, created_at as createdAt 
            FROM locations 
            ORDER BY created_at DESC 
            LIMIT 5
        `;

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

        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        sixMonthsAgo.setHours(0, 0, 0, 0);

        const recentOrders = await prisma.$queryRaw<{ total: number; createdAt: Date }[]>`
            SELECT total_price as total, created_at as createdAt 
            FROM commande 
            WHERE (etat_commande = 'payed' OR etat_commande = 'collected')
            AND created_at >= ${sixMonthsAgo}
        `;

        const recentUsers = await prisma.$queryRaw<{ createdAt: Date }[]>`
            SELECT created_at as createdAt 
            FROM users 
            WHERE role = 'user' 
            AND created_at >= ${sixMonthsAgo}
        `;

        const months = [];
        for (let i = 0; i < 6; i++) {
            const d = new Date(sixMonthsAgo);
            d.setMonth(d.getMonth() + i);
            months.push(d.toLocaleString('default', { month: 'short' }));
        }

        const revenueData = new Array(6).fill(0);
        const userGrowthData = new Array(6).fill(0);

        recentOrders.forEach(order => {
            const date = new Date(order.createdAt);
            const monthIndex = (date.getMonth() - sixMonthsAgo.getMonth() + 12) % 12;
            if (monthIndex >= 0 && monthIndex < 6) {
                revenueData[monthIndex] += Number(order.total);
            }
        });

        recentUsers.forEach(user => {
            const date = new Date(user.createdAt);
            const monthIndex = (date.getMonth() - sixMonthsAgo.getMonth() + 12) % 12;
            if (monthIndex >= 0 && monthIndex < 6) {
                userGrowthData[monthIndex]++;
            }
        });

        return res.json({
            userCount,
            payingUserCount,
            totalRevenue,
            recentActivity,
            charts: {
                months,
                revenue: revenueData,
                users: userGrowthData
            }
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
        const userId = req.user!.id;

        const locationsCountResult = await prisma.$queryRaw<[{ count: bigint }]>`
            SELECT COUNT(*) as count 
            FROM locations 
            WHERE id_prestataire = ${userId}
        `;
        const locationsCount = Number(locationsCountResult[0].count);

        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const monthlyRevenueResult = await prisma.$queryRaw<[{ total: number | null }]>`
            SELECT SUM(lc.price * lc.quantite) as total
            FROM ligne_commande lc
            JOIN products p ON lc.id_product = p.id_product
            JOIN commande c ON lc.id_commande = c.id_commande
            WHERE p.id_prestataire = ${userId}
            AND (c.etat_commande = 'payed' OR c.etat_commande = 'collected')
            AND c.created_at >= ${startOfMonth}
        `;
        const monthlyRevenue = Number(monthlyRevenueResult[0].total) || 0;

        const orderCountResult = await prisma.$queryRaw<[{ count: bigint }]>`
            SELECT COUNT(DISTINCT c.id_commande) as count
            FROM commande c
            JOIN ligne_commande lc ON c.id_commande = lc.id_commande
            JOIN products p ON lc.id_product = p.id_product
            WHERE p.id_prestataire = ${userId}
            AND (c.etat_commande = 'payed' OR c.etat_commande = 'collected')
        `;
        const orderCount = Number(orderCountResult[0].count);

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
