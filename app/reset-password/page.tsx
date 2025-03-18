import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import ResetPasswordForm from "@/components/reset-password-form"

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-zinc-900 to-black">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Alte Zimmerei</h1>
          <p className="text-zinc-400">Passwort zurücksetzen</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Passwort zurücksetzen</CardTitle>
            <CardDescription>
              Gib deine E-Mail-Adresse ein, um einen Link zum Zurücksetzen deines Passworts zu erhalten.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResetPasswordForm />
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="link" asChild>
              <Link href="/">Zurück zum Login</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}

