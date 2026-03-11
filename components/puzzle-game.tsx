"use client"

import type React from "react"

import { useState, useEffect, useMemo, useCallback } from "react"
import Image from "next/image"
import { useGameCompletionWithHistory } from "@/hooks/use-game-completion"
import { getRandomSuccessMessage } from "@/lib/success-messages"
import { useSeason } from "@/contexts/season-context"
import SoundButtonEnhanced from "./sound-button-enhanced"
import SuccessMessage from "./success-message"

interface PuzzleGameProps {
  onMenuClick: () => void
  onBack?: () => void
  onNext?: () => void
  onRetry?: () => void
  userLoggedIn?: boolean
  currentSeason?: string
  isGameCompleted?: boolean
  onComplete?: () => void
}

interface PuzzlePiece {
  id: number
  image: string
  correctPosition: number
  currentPosition: number | null
}

type SpringPuzzleVariant = 1 | 2 | 3
type PuzzleLayout = "horizontal" | "vertical" | "grid2x2"

interface PuzzleVariantConfig {
  images: string[]
  layout: PuzzleLayout
  columns: number
  rows: number
  pieceWidth: number
  pieceHeight: number
  shuffleOrder: number[]
}

export default function PuzzleGame({ onMenuClick, onBack, onNext, onRetry, userLoggedIn = false, currentSeason = "wiosna", isGameCompleted = false, onComplete }: PuzzleGameProps) {
  const { selectedSeason, getThemeColors } = useSeason()
  const themeColors = getThemeColors()
  const [diagnosticSpringVariant, setDiagnosticSpringVariant] = useState<0 | SpringPuzzleVariant>(0)
  const [randomSpringVariant] = useState<SpringPuzzleVariant>(() => (Math.floor(Math.random() * 3) + 1) as SpringPuzzleVariant)
  const activeSpringVariant = diagnosticSpringVariant === 0 ? randomSpringVariant : diagnosticSpringVariant

  // Get the appropriate title box based on season
  const getTitleBox = () => {
    switch (selectedSeason) {
      case "lato":
        return "/images/title_box_small_summer.svg"
      case "jesien":
        return "/images/title_box_small_autumn.svg"
      case "zima":
        return "/images/title_box_small_winter.svg"
      default:
        return "/images/title_box_small.png"
    }
  }

  const puzzleConfig = useMemo((): PuzzleVariantConfig => {
    if (selectedSeason === "wiosna") {
      if (activeSpringVariant === 2) {
        return {
          images: [
            "/images/puzzle_2_meadow_01.svg",
            "/images/puzzle_2_meadow_02.svg",
            "/images/puzzle_2_meadow_03.svg",
            "/images/puzzle_2_meadow_04.svg",
            "/images/puzzle_2_meadow_05.svg",
          ],
          layout: "vertical",
          columns: 1,
          rows: 5,
          // Fill the full board area in variant 2 to avoid inner white frame.
          pieceWidth: 335,
          pieceHeight: 48,
          shuffleOrder: [1, 5, 2, 4, 3],
        }
      }

      if (activeSpringVariant === 3) {
        return {
          images: [
            "/images/puzzle_3_meadow_01.svg",
            "/images/puzzle_3_meadow_02.svg",
            "/images/puzzle_3_meadow_03.svg",
            "/images/puzzle_3_meadow_04.svg",
          ],
          layout: "grid2x2",
          columns: 2,
          rows: 2,
          pieceWidth: 200,
          pieceHeight: 200,
          shuffleOrder: [2, 4, 1, 3],
        }
      }
    }

    switch (selectedSeason) {
      case "jesien":
        return {
          images: [
            "/images/puzzle-game/autumn_p1.png",
            "/images/puzzle-game/autumn_p2.png",
            "/images/puzzle-game/autumn_p3.png",
            "/images/puzzle-game/autumn_p4.png",
            "/images/puzzle-game/autumn_p5.png",
          ],
          layout: "horizontal",
          columns: 5,
          rows: 1,
          pieceWidth: 67,
          pieceHeight: 240,
          shuffleOrder: [1, 5, 2, 4, 3],
        }
      case "lato":
        return {
          images: [
            "/images/puzzle-game/playground_1.svg",
            "/images/puzzle-game/playground_2.svg",
            "/images/puzzle-game/playground_3.svg",
            "/images/puzzle-game/playground_4.svg",
            "/images/puzzle-game/playground_5.svg",
          ],
          layout: "horizontal",
          columns: 5,
          rows: 1,
          pieceWidth: 67,
          pieceHeight: 240,
          shuffleOrder: [1, 5, 2, 4, 3],
        }
      case "zima":
        return {
          images: [
            "/images/puzzle-game/winter_landscape_1.svg",
            "/images/puzzle-game/winter_landscape_2.svg",
            "/images/puzzle-game/winter_landscape_3.svg",
            "/images/puzzle-game/winter_landscape_4.svg",
            "/images/puzzle-game/winter_landscape_5.svg",
          ],
          layout: "horizontal",
          columns: 5,
          rows: 1,
          pieceWidth: 67,
          pieceHeight: 240,
          shuffleOrder: [1, 5, 2, 4, 3],
        }
      default:
        return {
          images: [
            "/images/puzzle_field_01.png",
            "/images/puzzle_field_02.png",
            "/images/puzzle_field_03.png",
            "/images/puzzle_field_04.png",
            "/images/puzzle_field_05.png",
          ],
          layout: "horizontal",
          columns: 5,
          rows: 1,
          pieceWidth: 67,
          pieceHeight: 240,
          shuffleOrder: [1, 5, 2, 4, 3],
        }
    }
  }, [selectedSeason, activeSpringVariant])
  const slotCount = puzzleConfig.images.length

  const createInitialPieces = useCallback(
    (images: string[]): PuzzlePiece[] =>
      images.map((image, index) => ({
        id: index + 1,
        image,
        correctPosition: index,
        currentPosition: null,
      })),
    [],
  )

  const [puzzlePieces, setPuzzlePieces] = useState<PuzzlePiece[]>(() => createInitialPieces(puzzleConfig.images))

  // Shuffle the pieces for initial display on the right
  const [shuffledPieces, setShuffledPieces] = useState<PuzzlePiece[]>([])

  // State for tracking if the puzzle is completed
  const [isCompleted, setIsCompleted] = useState(false)

  // State for tracking the current dragged piece
  const [draggedPiece, setDraggedPiece] = useState<number | null>(null)

  // State for success message
  const [successMessage, setSuccessMessage] = useState<string>("")

  // State to track if success message has been set (to prevent multiple random messages)
  const [hasSetSuccessMessage, setHasSetSuccessMessage] = useState(false)

  // Use the game completion hook
  const { recordCompletion, isLoggedIn, isHistoricallyCompleted } = useGameCompletionWithHistory("puzzle-game")

  useEffect(() => {
    const initialPieces = createInitialPieces(puzzleConfig.images)
    setPuzzlePieces(initialPieces)
    setIsCompleted(false)
    setSuccessMessage("")
    setHasSetSuccessMessage(false)
    setDraggedPiece(null)
  }, [puzzleConfig, createInitialPieces])

  // Initialize shuffled pieces
  useEffect(() => {
    const byId = new Map(puzzlePieces.map((piece) => [piece.id, piece]))
    const ordered = puzzleConfig.shuffleOrder
      .map((id) => byId.get(id))
      .filter((piece): piece is PuzzlePiece => Boolean(piece))
    const missing = puzzlePieces.filter((piece) => !puzzleConfig.shuffleOrder.includes(piece.id))
    setShuffledPieces([...ordered, ...missing])
  }, [puzzlePieces, puzzleConfig])

  const unlockedPositions = useMemo(() => {
    if (selectedSeason === "wiosna" && activeSpringVariant === 3) {
      // Variant 3 must be solved in strict order: top-left, trapezoid 2, trapezoid 3, bottom-right.
      const order = [0, 1, 2, 3]
      const nextIndex = order.find((position) => {
        const pieceAtPosition = puzzlePieces.find((piece) => piece.currentPosition === position)
        return !pieceAtPosition || pieceAtPosition.correctPosition !== position
      })
      return new Set(nextIndex !== undefined ? [nextIndex] : order)
    }

    return new Set(Array.from({ length: slotCount }, (_, i) => i))
  }, [slotCount, selectedSeason, activeSpringVariant, puzzlePieces])

  // Handle drag start
  const handleDragStart = (id: number) => {
    setDraggedPiece(id)
  }

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  // Handle drop
  const handleDrop = (e: React.DragEvent, position: number) => {
    e.preventDefault()

    if (draggedPiece === null) return

    // Check if this position is unlocked
    if (!unlockedPositions.has(position)) {
      return // Silently ignore drops on locked positions
    }

    const draggedPieceObj = puzzlePieces.find((piece) => piece.id === draggedPiece)
    if (!draggedPieceObj) return

    // Check if this is the correct position for this piece
    if (draggedPieceObj.correctPosition !== position) {
      return
    }

    const occupyingPiece = puzzlePieces.find((piece) => piece.currentPosition === position)

    const updatedPieces = puzzlePieces.map((piece) => {
      if (piece.id === draggedPiece) {
        return { ...piece, currentPosition: position }
      }
      if (occupyingPiece && piece.id === occupyingPiece.id) {
        return { ...piece, currentPosition: null }
      }
      return piece
    })

    setPuzzlePieces(updatedPieces)
    setDraggedPiece(null)

    const allCorrect = updatedPieces.every((piece) => piece.currentPosition === piece.correctPosition)
    if (allCorrect) {
      setIsCompleted(true)
      if (!hasSetSuccessMessage) {
        setSuccessMessage(getRandomSuccessMessage())
        setHasSetSuccessMessage(true)
      }

      if (isLoggedIn) {
        recordCompletion()
      }

      if (onComplete) {
        setTimeout(() => {
          onComplete()
        }, 3000)
      }
    }
  }

  // Reset the game
  const resetGame = () => {
    setPuzzlePieces((prevPieces) => prevPieces.map((piece) => ({ ...piece, currentPosition: null })))
    setIsCompleted(false)
    setSuccessMessage("")
    setHasSetSuccessMessage(false)
  }

  const pieceWidth = puzzleConfig.pieceWidth
  const pieceHeight = puzzleConfig.pieceHeight
  const isSpringVariant3 = selectedSeason === "wiosna" && activeSpringVariant === 3
  // Variant 3 should be compact and square-like.
  const boardWidth = isSpringVariant3 ? 200 : 335
  const boardHeight = isSpringVariant3 ? 200 : 240
  const totalWidth = boardWidth
  const totalHeight = boardHeight

  const variant3SlotMap = useMemo(
    () => [
      // Native SVG bounding boxes and final placement so puzzle parts touch.
      { left: 0, top: 0, width: 101, height: 101, zIndex: 3 }, // top-left triangle
      { left: 0, top: 0, width: 200, height: 200, zIndex: 1 }, // trapezoid 2
      { left: 0, top: 0, width: 200, height: 200, zIndex: 2 }, // trapezoid 3
      { left: 96, top: 96, width: 104, height: 104, zIndex: 4 }, // bottom-right triangle
    ],
    [],
  )

  const getSlotStyle = (position: number, isUnlocked: boolean): React.CSSProperties => {
    if (puzzleConfig.layout === "vertical") {
      return {
        position: "absolute",
        left: "0px",
        top: `${position * pieceHeight}px`,
        width: `${pieceWidth}px`,
        height: `${pieceHeight}px`,
        opacity: isUnlocked ? 1 : 0.5,
      }
    }

    if (puzzleConfig.layout === "grid2x2") {
      // Keep native SVG geometry by using original bounding boxes and overlap.
      const slot = variant3SlotMap[position]
      return {
        position: "absolute",
        left: `${slot.left}px`,
        top: `${slot.top}px`,
        width: `${slot.width}px`,
        height: `${slot.height}px`,
        zIndex: slot.zIndex,
        opacity: 1,
      }
    }

    const row = Math.floor(position / puzzleConfig.columns)
    const col = position % puzzleConfig.columns
    return {
      position: "absolute",
      left: `${col * pieceWidth}px`,
      top: `${row * pieceHeight}px`,
      width: `${pieceWidth}px`,
      height: `${pieceHeight}px`,
      opacity: isUnlocked ? 1 : 0.5,
    }
  }

  return (
    <div className="w-full max-w-6xl" style={{ backgroundColor: themeColors.backgroundColor }}>
      {/* Header with title */}
      <div className="w-full max-w-4xl mx-auto flex justify-between items-center mb-8">
        <div className="relative w-16 h-16">
          <SoundButtonEnhanced
            text="UŁÓŻ OBRAZEK."
            soundIcon={themeColors.soundIcon || "/images/sound_icon_dragon_page.svg"}
            size="xl"
            className="w-full h-full"
          />
        </div>

        <div className="relative h-24 w-80 md:w-[500px] flex items-center justify-center">
          <Image src={getTitleBox()} alt="Title box" fill className="object-contain" />
          <span className="relative z-10 text-white text-2xl md:text-3xl font-sour-gummy font-thin">UŁÓŻ OBRAZEK.</span>
        </div>

        <div className="relative w-16 h-16" onClick={onMenuClick}>
          <Image
            src={themeColors.menuIcon || "/placeholder.svg"}
            alt="Menu"
            fill
            className="object-contain cursor-pointer"
          />
        </div>
      </div>

      {/* Diagnostic variant selector (test-only helper; remove in production) */}
      {selectedSeason === "wiosna" && (
        <div className="w-full max-w-4xl mx-auto mb-4 p-3 rounded-lg bg-white/80 border border-[#3e459c]/20 flex items-center gap-3">
          <span className="text-sm font-medium text-[#3e459c]">Wariant (diagnostyka):</span>
          <select
            value={diagnosticSpringVariant}
            onChange={(e) => setDiagnosticSpringVariant(Number(e.target.value) as 0 | SpringPuzzleVariant)}
            className="px-2 py-1 text-sm border border-[#3e459c]/30 rounded-md bg-white text-[#3e459c]"
          >
            <option value={0}>Auto (losowo)</option>
            <option value={1}>Wariant 1</option>
            <option value={2}>Wariant 2 (z gory do dolu)</option>
            <option value={3}>Wariant 3 (trapezy i trojkaty)</option>
          </select>
          <span className="text-xs text-gray-600">Aktywny: {activeSpringVariant}</span>
        </div>
      )}

      {/* Game area */}
      <div className="flex justify-center items-center">
        <div className="flex flex-col">
          {/* Main game container */}
          <div className="flex items-start">
            {/* Single rectangular puzzle board - exact dimensions with no gaps */}
            <div
              key={`${selectedSeason}-${activeSpringVariant}-${puzzleConfig.layout}-board`}
              className="relative bg-white border-2 border-gray-300 rounded-md flex overflow-hidden"
              style={{ width: `${totalWidth}px`, height: `${totalHeight}px` }}
            >
              {/* Puzzle slots with no gaps between them */}
              {Array.from({ length: slotCount }, (_, position) => {
                const isUnlocked = unlockedPositions.has(position)
                const placedPiece = puzzlePieces.find((piece) => piece.currentPosition === position)
                const isSolvedSlot = Boolean(placedPiece && placedPiece.correctPosition === position)
                const canAcceptDrop = isUnlocked && !isSolvedSlot
                return (
                  <div
                    key={`slot-${position}`}
                    className="absolute"
                    style={{
                      ...getSlotStyle(position, isUnlocked),
                      // In overlapping layout, only current active slot should catch DnD events.
                      pointerEvents: canAcceptDrop ? "auto" : "none",
                    }}
                    onDragOver={canAcceptDrop ? handleDragOver : undefined}
                    onDrop={canAcceptDrop ? (e) => handleDrop(e, position) : undefined}
                  >
                    {/* Variant 3 slot placeholders: active slot white, other slots light gray */}
                    {puzzleConfig.layout === "grid2x2" && !placedPiece && (
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          backgroundColor: isUnlocked ? "#ffffff" : "#e5e5e5",
                          maskImage: `url(${puzzlePieces.find((p) => p.correctPosition === position)?.image || "/placeholder.svg"})`,
                          WebkitMaskImage: `url(${puzzlePieces.find((p) => p.correctPosition === position)?.image || "/placeholder.svg"})`,
                          maskRepeat: "no-repeat",
                          WebkitMaskRepeat: "no-repeat",
                          maskPosition: "center",
                          WebkitMaskPosition: "center",
                          maskSize: "contain",
                          WebkitMaskSize: "contain",
                        }}
                      >
                        {/* shape placeholder */}
                      </div>
                    )}

                    {/* Placed puzzle piece */}
                    {puzzlePieces.map(
                      (piece) =>
                        piece.currentPosition === position && (
                          <div
                            key={`placed-${piece.id}`}
                            className="absolute inset-0 w-full h-full"
                            style={{ padding: 0, margin: 0 }}
                          >
                            <Image
                              src={piece.image || "/placeholder.svg"}
                              alt={`Puzzle piece ${piece.id}`}
                              fill
                              style={{ objectFit: puzzleConfig.layout === "vertical" ? "fill" : "contain" }}
                              className="select-none"
                            />
                          </div>
                        ),
                    )}
                  </div>
                )
              })}
            </div>

            {/* Puzzle pieces tray */}
            <div
      key={`${selectedSeason}-${activeSpringVariant}-${puzzleConfig.layout}-tray`}
              className={`ml-6 ${
                puzzleConfig.layout === "vertical"
                  ? "flex flex-col gap-2"
                  : puzzleConfig.layout === "grid2x2"
                    ? "relative w-[320px] h-[220px]"
                    : "flex gap-1"
              }`}
            >
              {shuffledPieces.map((piece) => {
                // Only show pieces that aren't placed on the board
                const originalPiece = puzzlePieces.find((p) => p.id === piece.id)
                if (originalPiece && originalPiece.currentPosition !== null) return null

                if (puzzleConfig.layout === "grid2x2") {
                  const trayPositions: Record<number, React.CSSProperties> = {
                    // Scrambled reference arrangement: 2,4,1,3 with overlap.
                    2: { left: "0px", top: "16px", width: "156px", height: "156px", zIndex: 2 },
                    4: { left: "188px", top: "0px", width: "82px", height: "82px", zIndex: 4 },
                    1: { left: "106px", top: "104px", width: "79px", height: "79px", zIndex: 3 },
                    3: { left: "165px", top: "36px", width: "155px", height: "180px", zIndex: 1 },
                  }
                  const style = trayPositions[piece.id] || { left: "0px", top: "0px", width: `${pieceWidth}px`, height: `${pieceHeight}px`, zIndex: 1 }
                  return (
                    <div
                      key={`piece-${piece.id}`}
                      draggable
                      onDragStart={() => handleDragStart(piece.id)}
                      className="absolute cursor-grab"
                      style={style}
                    >
                      <Image
                        src={piece.image || "/placeholder.svg"}
                        alt={`Puzzle piece ${piece.id}`}
                        fill
                        style={{ objectFit: "contain" }}
                        className="select-none"
                      />
                    </div>
                  )
                }

                return (
                  <div
                    key={`piece-${piece.id}`}
                    draggable
                    onDragStart={() => handleDragStart(piece.id)}
                    className="relative cursor-grab"
                    style={{
                      width: `${pieceWidth}px`,
                      height: `${pieceHeight}px`,
                    }}
                  >
                    <Image
                      src={piece.image || "/placeholder.svg"}
                      alt={`Puzzle piece ${piece.id}`}
                      fill
                      style={{ objectFit: "contain" }}
                      className="select-none"
                    />
                  </div>
                )
              })}
            </div>
          </div>

          {/* Success message */}
          {isCompleted && successMessage && (
            <SuccessMessage message={successMessage} />
          )}

          {/* New Navigation Buttons */}
          <div className="flex justify-center gap-4 mt-8 w-full">
            {/* All buttons in same container with identical dimensions */}
            <div className="flex gap-4 items-end">
              {/* WRÓĆ Button - always available in puzzle-game */}
              <div 
                className="relative w-36 h-14 transition-all cursor-pointer hover:scale-105"
                onClick={onBack}
              >
                <Image 
                  src={themeColors.wrocDalejButton || "/images/wroc_dalej_wiosna.svg"} 
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



              {/* DALEJ Button - disabled when not completed or when completed and waiting for medal */}
              <div 
                className={`relative w-36 h-14 transition-all ${(userLoggedIn && !isGameCompleted && !isHistoricallyCompleted) || isCompleted ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-105'}`}
                onClick={(userLoggedIn && !isGameCompleted && !isHistoricallyCompleted) || isCompleted ? undefined : onNext}
              >
                <Image 
                  src={themeColors.wrocDalejButton || "/images/wroc_dalej_wiosna.svg"} 
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
    </div>
  )
}
