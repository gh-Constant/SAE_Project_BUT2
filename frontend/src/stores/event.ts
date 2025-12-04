import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export interface EventCategory {
  id_event_category?: number
  name: string
  price: number
  capacity: number
  sold?: number
}

export interface Event {
  id_event: number
  title: string
  description?: string
  start_time: string
  end_time: string
  published: boolean
  id_location: number
  categories: EventCategory[]
  location?: any
  sold?: number
  capacity?: number
  price?: number
}

export const useEventStore = defineStore('event', {
  state: () => ({
    events: [] as Event[],
    currentEvent: null as Event | null,
    userReservations: [] as any[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchEvents(filters?: { id_location?: number; published?: boolean }) {
      this.loading = true
      try {
        const response = await axios.get(`${API_URL}/events`, { params: filters })
        this.events = response.data
      } catch (err: any) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async fetchEventById(id: number) {
      this.loading = true
      try {
        const response = await axios.get(`${API_URL}/events/${id}`)
        this.currentEvent = response.data
        return response.data
      } catch (err: any) {
        this.error = err.message
        return null
      } finally {
        this.loading = false
      }
    },

    async createEvent(eventData: any) {
      this.loading = true
      try {
        const token = localStorage.getItem('token')
        const response = await axios.post(`${API_URL}/events`, eventData, {
          headers: { Authorization: `Bearer ${token}` }
        })
        this.events.push(response.data)
        return response.data
      } catch (err: any) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateEvent(id: number, eventData: any) {
      this.loading = true
      try {
        const token = localStorage.getItem('token')
        const response = await axios.put(`${API_URL}/events/${id}`, eventData, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const index = this.events.findIndex(e => e.id_event === id)
        if (index !== -1) {
          this.events[index] = response.data
        }
        return response.data
      } catch (err: any) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    async deleteEvent(id: number) {
      this.loading = true
      try {
        const token = localStorage.getItem('token')
        await axios.delete(`${API_URL}/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        this.events = this.events.filter(e => e.id_event !== id)
      } catch (err: any) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    async bookEvent(eventId: number, quantity: number) {
      this.loading = true
      try {
        const token = localStorage.getItem('token')
        const response = await axios.post(`${API_URL}/events/book`, { eventId, quantity }, {
          headers: { Authorization: `Bearer ${token}` }
        })
        return response.data
      } catch (err: any) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    async fetchUserReservations() {
      this.loading = true
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${API_URL}/events/user/reservations`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        this.userReservations = response.data
      } catch (err: any) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    }
  }
})
