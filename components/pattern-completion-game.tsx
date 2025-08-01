"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useGameCompletionWithHistory } from "@/hooks/use-game-completion"
import { getRandomSuccessMessage } from "@/lib/success-messages"
import { useSeason } from "@/contexts/season-context"
import SuccessMessage from "./success-message"
import SoundButtonEnhanced from "./sound-button-enhanced"

interface PatternCompletionGameProps {
  onMenuClick: () => void
  onBack?: () => void
  onNext?: () => void
  onRetry?: () => void
  userLoggedIn?: boolean
  currentSeason?: string
  isGameCompleted?: boolean
}

export default function PatternCompletionGame({ onMenuClick, onBack, onNext, onRetry, userLoggedIn = false, currentSeason = "wiosna", isGameCompleted = false }: PatternCompletionGameProps) {
  const { selectedSeason, getThemeColors } = useSeason()
  const theme = getThemeColors()
  const isAutumn = selectedSeason === "jesien"
  const isWinter = selectedSeason === "zima"

  // State for tracking which empty boxes have been filled
  const [filledBoxes, setFilledBoxes] = useState<{ [key: string]: string }>({})

  // State for tracking the current dragged item
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  // State for tracking if the game is complete
  const [isGameComplete, setIsGameComplete] = useState(false)

  // State for success message
  const [successMessage, setSuccessMessage] = useState<string>("")

  // Use the game completion hook
  const { recordCompletion, isLoggedIn, isHistoricallyCompleted } = useGameCompletionWithHistory("pattern-completion-game")

  // Reset game when season changes
  useEffect(() => {
    setFilledBoxes({})
    setIsGameComplete(false)
    setSuccessMessage("")
    setDraggedItem(null)
  }, [selectedSeason])

  // Get item image based on season and type
  const getItemImage = (itemType: string) => {
    if (isWinter) {
      switch (itemType) {
        case "worm":
          return "/images/sequence_winter_01.svg"
        case "cocoon":
          return "/images/sequence_winter_02.svg"
        case "butterfly":
          return "/images/sequence_winter_03.svg"
        default:
          return "/placeholder.svg"
      }
    } else if (isAutumn) {
      switch (itemType) {
        case "worm":
          return "/images/pattern_autumn_01.svg"
        case "cocoon":
          return "/images/pattern_autumn_02.svg"
        case "butterfly":
          return "/images/pattern_autumn_03.svg"
        default:
          return "/placeholder.svg"
      }
    } else if (selectedSeason === "lato") {
      switch (itemType) {
        case "worm":
          return "/images/ice_stage_01_summer.svg"
        case "cocoon":
          return "/images/ice_stage_02_summer.svg"
        case "butterfly":
          return "/images/ice_stage_03_summer.svg"
        default:
          return "/placeholder.svg"
      }
    } else {
      switch (itemType) {
        case "worm":
          return "/images/worm.svg"
        case "cocoon":
          return "/images/cocoon.svg"
        case "butterfly":
          return "/images/butterfly_yellow_new.svg"
        default:
          return "/placeholder.svg"
      }
    }
  }

  // Pattern sequence for the first row
  const patternSequence = [
    {
      id: "worm-1",
      type: "icon",
      itemType: "worm",
      name: isWinter ? "Winter Pattern 1" : isAutumn ? "Pattern 1" : selectedSeason === "lato" ? "Ice Stage 1" : "Worm",
    },
    {
      id: "cocoon-1",
      type: "icon",
      itemType: "cocoon",
      name: isWinter
        ? "Winter Pattern 2"
        : isAutumn
          ? "Pattern 2"
          : selectedSeason === "lato"
            ? "Ice Stage 2"
            : "Cocoon",
    },
    {
      id: "butterfly-1",
      type: "icon",
      itemType: "butterfly",
      name: isWinter
        ? "Winter Pattern 3"
        : isAutumn
          ? "Pattern 3"
          : selectedSeason === "lato"
            ? "Ice Stage 3"
            : "Butterfly",
    },
    {
      id: "worm-2",
      type: "icon",
      itemType: "worm",
      name: isWinter ? "Winter Pattern 1" : isAutumn ? "Pattern 1" : selectedSeason === "lato" ? "Ice Stage 1" : "Worm",
    },
    { id: "empty-1", type: "empty", expectedItem: "cocoon", name: "Empty Box 1" },
    {
      id: "butterfly-2",
      type: "icon",
      itemType: "butterfly",
      name: isWinter
        ? "Winter Pattern 3"
        : isAutumn
          ? "Pattern 3"
          : selectedSeason === "lato"
            ? "Ice Stage 3"
            : "Butterfly",
    },
    {
      id: "worm-3",
      type: "icon",
      itemType: "worm",
      name: isWinter ? "Winter Pattern 1" : isAutumn ? "Pattern 1" : selectedSeason === "lato" ? "Ice Stage 1" : "Worm",
    },
    {
      id: "cocoon-2",
      type: "icon",
      itemType: "cocoon",
      name: isWinter
        ? "Winter Pattern 2"
        : isAutumn
          ? "Pattern 2"
          : selectedSeason === "lato"
            ? "Ice Stage 2"
            : "Cocoon",
    },
    { id: "empty-2", type: "empty", expectedItem: "butterfly", name: "Empty Box 2" },
  ]

  // Draggable items for the second row
  const draggableItems = [
    {
      id: "drag-worm",
      type: "worm",
      name: isWinter ? "Winter Pattern 1" : isAutumn ? "Pattern 1" : selectedSeason === "lato" ? "Ice Stage 1" : "Worm",
    },
    {
      id: "drag-butterfly",
      type: "butterfly",
      name: isWinter
        ? "Winter Pattern 3"
        : isAutumn
          ? "Pattern 3"
          : selectedSeason === "lato"
            ? "Ice Stage 3"
            : "Butterfly",
    },
    {
      id: "drag-cocoon",
      type: "cocoon",
      name: isWinter
        ? "Winter Pattern 2"
        : isAutumn
          ? "Pattern 2"
          : selectedSeason === "lato"
            ? "Ice Stage 2"
            : "Cocoon",
    },
  ]

  // Check if the first box is filled (needed to enable second box)
  const isFirstBoxFilled = filledBoxes["empty-1"] === "cocoon"

  // Check if second box is available (first box must be filled correctly)
  const isSecondBoxAvailable = isFirstBoxFilled

  // Check if all items are correctly placed
  useEffect(() => {
    const isComplete = filledBoxes["empty-1"] === "cocoon" && filledBoxes["empty-2"] === "butterfly"

    if (isComplete && !isGameComplete) {
      setIsGameComplete(true)
      setSuccessMessage(getRandomSuccessMessage())
      if (isLoggedIn) {
        recordCompletion()
      }
    }
  }, [filledBoxes, isGameComplete, isLoggedIn, recordCompletion])

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, itemType: string) => {
    setDraggedItem(itemType)
    e.dataTransfer.effectAllowed = "move"
  }

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  // Handle drop
  const handleDrop = (e: React.DragEvent, emptyBoxId: string, expectedItem: string) => {
    e.preventDefault()

    // Check if this box is available for dropping
    if (emptyBoxId === "empty-2" && !isSecondBoxAvailable) {
      setDraggedItem(null)
      return
    }

    if (draggedItem && draggedItem === expectedItem) {
      // Correct match
      setFilledBoxes((prev) => ({
        ...prev,
        [emptyBoxId]: draggedItem,
      }))
    }

    setDraggedItem(null)
  }

  // Reset game function
  const resetGame = () => {
    setFilledBoxes({})
    setIsGameComplete(false)
    setSuccessMessage("")
    setDraggedItem(null)
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header with title */}
      <div className="w-full flex justify-between items-center mb-8">
        <div className="relative w-16 h-16">
          <SoundButtonEnhanced
            text="CO PASUJE? UZUPEŁNIJ."
            soundIcon={theme.soundIcon || "/images/sound_icon_dragon_page.svg"}
            size="xl"
            className="w-full h-full"
          />
        </div>

        <div className="relative h-24 w-80 md:w-[500px] flex items-center justify-center">
          <Image
            src={
              isWinter
                ? "/images/title_box_small_winter.svg"
                : isAutumn
                  ? "/images/title_box_small_autumn.svg"
                  : selectedSeason === "lato"
                    ? "/images/title_box_small_summer.svg"
                    : "/images/title_box_small.png"
            }
            alt="Title box"
            fill
            className="object-contain"
          />
          <span className="relative z-10 text-white text-2xl md:text-3xl font-sour-gummy font-thin">
            CO PASUJE? UZUPEŁNIJ.
          </span>
        </div>

        <div className="relative w-16 h-16" onClick={onMenuClick}>
          <Image
            src={
              isWinter
                ? "/images/menu_winter.svg"
                : isAutumn
                  ? "/images/menu_autumn.svg"
                  : theme.menuIcon || "/placeholder.svg"
            }
            alt="Menu"
            fill
            className="object-contain cursor-pointer"
          />
        </div>
      </div>

      {/* Game area */}
      <div className="flex flex-col items-center gap-12">
        {/* First row - Pattern sequence */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {patternSequence.map((item) => (
            <div key={item.id} className="flex items-center justify-center">
              {item.type === "icon" ? (
                // Regular icon (not in a box)
                <div className="relative h-[80px] w-[80px]">
                  <Image
                    src={getItemImage(item.itemType!) || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                // Empty box for dropping
                <div
                  className={`relative h-[140px] w-[140px] ${
                    item.id === "empty-2" && !isSecondBoxAvailable ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                  }`}
                  onDragOver={handleDragOver}
                  onDrop={(e) => {
                    if (item.type === "empty" && item.expectedItem) {
                      handleDrop(e, item.id, item.expectedItem)
                    }
                  }}
                >
                  <Image src="/images/white_box_medium.svg" alt="Empty box" fill className="object-contain" priority />
                  <div className="absolute inset-0 flex items-center justify-center">
                    {filledBoxes[item.id] && (
                      <div className="relative h-[80px] w-[80px]">
                        <Image
                          src={getItemImage(filledBoxes[item.id]) || "/placeholder.svg"}
                          alt={filledBoxes[item.id]}
                          fill
                          className="object-contain"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Second row - Draggable items */}
        <div className="flex items-center justify-center gap-8">
          {draggableItems.map((item) => (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => handleDragStart(e, item.type)}
              className="relative h-[80px] w-[80px] cursor-grab hover:scale-110 transition-transform active:cursor-grabbing"
            >
              <Image
                src={getItemImage(item.type) || "/placeholder.svg"}
                alt={item.name}
                fill
                className="object-contain pointer-events-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Success message - only visible when the game is complete */}
      {isGameComplete && <SuccessMessage message={successMessage} />}

      {/* New Navigation Buttons - Always visible */}
      <div className="flex justify-center gap-4 mt-8 w-full">
        {/* All buttons in same container with identical dimensions */}
        <div className="flex gap-4 items-end">
          {/* WRÓĆ Button - always available in pattern-completion-game */}
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
            className={`relative w-52 h-14 transition-all ${isGameComplete ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed opacity-50'}`}
            onClick={isGameComplete ? resetGame : undefined}
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
                          className={`relative w-36 h-14 transition-all ${(userLoggedIn && !isGameComplete && !isHistoricallyCompleted) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-105'}`}
                          onClick={(userLoggedIn && !isGameComplete && !isHistoricallyCompleted) ? undefined : onNext}
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
  )
}
