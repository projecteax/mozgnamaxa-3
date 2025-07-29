"use client"

import { useState, useEffect } from "react"
import MatchingGame from "@/components/matching-game"
import SequenceGame from "@/components/sequence-game"
import SequenceGame2 from "@/components/sequence-game-2"
import PuzzleGame from "@/components/puzzle-game"
import ButterflyPairsGame from "@/components/butterfly-pairs-game"
import OddOneOutGame from "@/components/odd-one-out-game"
import ConnectGame from "@/components/connect-game"
import SortingGame from "@/components/sorting-game"
import SortingGame2 from "@/components/sorting-game-2"
import SortingGame3 from "@/components/sorting-game-3"
import SortingGame4 from "@/components/sorting-game-4"
import CategorySortingGame from "@/components/category-sorting-game"
import CategorySortingGame2 from "@/components/category-sorting-game-2"
import CategorySortingGame3 from "@/components/category-sorting-game-3"
import CategorySortingGame4 from "@/components/category-sorting-game-4"
import MemoryGame from "@/components/memory-game"
import MemoryGame2 from "@/components/memory-game-2"
import MemoryGame3 from "@/components/memory-game-3"
import MemoryGame4 from "@/components/memory-game-4"
import MemoryGame5 from "@/components/memory-game-5"
import MemoryGame6 from "@/components/memory-game-6"
import MemoryGame7 from "@/components/memory-game-7"
import MemoryMatchGame from "@/components/memory-match-game"
import MemoryMatchGame2x4 from "@/components/memory-match-game-2x4"
import SpotDifferenceGame from "@/components/spot-difference-game"
import SpotDifferenceGame5 from "@/components/spot-difference-game-5"
import GameMenu from "@/components/game-menu"
import EasterBasketGame from "@/components/easter-basket-game"
import EasterBasketGame2 from "@/components/easter-basket-game-2"
import EasterSequenceGame from "@/components/easter-sequence-game"
import MazeGame from "@/components/maze-game"
import MazeGame2 from "@/components/maze-game-2"
import MazeGame3 from "@/components/maze-game-3"
import MazeGame4 from "@/components/maze-game-4"
import FindMissingGame from "@/components/find-missing-game"
import FindMissingHalfGame from "@/components/find-missing-half-game"
import SequentialOrderGame from "@/components/sequential-order-game"
import SequentialOrderGame2 from "@/components/sequential-order-game-2"
import TeacherPanel from "@/components/teacher-panel"
import StudentPanel from "@/components/student-panel"
import GameProgress from "@/components/game-progress"
import CongratulationsPage from "@/components/congratulations-page"
import CongratulationsPage2 from "@/components/congratulations-page-2"
import CongratulationsPage3 from "@/components/congratulations-page-3"
import CongratulationsPage4 from "@/components/congratulations-page-4"
import CongratulationsPage5 from "@/components/congratulations-page-5"
import CongratulationsPage6 from "@/components/congratulations-page-6"
import CongratulationsPage7 from "@/components/congratulations-page-7"
import CongratulationsPage8 from "@/components/congratulations-page-8"
import CongratulationsPage9 from "@/components/congratulations-page-9"
import CongratulationsPage10 from "@/components/congratulations-page-10"
import CongratulationsPage11 from "@/components/congratulations-page-11"
import CongratulationsPage12 from "@/components/congratulations-page-12"
import CongratulationsPage13 from "@/components/congratulations-page-13"
import PuzzleAssemblyGame2 from "@/components/puzzle-assembly-game-2"
import FindFlippedRabbitGame from "@/components/find-flipped-rabbit-game"
import BranchSequenceGame from "@/components/branch-sequence-game"
import Find6DifferencesGame from "@/components/find-6-differences-game"
import BirdsPuzzleGame from "@/components/birds-puzzle-game"
import SudokuGame from "@/components/sudoku-game"
import PatternCompletionGame from "@/components/pattern-completion-game"
import FindIncorrectLadybugGame from "@/components/find-incorrect-ladybug-game"
import SequentialOrderGame3 from "@/components/sequential-order-game-3"
import MainMenu from "@/components/main-menu"
import LoginForm from "@/components/login-form"
import RegisterForm from "@/components/register-form"
import StudentLoginForm from "@/components/student-login-form"
import ForgotPasswordForm from "@/components/forgot-password-form"
import StudentRegisterForm from "@/components/student-register-form"
import SeasonSelectionMenu from "@/components/season-selection-menu"
import MedalDisplay from "@/components/medal-display"
import MedalDisplay2 from "@/components/medal-display-2"
import MedalDisplay3 from "@/components/medal-display-3"
import MedalDisplay4 from "@/components/medal-display-4"
import MedalDisplay5 from "@/components/medal-display-5"
import MedalDisplay6 from "@/components/medal-display-6"
import MedalDisplay7 from "@/components/medal-display-7"
import MedalDisplay8 from "@/components/medal-display-8"
import MedalDisplay9 from "@/components/medal-display-9"
import MedalDisplay10 from "@/components/medal-display-10"
import MedalDisplay11 from "@/components/medal-display-11"
import MedalDisplay12 from "@/components/medal-display-12"
import ProgressPage from "@/components/progress-page"
import ProgressPage2 from "@/components/progress-page-2"
import ProgressPage3 from "@/components/progress-page-3"
import ProgressPage4 from "@/components/progress-page-4"
import ProgressPage5 from "@/components/progress-page-5"
import ProgressPage6 from "@/components/progress-page-6"
import ProgressPage7 from "@/components/progress-page-7"
import ProgressPage8 from "@/components/progress-page-8"
import ProgressPage9 from "@/components/progress-page-9"
import ProgressPage10 from "@/components/progress-page-10"
import ProgressPage11 from "@/components/progress-page-11"
import ProgressPage12 from "@/components/progress-page-12"
import WelcomeScreen from "@/components/welcome-screen"
import { useAuth } from "@/contexts/auth-context"
import { useSeason } from "@/contexts/season-context"

