"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { useGameCompletion } from "@/hooks/use-game-completion"
import { getRandomSuccessMessage } from "@/lib/success-messages"
import { useSeason } from "@/contexts/season-context"

interface MemoryGame7Props {
  onMenuClick: () => void
}

interface FlowerItem {
  id: string
  name: string
  image: string
  shadowImage: string
  autumnImage: string
  autumnShadowImage: string
  winterImage: string
  winterShadowImage: string
  matched: boolean
}

interface DropZone {
  id: string
  flowerId: string
  filled: boolean
  position: number
}

export default function MemoryGame7({ onMenuClick }: MemoryGame7Props) {
  // Get season & theme
  const { selectedSeason, getThemeColors } = useSeason()
  const theme = getThemeColors()

  // Define the flower items in the order specified
  const [flowers, setFlowers] = useState<FlowerItem[]>([
    {
      id: "yellow",
      name: "Yellow Flower",
      image: "/images/flower_yellow.svg",
      shadowImage: "/images/flower_yellow_shadow.svg",
      autumnImage: "/images/mushroom_autumn.svg",
      autumnShadowImage: "/images/mushroom_autumn_shadow.svg",
      winterImage: "/images/sniezka_01_winter.svg",
      winterShadowImage: "/images/sniezka_01_winter_shadow.svg",
      matched: false,
    },
    {
      id: "white",
      name: "White Flower",
      image: "/images/flower_white.svg",
      shadowImage: "/images/flower_white_shadow.svg",
      autumnImage: "/images/apple_autumn.svg",
      autumnShadowImage: "/images/apple_autumn_shadow.svg",
      winterImage: "/images/sniezka_02_winter.svg",
      winterShadowImage: "/images/sniezka_02_winter_shadow.svg",
      matched: false,
    },
    {
      id: "pink",
      name: "Pink Flower",
      image: "/images/flower_pink.svg",
      shadowImage: "/images/flower_pink_shadow.svg",
      autumnImage: "/images/pear_autumn.svg",
      autumnShadowImage: "/images/pear_autumn_shadow.svg",
      winterImage: "/images/sniezka_03_winter.svg",
      winterShadowImage: "/images/sniezka_03_winter_shadow.svg",
      matched: false,
    },
    {
      id: "red",
      name: "Red Flower",
      image: "/images/flower_red.svg",
      shadowImage: "/images/flower_red_shadow.svg",
      autumnImage: "/images/squirel_autumn.svg",
      autumnShadowImage: "/images/squirel_autumn_shadow.svg",
      winterImage: "/images/sniezka_04_winter.svg",
      winterShadowImage: "/images/sniezka_04_winter_shadow.svg",
      matched: false,
    },
    {
      id: "purple",
      name: "Purple Flower",
      image: "/images/flower_purple.svg",
      shadowImage: "/images/flower_purple_shadow.svg",
      autumnImage: "/images/leaf_autumn.svg",
      autumnShadowImage: "/images/leaf_autumn_shadow.svg",
      winterImage: "/images/sniezka_01_winter.svg",
      winterShadowImage: "/images/sniezka_01_winter_shadow.svg",
      matched: false,
    },
  ])

  // Define the drop zones (shadows) in the specified order
  const [dropZones, setDropZones] = useState<DropZone[]>([
    { id: "zone-pink", flowerId: "pink", filled: false, position: 0 },
    { id: "zone-purple", flowerId: "purple", filled: false, position: 1 },
    { id: "zone-yellow", flowerId: "yellow", filled: false, position: 2 },
    { id: "zone-white", flowerId: "white", filled: false, position: 3 },
    { id: "zone-red", flowerId: "red", filled: false, position: 4 },
  ])

  // State for tracking the current dragged item
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  // State for feedback message
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)

  // State for tracking if the game is completed
  const [isCompleted, setIsCompleted] = useState(false)

  // Use the game completion hook
  const { recordCompletion, isLoggedIn } = useGameCompletion()

  // State for success message
  const [successMessage, setSuccessMessage] = useState<string>("")

  // Get the appropriate image based on season
  const getImageForSeason = (flower: FlowerItem) => {
    if (selectedSeason === "jesien") {
      return flower.autumnImage
    }
    if (selectedSeason === "zima") {
      return flower.winterImage
    }
    return flower.image
  }

  // Get the appropriate shadow image based on season
  const getShadowImageForSeason = (flower: FlowerItem) => {
    if (selectedSeason === "jesien") {
      return flower.autumnShadowImage
    }
    if (selectedSeason === "zima") {
      return flower.winterShadowImage
    }
    return flower.shadowImage
  }

  // Handle drag start
  const handleDragStart = (id: string) => {
    setDraggedItem(id)
    setFeedbackMessage(null)
  }

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, zoneId: string) => {
    e.preventDefault()

    if (!draggedItem) return

    // Find the drop zone
    const dropZone = dropZones.find((zone) => zone.id === zoneId)
    if (!dropZone) return

    // If drop zone already has an item, do nothing
    if (dropZone.filled) {
      setFeedbackMessage("To miejsce jest już zajęte!")
      return
    }

    // Check if this is the correct match
    const isCorrect = dropZone.flowerId === draggedItem

    if (isCorrect) {
      // Update the drop zone
      setDropZones((prevZones) => prevZones.map((zone) => (zone.id === zoneId ? { ...zone, filled: true } : zone)))

      // Update the flower as matched
      setFlowers((prevFlowers) =>
        prevFlowers.map((flower) => (flower.id === draggedItem ? { ...flower, matched: true } : flower)),
      )

      // Clear any error messages
      setFeedbackMessage(null)
    } else {
      // Clear any feedback messages
      setFeedbackMessage(null)
    }

    // Reset dragged item
    setDraggedItem(null)

    // Check if all flowers are matched
    setTimeout(() => {
      const allMatched = flowers.every((flower) => (flower.id === draggedItem ? true : flower.matched))
      if (allMatched) {
        setIsCompleted(true)
        // Get a random success message
        setSuccessMessage(getRandomSuccessMessage())
        setFeedbackMessage(null)

        // Record completion in database
        if (isLoggedIn) {
          recordCompletion("memory-game-7")
        }
      }
    }, 100)
  }

  // Reset the game
  const resetGame = () => {
    setFlowers((prevFlowers) => prevFlowers.map((flower) => ({ ...flower, matched: false })))
    setDropZones((prevZones) => prevZones.map((zone) => ({ ...zone, filled: false })))
    setIsCompleted(false)
    setFeedbackMessage(null)
  }

  return (
    <div className="w-full max-w-4xl" style={{ backgroundColor: theme.background }}>
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
          <span className="relative z-10 text-white text-2xl md:text-3xl font-sour-gummy font-thin">ZNAJDŹ PARY.</span>
        </div>

        <div className="relative w-16 h-16" onClick={onMenuClick}>
          <Image src={theme.menuIcon || "/placeholder.svg"} alt="Menu" fill className="object-contain cursor-pointer" />
        </div>
      </div>

      {/* Game area */}
      <div className="flex flex-col items-center mt-16">
        {/* Top row - draggable flowers */}
        <div className="flex justify-center gap-12 mb-24">
          {flowers.map((flower) => {
            // Skip if already matched
            if (flower.matched) return null

            return (
              <div
                key={`flower-${flower.id}`}
                draggable
                onDragStart={() => handleDragStart(flower.id)}
                className="relative h-28 w-28 cursor-grab"
              >
                <div className="relative h-28 w-28 cursor-grab drop-shadow-md">
                  <Image
                    src={getImageForSeason(flower) || "/placeholder.svg"}
                    alt={flower.name}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom row - shadow drop zones */}
        <div className="flex justify-center gap-12">
          {dropZones.map((zone) => {
            // Find the flower for this zone
            const flower = flowers.find((f) => f.id === zone.flowerId)
            if (!flower) return null

            return (
              <div
                key={`zone-${zone.id}`}
                className={`relative h-28 w-28 ${zone.filled ? "cursor-default" : "cursor-pointer"}`}
                onDragOver={!zone.filled ? handleDragOver : undefined}
                onDrop={!zone.filled ? (e) => handleDrop(e, zone.id) : undefined}
              >
                {/* Shadow image with drop shadow */}
                <Image
                  src={getShadowImageForSeason(flower) || "/placeholder.svg"}
                  alt={`${flower.name} shadow`}
                  fill
                  className="object-contain drop-shadow-md"
                />

                {/* Show the matched flower on top if filled */}
                {zone.filled && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative h-28 w-28 drop-shadow-md">
                      <Image
                        src={getImageForSeason(flower) || "/placeholder.svg"}
                        alt={flower.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Success message and button - only visible when the game is complete */}
        {isCompleted && (
          <div className="flex flex-col items-center mt-8">
            <div className="mb-4 p-4 bg-green-100 border-2 border-green-400 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-800 mb-2">🎉 {successMessage} 🎉</div>
            </div>
            <button onClick={resetGame} className="bg-[#539e1b] text-white px-6 py-3 rounded-full font-bold text-lg">
              Zagraj ponownie
            </button>
          </div>
        )}

        {/* Error message */}
        {feedbackMessage && <div className="mt-4 text-red-600 font-medium text-lg text-center">{feedbackMessage}</div>}
      </div>
    </div>
  )
}
