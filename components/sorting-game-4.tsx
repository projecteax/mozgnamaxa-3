"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useGameCompletion } from "@/hooks/use-game-completion"
import { getRandomSuccessMessage } from "@/lib/success-messages"
import { useSeason } from "@/contexts/season-context"

interface SortingGame4Props {
  onMenuClick: () => void
}

interface ChickenItem {
  id: string
  size: number // Size percentage
  placed: boolean
  position: number | null
}

export default function SortingGame4({ onMenuClick }: SortingGame4Props) {
  const { getThemeColors } = useSeason()
  const theme = getThemeColors()

  // Define the chicken items with their sizes
  const [chickenItems, setChickenItems] = useState<ChickenItem[]>([
    { id: "chicken-40", size: 40, placed: true, position: 0 }, // Already placed in first box
    { id: "chicken-55", size: 55, placed: false, position: null },
    { id: "chicken-70", size: 70, placed: false, position: null },
    { id: "chicken-85", size: 85, placed: false, position: null },
    { id: "chicken-100", size: 100, placed: false, position: null },
  ])

  // State for scrambled display order of draggable chickens
  const [scrambledChickens, setScrambledChickens] = useState<ChickenItem[]>([])

  // State for tracking the current dragged item
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  // State for error message
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // State for tracking if the game is completed
  const [isCompleted, setIsCompleted] = useState(false)

  // State for success message
  const [successMessage, setSuccessMessage] = useState<string>("")

  // Use the game completion hook
  const { recordCompletion, isLoggedIn } = useGameCompletion()

  // Initialize scrambled chickens on component mount
  useEffect(() => {
    setInitialOrder()
  }, [])

  // Function to set the initial order of chickens
  const setInitialOrder = () => {
    // Get only the unplaced chickens
    const unplacedChickens = chickenItems.filter((item) => !item.placed)

    // Sort them in the order: medium (70), large (85), larger (100), small (55)
    const orderedChickens = [...unplacedChickens].sort((a, b) => {
      // Custom sorting order
      const order = { 70: 1, 85: 2, 100: 3, 55: 4 }
      return order[a.size] - order[b.size]
    })

    setScrambledChickens(orderedChickens)
  }

  const [draggedOverBox, setDraggedOverBox] = useState<number | null>(null)

  const handleDragStart = (id: string) => {
    setDraggedItem(id)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, position: number) => {
    e.preventDefault()

    if (!draggedItem) return

    // Find the dragged chicken item
    const droppedChicken = chickenItems.find((item) => item.id === draggedItem)

    if (!droppedChicken) return

    // Check if the dropped chicken's size matches the position (e.g., 40 in position 0, 55 in position 1, etc.)
    const expectedSize = [40, 55, 70, 85, 100][position]
    if (droppedChicken.size !== expectedSize) {
      setErrorMessage("Źle! Spróbuj jeszcze raz.")
      return
    }

    // Clear any previous error message
    setErrorMessage(null)

    // Update the chickenItems state to reflect the new position
    const updatedChickenItems = chickenItems.map((item) =>
      item.id === draggedItem ? { ...item, placed: true, position } : item,
    )

    setChickenItems(updatedChickenItems)

    // Update scrambledChickens to remove the placed item
    setScrambledChickens((prev) => prev.filter((item) => item.id !== draggedItem))

    // Reset dragged item
    setDraggedItem(null)

    // Check if all chickens are placed
    const allChickensPlaced = updatedChickenItems.every((item) => item.placed)
    if (allChickensPlaced && !isCompleted) {
      console.log("All chickens placed! Game completed!")
      setIsCompleted(true)
      setSuccessMessage(getRandomSuccessMessage())

      // Record completion in database
      if (isLoggedIn) {
        console.log("Recording completion for sorting-game-4")
        recordCompletion("sorting-game-4")
      } else {
        console.log("User not logged in, completion not recorded")
      }
    }
  }

  const resetGame = () => {
    // Reset chicken items to initial state
    const initialChickenItems = [
      { id: "chicken-40", size: 40, placed: true, position: 0 }, // Already placed in first box
      { id: "chicken-55", size: 55, placed: false, position: null },
      { id: "chicken-70", size: 70, placed: false, position: null },
      { id: "chicken-85", size: 85, placed: false, position: null },
      { id: "chicken-100", size: 100, placed: false, position: null },
    ]
    setChickenItems(initialChickenItems)

    // Reset scrambled chickens
    const unplacedChickens = initialChickenItems.filter((item) => !item.placed)
    const orderedChickens = [...unplacedChickens].sort((a, b) => {
      // Custom sorting order
      const order = { 70: 1, 85: 2, 100: 3, 55: 4 }
      return order[a.size] - order[b.size]
    })
    setScrambledChickens(orderedChickens)

    // Reset game state
    setIsCompleted(false)
    setErrorMessage(null)
    setSuccessMessage("")
  }

  return (
    <div className="w-full max-w-4xl">
      {/* Header with title */}
      <div className="w-full flex justify-between items-center mb-8">
        <div className="relative w-16 h-16">
          <Image src="/images/sound_new.svg" alt="Sound" fill className="object-contain cursor-pointer" />
        </div>

        <div className="relative h-24 w-80 md:w-[500px] flex items-center justify-center">
          <Image src="/images/title_box_small.png" alt="Title box" fill className="object-contain" />
          <span className="relative z-10 text-white text-2xl md:text-3xl font-sour-gummy font-thin">UŁÓŻ DALEJ 4.</span>
        </div>

        <div className="relative w-16 h-16" onClick={onMenuClick}>
          <Image src="/images/menu_new.svg" alt="Menu" fill className="object-contain cursor-pointer" />
        </div>
      </div>

      {/* Game area */}
      <div className="flex flex-col items-center mt-16">
        {/* Draggable chickens at the top - in scrambled order */}
        <div className="flex justify-center gap-12 mb-16">
          {scrambledChickens.map((chicken) => (
            <div
              key={`draggable-${chicken.id}`}
              draggable
              onDragStart={() => handleDragStart(chicken.id)}
              className="relative cursor-grab"
              style={{
                width: `${chicken.size}px`,
                height: `${chicken.size}px`,
                filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))",
              }}
            >
              <Image src="/images/lamb_no_shadow.svg" alt={`Chicken ${chicken.size}%`} fill className="object-contain" />
            </div>
          ))}
        </div>

        {/* Boxes for dropping - 5 boxes */}
        <div className="flex justify-center gap-4">
          {[0, 1, 2, 3, 4].map((position) => {
            // Find if there's a chicken placed in this position
            const placedChicken = chickenItems.find((item) => item.position === position)

            return (
              <div
                key={`box-${position}`}
                className="relative h-[132px] w-[132px]"
                onDragOver={!placedChicken ? handleDragOver : undefined}
                onDrop={!placedChicken ? (e) => handleDrop(e, position) : undefined}
              >
                <Image src="/images/box_medium.svg" alt="Box" fill className="object-contain brightness-105" />

                {placedChicken && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="relative"
                      style={{
                        width: `${placedChicken.size}px`,
                        height: `${placedChicken.size}px`,
                        filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))",
                      }}
                    >
                      <Image
                        src="/images/lamb_no_shadow.svg"
                        alt={`Chicken ${placedChicken.size}%`}
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

        {/* Success message */}
        {isCompleted && successMessage && (
          <div className="mt-8">
            <div className="bg-green-100 border-2 border-green-500 rounded-lg p-6 text-center max-w-md mx-auto">
              <div className="text-green-700 text-xl font-medium">🎉 {successMessage} 🎉</div>
            </div>
        </div>
        )}

        {/* Login reminder for non-logged users */}
        {isCompleted && !isLoggedIn && (
          <div className="mt-4 text-orange-600 font-medium text-center bg-orange-50 p-3 rounded-lg border border-orange-200">
            Zaloguj się, aby zapisać swoje postępy!
          </div>
        )}

        {/* Reset button - only visible when game is completed */}
        {isCompleted && (
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