// Define the game type
type GameType =
  | "matching"
  | "sequence"
  | "sequence-2"
  | "puzzle"
  | "butterfly-pairs"
  | "odd-one-out"
  | "connect"
  | "sorting"
  | "sorting-2"
  | "sorting-3"
  | "sorting-4"
  | "category-sorting"
  | "category-sorting-2"
  | "category-sorting-3"
  | "category-sorting-4"
  | "memory"
  | "memory-2"
  | "memory-3"
  | "memory-4"
  | "memory-5"
  | "memory-6"
  | "memory-7"
  | "memory-match"
  | "memory-match-2x4"
  | "sudoku"
  | "pattern-completion"
  | "find-incorrect-ladybug"
  | "sequential-order-3"
  | "spot-difference"
  | "spot-difference-5"
  | "easter-basket"
  | "easter-basket-2"
  | "easter-sequence"
  | "maze"
  | "maze-2"
  | "maze-3"
  | "maze-4"
  | "find-missing"
  | "find-missing-half"
  | "find-flipped-rabbit"
  | "branch-sequence"
  | "find-6-differences"
  | "birds-puzzle"
  | "sequential-order"
  | "sequential-order-2"
  | "teacher-panel"
  | "student-panel"
  | "puzzle-assembly-2"

// Map game types to progress service game IDs
const gameIdMap: Record<GameType, string> = {
  matching: "matching-game",
  sequence: "sequence-game",
  "sequence-2": "sequence-game-2",
  puzzle: "puzzle-game",
  "butterfly-pairs": "butterfly-pairs",
  "odd-one-out": "odd-one-out",
  connect: "connect-game",
  sorting: "sorting-game",
  "sorting-2": "sorting-game-2",
  "sorting-3": "sorting-game-3",
  "sorting-4": "sorting-game-4",
  "category-sorting": "category-sorting",
  "category-sorting-2": "category-sorting-2",
  "category-sorting-3": "category-sorting-3",
  "category-sorting-4": "category-sorting-4",
  memory: "memory-game",
  "memory-2": "memory-game-2",
  "memory-3": "memory-game-3",
  "memory-4": "memory-game-4",
  "memory-5": "memory-game-5",
  "memory-6": "memory-game-6",
  "memory-7": "memory-game-7",
  "memory-match": "memory-match",
  "memory-match-2x4": "memory-match-2x4",
  sudoku: "sudoku-game",
  "pattern-completion": "pattern-completion-game",
  "find-incorrect-ladybug": "find-incorrect-ladybug-game",
  "sequential-order-3": "sequential-order-3",
  "spot-difference": "spot-difference",
  "spot-difference-5": "spot-difference-5",
  "easter-basket": "easter-basket",
  "easter-basket-2": "easter-basket-2",
  "easter-sequence": "easter-sequence",
  maze: "maze-game",
  "maze-2": "maze-game-2",
  "maze-3": "maze-game-3",
  "maze-4": "maze-game-4",
  "find-missing": "find-missing",
  "find-missing-half": "find-missing-half",
  "find-flipped-rabbit": "find-flipped-rabbit",
  "branch-sequence": "branch-sequence-game",
  "find-6-differences": "find-6-differences",
  "birds-puzzle": "birds-puzzle-game",
  "sequential-order": "sequential-order",
  "sequential-order-2": "sequential-order-2",
  "teacher-panel": "",
  "student-panel": "",
  "puzzle-assembly-2": "puzzle-assembly-2",
}

