"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useGameCompletionWithHistory } from "@/hooks/use-game-completion"
import { getRandomSuccessMessage } from "@/lib/success-messages"
import { useSeason } from "@/contexts/season-context"
import SuccessMessage from "./success-message"
import SoundButtonEnhanced from "./sound-button-enhanced"

interface SpotDifferenceGame5Props {
  onMenuClick: () => void
  onComplete?: () => void
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

export default function SpotDifferenceGame5({ onMenuClick, onComplete, onBack, onNext, onRetry, userLoggedIn = false, currentSeason = "wiosna", isGameCompleted = false }: SpotDifferenceGame5Props) {
  const { selectedSeason, getThemeColors } = useSeason()
  const theme = getThemeColors()

  // Define the differences array with proportional coordinates based on season
  const getDifferences = () => {
    if (selectedSeason === "lato") {
      // Summer differences with new locations
      return [
        { id: 1, name: "difference-1", xProp: 0.25, yProp: 0.15, radius: 60, found: false },
        { id: 2, name: "difference-2", xProp: 0.1, yProp: 0.5, radius: 60, found: false },
        { id: 3, name: "difference-3", xProp: 0.42, yProp: 0.58, radius: 60, found: false },
        { id: 4, name: "difference-4", xProp: 0.9, yProp: 0.4, radius: 60, found: false },
        { id: 5, name: "difference-5", xProp: 0.65, yProp: 0.85, radius: 60, found: false },
      ]
    } else if (selectedSeason === "jesien") {
      // Autumn differences with new locations
      return [
        { id: 1, name: "difference-1", xProp: 0.35, yProp: 0.07, radius: 60, found: false },
        { id: 2, name: "difference-2", xProp: 0.6, yProp: 0.36, radius: 60, found: false },
        { id: 3, name: "difference-3", xProp: 0.95, yProp: 0.4, radius: 60, found: false },
        { id: 4, name: "difference-4", xProp: 0.43, yProp: 0.55, radius: 60, found: false },
        { id: 5, name: "difference-5", xProp: 0.09, yProp: 0.8, radius: 60, found: false },
      ]
    } else if (selectedSeason === "zima") {
      // Winter differences with new locations
      return [
        { id: 1, name: "difference-1", xProp: 0.3, yProp: 0.21, radius: 60, found: false },
        { id: 2, name: "difference-2", xProp: 0.86, yProp: 0.1, radius: 60, found: false },
        { id: 3, name: "difference-3", xProp: 0.11, yProp: 0.76, radius: 60, found: false },
        { id: 4, name: "difference-4", xProp: 0.45, yProp: 0.68, radius: 60, found: false },
        { id: 5, name: "difference-5", xProp: 0.8, yProp: 0.85, radius: 60, found: false },
      ]
    } else {
      // Spring differences with original locations
      return [
        { id: 1, name: "difference-1", xProp: 5 / 15, yProp: 4 / 11, radius: 60, found: false },
        { id: 2, name: "difference-2", xProp: 7.5 / 15, yProp: 3 / 11, radius: 60, found: false },
        { id: 3, name: "difference-3", xProp: 5 / 15, yProp: 7 / 11, radius: 60, found: false },
        { id: 4, name: "difference-4", xProp: 12 / 15, yProp: 8 / 11, radius: 60, found: false },
        { id: 5, name: "difference-5", xProp: 10.5 / 15, yProp: 9.5 / 11, radius: 60, found: false },
      ]
    }
  }

  const [differences, setDifferences] = useState<Difference[]>(getDifferences())

  // State for tracking game completion
  const [isCompleted, setIsCompleted] = useState(false)

  // State for success message
  const [successMessage, setSuccessMessage] = useState<string>("")

  // State for tracking the number of differences found
  const [foundCount, setFoundCount] = useState(0)

  // Use the game completion hook with automatic historical completion refresh
  const { recordCompletion, isLoggedIn, isHistoricallyCompleted } = useGameCompletionWithHistory("spot-difference-game-5")

  // Handle click on left image
  const handleClickLeft = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Calculate proportional coordinates (0-1)
    const xProp = x / rect.width
    const yProp = y / rect.height

    checkForDifference(xProp, yProp, "left")
  }

  // Handle click on right image
  const handleClickRight = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Calculate proportional coordinates (0-1)
    const xProp = x / rect.width
    const yProp = y / rect.height

