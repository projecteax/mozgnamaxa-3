"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"

interface StudentProgress {
  completedGames: string[]
  unlockedSeasons: string[]
  medals: number
  currentSeason: string
  totalGamesCompleted: number
  gameCompletionCounts: Record<string, number>
}

export function useStudentProgress() {
  const { user } = useAuth()
  const [progress, setProgress] = useState<StudentProgress | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setProgress(null)
      setLoading(false)
      return
    }

    fetchStudentProgress()
  }, [user])

  const fetchStudentProgress = async () => {
    if (!user) return

    try {
      setLoading(true)
      
      // Import Firebase modules dynamically
      const { collection, query, where, getDocs } = await import("firebase/firestore")
      const { db } = await import("@/lib/firebase")

      // Find student document by uid
      const studentsQuery = query(collection(db, "students"), where("uid", "==", user.uid))
      const studentsSnapshot = await getDocs(studentsQuery)

      if (studentsSnapshot.empty) {
        // Initialize progress for new student
        setProgress({
          completedGames: [],
          unlockedSeasons: ["wiosna"], // Spring is always unlocked
          medals: 0,
          currentSeason: "wiosna",
          totalGamesCompleted: 0,
          gameCompletionCounts: {}
        })
        setLoading(false)
        return
      }

      const studentData = studentsSnapshot.docs[0].data()
      const gameResults = studentData.gameResults || {}
      
      // Count completed games across all seasons
      const completedGames: string[] = []
      const gameCompletionCounts: Record<string, number> = {}
      let totalCompleted = 0

      // Game order from the main page
      const gameOrder = [
        "matching", "sequence", "butterfly-pairs", "odd-one-out", "puzzle", "connect",
        "sorting", "category-sorting", "memory", "spot-difference", "easter-basket",
        "easter-sequence", "maze", "sorting-2", "memory-5", "memory-3", "puzzle-assembly-2",
        "spot-difference-5", "memory-7", "category-sorting-3", "sequence-2", "find-missing",
        "sequential-order-2", "memory-4", "memory-match", "maze-3", "find-missing-half",
        "find-flipped-rabbit", "branch-sequence", "find-6-differences", "birds-puzzle",
        "memory-match-2x4", "sudoku", "pattern-completion", "find-incorrect-ladybug", "sequential-order-3"
      ]

      // Map game IDs to standardized format used in Firebase
      const gameIdMap: Record<string, string> = {
        "matching": "matching-game",
        "sequence": "sequence-game", 
        "butterfly-pairs": "butterfly-pairs-game",
        "odd-one-out": "odd-one-out-game",
        "puzzle": "puzzle-game",
        "connect": "connect-game",
        "sorting": "sorting-game",
        "category-sorting": "category-sorting-game",
        "memory": "memory-game",
        "spot-difference": "spot-difference-game",
        "easter-basket": "easter-basket-game",
        "easter-sequence": "easter-sequence-game",
        "maze": "maze-game",
        "sorting-2": "sorting-game-2",
        "memory-5": "memory-game-5",
        "memory-3": "memory-game-3",
        "puzzle-assembly-2": "puzzle-assembly-2",
        "spot-difference-5": "spot-difference-game-5",
        "memory-7": "memory-game-7",
        "category-sorting-3": "category-sorting-game-3",
        "sequence-2": "sequence-game-2",
        "find-missing": "find-missing-game",
        "sequential-order-2": "sequential-order-game-2",
        "memory-4": "memory-game-4",
        "memory-match": "memory-match-game",
        "maze-3": "maze-game-3",
        "find-missing-half": "find-missing-half-game",
        "find-flipped-rabbit": "find-flipped-rabbit-game",
        "branch-sequence": "branch-sequence-game",
        "find-6-differences": "find-6-differences-game",
        "birds-puzzle": "birds-puzzle-game",
        "memory-match-2x4": "memory-match-game-2x4",
        "sudoku": "sudoku-game",
        "pattern-completion": "pattern-completion-game",
        "find-incorrect-ladybug": "find-incorrect-ladybug-game",
        "sequential-order-3": "sequential-order-game-3"
      }

      // Check completion for each game in spring season first
      gameOrder.forEach(gameId => {
        const standardizedId = gameIdMap[gameId] || gameId
        const springKey = `${standardizedId}-spring`
        if (gameResults[springKey] && gameResults[springKey].completed > 0) {
          completedGames.push(gameId)
          gameCompletionCounts[gameId] = gameResults[springKey].completed
          totalCompleted++
        }
      })

      // Calculate unlocked seasons based on progress
      const unlockedSeasons = ["wiosna"] // Spring always unlocked
      const gamesPerSeason = 36 // 36 games per season
      
      if (completedGames.length >= gamesPerSeason) unlockedSeasons.push("lato")
      if (completedGames.length >= gamesPerSeason * 2) unlockedSeasons.push("jesien")
      if (completedGames.length >= gamesPerSeason * 3) unlockedSeasons.push("zima")

      // Calculate medals (every 3 games)
      const medals = Math.floor(completedGames.length / 3)

      // Determine current season
      const currentSeasonIndex = Math.floor(completedGames.length / gamesPerSeason)
      const seasons = ["wiosna", "lato", "jesien", "zima"]
      const currentSeason = seasons[Math.min(currentSeasonIndex, 3)]

      setProgress({
        completedGames,
        unlockedSeasons,
        medals,
        currentSeason,
        totalGamesCompleted: totalCompleted,
        gameCompletionCounts
      })

    } catch (error) {
      console.error("Error fetching student progress:", error)
      // Fallback to empty progress
      setProgress({
        completedGames: [],
        unlockedSeasons: ["wiosna"],
        medals: 0,
        currentSeason: "wiosna", 
        totalGamesCompleted: 0,
        gameCompletionCounts: {}
      })
    } finally {
      setLoading(false)
    }
  }

  return {
    progress,
    loading,
    refreshProgress: fetchStudentProgress
  }
}