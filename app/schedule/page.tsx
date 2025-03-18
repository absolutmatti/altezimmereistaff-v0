"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, UserCircle } from "lucide-react"
import GeneralSchedule from "@/components/schedule/general-schedule"
import PersonalSchedule from "@/components/schedule/personal-schedule"

export default function SchedulePage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-gradient-to-b from-zinc-900 to-black">
      <div className="w-full max-w-3xl py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Dienstplan</h1>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Allgemeiner Dienstplan</span>
            </TabsTrigger>
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <UserCircle className="h-4 w-4" />
              <span>Meine Dienste</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="general" className="mt-4">
            <GeneralSchedule />
          </TabsContent>
          <TabsContent value="personal" className="mt-4">
            <PersonalSchedule />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

