"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarDays } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import AvailabilityForm from "@/components/schedule/availability-form"
import CalendarView from "@/components/calendar/calendar-view"
import DayDetail from "@/components/calendar/day-detail"
import { mockEvents, mockMeetings, mockSchedule, mockAvailability } from "@/lib/mock-data"
import { format, parseISO } from "date-fns"
import type { CalendarDay } from "@/types/calendar"

export default function CalendarPage() {
  const [showAvailabilityForm, setShowAvailabilityForm] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showDayDetail, setShowDayDetail] = useState(false)
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([])
  const [loading, setLoading] = useState(true)

  // Mock current user ID
  const currentUserId = "staff1"
  const isOwner = false // Set to true for owner view

  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Process events
        const eventDays = mockEvents.map((event) => {
          const date = parseISO(event.date)
          return {
            date,
            dateString: format(date, "yyyy-MM-dd"),
            hasEvent: true,
            event,
          }
        })

        // Process meetings
        const meetingDays = mockMeetings.map((meeting) => {
          const date = parseISO(meeting.date)
          return {
            date,
            dateString: format(date, "yyyy-MM-dd"),
            hasMeeting: true,
            meeting,
          }
        })

        // Process shifts
        const shiftDays: CalendarDay[] = []
        mockSchedule.days.forEach((day) => {
          const userShifts = day.shifts.filter((shift) => shift.staff?.id === currentUserId)
          if (userShifts.length > 0) {
            const date = parseISO(day.date)
            shiftDays.push({
              date,
              dateString: format(date, "yyyy-MM-dd"),
              hasShift: true,
              shifts: userShifts,
            })
          }
        })

        // Process availabilities
        const availabilityDays = mockAvailability
          .filter((a) => a.userId === currentUserId)
          .map((availability) => {
            const date = parseISO(availability.date)
            return {
              date,
              dateString: format(date, "yyyy-MM-dd"),
              hasAvailability: true,
              availability,
            }
          })

        // Process staff availabilities (for owners)
        const staffAvailabilityDays = isOwner
          ? mockAvailability
              .filter((a) => a.userId !== currentUserId)
              .map((availability) => {
                const date = parseISO(availability.date)
                return {
                  date,
                  dateString: format(date, "yyyy-MM-dd"),
                  hasStaffAvailability: true,
                  staffAvailability: availability,
                }
              })
          : []

        // Merge all days
        const allDays = [...eventDays, ...meetingDays, ...shiftDays, ...availabilityDays, ...staffAvailabilityDays]

        // Combine days with the same date
        const mergedDays: Record<string, CalendarDay> = {}

        allDays.forEach((day) => {
          if (!mergedDays[day.dateString]) {
            mergedDays[day.dateString] = {
              date: day.date,
              dateString: day.dateString,
              hasEvent: false,
              hasMeeting: false,
              hasShift: false,
              hasAvailability: false,
              hasStaffAvailability: false,
            }
          }

          // Merge properties
          if (day.hasEvent) {
            mergedDays[day.dateString].hasEvent = true
            mergedDays[day.dateString].event = day.event
          }

          if (day.hasMeeting) {
            mergedDays[day.dateString].hasMeeting = true
            mergedDays[day.dateString].meeting = day.meeting
          }

          if (day.hasShift) {
            mergedDays[day.dateString].hasShift = true
            mergedDays[day.dateString].shifts = day.shifts
          }

          if (day.hasAvailability) {
            mergedDays[day.dateString].hasAvailability = true
            mergedDays[day.dateString].availability = day.availability
          }

          if (day.hasStaffAvailability) {
            mergedDays[day.dateString].hasStaffAvailability = true
            mergedDays[day.dateString].staffAvailability = day.staffAvailability
          }
        })

        setCalendarDays(Object.values(mergedDays))
      } catch (error) {
        console.error("Error fetching calendar data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCalendarData()
  }, [currentUserId, isOwner])

  const handleDayClick = (date: Date) => {
    setSelectedDate(date)
    setShowDayDetail(true)
  }

  const handleAddAvailabilityForDay = (date: Date) => {
    setSelectedDate(date)
    setShowAvailabilityForm(true)
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-gradient-to-b from-zinc-900 to-black">
      <div className="w-full max-w-3xl py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Kalender</h1>
          <Dialog open={showAvailabilityForm} onOpenChange={setShowAvailabilityForm}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <CalendarDays className="h-4 w-4" />
                Abwesenheit angeben
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Abwesenheit angeben</DialogTitle>
                <DialogDescription>
                  Gib hier an, wann du nicht verfügbar bist, z.B. wegen Urlaub oder anderen Terminen.
                </DialogDescription>
              </DialogHeader>
              <AvailabilityForm onSuccess={() => setShowAvailabilityForm(false)} initialDate={selectedDate} />
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="p-0">
            <CalendarView days={calendarDays} onDayClick={handleDayClick} loading={loading} />
          </CardContent>
        </Card>

        <Dialog open={showDayDetail} onOpenChange={setShowDayDetail}>
          <DialogContent className="sm:max-w-[500px]">
            {selectedDate && (
              <DayDetail
                date={selectedDate}
                calendarDays={calendarDays}
                onAddAvailability={handleAddAvailabilityForDay}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </main>
  )
}

