"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, Upload } from "lucide-react"

const formSchema = z
  .object({
    name: z.string().min(2, { message: "Der Name muss mindestens 2 Zeichen lang sein." }),
    email: z.string().email({ message: "Bitte gib eine gültige E-Mail-Adresse ein." }),
    phone: z.string().optional(),
    password: z.string().min(8, { message: "Das Passwort muss mindestens 8 Zeichen lang sein." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Die Passwörter stimmen nicht überein.",
    path: ["confirmPassword"],
  })

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      // Here you would implement your actual registration logic
      // For example, using Firebase, Auth.js, or a custom API
      console.log("Registration with:", { ...values, profileImage })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Success notification
      toast({
        title: "Konto erstellt",
        description: "Deine Registrierung war erfolgreich. Du kannst dich jetzt anmelden.",
      })

      // Redirect to login or dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        title: "Fehler bei der Registrierung",
        description: "Bitte versuche es später erneut oder kontaktiere den Support.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col items-center mb-4">
          <Avatar className="w-24 h-24 mb-2">
            <AvatarImage src={profileImage || ""} alt="Profilbild" />
            <AvatarFallback className="bg-zinc-800 text-zinc-400 text-xl">
              {profileImage ? null : <Upload className="h-8 w-8" />}
            </AvatarFallback>
          </Avatar>
          <label htmlFor="profile-image" className="cursor-pointer">
            <span className="text-sm text-primary">Profilbild hochladen</span>
            <input id="profile-image" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Dein Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefonnummer (optional)</FormLabel>
              <FormControl>
                <Input placeholder="+49 123 4567890" {...field} />
              </FormControl>
              <FormDescription>Wird nur für interne Kommunikation verwendet</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Passwort</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Passwort bestätigen</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Registrieren...
            </>
          ) : (
            "Registrieren"
          )}
        </Button>
      </form>
    </Form>
  )
}

