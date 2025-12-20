import { COMMANDES, EtatCommande } from '@/mocks/commande';
import { LIGNES_COMMANDE } from '@/mocks/ligneCommande';
import { PRODUCTS, ProductMock } from '@/mocks/products';
import { LOCATIONS } from '@/mocks/locations';

// ========== Interfaces ==========

export interface ShopStatistics {
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    totalProductsSold: number;
    paidOrdersCount: number;
    collectedOrdersCount: number;
    waitingOrdersCount: number;
    locationsWithSales: number;
}

export interface OrderStatusDistribution {
    status: EtatCommande;
    count: number;
    percentage: number;
    color: string;
    label: string;
}

export interface LocationSalesDistribution {
    id: number;
    name: string;
    count: number;
    revenue: number;
    percentage: number;
    color: string;
}

export interface TopProduct {
    id: number;
    name: string;
    image: string;
    quantitySold: number;
    revenue: number;
    locationName: string;
}

export interface LocationStat {
    id: number;
    name: string;
    orderCount: number;
    revenue: number;
    productsSold: number;
    percentage: number;
}

export interface RevenueBucket {
    range: string;
    min: number;
    max: number;
    count: number;
    percentage: number;
}

export interface ShopStatisticsData {
    stats: ShopStatistics;
    orderStatusDistribution: OrderStatusDistribution[];
    locationSalesDistribution: LocationSalesDistribution[];
    topProducts: TopProduct[];
    locationStats: LocationStat[];
    revenueBuckets: RevenueBucket[];
}

// ========== Helper Functions ==========

function getLocationName(locationId: number): string {
    const location = LOCATIONS.find(l => l.id === locationId);
    return location?.name || 'Lieu inconnu';
}

function getProductById(productId: number): ProductMock | undefined {
    return PRODUCTS.find(p => p.id === productId);
}

// ========== Mock Service ==========

