"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  MessageSquare,
  ImageIcon,
  Send,
  MoreVertical,
  Edit,
  Trash2,
  ThumbsUp,
  Heart,
  Laugh,
  Angry,
  Frown,
} from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"
import { de } from "date-fns/locale"
import type { GeneralPost, Comment } from "@/types/post"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Link from "next/link"

interface GeneralPostDetailProps {
  post: GeneralPost
}

const reactions = [
  { emoji: "👍", icon: ThumbsUp, label: "Gefällt mir" },
  { emoji: "❤️", icon: Heart, label: "Liebe" },
  { emoji: "😂", icon: Laugh, label: "Lachen" },
  { emoji: "😢", icon: Frown, label: "Traurig" },
  { emoji: "😠", icon: Angry, label: "Wütend" },
]

export default function GeneralPostDetail({ post }: GeneralPostDetailProps) {
  const [commentText, setCommentText] = useState("")
  const [commentImage, setCommentImage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [comments, setComments] = useState<Comment[]>(post.comments || [])
  const [currentReactions, setCurrentReactions] = useState(post.reactions || {})
  const [userReaction, setUserReaction] = useState<string | null>(null)
  const { toast } = useToast()

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setCommentImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmitComment = async () => {
    if (!commentText.trim() && !commentImage) return

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Create new comment
      const newComment: Comment = {
        id: `comment-${Date.now()}`,
        content: commentText,
        author: {
          id: "staff1",
          name: "Max Mustermann",
          profileImage: "/placeholder.svg?height=40&width=40",
          isOwner: false,
        },
        createdAt: new Date().toISOString(),
        mediaUrl: commentImage || undefined,
      }

      // Add comment to list
      setComments([...comments, newComment])

      // Reset form
      setCommentText("")
      setCommentImage(null)

      toast({
        title: "Kommentar hinzugefügt",
        description: "Dein Kommentar wurde erfolgreich hinzugefügt.",
      })
    } catch (error) {
      console.error("Error adding comment:", error)
      toast({
        title: "Fehler",
        description: "Dein Kommentar konnte nicht hinzugefügt werden.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeletePost = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      toast({
        title: "Post gelöscht",
        description: "Der Post wurde erfolgreich gelöscht.",
      })
    } catch (error) {
      console.error("Error deleting post:", error)
      toast({
        title: "Fehler",
        description: "Der Post konnte nicht gelöscht werden.",
        variant: "destructive",
      })
    }
  }

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

  // Format the date
  const formattedDate = format(new Date(post.createdAt), "dd. MMMM yyyy 'um' HH:mm 'Uhr'", {
    locale: de,
  })

  // Get total reactions count
  const totalReactions = Object.values(currentReactions).reduce((sum, count) => sum + count, 0)

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3 mb-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.author.profileImage} alt={post.author.name} />
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="font-medium leading-none">{post.author.name}</div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{formattedDate}</span>

                  {post.author.id === "staff1" && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/general/edit/${post.id}`} className="flex items-center">
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Bearbeiten</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleDeletePost} className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Löschen</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {post.categories?.map((category) => (
                  <Badge key={category} variant="secondary" className="text-xs">
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <p className="whitespace-pre-line mb-3">{post.content}</p>

          {post.mediaUrl && (
            <div className="mt-3 rounded-md overflow-hidden">
              <img
                src={post.mediaUrl || "/placeholder.svg"}
                alt="Post media"
                className="w-full h-auto object-cover max-h-[400px]"
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
          </div>
        </CardFooter>
      </Card>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Kommentare ({comments.length})
        </h2>

        {comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <Card key={comment.id} className="p-4">
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.author.profileImage} alt={comment.author.name} />
                    <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="font-medium">{comment.author.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                          locale: de,
                        })}
                      </p>
                    </div>
                    <p className="mt-1">{comment.content}</p>
                    {comment.mediaUrl && (
                      <div className="mt-2 rounded-md overflow-hidden">
                        <img
                          src={comment.mediaUrl || "/placeholder.svg"}
                          alt="Comment media"
                          className="max-w-full h-auto max-h-[200px] rounded-md"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-4 text-center text-muted-foreground">
            <p>Noch keine Kommentare vorhanden.</p>
          </Card>
        )}

        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-medium mb-2">Kommentar hinzufügen</h3>
            <Textarea
              placeholder="Schreibe einen Kommentar..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="min-h-[100px]"
            />

            {commentImage && (
              <div className="mt-3 relative">
                <img
                  src={commentImage || "/placeholder.svg"}
                  alt="Upload preview"
                  className="max-w-full h-auto max-h-[200px] rounded-md"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6 rounded-full"
                  onClick={() => setCommentImage(null)}
                >
                  ×
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between">
            <label htmlFor="comment-image" className="cursor-pointer">
              <Button variant="outline" size="icon" type="button" className="h-9 w-9">
                <ImageIcon className="h-4 w-4" />
              </Button>
              <input id="comment-image" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
            <Button
              onClick={handleSubmitComment}
              disabled={isSubmitting || (!commentText.trim() && !commentImage)}
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              Kommentar senden
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

