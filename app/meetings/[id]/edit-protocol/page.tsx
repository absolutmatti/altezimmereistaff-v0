"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, ChevronLeft, Plus, Trash2, Save, FileText } from "lucide-react"
import { mockMeetings } from "@/lib/mock-data"
import type { Meeting, MeetingProtocolItem } from "@/types/meeting"
import { format, parseISO } from "date-fns"
import { de } from "date-fns/locale"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface EditProtocolPageProps {
  params: {
    id: string
  }
}

export default function EditProtocolPage({ params }: EditProtocolPageProps) {
  const [loading, setLoading] = useState(true)
  const [meeting, setMeeting] = useState<Meeting | null>(null)
  const [protocol, setProtocol] = useState<MeetingProtocolItem[]>([])
  const [isSaving, setIsSaving] = useState(false)
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
          setProtocol(foundMeeting.protocol || [])
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

  const handleAddItem = () => {
    const newItem: MeetingProtocolItem = {
      id: `item-${Date.now()}`,
      title: "",
      content: "",
      type: "info",
    }

    setProtocol([...protocol, newItem])
  }

  const handleRemoveItem = (id: string) => {
    setProtocol(protocol.filter((item) => item.id !== id))
  }

  const handleUpdateItem = (id: string, field: keyof MeetingProtocolItem, value: any) => {
    setProtocol(
      protocol.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value }
        }
        return item
      }),
    )
  }

  const handleSave = async () => {
    setIsSaving(true)

    try {
      // Validate protocol items
      const invalidItems = protocol.filter((item) => !item.title || !item.content)
      if (invalidItems.length > 0) {
        toast({
          title: "Fehler beim Speichern",
          description: "Bitte fülle alle Felder aus.",
          variant: "destructive",
        })
        return
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Protokoll gespeichert",
        description: "Das Protokoll wurde erfolgreich gespeichert.",
      })

      // Redirect back to meeting page
      router.push(`/meetings/${params.id}`)
    } catch (error) {
      console.error("Error saving protocol:", error)
      toast({
        title: "Fehler beim Speichern",
        description: "Das Protokoll konnte nicht gespeichert werden.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleFinalize = async () => {
    setIsSaving(true)

    try {
      // Validate protocol items
      const invalidItems = protocol.filter((item) => !item.title || !item.content)
      if (invalidItems.length > 0) {
        toast({
          title: "Fehler beim Finalisieren",
          description: "Bitte fülle alle Felder aus.",
          variant: "destructive",
        })
        return
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Protokoll finalisiert",
        description: "Das Protokoll wurde erfolgreich finalisiert.",
      })

      // Redirect back to meeting page
      router.push(`/meetings/${params.id}`)
    } catch (error) {
      console.error("Error finalizing protocol:", error)
      toast({
        title: "Fehler beim Finalisieren",
        description: "Das Protokoll konnte nicht finalisiert werden.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center p-4 bg-gradient-to-b from-zinc-900 to-black">
        <div className="w-full max-w-3xl py-8 space-y-6">
          <div className="flex items-center">
            <Link href={`/meetings/${params.id}`}>
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

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-gradient-to-b from-zinc-900 to-black">
      <div className="w-full max-w-3xl py-8 space-y-6">
        <div className="flex items-center justify-between">
          <Link href={`/meetings/${params.id}`}>
            <Button variant="ghost" size="sm">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Zurück
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-white">Protokoll bearbeiten</h1>
          <div className="w-[73px]"></div> {/* Spacer for centering */}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {meeting.title}
            </CardTitle>
            <CardDescription>
              {formattedDate}, {meeting.startTime} - {meeting.endTime} Uhr
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {protocol.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Noch keine Protokolleinträge vorhanden.</p>
                <p className="text-sm mt-2">Klicke auf "Eintrag hinzufügen", um einen neuen Eintrag zu erstellen.</p>
              </div>
            ) : (
              protocol.map((item, index) => (
                <Card key={item.id} className="border border-accent">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base">Eintrag {index + 1}</CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Titel</label>
                        <Input
                          value={item.title}
                          onChange={(e) => handleUpdateItem(item.id, "title", e.target.value)}
                          placeholder="Titel des Eintrags"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Typ</label>
                        <Select value={item.type} onValueChange={(value) => handleUpdateItem(item.id, "type", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Typ auswählen" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="info">Information</SelectItem>
                            <SelectItem value="decision">Entscheidung</SelectItem>
                            <SelectItem value="task">Aufgabe</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Inhalt</label>
                      <Textarea
                        value={item.content}
                        onChange={(e) => handleUpdateItem(item.id, "content", e.target.value)}
                        placeholder="Inhalt des Eintrags"
                        rows={3}
                      />
                    </div>

                    {item.type === "task" && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Zugewiesen an</label>
                          <Select
                            value={item.assignedTo?.id}
                            onValueChange={(value) => {
                              const assignedTo = [...meeting.attendees.map((a) => a.user), meeting.createdBy].find(
                                (user) => user.id === value,
                              )
                              handleUpdateItem(item.id, "assignedTo", assignedTo)
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Person auswählen" />
                            </SelectTrigger>
                            <SelectContent>
                              {[...meeting.attendees.map((a) => a.user), meeting.createdBy]
                                .filter((user, index, self) => index === self.findIndex((u) => u.id === user.id))
                                .map((user) => (
                                  <SelectItem key={user.id} value={user.id}>
                                    {user.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Fälligkeitsdatum</label>
                          <Input
                            type="date"
                            value={item.dueDate}
                            onChange={(e) => handleUpdateItem(item.id, "dueDate", e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}

            <Button variant="outline" className="w-full gap-2" onClick={handleAddItem}>
              <Plus className="h-4 w-4" />
              Eintrag hinzufügen
            </Button>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.push(`/meetings/${params.id}`)} disabled={isSaving}>
              Abbrechen
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2" onClick={handleSave} disabled={isSaving}>
                <Save className="h-4 w-4" />
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Speichern...
                  </>
                ) : (
                  "Speichern"
                )}
              </Button>
              <Button className="gap-2" onClick={handleFinalize} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Finalisieren...
                  </>
                ) : (
                  "Finalisieren"
                )}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}