    checkForDifference(xProp, yProp, "right")
  }

  // Check if click is on a difference
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
      const radiusProp = diff.radius / 500

      // If click is within the proportional radius of the difference
      if (distance <= radiusProp) {
        // Mark as found
        setDifferences((prevDiffs) => prevDiffs.map((d) => (d.id === diff.id ? { ...d, found: true } : d)))

        // Increment found count
        setFoundCount((prev) => prev + 1)

        // Check if all differences are found
        if (foundCount + 1 === differences.length) {
          setIsCompleted(true)
          setSuccessMessage(getRandomSuccessMessage())

          // Record completion when game is finished
          if (isLoggedIn) {
            recordCompletion()
          }

          // Call completion callback after 3 seconds to show success message
          if (onComplete) {
            setTimeout(() => {
            onComplete()
            }, 3000) // 3 second delay
          }
        }
      }
    })
  }

  // Reset the game
  const resetGame = () => {
    const newDifferences = getDifferences()
    setDifferences(newDifferences)
    setFoundCount(0)
    setIsCompleted(false)
    setSuccessMessage("")
  }

  // Get images based on season
  const getImages = () => {
    if (selectedSeason === "lato") {
      return {
        leftImage: "/images/differences_5_summer_left.svg",
        rightImage: "/images/differences_5_summer_right.svg",
      }
    } else if (selectedSeason === "jesien") {
      return {
        leftImage: "/images/differences_5_autumn_left.svg",
        rightImage: "/images/differences_5_autumn_right.svg",
      }
    } else if (selectedSeason === "zima") {
      return {
        leftImage: "/images/differences_5_winter_left.svg",
        rightImage: "/images/differences_5_winter_right.svg",
      }
    } else {
      return {
        leftImage: "/images/differencies_b_01.svg",
        rightImage: "/images/differencies_b_02.svg",
      }
    }
  }

  const images = getImages()

  return (
    <div className="w-full max-w-4xl" style={{ backgroundColor: theme.background }}>
      {/* Header with title */}
      <div className="w-full flex justify-between items-center mb-8">
        <div className="relative w-16 h-16">
          <SoundButtonEnhanced
            text="ZNAJDŹ RÓŻNICE."
            soundIcon={theme.soundIcon || "/images/sound_icon_dragon_page.svg"}
            size="xl"
            className="w-full h-full"
          />
        </div>

        <div className="relative h-24 w-80 md:w-[500px] flex items-center justify-center">
          <Image src={theme.titleBox || "/placeholder.svg"} alt="Title box" fill className="object-contain" />
          <span className="relative z-10 text-white text-2xl md:text-3xl font-sour-gummy font-thin">ZNAJDŹ RÓŻNICE.</span>
        </div>

        <div className="relative w-16 h-16" onClick={onMenuClick}>
          <Image src={theme.menuIcon || "/placeholder.svg"} alt="Menu" fill className="object-contain cursor-pointer" />
        </div>
      </div>

      {/* Game area */}
      <div className="flex flex-col items-center">
        <div className="flex flex-col md:flex-row justify-center gap-4 w-full">
          {/* Left image */}
          <div className="relative" style={{ width: "500px", height: "400px" }}>
            <div className="absolute inset-0 cursor-pointer" onClick={handleClickLeft}>
              <Image
                src={images.leftImage || "/placeholder.svg"}
                alt="Find differences - Image 1"
                fill
                className="object-contain"
              />

              {/* Circles for found differences */}
              {differences.map(
                (diff) =>
                  diff.found && (
                    <div
                      key={`left-${diff.id}`}
                      className="absolute rounded-full border-4 border-[#539e1b] animate-pulse"
                      style={{
                        left: `${diff.xProp * 100}%`,
                        top: `${diff.yProp * 100}%`,
                        width: `${diff.radius * 2}px`,
                        height: `${diff.radius * 2}px`,
                        transform: "translate(-50%, -50%)",
                      }}
                    />
                  ),
              )}
            </div>
          </div>

          {/* Right image */}
          <div className="relative" style={{ width: "500px", height: "400px" }}>
            <div className="absolute inset-0 cursor-pointer" onClick={handleClickRight}>
              <Image
                src={images.rightImage || "/placeholder.svg"}
                alt="Find differences - Image 2"
                fill
                className="object-contain"
              />

              {/* Circles for found differences on right image */}
              {differences.map(
                (diff) =>
                  diff.found && (
                    <div
                      key={`right-${diff.id}`}
                      className="absolute rounded-full border-4 border-[#539e1b] animate-pulse"
                      style={{
                        left: `${diff.xProp * 100}%`,
                        top: `${diff.yProp * 100}%`,
                        width: `${diff.radius * 2}px`,
                        height: `${diff.radius * 2}px`,
                        transform: "translate(-50%, -50%)",
                      }}
                    />
                  ),
              )}
            </div>
          </div>
        </div>

        {/* Success message */}
        {isCompleted && successMessage && (
          <SuccessMessage message={successMessage} />
        )}

        {/* New Navigation Buttons */}
        <div className="flex justify-center gap-4 mt-8 w-full">
          {/* All buttons in same container with identical dimensions */}
          <div className="flex gap-4 items-end">
            {/* WRÓĆ Button - always available in spot-difference-game-5 */}
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
              className={`relative w-52 h-14 transition-all ${isCompleted ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed opacity-50'}`}
              onClick={isCompleted ? resetGame : undefined}
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
      </div>
    </div>
  )
}
