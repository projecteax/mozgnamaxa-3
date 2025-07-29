"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useGameCompletion } from "@/hooks/use-game-completion"
import { getRandomSuccessMessage } from "@/lib/success-messages"
import { useSeason } from "@/contexts/season-context"
import SuccessMessage from "./success-message"

interface SpotDifferenceGameProps {
  onMenuClick: () => void
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

export default function SpotDifferenceGame({ onMenuClick }: SpotDifferenceGameProps) {
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
  const { recordCompletion, isLoggedIn } = useGameCompletion()

  // Check for game completion when foundCount changes
  useEffect(() => {
    if (foundCount === differences.length && !isCompleted) {
      setIsCompleted(true)
      setSuccessMessage(getRandomSuccessMessage())

      // Record completion when all differences are found
      if (isLoggedIn && !hasRecordedCompletion) {
        console.log("Recording completion for spot-difference")
        recordCompletion("spot-difference")
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
          <Image
            src={theme.soundIcon || "/placeholder.svg"}
            alt="Sound"
            fill
            className="object-contain cursor-pointer"
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

        {/* Reset button - only visible when game is completed */}
        {isCompleted && (
          <div className="flex justify-center mt-8">
            <button onClick={resetGame} className="bg-[#539e1b] text-white px-6 py-3 rounded-full font-bold text-lg">
              Zagraj ponownie
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
