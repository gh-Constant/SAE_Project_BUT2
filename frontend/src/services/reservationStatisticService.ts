import {
  reservationStatisticMockService,
  ReservationStatisticsData
} from './mock/reservationStatisticMockService'

const isMockEnabled = import.meta.env.VITE_NO_BACKEND === 'true'
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

const reservationStatisticServiceImpl = {
  getStatistics: async (): Promise<ReservationStatisticsData> => {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/reservations/statistics`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch reservation statistics')
    }

    return await response.json()
  },
}

export const reservationStatisticService = isMockEnabled
  ? reservationStatisticMockService
  : reservationStatisticServiceImpl

// Re-export types
export * from './mock/reservationStatisticMockService'
