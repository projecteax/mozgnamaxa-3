"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useGameCompletion } from "@/hooks/use-game-completion"
import { getRandomSuccessMessage } from "@/lib/success-messages"
import { useSeason } from "@/contexts/season-context"

interface SortingGame3Props {
  onMenuClick: () => void
}

interface ChickenItem {
  id: string
  size: number // Size percentage
  placed: boolean
  position: number | null
}

export default function SortingGame3({ onMenuClick }: SortingGame3Props) {
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

  // Initialize scrambled chickens on component mount and when resetting
  useEffect(() => {
    setInitialOrder()
  }, [])

  // Function to set the initial order of chickens: medium, large, larger, small
  const setInitialOrder = () => {
    // Get only the unplaced chickens
    const unplacedChickens = chickenItems.filter((item) => !item.placed)

    // Sort them in the order: medium (70), large (85), larger (100), small (55)
    // Note: This is based on the specific sizes in your game
    const orderedChickens = [...unplacedChickens].sort((a, b) => {
      // Custom sorting order
      const order = { 70: 1, 85: 2, 100: 3, 55: 4 }
      return order[a.size] - order[b.size]
    })

    setScrambledChickens(orderedChickens)
  }

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

    // Find the dragged chicken
    const draggedChicken = chickenItems.find((item) => item.id === draggedItem)
    if (!draggedChicken) return

    // Check if the position is already occupied
    const isOccupied = chickenItems.some((item) => item.position === position)
    if (isOccupied) {
      setErrorMessage("Przykro mi to miejsce jest już zajęte")
      return
    }

    // Check if this is the correct position for ascending order
    // The correct order is: 40% (position 0), 55% (position 1), 70% (position 2), 85% (position 3), 100% (position 4)

    // Get the size of the chicken that should be at this position
    const expectedSize = position === 1 ? 55 : position === 2 ? 70 : position === 3 ? 85 : position === 4 ? 100 : null

    if (expectedSize !== draggedChicken.size) {
      setErrorMessage("Przykro mi to nie kolejność")
      return
    }

    // Update the chicken's position
    const updatedChickenItems = chickenItems.map((item) =>
      item.id === draggedItem ? { ...item, placed: true, position: position } : item,
    )

    setChickenItems(updatedChickenItems)

    // Update scrambled chickens to remove the placed chicken
    setScrambledChickens((prevChickens) => prevChickens.filter((chicken) => chicken.id !== draggedItem))

    setDraggedItem(null)

    // Check if all chickens are placed correctly
    setTimeout(() => {
      // Count placed chickens
      const placedCount = updatedChickenItems.filter((item) => item.placed).length

      // Check completion - we should have 5 placed chickens (including the pre-placed one)
      if (placedCount === 5 && !isCompleted) {
        console.log("GAME COMPLETED! All 5 chickens are placed.")
        setIsCompleted(true)
        setSuccessMessage(getRandomSuccessMessage())

        // Record completion in database
        if (isLoggedIn) {
          console.log("Recording completion for sorting-game-3")
          recordCompletion("sorting-game-3")
        } else {
          console.log("User not logged in, completion not recorded")
        }
      }
    }, 100)
  }

  // Reset the game
  const resetGame = () => {
    // First prepare the updated state with reset values
    const resetChickenItems = chickenItems.map((item) =>
      item.id === "chicken-40"
        ? item // Keep the first chicken in place
        : { ...item, placed: false, position: null },
    )

    // Update the state
    setChickenItems(resetChickenItems)
    setIsCompleted(false)
    setErrorMessage(null)
    setSuccessMessage("")

    // Immediately update the scrambled chickens with the unplaced ones
    const unplacedChickens = resetChickenItems.filter((item) => !item.placed)
    const orderedChickens = [...unplacedChickens].sort((a, b) => {
      // Custom sorting order
      const order = { 70: 1, 85: 2, 100: 3, 55: 4 }
      return order[a.size] - order[b.size]
    })

    setScrambledChickens(orderedChickens)
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
          <span className="relative z-10 text-white text-2xl md:text-3xl font-sour-gummy font-thin">UŁÓŻ DALEJ 3.</span>
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
              }}
            >
              <Image src="/images/chicken_small.svg" alt={`Chicken ${chicken.size}%`} fill className="object-contain" />
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
                className="relative h-[120px] w-[120px]"
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
                      }}
                    >
                      <Image
                        src="/images/chicken_small.svg"
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
