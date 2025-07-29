import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  arrayUnion,
  Timestamp,
} from "firebase/firestore"
import { db } from "./firebase"

export interface GameCompletion {
  gameId: string
  completedAt: Timestamp
  season?: string
  completionTime?: number
  score?: number
}

export interface StudentProgress {
  studentId: string
  studentName: string
  completedGames: GameCompletion[]
  totalGamesCompleted: number
  lastActivity: Timestamp
}

export interface GameResult {
  completed: number
  bestTime: number | null
  lastPlayed: Timestamp | null
  completions: Array<{
    timestamp: Timestamp
    completionTime?: number
    score?: number
  }>
  gamesStarted: number
  gamesUnfinished: number
}

export interface StudentGameResults {
  gameResults: Record<string, GameResult> // Key format: "gameId-season"
  overallStats: {
    totalGamesCompleted: number
    totalPlayTime: number
    favoriteGame: string | null
    lastSessionDate: Timestamp | null
    sessionsCount: number
  }
  progressTracking: {
    currentSeason: string
    unlockedSeasons: string[]
    achievements: string[]
    medals: string[]
  }
}

class ProgressService {
  async recordGameCompletion(
    userId: string, 
    gameId: string, 
    season: string = "wiosna",
    completionTime?: number,
    score?: number
  ): Promise<void> {
    try {
      // Record in old format for backward compatibility
      const userProgressRef = doc(db, "userProgress", userId)
      const completion: GameCompletion = {
        gameId,
        completedAt: Timestamp.now(),
        season,
        ...(completionTime !== undefined && { completionTime }),
        ...(score !== undefined && { score }),
      }

      // Get current progress
      const progressDoc = await getDoc(userProgressRef)

      if (progressDoc.exists()) {
        await updateDoc(userProgressRef, {
          completedGames: arrayUnion(completion),
          lastActivity: Timestamp.now(),
        })
      } else {
        await setDoc(userProgressRef, {
          completedGames: [completion],
          lastActivity: Timestamp.now(),
          createdAt: Timestamp.now(),
        })
      }

      // Update new structured format in students collection
      const englishSeason = this.convertSeasonToEnglish(season)
      await this.updateStudentGameResults(userId, gameId, englishSeason, completionTime, score)

    } catch (error) {
      console.error("Error recording game completion:", error)
      throw error
    }
  }

  private convertSeasonToEnglish(season: string): string {
    // Convert Polish season names to English
    const seasonMap: Record<string, string> = {
      'wiosna': 'spring',
      'lato': 'summer', 
      'jesien': 'autumn',
      'zima': 'winter'
    }
    return seasonMap[season] || season
  }

