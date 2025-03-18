"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Calendar, Clock, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { de } from "date-fns/locale"
import { mockSchedule, mockAvailability } from "@/lib/mock-data"
import type { Shift, Availability, ShiftType } from "@/types/schedule"
import Link from "next/link"

const shiftTypeColors: Record<ShiftType, string> = {
  Kasse: "bg-blue-500",
  Garderobe: "bg-purple-500",
  Springer: "bg-yellow-500",
  Bar: "bg-green-500",
  Theke: "bg-indigo-500",
  Security: "bg-red-500",
  Reinigung: "bg-gray-500",
  Grill: "bg-orange-500",
}

export default function PersonalSchedule() {
  const [loading, setLoading] = useState(true)
  const [myShifts, setMyShifts] = useState<Shift[]>([])
  const [myAvailability, setMyAvailability] = useState<Availability[]>([])

  // Mock current user ID
  const currentUserId = "staff1"

  useEffect(() => {
    const fetchPersonalSchedule = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Get all shifts for the current user
        const allShifts: Shift[] = []
        mockSchedule.days.forEach((day) => {
          day.shifts.forEach((shift) => {
            if (shift.staff?.id === currentUserId) {
              allShifts.push(shift)
            }
          })
        })

        // Sort shifts by date and time
        allShifts.sort((a, b) => {
          const dateA = new Date(a.date + "T" + a.startTime)
          const dateB = new Date(b.date + "T" + b.startTime)
          return dateA.getTime() - dateB.getTime()
        })

        setMyShifts(allShifts)

        // Get availability for the current user
        const availability = mockAvailability.filter((a) => a.userId === currentUserId)
        setMyAvailability(availability)
      } catch (error) {
        console.error("Error fetching personal schedule:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPersonalSchedule()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardContent className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  // Group shifts by month
  const shiftsByMonth: Record<string, Shift[]> = {}
  myShifts.forEach((shift) => {
    const monthYear = format(new Date(shift.date), "MMMM yyyy", { locale: de })
    if (!shiftsByMonth[monthYear]) {
      shiftsByMonth[monthYear] = []
    }
    shiftsByMonth[monthYear].push(shift)
  })

  return (
    <div className="space-y-6">
      {myAvailability.length > 0 && (
        <Card className="border-yellow-500/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              Deine Abwesenheiten
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {myAvailability.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2 rounded-md bg-yellow-500/10">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {format(new Date(item.date), "EEEE, d. MMMM yyyy", { locale: de })}
                    </span>
                  </div>
                  <Badge variant="outline" className="bg-yellow-500/20">
                    {item.reason}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {Object.keys(shiftsByMonth).length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Du hast aktuell keine Dienste.</p>
          </CardContent>
        </Card>
      ) : (
        Object.entries(shiftsByMonth).map(([monthYear, shifts]) => (
          <Card key={monthYear}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{monthYear}</CardTitle>
              <CardDescription>
                {shifts.length} {shifts.length === 1 ? "Dienst" : "Dienste"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {shifts.map((shift) => {
                  // Find the event for this shift if it exists
                  const day = mockSchedule.days.find((d) => d.date === shift.date)
                  const hasEvent = day?.hasEvent
                  const eventId = day?.eventId

                  return (
                    <div key={shift.id} className="flex items-center justify-between p-2 rounded-md bg-accent/50">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Badge className={`${shiftTypeColors[shift.type]} text-white`}>{shift.type}</Badge>
                          <span className="text-sm font-medium">
                            {format(new Date(shift.date), "EEEE, d. MMMM", { locale: de })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>
                            {shift.startTime} - {shift.endTime} Uhr
                          </span>
                        </div>
                      </div>

                      {hasEvent && eventId && (
                        <Link href={`/events/${eventId}`}>
                          <Button variant="outline" size="sm" className="gap-1">
                            <Calendar className="h-3 w-3" />
                            Event
                          </Button>
                        </Link>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}

