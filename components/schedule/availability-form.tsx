"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Calendar } from "lucide-react"
import { format } from "date-fns"
import { de } from "date-fns/locale"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const formSchema = z
  .object({
    startDate: z.date({
      required_error: "Bitte wähle ein Startdatum aus.",
    }),
    endDate: z.date({
      required_error: "Bitte wähle ein Enddatum aus.",
    }),
    reason: z.string().min(1, "Bitte gib einen Grund an.").max(100, "Der Grund darf maximal 100 Zeichen lang sein."),
  })
  .refine((data) => data.startDate <= data.endDate, {
    message: "Das Enddatum muss nach dem Startdatum liegen.",
    path: ["endDate"],
  })

interface AvailabilityFormProps {
  onSuccess?: () => void
  initialDate?: Date | null
}

export default function AvailabilityForm({ onSuccess, initialDate }: AvailabilityFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startDate: initialDate || undefined,
      endDate: initialDate || undefined,
      reason: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      console.log("Submitting availability:", values)

      toast({
        title: "Abwesenheit gespeichert",
        description: "Deine Abwesenheit wurde erfolgreich gespeichert.",
      })

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("Error submitting availability:", error)
      toast({
        title: "Fehler",
        description: "Deine Abwesenheit konnte nicht gespeichert werden.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Von</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                      >
                        {field.value ? format(field.value, "PPP", { locale: de }) : <span>Datum auswählen</span>}
                        <Calendar className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Bis</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                      >
                        {field.value ? format(field.value, "PPP", { locale: de }) : <span>Datum auswählen</span>}
                        <Calendar className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => {
                        const startDate = form.getValues("startDate")
                        return date < new Date() || (startDate && date < startDate)
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Grund</FormLabel>
              <FormControl>
                <Textarea placeholder="z.B. Urlaub, Krankheit, privater Termin" className="resize-none" {...field} />
              </FormControl>
              <FormDescription>Gib einen kurzen Grund für deine Abwesenheit an.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Speichern...
            </>
          ) : (
            "Abwesenheit speichern"
          )}
        </Button>
      </form>
    </Form>
  )
}

