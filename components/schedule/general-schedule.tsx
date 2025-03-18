"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { format, addMonths, subMonths } from "date-fns"
import { de } from "date-fns/locale"
import { mockSchedule } from "@/lib/mock-data"
import type { MonthSchedule, ShiftType } from "@/types/schedule"
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

export default function GeneralSchedule() {
  const [loading, setLoading] = useState(true)
  const [schedule, setSchedule] = useState<MonthSchedule | null>(null)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [filterType, setFilterType] = useState<string>("all")

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setSchedule(mockSchedule)
      } catch (error) {
        console.error("Error fetching schedule:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSchedule()
  }, [])

  const handlePreviousMonth = () => {
    setCurrentDate((prev) => subMonths(prev, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate((prev) => addMonths(prev, 1))
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  if (!schedule) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Dienstplan konnte nicht geladen werden.</p>
        </CardContent>
      </Card>
    )
  }

  // Filter days with shifts
  const daysWithShifts = schedule.days.filter((day) => day.shifts.length > 0)

  // Filter shifts by type if needed
  const filteredDays = daysWithShifts
    .map((day) => {
      if (filterType === "all") {
        return day
      }

      return {
        ...day,
        shifts: day.shifts.filter((shift) => shift.type === filterType),
      }
    })
    .filter((day) => day.shifts.length > 0)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>Monatsübersicht</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">{format(currentDate, "MMMM yyyy", { locale: de })}</span>
              <Button variant="outline" size="icon" onClick={handleNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardDescription>
            Übersicht aller Dienste für {format(currentDate, "MMMM yyyy", { locale: de })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Alle Diensttypen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Diensttypen</SelectItem>
                <SelectItem value="Kasse">Kasse</SelectItem>
                <SelectItem value="Garderobe">Garderobe</SelectItem>
                <SelectItem value="Bar">Bar</SelectItem>
                <SelectItem value="Springer">Springer</SelectItem>
                <SelectItem value="Theke">Theke</SelectItem>
                <SelectItem value="Security">Security</SelectItem>
                <SelectItem value="Reinigung">Reinigung</SelectItem>
                <SelectItem value="Grill">Grill</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredDays.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">Keine Dienste für diesen Monat gefunden.</div>
          ) : (
            <div className="space-y-4">
              {filteredDays.map((day) => (
                <Card key={day.date} className={day.hasEvent ? "border-primary" : ""}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">
                        {format(new Date(day.date), "EEEE, d. MMMM", { locale: de })}
                      </CardTitle>
                      {day.hasEvent && day.eventId && (
                        <Link href={`/events/${day.eventId}`}>
                          <Badge
                            variant="outline"
                            className="flex items-center gap-1 cursor-pointer hover:bg-primary/20"
                          >
                            <Calendar className="h-3 w-3" />
                            Event
                          </Badge>
                        </Link>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {day.shifts.map((shift) => (
                        <div key={shift.id} className="flex items-center justify-between p-2 rounded-md bg-accent/50">
                          <div className="flex items-center gap-2">
                            <Badge className={`${shiftTypeColors[shift.type]} text-white`}>{shift.type}</Badge>
                            <span className="text-sm">
                              {shift.startTime} - {shift.endTime} Uhr
                            </span>
                          </div>
                          <div>
                            {shift.staff ? (
                              <span className="text-sm font-medium">{shift.staff.name}</span>
                            ) : (
                              <Badge variant="outline" className="text-xs bg-destructive/20">
                                Nicht besetzt
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

