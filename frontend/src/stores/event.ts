import { defineStore } from 'pinia'
import { eventService } from '@/services/eventService'

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
        this.events = await eventService.getEvents(filters) as Event[]
      } catch (err: any) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async fetchEventById(id: number) {
      this.loading = true
      try {
        const event = await eventService.getEventById(id)
        this.currentEvent = event as Event
        return event
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
        const newEvent = await eventService.createEvent(eventData)
        this.events.push(newEvent as Event)
        return newEvent
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
        const updatedEvent = await eventService.updateEvent(id, eventData)
        const index = this.events.findIndex(e => e.id_event === id)
        if (index !== -1) {
          this.events[index] = updatedEvent as Event
        }
        return updatedEvent
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
        await eventService.deleteEvent(id)
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
        return await eventService.bookEvent(eventId, quantity)
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
        this.userReservations = await eventService.getUserReservations()
      } catch (err: any) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    }
  }
})