  private standardizeGameId(gameId: string): string {
    // Map game IDs to their TSX filename format with English season suffixes
    const gameIdMap: Record<string, string> = {
      // Matching game
      'matchingGame': 'matching-game',
      'matching-game': 'matching-game',
      'matching-game-summer': 'matching-game',
      'matching-game-autumn': 'matching-game', 
      'matching-game-winter': 'matching-game',
      
      // Sequence games
      'sequenceGame': 'sequence-game',
      'sequence-game': 'sequence-game',
      'sequence-game-summer': 'sequence-game',
      'sequence-game-autumn': 'sequence-game',
      'sequence-game-winter': 'sequence-game',
      'sequenceGame2': 'sequence-game-2',
      'sequence-game-2': 'sequence-game-2',
      
      // Butterfly pairs
      'butterflyPairs': 'butterfly-pairs-game',
      'butterfly-pairs': 'butterfly-pairs-game',
      'butterfly-pairs-game': 'butterfly-pairs-game',
      'butterfly-pairs-summer': 'butterfly-pairs-game',
      'butterfly-pairs-autumn': 'butterfly-pairs-game',
      'butterfly-pairs-winter': 'butterfly-pairs-game',
      
      // Other games
      'oddOneOut': 'odd-one-out-game',
      'odd-one-out': 'odd-one-out-game',
      'puzzleGame': 'puzzle-game',
      'puzzle-game': 'puzzle-game',
      'connectGame': 'connect-game',
      'connect-game': 'connect-game',
      'sortingGame': 'sorting-game',
      'sorting-game': 'sorting-game',
      'sortingGame2': 'sorting-game-2',
      'sorting-game-2': 'sorting-game-2',
      'sortingGame3': 'sorting-game-3',
      'sorting-game-3': 'sorting-game-3',
      'sortingGame4': 'sorting-game-4',
      'sorting-game-4': 'sorting-game-4',
      'categorySorting': 'category-sorting-game',
      'category-sorting': 'category-sorting-game',
      'categorySorting2': 'category-sorting-game-2',
      'category-sorting-2': 'category-sorting-game-2',
      'categorySorting3': 'category-sorting-game-3',
      'category-sorting-3': 'category-sorting-game-3',
      'categorySorting4': 'category-sorting-game-4',
      'category-sorting-4': 'category-sorting-game-4',
      'memoryGame': 'memory-game',
      'memory-game': 'memory-game',
      'memoryGame2': 'memory-game-2',
      'memory-game-2': 'memory-game-2',
      'memoryGame3': 'memory-game-3',
      'memory-game-3': 'memory-game-3',
      'memoryGame4': 'memory-game-4',
      'memory-game-4': 'memory-game-4',
      'memoryGame5': 'memory-game-5',
      'memory-game-5': 'memory-game-5',
      'memoryGame6': 'memory-game-6',
      'memory-game-6': 'memory-game-6',
      'memoryGame7': 'memory-game-7',
      'memory-game-7': 'memory-game-7',
      'memoryMatch': 'memory-match-game',
      'memory-match': 'memory-match-game',
      'memoryMatch2x4': 'memory-match-game-2x4',
      'memory-match-2x4': 'memory-match-game-2x4',
      'spotDifference': 'spot-difference-game',
      'spot-difference': 'spot-difference-game',
      'spotDifference5': 'spot-difference-game-5',
      'spot-difference-5': 'spot-difference-game-5',
      'easterBasket': 'easter-basket-game',
      'easter-basket': 'easter-basket-game',
      'easterBasket2': 'easter-basket-game-2',
      'easter-basket-2': 'easter-basket-game-2',
      'easterSequence': 'easter-sequence-game',
      'easter-sequence': 'easter-sequence-game',
      'mazeGame': 'maze-game',
      'maze-game': 'maze-game',
      'mazeGame2': 'maze-game-2',
      'maze-game-2': 'maze-game-2',
      'mazeGame3': 'maze-game-3',
      'maze-game-3': 'maze-game-3',
      'mazeGame4': 'maze-game-4',
      'maze-game-4': 'maze-game-4',
      'findMissing': 'find-missing-game',
      'find-missing': 'find-missing-game',
      'findMissingHalf': 'find-missing-half-game',
      'find-missing-half': 'find-missing-half-game',
      'findFlippedRabbit': 'find-flipped-rabbit-game',
      'find-flipped-rabbit-game': 'find-flipped-rabbit-game',
      'findIncorrectLadybug': 'find-incorrect-ladybug-game',
      'find-incorrect-ladybug-game': 'find-incorrect-ladybug-game',
      'branchSequence': 'branch-sequence-game',
      'branch-sequence-game': 'branch-sequence-game',
      'find6Differences': 'find-6-differences-game',
      'find-6-differences': 'find-6-differences-game',
      'birdsPuzzle': 'birds-puzzle-game',
      'birds-puzzle-game': 'birds-puzzle-game',
      'sequentialOrder': 'sequential-order-game',
      'sequential-order': 'sequential-order-game',
      'sequentialOrder2': 'sequential-order-game-2',
      'sequential-order-2': 'sequential-order-game-2',
      'sequentialOrder3': 'sequential-order-game-3',
      'sequential-order-3': 'sequential-order-game-3',
      'puzzleAssembly2': 'puzzle-assembly-game-2',
      'puzzle-assembly-2': 'puzzle-assembly-game-2',
      'sudokuGame': 'sudoku-game',
      'sudoku-game': 'sudoku-game',
      'patternCompletion': 'pattern-completion-game',
      'pattern-completion-game': 'pattern-completion-game',
    }

    // Return the standardized game ID, or the original if not found
    return gameIdMap[gameId] || gameId
  }

