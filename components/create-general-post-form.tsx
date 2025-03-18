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
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Loader2, ImageIcon, X } from "lucide-react"

const formSchema = z.object({
  content: z.string().min(1, { message: "Der Inhalt darf nicht leer sein." }),
  categories: z.array(z.string()).optional(),
})

const categoryOptions = [
  { id: "freizeit", label: "Freizeit" },
  { id: "dienstwechsel", label: "Dienstwechsel" },
  { id: "anfrage", label: "Anfrage" },
  { id: "frage", label: "Frage" },
  { id: "hilfe", label: "Hilfe" },
  { id: "foto", label: "Foto" },
  { id: "event", label: "Event" },
]

export default function CreateGeneralPostForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mediaPreview, setMediaPreview] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      categories: [],
    },
  })

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
      // Here you would implement your actual post creation logic
      console.log("Creating post with:", { ...values, mediaPreview })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Success notification
      toast({
        title: "Post erstellt",
        description: "Dein Post wurde erfolgreich erstellt.",
      })

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Post creation error:", error)
      toast({
        title: "Fehler beim Erstellen",
        description: "Dein Post konnte nicht erstellt werden.",
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
            <CardTitle>Neuer Post</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Was möchtest du teilen?</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Schreibe etwas..." className="min-h-[150px]" {...field} />
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

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => router.push("/dashboard")}
            disabled={isSubmitting}
          >
            Abbrechen
          </Button>
          <Button type="submit" className="flex-1" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Erstellen...
              </>
            ) : (
              "Post erstellen"
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

