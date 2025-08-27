"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Season, getSeasonOrder, calculateUnlockedSeasons } from "@/lib/season-utils"

interface StudentProgress {
  completedGames: string[]
  unlockedSeasons: string[]
  medals: number
  currentSeason: string
  totalGamesCompleted: number
  gameCompletionCounts: Record<string, number>
  seasonProgress: {
    wiosna: { completedGames: string[], medals: number }
    lato: { completedGames: string[], medals: number }
    jesien: { completedGames: string[], medals: number }
    zima: { completedGames: string[], medals: number }
  }
  // NEW FIELDS for initial season support
  initialSeason: Season
  seasonOrder: Season[]
}

export function useStudentProgress() {
  const { user } = useAuth()
  const [progress, setProgress] = useState<StudentProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    if (!user) {
      setProgress(null)
      setLoading(false)
      return
    }

    fetchStudentProgress()
  }, [user, refreshTrigger])

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
        // Initialize progress for new student with default season order
        const defaultInitialSeason: Season = "wiosna"
        const defaultSeasonOrder = getSeasonOrder(defaultInitialSeason)
        
        setProgress({
          completedGames: [],
          unlockedSeasons: [defaultInitialSeason], // First season is always unlocked
          medals: 0,
          currentSeason: defaultInitialSeason,
          totalGamesCompleted: 0,
          gameCompletionCounts: {},
          seasonProgress: {
            wiosna: { completedGames: [], medals: 0 },
            lato: { completedGames: [], medals: 0 },
            jesien: { completedGames: [], medals: 0 },
            zima: { completedGames: [], medals: 0 }
          },
          initialSeason: defaultInitialSeason,
          seasonOrder: defaultSeasonOrder
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
        "puzzle-assembly-2": "puzzle-assembly-game-2",
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

      // Track season-specific progress
      const seasonProgress = {
        wiosna: { completedGames: [] as string[], medals: 0 },
        lato: { completedGames: [] as string[], medals: 0 },
        jesien: { completedGames: [] as string[], medals: 0 },
        zima: { completedGames: [] as string[], medals: 0 }
      }

      // Check completion for each game in each season
      gameOrder.forEach(gameId => {
        const standardizedId = gameIdMap[gameId] || gameId
        
        // Check spring season
        const springKey = `${standardizedId}-spring`
        if (gameResults[springKey] && gameResults[springKey].completed > 0) {
          completedGames.push(gameId)
          gameCompletionCounts[gameId] = gameResults[springKey].completed
          seasonProgress.wiosna.completedGames.push(gameId)
          totalCompleted++
        }
        
        // Check summer season
        const summerKey = `${standardizedId}-summer`
        if (gameResults[summerKey] && gameResults[summerKey].completed > 0) {
          seasonProgress.lato.completedGames.push(gameId)
        }
        
        // Check autumn season
        const autumnKey = `${standardizedId}-autumn`
        if (gameResults[autumnKey] && gameResults[autumnKey].completed > 0) {
          seasonProgress.jesien.completedGames.push(gameId)
        }
        
        // Check winter season
        const winterKey = `${standardizedId}-winter`
        if (gameResults[winterKey] && gameResults[winterKey].completed > 0) {
          seasonProgress.zima.completedGames.push(gameId)
        }
      })

      // Calculate medals for each season
      seasonProgress.wiosna.medals = Math.floor(seasonProgress.wiosna.completedGames.length / 3)
      seasonProgress.lato.medals = Math.floor(seasonProgress.lato.completedGames.length / 3)
      seasonProgress.jesien.medals = Math.floor(seasonProgress.jesien.completedGames.length / 3)
      seasonProgress.zima.medals = Math.floor(seasonProgress.zima.completedGames.length / 3)

      // Get student's initial season and season order
      const initialSeason: Season = (studentData.initialSeason as Season) || "wiosna"
      const seasonOrder = getSeasonOrder(initialSeason)
      
      // Calculate unlocked seasons based on custom season order
      const unlockedSeasons = calculateUnlockedSeasons(seasonOrder, gameResults)

      // Calculate total medals across all seasons
      const medals = seasonProgress.wiosna.medals + seasonProgress.lato.medals + seasonProgress.jesien.medals + seasonProgress.zima.medals

      // Determine current season based on season order and completion
      let currentSeason: Season = seasonOrder[0] // Start with first season in order
      for (let i = 0; i < seasonOrder.length - 1; i++) {
        const season = seasonOrder[i]
        if (seasonProgress[season].completedGames.length >= 30) { // 30 games required to move to next season
          currentSeason = seasonOrder[i + 1]
        } else {
          break
        }
      }

      setProgress({
        completedGames,
        unlockedSeasons,
        medals,
        currentSeason,
        totalGamesCompleted: totalCompleted,
        gameCompletionCounts,
        seasonProgress,
        initialSeason,
        seasonOrder
      })

    } catch (error) {
      console.error("Error fetching student progress:", error)
      // Fallback to empty progress
      const fallbackInitialSeason: Season = "wiosna"
      const fallbackSeasonOrder = getSeasonOrder(fallbackInitialSeason)
      
      setProgress({
        completedGames: [],
        unlockedSeasons: [fallbackInitialSeason],
        medals: 0,
        currentSeason: fallbackInitialSeason,
        totalGamesCompleted: 0,
        gameCompletionCounts: {},
        seasonProgress: {
          wiosna: { completedGames: [], medals: 0 },
          lato: { completedGames: [], medals: 0 },
          jesien: { completedGames: [], medals: 0 },
          zima: { completedGames: [], medals: 0 }
        },
        initialSeason: fallbackInitialSeason,
        seasonOrder: fallbackSeasonOrder
      })
    } finally {
      setLoading(false)
    }
  }

  const refreshProgress = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return {
    progress,
    loading,
    refreshProgress
  }
}