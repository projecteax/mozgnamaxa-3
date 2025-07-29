"use client"

import { useAuth } from "@/contexts/auth-context"
import { recordGameCompletion } from "@/lib/progress-service"
import { useCallback } from "react"

export function useProgressTracking() {
  const { user } = useAuth()

  const trackGameCompletion = useCallback(
    async (gameId: string) => {
      if (!user) return

      try {
        await recordGameCompletion(user.uid, gameId)
        console.log(`Game completion recorded: ${gameId}`)
      } catch (error) {
        console.error("Failed to track game completion:", error)
      }
    },
    [user],
  )

  return { trackGameCompletion }
}
