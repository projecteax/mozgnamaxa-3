"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { useGameCompletionWithHistory } from "@/hooks/use-game-completion"
import { getRandomSuccessMessage } from "@/lib/success-messages"
import { useSeason } from "@/contexts/season-context"
import SuccessMessage from "./success-message"
import SoundButtonEnhanced from "./sound-button-enhanced"

// Define the symbol types
type Symbol = "ladybug" | "butterfly" | "flower" | null

// Define the initial sudoku state - based on the Figma design
const initialGrid: Symbol[][] = [
  ["ladybug", "butterfly", "flower"],
  ["flower", "ladybug", "butterfly"],
  ["butterfly", "flower", null], // Bottom right cell is empty
]

// The solution grid
const solutionGrid: Symbol[][] = [
  ["ladybug", "butterfly", "flower"],
  ["flower", "ladybug", "butterfly"],
  ["butterfly", "flower", "ladybug"],
]

interface SudokuGameProps {
  onMenuClick: () => void
  onComplete?: () => void
  onBack?: () => void
  onNext?: () => void
  onRetry?: () => void
  userLoggedIn?: boolean
  currentSeason?: string
  isGameCompleted?: boolean
}

// All available symbols for dragging
const availableSymbols: Symbol[] = ["ladybug", "butterfly", "flower"]

