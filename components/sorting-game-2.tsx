"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useGameCompletion } from "@/hooks/use-game-completion"
import { getRandomSuccessMessage } from "@/lib/success-messages"
import { useSeason } from "@/contexts/season-context"

interface SortingGame2Props {
  onMenuClick: () => void
}

interface RabbitItem {
  id: string
  size: number // Size percentage
  placed: boolean
  position: number | null
}

export default function SortingGame2({ onMenuClick }: SortingGame2Props) {
  // Season context
  const { selectedSeason, getThemeColors } = useSeason()
  const theme = getThemeColors()

  // Game completion hook
  const { recordCompletion, isLoggedIn } = useGameCompletion()

  // Define the rabbit items with their sizes
  const [rabbitItems, setRabbitItems] = useState<RabbitItem[]>([
    { id: "rabbit-40", size: 40, placed: true, position: 0 }, // Already placed in first box
    { id: "rabbit-55", size: 55, placed: false, position: null },
    { id: "rabbit-70", size: 70, placed: false, position: null },
    { id: "rabbit-85", size: 85, placed: false, position: null },
    { id: "rabbit-100", size: 100, placed: false, position: null },
  ])

  // State for scrambled display order of draggable rabbits
  const [scrambledRabbits, setScrambledRabbits] = useState<RabbitItem[]>([])

  // State for tracking the current dragged item
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  // State for tracking if the game is completed
  const [isCompleted, setIsCompleted] = useState(false)

  // State for random success message
  const [successMessage, setSuccessMessage] = useState<string>("")

  // State for tracking if progress was saved
  const [progressSaved, setProgressSaved] = useState(false)

  // Initialize rabbits in specific order on component mount
  useEffect(() => {
    setInitialOrder()
  }, [])

  // Function to set the initial order of rabbits: medium, large, larger, small
  const setInitialOrder = () => {
    // Get only the unplaced rabbits
    const unplacedRabbits = rabbitItems.filter((item) => !item.placed)

    // Sort them in the order: medium (70), large (85), larger (100), small (55)
    // Note: This is based on the specific sizes in your game
    const orderedRabbits = [...unplacedRabbits].sort((a, b) => {
      // Custom sorting order
      const order = { 70: 1, 85: 2, 100: 3, 55: 4 }
      return order[a.size] - order[b.size]
    })

    setScrambledRabbits(orderedRabbits)
  }

  // Handle game completion
  const handleGameCompletion = async () => {
    const success = await recordCompletion("sorting-game-2")
    if (success) {
      setProgressSaved(true)
    }
  }

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

    // Find the dragged rabbit
    const draggedRabbit = rabbitItems.find((item) => item.id === draggedItem)
    if (!draggedRabbit) return

    // Check if this is the correct position for ascending order
    const expectedSize = position === 1 ? 55 : position === 2 ? 70 : position === 3 ? 85 : position === 4 ? 100 : null

    if (expectedSize !== draggedRabbit.size) {
      return // Just return without error message
    }

    // Update the rabbit's position
    const updatedRabbitItems = rabbitItems.map((item) =>
      item.id === draggedItem ? { ...item, placed: true, position: position } : item,
    )

    setRabbitItems(updatedRabbitItems)

    // Update scrambled rabbits to remove the placed rabbit
    setScrambledRabbits((prevRabbits) => prevRabbits.filter((rabbit) => rabbit.id !== draggedItem))

    setDraggedItem(null)

    // Check if all rabbits are placed correctly
    setTimeout(() => {
      // Count placed rabbits
      const placedCount = updatedRabbitItems.filter((item) => item.placed).length

      // Check completion - we should have 5 placed rabbits (including the pre-placed one)
      if (placedCount === 5) {
        console.log("GAME COMPLETED! All 5 rabbits are placed.")
        setIsCompleted(true)
        setSuccessMessage(getRandomSuccessMessage())
        handleGameCompletion()
      }
    }, 100)
  }

  // Reset the game
  const resetGame = () => {
    // First prepare the updated state with reset values
    const resetRabbitItems = rabbitItems.map((item) =>
      item.id === "rabbit-40"
        ? item // Keep the first rabbit in place
        : { ...item, placed: false, position: null },
    )

    // Update the state
    setRabbitItems(resetRabbitItems)
    setIsCompleted(false)
    setSuccessMessage("")
    setProgressSaved(false)

    // Immediately update the scrambled rabbits with the unplaced ones
    const unplacedRabbits = resetRabbitItems.filter((item) => !item.placed)
    const orderedRabbits = [...unplacedRabbits].sort((a, b) => {
      // Custom sorting order
      const order = { 70: 1, 85: 2, 100: 3, 55: 4 }
      return order[a.size] - order[b.size]
    })

    setScrambledRabbits(orderedRabbits)
  }

  // Get the appropriate image based on season
  const getItemImage = () => {
    if (selectedSeason === "zima") {
      return "/images/snowman_winter.svg"
    }
    if (selectedSeason === "jesien") {
      return "/images/leaf_green_autumn.svg"
    }
    return selectedSeason === "lato" ? "/images/shell_summer.svg" : "/images/rabbit_small.svg"
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
          <span className="relative z-10 text-white text-2xl md:text-3xl font-sour-gummy font-thin">UŁÓŻ DALEJ.</span>
        </div>

        <div className="relative w-16 h-16" onClick={onMenuClick}>
          <Image src={theme.menuIcon || "/placeholder.svg"} alt="Menu" fill className="object-contain cursor-pointer" />
        </div>
      </div>

      {/* Game area */}
      <div className="flex flex-col items-center mt-16">
        {/* Draggable rabbits at the top - now in scrambled order */}
        <div className="flex justify-center gap-12 mb-16">
          {scrambledRabbits.map((rabbit) => (
            <div
              key={`draggable-${rabbit.id}`}
              draggable
              onDragStart={() => handleDragStart(rabbit.id)}
              className="relative cursor-grab"
              style={{
                width: `${rabbit.size}px`,
                height: `${rabbit.size}px`,
              }}
            >
              <Image
                src={getItemImage() || "/placeholder.svg"}
                alt={`Item ${rabbit.size}%`}
                fill
                className="object-contain"
              />
            </div>
          ))}
        </div>

        {/* Boxes for dropping - 5 boxes, enlarged by 120% */}
        <div className="flex justify-center gap-4">
          {[0, 1, 2, 3, 4].map((position) => {
            // Find if there's a rabbit placed in this position
            const placedRabbit = rabbitItems.find((item) => item.position === position)
            const isNextAvailable = position === 0 || rabbitItems.filter((item) => item.placed).length === position
            const shouldDim = !placedRabbit && !isNextAvailable

            return (
              <div
                key={`box-${position}`}
                className={`relative drop-shadow-lg ${shouldDim ? "opacity-50 pointer-events-none" : ""}`}
                style={{ height: "144px", width: "144px" }}
                onDragOver={isNextAvailable && !placedRabbit ? handleDragOver : undefined}
                onDrop={isNextAvailable && !placedRabbit ? (e) => handleDrop(e, position) : undefined}
              >
                <Image src="/images/white_box_medium.svg" alt="Box" fill className="object-contain" />

                {placedRabbit && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="relative"
                      style={{
                        width: `${placedRabbit.size}px`,
                        height: `${placedRabbit.size}px`,
                      }}
                    >
                      <Image
                        src={getItemImage() || "/placeholder.svg"}
                        alt={`Item ${placedRabbit.size}%`}
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

        {/* Success message */}
        {isCompleted && successMessage && (
          <div className="mt-8 bg-green-100 border-2 border-green-500 rounded-lg p-4 text-center max-w-md">
            <div className="text-green-700 text-xl font-medium">🎉 {successMessage} 🎉</div>
          </div>
        )}

        {/* Reset button - only visible when game is completed */}
        <div className="flex justify-center mt-8 relative z-20">
          {isCompleted && (
            <button
              onClick={resetGame}
              className="text-white px-8 py-3 rounded-full font-sour-gummy text-xl shadow-lg hover:opacity-90 transition-opacity"
              style={{ backgroundColor: theme.buttonColor }}
            >
              Wstecz
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
