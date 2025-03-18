"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Calendar, Clock, MapPin } from "lucide-react"
import { mockEvents } from "@/lib/mock-data"
import type { Event } from "@/types/event"
import { format, parseISO } from "date-fns"
import { de } from "date-fns/locale"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default function EventsPage() {
  const [loading, setLoading] = useState(true)
  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setEvents(mockEvents)
      } catch (error) {
        console.error("Error fetching events:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center p-4 bg-gradient-to-b from-zinc-900 to-black">
        <div className="w-full max-w-3xl py-8 space-y-6">
          <h1 className="text-2xl font-bold text-white">Events</h1>
          <Card>
            <CardContent className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  // Filter events by status
  const upcomingEvents = events.filter((event) => event.status === "upcoming")
  const pastEvents = events.filter((event) => event.status === "past")

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-gradient-to-b from-zinc-900 to-black">
      <div className="w-full max-w-3xl py-8 space-y-6">
        <h1 className="text-2xl font-bold text-white">Events</h1>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">Kommende Events</TabsTrigger>
            <TabsTrigger value="past">Vergangene Events</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-4 space-y-4">
            {upcomingEvents.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Keine kommenden Events gefunden.</p>
                </CardContent>
              </Card>
            ) : (
              upcomingEvents.map((event) => <EventCard key={event.id} event={event} />)
            )}
          </TabsContent>

          <TabsContent value="past" className="mt-4 space-y-4">
            {pastEvents.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Keine vergangenen Events gefunden.</p>
                </CardContent>
              </Card>
            ) : (
              pastEvents.map((event) => <EventCard key={event.id} event={event} />)
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

interface EventCardProps {
  event: Event
}

function EventCard({ event }: EventCardProps) {
  const formattedDate = format(parseISO(event.date), "EEEE, d. MMMM yyyy", { locale: de })

  return (
    <Card className="overflow-hidden">
      <div className="relative h-40 w-full">
        <img
          src={event.imageUrl || "/placeholder.svg"}
          alt={event.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4">
          <h2 className="text-xl font-bold text-white">{event.name}</h2>
          <div className="flex items-center gap-2 text-white/80 text-sm mt-1">
            <Calendar className="h-4 w-4" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              {event.startTime} - {event.endTime} Uhr
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{event.location}</span>
          </div>
          <p className="text-sm line-clamp-2 mt-1">{event.description}</p>

          <div className="flex flex-wrap gap-2 mt-1">
            {event.djs.slice(0, 2).map((dj) => (
              <Badge key={dj.id} variant="secondary" className="text-xs">
                {dj.name}
              </Badge>
            ))}
            {event.djs.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{event.djs.length - 2} weitere
              </Badge>
            )}
          </div>

          <div className="flex justify-end mt-2">
            <Button asChild>
              <Link href={`/events/${event.id}`}>Details</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

