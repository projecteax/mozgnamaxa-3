"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useGameCompletionWithHistory } from "@/hooks/use-game-completion"
import { getRandomSuccessMessage } from "@/lib/success-messages"
import { useSeason } from "@/contexts/season-context"
import SuccessMessage from "./success-message"
import SoundButtonEnhanced from "./sound-button-enhanced"

interface SortingGame2Props {
  onMenuClick: () => void
  onBack?: () => void
  onNext?: () => void
  onRetry?: () => void
  userLoggedIn?: boolean
  currentSeason?: string
  isGameCompleted?: boolean
}

interface RabbitItem {
  id: string
  size: number // Size percentage
  placed: boolean
  position: number | null
}

export default function SortingGame2({ onMenuClick, onBack, onNext, onRetry, userLoggedIn = false, currentSeason = "wiosna", isGameCompleted = false }: SortingGame2Props) {
  // Season context
  const { selectedSeason, getThemeColors } = useSeason()
  const theme = getThemeColors()

  // Game completion hook
  const { recordCompletion, isLoggedIn, isHistoricallyCompleted } = useGameCompletionWithHistory("sorting-game-2")

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
            const success = await recordCompletion()
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
          <SoundButtonEnhanced
            text="UŁÓŻ DALEJ."
            soundIcon={theme.soundIcon || "/images/sound_icon_dragon_page.svg"}
            size="xl"
            className="w-full h-full"
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
        {isCompleted && successMessage && <SuccessMessage message={successMessage} />}

        {/* New Navigation Buttons */}
        <div className="flex justify-center gap-4 mt-8 w-full">
          {/* All buttons in same container with identical dimensions */}
          <div className="flex gap-4 items-end">
            {/* WRÓĆ Button - always available in sorting-game-2 */}
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
