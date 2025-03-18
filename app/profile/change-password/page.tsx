import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import ChangePasswordForm from "@/components/change-password-form"

export default function ChangePasswordPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-gradient-to-b from-zinc-900 to-black">
      <div className="w-full max-w-md space-y-8 py-8">
        <div className="flex items-center justify-between">
          <Link href="/profile">
            <Button variant="ghost" size="sm">
              ← Zurück
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-white">Passwort ändern</h1>
          <div className="w-[73px]"></div> {/* Spacer for centering */}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Passwort ändern</CardTitle>
            <CardDescription>Aktualisiere dein Passwort für mehr Sicherheit</CardDescription>
          </CardHeader>
          <CardContent>
            <ChangePasswordForm />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

