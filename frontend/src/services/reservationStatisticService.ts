import {
  reservationStatisticMockService,
  ReservationStatisticsData
} from './mock/reservationStatisticMockService'
import apiClient from './apiClient'

const isMockEnabled = import.meta.env.VITE_NO_BACKEND === 'true'

const reservationStatisticServiceImpl = {
  getStatistics: async (): Promise<ReservationStatisticsData> => {
    try {
      const response = await apiClient.get('/reservations/statistics')
      return response.data
    } catch {
      throw new Error('Failed to fetch reservation statistics')
    }
  },
}

export const reservationStatisticService = isMockEnabled
  ? reservationStatisticMockService
  : reservationStatisticServiceImpl

// Re-export types
export * from './mock/reservationStatisticMockService'
