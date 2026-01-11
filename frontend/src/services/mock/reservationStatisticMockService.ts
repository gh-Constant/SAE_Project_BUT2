import { RESERVATIONS } from '@/mocks/reservations'
import { LOCATIONS } from '@/mocks/locations'
import { EVENTS } from '@/mocks/events'

// ================= Interfaces =================

export interface ReservationStatistics {
  totalReservations: number
  totalRevenue: number
  averageReservationValue: number
  confirmedCount: number
  cancelledCount: number
  totalEvents: number
  activeEvents: number
  soldTickets: number
  averageAttendance: number
}

export interface TopEvent {
  id: number
  title: string
  sold: number
  revenue: number
  capacity: number
  occupancy: number
}

export interface StatusDistribution {
  status: string
  count: number
  percentage: number
  color: string
  label: string
}

export interface LocationStat {
  id: number
  name: string
  reservationCount: number
  revenue: number
}

export interface ReservationStatisticsData {
  stats: ReservationStatistics
  statusDistribution: StatusDistribution[]
  locationStats: LocationStat[]
  topEvents: TopEvent[]
}

// ================= Helpers =================

function getLocationName(eventLocationId?: number): string {
  const location = LOCATIONS.find(l => l.id === eventLocationId)
  return location?.name || 'Lieu inconnu'
}

// ================= Mock Service =================

export const reservationStatisticMockService = {
  async getStatistics(): Promise<ReservationStatisticsData> {
    await new Promise(resolve => setTimeout(resolve, 300))

    const totalReservations = RESERVATIONS.length
    const totalRevenue = RESERVATIONS.reduce(
      (sum, r) => sum + r.total_price,
      0
    )

    const averageReservationValue =
      totalReservations > 0
        ? Math.round((totalRevenue / totalReservations) * 100) / 100
        : 0

    const confirmedCount = RESERVATIONS.filter(
      r => r.status === 'CONFIRMED'
    ).length

    const cancelledCount = RESERVATIONS.filter(
      r => r.status === 'CANCELLED'
    ).length

    // ===== Event Stats =====
    const totalEvents = EVENTS.length
    const activeEvents = EVENTS.filter(e => e.published).length
    const soldTickets = EVENTS.reduce((sum, e) => sum + (e.sold || 0), 0)
    const totalCapacity = EVENTS.reduce((sum, e) => sum + (e.capacity || 0), 0)
    const averageAttendance = totalCapacity > 0 ? Math.round((soldTickets / totalCapacity) * 100) : 0

    // ===== Top Events =====
    const topEvents: TopEvent[] = EVENTS.map(e => ({
      id: e.id_event,
      title: e.title,
      sold: e.sold || 0,
      revenue: (e.sold || 0) * (e.price || 0),
      capacity: e.capacity || 100,
      occupancy: Math.round(((e.sold || 0) / (e.capacity || 100)) * 100)
    }))
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5)

    // ===== Status distribution =====

    const statuses = [
      { key: 'CONFIRMED', label: 'Confirmées', color: '#10b981' },
      { key: 'PENDING', label: 'En attente', color: '#f59e0b' },
      { key: 'CANCELLED', label: 'Annulées', color: '#ef4444' },
    ]

    const statusDistribution: StatusDistribution[] = statuses.map(s => {
      const count = RESERVATIONS.filter(r => r.status === s.key).length
      return {
        status: s.key,
        label: s.label,
        count,
        percentage:
          totalReservations > 0
            ? Math.round((count / totalReservations) * 100)
            : 0,
        color: s.color,
      }
    })

    // ===== Location stats (tableau) =====

    const locationMap = new Map<number, LocationStat>()

    RESERVATIONS.forEach(r => {
      const locationId = r.event?.location?.id
      if (!locationId) return

      const current = locationMap.get(locationId) || {
        id: locationId,
        name: getLocationName(locationId),
        reservationCount: 0,
        revenue: 0,
      }

      current.reservationCount++
      current.revenue += r.total_price

      locationMap.set(locationId, current)
    })

    return {
      stats: {
        totalReservations,
        totalRevenue,
        averageReservationValue,
        confirmedCount,
        cancelledCount,
        totalEvents,
        activeEvents,
        soldTickets,
        averageAttendance
      },
      statusDistribution,
      locationStats: Array.from(locationMap.values()),
      topEvents
    }
  },
}
