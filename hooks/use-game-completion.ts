"use client"

import { useCallback } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useSeason } from "@/contexts/season-context"
import { recordGameCompletion } from "@/lib/progress-service"

export function useGameCompletion() {
  const { user } = useAuth()
  const { selectedSeason } = useSeason()

  const recordCompletion = useCallback(
    async (gameId: string, completionTime?: number, score?: number) => {
      if (!user) {
        console.warn("No user logged in, cannot record game completion")
        return false
      }

      try {
        console.log(`Recording completion for game: ${gameId}, user: ${user.uid}, season: ${selectedSeason}`)
        await recordGameCompletion(user.uid, gameId, selectedSeason, completionTime, score)
        console.log(`✅ Game completion successfully recorded for ${gameId} in ${selectedSeason}`)
        return true
      } catch (error) {
        console.error(`❌ Failed to record game completion for ${gameId}:`, error)
        return false
      }
    },
    [user, selectedSeason],
  )

  return {
    recordCompletion,
    isLoggedIn: !!user,
    currentSeason: selectedSeason,
  }
}
