import { Button } from "@/components/ui/button"
import Link from "next/link"
import CreatePostForm from "@/components/create-post-form"

export default function CreatePostPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-gradient-to-b from-zinc-900 to-black">
      <div className="w-full max-w-3xl py-8 space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              ← Zurück
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-white">Neuen Post erstellen</h1>
          <div className="w-[73px]"></div> {/* Spacer for centering */}
        </div>

        <CreatePostForm />
      </div>
    </main>
  )
}

