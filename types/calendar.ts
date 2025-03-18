import type { Event } from "./event"
import type { Meeting } from "./meeting"
import type { Shift, Availability } from "./schedule"

export interface CalendarDay {
  date: Date
  dateString: string
  hasEvent?: boolean
  event?: Event
  hasMeeting?: boolean
  meeting?: Meeting
  hasShift?: boolean
  shifts?: Shift[]
  hasAvailability?: boolean
  availability?: Availability
  hasStaffAvailability?: boolean
  staffAvailability?: Availability
}

export interface CalendarMonth {
  year: number
  month: number
  days: CalendarDay[]
}

