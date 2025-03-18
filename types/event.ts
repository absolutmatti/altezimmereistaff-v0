import type { Author } from "./post"
import type { Shift } from "./schedule"

export interface DJ {
  id: string
  name: string
  startTime: string // HH:MM format
  endTime: string // HH:MM format
  notes?: string
}

export interface TicketType {
  id: string
  name: string
  price: number
  available: boolean
  limit?: number
  remaining?: number
}

export interface Event {
  id: string
  name: string
  date: string // ISO date string
  startTime: string // HH:MM format
  endTime: string // HH:MM format
  description: string
  location: string
  imageUrl: string
  flyerUrl?: string
  djs: DJ[]
  shifts: Shift[]
  tickets: {
    friendPlus: boolean // kostenlos für besten Freund
    friends: boolean // vergünstigt
  }
  status: "upcoming" | "ongoing" | "past"
  createdBy: Author
}

