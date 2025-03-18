"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, Search, Filter } from "lucide-react"
import Link from "next/link"
import type { GeneralPost } from "@/types/post"
import GeneralPostCard from "@/components/general-post-card"
import { mockGeneralPosts } from "@/lib/mock-data"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function GeneralFeed() {
  const [posts, setPosts] = useState<GeneralPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Get unique categories from posts
  const categories = Array.from(new Set(mockGeneralPosts.flatMap((post) => post.categories || [])))

  useEffect(() => {
    // Simulate fetching posts
    const fetchPosts = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setPosts(mockGeneralPosts)
      } catch (error) {
        console.error("Error fetching posts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  // Filter posts based on search query and selected category
  const filteredPosts = posts
    .filter((post) => post.content.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((post) => !selectedCategory || (post.categories && post.categories.includes(selectedCategory)))

  // Sort posts by date
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Allgemein</h2>
        <Button asChild>
          <Link href="/general/create">
            <Plus className="h-4 w-4 mr-2" />
            Neuer Post
          </Link>
        </Button>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Suchen..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => setSelectedCategory(null)}
                className={!selectedCategory ? "bg-accent text-accent-foreground" : ""}
              >
                Alle Kategorien
              </DropdownMenuItem>
              {categories.map((category) => (
                <DropdownMenuItem
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-accent text-accent-foreground" : ""}
                >
                  {category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {selectedCategory && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filter:</span>
          <Badge variant="outline" className="flex items-center gap-1">
            {selectedCategory}
            <button className="ml-1 rounded-full hover:bg-accent p-0.5" onClick={() => setSelectedCategory(null)}>
              ×
            </button>
          </Badge>
        </div>
      )}

      {sortedPosts.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          {searchQuery || selectedCategory ? <p>Keine Ergebnisse gefunden.</p> : <p>Noch keine Posts vorhanden.</p>}
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedPosts.map((post) => (
            <GeneralPostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}

