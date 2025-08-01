"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { useGameCompletionWithHistory } from "@/hooks/use-game-completion"
import { getRandomSuccessMessage } from "@/lib/success-messages"
import { useSeason } from "@/contexts/season-context"
import SuccessMessage from "./success-message"
import SoundButtonEnhanced from "./sound-button-enhanced"

interface BirdsPuzzleGameProps {
  onMenuClick: () => void
  onBack?: () => void
  onNext?: () => void
  onRetry?: () => void
  userLoggedIn?: boolean
  currentSeason?: string
  isGameCompleted?: boolean
}

interface PuzzlePiece {
  id: number
  sequence: number
  image: string
  isPlaced: boolean
}

interface DropZone {
  id: string
  sequence: number
  polygon: number[][]
}

export default function BirdsPuzzleGame({ onMenuClick, onBack, onNext, onRetry, userLoggedIn = false, currentSeason = "wiosna", isGameCompleted = false }: BirdsPuzzleGameProps) {
  const { selectedSeason, getThemeColors } = useSeason()
  const theme = getThemeColors()

  // Get season-specific images
  const getSeasonImages = () => {
    let suffix: string

    switch (selectedSeason) {
      case "lato": // summer
        suffix = "summer"
        break
      case "jesien": // autumn
        suffix = "autumn"
        break
      case "zima": // winter
        suffix = "winter"
        break
      case "wiosna": // spring - use default assets (no suffix)
      default: // fall back to default assets (no suffix)
        suffix = ""
    }

    return {
      pieces: [
        `/images/birds_puzzle${suffix ? `_${suffix}` : ""}_01.svg`,
        `/images/birds_puzzle${suffix ? `_${suffix}` : ""}_02.svg`,
        `/images/birds_puzzle${suffix ? `_${suffix}` : ""}_03.svg`,
        `/images/birds_puzzle${suffix ? `_${suffix}` : ""}_04.svg`,
        `/images/birds_puzzle${suffix ? `_${suffix}` : ""}_05.svg`,
        `/images/birds_puzzle${suffix ? `_${suffix}` : ""}_06.svg`,
      ],
      completed:
        suffix === "winter"
          ? `/images/birds_puzzle_completed_winter.svg`
          : suffix
            ? `/images/birds_puzzle_${suffix}_completed.svg`
            : `/images/birds_finished_puzzle.svg`,
      sound: suffix ? `/images/sound_${suffix}.svg` : `/images/sound_new.svg`,
      menu: suffix ? `/images/menu_${suffix}.svg` : `/images/menu_new.svg`,
      titleBox: suffix ? `/images/title_box_small_${suffix}.svg` : `/images/title_box_small.png`,
    }
  }

  const seasonImages = getSeasonImages()

  // Define the 6 puzzle pieces
  const [puzzlePieces, setPuzzlePieces] = useState<PuzzlePiece[]>([
    { id: 1, sequence: 1, image: seasonImages.pieces[0], isPlaced: false },
    { id: 2, sequence: 2, image: seasonImages.pieces[1], isPlaced: false },
    { id: 3, sequence: 3, image: seasonImages.pieces[2], isPlaced: false },
    { id: 4, sequence: 4, image: seasonImages.pieces[3], isPlaced: false },
    { id: 5, sequence: 5, image: seasonImages.pieces[4], isPlaced: false },
    { id: 6, sequence: 6, image: seasonImages.pieces[5], isPlaced: false },
  ])

  // Define drop zones with parallelogram coordinates (scaled down from 500px to 300px)
  const dropZones: DropZone[] = [
    {
      id: "zone1",
      sequence: 1,
      polygon: [
        [0, 0],
        [66, 0],
        [15.9, 300],
        [0, 300],
      ],
    },
    {
      id: "zone2",
      sequence: 2,
      polygon: [
        [66, 0],
        [120, 0],
        [70.8, 300],
        [15.9, 300],
      ],
    },
    {
      id: "zone3",
      sequence: 3,
      polygon: [
        [120, 0],
        [174, 0],
        [124.8, 300],
        [70.8, 300],
      ],
    },
    {
      id: "zone4",
      sequence: 4,
      polygon: [
        [174, 0],
        [229.2, 0],
        [180, 300],
        [124.8, 300],
      ],
    },
    {
      id: "zone5",
      sequence: 5,
      polygon: [
        [229.2, 0],
        [282, 0],
        [235.8, 300],
        [180, 300],
      ],
    },
    {
      id: "zone6",
      sequence: 6,
      polygon: [
        [282, 0],
        [300, 0],
        [300, 300],
        [235.8, 300],
      ],
    },
  ]

  // Scrambled pieces in specific order: 03, 02, 01, 06, 05, 04
  const [shuffledOrder] = useState<number[]>([3, 2, 1, 6, 5, 4])

  // Track the next expected piece sequence
  const [nextExpectedSequence, setNextExpectedSequence] = useState<number>(1)

  // State for tracking if the puzzle is completed
  const [isCompleted, setIsCompleted] = useState(false)

  // State for tracking the current dragged piece
  const [draggedPiece, setDraggedPiece] = useState<number | null>(null)

  // State for success message
  const [successMessage, setSuccessMessage] = useState<string>("")

  // Use the game completion hook
  const { recordCompletion, isLoggedIn, isHistoricallyCompleted } = useGameCompletionWithHistory("birds-puzzle-game")

  // Puzzle dimensions - ensuring all pieces are exactly 300px height
  const frameSize = 300
  const pieceHeight = 300
  // Width calculated to maintain proper aspect ratio for puzzle pieces
  const pieceWidth = 120

  // Function to check if a point is inside a polygon using ray casting algorithm
  const isPointInPolygon = (point: [number, number], polygon: number[][]): boolean => {
    const [x, y] = point
    let inside = false

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const [xi, yi] = polygon[i]
      const [xj, yj] = polygon[j]

      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
        inside = !inside
      }
    }

    return inside
  }

  // Function to get drop zone at coordinates
  const getDropZoneAtPoint = (x: number, y: number): DropZone | null => {
    for (const zone of dropZones) {
      if (isPointInPolygon([x, y], zone.polygon)) {
        return zone
      }
    }
    return null
  }

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, pieceId: number) => {
    setDraggedPiece(pieceId)
    e.dataTransfer.effectAllowed = "move"
  }

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  // Handle drop on puzzle frame
  const handleDropOnFrame = (e: React.DragEvent) => {
    e.preventDefault()

    if (draggedPiece === null) return

    // Get the drop coordinates relative to the frame
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Find which drop zone the piece was dropped in
    const dropZone = getDropZoneAtPoint(x, y)
    if (!dropZone) return

    // Find the dragged piece
    const piece = puzzlePieces.find((p) => p.id === draggedPiece)
    if (!piece) return

    // Check if this is the next expected piece in sequence
    if (piece.sequence !== nextExpectedSequence) {
      // Wrong piece - don't place it
      setDraggedPiece(null)
      return
    }

    // Check if the drop zone matches the piece sequence
    if (dropZone.sequence !== piece.sequence) {
      // Wrong zone - don't place it
      setDraggedPiece(null)
      return
    }

    // Correct piece in correct zone - place it
    setPuzzlePieces((prevPieces) => prevPieces.map((p) => (p.id === draggedPiece ? { ...p, isPlaced: true } : p)))

    // Update next expected sequence
    setNextExpectedSequence(nextExpectedSequence + 1)

    setDraggedPiece(null)

    // Check if puzzle is completed
    if (nextExpectedSequence === 6) {
      setTimeout(() => {
        setIsCompleted(true)
        setSuccessMessage(getRandomSuccessMessage())
        console.log("🎉 Birds puzzle game completed! All pieces correctly placed in sequence!")

        // Record completion when game is finished
        recordCompletion()
      }, 500)
    }
  }

  // Reset the game
  const resetGame = () => {
    const newSeasonImages = getSeasonImages()
    setPuzzlePieces((prevPieces) =>
      prevPieces.map((piece, index) => ({
        ...piece,
        isPlaced: false,
        image: newSeasonImages.pieces[index],
      })),
    )
    setNextExpectedSequence(1)
    setIsCompleted(false)
    setSuccessMessage("")
  }

  // Get pieces in shuffled order for display
  const getShuffledPieces = () => {
    return shuffledOrder
      .map((sequence) => puzzlePieces.find((p) => p.sequence === sequence)!)
      .filter((p) => !p.isPlaced)
  }

  // Create SVG path for drop zone visualization
  const createPolygonPath = (polygon: number[][]): string => {
    return polygon.map((point, index) => `${index === 0 ? "M" : "L"} ${point[0]} ${point[1]}`).join(" ") + " Z"
  }

  return (
    <div className="w-full max-w-4xl">
      {/* Header with title */}
      <div className="w-full flex justify-between items-center mb-8">
        <div className="relative w-16 h-16">
          <SoundButtonEnhanced
            text="UŁÓŻ OBRAZEK"
            soundIcon={seasonImages.sound || "/images/sound_icon_dragon_page.svg"}
            size="xl"
            className="w-full h-full"
          />
        </div>

        <div className="relative h-24 w-80 md:w-[500px] flex items-center justify-center">
          <Image src={seasonImages.titleBox || "/placeholder.svg"} alt="Title box" fill className="object-contain" />
          <span className="relative z-10 text-white text-2xl md:text-3xl font-sour-gummy font-thin">UŁÓŻ OBRAZEK</span>
        </div>

        <div className="relative w-16 h-16" onClick={onMenuClick}>
          <Image
            src={seasonImages.menu || "/placeholder.svg"}
            alt="Menu"
            fill
            className="object-contain cursor-pointer"
          />
        </div>
      </div>

      {/* Game area */}
      <div className="relative w-full">
        {/* Show completed puzzle when game is finished */}
        {isCompleted ? (
          <div className="flex justify-center">
            <div className="relative" style={{ width: `${frameSize}px`, height: `${frameSize}px` }}>
              <Image
                src={seasonImages.completed || "/placeholder.svg"}
                alt="Completed birds puzzle"
                fill
                style={{ objectFit: "contain" }}
                className="select-none"
              />
            </div>
          </div>
        ) : (
          <>
            {/* Main game container with puzzle frame */}
            <div className="flex flex-col items-start pl-4">
              {/* Puzzle frame (300x300px) */}
              <div className="relative">
                <div
                  className="relative border-4 border-gray-500 bg-gray-300 rounded-lg overflow-hidden"
                  style={{
                    width: `${frameSize}px`,
                    height: `${frameSize}px`,
                  }}
                  onDragOver={handleDragOver}
                  onDrop={handleDropOnFrame}
                >
                  {/* SVG overlay for drop zones visualization */}
                  <svg
                    className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
                    viewBox={`0 0 ${frameSize} ${frameSize}`}
                  >
                    {dropZones.map((zone, index) => (
                      <path
                        key={zone.id}
                        d={createPolygonPath(zone.polygon)}
                        fill={zone.sequence <= nextExpectedSequence ? "rgba(0, 255, 0, 0.3)" : "rgba(255, 0, 0, 0.1)"}
                        stroke={zone.sequence === nextExpectedSequence ? "green" : "gray"}
                        strokeWidth="2"
                      />
                    ))}
                  </svg>

                  {/* Placed puzzle pieces */}
                  {puzzlePieces
                    .filter((piece) => piece.isPlaced)
                    .map((piece) => {
                      const zone = dropZones.find((z) => z.sequence === piece.sequence)!
                      const minX = Math.min(...zone.polygon.map((p) => p[0]))
                      const maxX = Math.max(...zone.polygon.map((p) => p[0]))
                      const width = maxX - minX

                      return (
                        <div
                          key={`placed-${piece.id}`}
                          className="absolute"
                          style={{
                            left: `${minX}px`,
                            top: `0px`,
                            width: `${width}px`,
                            height: `${frameSize}px`,
                            zIndex: piece.sequence,
                          }}
                        >
                          <Image
                            src={piece.image || "/placeholder.svg"}
                            alt={`Birds puzzle piece ${piece.sequence}`}
                            fill
                            style={{ objectFit: "cover" }}
                            className="select-none"
                          />
                        </div>
                      )
                    })}
                </div>
              </div>
            </div>

            {/* Draggable items - positioned to the right of the puzzle frame */}
            <div className="absolute left-[320px] top-0 h-full flex flex-col justify-center">
              {/* All scrambled pieces in a single horizontal row */}
              <div className="flex">
                {getShuffledPieces().map((piece, index) => (
                  <div
                    key={`piece-${piece.id}`}
                    className="relative cursor-grab hover:cursor-grabbing"
                    style={{
                      width: `${pieceWidth}px`,
                      height: `${pieceHeight}px`,
                      marginLeft: (() => {
                        if (index === 0) return "0px" // First piece (03)
                        if (index === 1) return "0px" // Second piece (02)
                        if (index === 2) return "-10px" // Third piece (01) gets -10px to be closer to 02
                        return index > 2 ? "-20px" : "0px" // Remaining pieces (06, 05, 04) get -20px overlap
                      })(),
                      zIndex: getShuffledPieces().length - index, // Higher z-index for pieces on the left
                    }}
                    draggable
                    onDragStart={(e) => handleDragStart(e, piece.id)}
                  >
                    <Image
                      src={piece.image || "/placeholder.svg"}
                      alt={`Birds puzzle piece ${piece.sequence}`}
                      fill
                      style={{ objectFit: "contain" }}
                      className="select-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Success message and button - only visible when the game is complete */}
      {isCompleted && <SuccessMessage message={successMessage} />}

      {/* New Navigation Buttons - Always visible */}
      <div className="flex justify-center gap-4 mt-8 w-full">
        {/* All buttons in same container with identical dimensions */}
        <div className="flex gap-4 items-end">
          {/* WRÓĆ Button - always available in birds-puzzle-game */}
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
  )
}
