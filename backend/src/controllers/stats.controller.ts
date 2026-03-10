
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
                        user: {
                            select: {
                                id_user: true,
                                firstname: true,
                                lastname: true
                            }
                        }
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

            const ownerName = loc.id_prestataire && loc.prestataire?.user
                ? `${loc.prestataire.user.firstname} ${loc.prestataire.user.lastname}`
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

/**
 * Get user statistics for Admin dashboard
 */
export const getAdminUserStats = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            where: {
                role: {
                    not: 'admin'
                }
            },
            select: {
                id_user: true,
                firstname: true,
                lastname: true,
                role: true,
                level: true,
                xp: true,
                gold: true,
                is_verified: true,
                created_at: true
            }
        });

        const paidOrdersRaw = await prisma.$queryRaw<{ idUser: number; orderCount: bigint; totalSpent: number | null }[]>`
            SELECT
                id_user as idUser,
                COUNT(*) as orderCount,
                SUM(total_price) as totalSpent
            FROM commande
            WHERE etat_commande = 'payed' OR etat_commande = 'collected'
            GROUP BY id_user
        `;

        const completedQuestsRaw = await prisma.$queryRaw<{ idUser: number; completedCount: bigint }[]>`
            SELECT
                id_user as idUser,
                COUNT(*) as completedCount
            FROM userQuests
            WHERE status = 'completed'
            GROUP BY id_user
        `;

        const paidOrdersByUser = new Map<number, { orderCount: number; totalSpent: number }>();
        paidOrdersRaw.forEach(row => {
            paidOrdersByUser.set(row.idUser, {
                orderCount: Number(row.orderCount) || 0,
                totalSpent: Number(row.totalSpent) || 0
            });
        });

        const completedQuestsByUser = new Map<number, number>();
        completedQuestsRaw.forEach(row => {
            completedQuestsByUser.set(row.idUser, Number(row.completedCount) || 0);
        });

        const rows = users.map(user => {
            const orderInfo = paidOrdersByUser.get(user.id_user) || { orderCount: 0, totalSpent: 0 };
            const completedQuests = completedQuestsByUser.get(user.id_user) || 0;

            const activityScore =
                orderInfo.orderCount * 2 +
                completedQuests * 3 +
                user.level +
                user.xp / 100 +
                orderInfo.totalSpent / 50;

            return {
                id: user.id_user,
                name: `${user.firstname} ${user.lastname}`,
                role: user.role,
                level: user.level,
                xp: Number(user.xp),
                gold: user.gold,
                isVerified: user.is_verified,
                totalOrders: orderInfo.orderCount,
                completedQuests,
                totalSpent: Number(orderInfo.totalSpent.toFixed(2)),
                activityScore: Number(activityScore.toFixed(2)),
                createdAt: user.created_at
            };
        });

        const totalUsers = rows.length;
        const payingUsers = rows.filter(r => r.totalOrders > 0).length;
        const verifiedUsers = rows.filter(r => r.isVerified).length;
        const activeUsers = rows.filter(r => r.totalOrders > 0 || r.completedQuests > 0).length;
        const totalOrders = rows.reduce((sum, r) => sum + r.totalOrders, 0);
        const totalXP = rows.reduce((sum, r) => sum + r.xp, 0);
        const totalGold = rows.reduce((sum, r) => sum + r.gold, 0);
        const avgLevel = totalUsers > 0 ? Number((rows.reduce((sum, r) => sum + r.level, 0) / totalUsers).toFixed(1)) : 0;

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const newUsersThisMonth = rows.filter(r => r.createdAt && new Date(r.createdAt) >= startOfMonth).length;

        const maxActivity = Math.max(...rows.map(r => r.activityScore), 1);
        const sortedRows = [...rows].sort((a, b) => b.activityScore - a.activityScore);
        const userStats = sortedRows.map(row => ({
            ...row,
            percentage: Math.round((row.activityScore / maxActivity) * 100)
        }));
        const topUsers = userStats.slice(0, 8);

        const roleColors: Record<string, string> = {
            aventurier: '#d97706',
            prestataire: '#3b82f6',
            admin: '#10b981'
        };
        const roleOrder = ['aventurier', 'prestataire', 'admin'];
        const roleDistribution = roleOrder
            .map(role => {
                const count = rows.filter(r => r.role === role).length;
                return {
                    label: role,
                    count,
                    percentage: totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0,
                    color: roleColors[role]
                };
            })
            .filter(item => item.count > 0);

        const verificationDistribution = [
            {
                label: 'verified',
                count: verifiedUsers,
                percentage: totalUsers > 0 ? Math.round((verifiedUsers / totalUsers) * 100) : 0,
                color: '#10b981'
            },
            {
                label: 'unverified',
                count: totalUsers - verifiedUsers,
                percentage: totalUsers > 0 ? Math.round(((totalUsers - verifiedUsers) / totalUsers) * 100) : 0,
                color: '#f59e0b'
            }
        ].filter(item => item.count > 0);

        const levelBucketsRaw = [
            { range: '1-5', min: 1, max: 5 },
            { range: '6-10', min: 6, max: 10 },
            { range: '11-20', min: 11, max: 20 },
            { range: '21-50', min: 21, max: 50 },
            { range: '51+', min: 51, max: Number.POSITIVE_INFINITY }
        ];

        const levelBuckets = levelBucketsRaw.map(bucket => {
            const count = rows.filter(r => r.level >= bucket.min && r.level <= bucket.max).length;
            return {
                range: bucket.range,
                count,
                percentage: totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0
            };
        });

        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        sixMonthsAgo.setHours(0, 0, 0, 0);

        const registrationBuckets = new Array(6).fill(0).map((_, index) => {
            const monthDate = new Date(sixMonthsAgo);
            monthDate.setMonth(monthDate.getMonth() + index);
            return {
                month: monthDate.toLocaleString('default', { month: 'short' }),
                count: 0
            };
        });

        rows.forEach(row => {
            if (!row.createdAt) {
                return;
            }

            const createdAt = new Date(row.createdAt);
            const monthIndex =
                (createdAt.getFullYear() - sixMonthsAgo.getFullYear()) * 12 +
                (createdAt.getMonth() - sixMonthsAgo.getMonth());

            if (monthIndex >= 0 && monthIndex < registrationBuckets.length) {
                registrationBuckets[monthIndex].count += 1;
            }
        });

        return res.json({
            stats: {
                totalUsers,
                payingUsers,
                verifiedUsers,
                activeUsers,
                totalOrders,
                avgLevel,
                totalXP,
                totalGold,
                newUsersThisMonth
            },
            roleDistribution,
            verificationDistribution,
            topUsers,
            userStats,
            levelBuckets,
            registrationBuckets
        });
    } catch (error) {
        console.error('Error fetching admin user stats:', error);
        return res.status(500).json({ error: 'Failed to fetch admin user stats' });
    }
};
