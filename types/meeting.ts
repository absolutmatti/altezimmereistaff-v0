import type { Author } from "./post"

export interface MeetingAttendee {
  user: Author
  status: "attending" | "declined" | "pending"
  declineReason?: string
}

export interface MeetingProtocolItem {
  id: string
  title: string
  content: string
  type: "info" | "decision" | "task"
  assignedTo?: Author
  dueDate?: string
}

export interface Meeting {
  id: string
  title: string
  date: string // ISO date string
  startTime: string // HH:MM format
  endTime: string // HH:MM format
  location: string
  description: string
  createdBy: Author
  attendees: MeetingAttendee[]
  protocol?: MeetingProtocolItem[]
  status: "upcoming" | "ongoing" | "past"
  isProtocolFinalized: boolean
}