export default function Home() {
  const [currentGame, setCurrentGame] = useState<GameType>("matching")
  const [showMenu, setShowMenu] = useState(false)
  const [showMedalDisplay, setShowMedalDisplay] = useState(false)
  const [showProgressPage, setShowProgressPage] = useState(false)
  const { user } = useAuth()
  const { setSelectedSeason, getThemeColors } = useSeason()

  const [showMedalDisplay2, setShowMedalDisplay2] = useState(false)
  const [showProgressPage2, setShowProgressPage2] = useState(false)

  const [showMedalDisplay3, setShowMedalDisplay3] = useState(false)
  const [showProgressPage3, setShowProgressPage3] = useState(false)

  const [showMedalDisplay4, setShowMedalDisplay4] = useState(false)
  const [showProgressPage4, setShowProgressPage4] = useState(false)

  const [showMedalDisplay5, setShowMedalDisplay5] = useState(false)
  const [showProgressPage5, setShowProgressPage5] = useState(false)

  const [showMedalDisplay6, setShowMedalDisplay6] = useState(false)
  const [showProgressPage6, setShowProgressPage6] = useState(false)

  const [showMedalDisplay7, setShowMedalDisplay7] = useState(false)
  const [showProgressPage7, setShowProgressPage7] = useState(false)

  const [showMedalDisplay8, setShowMedalDisplay8] = useState(false)
  const [showProgressPage8, setShowProgressPage8] = useState(false)

  const [showMedalDisplay9, setShowMedalDisplay9] = useState(false)
  const [showProgressPage9, setShowProgressPage9] = useState(false)

  const [showMedalDisplay10, setShowMedalDisplay10] = useState(false)
  const [showProgressPage10, setShowProgressPage10] = useState(false)

  const [showMedalDisplay11, setShowMedalDisplay11] = useState(false)
  const [showProgressPage11, setShowProgressPage11] = useState(false)

  const [showMedalDisplay12, setShowMedalDisplay12] = useState(false)
  const [showProgressPage12, setShowProgressPage12] = useState(false)

  // View management - includes all dragon welcome screens and welcome screen
  const [currentView, setCurrentView] = useState<
    | "welcome"
    | "main-menu"
    | "student-login"
    | "student-register"
    | "teacher-login"
    | "teacher-register"
    | "forgot-password"
    | "season-selection"
    | "dragon-welcome"
    | "dragon-welcome-2"
    | "dragon-welcome-3"
    | "dragon-welcome-4"
    | "dragon-welcome-5"
    | "dragon-welcome-6"
    | "dragon-welcome-7"
    | "dragon-welcome-8"
    | "dragon-welcome-9"
    | "dragon-welcome-10"
    | "dragon-welcome-11"
    | "dragon-welcome-12"
    | "dragon-welcome-13"
    | "teacher-panel"
    | "game"
  >("welcome")

  // Check for redirect on component mount
  useEffect(() => {
    const redirectToGame = localStorage.getItem("redirectToGame")
    if (redirectToGame) {
      console.log(`Redirecting to game: ${redirectToGame}`)
      localStorage.removeItem("redirectToGame") // Clean up
      setCurrentGame(redirectToGame as GameType)
      setCurrentView("game")
    }
  }, [])

  // Define the game order based on the menu
  const gameOrder: GameType[] = [
    "matching",
    "sequence",
    "butterfly-pairs",
    "odd-one-out",
    "puzzle",
    "connect",
    "sorting",
    "category-sorting",
    "memory",
    "spot-difference",
    "easter-basket",
    "easter-sequence",
    "maze",
    "sorting-2",
    "memory-5",
    "memory-3",
    "puzzle-assembly-2",
    "spot-difference-5",
    "memory-7",
    "category-sorting-3",
    "sequence-2",
    "find-missing",
    "sequential-order-2",
    "memory-4",
    "memory-match",
    "maze-3",
    "find-missing-half",
    "find-flipped-rabbit",
    "branch-sequence",
    "find-6-differences",
    "birds-puzzle",
    "memory-match-2x4",
    "sudoku",
    "pattern-completion",
    "find-incorrect-ladybug",
    "sequential-order-3", // Add this line right after find-incorrect-ladybug
    // Remaining games
    "memory-2",
    "memory-6",
    "sorting-3",
    "sorting-4",
    "sequential-order",
    "category-sorting-2",
    "category-sorting-4",
    "easter-basket-2",
    "maze-2",
    "maze-4",
    "teacher-panel",
    "student-panel",
  ]

  const toggleMenu = () => {
    setShowMenu(!showMenu)
  }

  const selectGame = (game: GameType) => {
    setCurrentGame(game)
    setShowMenu(false)
  }

  // Function to navigate to the next game
  const goToNextGame = () => {
    const currentIndex = gameOrder.indexOf(currentGame)
    if (currentIndex < gameOrder.length - 1) {
      setCurrentGame(gameOrder[currentIndex + 1])
    }
  }

  // Function to navigate to the previous game
  const goToPreviousGame = () => {
    const currentIndex = gameOrder.indexOf(currentGame)
    if (currentIndex > 0) {
      setCurrentGame(gameOrder[currentIndex - 1])
    }
  }

  // Handle butterfly-pairs completion - show medal then progress page
  const handleButterflyPairsComplete = () => {
    setShowMedalDisplay(true)
  }

  // Handle connect-game completion - show medal 2 then progress page 2
  const handleConnectGameComplete = () => {
    setShowMedalDisplay2(true)
  }

  const handleMedal2Complete = () => {
    setShowMedalDisplay2(false)
    setShowProgressPage2(true)
  }

  // Updated to show third dragon page instead of going directly to game
  const handleProgress2Continue = () => {
    setShowProgressPage2(false)
    setCurrentView("dragon-welcome-3")
  }

  const handleMedalComplete = () => {
    setShowMedalDisplay(false)
    setShowProgressPage(true)
  }

  // Updated to show second dragon page instead of going directly to game
  const handleProgressContinue = () => {
    setShowProgressPage(false)
    setCurrentView("dragon-welcome-2")
  }

  // Handle memory-game completion - show medal 3 then progress page 3
  const handleMemoryGameComplete = () => {
    setShowMedalDisplay3(true)
  }

  const handleMedal3Complete = () => {
    setShowMedalDisplay3(false)
    setShowProgressPage3(true)
  }

  const handleProgress3Continue = () => {
    setShowProgressPage3(false)
    setCurrentView("dragon-welcome-4")
  }

  // Handle easter-sequence completion - show medal 4 then progress page 4
  const handleEasterSequenceComplete = () => {
    setShowMedalDisplay4(true)
  }

  const handleMedal4Complete = () => {
    setShowMedalDisplay4(false)
    setShowProgressPage4(true)
  }

  const handleProgress4Continue = () => {
    setShowProgressPage4(false)
    setCurrentView("dragon-welcome-5")
  }

  // Handle memory-game-5 completion - show medal 5 then progress page 5
  const handleMemoryGame5Complete = () => {
    setShowMedalDisplay5(true)
  }

  const handleMedal5Complete = () => {
    setShowMedalDisplay5(false)
    setShowProgressPage5(true)
  }

  const handleProgress5Continue = () => {
    setShowProgressPage5(false)
    setCurrentView("dragon-welcome-6")
  }

  // Handle spot-difference-5 completion - show medal 6 then progress page 6
  const handleSpotDifference5Complete = () => {
    setShowMedalDisplay6(true)
  }

  const handleMedal6Complete = () => {
    setShowMedalDisplay6(false)
    setShowProgressPage6(true)
  }

  const handleProgress6Continue = () => {
    setShowProgressPage6(false)
    setCurrentView("dragon-welcome-7")
  }

  // Handle sequence-game-2 completion - show medal 7 then progress page 7
  const handleSequenceGame2Complete = () => {
    setShowMedalDisplay7(true)
  }

  const handleMedal7Complete = () => {
    setShowMedalDisplay7(false)
    setShowProgressPage7(true)
  }

  const handleProgress7Continue = () => {
    setShowProgressPage7(false)
    setCurrentView("dragon-welcome-8")
  }

  // Handle memory-4 completion - show medal 8 then progress page 8
  const handleMemoryGame4Complete = () => {
    setShowMedalDisplay8(true)
  }

  const handleMedal8Complete = () => {
    setShowMedalDisplay8(false)
    setShowProgressPage8(true)
  }

  const handleProgress8Continue = () => {
    setShowProgressPage8(false)
    setCurrentView("dragon-welcome-9")
  }

  // Handle find-missing-half completion - show medal 9 then progress page 9
  const handleFindMissingHalfComplete = () => {
    setShowMedalDisplay9(true)
  }

  const handleMedal9Complete = () => {
    setShowMedalDisplay9(false)
    setShowProgressPage9(true)
  }

  const handleProgress9Continue = () => {
    setShowProgressPage9(false)
    setCurrentView("dragon-welcome-10")
  }

  // Handle find-6-differences completion - show medal 10 then progress page 10
  const handleFind6DifferencesComplete = () => {
    setShowMedalDisplay10(true)
  }

  const handleMedal10Complete = () => {
    setShowMedalDisplay10(false)
    setShowProgressPage10(true)
  }

  const handleProgress10Continue = () => {
    setShowProgressPage10(false)
    setCurrentView("dragon-welcome-11")
  }

  // Handle sudoku completion - show medal 11 then progress page 11
  const handleSudokuComplete = () => {
    setShowMedalDisplay11(true)
  }

  const handleMedal11Complete = () => {
    setShowMedalDisplay11(false)
    setShowProgressPage11(true)
  }

  const handleProgress11Continue = () => {
    setShowProgressPage11(false)
    setCurrentView("dragon-welcome-12")
  }

  // Handle sequential-order-3 completion - show medal 12 then progress page 12
  const handleSequentialOrder3Complete = () => {
    setShowMedalDisplay12(true)
  }

  const handleMedal12Complete = () => {
    setShowMedalDisplay12(false)
    setShowProgressPage12(true)
  }

  const handleProgress12Continue = () => {
    setShowProgressPage12(false)
    setCurrentView("dragon-welcome-13")
  }

  // Handle thirteenth dragon welcome screen START button - goes to matching game in summer
  const handleDragon13Start = () => {
    setCurrentView("game")
    setCurrentGame("matching")
    // Set season to summer for the matching game
    if (setSelectedSeason) {
      setSelectedSeason("lato")
    }
  }

  // Handle twelfth dragon welcome screen START button - goes to pattern-completion
  const handleDragon12Start = () => {
    setCurrentView("game")
    setCurrentGame("pattern-completion")
  }

  // Handle eleventh dragon welcome screen START button - goes to birds-puzzle
  const handleDragon11Start = () => {
    setCurrentView("game")
    setCurrentGame("birds-puzzle")
  }

  // Handle tenth dragon welcome screen START button - goes to find-flipped-rabbit
  const handleDragon10Start = () => {
    setCurrentView("game")
    setCurrentGame("find-flipped-rabbit")
  }

  // Handle eighth dragon welcome screen START button - goes to find-missing
  const handleDragon8Start = () => {
    setCurrentView("game")
    setCurrentGame("find-missing")
  }

  // Handle ninth dragon welcome screen START button - goes to memory-match
  const handleDragon9Start = () => {
    setCurrentView("game")
    setCurrentGame("memory-match")
  }

  // Handle seventh dragon welcome screen START button - goes to memory-game-7
  const handleDragon7Start = () => {
    setCurrentView("game")
    setCurrentGame("memory-7")
  }

  // Handle sixth dragon welcome screen START button - goes to memory-game-3
  const handleDragon6Start = () => {
    setCurrentView("game")
    setCurrentGame("memory-3") // Changed from sorting-2 to memory-3
  }

  // Handle fourth dragon welcome screen START button - goes to spot-difference game (FIXED)
  const handleDragon4Start = () => {
    setCurrentView("game")
    setCurrentGame("spot-difference") // Changed from category-sorting to spot-difference
  }

  // Handle fifth dragon welcome screen START button - goes to maze game
  const handleDragon5Start = () => {
    setCurrentView("game")
    setCurrentGame("maze") // Start with maze game
  }

  // Welcome screen handler
  const handleWelcomeStart = () => {
    setCurrentView("main-menu")
  }

  // Main menu handlers
  const handleStudentLogin = () => {
    setCurrentView("student-login")
  }

  const handleTeacherLogin = () => {
    setCurrentView("teacher-login")
  }

  const handleTeacherRegister = () => {
    setCurrentView("teacher-register")
  }

  const handlePlayWithoutLogin = () => {
    // Show season selection menu first
    setCurrentView("season-selection")
  }

  const handleBackToMenu = () => {
    setCurrentView("main-menu")
  }

  const handleBackToWelcome = () => {
    setCurrentView("welcome")
  }

  const handleLoginSuccess = async () => {
    // Check if the logged-in user is a teacher
    if (user) {
      try {
        const { collection, query, where, getDocs } = await import("firebase/firestore")
        const { db } = await import("@/lib/firebase")
        
        const teacherQuery = query(collection(db, "users"), where("uid", "==", user.uid))
        const teacherSnapshot = await getDocs(teacherQuery)
        
        if (!teacherSnapshot.empty) {
          const teacherData = teacherSnapshot.docs[0].data()
          // If user has unique_code, they are a teacher
          if (teacherData.unique_code) {
            setCurrentView("teacher-panel")
            setCurrentGame("teacher-panel")
            return
          }
        }
      } catch (error) {
        console.error("Error checking user type:", error)
      }
    }
    
    // Default: Show season selection menu for students
    setCurrentView("season-selection")
  }

  const handleStudentLoginSuccess = async () => {
    // For student login, always go to season selection menu
    setCurrentView("season-selection")
  }

  const handleForgotPassword = () => {
    setCurrentView("forgot-password")
  }

  const handleStudentRegister = () => {
    setCurrentView("student-register")
  }

  // Handle first dragon welcome screen START button - goes to first game
  const handleDragonStart = () => {
    setCurrentView("game")
    setCurrentGame("matching") // Start with the first game
  }

  // Handle second dragon welcome screen START button - goes to odd-one-out game
  const handleDragon2Start = () => {
    setCurrentView("game")
    setCurrentGame("odd-one-out") // Start with odd-one-out game
  }

  // Handle third dragon welcome screen START button - goes to sorting game
  const handleDragon3Start = () => {
    setCurrentView("game")
    setCurrentGame("sorting") // Start with sorting game
  }

  // Handle season selection
  const handleSeasonSelect = (season: string) => {
    setSelectedSeason(season as "wiosna" | "lato" | "jesien" | "zima")
    // For now, all seasons start the same game sequence
    setCurrentView("dragon-welcome")
  }

  const isFirstGame = gameOrder.indexOf(currentGame) === 0
  const isLastGame = gameOrder.indexOf(currentGame) === gameOrder.length - 1
  const currentGameId = gameIdMap[currentGame]
  const theme = getThemeColors()

  // Show welcome screen first
  if (currentView === "welcome") {
    return <WelcomeScreen onStart={handleWelcomeStart} />
  }

  // Show medal displays and progress pages
  if (showMedalDisplay) {
    return <MedalDisplay onNextClick={handleMedalComplete} />
  }
  if (showProgressPage) {
    return <ProgressPage onContinue={handleProgressContinue} />
  }
  if (showMedalDisplay2) {
    return <MedalDisplay2 onComplete={handleMedal2Complete} />
  }
  if (showProgressPage2) {
    return <ProgressPage2 onContinue={handleProgress2Continue} />
  }
  if (showMedalDisplay3) {
    return <MedalDisplay3 onComplete={handleMedal3Complete} />
  }
  if (showProgressPage3) {
    return <ProgressPage3 onContinue={handleProgress3Continue} />
  }
  if (showMedalDisplay4) {
    return <MedalDisplay4 onComplete={handleMedal4Complete} />
  }
  if (showProgressPage4) {
    return <ProgressPage4 onContinue={handleProgress4Continue} />
  }
  if (showMedalDisplay5) {
    return <MedalDisplay5 onComplete={handleMedal5Complete} />
  }
  if (showProgressPage5) {
    return <ProgressPage5 onContinue={handleProgress5Continue} />
  }
  if (showMedalDisplay6) {
    return <MedalDisplay6 onComplete={handleMedal6Complete} />
  }
  if (showProgressPage6) {
    return <ProgressPage6 onContinue={handleProgress6Continue} />
  }
  if (showMedalDisplay7) {
    return <MedalDisplay7 onComplete={handleMedal7Complete} />
  }
  if (showProgressPage7) {
    return <ProgressPage7 onContinue={handleProgress7Continue} />
  }
  if (showMedalDisplay8) {
    return <MedalDisplay8 onComplete={handleMedal8Complete} />
  }
  if (showProgressPage8) {
    return <ProgressPage8 onContinue={handleProgress8Continue} />
  }
  if (showMedalDisplay9) {
    return <MedalDisplay9 onComplete={handleMedal9Complete} />
  }
  if (showProgressPage9) {
    return <ProgressPage9 onContinue={handleProgress9Continue} />
  }
  if (showMedalDisplay10) {
    return <MedalDisplay10 onComplete={handleMedal10Complete} />
  }
  if (showProgressPage10) {
    return <ProgressPage10 onContinue={handleProgress10Continue} />
  }
  if (showMedalDisplay11) {
    return <MedalDisplay11 onComplete={handleMedal11Complete} />
  }
  if (showProgressPage11) {
    return <ProgressPage11 onContinue={handleProgress11Continue} />
  }
  if (showMedalDisplay12) {
    return <MedalDisplay12 onComplete={handleMedal12Complete} />
  }
  if (showProgressPage12) {
    return <ProgressPage12 onContinue={handleProgress12Continue} />
  }

  if (currentView === "dragon-welcome-4") {
    return <CongratulationsPage4 onStartClick={handleDragon4Start} />
  }

  if (currentView === "dragon-welcome-5") {
    return <CongratulationsPage5 onStartClick={handleDragon5Start} />
  }

  if (currentView === "dragon-welcome-6") {
    return <CongratulationsPage6 onStartClick={handleDragon6Start} />
  }

  if (currentView === "dragon-welcome-7") {
    return <CongratulationsPage7 onStartClick={handleDragon7Start} />
  }

  if (currentView === "dragon-welcome-8") {
    return <CongratulationsPage8 onStartClick={handleDragon8Start} />
  }

  if (currentView === "dragon-welcome-9") {
    return <CongratulationsPage9 onStartClick={handleDragon9Start} />
  }

  if (currentView === "dragon-welcome-10") {
    return <CongratulationsPage10 onStartClick={handleDragon10Start} />
  }

  if (currentView === "dragon-welcome-11") {
    return <CongratulationsPage11 onStartClick={handleDragon11Start} />
  }

  if (currentView === "dragon-welcome-12") {
    return <CongratulationsPage12 onStartClick={handleDragon12Start} />
  }
  if (currentView === "dragon-welcome-13") {
    return <CongratulationsPage13 onStartClick={handleDragon13Start} />
  }

  // Render based on current view
  if (currentView === "main-menu") {
    return (
      <MainMenu
        onStudentLogin={handleStudentLogin}
        onTeacherLogin={handleTeacherLogin}
        onTeacherRegister={handleTeacherRegister}
        onPlayWithoutLogin={handlePlayWithoutLogin}
      />
    )
  }

  if (currentView === "season-selection") {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#e3f7ff] to-[#b8e6ff] flex flex-col items-center justify-center p-4">
        <button
          onClick={handleBackToMenu}
          className="self-start mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 font-dongle"
        >
          ← Powrót do menu
        </button>
        <SeasonSelectionMenu onSeasonSelect={handleSeasonSelect} onMenuClick={handleBackToMenu} />
      </main>
    )
  }

  if (currentView === "dragon-welcome") {
    return <CongratulationsPage onStartClick={handleDragonStart} />
  }

  if (currentView === "dragon-welcome-2") {
    return <CongratulationsPage2 onStartClick={handleDragon2Start} />
  }

  if (currentView === "dragon-welcome-3") {
    return <CongratulationsPage3 onStartClick={handleDragon3Start} />
  }

  if (currentView === "student-login") {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#e3f7ff] to-[#b8e6ff] flex flex-col items-center justify-center p-4">
        <button
          onClick={handleBackToMenu}
          className="self-start mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 font-dongle"
        >
          ← Powrót do menu
        </button>
        <StudentLoginForm
          onRegisterClick={handleStudentRegister}
          onForgotPasswordClick={handleForgotPassword}
          onSuccess={handleStudentLoginSuccess}
        />
      </main>
    )
  }

  if (currentView === "student-register") {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#e3f7ff] to-[#b8e6ff] flex flex-col items-center justify-center p-4">
        <button
          onClick={handleBackToMenu}
          className="self-start mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 font-dongle"
        >
          ← Powrót do menu
        </button>
        <StudentRegisterForm onLoginClick={handleStudentLogin} onSuccess={handleStudentLoginSuccess} />
      </main>
    )
  }

  if (currentView === "teacher-login") {
    return (
      <main
        className="min-h-screen flex flex-col items-center justify-center p-4"
        style={{ backgroundColor: theme.backgroundColor }}
      >
        <button
          onClick={handleBackToMenu}
          className="self-start mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 font-dongle"
        >
          ← Powrót do menu
        </button>
        <LoginForm
          onRegisterClick={handleTeacherRegister}
          onForgotPasswordClick={handleForgotPassword}
          onSuccess={handleLoginSuccess}
        />
      </main>
    )
  }

  if (currentView === "teacher-register") {
    return (
      <main
        className="min-h-screen flex flex-col items-center justify-center p-4"
        style={{ backgroundColor: theme.backgroundColor }}
      >
        <button
          onClick={handleBackToMenu}
          className="self-start mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 font-dongle"
        >
          ← Powrót do menu
        </button>
        <RegisterForm onLoginClick={handleTeacherLogin} onSuccess={handleLoginSuccess} />
      </main>
    )
  }

  if (currentView === "teacher-panel") {
    return <TeacherPanel onMenuClick={toggleMenu} />
  }

  if (currentView === "forgot-password") {
    return (
      <main
        className="min-h-screen flex flex-col items-center justify-center p-4"
        style={{ backgroundColor: theme.backgroundColor }}
      >
        <button
          onClick={handleBackToMenu}
          className="self-start mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 font-dongle"
        >
          ← Powrót do menu
        </button>
        <ForgotPasswordForm onBackToLogin={() => setCurrentView("teacher-login")} />
      </main>
    )
  }

  // Game view
  return (
    <main
      className="min-h-screen flex flex-col items-center p-4 relative"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      {/* Game content */}
      {currentGame === "find-incorrect-ladybug" ? (
        <FindIncorrectLadybugGame onMenuClick={toggleMenu} />
      ) : currentGame === "sequential-order-3" ? (
        <SequentialOrderGame3 onMenuClick={toggleMenu} onComplete={handleSequentialOrder3Complete} />
      ) : currentGame === "pattern-completion" ? (
        <PatternCompletionGame onMenuClick={toggleMenu} />
      ) : currentGame === "sudoku" ? (
        <SudokuGame onMenuClick={toggleMenu} onComplete={handleSudokuComplete} />
      ) : currentGame === "memory-match-2x4" ? (
        <MemoryMatchGame2x4 onMenuClick={toggleMenu} />
      ) : currentGame === "birds-puzzle" ? (
        <BirdsPuzzleGame onMenuClick={toggleMenu} />
      ) : currentGame === "find-6-differences" ? (
        <Find6DifferencesGame onMenuClick={toggleMenu} onComplete={handleFind6DifferencesComplete} />
      ) : currentGame === "branch-sequence" ? (
        <BranchSequenceGame onMenuClick={toggleMenu} />
      ) : currentGame === "find-flipped-rabbit" ? (
        <FindFlippedRabbitGame onMenuClick={toggleMenu} />
      ) : currentGame === "find-missing-half" ? (
        <FindMissingHalfGame onMenuClick={toggleMenu} onComplete={handleFindMissingHalfComplete} />
      ) : currentGame === "student-panel" ? (
        <StudentPanel onMenuClick={toggleMenu} />
      ) : currentGame === "teacher-panel" ? (
        <TeacherPanel onMenuClick={toggleMenu} />
      ) : currentGame === "maze-4" ? (
        <MazeGame4 onMenuClick={toggleMenu} />
      ) : currentGame === "maze-3" ? (
        <MazeGame3 onMenuClick={toggleMenu} />
      ) : currentGame === "find-missing" ? (
        <FindMissingGame onMenuClick={toggleMenu} />
      ) : currentGame === "sequence-2" ? (
        <SequenceGame2 onMenuClick={toggleMenu} onComplete={handleSequenceGame2Complete} />
      ) : currentGame === "category-sorting-4" ? (
        <CategorySortingGame4 onMenuClick={toggleMenu} />
      ) : currentGame === "category-sorting-3" ? (
        <CategorySortingGame3 onMenuClick={toggleMenu} />
      ) : currentGame === "category-sorting-2" ? (
        <CategorySortingGame2 onMenuClick={toggleMenu} />
      ) : currentGame === "category-sorting" ? (
        <CategorySortingGame onMenuClick={toggleMenu} />
      ) : currentGame === "memory" ? (
        <MemoryGame onMenuClick={toggleMenu} onComplete={handleMemoryGameComplete} />
      ) : currentGame === "memory-7" ? (
        <MemoryGame7 onMenuClick={toggleMenu} />
      ) : currentGame === "memory-6" ? (
        <MemoryGame6 onMenuClick={toggleMenu} />
      ) : currentGame === "memory-match" ? (
        <MemoryMatchGame onMenuClick={toggleMenu} />
      ) : currentGame === "memory-5" ? (
        <MemoryGame5 onMenuClick={toggleMenu} onComplete={handleMemoryGame5Complete} />
      ) : currentGame === "memory-4" ? (
        <MemoryGame4 onMenuClick={toggleMenu} onComplete={handleMemoryGame4Complete} />
      ) : currentGame === "puzzle-assembly-2" ? (
        <PuzzleAssemblyGame2 onMenuClick={toggleMenu} />
      ) : currentGame === "spot-difference-5" ? (
        <SpotDifferenceGame5 onMenuClick={toggleMenu} onComplete={handleSpotDifference5Complete} />
      ) : currentGame === "memory-3" ? (
        <MemoryGame3 onMenuClick={toggleMenu} />
      ) : currentGame === "maze-2" ? (
        <MazeGame2 onMenuClick={toggleMenu} />
      ) : currentGame === "maze" ? (
        <MazeGame onMenuClick={toggleMenu} />
      ) : currentGame === "easter-sequence" ? (
        <EasterSequenceGame onMenuClick={toggleMenu} onComplete={handleEasterSequenceComplete} />
      ) : currentGame === "easter-basket-2" ? (
        <EasterBasketGame2 onMenuClick={toggleMenu} />
      ) : currentGame === "easter-basket" ? (
        <EasterBasketGame onMenuClick={toggleMenu} />
      ) : currentGame === "matching" ? (
        <MatchingGame onMenuClick={toggleMenu} />
      ) : currentGame === "sequence" ? (
        <SequenceGame onMenuClick={toggleMenu} />
      ) : currentGame === "puzzle" ? (
        <PuzzleGame onMenuClick={toggleMenu} />
      ) : currentGame === "butterfly-pairs" ? (
        <ButterflyPairsGame onMenuClick={toggleMenu} onComplete={handleButterflyPairsComplete} />
      ) : currentGame === "odd-one-out" ? (
        <OddOneOutGame onMenuClick={toggleMenu} />
      ) : currentGame === "sorting" ? (
        <SortingGame onMenuClick={toggleMenu} />
      ) : currentGame === "sorting-3" ? (
        <SortingGame3 onMenuClick={toggleMenu} />
      ) : currentGame === "sorting-4" ? (
        <SortingGame4 onMenuClick={toggleMenu} />
      ) : currentGame === "sorting-2" ? (
        <SortingGame2 onMenuClick={toggleMenu} />
      ) : currentGame === "memory-2" ? (
        <MemoryGame2 onMenuClick={toggleMenu} />
      ) : currentGame === "spot-difference" ? (
        <SpotDifferenceGame onMenuClick={toggleMenu} />
      ) : currentGame === "sequential-order" ? (
        <SequentialOrderGame onMenuClick={toggleMenu} />
      ) : currentGame === "sequential-order-2" ? (
        <SequentialOrderGame2 onMenuClick={toggleMenu} />
      ) : (
        <ConnectGame onMenuClick={toggleMenu} onComplete={handleConnectGameComplete} />
      )}

      {/* Navigation buttons */}
      <div className="flex justify-center gap-4 mt-8 w-full">
        <button
          onClick={goToPreviousGame}
          disabled={isFirstGame}
          className={`px-6 py-3 rounded-full font-sour-gummy text-lg ${
            isFirstGame ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-[#539e1b] text-white hover:bg-[#468619]"
          }`}
        >
          Wróć
        </button>
        <button
          onClick={goToNextGame}
          disabled={isLastGame}
          className={`px-6 py-3 rounded-full font-sour-gummy text-lg ${
            isLastGame ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-[#539e1b] text-white hover:bg-gray-600"
          }`}
        >
          Dalej
        </button>
      </div>

      {/* Progress indicator */}
      {user && currentGameId && !["teacher-panel", "student-panel"].includes(currentGame) && (
        <GameProgress gameId={currentGameId as any} />
      )}

      {/* Game selection menu */}
      {showMenu && <GameMenu currentGame={currentGame} onSelectGame={selectGame} onClose={() => setShowMenu(false)} />}
    </main>
  )
}
