"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { useGameCompletionWithHistory } from "@/hooks/use-game-completion"
import { getRandomSuccessMessage } from "@/lib/success-messages"
import { useSeason } from "@/contexts/season-context"
import SuccessMessage from "./success-message"
import SoundButtonEnhanced from "./sound-button-enhanced"

interface Find6DifferencesGameProps {
  onMenuClick: () => void
  onComplete?: () => void
  onBack?: () => void
  onNext?: () => void
  onRetry?: () => void
  userLoggedIn?: boolean
  currentSeason?: string
  isGameCompleted?: boolean
}

// Define the Difference interface with proportional coordinates
interface Difference {
  id: number
  name: string
  xProp: number // Proportional x-coordinate (0-1)
  yProp: number // Proportional y-coordinate (0-1)
  radius: number
  found: boolean
}

export default function Find6DifferencesGame({ onMenuClick, onComplete, onBack, onNext, onRetry, userLoggedIn = false, currentSeason = "wiosna", isGameCompleted = false }: Find6DifferencesGameProps) {
  const { selectedSeason, getThemeColors } = useSeason()
  const theme = getThemeColors()
  const isSummer = selectedSeason === "lato"
  const isAutumn = selectedSeason === "jesien"
  const isWinter = selectedSeason === "zima"

  // Define the differences array with proportional coordinates based on season
  const getInitialDifferences = (): Difference[] => {
    if (isSummer) {
      return [
        // Summer differences with updated locations and 40px radius circles
        { id: 1, name: "difference-1", xProp: 0.94, yProp: 0.12, radius: 40, found: false },
        { id: 2, name: "difference-2", xProp: 0.25, yProp: 0.4, radius: 40, found: false },
        { id: 3, name: "difference-3", xProp: 0.45, yProp: 0.65, radius: 40, found: false },
        { id: 4, name: "difference-4", xProp: 0.3, yProp: 0.7, radius: 40, found: false },
        { id: 5, name: "difference-5", xProp: 0.68, yProp: 0.69, radius: 40, found: false },
        { id: 6, name: "difference-6", xProp: 0.95, yProp: 0.8, radius: 40, found: false },
      ]
    } else if (isAutumn) {
      return [
        // Autumn differences with new locations and 40px radius circles
        { id: 1, name: "difference-1", xProp: 0.42, yProp: 0.4, radius: 40, found: false },
        { id: 2, name: "difference-2", xProp: 0.55, yProp: 0.47, radius: 40, found: false },
        { id: 3, name: "difference-3", xProp: 0.92, yProp: 0.45, radius: 40, found: false },
        { id: 4, name: "difference-4", xProp: 0.07, yProp: 0.78, radius: 40, found: false }, // Updated yProp for 4th difference
        { id: 5, name: "difference-5", xProp: 0.68, yProp: 0.8, radius: 40, found: false },
        { id: 6, name: "difference-6", xProp: 0.83, yProp: 0.6, radius: 40, found: false },
      ]
    } else if (isWinter) {
      return [
        // Winter differences with new locations and 40px radius circles
        { id: 1, name: "difference-1", xProp: 0.22, yProp: 0.12, radius: 40, found: false },
        { id: 2, name: "difference-2", xProp: 0.39, yProp: 0.28, radius: 40, found: false },
        { id: 3, name: "difference-3", xProp: 0.58, yProp: 0.25, radius: 40, found: false },
        { id: 4, name: "difference-4", xProp: 0.33, yProp: 0.5, radius: 40, found: false },
        { id: 5, name: "difference-5", xProp: 0.68, yProp: 0.6, radius: 40, found: false },
        { id: 6, name: "difference-6", xProp: 0.9, yProp: 0.48, radius: 40, found: false },
      ]
    } else {
      return [
        // Spring differences with original locations and original circle size
        { id: 1, name: "difference-1", xProp: 0.45, yProp: 0.18, radius: 60, found: false },
        { id: 2, name: "difference-2", xProp: 0.7, yProp: 0.2, radius: 60, found: false },
        { id: 3, name: "difference-3", xProp: 0.15, yProp: 0.4, radius: 60, found: false },
        { id: 4, name: "difference-4", xProp: 0.85, yProp: 0.43, radius: 60, found: false },
        { id: 5, name: "difference-5", xProp: 0.7, yProp: 0.6, radius: 60, found: false },
        { id: 6, name: "difference-6", xProp: 0.25, yProp: 0.85, radius: 60, found: false },
      ]
    }
  }

  const [differences, setDifferences] = useState<Difference[]>(getInitialDifferences())

  // State for tracking game completion
  const [isCompleted, setIsCompleted] = useState(false)

  // State for tracking the number of differences found
  const [foundCount, setFoundCount] = useState(0)

  // State for success message
  const [successMessage, setSuccessMessage] = useState<string>("")

  // Use the game completion hook with automatic historical completion refresh
  const { recordCompletion, isLoggedIn, isHistoricallyCompleted } = useGameCompletionWithHistory("find-6-differences-game")

  // Reset game when season changes
  useEffect(() => {
    const newDifferences = getInitialDifferences()
    setDifferences(newDifferences)
    setFoundCount(0)
    setIsCompleted(false)
    setSuccessMessage("")
  }, [selectedSeason])

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

      // Convert radius to proportional value based on image width (assuming image width is 500px for radius calculation)
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
    const newDifferences = getInitialDifferences()
    setDifferences(newDifferences)
    setFoundCount(0)
    setIsCompleted(false)
    setSuccessMessage("")
  }

  // Get images based on season
  const getImages = () => {
    if (isSummer) {
      return {
        leftImage: "/images/differences_6_summer_left.svg",
        rightImage: "/images/differences_6_summer_right.svg",
      }
    } else if (isAutumn) {
      return {
        leftImage: "/images/differences_6_autumn_left.svg",
        rightImage: "/images/differences_6_autumn_right.svg",
      }
    } else if (isWinter) {
      return {
        leftImage: "/images/find_differences_6_left.svg",
        rightImage: "/images/find_differences_6_right.svg",
      }
    } else {
      return {
        leftImage: "/images/find_6_differences_left_image.svg",
        rightImage: "/images/find_6_differences_right_image.svg",
      }
    }
  }

  const images = getImages()

  // Get title box image based on season
  const getTitleBoxImage = () => {
    if (isSummer) {
      return "/images/title_box_small_summer.svg"
    } else if (isAutumn) {
      return "/images/title_box_small_autumn.svg"
    } else if (isWinter) {
      return "/images/title_box_small_winter.svg"
    } else {
      return "/images/title_box_small.png"
    }
  }

  return (
    <div className="w-full max-w-4xl">
      {/* Header with title */}
      <div className="w-full flex justify-between items-center mb-8">
        <div className="relative w-16 h-16">
          <SoundButtonEnhanced
            text="ZNAJDŹ 6 RÓŻNIC"
            soundIcon={theme.soundIcon || "/images/sound_icon_dragon_page.svg"}
            size="xl"
            className="w-full h-full"
          />
        </div>

        <div className="relative h-24 w-80 md:w-[500px] flex items-center justify-center">
          <Image src={getTitleBoxImage() || "/placeholder.svg"} alt="Title box" fill className="object-contain" />
          <span className="relative z-10 text-white text-2xl md:text-3xl font-bold font-sour-gummy">
            ZNAJDŹ 6 RÓŻNIC
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

        {/* Success message - only visible when the game is complete */}
        {isCompleted && successMessage && <SuccessMessage message={successMessage} />}
      </div>

      {/* New Navigation Buttons - Always visible */}
      <div className="flex justify-center gap-4 mt-8 w-full">
        {/* All buttons in same container with identical dimensions */}
        <div className="flex gap-4 items-end">
          {/* WRÓĆ Button - always available in find-6-differences-game */}
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
            className={`relative w-36 h-14 transition-all ${(userLoggedIn && !isCompleted && !isHistoricallyCompleted) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-105'}`}
            onClick={(userLoggedIn && !isCompleted && !isHistoricallyCompleted) ? undefined : onNext}
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
