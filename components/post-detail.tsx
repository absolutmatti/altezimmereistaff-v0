"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { AlertTriangle, Pin, MessageSquare, ImageIcon, Send, MoreVertical, Edit, Archive, Trash2 } from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"
import { de } from "date-fns/locale"
import type { NewsPost, Comment } from "@/types/post"
import VotingSection from "@/components/voting-section"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

interface PostDetailProps {
  post: NewsPost
}

// Mock function to check if user is an owner
const isOwner = () => true

export default function PostDetail({ post }: PostDetailProps) {
  const [commentText, setCommentText] = useState("")
  const [commentImage, setCommentImage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [comments, setComments] = useState<Comment[]>(post.comments || [])
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

  const handlePinPost = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      toast({
        title: post.pinned ? "Post nicht mehr angepinnt" : "Post angepinnt",
        description: post.pinned
          ? "Der Post wurde von der Pinnwand entfernt."
          : "Der Post wurde an die Pinnwand geheftet.",
      })
    } catch (error) {
      console.error("Error pinning post:", error)
      toast({
        title: "Fehler",
        description: "Der Post konnte nicht angepinnt werden.",
        variant: "destructive",
      })
    }
  }

  const handleArchivePost = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      toast({
        title: "Post archiviert",
        description: "Der Post wurde erfolgreich archiviert.",
      })
    } catch (error) {
      console.error("Error archiving post:", error)
      toast({
        title: "Fehler",
        description: "Der Post konnte nicht archiviert werden.",
        variant: "destructive",
      })
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

  // Format the date
  const formattedDate = format(new Date(post.createdAt), "dd. MMMM yyyy 'um' HH:mm 'Uhr'", {
    locale: de,
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="p-4 pb-2 flex flex-row items-start gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.author.profileImage} alt={post.author.name} />
            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <div className="font-medium leading-none flex items-center gap-2">
                {post.author.name}
                {post.important && <AlertTriangle className="h-4 w-4 text-destructive" />}
                {post.pinned && <Pin className="h-4 w-4 text-primary" />}
              </div>

              {isOwner() && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/news/edit/${post.id}`} className="flex items-center">
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Bearbeiten</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handlePinPost}>
                      <Pin className="mr-2 h-4 w-4" />
                      <span>{post.pinned ? "Nicht mehr anpinnen" : "Anpinnen"}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleArchivePost}>
                      <Archive className="mr-2 h-4 w-4" />
                      <span>Archivieren</span>
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
            <div className="flex flex-wrap gap-1 mt-1">
              {post.categories?.map((category) => (
                <Badge key={category} variant="secondary" className="text-xs">
                  {category}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{formattedDate}</p>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <h1 className="text-xl font-bold mb-4">{post.title}</h1>
          <p className="whitespace-pre-line mb-4">{post.content}</p>

          {post.mediaUrl && (
            <div className="mt-3 rounded-md overflow-hidden">
              <img
                src={post.mediaUrl || "/placeholder.svg"}
                alt="Post media"
                className="w-full h-auto object-cover max-h-[400px]"
              />
            </div>
          )}

          {post.hasVoting && post.voting && (
            <div className="mt-6">
              <VotingSection voting={post.voting} postId={post.id} />
            </div>
          )}
        </CardContent>
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
          <CardHeader className="p-4 pb-0">
            <h3 className="text-sm font-medium">Kommentar hinzufügen</h3>
          </CardHeader>
          <CardContent className="p-4">
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