export default function SudokuGame({ onMenuClick, onComplete, onBack, onNext, onRetry, userLoggedIn = false, currentSeason = "wiosna", isGameCompleted = false }: SudokuGameProps) {
  // Get season context
  const { selectedSeason, getThemeColors } = useSeason()
  const theme = getThemeColors()

  // Check if it's autumn season
  const isAutumn = selectedSeason === "jesien"

  // Check if it's winter season
  const isWinter = selectedSeason === "zima"

  // State for the current grid
  const [grid, setGrid] = useState<Symbol[][]>(initialGrid)

  // State for tracking the current dragged item
  const [draggedItem, setDraggedItem] = useState<Symbol | null>(null)

  // State for tracking if the game is complete
  const [isGameComplete, setIsGameComplete] = useState(false)

  // State for success message
  const [successMessage, setSuccessMessage] = useState<string>("")

  // Use the game completion hook
  const { recordCompletion, isLoggedIn, isHistoricallyCompleted } = useGameCompletionWithHistory("sudoku-game")

  // Reset game when season changes
  useEffect(() => {
    setGrid(initialGrid)
    setIsGameComplete(false)
    setSuccessMessage("")
    setDraggedItem(null)
  }, [selectedSeason])

  // Check if the sudoku is complete and correct
  useEffect(() => {
    const isComplete = grid.every((row, rowIndex) =>
      row.every((cell, colIndex) => cell === solutionGrid[rowIndex][colIndex]),
    )

    if (isComplete && !isGameComplete) {
      setIsGameComplete(true)
      setSuccessMessage(getRandomSuccessMessage())
      if (isLoggedIn) {
        recordCompletion()
      }
      // Call completion callback after 3 seconds to show success message
      if (onComplete) {
        setTimeout(() => {
        onComplete()
        }, 3000) // 3 second delay
      }
    }
  }, [grid, isGameComplete, isLoggedIn, recordCompletion, onComplete])

  // Handle drag start
  const handleDragStart = (symbol: Symbol) => {
    setDraggedItem(symbol)
  }

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  // Handle drop
  const handleDrop = (e: React.DragEvent, row: number, col: number) => {
    e.preventDefault()

    // Only allow drops in empty cells and only accept the correct symbol (ladybug for position [2][2])
    if (grid[row][col] === null && draggedItem) {
      const correctSymbol = solutionGrid[row][col]
      if (draggedItem === correctSymbol) {
        const newGrid = grid.map((gridRow, rowIndex) =>
          gridRow.map((cell, colIndex) => (rowIndex === row && colIndex === col ? draggedItem : cell)),
        )
        setGrid(newGrid)
      }
      // No error message for incorrect attempts - just don't place the symbol
    }

    setDraggedItem(null)
  }

  // Reset game function
  const resetGame = () => {
    setGrid(initialGrid)
    setIsGameComplete(false)
    setSuccessMessage("")
    setDraggedItem(null)
  }

  // Get the image path for a symbol based on season
  const getSymbolImage = (symbol: Symbol): string => {
    if (selectedSeason === "lato") {
      // Summer version
      switch (symbol) {
        case "ladybug":
          return "/images/sunglasses_summer.svg"
        case "butterfly":
          return "/images/flip_flops_summer.svg"
        case "flower":
          return "/images/hat_summer.svg"
        default:
          return ""
      }
    } else if (isWinter) {
      // Winter version
      switch (symbol) {
        case "ladybug":
          return "/images/snowman_winter.svg"
        case "butterfly":
          return "/images/star_winter.svg"
        case "flower":
          return "/images/snowflake_winter.svg"
        default:
          return ""
      }
    } else if (isAutumn) {
      // Autumn version
      switch (symbol) {
        case "ladybug":
          return "/images/chestnut_autumn.svg"
        case "butterfly":
          return "/images/pumpkin_autumn.svg"
        case "flower":
          return "/images/mushroom_red_autumn.svg"
        default:
          return ""
      }
    } else {
      // Spring version (original)
      switch (symbol) {
        case "ladybug":
          return "/images/ladybug_sudoku.svg"
        case "butterfly":
          return "/images/butterfly_yellow_sudoku.svg"
        case "flower":
          return "/images/flower_yellow_sudoku.svg"
        default:
          return ""
      }
    }
  }

  // Get the symbol name for accessibility based on season
  const getSymbolName = (symbol: Symbol): string => {
    if (selectedSeason === "lato") {
      // Summer version
      switch (symbol) {
        case "ladybug":
          return "Okulary"
        case "butterfly":
          return "Japonki"
        case "flower":
          return "Kapelusz"
        default:
          return ""
      }
    } else if (isWinter) {
      // Winter version
      switch (symbol) {
        case "ladybug":
          return "Bałwan"
        case "butterfly":
          return "Gwiazda"
        case "flower":
          return "Płatek śniegu"
        default:
          return ""
      }
    } else if (isAutumn) {
      // Autumn version
      switch (symbol) {
        case "ladybug":
          return "Kasztan"
        case "butterfly":
          return "Dynia"
        case "flower":
          return "Grzyb"
        default:
          return ""
      }
    } else {
      // Spring version (original)
      switch (symbol) {
        case "ladybug":
          return "Biedronka"
        case "butterfly":
          return "Motyl"
        case "flower":
          return "Kwiatek"
        default:
          return ""
      }
    }
  }

  // Get title box image based on season
  const getTitleBoxImage = () => {
    if (isWinter) {
      return "/images/title_box_small_winter.svg"
    } else if (isAutumn) {
      return "/images/title_box_small_autumn.svg"
    } else if (selectedSeason === "lato") {
      return "/images/title_box_small_summer.svg"
    } else {
      return "/images/title_box_small.png"
    }
  }

  // Get sound icon based on season
  const getSoundIcon = () => {
    if (isWinter) {
      return "/images/sound_winter.svg"
    } else if (isAutumn) {
      return "/images/sound_autumn.svg"
    } else {
      return theme.soundIcon || "/placeholder.svg"
    }
  }

  // Get menu icon based on season
  const getMenuIcon = () => {
    if (isWinter) {
      return "/images/menu_winter.svg"
    } else if (isAutumn) {
      return "/images/menu_autumn.svg"
    } else {
      return theme.menuIcon || "/placeholder.svg"
    }
  }

  return (
    <div className="w-full max-w-4xl">
      {/* Header with title */}
      <div className="w-full flex justify-between items-center mb-8">
        <div className="relative w-16 h-16">
          <SoundButtonEnhanced
            text="UZUPEŁNIJ SUDOKU."
            soundIcon={theme.soundIcon || "/images/sound_icon_dragon_page.svg"}
            size="xl"
            className="w-full h-full"
          />
        </div>

        <div className="relative h-24 w-80 md:w-[500px] flex items-center justify-center">
          <Image src={getTitleBoxImage() || "/placeholder.svg"} alt="Title box" fill className="object-contain" />
          <span className="relative z-10 text-white text-2xl md:text-3xl font-sour-gummy font-thin">
            UZUPEŁNIJ SUDOKU.
          </span>
        </div>

        <div className="relative w-16 h-16" onClick={onMenuClick}>
          <Image src={getMenuIcon() || "/placeholder.svg"} alt="Menu" fill className="object-contain cursor-pointer" />
        </div>
      </div>

      {/* Game area */}
      <div className="relative w-full flex justify-center">
        {/* Sudoku grid container */}
        <div className="relative">
          {/* Grid frame */}
          <div className="relative w-[300px] h-[300px]">
            <Image src="/images/sudoku_frame.svg" alt="Sudoku frame" fill className="object-contain" />

            {/* Grid cells */}
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-0">
              {grid.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className="relative flex items-center justify-center border-0"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
                  >
                    {cell && (
                      <div className="relative w-16 h-16">
                        <Image
                          src={getSymbolImage(cell) || "/placeholder.svg"}
                          alt={getSymbolName(cell)}
                          fill
                          className="object-contain"
                        />
                      </div>
                    )}
                  </div>
                )),
              )}
            </div>
          </div>
        </div>

        {/* Draggable items - positioned on the right side */}
        {!isGameComplete && (
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 mr-8 flex flex-col gap-4">
            {availableSymbols.map((symbol) => (
              <div
                key={symbol}
                draggable
                onDragStart={() => handleDragStart(symbol)}
                className="relative w-20 h-20 cursor-grab hover:cursor-grabbing"
              >
                <Image
                  src={getSymbolImage(symbol) || "/placeholder.svg"}
                  alt={getSymbolName(symbol)}
                  fill
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Success message - only visible when the game is complete */}
      {isGameComplete && <SuccessMessage message={successMessage} />}

      {/* New Navigation Buttons - Always visible */}
      <div className="flex justify-center gap-4 mt-8 w-full">
        {/* All buttons in same container with identical dimensions */}
        <div className="flex gap-4 items-end">
          {/* WRÓĆ Button - always available in sudoku-game */}
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
