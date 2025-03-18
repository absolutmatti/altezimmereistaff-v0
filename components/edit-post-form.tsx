"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Loader2, ImageIcon, X, Plus, Minus } from "lucide-react"
import type { NewsPost } from "@/types/post"

const formSchema = z.object({
  title: z.string().min(3, { message: "Der Titel muss mindestens 3 Zeichen lang sein." }),
  content: z.string().min(10, { message: "Der Inhalt muss mindestens 10 Zeichen lang sein." }),
  important: z.boolean().default(false),
  categories: z.array(z.string()).optional(),
  hasVoting: z.boolean().default(false),
  votingQuestion: z.string().optional(),
  votingOptions: z.array(z.string()).optional(),
  votingEndDate: z.string().optional(),
})

const categoryOptions = [
  { id: "announcement", label: "Ankündigung" },
  { id: "event", label: "Event" },
  { id: "important", label: "Wichtig" },
  { id: "schedule", label: "Dienstplan" },
  { id: "team", label: "Team" },
  { id: "training", label: "Schulung" },
  { id: "feedback", label: "Feedback" },
]

interface EditPostFormProps {
  post: NewsPost
}

export default function EditPostForm({ post }: EditPostFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mediaPreview, setMediaPreview] = useState<string | null>(post.mediaUrl || null)
  const [votingOptions, setVotingOptions] = useState<string[]>(
    post.voting?.options.map((o) => o.text) || ["Ja", "Nein"],
  )
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: post.title,
      content: post.content,
      important: post.important,
      categories: post.categories || [],
      hasVoting: post.hasVoting,
      votingQuestion: post.voting?.question || "",
      votingOptions: post.voting?.options.map((o) => o.text) || ["Ja", "Nein"],
      votingEndDate: post.voting?.endDate ? new Date(post.voting.endDate).toISOString().split("T")[0] : "",
    },
  })

  const watchHasVoting = form.watch("hasVoting")

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setMediaPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      // Here you would implement your actual post update logic
      console.log("Updating post with:", { ...values, mediaPreview, votingOptions })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Success notification
      toast({
        title: "Post aktualisiert",
        description: "Dein Post wurde erfolgreich aktualisiert.",
      })

      // Redirect to post detail
      router.push(`/news/${post.id}`)
    } catch (error) {
      console.error("Post update error:", error)
      toast({
        title: "Fehler beim Aktualisieren",
        description: "Dein Post konnte nicht aktualisiert werden.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Post Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titel</FormLabel>
                  <FormControl>
                    <Input placeholder="Titel des Posts" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Inhalt</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Inhalt des Posts" className="min-h-[200px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Bild/Video hinzufügen (optional)</FormLabel>
              <div className="mt-2">
                {mediaPreview ? (
                  <div className="relative mt-2">
                    <img
                      src={mediaPreview || "/placeholder.svg"}
                      alt="Media preview"
                      className="max-w-full h-auto rounded-md max-h-[300px]"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8 rounded-full"
                      onClick={() => setMediaPreview(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-md p-6 cursor-pointer hover:bg-accent/50 transition-colors">
                    <div className="flex flex-col items-center gap-2">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Klicke zum Hochladen</span>
                    </div>
                    <input type="file" accept="image/*,video/*" className="hidden" onChange={handleMediaUpload} />
                  </label>
                )}
              </div>
            </div>

            <FormField
              control={form.control}
              name="important"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Wichtiger Post</FormLabel>
                    <FormDescription>Markiert den Post als wichtig und sendet Benachrichtigungen.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categories"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Kategorien</FormLabel>
                    <FormDescription>Wähle eine oder mehrere Kategorien für deinen Post.</FormDescription>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {categoryOptions.map((option) => (
                      <FormField
                        key={option.id}
                        control={form.control}
                        name="categories"
                        render={({ field }) => {
                          return (
                            <FormItem key={option.id} className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(option.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...(field.value || []), option.id])
                                      : field.onChange(field.value?.filter((value) => value !== option.id))
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">{option.label}</FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Abstimmung</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="hasVoting"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Abstimmung hinzufügen</FormLabel>
                    <FormDescription>Fügt eine Abstimmung zu diesem Post hinzu.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            {watchHasVoting && (
              <div className="space-y-4 pt-2">
                <FormField
                  control={form.control}
                  name="votingQuestion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frage</FormLabel>
                      <FormControl>
                        <Input placeholder="Deine Abstimmungsfrage" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="votingOptions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Antwortoptionen</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          {votingOptions.map((option, index) => (
                            <div key={index} className="flex gap-2">
                              <Input
                                value={option}
                                onChange={(e) => {
                                  const newOptions = [...votingOptions]
                                  newOptions[index] = e.target.value
                                  setVotingOptions(newOptions)
                                  field.onChange(newOptions)
                                }}
                                placeholder={`Option ${index + 1}`}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                  if (votingOptions.length <= 2) return
                                  const newOptions = [...votingOptions]
                                  newOptions.splice(index, 1)
                                  setVotingOptions(newOptions)
                                  field.onChange(newOptions)
                                }}
                                disabled={votingOptions.length <= 2}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newOptions = [...votingOptions, ""]
                              setVotingOptions(newOptions)
                              field.onChange(newOptions)
                            }}
                            className="mt-2"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Option hinzufügen
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="votingEndDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Enddatum (optional)</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormDescription>Lasse das Feld leer für eine Abstimmung ohne Zeitlimit.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => router.push(`/news/${post.id}`)}
            disabled={isSubmitting}
          >
            Abbrechen
          </Button>
          <Button type="submit" className="flex-1" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Speichern...
              </>
            ) : (
              "Änderungen speichern"
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

