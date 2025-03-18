"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { User, Phone } from "lucide-react"

// Mock user data - in a real app, this would come from your authentication system
type UserProfile = {
  name: string
  email: string
  phone?: string
  profileImage?: string
}

export default function ProfileInfo() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching user profile data
    const fetchProfile = async () => {
      try {
        // In a real app, this would be an API call to get the user's profile
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data
        setProfile({
          name: "Max Mustermann",
          email: "max@altezimmerei.de",
          phone: "+49 123 4567890",
          profileImage: "/placeholder.svg?height=200&width=200",
        })
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-4">
        <div className="h-24 w-24 rounded-full bg-zinc-800 animate-pulse"></div>
        <div className="h-6 w-48 bg-zinc-800 rounded animate-pulse"></div>
        <div className="h-5 w-40 bg-zinc-800 rounded animate-pulse"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Profil konnte nicht geladen werden.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      <Avatar className="h-24 w-24 border-2 border-primary">
        <AvatarImage src={profile.profileImage} alt={profile.name} />
        <AvatarFallback className="text-2xl bg-zinc-800">
          {profile.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </AvatarFallback>
      </Avatar>

      <div className="text-center">
        <h2 className="text-xl font-bold">{profile.name}</h2>
        <p className="text-muted-foreground">{profile.email}</p>
      </div>

      <Card className="w-full bg-zinc-800/50 p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p>{profile.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Telefon</p>
              <p>{profile.phone || "Nicht angegeben"}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

