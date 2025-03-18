import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import EditProfileForm from "@/components/edit-profile-form"

export default function EditProfilePage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-gradient-to-b from-zinc-900 to-black">
      <div className="w-full max-w-md space-y-8 py-8">
        <div className="flex items-center justify-between">
          <Link href="/profile">
            <Button variant="ghost" size="sm">
              ← Zurück
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-white">Profil bearbeiten</h1>
          <div className="w-[73px]"></div> {/* Spacer for centering */}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profil bearbeiten</CardTitle>
            <CardDescription>Aktualisiere deine persönlichen Informationen</CardDescription>
          </CardHeader>
          <CardContent>
            <EditProfileForm />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

