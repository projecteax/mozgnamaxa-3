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

export interface SeasonGameResult {
  completed: number
  bestTime: number | null
  lastPlayed: Timestamp | null
  completions: Array<{
    timestamp: Timestamp
    completionTime?: number
    score?: number
  }>
}

export interface StudentGameResults {
  gameResults: {
    wiosna: Record<string, SeasonGameResult>
    lato: Record<string, SeasonGameResult>
    jesien: Record<string, SeasonGameResult>
    zima: Record<string, SeasonGameResult>
  }
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
      await this.updateStudentGameResults(userId, gameId, season, completionTime, score)

    } catch (error) {
      console.error("Error recording game completion:", error)
      throw error
    }
  }

  private async updateStudentGameResults(
    userId: string,
    gameId: string,
    season: string,
    completionTime?: number,
    score?: number
  ): Promise<void> {
    try {
      // Find student document by uid
      const studentsQuery = query(collection(db, "students"), where("uid", "==", userId))
      const studentsSnapshot = await getDocs(studentsQuery)

      if (studentsSnapshot.empty) {
        console.warn("Student document not found for user:", userId)
        return
      }

      const studentDoc = studentsSnapshot.docs[0]
      const studentRef = doc(db, "students", studentDoc.id)
      const studentData = studentDoc.data()

      // Get current game results or initialize if not exists
      const gameResults = studentData.gameResults || this.initializeGameResults()
      const overallStats = studentData.overallStats || {
        totalGamesCompleted: 0,
        totalPlayTime: 0,
        favoriteGame: null,
        lastSessionDate: null,
        sessionsCount: 0
      }

      // Update specific game result for the season
      if (!gameResults[season]) {
        gameResults[season] = {}
      }
      if (!gameResults[season][gameId]) {
        gameResults[season][gameId] = {
          completed: 0,
          bestTime: null,
          lastPlayed: null,
          completions: []
        }
      }

      const gameResult = gameResults[season][gameId]
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
      const studentsSnapshot = await getDocs(studentsQuery)

      if (studentsSnapshot.empty) {
        return null
      }

      const studentData = studentsSnapshot.docs[0].data()
      
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
      const studentsSnapshot = await getDocs(studentsQuery)
      
      let studentName = "Unknown Student"
      if (!studentsSnapshot.empty) {
        const studentData = studentsSnapshot.docs[0].data()
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
      const studentsQuery = query(
        collection(db, "students"),
        where("teacher_code", "==", teacherCode),
        orderBy("createdAt", "desc")
      )
      const studentsSnapshot = await getDocs(studentsQuery)

      const students = []
      for (const doc of studentsSnapshot.docs) {
        const studentData = doc.data()
        
        // Get progress for each student
        const progress = await this.getStudentProgress(studentData.uid)
        
        students.push({
          id: doc.id,
          ...studentData,
          progress: progress || {
            completedGames: [],
            totalGamesCompleted: 0,
            lastActivity: studentData.createdAt
          }
        })
      }

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
