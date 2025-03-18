"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageSquare, MoreHorizontal, ThumbsUp, Heart, Laugh, Angry, Frown } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { de } from "date-fns/locale"
import type { GeneralPost } from "@/types/post"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface GeneralPostCardProps {
  post: GeneralPost
}

const reactions = [
  { emoji: "👍", icon: ThumbsUp, label: "Gefällt mir" },
  { emoji: "❤️", icon: Heart, label: "Liebe" },
  { emoji: "😂", icon: Laugh, label: "Lachen" },
  { emoji: "😢", icon: Frown, label: "Traurig" },
  { emoji: "😠", icon: Angry, label: "Wütend" },
]

export default function GeneralPostCard({ post }: GeneralPostCardProps) {
  const { id, content, author, createdAt, categories, commentCount, mediaUrl, reactions: postReactions } = post

  const [currentReactions, setCurrentReactions] = useState(postReactions || {})
  const [userReaction, setUserReaction] = useState<string | null>(null)

  // Format the date
  const formattedDate = formatDistanceToNow(new Date(createdAt), {
    addSuffix: true,
    locale: de,
  })

  // Get total reactions count
  const totalReactions = Object.values(currentReactions).reduce((sum, count) => sum + count, 0)

  const handleReaction = (emoji: string) => {
    // If user already reacted with this emoji, remove it
    if (userReaction === emoji) {
      setCurrentReactions({
        ...currentReactions,
        [emoji]: Math.max(0, (currentReactions[emoji] || 0) - 1),
      })
      setUserReaction(null)
    }
    // If user reacted with a different emoji, remove old one and add new one
    else if (userReaction) {
      setCurrentReactions({
        ...currentReactions,
        [userReaction]: Math.max(0, (currentReactions[userReaction] || 0) - 1),
        [emoji]: (currentReactions[emoji] || 0) + 1,
      })
      setUserReaction(emoji)
    }
    // If user didn't react yet, add new reaction
    else {
      setCurrentReactions({
        ...currentReactions,
        [emoji]: (currentReactions[emoji] || 0) + 1,
      })
      setUserReaction(emoji)
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={author.profileImage} alt={author.name} />
            <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="font-medium leading-none">{author.name}</div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{formattedDate}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/general/${id}`}>Zum Post</Link>
                    </DropdownMenuItem>
                    {author.id === "staff1" && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href={`/general/edit/${id}`}>Bearbeiten</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Löschen</DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="flex flex-wrap gap-1 mt-1">
              {categories?.map((category) => (
                <Badge key={category} variant="secondary" className="text-xs">
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <p className="whitespace-pre-line mb-3">{content}</p>

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
      <CardFooter className="p-4 pt-0 flex flex-col gap-2">
        {totalReactions > 0 && (
          <div className="flex items-center text-xs text-muted-foreground border-t border-border w-full pt-2">
            {Object.entries(currentReactions)
              .filter(([_, count]) => count > 0)
              .map(([emoji, count]) => (
                <div key={emoji} className="mr-2">
                  {emoji} {count}
                </div>
              ))}
          </div>
        )}

        <div className="flex justify-between items-center w-full border-t border-border pt-2">
          <TooltipProvider>
            <div className="flex gap-1">
              {reactions.map((reaction) => (
                <Tooltip key={reaction.emoji}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`px-2 ${userReaction === reaction.emoji ? "bg-accent text-accent-foreground" : ""}`}
                      onClick={() => handleReaction(reaction.emoji)}
                    >
                      {reaction.emoji}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{reaction.label}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>

          <Button variant="ghost" size="sm" asChild>
            <Link href={`/general/${id}`} className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span>{commentCount}</span>
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