  private async updateStudentGameResults(
    userId: string,
    gameId: string,
    season: string,
    completionTime?: number,
    score?: number
  ): Promise<void> {
    try {
      // Convert game ID to standardized kebab-case format
      const standardizedGameId = this.standardizeGameId(gameId)
      
      // Find student document by uid
      const studentsQuery = query(collection(db, "students"), where("uid", "==", userId))
      const studentsSnapshotUpdate = await getDocs(studentsQuery)

      if (studentsSnapshotUpdate.empty) {
        console.warn("Student document not found for user:", userId)
        return
      }

      const studentDoc = studentsSnapshotUpdate.docs[0]
      const studentRef = doc(db, "students", studentDoc.id)
      const studentData = studentDoc.data()

      // Get current game results or initialize if not exists
      let gameResults = studentData.gameResults || {}
      const overallStats = studentData.overallStats || {
        totalGamesCompleted: 0,
        totalPlayTime: 0,
        favoriteGame: null,
        lastSessionDate: null,
        sessionsCount: 0
      }

      // Create standardized game key: gameId-englishSeason
      const gameKey = `${standardizedGameId}-${season}`
      
      // Initialize gameResults structure if it doesn't exist
      if (!gameResults) {
        gameResults = {}
      }
      
      // Initialize the specific game-season entry
      if (!gameResults[gameKey]) {
        gameResults[gameKey] = {
          completed: 0,
          bestTime: null,
          lastPlayed: null,
          completions: [],
          gamesStarted: 0,
          gamesUnfinished: 0
        }
      }

      const gameResult = gameResults[gameKey]
      gameResult.completed += 1
      gameResult.lastPlayed = Timestamp.now()
      gameResult.completions.push({
        timestamp: Timestamp.now(),
        ...(completionTime !== undefined && { completionTime }),
        ...(score !== undefined && { score })
      })

      // Update best time if provided and better
      if (completionTime && (gameResult.bestTime === null || completionTime < gameResult.bestTime)) {
        gameResult.bestTime = completionTime
      }

      // Update overall stats
      overallStats.totalGamesCompleted += 1
      overallStats.lastSessionDate = Timestamp.now()
      if (completionTime && typeof completionTime === 'number') {
        overallStats.totalPlayTime = (overallStats.totalPlayTime || 0) + completionTime
      }

      // Update the document
      await updateDoc(studentRef, {
        gameResults,
        overallStats,
        'progressTracking.currentSeason': season
      })

    } catch (error) {
      console.error("Error updating student game results:", error)
    }
  }

  async recordGameStart(
    userId: string, 
    gameId: string, 
    season: string = "wiosna"
  ): Promise<void> {
    try {
      const standardizedGameId = this.standardizeGameId(gameId)
      const englishSeason = this.convertSeasonToEnglish(season)
      const gameKey = `${standardizedGameId}-${englishSeason}`
      
      // Find student document by uid
      const studentsQuery = query(collection(db, "students"), where("uid", "==", userId))
      const studentsSnapshotStart = await getDocs(studentsQuery)

      if (studentsSnapshotStart.empty) {
        console.warn("Student document not found for user:", userId)
        return
      }

      const studentDoc = studentsSnapshotStart.docs[0]
      const studentRef = doc(db, "students", studentDoc.id)
      const studentData = studentDoc.data()

      let gameResults = studentData.gameResults || {}
      
      // Initialize the specific game-season entry if it doesn't exist
      if (!gameResults[gameKey]) {
        gameResults[gameKey] = {
          completed: 0,
          bestTime: null,
          lastPlayed: null,
          completions: [],
          gamesStarted: 0,
          gamesUnfinished: 0
        }
      }

      gameResults[gameKey].gamesStarted += 1

      // Update the document
      await updateDoc(studentRef, {
        gameResults
      })

    } catch (error) {
      console.error("Error recording game start:", error)
    }
  }

