"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  email: z.string().email({ message: "Bitte gib eine gültige E-Mail-Adresse ein." }),
})

export default function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      // Here you would implement your actual password reset logic
      console.log("Password reset requested for:", values.email)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Success notification
      toast({
        title: "E-Mail gesendet",
        description:
          "Wenn ein Konto mit dieser E-Mail existiert, erhältst du einen Link zum Zurücksetzen deines Passworts.",
      })

      setIsSubmitted(true)
    } catch (error) {
      console.error("Password reset error:", error)
      toast({
        title: "Fehler",
        description: "Es gab ein Problem beim Senden der E-Mail. Bitte versuche es später erneut.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="text-center py-4">
        <h3 className="text-lg font-medium mb-2">E-Mail gesendet</h3>
        <p className="text-sm text-muted-foreground">
          Wenn ein Konto mit dieser E-Mail existiert, erhältst du in Kürze einen Link zum Zurücksetzen deines Passworts.
        </p>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-Mail</FormLabel>
              <FormControl>
                <Input placeholder="deine@email.de" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Senden...
            </>
          ) : (
            "Link zum Zurücksetzen senden"
          )}
        </Button>
      </form>
    </Form>
  )
}

