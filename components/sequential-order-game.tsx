"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useGameCompletion } from "@/hooks/use-game-completion"
import { getRandomSuccessMessage } from "@/lib/success-messages"
import { useSeason } from "@/contexts/season-context"

interface SequentialOrderGameProps {
  onMenuClick: () => void
}

interface PetalItem {
  id: string
  image: string
  order: number
  placed: boolean
  position: number | null
}

export default function SequentialOrderGame({ onMenuClick }: SequentialOrderGameProps) {
  const { getThemeColors } = useSeason()
  const theme = getThemeColors()
  
  // Use the game completion hook
  const { recordCompletion, isLoggedIn } = useGameCompletion()

  // Define the petal items with their correct order
  const [petalItems, setPetalItems] = useState<PetalItem[]>([
    { id: "petal-0", image: "/images/petals_yellow_0.svg", order: 5, placed: false, position: null }, // Now this is the last in order
    { id: "petal-1", image: "/images/petals_yellow_01.svg", order: 0, placed: true, position: 0 }, // Already placed in first box
    { id: "petal-2", image: "/images/petals_yellow_02.svg", order: 1, placed: false, position: null },
    { id: "petal-3", image: "/images/petals_yellow_03.svg", order: 2, placed: false, position: null },
    { id: "petal-4", image: "/images/petals_yellow_04.svg", order: 3, placed: false, position: null },
    { id: "petal-5", image: "/images/petals_yellow_05.svg", order: 4, placed: false, position: null },
  ])

  // Define the display order for the top row (as specified: 04, 03, 0, 02, 05)
  // This maps to the petal IDs: petal-4, petal-3, petal-0, petal-2, petal-5
  const topRowOrder = ["petal-4", "petal-3", "petal-0", "petal-2", "petal-5"]

  // State for tracking the current dragged item
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  // State for error message
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // State for tracking if the game is completed
  const [isCompleted, setIsCompleted] = useState(false)

  // Handle drag start
  const handleDragStart = (id: string) => {
    setDraggedItem(id)
    setErrorMessage(null)
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
    if (isOccupied) {
      setErrorMessage("Przykro mi to miejsce jest już zajęte")
      return
    }

    // Check if this is the correct position for sequential order
    // The new correct order is: 01 (position 0), 02 (position 1), 03 (position 2), 04 (position 3), 05 (position 4), 0 (position 5)
    const expectedOrder = position

    if (draggedPetal.order !== expectedOrder) {
      setErrorMessage("Przykro mi to nie kolejność")
      return
    }

    // Update the petal's position
    const updatedPetalItems = petalItems.map((item) =>
      item.id === draggedItem ? { ...item, placed: true, position: position } : item,
    )

    setPetalItems(updatedPetalItems)
    setDraggedItem(null)

    // Check if all petals are placed correctly
    setTimeout(() => {
      const allPlaced = updatedPetalItems.every((item) => item.placed)
      if (allPlaced) {
        setIsCompleted(true)
        setErrorMessage(null)

        // Record completion in database
        if (isLoggedIn) {
          recordCompletion("sequential-order")
        }
      }
    }, 100)
  }

  // Reset the game
  const resetGame = () => {
    setPetalItems((prevItems) =>
      prevItems.map((item) => (item.id === "petal-1" ? item : { ...item, placed: false, position: null })),
    )
    setIsCompleted(false)
    setErrorMessage(null)
  }

  return (
    <div className="w-full max-w-4xl">
      {/* Header with title */}
      <div className="w-full flex justify-between items-center mb-8">
        <div className="relative w-16 h-16">
          <Image src="/images/sound_new.svg" alt="Sound" fill className="object-contain cursor-pointer" />
        </div>

        <div className="relative h-24 w-80 md:w-[500px] flex items-center justify-center">
          <Image src="/images/green_large_box.svg" alt="Title box" fill className="object-contain" />
          <span className="relative z-10 text-white text-2xl md:text-3xl font-sour-gummy font-thin">UŁÓŻ PO KOLEI.</span>
        </div>

        <div className="relative w-16 h-16" onClick={onMenuClick}>
          <Image src="/images/menu_new.svg" alt="Menu" fill className="object-contain cursor-pointer" />
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

            return (
              <div
                key={`box-${position}`}
                className="relative h-[120px] w-[120px]"
                onDragOver={!placedPetal ? handleDragOver : undefined}
                onDrop={!placedPetal ? (e) => handleDrop(e, position) : undefined}
              >
                <Image src="/images/box_medium.svg" alt="Box" fill className="object-contain brightness-105" />

                {placedPetal && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative h-20 w-20">
                      <Image
                        src={placedPetal.image || "/placeholder.svg"}
                        alt={`Petal ${placedPetal.order}`}
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

        {/* Error message */}
        {errorMessage && <div className="mt-8 text-red-600 font-medium text-lg text-center">{errorMessage}</div>}

        {/* Completion message */}
        {isCompleted && (
          <div className="mt-8 text-[#539e1b] font-bold text-xl text-center">
            Brawo! Udało się ułożyć wszystkie płatki w kolejności!
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

        {/* Login reminder for non-logged in users */}
        {!isLoggedIn && (
          <div className="mt-4 text-center text-gray-600">
            <p>Zaloguj się, aby zapisać swój postęp!</p>
          </div>
        )}
      </div>
    </div>
  )
}
