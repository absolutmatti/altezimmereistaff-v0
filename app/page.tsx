import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LoginForm from "@/components/login-form"
import RegisterForm from "@/components/register-form"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-zinc-900 to-black">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Alte Zimmerei</h1>
          <p className="text-zinc-400">Staffmember Portal</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Registrieren</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Melde dich mit deinen Zugangsdaten an.</CardDescription>
              </CardHeader>
              <CardContent>
                <LoginForm />
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button variant="link" asChild>
                  <Link href="/reset-password">Passwort vergessen?</Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Registrieren</CardTitle>
                <CardDescription>Erstelle ein neues Konto für den Mitarbeiterzugang.</CardDescription>
              </CardHeader>
              <CardContent>
                <RegisterForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

