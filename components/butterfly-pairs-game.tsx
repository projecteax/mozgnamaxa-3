"use client"

import type React from "react"
import { useState, useCallback, useMemo } from "react"
import Image from "next/image"
import { useGameCompletionWithHistory } from "@/hooks/use-game-completion"
import { getRandomSuccessMessage } from "@/lib/success-messages"
import { useSeason } from "@/contexts/season-context"
import SoundButtonEnhanced from "./sound-button-enhanced"
import SuccessMessage from "./success-message"

interface ButterflyPairsGameProps {
  onMenuClick: () => void
  onComplete?: () => void
  onBack?: () => void
  onNext?: () => void
  onRetry?: () => void
  userLoggedIn?: boolean
  currentSeason?: string
  isGameCompleted?: boolean
}

interface ButterflyHalf {
  id: string
  image: string
  pairId: string
  isLeft: boolean
  matched: boolean
}

export default function ButterflyPairsGame({ onMenuClick, onComplete, onBack, onNext, onRetry, userLoggedIn = false, currentSeason = "wiosna", isGameCompleted = false }: ButterflyPairsGameProps) {
  const { selectedSeason, getThemeColors } = useSeason()
  const theme = getThemeColors()

  // Define the butterfly halves based on season
  const springLeftHalves = useMemo(
    () => [
      { id: "blue-left", image: "/images/butterfly_05_left.svg", pairId: "blue", isLeft: true, matched: false },
      { id: "orange-left", image: "/images/butterfly_03_left.svg", pairId: "orange", isLeft: true, matched: false },
      { id: "green-left", image: "/images/butterfly_04_left.svg", pairId: "green", isLeft: true, matched: false },
    ],
    [],
  )

  const summerLeftHalves = useMemo(
    () => [
      { id: "cloud-left", image: "/images/cloud_left_summer.svg", pairId: "cloud", isLeft: true, matched: false },
      { id: "sun-left", image: "/images/sun_left_02_summer.svg", pairId: "sun", isLeft: true, matched: false },
      { id: "rainbow-left", image: "/images/rainbow_left_summer.svg", pairId: "rainbow", isLeft: true, matched: false },
    ],
    [],
  )

  const autumnLeftHalves = useMemo(
    () => [
      { id: "boot-left", image: "/images/boot_autumn_left.svg", pairId: "boot", isLeft: true, matched: false },
      { id: "coat-left", image: "/images/coat_autumn_left.svg", pairId: "coat", isLeft: true, matched: false },
      {
        id: "umbrella-left",
        image: "/images/umbrella_autumn_left.svg",
        pairId: "umbrella",
        isLeft: true,
        matched: false,
      },
    ],
    [],
  )

  const winterLeftHalves = useMemo(
    () => [
      { id: "boot-left", image: "/images/boot_01_winter_left.svg", pairId: "boot", isLeft: true, matched: false },
      { id: "hat-left", image: "/images/hat_winter_left.svg", pairId: "hat", isLeft: true, matched: false },
      { id: "glove-left", image: "/images/glove_winter_left.svg", pairId: "glove", isLeft: true, matched: false },
    ],
    [],
  )

  const getLeftHalves = () => {
    switch (selectedSeason) {
      case "lato":
        return summerLeftHalves
      case "jesien":
        return autumnLeftHalves
      case "zima":
        return winterLeftHalves
      default:
        return springLeftHalves
    }
  }

  const leftHalves = getLeftHalves()
  const [leftHalvesState, setLeftHalvesState] = useState<ButterflyHalf[]>(leftHalves)

  // State for tracking the current dragged item
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  // State for tracking if the dragged item is a left or right half
  const [draggedIsLeft, setDraggedIsLeft] = useState<boolean>(false)

  // State for error message
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // State for tracking if all pairs are matched
  const [allMatched, setAllMatched] = useState(false)

  // State for tracking matched pairs
  const [matchedPairs, setMatchedPairs] = useState<{ [key: string]: boolean }>({})

  // State for success message
  const [successMessage, setSuccessMessage] = useState<string>("")

  // Use the game completion hook
  const { recordCompletion, isLoggedIn, isHistoricallyCompleted } = useGameCompletionWithHistory("butterfly-pairs-game")

  // Function to initialize and shuffle right halves
  const initializeRightHalves = useCallback(() => {
    const springRightHalves = [
      { id: "blue-right", image: "/images/butterfly_05_right.svg", pairId: "blue", isLeft: false, matched: false },
      { id: "orange-right", image: "/images/butterfly_03_right.svg", pairId: "orange", isLeft: false, matched: false },
      { id: "green-right", image: "/images/butterfly_04_right.svg", pairId: "green", isLeft: false, matched: false },
    ]

    const summerRightHalves = [
      { id: "cloud-right", image: "/images/cloud_right_summer.svg", pairId: "cloud", isLeft: false, matched: false },
      { id: "sun-right", image: "/images/sun_right_02_summer.svg", pairId: "sun", isLeft: false, matched: false },
      {
        id: "rainbow-right",
        image: "/images/rainbow_right_summer.svg",
        pairId: "rainbow",
        isLeft: false,
        matched: false,
      },
    ]

    const autumnRightHalves = [
      { id: "boot-right", image: "/images/boot_autumn_right.svg", pairId: "boot", isLeft: false, matched: false },
      { id: "coat-right", image: "/images/coat_autumn_right.svg", pairId: "coat", isLeft: false, matched: false },
      {
        id: "umbrella-right",
        image: "/images/umbrella_autumn_right.svg",
        pairId: "umbrella",
        isLeft: false,
        matched: false,
      },
    ]

    const winterRightHalves = [
      { id: "boot-right", image: "/images/boot_01_winter_right.svg", pairId: "boot", isLeft: false, matched: false },
      { id: "hat-right", image: "/images/hat_winter_right.svg", pairId: "hat", isLeft: false, matched: false },
      { id: "glove-right", image: "/images/glove_winter_right.svg", pairId: "glove", isLeft: false, matched: false },
    ]

    const getInitialRightHalves = () => {
      switch (selectedSeason) {
        case "lato":
          return summerRightHalves
        case "jesien":
          return autumnRightHalves
        case "zima":
          return winterRightHalves
        default:
          return springRightHalves
      }
    }

    const initialRightHalves = getInitialRightHalves()

    // Shuffle the right halves
    const shuffled = [...initialRightHalves].sort(() => Math.random() - 0.5)
    return shuffled
  }, [selectedSeason])

  // State for right halves, initialized with shuffled values
  const [rightHalves, setRightHalves] = useState<ButterflyHalf[]>(initializeRightHalves)

  // Handle drag start
  const handleDragStart = (id: string, isLeft: boolean) => {
    setDraggedItem(id)
    setDraggedIsLeft(isLeft)
    setErrorMessage(null)
  }

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  // Handle drop
  const handleDrop = (e: React.DragEvent, targetId: string, targetIsLeft: boolean) => {
    e.preventDefault()

    if (!draggedItem) return

    // Don't allow dropping on the same type (left on left or right on right)
    if (draggedIsLeft === targetIsLeft) return

    let draggedHalf, targetHalf

    // Find the dragged and target halves based on whether they're left or right
    if (draggedIsLeft) {
      draggedHalf = leftHalvesState.find((half) => half.id === draggedItem)
      targetHalf = rightHalves.find((half) => half.id === targetId)
    } else {
      draggedHalf = rightHalves.find((half) => half.id === draggedItem)
      targetHalf = leftHalvesState.find((half) => half.id === targetId)
    }

    if (!draggedHalf || !targetHalf) return

    // Check if this is the correct match
    if (draggedHalf.pairId === targetHalf.pairId) {
      // Correct match - update matched pairs immediately
      const newMatchedPairs = { ...matchedPairs, [draggedHalf.pairId]: true }
      setMatchedPairs(newMatchedPairs)

      setLeftHalvesState((prevHalves) =>
        prevHalves.map((half) => (half.pairId === draggedHalf.pairId ? { ...half, matched: true } : half)),
      )

      setRightHalves((prevHalves) =>
        prevHalves.map((half) => (half.pairId === draggedHalf.pairId ? { ...half, matched: true } : half)),
      )

      setErrorMessage(null)

      // Check if all 3 pairs are now matched
      const totalMatched = Object.keys(newMatchedPairs).length
      if (totalMatched === 3) {
        setAllMatched(true)
        setSuccessMessage(getRandomSuccessMessage())

        // Record completion with season-specific game ID
        const gameId =
          selectedSeason === "lato"
            ? "butterfly-pairs-summer"
            : selectedSeason === "jesien"
              ? "butterfly-pairs-autumn"
              : selectedSeason === "zima"
                ? "butterfly-pairs-winter"
                : "butterfly-pairs"
                  recordCompletion()

        // Trigger the completion flow after 3 seconds to show success message
        if (onComplete) {
          setTimeout(() => {
          onComplete()
          }, 3000) // 3 second delay
        }
      }
    } else {
      // Incorrect match
      setErrorMessage("To tutaj nie pasuje")
    }

    setDraggedItem(null)
  }

  // Reset the game
  const resetGame = () => {
    setLeftHalvesState(leftHalves.map((half) => ({ ...half, matched: false })))
    setRightHalves(initializeRightHalves()) // Re-initialize and shuffle right halves
    setAllMatched(false)
    setErrorMessage(null)
    setMatchedPairs({})
    setSuccessMessage("")
  }

  // Get season-specific assets
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

  const titleBoxImage = getTitleBoxImage()

  // Function to get the right margin for connecting halves based on season and pair
  const getRightHalfMargin = (pairId: string, index: number) => {
    if (selectedSeason === "lato") {
      // Summer assets need different positioning
      switch (pairId) {
        case "cloud":
          return "-ml-1"
        case "sun":
          return "-ml-0" // No margin for sun as the new assets should connect seamlessly
        case "rainbow":
          return "-ml-1"
        default:
          return "-ml-1"
      }
    } else if (selectedSeason === "jesien") {
      // Autumn assets positioning - adjusted for proper connection
      switch (pairId) {
        case "boot":
          return "-ml-1"
        case "coat":
          return "-ml-[32px]" // Negative margin of 32px for coat alignment
        case "umbrella":
          return "-ml-[12px]" // Negative margin of 12px for umbrella alignment
        default:
          return "-ml-1"
      }
    } else if (selectedSeason === "zima") {
      // Winter assets positioning
      switch (pairId) {
        case "boot":
          return "-ml-1"
        case "hat":
          return "-ml-1"
        case "glove":
          return "-ml-1"
        default:
          return "-ml-1"
      }
    } else {
      // Spring butterfly assets
      return index < 2 ? "-ml-0" : "-ml-2"
    }
  }

  return (
    <div className="w-full max-w-4xl" style={{ backgroundColor: theme.backgroundColor }}>
      {/* Header with title */}
      <div className="w-full flex justify-between items-center mb-8">
        <div className="relative w-16 h-16">
          <SoundButtonEnhanced
            text="ZNAJDŹ PARY."
            soundIcon={theme.soundIcon || "/images/sound_icon_dragon_page.svg"}
            size="xl"
            className="w-full h-full"
          />
        </div>

        <div className="relative h-24 w-80 md:w-[500px] flex items-center justify-center">
          <Image src={titleBoxImage || "/placeholder.svg"} alt="Title box" fill className="object-contain" />
          <span className="relative z-10 text-white text-2xl md:text-3xl font-sour-gummy font-thin">ZNAJDŹ PARY.</span>
        </div>

        <div className="relative w-16 h-16" onClick={onMenuClick}>
          <Image src={theme.menuIcon || "/placeholder.svg"} alt="Menu" fill className="object-contain cursor-pointer" />
        </div>
      </div>

      {/* Game area */}
      <div className="flex justify-center items-center mt-16">
        <div className="flex flex-col">
          {/* Main game container */}
          <div className="flex justify-center gap-32">
            {/* Left halves column */}
            <div className="flex flex-col gap-8">
              {leftHalvesState.map((half, index) => (
                <div key={half.id} className="relative">
                  {half.matched ? (
                    // When matched, display both halves side by side with proper connection
                    <div className="flex items-center">
                      {/* Left half */}
                      <div className="relative h-24 w-16">
                        <Image
                          src={half.image || "/placeholder.svg"}
                          alt={`Left half ${half.id}`}
                          fill
                          className="object-contain"
                        />
                      </div>

                      {/* Right half - positioned to connect seamlessly */}
                      <div className={`relative h-24 w-16 ${getRightHalfMargin(half.pairId, index)}`}>
                        <Image
                          src={rightHalves.find((right) => right.pairId === half.pairId)?.image || ""}
                          alt={`Right half ${half.pairId}`}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  ) : (
                    // When not matched, display draggable left half with extended drop zone
                    <div
                      className="relative h-24 w-32 cursor-grab flex items-center"
                      draggable
                      onDragStart={() => handleDragStart(half.id, true)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, half.id, true)}
                    >
                      <div className="relative h-24 w-16">
                        <Image
                          src={half.image || "/placeholder.svg"}
                          alt={`Left half ${half.id}`}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right halves column */}
            <div className="flex flex-col gap-8">
              {rightHalves.map((half) => (
                <div
                  key={half.id}
                  className={`relative h-24 w-32 ${half.matched ? "opacity-0" : "cursor-grab"} flex items-center justify-end`}
                  draggable={!half.matched}
                  onDragStart={half.matched ? undefined : () => handleDragStart(half.id, false)}
                  onDragOver={half.matched ? undefined : handleDragOver}
                  onDrop={half.matched ? undefined : (e) => handleDrop(e, half.id, false)}
                >
                  <div className="relative h-24 w-16">
                    <Image
                      src={half.image || "/placeholder.svg"}
                      alt={`Right half ${half.id}`}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Error message */}
          {errorMessage && <div className="mt-8 text-red-600 font-medium text-lg text-center">{errorMessage}</div>}

          {/* Success message */}
          {allMatched && successMessage && (
            <SuccessMessage message={successMessage} />
          )}

          {/* New Navigation Buttons */}
          <div className="flex justify-center gap-4 mt-8 w-full">
            {/* All buttons in same container with identical dimensions */}
            <div className="flex gap-4 items-end">
              {/* WRÓĆ Button - always available in butterfly-pairs-game */}
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

              {/* JESZCZE RAZ Button - always visible, but only clickable when game is completed */}
              <div 
                className={`relative w-52 h-14 transition-all ${allMatched ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed opacity-50'}`}
                onClick={allMatched ? resetGame : undefined}
              >
                <Image 
                  src={theme.jeszczeRazButton || "/images/jeszcze_raz_wiosna.svg"} 
                  alt="Jeszcze raz button" 
                  fill 
                  className="object-contain" 
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-sour-gummy font-bold text-lg text-white">JESZCZE RAZ</span>
                </div>
              </div>

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

          {/* Login reminder for non-logged in users */}
          {!isLoggedIn && (
            <div className="mt-4 text-center text-gray-600">
              <p>Zaloguj się, aby zapisać swój postęp!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
