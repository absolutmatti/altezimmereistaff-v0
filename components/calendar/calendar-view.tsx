"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
} from "date-fns"
import { de } from "date-fns/locale"
import type { CalendarDay as CalendarDayType } from "@/types/calendar"
import { cn } from "@/lib/utils"

interface CalendarViewProps {
  days: CalendarDayType[]
  onDayClick: (date: Date) => void
  loading?: boolean
}

export default function CalendarView({ days, onDayClick, loading = false }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [visibleMonths, setVisibleMonths] = useState<Date[]>([])
  const calendarRef = useRef<HTMLDivElement>(null)

  // Initialize with 3 months (previous, current, next)
  useEffect(() => {
    const prevMonth = subMonths(currentDate, 1)
    const nextMonth = addMonths(currentDate, 1)
    setVisibleMonths([prevMonth, currentDate, nextMonth])
  }, [currentDate])

  // Handle scroll to load more months
  useEffect(() => {
    const handleScroll = () => {
      if (!calendarRef.current) return

      const { scrollTop, scrollHeight, clientHeight } = calendarRef.current
      const scrollBottom = scrollTop + clientHeight

      // Load more months when scrolling down
      if (scrollBottom >= scrollHeight - 200) {
        setVisibleMonths((prev) => {
          const lastMonth = prev[prev.length - 1]
          const nextMonth = addMonths(lastMonth, 1)
          return [...prev, nextMonth]
        })
      }

      // Load more months when scrolling up
      if (scrollTop <= 200) {
        setVisibleMonths((prev) => {
          const firstMonth = prev[0]
          const prevMonth = subMonths(firstMonth, 1)
          return [prevMonth, ...prev]
        })
      }
    }

    const calendarElement = calendarRef.current
    if (calendarElement) {
      calendarElement.addEventListener("scroll", handleScroll)
    }

    return () => {
      if (calendarElement) {
        calendarElement.removeEventListener("scroll", handleScroll)
      }
    }
  }, [])

  const handlePreviousMonth = () => {
    setCurrentDate((prev) => subMonths(prev, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate((prev) => addMonths(prev, 1))
  }

  const handleTodayClick = () => {
    setCurrentDate(new Date())

    // Scroll to current month
    if (calendarRef.current) {
      const currentMonthElement = document.getElementById(`month-${format(new Date(), "yyyy-MM")}`)
      if (currentMonthElement) {
        currentMonthElement.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[600px]">
      <div className="flex items-center justify-between p-4 border-b">
        <Button variant="outline" size="sm" onClick={handlePreviousMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleTodayClick}>
            Heute
          </Button>
          <h2 className="text-lg font-semibold">{format(currentDate, "MMMM yyyy", { locale: de })}</h2>
        </div>
        <Button variant="outline" size="sm" onClick={handleNextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 p-2 text-center text-xs font-medium text-muted-foreground">
        {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((day) => (
          <div key={day} className="py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto" ref={calendarRef}>
        <div className="space-y-6 pb-6">
          {visibleMonths.map((month) => (
            <CalendarMonth
              key={format(month, "yyyy-MM")}
              month={month}
              days={days}
              onDayClick={onDayClick}
              id={`month-${format(month, "yyyy-MM")}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

interface CalendarMonthProps {
  month: Date
  days: CalendarDayType[]
  onDayClick: (date: Date) => void
  id: string
}

function CalendarMonth({ month, days, onDayClick, id }: CalendarMonthProps) {
  const monthStart = startOfMonth(month)
  const monthEnd = endOfMonth(month)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Calculate days from previous month to fill the first row
  const firstDayOfMonth = monthStart.getDay() || 7 // Convert Sunday (0) to 7 for European calendar
  const prevMonthDays = firstDayOfMonth > 1 ? firstDayOfMonth - 1 : 0

  // Calculate total rows needed
  const totalDays = monthDays.length + prevMonthDays
  const rows = Math.ceil(totalDays / 7)

  // Create calendar grid
  const calendarGrid: Date[] = []

  // Add days from previous month
  for (let i = 1; i <= prevMonthDays; i++) {
    const date = new Date(monthStart)
    date.setDate(date.getDate() - (prevMonthDays - i + 1))
    calendarGrid.push(date)
  }

  // Add days from current month
  calendarGrid.push(...monthDays)

  // Add days from next month to fill the last row
  const remainingDays = rows * 7 - calendarGrid.length
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(monthEnd)
    date.setDate(date.getDate() + i)
    calendarGrid.push(date)
  }

  return (
    <div id={id} className="space-y-1">
      <h3 className="px-4 text-sm font-medium">{format(month, "MMMM yyyy", { locale: de })}</h3>
      <div className="grid grid-cols-7 gap-1 p-2">
        {calendarGrid.map((date, i) => {
          const isCurrentMonth = isSameMonth(date, month)
          const dateString = format(date, "yyyy-MM-dd")
          const dayData = days.find((day) => format(day.date, "yyyy-MM-dd") === dateString)

          return (
            <CalendarDay
              key={i}
              date={date}
              isCurrentMonth={isCurrentMonth}
              dayData={dayData}
              onClick={() => onDayClick(date)}
            />
          )
        })}
      </div>
    </div>
  )
}

interface CalendarDayComponentProps {
  date: Date
  isCurrentMonth: boolean
  dayData?: CalendarDayType
  onClick: () => void
}

function CalendarDay({ date, isCurrentMonth, dayData, onClick }: CalendarDayComponentProps) {
  const isToday = isSameDay(date, new Date())

  return (
    <button
      className={cn(
        "h-12 w-full rounded-md flex flex-col items-center justify-center relative",
        isCurrentMonth ? "text-foreground" : "text-muted-foreground opacity-50",
        isToday && "bg-accent text-accent-foreground",
        "hover:bg-accent/50 transition-colors",
      )}
      onClick={onClick}
    >
      <span
        className={cn(
          "text-sm",
          (dayData?.hasEvent ||
            dayData?.hasMeeting ||
            dayData?.hasShift ||
            dayData?.hasAvailability ||
            dayData?.hasStaffAvailability) &&
            "font-bold",
        )}
      >
        {format(date, "d")}
      </span>

      {isCurrentMonth && (
        <div className="flex gap-0.5 mt-0.5">
          {dayData?.hasEvent && <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />}
          {dayData?.hasMeeting && <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />}
          {dayData?.hasShift && <div className="h-1.5 w-1.5 rounded-full bg-green-500" />}
          {dayData?.hasAvailability && <div className="h-1.5 w-1.5 rounded-full bg-red-500" />}
          {dayData?.hasStaffAvailability && <div className="h-1.5 w-1.5 rounded-full bg-yellow-500" />}
        </div>
      )}
    </button>
  )
}

