"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import Image from "next/image"
import { useGameCompletion } from "@/hooks/use-game-completion"
import { getRandomSuccessMessage } from "@/lib/success-messages"
import { useSeason } from "@/contexts/season-context"
import SuccessMessage from "./success-message"

interface PuzzleAssemblyGame2Props {
  onMenuClick: () => void
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

export default function PuzzleAssemblyGame2({ onMenuClick }: PuzzleAssemblyGame2Props) {
  const { selectedSeason, getThemeColors } = useSeason()
  const theme = getThemeColors()

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

  // Fixed dimensions based on SVG specifications - scaled to 80% (2.2 * 0.8 = 1.76)
  const [puzzlePieces, setPuzzlePieces] = useState<PuzzlePiece[]>([
    {
      id: "puzzle_01",
      src: getPuzzlePiecePath(seasonSuffix, "01"),
      correctTarget: "empty_01",
      placed: false,
      width: 56.41 * 1.76, // 99.28
      height: 123.49 * 1.76, // 217.34
    },
    {
      id: "puzzle_02",
      src: getPuzzlePiecePath(seasonSuffix, "02"),
      correctTarget: "empty_02",
      placed: false,
      width: 142.05 * 1.76, // 250.01
      height: 200 * 1.76, // 352
    },
    {
      id: "puzzle_03",
      src: getPuzzlePiecePath(seasonSuffix, "03"),
      correctTarget: "empty_03",
      placed: false,
      width: 149.32 * 1.76, // 262.80
      height: 200 * 1.76, // 352
    },
    {
      id: "puzzle_04",
      src: getPuzzlePiecePath(seasonSuffix, "04"),
      correctTarget: "empty_04",
      placed: false,
      width: 65.87 * 1.76, // 115.93
      height: 144.17 * 1.76, // 253.74
    },
  ])

  // Drop areas with precise positioning and shape definitions - scaled to 80%
  const [dropAreas, setDropAreas] = useState<DropArea[]>([
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
      active: true, // First zone starts active
    },
    {
      id: "empty_02",
      src: "/images/empty_assembly_02_red.svg",
      filled: false,
      width: 142.05 * 1.76,
      height: 200 * 1.76,
      x: 0,
      y: 0,
      shape: "rectangle",
      active: false, // Initially inactive
    },
    {
      id: "empty_03",
      src: "/images/empty_assembly_03_yellow.svg",
      filled: false,
      width: 149.32 * 1.76,
      height: 200 * 1.76,
      x: (200 - 149.32) * 1.76,
      y: 0,
      shape: "rectangle",
      active: false, // Initially inactive
    },
    {
      id: "empty_04",
      src: "/images/empty_assembly_04_green.svg",
      filled: false,
      width: 65.87 * 1.76,
      height: 144.17 * 1.76,
      x: (200 - 65.87) * 1.76,
      y: (200 - 144.17) * 1.76,
      shape: "triangle",
      trianglePoints: [
        { x: 65.87 * 1.76, y: 0 },
        { x: 65.87 * 1.76, y: 144.17 * 1.76 },
        { x: 0, y: 144.17 * 1.76 },
      ],
      active: false, // Initially inactive
    },
  ])

  const [draggedPiece, setDraggedPiece] = useState<string | null>(null)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string>("")
  const [placedPieces, setPlacedPieces] = useState<{ [key: string]: { x: number; y: number } }>({})
  const [activeDropZone, setActiveDropZone] = useState<number>(0) // 0-based index

  // Use the game completion hook
  const { recordCompletion, isLoggedIn } = useGameCompletion()

  const dragRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const dropAreaRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  // Puzzle order for display: 02, 04, 03, 01
  const puzzleDisplayOrder = ["puzzle_02", "puzzle_04", "puzzle_03", "puzzle_01"]

  // Function to check if a point is inside a triangle using barycentric coordinates
  const isPointInTriangle = useCallback(
    (point: { x: number; y: number }, triangle: { x: number; y: number }[]): boolean => {
      const [p1, p2, p3] = triangle
      const denom = (p2.y - p3.y) * (p1.x - p3.x) + (p3.x - p2.x) * (p1.y - p3.y)
      const a = ((p2.y - p3.y) * (point.x - p3.x) + (p3.x - p2.x) * (point.y - p3.y)) / denom
      const b = ((p3.y - p1.y) * (point.x - p3.x) + (p1.x - p3.x) * (point.y - p3.y)) / denom
      const c = 1 - a - b

      return a >= 0 && b >= 0 && c >= 0
    },
    [],
  )

  // Function to check if a point is inside a rectangle
  const isPointInRectangle = useCallback(
    (point: { x: number; y: number }, rect: { x: number; y: number; width: number; height: number }): boolean => {
      return point.x >= rect.x && point.x <= rect.x + rect.width && point.y >= rect.y && point.y <= rect.y + rect.height
    },
    [],
  )

