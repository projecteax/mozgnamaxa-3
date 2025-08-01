"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useGameCompletionWithHistory } from "@/hooks/use-game-completion"
import { getRandomSuccessMessage } from "@/lib/success-messages"
import { useSeason } from "@/contexts/season-context"
import SuccessMessage from "./success-message"
import SoundButtonEnhanced from "./sound-button-enhanced"

interface SortingGameProps {
  onMenuClick: () => void
  onBack?: () => void
  onNext?: () => void
  onRetry?: () => void
  userLoggedIn?: boolean
  currentSeason?: string
  isGameCompleted?: boolean
}

interface ButterflyItem {
  id: string
  size: number // Size percentage
  placed: boolean
  position: number | null
}

export default function SortingGame({ onMenuClick, onBack, onNext, onRetry, userLoggedIn = false, currentSeason = "wiosna", isGameCompleted = false }: SortingGameProps) {
  const { selectedSeason, getThemeColors } = useSeason()
  const theme = getThemeColors()

  // Define the butterfly items with their sizes
  const [butterflyItems, setButterflyItems] = useState<ButterflyItem[]>([
    { id: "butterfly-100", size: 100, placed: true, position: 0 }, // Already placed in first box
    { id: "butterfly-70", size: 70, placed: false, position: null },
    { id: "butterfly-40", size: 40, placed: false, position: null },
    { id: "butterfly-20", size: 20, placed: false, position: null },
  ])

  // State for draggable butterflies in scrambled order
  const [draggableButterflies, setDraggableButterflies] = useState<ButterflyItem[]>([])

  // State for tracking the current dragged item
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  // State for tracking if the game is completed
  const [isCompleted, setIsCompleted] = useState(false)

  // State for success message
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Add game completion tracking
  const { recordCompletion, isLoggedIn, isHistoricallyCompleted } = useGameCompletionWithHistory("sorting-game")

  // Get the appropriate item image based on season
  const getItemImage = () => {
    if (selectedSeason === "zima") {
      return "/images/snowflake_01_winter.svg"
    }
    if (selectedSeason === "jesien") {
      return "/images/mushroom_brown_autumn.png"
    }
    return selectedSeason === "lato" ? "/images/duck_summer.svg" : "/images/butterfly_02.png"
  }

  // Get the appropriate title box based on season
  const getTitleBox = () => {
    if (selectedSeason === "zima") {
      return "/images/title_box_small_winter.svg"
    }
    if (selectedSeason === "jesien") {
      return "/images/title_box_small_autumn.svg"
    }
    return selectedSeason === "lato" ? "/images/title_box_small_summer.svg" : "/images/title_box_small.png"
  }

  // Get the appropriate sound icon based on season
  const getSoundIcon = () => {
    if (selectedSeason === "zima") {
      return "/images/sound_winter.svg"
    }
    if (selectedSeason === "jesien") {
      return "/images/sound_autumn.svg"
    }
    return selectedSeason === "lato" ? "/images/sound_summer.svg" : theme.soundIcon
  }

  // Get the appropriate menu icon based on season
  const getMenuIcon = () => {
    if (selectedSeason === "zima") {
      return "/images/menu_winter.svg"
    }
    if (selectedSeason === "jesien") {
      return "/images/menu_autumn.svg"
    }
    return selectedSeason === "lato" ? "/images/menu_summer.svg" : theme.menuIcon
  }

  // Function to check if a box is active (can accept drops)
  const isBoxActive = (position: number) => {
    if (position === 0) return true // First box is always active

    // Check if all previous boxes are filled
    for (let i = 0; i < position; i++) {
      const hasButterfly = butterflyItems.some((item) => item.position === i)
      if (!hasButterfly) return false
    }
    return true
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

    // Check if this box is active
    if (!isBoxActive(position)) return

    // Find the dragged butterfly
    const draggedButterfly = butterflyItems.find((item) => item.id === draggedItem)
    if (!draggedButterfly) return

    // Check if the position is already occupied
    const isOccupied = butterflyItems.some((item) => item.position === position)
    if (isOccupied) return

    // Check if this is the correct position for descending order
    // The correct order is: 100% (position 0), 70% (position 1), 40% (position 2), 20% (position 3)
    const correctPosition = butterflyItems.findIndex((item) => item.id === draggedItem)

    if (correctPosition !== position) {
      // Incorrect placement - don't place the butterfly, just return
      return
    }

    // Update the butterfly's position
    setButterflyItems((prevItems) =>
      prevItems.map((item) => (item.id === draggedItem ? { ...item, placed: true, position: position } : item)),
    )

    setDraggableButterflies((prevButterflies) => prevButterflies.filter((butterfly) => butterfly.id !== draggedItem))

    setDraggedItem(null)

    // Check if all butterflies are placed correctly
    setTimeout(async () => {
      // Get the updated butterfly items after the state change
      const updatedItems = butterflyItems.map((item) =>
        item.id === draggedItem ? { ...item, placed: true, position: position } : item,
      )

      // Count how many butterflies are placed in total
      const totalPlacedCount = updatedItems.filter((item) => item.placed).length

      // We should have 4 placed butterflies when complete (1 pre-placed + 3 newly placed)
      if (totalPlacedCount === 4) {
        console.log("Game completed! All butterflies placed.")
        setIsCompleted(true)
        setSuccessMessage(getRandomSuccessMessage())

        // Record the game completion
        await recordCompletion()
      }
    }, 100)
  }

  // Function to set the initial order of butterflies: medium, large, larger, small
  const setInitialOrder = () => {
    // Get only the unplaced butterflies
    const unplacedButterflies = butterflyItems.filter((item) => !item.placed || item.id !== "butterfly-100")

    // Sort them in the order: medium (40), large (70), larger (100), small (20)
    // Note: This is based on the specific sizes in your game
    const orderedButterflies = [...unplacedButterflies].sort((a, b) => {
      // Custom sorting order
      const order = { 40: 1, 70: 2, 100: 3, 20: 4 }
      return order[a.size] - order[b.size]
    })

    setDraggableButterflies(orderedButterflies)
  }

  // Reset the game
  const resetGame = () => {
    // First prepare the updated state with reset values
    const resetButterflyItems = butterflyItems.map((item) =>
      item.id === "butterfly-100"
        ? item // Keep the first butterfly in place
        : { ...item, placed: false, position: null },
    )

    // Update the state
    setButterflyItems(resetButterflyItems)
    setIsCompleted(false)
    setSuccessMessage(null)

    // Immediately update the draggable butterflies with the unplaced ones
    const unplacedButterflies = resetButterflyItems.filter((item) => !item.placed)
    const orderedButterflies = [...unplacedButterflies].sort((a, b) => {
      // Custom sorting order
      const order = { 40: 1, 70: 2, 100: 3, 20: 4 }
      return order[a.size] - order[b.size]
    })

    setDraggableButterflies(orderedButterflies)
  }

  // Initialize draggable butterflies on component mount
  useEffect(() => {
    setInitialOrder()
  }, [])

  
  

  return (
    <div className="w-full max-w-4xl mx-auto" style={{ backgroundColor: theme.background }}>
      {/* Header with title */}
      <div className="w-full flex justify-between items-center mb-8">
        <div className="relative w-16 h-16">
          <SoundButtonEnhanced
            text="UŁÓŻ DALEJ."
            soundIcon={getSoundIcon() || "/images/sound_icon_dragon_page.svg"}
            size="xl"
            className="w-full h-full"
          />
        </div>

        <div className="relative h-24 w-80 md:w-[500px] flex items-center justify-center">
          <Image src={getTitleBox() || "/placeholder.svg"} alt="Title box" fill className="object-contain" />
          <span className="relative z-10 text-white text-2xl md:text-3xl font-sour-gummy font-thin">UŁÓŻ DALEJ.</span>
        </div>

        <div className="relative w-16 h-16" onClick={onMenuClick}>
          <Image src={getMenuIcon() || "/placeholder.svg"} alt="Menu" fill className="object-contain cursor-pointer" />
        </div>
      </div>

      {/* Game area */}
      <div className="flex flex-col items-center mt-16">
        {/* Draggable butterflies at the top - in specific order: medium, smallest, largest */}
        <div className="flex justify-center gap-16 mb-16">
          {draggableButterflies.map((butterfly) => {
            // Skip if already placed
            if (butterfly.placed) return null

            return (
              <div
                key={`draggable-${butterfly.id}`}
                draggable
                onDragStart={() => handleDragStart(butterfly.id)}
                className="relative cursor-grab"
                style={{
                  width: `${butterfly.size}px`,
                  height: `${butterfly.size}px`,
                }}
              >
                {selectedSeason === "zima" ? (
                  <div className="winter-item-shadow">
                    <Image
                      src={getItemImage() || "/placeholder.svg"}
                      alt={`Butterfly ${butterfly.size}%`}
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <Image
                    src={getItemImage() || "/placeholder.svg"}
                    alt={`Butterfly ${butterfly.size}%`}
                    fill
                    className="object-contain"
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* Boxes for dropping */}
        <div className="flex justify-center gap-4">
          {[0, 1, 2, 3].map((position) => {
            // Find if there's a butterfly placed in this position
            const placedButterfly = butterflyItems.find((item) => item.position === position)
            const isActive = isBoxActive(position)

            return (
              <div
                key={`box-${position}`}
                className={`relative h-[150px] w-[150px] ${!isActive ? "opacity-30" : ""}`}
                onDragOver={isActive && !placedButterfly ? handleDragOver : undefined}
                onDrop={isActive && !placedButterfly ? (e) => handleDrop(e, position) : undefined}
              >
                <Image src="/images/white_box_medium.svg" alt="Box" fill className="object-contain" />

                {placedButterfly && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="relative"
                      style={{
                        width: `${placedButterfly.size}px`,
                        height: `${placedButterfly.size}px`,
                      }}
                    >
                      {selectedSeason === "zima" ? (
                        <div className="winter-item-shadow">
                          <Image
                            src={getItemImage() || "/placeholder.svg"}
                            alt={`Butterfly ${placedButterfly.size}%`}
                            fill
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <Image
                          src={getItemImage() || "/placeholder.svg"}
                          alt={`Butterfly ${placedButterfly.size}%`}
                          fill
                          className="object-contain"
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Success message */}
        {successMessage && <SuccessMessage message={successMessage} />}

        {/* New Navigation Buttons */}
        <div className="flex justify-center gap-4 mt-8 w-full">
          {/* All buttons in same container with identical dimensions */}
          <div className="flex gap-4 items-end">
            {/* WRÓĆ Button - always available in sorting-game */}
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
