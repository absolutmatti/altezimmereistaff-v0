"use client"

import { Button } from "@/components/ui/button"
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Users, CalendarDays } from "lucide-react"
import { format, isSameDay } from "date-fns"
import { de } from "date-fns/locale"
import type { CalendarDay } from "@/types/calendar"
import Link from "next/link"

interface DayDetailProps {
  date: Date
  calendarDays: CalendarDay[]
  onAddAvailability: (date: Date) => void
}

export default function DayDetail({ date, calendarDays, onAddAvailability }: DayDetailProps) {
  const formattedDate = format(date, "EEEE, d. MMMM yyyy", { locale: de })

  // Find day data for the selected date
  const dayData = calendarDays.find((day) => isSameDay(day.date, date))

  // Check if there are any entries for this day
  const hasEntries =
    dayData &&
    (dayData.hasEvent ||
      dayData.hasMeeting ||
      dayData.hasShift ||
      dayData.hasAvailability ||
      dayData.hasStaffAvailability)

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          {formattedDate}
        </DialogTitle>
        <DialogDescription>Details für diesen Tag</DialogDescription>
      </DialogHeader>

      <div className="space-y-4 my-4 max-h-[60vh] overflow-y-auto">
        {!hasEntries ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Keine Einträge für diesen Tag.</p>
          </div>
        ) : (
          <>
            {dayData?.hasEvent && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <Badge className="bg-blue-500">Event</Badge>
                </h3>
                <div className="p-3 rounded-md bg-accent/50">
                  <Link href={`/events/${dayData.event?.id}`} className="block">
                    <h4 className="font-medium">{dayData.event?.name}</h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <Clock className="h-3 w-3" />
                      <span>
                        {dayData.event?.startTime} - {dayData.event?.endTime} Uhr
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <MapPin className="h-3 w-3" />
                      <span>{dayData.event?.location}</span>
                    </div>
                  </Link>
                </div>
                <Separator />
              </div>
            )}

            {dayData?.hasMeeting && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <Badge className="bg-purple-500">Besprechung</Badge>
                </h3>
                <div className="p-3 rounded-md bg-accent/50">
                  <Link href={`/meetings/${dayData.meeting?.id}`} className="block">
                    <h4 className="font-medium">{dayData.meeting?.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <Clock className="h-3 w-3" />
                      <span>
                        {dayData.meeting?.startTime} - {dayData.meeting?.endTime} Uhr
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <MapPin className="h-3 w-3" />
                      <span>{dayData.meeting?.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <Users className="h-3 w-3" />
                      <span>
                        {dayData.meeting?.attendees.filter((a) => a.status === "attending").length} Teilnehmer
                      </span>
                    </div>
                  </Link>
                </div>
                <Separator />
              </div>
            )}

            {dayData?.hasShift && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <Badge className="bg-green-500">Dienst</Badge>
                </h3>
                {dayData.shifts?.map((shift, index) => (
                  <div key={index} className="p-3 rounded-md bg-accent/50">
                    <h4 className="font-medium">{shift.type}</h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <Clock className="h-3 w-3" />
                      <span>
                        {shift.startTime} - {shift.endTime} Uhr
                      </span>
                    </div>
                    {shift.eventId && (
                      <Link href={`/events/${shift.eventId}`} className="text-xs text-primary mt-1 block">
                        Zum Event
                      </Link>
                    )}
                  </div>
                ))}
                <Separator />
              </div>
            )}

            {dayData?.hasAvailability && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <Badge className="bg-red-500">Abwesenheit</Badge>
                </h3>
                <div className="p-3 rounded-md bg-accent/50">
                  <h4 className="font-medium">Du bist an diesem Tag abwesend</h4>
                  {dayData.availability?.reason && (
                    <p className="text-sm text-muted-foreground mt-1">{dayData.availability.reason}</p>
                  )}
                </div>
                <Separator />
              </div>
            )}

            {dayData?.hasStaffAvailability && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <Badge className="bg-yellow-500">Mitarbeiter-Abwesenheit</Badge>
                </h3>
                <div className="p-3 rounded-md bg-accent/50">
                  <h4 className="font-medium">Mitarbeiter abwesend</h4>
                  {dayData.staffAvailability?.reason && (
                    <p className="text-sm text-muted-foreground mt-1">{dayData.staffAvailability.reason}</p>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <DialogFooter>
        <Button variant="outline" className="w-full gap-2" onClick={() => onAddAvailability(date)}>
          <CalendarDays className="h-4 w-4" />
          Abwesenheit für {format(date, "d. MMMM", { locale: de })} angeben
        </Button>
      </DialogFooter>
    </>
  )
}

