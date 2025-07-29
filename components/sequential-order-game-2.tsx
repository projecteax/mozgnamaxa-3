"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useGameCompletion } from "@/hooks/use-game-completion"
import { getRandomSuccessMessage } from "@/lib/success-messages"
import { useSeason } from "@/contexts/season-context"

interface SequentialOrderGame2Props {
  onMenuClick: () => void
}

interface PetalItem {
  id: string
  image: string
  order: number
  placed: boolean
  position: number | null
}

export default function SequentialOrderGame2({ onMenuClick }: SequentialOrderGame2Props) {
  const { recordCompletion, user } = useGameCompletion()
  const { selectedSeason, getThemeColors } = useSeason()
  const theme = getThemeColors()

  // Define the petal items with their correct order
  const [petalItems, setPetalItems] = useState<PetalItem[]>([
    {
      id: "petal-01",
      image:
        selectedSeason === "lato"
          ? "/images/green_ball_summer_01.svg"
          : selectedSeason === "jesien"
            ? "/images/trees_autumn_01.svg"
            : selectedSeason === "zima"
              ? "/images/scarf_winter_01.svg"
              : "/images/white_petals_01.svg",
      order: 0,
      placed: true,
      position: 0,
    },
    {
      id: "petal-02",
      image:
        selectedSeason === "lato"
          ? "/images/green_ball_summer_02.svg"
          : selectedSeason === "jesien"
            ? "/images/trees_autumn_02.svg"
            : selectedSeason === "zima"
              ? "/images/scarf_winter_02.svg"
              : "/images/white_petals_02.svg",
      order: 1,
      placed: false,
      position: null,
    },
    {
      id: "petal-03",
      image:
        selectedSeason === "lato"
          ? "/images/green_ball_summer_03.svg"
          : selectedSeason === "jesien"
            ? "/images/trees_autumn_03.svg"
            : selectedSeason === "zima"
              ? "/images/scarf_winter_03.svg"
              : "/images/white_petals_03.svg",
      order: 2,
      placed: false,
      position: null,
    },
    {
      id: "petal-04",
      image:
        selectedSeason === "lato"
          ? "/images/green_ball_summer_04.svg"
          : selectedSeason === "jesien"
            ? "/images/trees_autumn_04.svg"
            : selectedSeason === "zima"
              ? "/images/scarf_winter_04.svg"
              : "/images/white_petals_04.svg",
      order: 3,
      placed: false,
      position: null,
    },
    {
      id: "petal-05",
      image:
        selectedSeason === "lato"
          ? "/images/green_ball_summer_05.svg"
          : selectedSeason === "jesien"
            ? "/images/trees_autumn_05.svg"
            : selectedSeason === "zima"
              ? "/images/scarf_winter_05.svg"
              : "/images/white_petals_05.svg",
      order: 4,
      placed: false,
      position: null,
    },
    {
      id: "petal-06",
      image:
        selectedSeason === "lato"
          ? "/images/green_ball_summer_06.svg"
          : selectedSeason === "jesien"
            ? "/images/trees_autumn_06.svg"
            : selectedSeason === "zima"
              ? "/images/scarf_winter_06.svg"
              : "/images/white_petals_06.svg",
      order: 5,
      placed: false,
      position: null,
    },
  ])

  // Define the display order for the top row (as specified: 04, 05, 02, 06, 03)
  const topRowOrder = ["petal-04", "petal-05", "petal-02", "petal-06", "petal-03"]

  // State for tracking the current dragged item
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  // State for tracking if the game is completed
  const [isCompleted, setIsCompleted] = useState(false)

  // State for success message
  const [successMessage, setSuccessMessage] = useState<string>("")

  // Handle drag start
  const handleDragStart = (id: string) => {
    setDraggedItem(id)
  }

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  // Handle drop
  const handleDrop = (e: React.DragEvent, position: number) => {
    e.preventDefault()

    if (!draggedItem) return

    // Find the dragged petal
    const draggedPetal = petalItems.find((item) => item.id === draggedItem)
    if (!draggedPetal) return

    // Check if the position is already occupied
    const isOccupied = petalItems.some((item) => item.position === position)
    if (isOccupied) return

    // Check if this is the correct position for sequential order
    // The correct order is: 01 (position 0), 02 (position 1), 03 (position 2), 04 (position 3), 05 (position 4), 06 (position 5)
    const expectedOrder = position

    if (draggedPetal.order !== expectedOrder) return

    // Update the petal's position
    const updatedPetalItems = petalItems.map((item) =>
      item.id === draggedItem ? { ...item, placed: true, position: position } : item,
    )

    setPetalItems(updatedPetalItems)
    setDraggedItem(null)

    // Check if all petals are placed correctly
    setTimeout(() => {
      const allPlaced = updatedPetalItems.every((item) => item.placed)
      if (allPlaced && !isCompleted) {
        console.log("All petals placed correctly! Recording completion...")
        setIsCompleted(true)
        // Get a random success message
        setSuccessMessage(getRandomSuccessMessage())

        // Record completion in database
        if (user) {
          recordCompletion("sequential-order-2")
          console.log("Game completion recorded in database")
        } else {
          console.log("User not logged in - completion not recorded")
        }
      }
    }, 100)
  }

  // Reset the game
  const resetGame = () => {
    setPetalItems((prevItems) =>
      prevItems.map((item) => (item.id === "petal-01" ? item : { ...item, placed: false, position: null })),
    )
    setIsCompleted(false)
    setSuccessMessage("")
  }

  // Get the next available position (the position that should be unlocked)
  const getNextAvailablePosition = () => {
    const placedPositions = petalItems
      .filter((item) => item.placed)
      .map((item) => item.position)
      .sort((a, b) => (a || 0) - (b || 0))

    // Find the first gap in the sequence
    for (let i = 0; i < 6; i++) {
      if (!placedPositions.includes(i)) {
        return i
      }
    }
    return -1 // All positions filled
  }

  const nextAvailablePosition = getNextAvailablePosition()

  return (
    <div className="w-full max-w-4xl">
      {/* Header with title */}
      <div className="w-full flex justify-between items-center mb-8">
        <div className="relative w-16 h-16">
          <Image
            src={
              selectedSeason === "lato"
                ? "/images/sound_summer.svg"
                : selectedSeason === "jesien"
                  ? "/images/sound_autumn.svg"
                  : selectedSeason === "zima"
                    ? "/images/sound_winter.svg"
                    : theme.soundIcon || "/placeholder.svg"
            }
            alt="Sound"
            fill
            className="object-contain cursor-pointer"
          />
        </div>

        <div className="relative h-24 w-80 md:w-[500px] flex items-center justify-center">
          <Image
            src={
              selectedSeason === "lato"
                ? "/images/title_box_small_summer.svg"
                : selectedSeason === "jesien"
                  ? "/images/title_box_small_autumn.svg"
                  : selectedSeason === "zima"
                    ? "/images/title_box_small_winter.svg"
                    : "/images/green_large_box.svg"
            }
            alt="Title box"
            fill
            className="object-contain"
          />
          <span className="relative z-10 text-white text-2xl md:text-3xl font-sour-gummy font-thin">UŁÓŻ PO KOLEI.</span>
        </div>

        <div className="relative w-16 h-16" onClick={onMenuClick}>
          <Image
            src={
              selectedSeason === "lato"
                ? "/images/menu_summer.svg"
                : selectedSeason === "jesien"
                  ? "/images/menu_autumn.svg"
                  : selectedSeason === "zima"
                    ? "/images/menu_winter.svg"
                    : theme.menuIcon || "/placeholder.svg"
            }
            alt="Menu"
            fill
            className="object-contain cursor-pointer"
          />
        </div>
      </div>

      {/* Game area */}
      <div className="flex flex-col items-center mt-16">
        {/* Top row - draggable petals in specified order */}
        <div className="flex justify-center gap-8 mb-16">
          {topRowOrder.map((petalId) => {
            // Find the petal with this ID
            const petal = petalItems.find((item) => item.id === petalId)
            if (!petal) return null

            // Skip if already placed
            if (petal.placed) return null

            return (
              <div
                key={`draggable-${petal.id}`}
                draggable
                onDragStart={() => handleDragStart(petal.id)}
                className="relative h-24 w-24 cursor-grab"
              >
                <Image
                  src={petal.image || "/placeholder.svg"}
                  alt={`Petal ${petal.id.split("-")[1]}`}
                  fill
                  className="object-contain"
                  style={{ filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))" }}
                />
              </div>
            )
          })}
        </div>

        {/* Bottom row - boxes for dropping */}
        <div className="flex justify-center gap-4">
          {[0, 1, 2, 3, 4, 5].map((position) => {
            // Find if there's a petal placed in this position
            const placedPetal = petalItems.find((item) => item.position === position)

            // Check if this position is available for dropping
            const isAvailable = position === nextAvailablePosition

            // Always use regular box (no green outline)
            const boxImage = "/images/white_box_medium.svg"

            return (
              <div
                key={`box-${position}`}
                className={`relative h-[140px] w-[140px] ${
                  !isAvailable && !placedPetal ? "opacity-50 pointer-events-none" : ""
                }`}
                onDragOver={isAvailable ? handleDragOver : undefined}
                onDrop={isAvailable ? (e) => handleDrop(e, position) : undefined}
              >
                <Image src={boxImage || "/placeholder.svg"} alt="Box" fill className="object-contain" priority />

                {placedPetal && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative h-24 w-24">
                      <Image
                        src={placedPetal.image || "/placeholder.svg"}
                        alt={`Petal ${placedPetal.id.split("-")[1]}`}
                        fill
                        className="object-contain"
                        style={{ filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))" }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Completion message */}
        {isCompleted && (
          <div className="flex flex-col items-center mt-8">
            <div className="mb-4 p-4 bg-green-100 border-2 border-green-400 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-800 mb-2">🎉 {successMessage} 🎉</div>
            </div>
          </div>
        )}

        {/* Reset button - only visible when at least one petal is placed (besides the pre-placed one) */}
        {(petalItems.filter((item) => item.placed).length > 1 || isCompleted) && (
          <div className="flex justify-center mt-8">
            <button
              onClick={resetGame}
              className="text-white px-8 py-3 rounded-full font-sour-gummy text-xl shadow-lg hover:opacity-90 transition-opacity"
              style={{ backgroundColor: theme.buttonColor }}
            >
              Wstecz
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