  async recordGameAbandoned(
    userId: string, 
    gameId: string, 
    season: string = "wiosna"
  ): Promise<void> {
    try {
      const standardizedGameId = this.standardizeGameId(gameId)
      const englishSeason = this.convertSeasonToEnglish(season)
      const gameKey = `${standardizedGameId}-${englishSeason}`
      
      // Find student document by uid
      const studentsQuery = query(collection(db, "students"), where("uid", "==", userId))
      const studentsSnapshot3 = await getDocs(studentsQuery)

      if (studentsSnapshot3.empty) {
        console.warn("Student document not found for user:", userId)
        return
      }

      const studentDoc = studentsSnapshot3.docs[0]
      const studentRef = doc(db, "students", studentDoc.id)
      const studentData = studentDoc.data()

      let gameResults = studentData.gameResults || {}
      
      // Initialize the specific game-season entry if it doesn't exist
      if (!gameResults[gameKey]) {
        gameResults[gameKey] = {
          completed: 0,
          bestTime: null,
          lastPlayed: null,
          completions: [],
          gamesStarted: 0,
          gamesUnfinished: 0
        }
      }

      gameResults[gameKey].gamesUnfinished += 1

      // Update the document
      await updateDoc(studentRef, {
        gameResults
      })

    } catch (error) {
      console.error("Error recording game abandoned:", error)
    }
  }

  private initializeGameResults() {
    const gamesList = [
      'puzzleGame', 'butterflyPairs', 'connectGame', 'sequenceGame', 'sequenceGame2',
      'oddOneOut', 'categorySorting', 'categorySorting2', 'categorySorting3', 'categorySorting4',
      'memoryGame', 'memoryGame2', 'memoryGame3', 'memoryGame4', 'memoryGame5', 'memoryGame6', 'memoryGame7',
      'memoryMatch', 'memoryMatch2x4', 'spotDifference', 'spotDifference5',
      'easterBasket', 'easterBasket2', 'easterSequence',
      'mazeGame', 'mazeGame2', 'mazeGame3', 'mazeGame4',
      'sortingGame', 'sortingGame2', 'sortingGame3', 'sortingGame4',
      'findMissing', 'findMissingHalf', 'findFlippedRabbit', 'findIncorrectLadybug', 'find6Differences',
      'sequentialOrder', 'sequentialOrder2', 'sequentialOrder3',
      'matchingGame', 'branchSequence', 'birdsPuzzle', 'puzzleAssembly2', 'patternCompletion', 'sudokuGame'
    ]

    const seasons = ['wiosna', 'lato', 'jesien', 'zima']
    const gameResults: any = {}

    seasons.forEach(season => {
      gameResults[season] = {}
      gamesList.forEach(game => {
        gameResults[season][game] = {
          completed: 0,
          bestTime: null,
          lastPlayed: null,
          completions: []
        }
      })
    })

    return gameResults
  }

  async getStudentGameResults(studentId: string): Promise<StudentGameResults | null> {
    try {
      const studentsQuery = query(collection(db, "students"), where("uid", "==", studentId))
      const studentsSnapshotResults = await getDocs(studentsQuery)

      if (studentsSnapshotResults.empty) {
        return null
      }

      const studentData = studentsSnapshotResults.docs[0].data()
      
      return {
        gameResults: studentData.gameResults || this.initializeGameResults(),
        overallStats: studentData.overallStats || {
          totalGamesCompleted: 0,
          totalPlayTime: 0,
          favoriteGame: null,
          lastSessionDate: null,
          sessionsCount: 0
        },
        progressTracking: studentData.progressTracking || {
          currentSeason: 'wiosna',
          unlockedSeasons: ['wiosna'],
          achievements: [],
          medals: []
        }
      }
    } catch (error) {
      console.error("Error getting student game results:", error)
      return null
    }
  }

