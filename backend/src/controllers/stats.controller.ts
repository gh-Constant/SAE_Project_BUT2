
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

/**
 * Get location statistics for Admin dashboard
 */
export const getAdminLocationStats = async (req: Request, res: Response) => {
    try {
        const locations = await prisma.location.findMany({
            include: {
                location_type: {
                    select: {
                        id_location_type: true,
                        name: true
                    }
                },
                prestataire: {
                    select: {
                        id_user: true,
                        firstname: true,
                        lastname: true
                    }
                },
                _count: {
                    select: {
                        quests: true,
                        quizzes: true,
                        events: true,
                        blogs: true,
                        services: true
                    }
                }
            }
        });

        const totalLocations = locations.length;
        const purchasedLocations = locations.filter(loc => loc.purchased).length;
        const availableLocations = totalLocations - purchasedLocations;
        const storyLocations = locations.filter(loc => loc.location_type?.name === 'story').length;
        const buyableLocations = totalLocations - storyLocations;

        const totalPrice = locations.reduce((sum, loc) => sum + Number(loc.price), 0);
        const averagePrice = totalLocations > 0 ? totalPrice / totalLocations : 0;

        const totalPotentialRevenue = locations
            .filter(loc => !loc.purchased)
            .reduce((sum, loc) => sum + Number(loc.price), 0);

        const activePrestataires = new Set(
            locations
                .map(loc => loc.id_prestataire)
                .filter((id): id is number => typeof id === 'number' && id > 0)
        ).size;

        const locationRows = locations.map(loc => {
            const activityScore =
                loc._count.quests +
                loc._count.quizzes +
                loc._count.events +
                loc._count.blogs +
                loc._count.services;

            const ownerName = loc.id_prestataire && loc.prestataire
                ? `${loc.prestataire.firstname} ${loc.prestataire.lastname}`
                : loc.id_prestataire === 0
                    ? 'System'
                    : 'Unassigned';

            return {
                id: loc.id_location,
                name: loc.name,
                typeName: loc.location_type?.name || 'unknown',
                ownerName,
                purchased: loc.purchased,
                price: Number(loc.price),
                quests: loc._count.quests,
                quizzes: loc._count.quizzes,
                events: loc._count.events,
                blogs: loc._count.blogs,
                services: loc._count.services,
                activityScore
            };
        });

        const totalActivity = locationRows.reduce((sum, row) => sum + row.activityScore, 0);
        const maxActivity = Math.max(...locationRows.map(row => row.activityScore), 1);

        const sortedLocationRows = [...locationRows].sort((a, b) => b.activityScore - a.activityScore);

        const topLocations = sortedLocationRows.slice(0, 6);

        const locationStats = sortedLocationRows.map(row => ({
            ...row,
            percentage: maxActivity > 0 ? Math.round((row.activityScore / maxActivity) * 100) : 0
        }));

        const typeCounts = new Map<string, number>();
        locationRows.forEach(loc => {
            typeCounts.set(loc.typeName, (typeCounts.get(loc.typeName) || 0) + 1);
        });

        const typeColors = ['#d97706', '#b45309', '#92400e', '#3b82f6', '#10b981'];
        const typeDistribution = Array.from(typeCounts.entries()).map(([typeName, count], index) => ({
            label: typeName,
            count,
            percentage: totalLocations > 0 ? Math.round((count / totalLocations) * 100) : 0,
            color: typeColors[index % typeColors.length]
        }));

        const ownershipRaw = [
            {
                label: 'Owned by providers',
                count: locationRows.filter(loc => loc.purchased && loc.ownerName !== 'System').length,
                color: '#10b981'
            },
            {
                label: 'System',
                count: locationRows.filter(loc => loc.ownerName === 'System').length,
                color: '#3b82f6'
            },
            {
                label: 'Available',
                count: availableLocations,
                color: '#f59e0b'
            }
        ];

        const ownershipDistribution = ownershipRaw
            .filter(item => item.count > 0)
            .map(item => ({
                ...item,
                percentage: totalLocations > 0 ? Math.round((item.count / totalLocations) * 100) : 0
            }));

        const priceBucketsRaw = [
            { range: '0-49', min: 0, max: 49 },
            { range: '50-99', min: 50, max: 99 },
            { range: '100-149', min: 100, max: 149 },
            { range: '150-199', min: 150, max: 199 },
            { range: '200+', min: 200, max: Number.POSITIVE_INFINITY }
        ];

        const priceBuckets = priceBucketsRaw.map(bucket => {
            const count = locationRows.filter(loc => loc.price >= bucket.min && loc.price <= bucket.max).length;
            return {
                range: bucket.range,
                count,
                percentage: totalLocations > 0 ? Math.round((count / totalLocations) * 100) : 0
            };
        });

        return res.json({
            stats: {
                totalLocations,
                purchasedLocations,
                availableLocations,
                activePrestataires,
                storyLocations,
                buyableLocations,
                averagePrice,
                totalPotentialRevenue,
                totalActivity
            },
            typeDistribution,
            ownershipDistribution,
            topLocations,
            locationStats,
            priceBuckets
        });
    } catch (error) {
        console.error('Error fetching admin location stats:', error);
        return res.status(500).json({ error: 'Failed to fetch admin location stats' });
    }
};
