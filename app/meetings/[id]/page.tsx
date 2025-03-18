"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Loader2,
  Calendar,
  Clock,
  MapPin,
  ChevronLeft,
  CalendarPlus,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  FileText,
  Edit,
  Info,
  CheckSquare,
  ListTodo,
} from "lucide-react"
import { mockMeetings } from "@/lib/mock-data"
import type { Meeting, MeetingProtocolItem } from "@/types/meeting"
import { format, parseISO } from "date-fns"
import { de } from "date-fns/locale"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface MeetingPageProps {
  params: {
    id: string
  }
}

export default function MeetingPage({ params }: MeetingPageProps) {
  const [loading, setLoading] = useState(true)
  const [meeting, setMeeting] = useState<Meeting | null>(null)
  const [declineReason, setDeclineReason] = useState("")
  const [showDeclineDialog, setShowDeclineDialog] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const foundMeeting = mockMeetings.find((m) => m.id === params.id)
        if (foundMeeting) {
          setMeeting(foundMeeting)
        } else {
          // Meeting not found, redirect to meetings page
          router.push("/meetings")
        }
      } catch (error) {
        console.error("Error fetching meeting:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMeeting()
  }, [params.id, router])

  const handleAddToCalendar = () => {
    toast({
      title: "Zum Kalender hinzugefügt",
      description: "Die Besprechung wurde zu deinem Kalender hinzugefügt.",
    })
  }

  const handleAttend = () => {
    toast({
      title: "Teilnahme bestätigt",
      description: "Deine Teilnahme wurde bestätigt.",
    })
  }

  const handleDecline = () => {
    setShowDeclineDialog(true)
  }

  const submitDecline = () => {
    toast({
      title: "Absage gesendet",
      description: "Deine Absage wurde gesendet.",
    })
    setShowDeclineDialog(false)
  }

  // Mock current user ID
  const currentUserId = "staff1"
  const isOwner = currentUserId === "owner1" || currentUserId === "owner2"

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center p-4 bg-gradient-to-b from-zinc-900 to-black">
        <div className="w-full max-w-3xl py-8 space-y-6">
          <div className="flex items-center">
            <Link href="/meetings">
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

  if (!meeting) {
    return (
      <main className="flex min-h-screen flex-col items-center p-4 bg-gradient-to-b from-zinc-900 to-black">
        <div className="w-full max-w-3xl py-8 space-y-6">
          <div className="flex items-center">
            <Link href="/meetings">
              <Button variant="ghost" size="sm">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Zurück
              </Button>
            </Link>
          </div>
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Besprechung nicht gefunden.</p>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  const formattedDate = format(parseISO(meeting.date), "EEEE, d. MMMM yyyy", { locale: de })

  // Get current user's attendance status
  const currentAttendee = meeting.attendees.find((a) => a.user.id === currentUserId)
  const attendanceStatus = currentAttendee?.status || "pending"

  // Count attendees by status
  const attending = meeting.attendees.filter((a) => a.status === "attending").length
  const declined = meeting.attendees.filter((a) => a.status === "declined").length
  const pending = meeting.attendees.filter((a) => a.status === "pending").length

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-gradient-to-b from-zinc-900 to-black">
      <div className="w-full max-w-3xl py-8 space-y-6">
        <div className="flex items-center">
          <Link href="/meetings">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Zurück
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge
                className={
                  meeting.status === "upcoming" ? "bg-primary/20 text-primary" : "bg-secondary/20 text-secondary"
                }
              >
                {meeting.status === "upcoming" ? "Kommende Besprechung" : "Vergangene Besprechung"}
              </Badge>
            </div>
            <CardTitle className="text-xl">{meeting.title}</CardTitle>
            <CardDescription>
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {meeting.startTime} - {meeting.endTime} Uhr
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{meeting.location}</span>
                </div>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line mb-4">{meeting.description}</p>

            {meeting.status === "upcoming" && (
              <div className="flex flex-col gap-4 mt-6">
                <h3 className="text-sm font-medium">Dein Status</h3>
                <div className="flex gap-2">
                  <Button
                    variant={attendanceStatus === "attending" ? "default" : "outline"}
                    size="sm"
                    className="gap-2"
                    onClick={handleAttend}
                  >
                    <CheckCircle className="h-4 w-4" />
                    Teilnehmen
                  </Button>
                  <Button
                    variant={attendanceStatus === "declined" ? "destructive" : "outline"}
                    size="sm"
                    className="gap-2"
                    onClick={handleDecline}
                  >
                    <XCircle className="h-4 w-4" />
                    Absagen
                  </Button>

                  <Dialog open={showDeclineDialog} onOpenChange={setShowDeclineDialog}>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Besprechung absagen</DialogTitle>
                        <DialogDescription>Bitte gib einen Grund für deine Absage an.</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <Textarea
                          placeholder="Grund für die Absage"
                          value={declineReason}
                          onChange={(e) => setDeclineReason(e.target.value)}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowDeclineDialog(false)}>
                          Abbrechen
                        </Button>
                        <Button variant="destructive" onClick={submitDecline}>
                          Absagen
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2 mt-4">
              {meeting.status === "upcoming" && (
                <Button variant="outline" size="sm" className="gap-2" onClick={handleAddToCalendar}>
                  <CalendarPlus className="h-4 w-4" />
                  Zum Kalender hinzufügen
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="attendees" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="attendees" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Teilnehmer</span>
            </TabsTrigger>
            <TabsTrigger value="protocol" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Protokoll</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="attendees" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Teilnehmer</CardTitle>
                <CardDescription>{meeting.attendees.length} Personen eingeladen</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-xs">{attending} zugesagt</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span className="text-xs">{declined} abgesagt</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                    <span className="text-xs">{pending} ausstehend</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {meeting.attendees.map((attendee, index) => (
                    <div key={attendee.user.id}>
                      {index > 0 && <Separator className="my-4" />}
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={attendee.user.profileImage} alt={attendee.user.name} />
                            <AvatarFallback>{attendee.user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{attendee.user.name}</p>
                            <Badge
                              variant="outline"
                              className={`
                              text-xs mt-1
                              ${attendee.status === "attending" ? "bg-green-500/20 text-green-500" : ""}
                              ${attendee.status === "declined" ? "bg-red-500/20 text-red-500" : ""}
                              ${attendee.status === "pending" ? "bg-yellow-500/20 text-yellow-500" : ""}
                            `}
                            >
                              {attendee.status === "attending"
                                ? "Zugesagt"
                                : attendee.status === "declined"
                                  ? "Abgesagt"
                                  : "Ausstehend"}
                            </Badge>
                          </div>
                        </div>

                        {attendee.status === "declined" && attendee.declineReason && (
                          <div className="text-xs text-muted-foreground bg-muted p-2 rounded-md">
                            {attendee.declineReason}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="protocol" className="mt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Protokoll</CardTitle>
                  {isOwner && meeting.status === "past" && (
                    <Button variant="outline" size="sm" className="gap-2" asChild>
                      <Link href={`/meetings/${meeting.id}/edit-protocol`}>
                        <Edit className="h-4 w-4" />
                        {meeting.isProtocolFinalized ? "Bearbeiten" : "Erstellen"}
                      </Link>
                    </Button>
                  )}
                </div>
                <CardDescription>
                  {meeting.status === "upcoming"
                    ? "Das Protokoll wird nach der Besprechung verfügbar sein."
                    : meeting.isProtocolFinalized
                      ? "Finalisiertes Protokoll"
                      : "Protokoll noch nicht finalisiert"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {meeting.status === "upcoming" ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Das Protokoll wird nach der Besprechung verfügbar sein.</p>
                  </div>
                ) : !meeting.protocol || meeting.protocol.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Noch kein Protokoll verfügbar.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {meeting.protocol.map((item, index) => (
                      <ProtocolItem key={item.id} item={item} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

interface ProtocolItemProps {
  item: MeetingProtocolItem
}

function ProtocolItem({ item }: ProtocolItemProps) {
  const typeIcons = {
    info: <Info className="h-5 w-5 text-blue-500" />,
    decision: <CheckSquare className="h-5 w-5 text-green-500" />,
    task: <ListTodo className="h-5 w-5 text-yellow-500" />,
  }

  const typeLabels = {
    info: "Information",
    decision: "Entscheidung",
    task: "Aufgabe",
  }

  return (
    <div className="p-4 rounded-md bg-accent/50">
      <div className="flex items-center gap-2 mb-2">
        {typeIcons[item.type]}
        <Badge
          variant="outline"
          className={`
          text-xs
          ${item.type === "info" ? "bg-blue-500/20 text-blue-500" : ""}
          ${item.type === "decision" ? "bg-green-500/20 text-green-500" : ""}
          ${item.type === "task" ? "bg-yellow-500/20 text-yellow-500" : ""}
        `}
        >
          {typeLabels[item.type]}
        </Badge>
      </div>

      <h3 className="font-medium mb-1">{item.title}</h3>
      <p className="text-sm">{item.content}</p>

      {item.type === "task" && item.assignedTo && (
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-muted-foreground">Zugewiesen an:</span>
          <div className="flex items-center gap-1">
            <Avatar className="h-5 w-5">
              <AvatarImage src={item.assignedTo.profileImage} alt={item.assignedTo.name} />
              <AvatarFallback>{item.assignedTo.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-xs">{item.assignedTo.name}</span>
          </div>
          {item.dueDate && (
            <div className="flex items-center gap-1 ml-2">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {format(parseISO(item.dueDate), "d. MMMM yyyy", { locale: de })}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