  async getStudentProgress(studentId: string): Promise<StudentProgress | null> {
    try {
      const progressRef = doc(db, "userProgress", studentId)
      const progressDoc = await getDoc(progressRef)

      if (!progressDoc.exists()) {
        return null
      }

      const data = progressDoc.data()
      
      // Try to get student name from students collection
      const studentsQuery = query(collection(db, "students"), where("uid", "==", studentId))
      const studentsSnapshot2 = await getDocs(studentsQuery)
      
      let studentName = "Unknown Student"
      if (!studentsSnapshot2.empty) {
        const studentData = studentsSnapshot2.docs[0].data()
        studentName = studentData.name || "Unknown Student"
      }

      return {
        studentId,
        studentName,
        completedGames: data.completedGames || [],
        totalGamesCompleted: (data.completedGames || []).length,
        lastActivity: data.lastActivity || data.createdAt,
      }
    } catch (error) {
      console.error("Error getting student progress:", error)
      return null
    }
  }

  async getTeacherStudents(teacherCode: string): Promise<any[]> {
    try {
      console.log("Looking for students with teacher code:", teacherCode)
      
      // Try both string and number versions of the teacher code
      let studentsQuery = query(
        collection(db, "students"),
        where("teacher_code", "==", teacherCode)
      )
      let studentsSnapshotTeacher = await getDocs(studentsQuery)

      // If no results found, try with number conversion
      if (studentsSnapshotTeacher.empty) {
        console.log("No students found with string teacher code, trying number conversion")
        const numericTeacherCode = parseInt(teacherCode)
        if (!isNaN(numericTeacherCode)) {
          studentsQuery = query(
            collection(db, "students"),
            where("teacher_code", "==", numericTeacherCode)
          )
          studentsSnapshotTeacher = await getDocs(studentsQuery)
          console.log("Found students with numeric teacher code:", studentsSnapshotTeacher.docs.length)
        }
      }

      console.log("Found students:", studentsSnapshotTeacher.docs.length)
      
      const students = []
      for (const docSnapshot of studentsSnapshotTeacher.docs) {
        const studentData = docSnapshot.data()
        console.log("Student data:", studentData)
        
        // Use the new gameResults structure from the student document
        const gameResults = studentData.gameResults || this.initializeGameResults()
        
        students.push({
          id: docSnapshot.id,
          ...studentData,
          progress: {
            gameResults: gameResults,
            completedGames: [], // Keep for backward compatibility
            totalGamesCompleted: 0,
            lastActivity: studentData.createdAt
          }
        })
      }

      console.log("Returning students:", students)
      return students
    } catch (error) {
      console.error("Error getting teacher students:", error)
      return []
    }
  }
}

// Create singleton instance
const progressService = new ProgressService()

// Export the service methods
export const recordGameCompletion = (
  userId: string, 
  gameId: string, 
  season?: string,
  completionTime?: number,
  score?: number
) => progressService.recordGameCompletion(userId, gameId, season, completionTime, score)

export const getStudentProgress = (studentId: string) =>
  progressService.getStudentProgress(studentId)

export const getStudentGameResults = (studentId: string) =>
  progressService.getStudentGameResults(studentId)

export const getTeacherStudents = (teacherCode: string) =>
  progressService.getTeacherStudents(teacherCode)

export const recordGameStart = (userId: string, gameId: string, season?: string) =>
  progressService.recordGameStart(userId, gameId, season)

export const recordGameAbandoned = (userId: string, gameId: string, season?: string) =>
  progressService.recordGameAbandoned(userId, gameId, season)
