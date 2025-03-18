import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import NewsFeed from "@/components/news-feed"
import GeneralFeed from "@/components/general-feed"

export default function Dashboard() {
  return (
    <div className="flex min-h-screen flex-col items-center p-4 bg-gradient-to-b from-zinc-900 to-black">
      <div className="w-full max-w-3xl py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Alte Zimmerei</h1>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/profile">Profil</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">Abmelden</Link>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="news" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="news">Neuigkeiten</TabsTrigger>
            <TabsTrigger value="general">Allgemein</TabsTrigger>
          </TabsList>
          <TabsContent value="news" className="mt-4">
            <NewsFeed />
          </TabsContent>
          <TabsContent value="general" className="mt-4">
            <GeneralFeed />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

