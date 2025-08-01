"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useGameCompletionWithHistory } from "@/hooks/use-game-completion"
import { getRandomSuccessMessage } from "@/lib/success-messages"
import { useSeason } from "@/contexts/season-context"
import SuccessMessage from "./success-message"
import SoundButtonEnhanced from "./sound-button-enhanced"

interface SpotDifferenceGameProps {
  onMenuClick: () => void
  onBack?: () => void
  onNext?: () => void
  onRetry?: () => void
  userLoggedIn?: boolean
  currentSeason?: string
  isGameCompleted?: boolean
}

// Update the Difference interface to use proportional coordinates
interface Difference {
  id: number
  name: string
  xProp: number // Proportional x-coordinate (0-1)
  yProp: number // Proportional y-coordinate (0-1)
  radius: number
  found: boolean
}

export default function SpotDifferenceGame({ onMenuClick, onBack, onNext, onRetry, userLoggedIn = false, currentSeason = "wiosna", isGameCompleted = false }: SpotDifferenceGameProps) {
  const { selectedSeason, getThemeColors } = useSeason()
  const theme = getThemeColors()

  // Get differences based on season
  const getDifferences = () => {
    if (selectedSeason === "lato") {
      // Summer differences with positions
      return [
        { id: 1, name: "difference1", xProp: 0.35, yProp: 0.25, radius: 30, found: false },
        { id: 2, name: "difference2", xProp: 0.7, yProp: 0.4, radius: 30, found: false },
        { id: 3, name: "difference3", xProp: 0.55, yProp: 0.85, radius: 30, found: false },
      ]
    } else if (selectedSeason === "jesien") {
      // Autumn differences with new positions
      return [
        { id: 1, name: "difference1", xProp: 0.06, yProp: 0.52, radius: 30, found: false },
        { id: 2, name: "difference2", xProp: 0.35, yProp: 0.7, radius: 30, found: false },
        { id: 3, name: "difference3", xProp: 0.41, yProp: 0.87, radius: 30, found: false },
      ]
    } else if (selectedSeason === "zima") {
      // Winter differences with specified positions
      return [
        { id: 1, name: "difference1", xProp: 0.12, yProp: 0.35, radius: 30, found: false },
        { id: 2, name: "difference2", xProp: 0.75, yProp: 0.25, radius: 30, found: false },
        { id: 3, name: "difference3", xProp: 0.8, yProp: 0.6, radius: 30, found: false },
      ]
    } else {
      // Spring differences with original positions
      return [
        { id: 1, name: "animal", xProp: 6 / 15, yProp: 3 / 11, radius: 30, found: false },
        { id: 2, name: "egg", xProp: 8 / 15, yProp: 5 / 11, radius: 30, found: false },
        { id: 3, name: "bow", xProp: 10 / 15, yProp: 6 / 11, radius: 60, found: false },
      ]
    }
  }

  // Initialize differences based on season
  const [differences, setDifferences] = useState<Difference[]>(getDifferences())

  // Update differences when season changes
  useEffect(() => {
    setDifferences(getDifferences())
    setFoundCount(0)
    setIsCompleted(false)
    setSuccessMessage(null)
    setHasRecordedCompletion(false)
  }, [selectedSeason])

  // State for tracking game completion
  const [isCompleted, setIsCompleted] = useState(false)
  const [hasRecordedCompletion, setHasRecordedCompletion] = useState(false)

  // State for tracking the number of differences found
  const [foundCount, setFoundCount] = useState(0)

  // State for success message
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Use the game completion hook
  const { recordCompletion, isLoggedIn, isHistoricallyCompleted } = useGameCompletionWithHistory("spot-difference-game")

  // Check for game completion when foundCount changes
  useEffect(() => {
    if (foundCount === differences.length && !isCompleted) {
      setIsCompleted(true)
      setSuccessMessage(getRandomSuccessMessage())

      // Record completion when all differences are found
      if (isLoggedIn && !hasRecordedCompletion) {
        console.log("Recording completion for spot-difference")
        recordCompletion()
          .then(() => {
            console.log("✅ Completion recorded successfully")
            setHasRecordedCompletion(true)
          })
          .catch((error) => {
            console.error("❌ Failed to record completion:", error)
          })
      }
    }
  }, [foundCount, differences.length, isCompleted, isLoggedIn, recordCompletion, hasRecordedCompletion])

  // Update the handleClickLeft function to use proportional coordinates
  const handleClickLeft = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Calculate proportional coordinates (0-1)
    const xProp = x / rect.width
    const yProp = y / rect.height

    checkForDifference(xProp, yProp, "left")
  }

  // Update the handleClickRight function to use proportional coordinates
  const handleClickRight = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Calculate proportional coordinates (0-1)
    const xProp = x / rect.width
    const yProp = y / rect.height

    checkForDifference(xProp, yProp, "right")
  }

  // Update the checkForDifference function to use proportional coordinates
  const checkForDifference = (xProp: number, yProp: number, side: "left" | "right") => {
    // If game is completed, ignore clicks
    if (isCompleted) return

    // Check each difference
    differences.forEach((diff) => {
      // Skip if already found
      if (diff.found) return

      // Calculate distance from click to difference center using proportional coordinates
      const distance = Math.sqrt(Math.pow(xProp - diff.xProp, 2) + Math.pow(yProp - diff.yProp, 2))

      // Convert radius to proportional value based on image width
      const radiusProp = diff.radius / 400

      // If click is within the proportional radius of the difference
      if (distance <= radiusProp) {
        // Mark as found
        setDifferences((prevDiffs) => prevDiffs.map((d) => (d.id === diff.id ? { ...d, found: true } : d)))

        // Increment found count
        setFoundCount((prev) => prev + 1)
      }
    })
  }

  // Reset the game
  const resetGame = () => {
    setDifferences(getDifferences())
    setFoundCount(0)
    setIsCompleted(false)
    setSuccessMessage(null)
    setHasRecordedCompletion(false)
  }

  // Get images based on season
  const getImages = () => {
    if (selectedSeason === "lato") {
      return {
        leftImage: "/images/differences_3_summer_left.svg",
        rightImage: "/images/differences_3_summer_right.svg",
      }
    } else if (selectedSeason === "jesien") {
      return {
        leftImage: "/images/differences_3_autumn_left.svg",
        rightImage: "/images/differences_3_autumn_right.svg",
      }
    } else if (selectedSeason === "zima") {
      return {
        leftImage: "/images/differences_3_winter_left.svg",
        rightImage: "/images/differences_3_winter_right.svg",
      }
    } else {
      return {
        leftImage: "/images/find_differencies_01.svg",
        rightImage: "/images/find_differencies_02.svg",
      }
    }
  }

  const images = getImages()

  
  

  return (
    <div className="w-full max-w-4xl" style={{ backgroundColor: theme.background }}>
      {/* Header with title - exactly matching matching-game structure */}
      <div className="w-full flex justify-between items-center mb-8">
        <div className="relative w-16 h-16">
          <SoundButtonEnhanced
            text="ZNAJDŹ 3 RÓŻNICE."
            soundIcon={theme.soundIcon || "/images/sound_icon_dragon_page.svg"}
            size="xl"
            className="w-full h-full"
          />
        </div>

        <div className="relative h-24 w-80 md:w-[500px] flex items-center justify-center">
          <Image
            src={theme.titleBox || "/images/title_box_small.png"}
            alt="Title box"
            fill
            className="object-contain"
          />
          <span className="relative z-10 text-white text-2xl md:text-3xl font-sour-gummy font-thin">
            ZNAJDŹ 3 RÓŻNICE.
          </span>
        </div>

        <div className="relative w-16 h-16" onClick={onMenuClick}>
          <Image src={theme.menuIcon || "/placeholder.svg"} alt="Menu" fill className="object-contain cursor-pointer" />
        </div>
      </div>

      {/* Game area */}
      <div className="flex flex-col items-center">
        <div className="flex flex-col md:flex-row justify-center gap-4 w-full">
          {/* Left image */}
          <div className="relative" style={{ width: "400px", height: "320px" }}>
            <div className="absolute inset-0 cursor-pointer" onClick={handleClickLeft}>
              <Image
                src={images.leftImage || "/placeholder.svg"}
                alt="Find differences - Image 1"
                fill
                className="object-contain"
              />

              {/* Update the circles for found differences to use proportional coordinates */}
              {differences.map(
                (diff) =>
                  diff.found && (
                    <div
                      key={`left-${diff.id}`}
                      className="absolute rounded-full border-4 border-[#539e1b] animate-pulse"
                      style={{
                        left: `${diff.xProp * 100}%`,
                        top: `${diff.yProp * 100}%`,
                        width: diff.radius * 2,
                        height: diff.radius * 2,
                        transform: "translate(-50%, -50%)",
                      }}
                    />
                  ),
              )}
            </div>
          </div>

          {/* Right image */}
          <div className="relative" style={{ width: "400px", height: "320px" }}>
            <div className="absolute inset-0 cursor-pointer" onClick={handleClickRight}>
              <Image
                src={images.rightImage || "/placeholder.svg"}
                alt="Find differences - Image 2"
                fill
                className="object-contain"
              />

              {/* Update the circles for found differences on right image */}
              {differences.map(
                (diff) =>
                  diff.found && (
                    <div
                      key={`right-${diff.id}`}
                      className="absolute rounded-full border-4 border-[#539e1b] animate-pulse"
                      style={{
                        left: `${diff.xProp * 100}%`,
                        top: `${diff.yProp * 100}%`,
                        width: diff.radius * 2,
                        height: diff.radius * 2,
                        transform: "translate(-50%, -50%)",
                      }}
                    />
                  ),
              )}
            </div>
          </div>
        </div>

        {/* Success message */}
        {successMessage && <SuccessMessage message={successMessage} />}

        {/* New Navigation Buttons */}
        <div className="flex justify-center gap-4 mt-8 w-full">
          {/* All buttons in same container with identical dimensions */}
          <div className="flex gap-4 items-end">
            {/* WRÓĆ Button - always available in spot-difference-game */}
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
              className={`relative w-52 h-14 transition-all ${successMessage ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed opacity-50'}`}
              onClick={successMessage ? resetGame : undefined}
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
              className={`relative w-36 h-14 transition-all ${(userLoggedIn && !successMessage && !isHistoricallyCompleted) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-105'}`}
              onClick={(userLoggedIn && !successMessage && !isHistoricallyCompleted) ? undefined : onNext}
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
        {!userLoggedIn && (
          <div className="mt-4 text-center text-gray-600">
            <p>Zaloguj się, aby zapisać swój postęp!</p>
          </div>
        )}
      </div>
    </div>
  )
}
