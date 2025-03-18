"use client"

import type React from "react"

import { useState, useEffect } from "react"
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

const formSchema = z.object({
  name: z.string().min(2, { message: "Der Name muss mindestens 2 Zeichen lang sein." }),
  phone: z.string().optional(),
})

// Mock user data - in a real app, this would come from your authentication system
type UserProfile = {
  name: string
  email: string
  phone?: string
  profileImage?: string
}

export default function EditProfileForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [initialProfile, setInitialProfile] = useState<UserProfile | null>(null)
  const [isDataLoading, setIsDataLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  })

  useEffect(() => {
    // Simulate fetching user profile data
    const fetchProfile = async () => {
      try {
        // In a real app, this would be an API call to get the user's profile
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data
        const profile = {
          name: "Max Mustermann",
          email: "max@altezimmerei.de",
          phone: "+49 123 4567890",
          profileImage: "/placeholder.svg?height=200&width=200",
        }

        setInitialProfile(profile)
        setProfileImage(profile.profileImage)

        // Set form values
        form.reset({
          name: profile.name,
          phone: profile.phone || "",
        })
      } catch (error) {
        console.error("Error fetching profile:", error)
        toast({
          title: "Fehler",
          description: "Profildaten konnten nicht geladen werden.",
          variant: "destructive",
        })
      } finally {
        setIsDataLoading(false)
      }
    }

    fetchProfile()
  }, [form, toast])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      // Here you would implement your actual profile update logic
      console.log("Updating profile with:", { ...values, profileImage })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Success notification
      toast({
        title: "Profil aktualisiert",
        description: "Deine Profilinformationen wurden erfolgreich aktualisiert.",
      })

      // Redirect back to profile page
      router.push("/profile")
    } catch (error) {
      console.error("Profile update error:", error)
      toast({
        title: "Fehler beim Aktualisieren",
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

  if (isDataLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col items-center mb-4">
          <Avatar className="w-24 h-24 mb-2">
            <AvatarImage src={profileImage || ""} alt="Profilbild" />
            <AvatarFallback className="bg-zinc-800 text-zinc-400 text-xl">
              {initialProfile?.name
                .split(" ")
                .map((n) => n[0])
                .join("") || <Upload className="h-8 w-8" />}
            </AvatarFallback>
          </Avatar>
          <label htmlFor="profile-image" className="cursor-pointer">
            <span className="text-sm text-primary">Profilbild ändern</span>
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

        <div className="flex gap-4 pt-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => router.push("/profile")}
            disabled={isLoading}
          >
            Abbrechen
          </Button>
          <Button type="submit" className="flex-1" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Speichern...
              </>
            ) : (
              "Speichern"
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

