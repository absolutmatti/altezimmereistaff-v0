import { Button } from "@/components/ui/button"
import Link from "next/link"
import { notFound } from "next/navigation"
import { mockGeneralPosts } from "@/lib/mock-data"
import GeneralPostDetail from "@/components/general-post-detail"

interface PostPageProps {
  params: {
    id: string
  }
}

export default function GeneralPostPage({ params }: PostPageProps) {
  const post = mockGeneralPosts.find((p) => p.id === params.id)

  if (!post) {
    notFound()
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-gradient-to-b from-zinc-900 to-black">
      <div className="w-full max-w-3xl py-8 space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              ← Zurück
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-white">Post Details</h1>
          <div className="w-[73px]"></div> {/* Spacer for centering */}
        </div>

        <GeneralPostDetail post={post} />
      </div>
    </main>
  )
}

