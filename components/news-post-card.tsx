import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, MessageSquare, Pin, BarChart3 } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { de } from "date-fns/locale"
import type { NewsPost } from "@/types/post"

interface NewsPostCardProps {
  post: NewsPost
}

export default function NewsPostCard({ post }: NewsPostCardProps) {
  const { id, title, content, author, createdAt, important, pinned, categories, commentCount, hasVoting, mediaUrl } =
    post

  // Format the date
  const formattedDate = formatDistanceToNow(new Date(createdAt), {
    addSuffix: true,
    locale: de,
  })

  // Truncate content if it's too long
  const truncatedContent = content.length > 150 ? content.substring(0, 150) + "..." : content

  return (
    <Card className={`overflow-hidden transition-all ${pinned ? "border-primary" : ""}`}>
      <CardHeader className="p-4 pb-0 flex flex-row items-start gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={author.profileImage} alt={author.name} />
          <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <div className="font-medium leading-none flex items-center gap-2">
              {author.name}
              {important && <AlertTriangle className="h-4 w-4 text-destructive" />}
              {pinned && <Pin className="h-4 w-4 text-primary" />}
            </div>
            <span className="text-xs text-muted-foreground">{formattedDate}</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            {categories?.map((category) => (
              <Badge key={category} variant="secondary" className="text-xs">
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{truncatedContent}</p>

        {mediaUrl && (
          <div className="mt-3 rounded-md overflow-hidden">
            <img
              src={mediaUrl || "/placeholder.svg"}
              alt="Post media"
              className="w-full h-auto object-cover max-h-[200px]"
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center text-muted-foreground">
            <MessageSquare className="h-4 w-4 mr-1" />
            <span className="text-xs">{commentCount}</span>
          </div>
          {hasVoting && (
            <div className="flex items-center text-muted-foreground">
              <BarChart3 className="h-4 w-4 mr-1" />
              <span className="text-xs">Umfrage</span>
            </div>
          )}
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/news/${id}`}>Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

