import { defineStore } from 'pinia'
import { eventService } from '@/services/eventService'
import type { LocationMock } from '@/mocks/locations'
import type { EventInput, EventUpdateInput } from '@/mocks/events'

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
  location?: LocationMock
  sold?: number
  capacity?: number
  price?: number
}

export interface EventReservation {
  id_reservation: number
  id_user: number
  id_event: number
  quantity: number
  total_price: number
  status: string
  created_at: string
  event?: Event
}


export type { EventInput, EventUpdateInput }

export const useEventStore = defineStore('event', {
  state: () => ({
    events: [] as Event[],
    currentEvent: null as Event | null,
    userReservations: [] as EventReservation[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchEvents(filters?: { id_location?: number; published?: boolean }) {
      this.loading = true
      try {
        this.events = await eventService.getEvents(filters) as Event[]
      } catch (err: unknown) {
        this.error = err instanceof Error ? err.message : 'Unknown error'
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
      } catch (err: unknown) {
        this.error = err instanceof Error ? err.message : 'Unknown error'
        return null
      } finally {
        this.loading = false
      }
    },

    async createEvent(eventData: EventInput) {
      this.loading = true
      try {
        const newEvent = await eventService.createEvent(eventData)
        this.events.push(newEvent as Event)
        return newEvent
      } catch (err: unknown) {
        this.error = err instanceof Error ? err.message : 'Unknown error'
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateEvent(id: number, eventData: EventUpdateInput) {
      this.loading = true
      try {
        const updatedEvent = await eventService.updateEvent(id, eventData)
        const index = this.events.findIndex(e => e.id_event === id)
        if (index !== -1) {
          this.events[index] = updatedEvent as Event
        }
        return updatedEvent
      } catch (err: unknown) {
        this.error = err instanceof Error ? err.message : 'Unknown error'
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
      } catch (err: unknown) {
        this.error = err instanceof Error ? err.message : 'Unknown error'
        throw err
      } finally {
        this.loading = false
      }
    },

    async bookEvent(eventId: number, quantity: number) {
      this.loading = true
      try {
        return await eventService.bookEvent(eventId, quantity)
      } catch (err: unknown) {
        this.error = err instanceof Error ? err.message : 'Unknown error'
        throw err
      } finally {
        this.loading = false
      }
    },

    async fetchUserReservations() {
      this.loading = true
      try {
        this.userReservations = await eventService.getUserReservations()
      } catch (err: unknown) {
        this.error = err instanceof Error ? err.message : 'Unknown error'
      } finally {
        this.loading = false
      }
    },

    async fetchEventReservations(eventId: number) {
      this.loading = true
      try {
        return await eventService.getEventReservations(eventId)
      } catch (err: unknown) {
        this.error = err instanceof Error ? err.message : 'Unknown error'
        throw err
      } finally {
        this.loading = false
      }
    }
  }
})
