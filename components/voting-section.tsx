"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import type { Voting } from "@/types/post"
import { format } from "date-fns"
import { de } from "date-fns/locale"

interface VotingSectionProps {
  voting: Voting
  postId: string
}

export default function VotingSection({ voting, postId }: VotingSectionProps) {
  const [localVoting, setLocalVoting] = useState<Voting>({ ...voting })
  const [selectedOption, setSelectedOption] = useState<string | null>(voting.userVoted || null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleVote = async (optionId: string) => {
    if (localVoting.isEnded || isSubmitting) return

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update local state
      const updatedOptions = localVoting.options.map((option) => {
        if (option.id === optionId) {
          return { ...option, count: option.count + 1 }
        }
        return option
      })

      setLocalVoting({
        ...localVoting,
        options: updatedOptions,
        totalVotes: localVoting.totalVotes + 1,
        userVoted: optionId,
      })

      setSelectedOption(optionId)

      toast({
        title: "Abstimmung erfolgreich",
        description: "Deine Stimme wurde gezählt.",
      })
    } catch (error) {
      console.error("Error voting:", error)
      toast({
        title: "Fehler bei der Abstimmung",
        description: "Deine Stimme konnte nicht gezählt werden.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border border-primary/20 bg-primary/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{localVoting.question}</CardTitle>
        {localVoting.endDate && (
          <p className="text-xs text-muted-foreground">
            Endet am {format(new Date(localVoting.endDate), "dd. MMMM yyyy", { locale: de })}
          </p>
        )}
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-3">
          {localVoting.options.map((option) => {
            const percentage =
              localVoting.totalVotes > 0 ? Math.round((option.count / localVoting.totalVotes) * 100) : 0

            const isSelected = selectedOption === option.id
            const showResults = selectedOption !== null || localVoting.isEnded

            return (
              <div key={option.id} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${isSelected ? "font-medium" : ""}`}>{option.text}</span>
                  {showResults && (
                    <span className="text-xs">
                      {percentage}% ({option.count})
                    </span>
                  )}
                </div>

                {showResults ? (
                  <Progress value={percentage} className="h-2" />
                ) : (
                  <Button
                    variant="outline"
                    className="w-full justify-start h-8 text-sm"
                    onClick={() => handleVote(option.id)}
                    disabled={isSubmitting}
                  >
                    {option.text}
                  </Button>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <p className="text-xs text-muted-foreground">
          {localVoting.totalVotes} {localVoting.totalVotes === 1 ? "Stimme" : "Stimmen"} insgesamt
        </p>
      </CardFooter>
    </Card>
  )
}