  const getDropAreaUnderCursor = useCallback(
    (clientX: number, clientY: number): string | null => {
      // Get the drop box container position
      const dropBoxElement = dropAreaRefs.current["container"]
      if (!dropBoxElement) return null

      const dropBoxRect = dropBoxElement.getBoundingClientRect()
      const relativeX = clientX - dropBoxRect.left
      const relativeY = clientY - dropBoxRect.top

      // Check if cursor is within the scaled drop box (352x352)
      if (relativeX < 0 || relativeX > 352 || relativeY < 0 || relativeY > 352) {
        return null
      }

      // Check each drop area with proper shape detection - only active areas
      const areasToCheck = [...dropAreas]
        .filter((area) => !area.filled && area.active) // Only check active areas
        .sort((a, b) => {
          // Prioritize triangles over rectangles, then by size
          if (a.shape === "triangle" && b.shape === "rectangle") return -1
          if (a.shape === "rectangle" && b.shape === "triangle") return 1
          return a.width * a.height - b.width * b.height
        })

      for (const area of areasToCheck) {
        const areaPoint = { x: relativeX - area.x, y: relativeY - area.y }

        if (area.shape === "triangle" && area.trianglePoints) {
          if (isPointInTriangle(areaPoint, area.trianglePoints)) {
            return area.id
          }
        } else if (area.shape === "rectangle") {
          if (isPointInRectangle(areaPoint, { x: 0, y: 0, width: area.width, height: area.height })) {
            return area.id
          }
        }
      }

      return null
    },
    [dropAreas, isPointInTriangle, isPointInRectangle],
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
      const updated = prev.map((dropArea) => (dropArea.id === targetAreaId ? { ...dropArea, filled: true } : dropArea))

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
          recordCompletion("puzzle-assembly-2")
        }
      }, 500)
    }
  }

  const resetGame = () => {
    // Update puzzle pieces with current season
    setPuzzlePieces([
      {
        id: "puzzle_01",
        src: getPuzzlePiecePath(seasonSuffix, "01"),
        correctTarget: "empty_01",
        placed: false,
        width: 56.41 * 1.76,
        height: 123.49 * 1.76,
      },
      {
        id: "puzzle_02",
        src: getPuzzlePiecePath(seasonSuffix, "02"),
        correctTarget: "empty_02",
        placed: false,
        width: 142.05 * 1.76,
        height: 200 * 1.76,
      },
      {
        id: "puzzle_03",
        src: getPuzzlePiecePath(seasonSuffix, "03"),
        correctTarget: "empty_03",
        placed: false,
        width: 149.32 * 1.76,
        height: 200 * 1.76,
      },
      {
        id: "puzzle_04",
        src: getPuzzlePiecePath(seasonSuffix, "04"),
        correctTarget: "empty_04",
        placed: false,
        width: 65.87 * 1.76,
        height: 144.17 * 1.76,
      },
    ])
    setDropAreas((prev) => prev.map((a, index) => ({ ...a, filled: false, active: index === 0 }))) // Only first zone active
    setPlacedPieces({})
    setGameCompleted(false)
    setDraggedPiece(null)
    setSuccessMessage("")
    setActiveDropZone(0)
  }

  return (
    <div className="w-full max-w-6xl">
      {/* Header with title - matching the matching-game style */}
      <div className="w-full flex justify-between items-center mb-8">
        <div className="relative w-16 h-16">
          <Image
            src={theme.soundIcon || "/placeholder.svg"}
            alt="Sound"
            fill
            className="object-contain cursor-pointer"
            style={{
              filter: "drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3))",
            }}
          />
        </div>

        <div className="relative h-24 w-80 md:w-[500px] flex items-center justify-center">
          <Image src={theme.titleBox || "/placeholder.svg"} alt="Title box" fill className="object-contain" />
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
          <div className="flex flex-col items-center">
            <SuccessMessage message={successMessage} />
            <button
              onClick={resetGame}
              className="bg-[#539e1b] text-white px-6 py-3 rounded-full font-sour-gummy text-lg hover:bg-[#468619] transition-colors"
            >
              Zagraj ponownie
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full flex items-start">
          {/* Left Side - Drop Zone aligned with sound icon - scaled to 80% */}
          <div className="flex-shrink-0" style={{ marginLeft: "0px" }}>
            <div
              ref={(el) => {
                dropAreaRefs.current["container"] = el
              }}
              className="relative bg-white"
              style={{ width: "352px", height: "352px" }}
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
                    left: `${area.x}px`,
                    top: `${area.y}px`,
                    width: `${area.width}px`,
                    height: `${area.height}px`,
                    zIndex: area.shape === "triangle" ? 30 : 20,
                  }}
                >
                  {/* Show only the colored shapes - white for active, grey for inactive */}
                  <div className="relative w-full h-full">
                    <Image
                      src={area.src || "/placeholder.svg"}
                      alt={`Drop area ${area.id}`}
                      fill
                      className="object-contain"
                      style={{
                        filter: area.active ? "brightness(0) invert(1)" : "brightness(0) invert(0.5)",
                      }}
                    />
                  </div>
                </div>
              ))}

              {/* Placed puzzle pieces - rendered within the drop box */}
              {Object.entries(placedPieces).map(([pieceId, position]) => {
                const piece = puzzlePieces.find((p) => p.id === pieceId)
                if (!piece || !piece.placed) return null

                return (
                  <div
                    key={`placed-${pieceId}`}
                    className="absolute pointer-events-none"
                    style={{
                      left: `${position.x}px`,
                      top: `${position.y}px`,
                      width: `${piece.width}px`,
                      height: `${piece.height}px`,
                      zIndex: 40, // Placed pieces on top
                    }}
                  >
                    <Image
                      src={piece.src || "/placeholder.svg"}
                      alt={`Placed ${pieceId}`}
                      fill
                      className="object-contain"
                    />
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Side - Puzzle Pieces with closer spacing and within horizontal bounds */}
          <div className="flex-1 flex justify-start" style={{ marginLeft: "60px" }}>
            <div className="flex items-end gap-3" style={{ height: "352px", maxWidth: "480px" }}>
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
    </div>
  )
}
