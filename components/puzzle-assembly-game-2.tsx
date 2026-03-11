"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import Image from "next/image"
import { useGameCompletionWithHistory } from "@/hooks/use-game-completion"
import { getRandomSuccessMessage } from "@/lib/success-messages"
import { useSeason } from "@/contexts/season-context"
import SuccessMessage from "./success-message"
import SoundButtonEnhanced from "./sound-button-enhanced"

interface PuzzleAssemblyGame2Props {
  onMenuClick: () => void
  onBack?: () => void
  onNext?: () => void
  onRetry?: () => void
  userLoggedIn?: boolean
  currentSeason?: string
  isGameCompleted?: boolean
}

interface PuzzlePiece {
  id: string
  src: string
  correctTarget: string
  placed: boolean
  width: number
  height: number
}

interface DropArea {
  id: string
  src: string
  filled: boolean
  width: number
  height: number
  x: number
  y: number
  shape: "rectangle" | "triangle"
  trianglePoints?: { x: number; y: number }[]
  active: boolean
}

type SpringPuzzleAssemblyVariant = 1 | 2 | 3

export default function PuzzleAssemblyGame2({ onMenuClick, onBack, onNext, onRetry, userLoggedIn = false, currentSeason = "wiosna", isGameCompleted = false }: PuzzleAssemblyGame2Props) {
  const { selectedSeason, getThemeColors } = useSeason()
  const theme = getThemeColors()
  const [diagnosticSpringVariant, setDiagnosticSpringVariant] = useState<0 | SpringPuzzleAssemblyVariant>(0)
  const [randomSpringVariant] = useState<SpringPuzzleAssemblyVariant>(() => (Math.floor(Math.random() * 3) + 1) as SpringPuzzleAssemblyVariant)
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

  // Map season keys to file suffixes
  const getSeasonSuffix = (season: string) => {
    switch (season) {
      case "lato":
        return "summer"
      case "jesien":
        return "autumn"
      case "zima":
        return "winter"
      default:
        return "spring" // Changed from "summer" to "spring"
    }
  }

  const seasonSuffix = getSeasonSuffix(selectedSeason)

  // Helper function to get the correct completed puzzle image path
  const getCompletedPuzzlePath = (suffix: string) => {
    if (suffix === "spring") {
      return "/images/completed_puzzle.svg" // Use the generic completed puzzle for spring
    }
    if (suffix === "winter") {
      return "/images/puzzle_farm_winter_completed.svg"
    }
    return `/images/puzzle_farm_${suffix}_completed.svg`
  }

  // Helper function to get the correct puzzle piece path
  const getPuzzlePiecePath = (suffix: string, pieceNumber: string) => {
    if (suffix === "spring") {
      return `/images/puzzle_assembly_${pieceNumber}.svg` // Use puzzle_assembly prefix for spring
    }
    if (suffix === "winter") {
      return `/images/puzzle_farm_${pieceNumber}_winter.svg`
    }
    return `/images/puzzle_farm_${suffix}_${pieceNumber}.svg`
  }

  const SCALE = 1.7
  const isSpringStripVariant = selectedSeason === "wiosna" && (activeSpringVariant === 2 || activeSpringVariant === 3)

  const boardWidth = useMemo(() => {
    if (!isSpringStripVariant) return 352
    // Tight per-variant width from interlock endpoints (avoid extra right margin box)
    return activeSpringVariant === 2 ? 344 : 343
  }, [isSpringStripVariant, activeSpringVariant])

  const boardHeight = useMemo(() => {
    if (!isSpringStripVariant) return 352
    return Math.round(200 * SCALE)
  }, [isSpringStripVariant])

  const [puzzlePieces, setPuzzlePieces] = useState<PuzzlePiece[]>([])
  const [dropAreas, setDropAreas] = useState<DropArea[]>([])
  const [puzzleDisplayOrder, setPuzzleDisplayOrder] = useState<string[]>([])

  const [draggedPiece, setDraggedPiece] = useState<string | null>(null)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string>("")
  const [placedPieces, setPlacedPieces] = useState<{ [key: string]: { x: number; y: number } }>({})

  // Use the game completion hook with automatic historical completion refresh
  const { recordCompletion, isLoggedIn, isHistoricallyCompleted } = useGameCompletionWithHistory("puzzle-assembly-game-2")

  const dragRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const dropAreaRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  const initializeGame = useCallback(() => {
    if (isSpringStripVariant) {
      const px = (value: number) => Math.round(value * SCALE)
      const stripDefs =
        activeSpringVariant === 2
          ? [
              { id: "puzzle_01", src: "/images/puzzle_assembly2_v2_01.svg", width: px(45), height: px(200), x: px(0) },
              { id: "puzzle_02", src: "/images/puzzle_assembly2_v2_02.svg", width: px(64), height: px(200), x: px(31) - 1 },
              { id: "puzzle_03", src: "/images/puzzle_assembly2_v2_03.svg", width: px(116), height: px(200), x: px(71) - 2 },
              { id: "puzzle_04", src: "/images/puzzle_assembly2_v2_04.svg", width: px(94), height: px(200), x: px(110) - 3 },
            ]
          : [
              { id: "puzzle_01", src: "/images/puzzle_assembly2_v3_01.svg", width: px(64), height: px(200), x: px(0) },
              { id: "puzzle_02", src: "/images/puzzle_assembly2_v3_02.svg", width: px(63), height: px(200), x: px(47) - 1 },
              { id: "puzzle_03", src: "/images/puzzle_assembly2_v3_03.svg", width: px(66), height: px(200), x: px(102) - 2 },
              { id: "puzzle_04", src: "/images/puzzle_assembly2_v3_04.svg", width: px(72), height: px(200), x: px(132) - 3 },
            ]

      const nextPieces: PuzzlePiece[] = stripDefs.map((piece, index) => ({
        id: piece.id,
        src: piece.src,
        correctTarget: `empty_0${index + 1}`,
        placed: false,
        width: piece.width,
        height: piece.height,
      }))
      const nextDropAreas: DropArea[] = stripDefs.map((piece, index) => {
        const zone: DropArea = {
          id: `empty_0${index + 1}`,
          src: piece.src,
          filled: false,
          width: piece.width,
          height: piece.height,
          x: piece.x,
          y: 0,
          shape: "rectangle",
          active: index === 0,
        }
        return zone
      })
      setPuzzlePieces(nextPieces)
      setDropAreas(nextDropAreas)
      setPuzzleDisplayOrder([...nextPieces.map((piece) => piece.id)].sort(() => Math.random() - 0.5))
    } else {
      const nextPieces: PuzzlePiece[] = [
        { id: "puzzle_01", src: getPuzzlePiecePath(seasonSuffix, "01"), correctTarget: "empty_01", placed: false, width: 56.41 * 1.76, height: 123.49 * 1.76 },
        { id: "puzzle_02", src: getPuzzlePiecePath(seasonSuffix, "02"), correctTarget: "empty_02", placed: false, width: 142.05 * 1.76, height: 200 * 1.76 },
        { id: "puzzle_03", src: getPuzzlePiecePath(seasonSuffix, "03"), correctTarget: "empty_03", placed: false, width: 149.32 * 1.76, height: 200 * 1.76 },
        { id: "puzzle_04", src: getPuzzlePiecePath(seasonSuffix, "04"), correctTarget: "empty_04", placed: false, width: 65.87 * 1.76, height: 144.17 * 1.76 },
      ]
      const nextDropAreas: DropArea[] = [
        {
          id: "empty_01",
          src: "/images/empty_assembly_01_blue.svg",
          filled: false,
          width: 56.41 * 1.76,
          height: 123.49 * 1.76,
          x: 0,
          y: 0,
          shape: "triangle",
          trianglePoints: [
            { x: 0, y: 0 },
            { x: 56.41 * 1.76, y: 0 },
            { x: 0, y: 123.49 * 1.76 },
          ],
          active: true,
        },
        { id: "empty_02", src: "/images/empty_assembly_02_red.svg", filled: false, width: 142.05 * 1.76, height: 200 * 1.76, x: -1, y: 0, shape: "rectangle", active: false },
        { id: "empty_03", src: "/images/empty_assembly_03_yellow.svg", filled: false, width: 149.32 * 1.76, height: 200 * 1.76, x: Math.round((200 - 149.32) * 1.76) - 2, y: 0, shape: "rectangle", active: false },
        {
          id: "empty_04",
          src: "/images/empty_assembly_04_green.svg",
          filled: false,
          width: 65.87 * 1.76,
          height: 144.17 * 1.76,
          x: Math.round((200 - 65.87) * 1.76) - 3,
          y: Math.round((200 - 144.17) * 1.76),
          shape: "triangle",
          trianglePoints: [
            { x: 65.87 * 1.76, y: 0 },
            { x: 65.87 * 1.76, y: 144.17 * 1.76 },
            { x: 0, y: 144.17 * 1.76 },
          ],
          active: false,
        },
      ]
      setPuzzlePieces(nextPieces)
      setDropAreas(nextDropAreas)
      setPuzzleDisplayOrder(["puzzle_02", "puzzle_04", "puzzle_03", "puzzle_01"])
    }

    setPlacedPieces({})
    setGameCompleted(false)
    setDraggedPiece(null)
    setSuccessMessage("")
  }, [isSpringStripVariant, activeSpringVariant, seasonSuffix])

  useEffect(() => {
    initializeGame()
  }, [initializeGame])

  const isPointInTriangle = useCallback((point: { x: number; y: number }, triangle: { x: number; y: number }[]) => {
    const [p1, p2, p3] = triangle
    const denom = (p2.y - p3.y) * (p1.x - p3.x) + (p3.x - p2.x) * (p1.y - p3.y)
    const a = ((p2.y - p3.y) * (point.x - p3.x) + (p3.x - p2.x) * (point.y - p3.y)) / denom
    const b = ((p3.y - p1.y) * (point.x - p3.x) + (p1.x - p3.x) * (point.y - p3.y)) / denom
    const c = 1 - a - b
    return a >= 0 && b >= 0 && c >= 0
  }, [])

  const getDropAreaUnderCursor = useCallback(
    (clientX: number, clientY: number): string | null => {
      // Get the drop box container position
      const dropBoxElement = dropAreaRefs.current["container"]
      if (!dropBoxElement) return null

      const dropBoxRect = dropBoxElement.getBoundingClientRect()
      const relativeX = clientX - dropBoxRect.left
      const relativeY = clientY - dropBoxRect.top

      if (relativeX < 0 || relativeX > boardWidth || relativeY < 0 || relativeY > boardHeight) {
        return null
      }

      const activeArea = dropAreas.find((area) => !area.filled && area.active)
      if (!activeArea) return null
      const localPoint = { x: relativeX - activeArea.x, y: relativeY - activeArea.y }
      if (activeArea.shape === "triangle" && activeArea.trianglePoints) {
        return isPointInTriangle(localPoint, activeArea.trianglePoints) ? activeArea.id : null
      }
      const isWithinRect = localPoint.x >= 0 && localPoint.x <= activeArea.width && localPoint.y >= 0 && localPoint.y <= activeArea.height
      return isWithinRect ? activeArea.id : null

    },
    [dropAreas, boardWidth, boardHeight, isPointInTriangle],
  )

  const handleDragStart = (e: React.DragEvent, pieceId: string) => {
    setDraggedPiece(pieceId)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", pieceId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    // No highlighting during drag
  }

  const handleDragLeave = (e: React.DragEvent) => {
    // No highlighting to clear
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()

    if (!draggedPiece) return

    // Get the target area ID with geometric detection
    const targetAreaId = getDropAreaUnderCursor(e.clientX, e.clientY)
    if (!targetAreaId) return

    const piece = puzzlePieces.find((p) => p.id === draggedPiece)
    const area = dropAreas.find((a) => a.id === targetAreaId)

    if (!piece || !area || piece.correctTarget !== targetAreaId || !area.active) {
      setDraggedPiece(null)
      return
    }

    // Update puzzle pieces
    setPuzzlePieces((prev) => prev.map((p) => (p.id === draggedPiece ? { ...p, placed: true } : p)))

    // Update drop areas and activate next zone
    setDropAreas((prev) => {
      const updated = prev.map((dropArea) =>
        dropArea.id === targetAreaId ? { ...dropArea, filled: true, active: false } : dropArea,
      )

      // Activate next drop zone based on the order: empty_01 -> empty_02 -> empty_03 -> empty_04
      const dropOrder = ["empty_01", "empty_02", "empty_03", "empty_04"]
      const currentIndex = dropOrder.indexOf(targetAreaId)
      if (currentIndex !== -1 && currentIndex < dropOrder.length - 1) {
        const nextDropId = dropOrder[currentIndex + 1]
        return updated.map((dropArea) => (dropArea.id === nextDropId ? { ...dropArea, active: true } : dropArea))
      }

      return updated
    })

    // Store the position where the piece was placed
    setPlacedPieces((prev) => ({
      ...prev,
      [draggedPiece]: { x: area.x, y: area.y },
    }))

    setDraggedPiece(null)

    // Check if game is completed
    const updatedPieces = puzzlePieces.map((p) => (p.id === draggedPiece ? { ...p, placed: true } : p))

    if (updatedPieces.every((piece) => piece.placed)) {
      setTimeout(() => {
        setGameCompleted(true)
        setSuccessMessage(getRandomSuccessMessage())
        // Record completion when game is finished
        if (isLoggedIn) {
          recordCompletion()
        }
      }, 500)
    }
  }

  const resetGame = () => {
    initializeGame()
  }

  return (
    <div className="w-full max-w-6xl">
      {/* Header with title - matching the matching-game style */}
      <div className="w-full flex justify-between items-center mb-8">
        <div className="relative w-16 h-16">
          <SoundButtonEnhanced
            text="UŁÓŻ OBRAZEK."
            soundIcon={theme.soundIcon || "/images/sound_icon_dragon_page.svg"}
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
            src={theme.menuIcon || "/placeholder.svg"}
            alt="Menu"
            fill
            className="object-contain cursor-pointer"
            style={{
              filter: "drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3))",
            }}
          />
        </div>
      </div>

      {selectedSeason === "wiosna" && (
        <div className="w-full max-w-4xl mx-auto mb-4 p-3 rounded-lg bg-white/80 border border-[#3e459c]/20 flex items-center gap-3">
          <span className="text-sm font-medium text-[#3e459c]">Wariant (diagnostyka):</span>
          <select
            value={diagnosticSpringVariant}
            onChange={(e) => setDiagnosticSpringVariant(Number(e.target.value) as 0 | SpringPuzzleAssemblyVariant)}
            className="px-2 py-1 text-sm border border-[#3e459c]/30 rounded-md bg-white text-[#3e459c]"
          >
            <option value={0}>Auto (losowo)</option>
            <option value={1}>Wariant 1</option>
            <option value={2}>Wariant 2</option>
            <option value={3}>Wariant 3</option>
          </select>
          <span className="text-xs text-gray-600">Aktywny: {activeSpringVariant}</span>
        </div>
      )}

      {/* Game Content - Show completed puzzle when game is finished */}
      {gameCompleted ? (
        <div className="w-full flex flex-col items-center">
          {/* Completed Puzzle Image - centered horizontally */}
          <div className="relative w-[400px] h-[400px] mb-8">
            <Image
              src={getCompletedPuzzlePath(seasonSuffix) || "/placeholder.svg"}
              alt="Completed puzzle"
              fill
              className="object-contain"
            />
          </div>

          {/* Success Message */}
          <SuccessMessage message={successMessage} />
        </div>
      ) : (
        <div className="w-full flex items-start">
          {/* Left Side - Drop Zone aligned with sound icon - scaled to 80% */}
          <div className="flex-shrink-0" style={{ marginLeft: "0px" }}>
            <div
              ref={(el) => {
                dropAreaRefs.current["container"] = el
              }}
              className="relative"
              style={{
                width: `${boardWidth}px`,
                height: `${boardHeight}px`,
                backgroundColor: isSpringStripVariant ? "#b8b8b8" : "#ffffff",
              }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {/* Drop Areas with dynamic coloring based on active state */}
              {dropAreas.map((area) => (
                <div
                  key={area.id}
                  ref={(el) => {
                    dropAreaRefs.current[area.id] = el
                  }}
                  className="absolute pointer-events-none"
                  style={{
                    left: `${Math.round(area.x)}px`,
                    top: `${Math.round(area.y)}px`,
                    width: `${Math.round(area.width)}px`,
                    height: `${Math.round(area.height)}px`,
                    zIndex: 20,
                    margin: 0,
                    padding: 0,
                    border: 'none',
                  }}
                >
                  {isSpringStripVariant ? (
                    <div
                      className="w-full h-full"
                      style={{
                        backgroundColor: !area.filled && area.active ? "#ffffff" : "#b8b8b8",
                        WebkitMaskImage: `url(${area.src})`,
                        maskImage: `url(${area.src})`,
                        WebkitMaskSize: "100% 100%",
                        maskSize: "100% 100%",
                        WebkitMaskRepeat: "no-repeat",
                        maskRepeat: "no-repeat",
                      }}
                    />
                  ) : (
                    <Image
                      src={area.src || "/placeholder.svg"}
                      alt={`Drop area ${area.id}`}
                      fill
                      className="object-contain"
                      style={{
                        filter: area.active ? "brightness(0) invert(1)" : "brightness(0) invert(0.5)",
                      }}
                    />
                  )}
                </div>
              ))}

              {/* Placed puzzle pieces - rendered within the drop box */}
              {Object.entries(placedPieces).map(([pieceId, position]) => {
                const piece = puzzlePieces.find((p) => p.id === pieceId)
                if (!piece || !piece.placed) return null
                const pieceNumber = Number(pieceId.split("_")[1] || "1")
                const overlapShift = isSpringStripVariant && pieceNumber > 1 ? 1 : 0

                return (
                  <div
                    key={`placed-${pieceId}`}
                    className="absolute pointer-events-none"
                    style={{
                      left: `${position.x - overlapShift}px`,
                      top: `${position.y}px`,
                      width: `${piece.width + overlapShift}px`,
                      height: `${piece.height}px`,
                      zIndex: 40, // Placed pieces on top
                      margin: 0,
                      padding: 0,
                      border: 'none',
                    }}
                  >
                    <Image
                      src={piece.src || "/placeholder.svg"}
                      alt={`Placed ${pieceId}`}
                      fill
                      className="object-contain"
                      style={{
                        margin: 0,
                        padding: 0,
                      }}
                    />
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Side - Puzzle Pieces with closer spacing and within horizontal bounds */}
          <div className="flex-1 flex justify-start" style={{ marginLeft: "60px" }}>
            <div className="flex items-end gap-3" style={{ height: `${boardHeight}px`, maxWidth: "520px" }}>
              {puzzleDisplayOrder.map((pieceId) => {
                const piece = puzzlePieces.find((p) => p.id === pieceId)
                if (!piece) return null

                return (
                  <div key={pieceId} className="flex flex-col justify-end">
                    {!piece.placed ? (
                      <div
                        ref={(el) => {
                          dragRefs.current[piece.id] = el
                        }}
                        className={`relative cursor-move transition-transform duration-200 ${
                          draggedPiece === piece.id ? "scale-105 rotate-1 z-50" : ""
                        }`}
                        style={{
                          width: `${piece.width}px`,
                          height: `${piece.height}px`,
                        }}
                        draggable={true}
                        onDragStart={(e) => handleDragStart(e, piece.id)}
                      >
                        <Image
                          src={piece.src || "/placeholder.svg"}
                          alt={`Puzzle piece ${piece.id}`}
                          fill
                          className="object-contain drop-shadow-md"
                          draggable={false}
                        />
                      </div>
                    ) : (
                      <div
                        style={{
                          width: `${piece.width}px`,
                          height: `${piece.height}px`,
                        }}
                        className="opacity-20"
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* New Navigation Buttons - Always visible */}
      <div className="flex justify-center gap-4 mt-8 w-full">
        {/* All buttons in same container with identical dimensions */}
        <div className="flex gap-4 items-end">
          {/* WRÓĆ Button - always available in puzzle-assembly-game-2 */}
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



          {/* DALEJ Button - only unlocked when game completed (for logged users) or always available (for non-logged users) */}
          <div 
            className={`relative w-36 h-14 transition-all ${(userLoggedIn && !gameCompleted && !isHistoricallyCompleted) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-105'}`}
            onClick={(userLoggedIn && !gameCompleted && !isHistoricallyCompleted) ? undefined : onNext}
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
