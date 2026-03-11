"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { useGameCompletionWithHistory } from "@/hooks/use-game-completion"
import { getRandomSuccessMessage } from "@/lib/success-messages"
import { useSeason } from "@/contexts/season-context"
import SoundButtonEnhanced from "./sound-button-enhanced"
import SuccessMessage from "./success-message"

interface MazeGameProps {
  onMenuClick: () => void
  onBack?: () => void
  onNext?: () => void
  onRetry?: () => void
  userLoggedIn?: boolean
  currentSeason?: string
  isGameCompleted?: boolean
}

type SpringMazeVariant = 1 | 2

export default function MazeGame({ onMenuClick, onBack, onNext, onRetry, userLoggedIn = false, currentSeason = "wiosna", isGameCompleted = false }: MazeGameProps) {
  // Season context
  const { selectedSeason, getThemeColors } = useSeason()
  const theme = getThemeColors()
  const [diagnosticSpringVariant, setDiagnosticSpringVariant] = useState<0 | SpringMazeVariant>(0)
  const [randomSpringVariant] = useState<SpringMazeVariant>(() => (Math.floor(Math.random() * 2) + 1) as SpringMazeVariant)
  const activeSpringVariant = diagnosticSpringVariant === 0 ? randomSpringVariant : diagnosticSpringVariant

  // State to track if the game is completed
  const [isCompleted, setIsCompleted] = useState(false)
  // State for random success message
  const [successMessage, setSuccessMessage] = useState<string>("")
  // State to track if progress was saved
  const [progressSaved, setProgressSaved] = useState(false)
  // Reference to the character element (stork/girl/basket/penguin)
  const characterRef = useRef<HTMLDivElement>(null)
  // Reference to the target element (nest/beach/mushrooms/icebergs)
  const targetRef = useRef<HTMLDivElement>(null)
  // Reference to the game container
  const gameContainerRef = useRef<HTMLDivElement>(null)
  // Initial character position - close to but outside maze on the left
  const initialPosition = { x: 40, y: 120 }
  // Current character position
  const [characterPosition, setCharacterPosition] = useState(initialPosition)
  // Track if we're dragging
  const [isDragging, setIsDragging] = useState(false)
  // Track mouse offset for dragging
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  // Game completion hook
  const { recordCompletion, isLoggedIn, isHistoricallyCompleted } = useGameCompletionWithHistory("maze-game")

  // Get images based on season
  const getCharacterImage = () => {
    if (selectedSeason === "zima") {
      return "/images/pinguin_winter.svg"
    } else if (selectedSeason === "lato") {
      return "/images/girl_summer.svg"
    } else if (selectedSeason === "jesien") {
      return "/images/basket_autumn.svg"
    }
    return "/images/stork.svg"
  }

  const getMazeImage = () => {
    if (selectedSeason === "zima") {
      return isCompleted ? "/images/maze_winter_finished.svg" : "/images/maze_winter.svg"
    } else if (selectedSeason === "lato") {
      return isCompleted ? "/images/maze_finished_summer.svg" : "/images/maze_summer.svg"
    } else if (selectedSeason === "jesien") {
      return isCompleted ? "/images/maze_01_autumn_finished.svg" : "/images/maze_01_autumn.svg"
    }
    if (activeSpringVariant === 2) {
      return "/images/maze_spring_v2.svg"
    }
    return isCompleted ? "/images/maze_finished.svg" : "/images/maze.svg"
  }

  const getTopTargetImage = () => {
    if (selectedSeason === "zima") {
      return "/images/iceberg_01_winter_top.svg"
    } else if (selectedSeason === "lato") {
      return "/images/image_maze_top_summer.svg"
    } else if (selectedSeason === "jesien") {
      return "/images/mushrooms_brown_autumn.svg"
    }
    return "/images/nest.svg"
  }

  const getBottomTargetImage = () => {
    if (selectedSeason === "zima") {
      return "/images/iceberg_02_winter_bottom.svg"
    } else if (selectedSeason === "lato") {
      return "/images/image_maze_bottom_summer.svg"
    } else if (selectedSeason === "jesien") {
      return "/images/mushrooms_orange_autumn.svg"
    }
    return "/images/nest.svg"
  }

  const getTitleText = () => {
    if (selectedSeason === "zima") {
      return "ZNAJDŹ DROGĘ DO KRY."
    } else if (selectedSeason === "lato") {
      return "ZNAJDŹ DROGĘ NA PLAŻĘ."
    } else if (selectedSeason === "jesien") {
      return "ZNAJDŹ DROGĘ DO GRZYBÓW."
    }
    return "ZNAJDŹ DROGĘ DO GNIAZDA."
  }

  const getTitleBoxImage = () => {
    switch (selectedSeason) {
      case "lato":
        return "/images/title_box_small_summer.svg"
      case "jesien":
        return "/images/title_box_small_autumn.svg"
      case "zima":
        return "/images/title_box_small_winter.svg"
      default:
        return "/images/title_box_small.png"
    }
  }

  const getSoundIcon = () => {
    return theme.soundIcon || "/placeholder.svg"
  }

  const getMenuIcon = () => {
    return theme.menuIcon || "/placeholder.svg"
  }

  // Handle mouse down on character
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isCompleted) return

    // Calculate offset from mouse position to character top-left corner
    if (characterRef.current) {
      const rect = characterRef.current.getBoundingClientRect()
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
      setIsDragging(true)
    }

    e.preventDefault()
  }

  // Handle mouse move
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || isCompleted) return

    if (gameContainerRef.current) {
      const containerRect = gameContainerRef.current.getBoundingClientRect()
      setCharacterPosition({
        x: e.clientX - containerRect.left - dragOffset.x,
        y: e.clientY - containerRect.top - dragOffset.y,
      })
    }

    e.preventDefault()
  }

  // Handle mouse up
  const handleMouseUp = (e: MouseEvent) => {
    if (!isDragging || isCompleted) return

    setIsDragging(false)

    // Check if character is dropped on the correct target
    if (targetRef.current && gameContainerRef.current) {
      const targetRect = targetRef.current.getBoundingClientRect()
      const containerRect = gameContainerRef.current.getBoundingClientRect()

      // Get mouse position relative to container
      const mouseX = e.clientX - containerRect.left
      const mouseY = e.clientY - containerRect.top

      // Check if mouse is over the target
      const isOverTarget =
        mouseX >= targetRect.left - containerRect.left &&
        mouseX <= targetRect.right - containerRect.left &&
        mouseY >= targetRect.top - containerRect.top &&
        mouseY <= targetRect.bottom - containerRect.top

      if (isOverTarget) {
        // Success! Character reached the correct target
        setIsCompleted(true)
        setSuccessMessage(getRandomSuccessMessage())

        // Center the character in the target
        if (characterRef.current) {
          const characterRect = characterRef.current.getBoundingClientRect()
          setCharacterPosition({
            x: targetRect.left - containerRect.left + (targetRect.width - characterRect.width) / 2,
            y: targetRect.top - containerRect.top + (targetRect.height - characterRect.height) / 2,
          })
        }

        // Record game completion in database
        handleGameCompletion()
      } else {
        // Reset character position
        setCharacterPosition(initialPosition)
      }
    }

    e.preventDefault()
  }

  // Record game completion in database
  const handleGameCompletion = async () => {
    try {
      // Record completion with the correct game ID
              const success = await recordCompletion()

      if (success) {
        setProgressSaved(true)
        console.log("Game completion recorded successfully!")
      } else if (!isLoggedIn) {
        console.log("User not logged in, progress not saved")
      }
    } catch (error) {
      console.error("Error recording game completion:", error)
    }
  }

  // Set up and clean up event listeners
  useEffect(() => {
    // Add event listeners when component mounts
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    // Clean up event listeners when component unmounts
    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, isCompleted]) // Re-add listeners when these states change

  // Reset the game
  const resetGame = () => {
    setIsCompleted(false)
    setCharacterPosition(initialPosition)
    setSuccessMessage("")
    setProgressSaved(false)
  }

  useEffect(() => {
    setIsCompleted(false)
    setCharacterPosition(initialPosition)
    setSuccessMessage("")
    setProgressSaved(false)
  }, [selectedSeason, activeSpringVariant])

  return (
    <div className="w-full max-w-5xl" style={{ backgroundColor: theme.backgroundColor }}>
      {/* Header with title - matching exact structure from matching-game */}
      <div className="w-full flex justify-between items-center mb-2">
        <div className="relative w-16 h-16">
          <SoundButtonEnhanced
            text={getTitleText()}
            soundIcon={getSoundIcon() || "/images/sound_icon_dragon_page.svg"}
            size="xl"
            className="w-full h-full"
          />
        </div>

        <div className="relative h-24 w-80 md:w-[500px] flex items-center justify-center">
          <Image src={getTitleBoxImage()} alt="Title box" fill className="object-contain" />
          <span className="relative z-10 text-white text-2xl md:text-3xl font-sour-gummy font-thin">
            {getTitleText()}
          </span>
        </div>

        <div className="relative w-16 h-16" onClick={onMenuClick}>
          <Image src={getMenuIcon() || "/placeholder.svg"} alt="Menu" fill className="object-contain cursor-pointer" />
        </div>
      </div>

      {selectedSeason === "wiosna" && (
        <div className="w-full max-w-4xl mx-auto mb-4 p-3 rounded-lg bg-white/80 border border-[#3e459c]/20 flex items-center gap-3">
          <span className="text-sm font-medium text-[#3e459c]">Wariant (diagnostyka):</span>
          <select
            value={diagnosticSpringVariant}
            onChange={(e) => setDiagnosticSpringVariant(Number(e.target.value) as 0 | SpringMazeVariant)}
            className="px-2 py-1 text-sm border border-[#3e459c]/30 rounded-md bg-white text-[#3e459c]"
          >
            <option value={0}>Auto (losowo)</option>
            <option value={1}>Wariant 1</option>
            <option value={2}>Wariant 2</option>
          </select>
          <span className="text-xs text-gray-600">Aktywny: {activeSpringVariant}</span>
        </div>
      )}

      {/* Game area - balanced layout with elements close to maze */}
      <div ref={gameContainerRef} className="flex justify-center items-center mt-0 relative">
        <div className="relative w-full h-[360px]">
          {/* Character - positioned close to but outside maze on the left */}
          <div
            ref={characterRef}
            className={`absolute h-24 w-24 cursor-grab ${isDragging ? "opacity-50" : ""}`}
            onMouseDown={handleMouseDown}
            style={{
              left: `${characterPosition.x}px`,
              top: `${characterPosition.y}px`,
              zIndex: 10,
              transition: isDragging ? "none" : "all 0.3s ease",
              transform:
                selectedSeason === "lato" || selectedSeason === "jesien" || selectedSeason === "zima"
                  ? "none"
                  : "scaleX(-1)", // Only flip stork horizontally for spring
            }}
          >
            <Image src={getCharacterImage() || "/placeholder.svg"} alt="Character" fill className="object-contain" />
          </div>

          {/* Maze in the center */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[360px] w-[440px]">
            <Image src={getMazeImage() || "/placeholder.svg"} alt="Maze" fill className="object-contain" />
          </div>

          {/* Targets close to but outside the maze on the right */}
          <div className="absolute right-[40px] top-1/2 transform -translate-y-1/2 flex flex-col gap-12">
            {/* Top target - correct one for winter, summer and autumn, incorrect for spring */}
            <div
              ref={
                selectedSeason === "zima" ||
                selectedSeason === "lato" ||
                selectedSeason === "jesien" ||
                (selectedSeason === "wiosna" && activeSpringVariant === 2)
                  ? targetRef
                  : undefined
              }
              className="relative h-20 w-20"
            >
              <Image src={getTopTargetImage() || "/placeholder.svg"} alt="Target" fill className="object-contain" />
            </div>

            {/* Bottom target - correct one for spring, incorrect for winter, summer and autumn */}
            <div
              ref={
                selectedSeason === "zima" ||
                selectedSeason === "lato" ||
                selectedSeason === "jesien" ||
                (selectedSeason === "wiosna" && activeSpringVariant === 2)
                  ? undefined
                  : targetRef
              }
              className="relative h-20 w-20"
            >
              <Image src={getBottomTargetImage() || "/placeholder.svg"} alt="Target" fill className="object-contain" />
            </div>
          </div>
        </div>
      </div>

      {/* Success message - positioned closer to maze */}
      {isCompleted && successMessage && (
        <SuccessMessage message={successMessage} />
      )}

      {/* New Navigation Buttons */}
      <div className="flex justify-center gap-4 mt-2 w-full">
        {/* All buttons in same container with identical dimensions */}
        <div className="flex gap-4 items-end">
          {/* WRÓĆ Button - always available in maze-game */}
          <div 
            className="relative w-36 h-14 transition-all cursor-pointer hover:scale-105"
            onClick={onBack}
          >
            <Image 
              src={theme.wrocDalejButton || "/images/wroc_dalej_wiosna.svg"} 
              alt="Wróć button" 
              fill 
              className="object-contain" 
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-center gap-2">
                <div className="relative w-6 h-6">
                  <Image 
                    src="/images/strzalka_lewo.svg" 
                    alt="Left arrow" 
                    fill 
                    className="object-contain" 
                  />
                </div>
                <span className="font-sour-gummy font-bold text-lg text-white">WRÓĆ</span>
              </div>
            </div>
          </div>

            {/* Retry button removed */}

          {/* DALEJ Button - only unlocked when game completed (for logged users) or always available (for non-logged users) */}
          <div 
            className={`relative w-36 h-14 transition-all ${(userLoggedIn && !isGameCompleted && !isHistoricallyCompleted) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-105'}`}
            onClick={(userLoggedIn && !isGameCompleted && !isHistoricallyCompleted) ? undefined : onNext}
          >
            <Image 
              src={theme.wrocDalejButton || "/images/wroc_dalej_wiosna.svg"} 
              alt="Dalej button" 
              fill 
              className="object-contain" 
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-center gap-2">
                <span className="font-sour-gummy font-bold text-lg text-white">DALEJ</span>
                <div className="relative w-6 h-6">
                  <Image 
                    src="/images/strzalka_prawo.svg" 
                    alt="Right arrow" 
                    fill 
                    className="object-contain" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
