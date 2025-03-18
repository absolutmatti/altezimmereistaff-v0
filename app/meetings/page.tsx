"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, Calendar, Clock, MapPin, CalendarPlus, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { mockMeetings } from "@/lib/mock-data"
import type { Meeting, MeetingAttendee } from "@/types/meeting"
import { format, parseISO } from "date-fns"
import { de } from "date-fns/locale"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function MeetingsPage() {
  const [loading, setLoading] = useState(true)
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setMeetings(mockMeetings)
      } catch (error) {
        console.error("Error fetching meetings:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMeetings()
  }, [])

  const handleAddToCalendar = (meeting: Meeting) => {
    toast({
      title: "Zum Kalender hinzugefügt",
      description: `Die Besprechung "${meeting.title}" wurde zu deinem Kalender hinzugefügt.`,
    })
  }

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center p-4 bg-gradient-to-b from-zinc-900 to-black">
        <div className="w-full max-w-3xl py-8 space-y-6">
          <h1 className="text-2xl font-bold text-white">Besprechungen</h1>
          <Card>
            <CardContent className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  // Filter meetings by status
  const upcomingMeetings = meetings.filter((meeting) => meeting.status === "upcoming")
  const pastMeetings = meetings.filter((meeting) => meeting.status === "past")

  // Get the next meeting
  const nextMeeting =
    upcomingMeetings.length > 0
      ? upcomingMeetings.sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.startTime}`)
          const dateB = new Date(`${b.date}T${b.startTime}`)
          return dateA.getTime() - dateB.getTime()
        })[0]
      : null

  // Get current user (mock)
  const currentUserId = "staff1"

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-gradient-to-b from-zinc-900 to-black">
      <div className="w-full max-w-3xl py-8 space-y-6">
        <h1 className="text-2xl font-bold text-white">Besprechungen</h1>

        {nextMeeting ? (
          <Card className="border-primary/50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Nächste Besprechung
              </CardTitle>
              <CardDescription>
                {format(parseISO(nextMeeting.date), "EEEE, d. MMMM yyyy", { locale: de })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold">{nextMeeting.title}</h2>
                  <div className="flex flex-col gap-1 mt-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>
                        {nextMeeting.startTime} - {nextMeeting.endTime} Uhr
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{nextMeeting.location}</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm">{nextMeeting.description}</p>

                <div>
                  <h3 className="text-sm font-medium mb-2">Teilnehmer ({nextMeeting.attendees.length})</h3>
                  <div className="flex flex-wrap gap-2">
                    {nextMeeting.attendees.map((attendee) => (
                      <AttendeeStatus key={attendee.user.id} attendee={attendee} />
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="text-sm font-medium">Dein Status</h3>
                  <AttendanceButtons
                    meeting={nextMeeting}
                    userId={currentUserId}
                    onStatusChange={(status) => {
                      // In a real app, this would update the status on the server
                      toast({
                        title: status === "attending" ? "Teilnahme bestätigt" : "Absage gesendet",
                        description:
                          status === "attending"
                            ? `Du nimmst an der Besprechung "${nextMeeting.title}" teil.`
                            : `Du hast für die Besprechung "${nextMeeting.title}" abgesagt.`,
                      })
                    }}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="gap-2" onClick={() => handleAddToCalendar(nextMeeting)}>
                <CalendarPlus className="h-4 w-4" />
                Zum Kalender hinzufügen
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Noch keine Besprechung geplant.</p>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">Kommende Besprechungen</TabsTrigger>
            <TabsTrigger value="past">Vergangene Besprechungen</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-4 space-y-4">
            {upcomingMeetings.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Keine kommenden Besprechungen gefunden.</p>
                </CardContent>
              </Card>
            ) : (
              upcomingMeetings.map((meeting) => <MeetingCard key={meeting.id} meeting={meeting} />)
            )}
          </TabsContent>

          <TabsContent value="past" className="mt-4 space-y-4">
            {pastMeetings.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Keine vergangenen Besprechungen gefunden.</p>
                </CardContent>
              </Card>
            ) : (
              pastMeetings.map((meeting) => <MeetingCard key={meeting.id} meeting={meeting} />)
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

interface MeetingCardProps {
  meeting: Meeting
}

function MeetingCard({ meeting }: MeetingCardProps) {
  const formattedDate = format(parseISO(meeting.date), "EEEE, d. MMMM yyyy", { locale: de })

  // Count attendees by status
  const attending = meeting.attendees.filter((a) => a.status === "attending").length
  const declined = meeting.attendees.filter((a) => a.status === "declined").length
  const pending = meeting.attendees.filter((a) => a.status === "pending").length

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{meeting.title}</CardTitle>
        <CardDescription>{formattedDate}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              {meeting.startTime} - {meeting.endTime} Uhr
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{meeting.location}</span>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-xs">{attending}</span>
            </div>
            <div className="flex items-center gap-1">
              <XCircle className="h-4 w-4 text-red-500" />
              <span className="text-xs">{declined}</span>
            </div>
            <div className="flex items-center gap-1">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              <span className="text-xs">{pending}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild>
          <Link href={`/meetings/${meeting.id}`}>Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

interface AttendeeStatusProps {
  attendee: MeetingAttendee
}

function AttendeeStatus({ attendee }: AttendeeStatusProps) {
  const statusColors = {
    attending: "bg-green-500/20 text-green-500 hover:bg-green-500/30",
    declined: "bg-red-500/20 text-red-500 hover:bg-red-500/30",
    pending: "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30",
  }

  const statusText = {
    attending: "Zugesagt",
    declined: "Abgesagt",
    pending: "Ausstehend",
  }

  return (
    <div className="flex items-center gap-1">
      <Avatar className="h-6 w-6">
        <AvatarImage src={attendee.user.profileImage} alt={attendee.user.name} />
        <AvatarFallback>{attendee.user.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="text-xs font-medium">{attendee.user.name}</span>
        <Badge variant="outline" className={`text-xs ${statusColors[attendee.status]}`}>
          {statusText[attendee.status]}
        </Badge>
      </div>
    </div>
  )
}

interface AttendanceButtonsProps {
  meeting: Meeting
  userId: string
  onStatusChange: (status: "attending" | "declined") => void
}

function AttendanceButtons({ meeting, userId, onStatusChange }: AttendanceButtonsProps) {
  const attendee = meeting.attendees.find((a) => a.user.id === userId)

  if (!attendee) {
    return <p className="text-sm text-muted-foreground">Du bist nicht zu dieser Besprechung eingeladen.</p>
  }

  return (
    <div className="flex gap-2">
      <Button
        variant={attendee.status === "attending" ? "default" : "outline"}
        size="sm"
        className="gap-2"
        onClick={() => onStatusChange("attending")}
      >
        <CheckCircle className="h-4 w-4" />
        Teilnehmen
      </Button>
      <Button
        variant={attendee.status === "declined" ? "destructive" : "outline"}
        size="sm"
        className="gap-2"
        onClick={() => onStatusChange("declined")}
      >
        <XCircle className="h-4 w-4" />
        Absagen
      </Button>
    </div>
  )
}

