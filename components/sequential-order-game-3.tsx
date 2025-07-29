"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useGameCompletion } from "@/hooks/use-game-completion"
import { getRandomSuccessMessage } from "@/lib/success-messages"
import { useSeason } from "@/contexts/season-context"

// Define the types for our items
type Item = {
  id: string
  name: string
  image: string
  summerImage: string
  autumnImage: string
  winterImage: string
}

interface SequentialOrderGame3Props {
  onMenuClick: () => void
  onComplete?: () => void
}

export default function SequentialOrderGame3({ onMenuClick, onComplete }: SequentialOrderGame3Props) {
  const { selectedSeason, getThemeColors } = useSeason()
  const theme = getThemeColors()
  const isWinter = selectedSeason === "zima"
  const isSummer = selectedSeason === "lato"
  const isAutumn = selectedSeason === "jesien"

  // Define the correct sequence: worm -> cocoon -> butterfly (or ice stages in summer, or patterns in autumn, or winter sequence in winter)
  const sequenceItems: Item[] = [
    {
      id: "worm",
      name: isWinter ? "Winter Stage 1" : isSummer ? "Ice Stage 1" : isAutumn ? "Pattern 1" : "Worm",
      image: "/images/worm.svg",
      summerImage: "/images/ice_stage_01_summer.svg",
      autumnImage: "/images/pattern_autumn_01.svg",
      winterImage: "/images/sequence_winter_01.svg",
    },
    {
      id: "cocoon",
      name: isWinter ? "Winter Stage 2" : isSummer ? "Ice Stage 2" : isAutumn ? "Pattern 2" : "Cocoon",
      image: "/images/cocoon.svg",
      summerImage: "/images/ice_stage_02_summer.svg",
      autumnImage: "/images/pattern_autumn_02.svg",
      winterImage: "/images/sequence_winter_02.svg",
    },
    {
      id: "butterfly",
      name: isWinter ? "Winter Stage 3" : isSummer ? "Ice Stage 3" : isAutumn ? "Pattern 3" : "Butterfly",
      image: "/images/butterfly_yellow_new.svg",
      summerImage: "/images/ice_stage_03_summer.svg",
      autumnImage: "/images/pattern_autumn_03.svg",
      winterImage: "/images/sequence_winter_03.svg",
    },
  ]

  // State for tracking which items have been correctly placed
  const [correctItems, setCorrectItems] = useState<string[]>([])

  // State for tracking the current dragged item
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  // State for tracking if the game is complete
  const [isGameComplete, setIsGameComplete] = useState(false)

  // State for success message
  const [successMessage, setSuccessMessage] = useState<string>("")

  // State for shuffled draggable items
  const [shuffledItems, setShuffledItems] = useState<Item[]>([])

  // Use the game completion hook
  const { recordCompletion, isLoggedIn } = useGameCompletion()

  // Function to shuffle array
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  // Initialize shuffled items when component mounts or season changes
  useEffect(() => {
    setShuffledItems(shuffleArray(sequenceItems))
    setCorrectItems([])
    setIsGameComplete(false)
    setSuccessMessage("")
  }, [selectedSeason])

  // Check if all items are correctly placed
  useEffect(() => {
    if (correctItems.length === sequenceItems.length) {
      setIsGameComplete(true)
      // Get a random success message
      setSuccessMessage(getRandomSuccessMessage())
      // Record completion when game is finished
      if (isLoggedIn) {
        recordCompletion("sequential-order-3")
      }
      // Call onComplete callback after 3 seconds to show medal
      if (onComplete) {
        setTimeout(() => {
          onComplete()
        }, 3000) // 3 second delay
      }
    } else {
      setIsGameComplete(false)
    }
  }, [correctItems, sequenceItems.length, isLoggedIn, recordCompletion, onComplete])

  // Handle drag start
  const handleDragStart = (id: string) => {
    setDraggedItem(id)
  }

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  // Handle drop
  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()

    // Only allow drops if the target box is the next expected one
    if (correctItems.length === targetIndex && draggedItem === sequenceItems[targetIndex].id) {
      // Correct match
      setCorrectItems([...correctItems, draggedItem])
    }

    setDraggedItem(null)
  }

  // Get the appropriate image for an item based on season
  const getItemImage = (item: Item) => {
    if (isWinter) return item.winterImage
    if (isSummer) return item.summerImage
    if (isAutumn) return item.autumnImage
    return item.image
  }

  return (
    <div className="w-full max-w-4xl">
      {/* Header with title */}
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
          <Image src={theme.titleBox || "/placeholder.svg"} alt="Title box" fill className="object-contain" />
          <span className="relative z-10 text-white text-2xl md:text-3xl font-sour-gummy font-thin">
            UŁÓŻ PO KOLEI.
          </span>
        </div>

        <div className="relative w-16 h-16" onClick={onMenuClick}>
          <Image src={theme.menuIcon || "/placeholder.svg"} alt="Menu" fill className="object-contain cursor-pointer" />
        </div>
      </div>

      {/* Game area */}
      <div className="relative w-full flex flex-col items-center gap-12">
        {/* First row: Drop zones (empty boxes) */}
        <div className="flex gap-4 justify-center">
          {sequenceItems.map((item, index) => (
            <div
              key={`dropzone-${item.id}`}
              className={`relative h-[140px] w-[140px] ${
                correctItems.length === index ? "" : "opacity-50 pointer-events-none"
              }`}
              onDragOver={correctItems.length === index ? handleDragOver : undefined}
              onDrop={correctItems.length === index ? (e) => handleDrop(e, index) : undefined}
            >
              <Image src="/images/white_box_medium.svg" alt="Box" fill className="object-contain" priority />
              <div className="absolute inset-0 flex items-center justify-center">
                {correctItems.includes(item.id) && (
                  <div className="relative h-[80px] w-[80px] flex items-center justify-center">
                    <Image
                      src={getItemImage(item) || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Second row: Draggable items (shuffled) */}
        <div className="flex gap-8 justify-center">
          {shuffledItems.map((item) => (
            <div
              key={`draggable-${item.id}`}
              draggable
              onDragStart={() => handleDragStart(item.id)}
              className="relative h-[80px] w-[80px] cursor-grab hover:scale-110 transition-transform"
            >
              <Image src={getItemImage(item) || "/placeholder.svg"} alt={item.name} fill className="object-contain" />
            </div>
          ))}
        </div>
      </div>

      {/* Success message and button - only visible when the game is complete */}
      {isGameComplete && (
        <div className="flex flex-col items-center mt-8">
          <div className="mb-4 p-4 bg-green-100 border-2 border-green-400 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-800 mb-2">🎉 {successMessage} 🎉</div>
          </div>
        </div>
      )}
    </div>
  )
}