export const shopStatisticMockService = {
    getStatistics: async (): Promise<ShopStatisticsData> => {
        await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay

        const orders = COMMANDES;
        const orderLines = LIGNES_COMMANDE;

        // Calculate hero stats
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, o) => sum + o.total_price, 0);
        const averageOrderValue = totalOrders > 0 ? Math.round((totalRevenue / totalOrders) * 100) / 100 : 0;

        // Count products sold
        const totalProductsSold = orderLines.reduce((sum, line) => sum + line.quantite, 0);

        // Count by status
        const paidOrdersCount = orders.filter(o => o.etat_commande === EtatCommande.PAID).length;
        const collectedOrdersCount = orders.filter(o => o.etat_commande === EtatCommande.COLLECTED).length;
        const waitingOrdersCount = orders.filter(o => o.etat_commande === EtatCommande.WAITING).length;

        // Locations with sales
        const locationIds = new Set(orders.map(o => o.id_location));
        const locationsWithSales = locationIds.size;

        // Order Status Distribution
        const statusLabels: Record<EtatCommande, string> = {
            [EtatCommande.WAITING]: 'En attente',
            [EtatCommande.PAID]: 'Payées',
            [EtatCommande.COLLECTED]: 'Collectées',
        };

        const statusColors: Record<EtatCommande, string> = {
            [EtatCommande.WAITING]: '#f59e0b', // amber-500
            [EtatCommande.PAID]: '#10b981', // emerald-500
            [EtatCommande.COLLECTED]: '#3b82f6', // blue-500
        };

        const orderStatusDistribution: OrderStatusDistribution[] = [
            {
                status: EtatCommande.PAID,
                count: paidOrdersCount,
                percentage: totalOrders > 0 ? Math.round((paidOrdersCount / totalOrders) * 100) : 0,
                color: statusColors[EtatCommande.PAID],
                label: statusLabels[EtatCommande.PAID],
            },
            {
                status: EtatCommande.COLLECTED,
                count: collectedOrdersCount,
                percentage: totalOrders > 0 ? Math.round((collectedOrdersCount / totalOrders) * 100) : 0,
                color: statusColors[EtatCommande.COLLECTED],
                label: statusLabels[EtatCommande.COLLECTED],
            },
            {
                status: EtatCommande.WAITING,
                count: waitingOrdersCount,
                percentage: totalOrders > 0 ? Math.round((waitingOrdersCount / totalOrders) * 100) : 0,
                color: statusColors[EtatCommande.WAITING],
                label: statusLabels[EtatCommande.WAITING],
            },
        ].filter(s => s.count > 0);

        // Location Sales Distribution
        const locationOrderCounts = new Map<number, { count: number; revenue: number }>();
        orders.forEach(order => {
            const existing = locationOrderCounts.get(order.id_location) || { count: 0, revenue: 0 };
            locationOrderCounts.set(order.id_location, {
                count: existing.count + 1,
                revenue: existing.revenue + order.total_price,
            });
        });

        const locationColors = ['#d97706', '#b45309', '#92400e', '#78350f', '#451a03', '#A8A29E'];

        const sortedLocations = Array.from(locationOrderCounts.entries())
            .map(([locId, data]) => ({
                id: locId,
                name: getLocationName(locId),
                count: data.count,
                revenue: data.revenue,
            }))
            .sort((a, b) => b.revenue - a.revenue);

        const topLocations = sortedLocations.slice(0, 5);
        const otherLocations = sortedLocations.slice(5);

        const locationSalesDistribution: LocationSalesDistribution[] = topLocations.map((loc, index) => ({
            id: loc.id,
            name: loc.name,
            count: loc.count,
            revenue: loc.revenue,
            percentage: totalRevenue > 0 ? Math.round((loc.revenue / totalRevenue) * 100) : 0,
            color: locationColors[index % locationColors.length],
        }));

        if (otherLocations.length > 0) {
            const otherRevenue = otherLocations.reduce((sum, loc) => sum + loc.revenue, 0);
            const otherCount = otherLocations.reduce((sum, loc) => sum + loc.count, 0);
            locationSalesDistribution.push({
                id: -1,
                name: 'Autres',
                count: otherCount,
                revenue: otherRevenue,
                percentage: totalRevenue > 0 ? Math.round((otherRevenue / totalRevenue) * 100) : 0,
                color: locationColors[5],
            });
        }

        // Top Products
        const productSales = new Map<number, { quantity: number; revenue: number; locationId: number }>();
        orderLines.forEach(line => {
            // Find the order to get order details
            const order = orders.find(o => o.id === line.id_commande);
            const existing = productSales.get(line.id_product) || { quantity: 0, revenue: 0, locationId: order?.id_location || 0 };
            productSales.set(line.id_product, {
                quantity: existing.quantity + line.quantite,
                revenue: existing.revenue + (line.price * line.quantite),
                locationId: order?.id_location || existing.locationId,
            });
        });

        const topProducts: TopProduct[] = Array.from(productSales.entries())
            .map(([productId, data]) => {
                const product = getProductById(productId);
                return {
                    id: productId,
                    name: product?.name || 'Produit inconnu',
                    image: product?.image || '/images/products/default.jpg',
                    quantitySold: data.quantity,
                    revenue: data.revenue,
                    locationName: getLocationName(data.locationId),
                };
            })
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);

        // Location Stats
        const maxOrderCount = Math.max(...Array.from(locationOrderCounts.values()).map(v => v.count), 1);

        const locationStats: LocationStat[] = sortedLocations.map(loc => {
            // Count products sold at this location
            const locationOrders = orders.filter(o => o.id_location === loc.id);
            const orderIds = locationOrders.map(o => o.id);
            const productsSold = orderLines
                .filter(line => orderIds.includes(line.id_commande))
                .reduce((sum, line) => sum + line.quantite, 0);

            return {
                id: loc.id,
                name: loc.name,
                orderCount: loc.count,
                revenue: loc.revenue,
                productsSold,
                percentage: Math.round((loc.count / maxOrderCount) * 100),
            };
        });

        // Revenue Buckets
        const buckets: RevenueBucket[] = [
            { range: '0-10€', min: 0, max: 10, count: 0, percentage: 0 },
            { range: '10-25€', min: 10, max: 25, count: 0, percentage: 0 },
            { range: '25-50€', min: 25, max: 50, count: 0, percentage: 0 },
            { range: '50-100€', min: 50, max: 100, count: 0, percentage: 0 },
            { range: '100€+', min: 100, max: Infinity, count: 0, percentage: 0 },
        ];

        orders.forEach(order => {
            const bucket = buckets.find(b => order.total_price >= b.min && order.total_price < b.max);
            if (bucket) bucket.count++;
        });

        const maxBucketCount = Math.max(...buckets.map(b => b.count), 1);
        buckets.forEach(b => {
            b.percentage = Math.round((b.count / maxBucketCount) * 100);
        });

        return {
            stats: {
                totalOrders,
                totalRevenue,
                averageOrderValue,
                totalProductsSold,
                paidOrdersCount,
                collectedOrdersCount,
                waitingOrdersCount,
                locationsWithSales,
            },
            orderStatusDistribution,
            locationSalesDistribution,
            topProducts,
            locationStats,
            revenueBuckets: buckets,
        };
    },
};
