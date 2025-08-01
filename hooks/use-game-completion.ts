"use client"

import { useCallback, useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useSeason } from "@/contexts/season-context"
import { recordGameCompletion, getStudentGameResults } from "@/lib/progress-service"

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

export function useGameCompletionWithHistory(gameId: string) {
  const { recordCompletion, isLoggedIn, currentSeason } = useGameCompletion()
  const { isHistoricallyCompleted, isLoading, refreshCompletion } = useHistoricalCompletion(gameId)

  const recordCompletionAndRefresh = useCallback(
    async (completionTime?: number, score?: number) => {
      const success = await recordCompletion(gameId, completionTime, score)
      if (success) {
        // Trigger a refresh of historical completion after successful recording
        setTimeout(() => {
          refreshCompletion()
        }, 500) // Small delay to ensure database write is complete
      }
      return success
    },
    [recordCompletion, gameId, refreshCompletion]
  )

  return {
    recordCompletion: recordCompletionAndRefresh,
    isLoggedIn,
    currentSeason,
    isHistoricallyCompleted,
    isLoading
  }
}

export function useHistoricalCompletion(gameId: string) {
  const { user } = useAuth()
  const { selectedSeason } = useSeason()
  const [isHistoricallyCompleted, setIsHistoricallyCompleted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const refreshCompletion = useCallback(() => {
    setRefreshTrigger(prev => prev + 1)
  }, [])

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    async function checkCompletion() {
      if (!user) {
        setIsHistoricallyCompleted(false)
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      
      try {
        const studentGameResults = await getStudentGameResults(user.uid)
        if (!studentGameResults) {
          setIsHistoricallyCompleted(false)
          setIsLoading(false)
          return
        }

        // Convert season to English format
        const seasonMap: Record<string, string> = {
          'wiosna': 'spring',
          'lato': 'summer', 
          'jesien': 'autumn',
          'zima': 'winter'
        }
        const englishSeason = seasonMap[selectedSeason] || selectedSeason

        // Create game key in the format used by progress service
        const gameKey = `${gameId}-${englishSeason}`
        
        // Check if game has been completed
        const gameResult = studentGameResults.gameResults[gameKey]
        const completed = gameResult?.completed > 0

        setIsHistoricallyCompleted(completed)
        setIsLoading(false)
      } catch (error) {
        console.error(`Error checking historical completion for ${gameId}:`, error)
        setIsHistoricallyCompleted(false)
        setIsLoading(false)
      }
    }

    // Debounce the API call to avoid rapid fire requests during season changes
    timeoutId = setTimeout(checkCompletion, 100)

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [user, gameId, selectedSeason, refreshTrigger])

  return {
    isHistoricallyCompleted,
    isLoading,
    refreshCompletion
  }
}
