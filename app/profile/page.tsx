import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import ProfileInfo from "@/components/profile-info"

export default function ProfilePage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-gradient-to-b from-zinc-900 to-black">
      <div className="w-full max-w-md space-y-8 py-8">
        <div className="flex items-center justify-between">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              ← Zurück
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-white">Mein Profil</h1>
          <div className="w-[73px]"></div> {/* Spacer for centering */}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profil Informationen</CardTitle>
            <CardDescription>Deine persönlichen Daten und Kontaktinformationen</CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileInfo />
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button className="w-full" asChild>
              <Link href="/profile/edit">Profil bearbeiten</Link>
            </Button>
            <Separator className="my-2" />
            <Button variant="outline" className="w-full" asChild>
              <Link href="/profile/change-password">Passwort ändern</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}

