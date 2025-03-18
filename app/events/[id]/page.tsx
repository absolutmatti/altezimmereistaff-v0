"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Loader2,
  Calendar,
  Clock,
  MapPin,
  Download,
  Music,
  Users,
  Ticket,
  ChevronLeft,
  CalendarPlus,
} from "lucide-react"
import { mockEvents } from "@/lib/mock-data"
import type { Event } from "@/types/event"
import type { Shift, ShiftType } from "@/types/schedule"
import { format, parseISO } from "date-fns"
import { de } from "date-fns/locale"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

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

interface EventPageProps {
  params: {
    id: string
  }
}

export default function EventPage({ params }: EventPageProps) {
  const [loading, setLoading] = useState(true)
  const [event, setEvent] = useState<Event | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const foundEvent = mockEvents.find((e) => e.id === params.id)
        if (foundEvent) {
          setEvent(foundEvent)
        } else {
          // Event not found, redirect to events page
          router.push("/events")
        }
      } catch (error) {
        console.error("Error fetching event:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [params.id, router])

  const handleAddToCalendar = () => {
    toast({
      title: "Zum Kalender hinzugefügt",
      description: "Das Event wurde zu deinem Kalender hinzugefügt.",
    })
  }

  const handleDownloadFlyer = () => {
    toast({
      title: "Flyer wird heruntergeladen",
      description: "Der Flyer wird heruntergeladen.",
    })
  }

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center p-4 bg-gradient-to-b from-zinc-900 to-black">
        <div className="w-full max-w-3xl py-8 space-y-6">
          <div className="flex items-center">
            <Link href="/events">
              <Button variant="ghost" size="sm">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Zurück
              </Button>
            </Link>
          </div>
          <Card>
            <CardContent className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  if (!event) {
    return (
      <main className="flex min-h-screen flex-col items-center p-4 bg-gradient-to-b from-zinc-900 to-black">
        <div className="w-full max-w-3xl py-8 space-y-6">
          <div className="flex items-center">
            <Link href="/events">
              <Button variant="ghost" size="sm">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Zurück
              </Button>
            </Link>
          </div>
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Event nicht gefunden.</p>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  const formattedDate = format(parseISO(event.date), "EEEE, d. MMMM yyyy", { locale: de })

  // Group shifts by type
  const shiftsByType: Record<ShiftType, Shift[]> = {}
  event.shifts.forEach((shift) => {
    if (!shiftsByType[shift.type]) {
      shiftsByType[shift.type] = []
    }
    shiftsByType[shift.type].push(shift)
  })

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-gradient-to-b from-zinc-900 to-black">
      <div className="w-full max-w-3xl py-8 space-y-6">
        <div className="flex items-center">
          <Link href="/events">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Zurück
            </Button>
          </Link>
        </div>

        <div className="relative h-48 w-full rounded-lg overflow-hidden">
          <img
            src={event.imageUrl || "/placeholder.svg"}
            alt={event.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-0 left-0 p-4">
            <h1 className="text-2xl font-bold text-white">{event.name}</h1>
            <div className="flex items-center gap-2 text-white/80 text-sm mt-1">
              <Calendar className="h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge className="bg-primary/20 text-primary">
                {event.status === "upcoming" ? "Kommendes Event" : "Vergangenes Event"}
              </Badge>
              {event.tickets.friendPlus && (
                <Badge variant="outline" className="bg-green-500/20 text-green-500">
                  Freund+ Tickets
                </Badge>
              )}
              {event.tickets.friends && (
                <Badge variant="outline" className="bg-blue-500/20 text-blue-500">
                  Freunde Tickets
                </Badge>
              )}
            </div>
            <CardDescription>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {event.startTime} - {event.endTime} Uhr
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{event.location}</span>
                </div>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line">{event.description}</p>

            <div className="flex flex-wrap gap-2 mt-4">
              {event.flyerUrl && (
                <Button variant="outline" size="sm" className="gap-2" onClick={handleDownloadFlyer}>
                  <Download className="h-4 w-4" />
                  Flyer herunterladen
                </Button>
              )}
              <Button variant="outline" size="sm" className="gap-2" onClick={handleAddToCalendar}>
                <CalendarPlus className="h-4 w-4" />
                Zum Kalender hinzufügen
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="djs" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="djs" className="flex items-center gap-2">
              <Music className="h-4 w-4" />
              <span>DJs</span>
            </TabsTrigger>
            <TabsTrigger value="staff" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Personal</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="djs" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Line-Up</CardTitle>
                <CardDescription>
                  {event.djs.length} {event.djs.length === 1 ? "DJ" : "DJs"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {event.djs.map((dj, index) => (
                    <div key={dj.id}>
                      {index > 0 && <Separator className="my-4" />}
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{dj.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {dj.startTime} - {dj.endTime} Uhr
                          </p>
                          {dj.notes && <p className="text-xs mt-1 text-muted-foreground">{dj.notes}</p>}
                        </div>
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{dj.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staff" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Personal</CardTitle>
                <CardDescription>
                  {event.shifts.length} {event.shifts.length === 1 ? "Dienst" : "Dienste"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(shiftsByType).map(([type, shifts]) => (
                    <div key={type}>
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Badge className={`${shiftTypeColors[type as ShiftType]} text-white`}>{type}</Badge>
                        <span>
                          {shifts.length} {shifts.length === 1 ? "Person" : "Personen"}
                        </span>
                      </h3>
                      <div className="space-y-2">
                        {shifts.map((shift) => (
                          <div key={shift.id} className="flex justify-between items-center p-2 rounded-md bg-accent/50">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                {shift.startTime} - {shift.endTime} Uhr
                              </span>
                            </div>
                            {shift.staff ? (
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{shift.staff.name}</span>
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={shift.staff.profileImage} alt={shift.staff.name} />
                                  <AvatarFallback>{shift.staff.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                              </div>
                            ) : (
                              <Badge variant="outline" className="text-xs bg-destructive/20">
                                Nicht besetzt
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Ticket className="h-5 w-5" />
              Tickets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-md bg-accent/50">
                <div>
                  <h3 className="font-medium">Freund+ Tickets</h3>
                  <p className="text-sm text-muted-foreground">Kostenlos für deinen besten Freund</p>
                </div>
                <Badge variant={event.tickets.friendPlus ? "default" : "secondary"}>
                  {event.tickets.friendPlus ? "Verfügbar" : "Nicht verfügbar"}
                </Badge>
              </div>

              <div className="flex justify-between items-center p-3 rounded-md bg-accent/50">
                <div>
                  <h3 className="font-medium">Freunde Tickets</h3>
                  <p className="text-sm text-muted-foreground">Vergünstigte Tickets für deine Freunde</p>
                </div>
                <Badge variant={event.tickets.friends ? "default" : "secondary"}>
                  {event.tickets.friends ? "Verfügbar" : "Nicht verfügbar"}
                </Badge>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">
              Bitte wende dich an die Eventleitung, um Tickets für deine Freunde zu reservieren.
            </p>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}

