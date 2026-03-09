import { LOCATIONS } from '@/mocks/locations';
import { QUESTS } from '@/mocks/quests';
import { mockQuizzes } from '@/mocks/quizzes';
import { EVENTS } from '@/mocks/events';
import { BLOGS } from '@/mocks/blogs';
import { SERVICES } from '@/mocks/services';
import { USERS } from '@/mocks/users';

export interface LocationStatistics {
  totalLocations: number;
  purchasedLocations: number;
  availableLocations: number;
  activePrestataires: number;
  storyLocations: number;
  buyableLocations: number;
  averagePrice: number;
  totalPotentialRevenue: number;
  totalActivity: number;
}

export interface DistributionItem {
  label: string;
  count: number;
  percentage: number;
  color: string;
}

export interface TopLocation {
  id: number;
  name: string;
  activityScore: number;
  quests: number;
  quizzes: number;
  events: number;
  blogs: number;
  services: number;
}

export interface LocationRow extends TopLocation {
  typeName: string;
  ownerName: string;
  purchased: boolean;
  price: number;
  percentage: number;
}

export interface PriceBucket {
  range: string;
  count: number;
  percentage: number;
}

export interface LocationStatisticsData {
  stats: LocationStatistics;
  typeDistribution: DistributionItem[];
  ownershipDistribution: DistributionItem[];
  topLocations: TopLocation[];
  locationStats: LocationRow[];
  priceBuckets: PriceBucket[];
}

function getTypeName(typeId: number): string {
  switch (typeId) {
    case 1:
      return 'prestataire';
    case 2:
      return 'story';
    case 3:
      return 'other';
    default:
      return 'other';
  }
}

function getOwnerName(ownerId?: number): string {
  if (ownerId === 0) {
    return 'System';
  }

  if (!ownerId) {
    return 'Unassigned';
  }

  const owner = USERS.find(u => u.id === ownerId);
  return owner ? `${owner.firstname} ${owner.lastname}` : 'Unknown';
}

export const locationStatisticMockService = {
  async getStatistics(): Promise<LocationStatisticsData> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const rows = LOCATIONS.map(loc => {
      const quests = QUESTS.filter(q => q.id_location === loc.id).length;
      const quizzes = mockQuizzes.filter(q => q.id_location === loc.id).length;
      const events = EVENTS.filter(e => e.id_location === loc.id).length;
      const blogs = BLOGS.filter(b => b.id_location === loc.id).length;
      const services = SERVICES.filter(s => s.id_location === loc.id).length;
      const activityScore = quests + quizzes + events + blogs + services;

      return {
        id: loc.id,
        name: loc.name,
        typeName: getTypeName(loc.id_location_type),
        ownerName: getOwnerName(loc.id_prestataire),
        purchased: loc.purchased,
        price: loc.price,
        quests,
        quizzes,
        events,
        blogs,
        services,
        activityScore,
      };
    });

    const totalLocations = rows.length;
    const purchasedLocations = rows.filter(r => r.purchased).length;
    const availableLocations = totalLocations - purchasedLocations;
    const storyLocations = rows.filter(r => r.typeName === 'story').length;
    const buyableLocations = totalLocations - storyLocations;
    const totalPrice = rows.reduce((sum, r) => sum + r.price, 0);
    const averagePrice = totalLocations > 0 ? totalPrice / totalLocations : 0;
    const totalPotentialRevenue = rows
      .filter(r => !r.purchased)
      .reduce((sum, r) => sum + r.price, 0);

    const activePrestataires = new Set(
      LOCATIONS.map(l => l.id_prestataire).filter((id): id is number => typeof id === 'number' && id > 0)
    ).size;

    const totalActivity = rows.reduce((sum, r) => sum + r.activityScore, 0);
    const maxActivity = Math.max(...rows.map(r => r.activityScore), 1);

    const locationStats: LocationRow[] = rows
      .map(r => ({
        ...r,
        percentage: Math.round((r.activityScore / maxActivity) * 100),
      }))
      .sort((a, b) => b.activityScore - a.activityScore);

    const topLocations: TopLocation[] = locationStats.slice(0, 6).map(loc => ({
      id: loc.id,
      name: loc.name,
      activityScore: loc.activityScore,
      quests: loc.quests,
      quizzes: loc.quizzes,
      events: loc.events,
      blogs: loc.blogs,
      services: loc.services,
    }));

    const typeCounts = new Map<string, number>();
    rows.forEach(r => {
      typeCounts.set(r.typeName, (typeCounts.get(r.typeName) || 0) + 1);
    });

    const typeColors = ['#d97706', '#b45309', '#92400e', '#3b82f6', '#10b981'];
    const typeDistribution: DistributionItem[] = Array.from(typeCounts.entries()).map(([label, count], index) => ({
      label,
      count,
      percentage: totalLocations > 0 ? Math.round((count / totalLocations) * 100) : 0,
      color: typeColors[index % typeColors.length],
    }));

    const ownershipRaw = [
      {
        label: 'Owned by providers',
        count: rows.filter(r => r.purchased && r.ownerName !== 'System').length,
        color: '#10b981',
      },
      {
        label: 'System',
        count: rows.filter(r => r.ownerName === 'System').length,
        color: '#3b82f6',
      },
      {
        label: 'Available',
        count: availableLocations,
        color: '#f59e0b',
      },
    ];

    const ownershipDistribution: DistributionItem[] = ownershipRaw
      .filter(item => item.count > 0)
      .map(item => ({
        ...item,
        percentage: totalLocations > 0 ? Math.round((item.count / totalLocations) * 100) : 0,
      }));

    const bucketDefs = [
      { range: '0-49', min: 0, max: 49 },
      { range: '50-99', min: 50, max: 99 },
      { range: '100-149', min: 100, max: 149 },
      { range: '150-199', min: 150, max: 199 },
      { range: '200+', min: 200, max: Number.POSITIVE_INFINITY },
    ];

    const priceBuckets: PriceBucket[] = bucketDefs.map(bucket => {
      const count = rows.filter(r => r.price >= bucket.min && r.price <= bucket.max).length;
      return {
        range: bucket.range,
        count,
        percentage: totalLocations > 0 ? Math.round((count / totalLocations) * 100) : 0,
      };
    });

    return {
      stats: {
        totalLocations,
        purchasedLocations,
        availableLocations,
        activePrestataires,
        storyLocations,
        buyableLocations,
        averagePrice,
        totalPotentialRevenue,
        totalActivity,
      },
      typeDistribution,
      ownershipDistribution,
      topLocations,
      locationStats,
      priceBuckets,
    };
  },
};
