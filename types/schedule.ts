import type { Author } from "./post"

export type ShiftType = "Kasse" | "Garderobe" | "Springer" | "Bar" | "Theke" | "Security" | "Reinigung"

export interface Shift {
  id: string
  date: string // ISO date string
  startTime: string // HH:MM format
  endTime: string // HH:MM format
  type: ShiftType
  staff: Author | null
  eventId?: string
  notes?: string
}

export interface Availability {
  id: string
  userId: string
  date: string // ISO date string
  isAvailable: boolean
  reason?: string
}

export interface ScheduleDay {
  date: string // ISO date string
  shifts: Shift[]
  hasEvent: boolean
  eventId?: string
}

export interface MonthSchedule {
  year: number
  month: number // 0-11
  days: ScheduleDay[]
}

