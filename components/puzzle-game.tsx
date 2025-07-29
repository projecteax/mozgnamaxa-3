"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useGameCompletion } from "@/hooks/use-game-completion"
import { getRandomSuccessMessage } from "@/lib/success-messages"
import { useSeason } from "@/contexts/season-context"

interface PuzzleGameProps {
  onMenuClick: () => void
}

interface PuzzlePiece {
  id: number
  image: string
  correctPosition: number
  currentPosition: number | null
}

export default function PuzzleGame({ onMenuClick }: PuzzleGameProps) {
  const { selectedSeason, getThemeColors } = useSeason()
  const themeColors = getThemeColors()

  // Get puzzle images based on season
  const getPuzzleImages = () => {
    switch (selectedSeason) {
      case "jesien":
        return [
          "/images/puzzle_field_01_autumn.png",
          "/images/puzzle_field_02_autumn.png",
          "/images/puzzle_field_03_autumn.png",
          "/images/puzzle_field_04_autumn.png",
          "/images/puzzle_field_05_autumn.png",
        ]
      case "lato":
        return [
          "/images/puzzle_field_01_summer.png",
          "/images/puzzle_field_02_summer.png",
          "/images/puzzle_field_03_summer.png",
          "/images/puzzle_field_04_summer.png",
          "/images/puzzle_field_05_summer.png",
        ]
      case "zima":
        return [
          "/images/puzzle_field_01_winter.png",
          "/images/puzzle_field_02_winter.png",
          "/images/puzzle_field_03_winter.png",
          "/images/puzzle_field_04_winter.png",
          "/images/puzzle_field_05_winter.png",
        ]
      default: // wiosna (spring)
        return [
          "/images/puzzle_field_01.png",
          "/images/puzzle_field_02.png",
          "/images/puzzle_field_03.png",
          "/images/puzzle_field_04.png",
          "/images/puzzle_field_05.png",
        ]
    }
  }

  // Define the puzzle pieces based on season
  const [puzzlePieces, setPuzzlePieces] = useState<PuzzlePiece[]>(() => {
    const images = getPuzzleImages()
    return [
      { id: 1, image: images[0], correctPosition: 0, currentPosition: null },
      { id: 2, image: images[1], correctPosition: 1, currentPosition: null },
      { id: 3, image: images[2], correctPosition: 2, currentPosition: null },
      { id: 4, image: images[3], correctPosition: 3, currentPosition: null },
      { id: 5, image: images[4], correctPosition: 4, currentPosition: null },
    ]
  })

  // Update puzzle pieces when season changes
  useEffect(() => {
    const images = getPuzzleImages()
    setPuzzlePieces([
      { id: 1, image: images[0], correctPosition: 0, currentPosition: null },
      { id: 2, image: images[1], correctPosition: 1, currentPosition: null },
      { id: 3, image: images[2], correctPosition: 2, currentPosition: null },
      { id: 4, image: images[3], correctPosition: 3, currentPosition: null },
      { id: 5, image: images[4], correctPosition: 4, currentPosition: null },
    ])
    setIsCompleted(false)
    setSuccessMessage("")
  }, [selectedSeason])

  // Shuffle the pieces for initial display on the right
  const [shuffledPieces, setShuffledPieces] = useState<PuzzlePiece[]>([])

  // State for tracking if the puzzle is completed
  const [isCompleted, setIsCompleted] = useState(false)

  // State for tracking the current dragged piece
  const [draggedPiece, setDraggedPiece] = useState<number | null>(null)

  // State for success message
  const [successMessage, setSuccessMessage] = useState<string>("")

  // Use the game completion hook
  const { recordCompletion, isLoggedIn } = useGameCompletion()

  // Piece dimensions - enlarged by 300% (3x the previous size)
  const pieceWidth = Math.round(112 * 0.2 * 5 * 0.2 * 3)
  const pieceHeight = Math.round(400 * 0.2 * 5 * 0.2 * 3)
  const totalWidth = pieceWidth * 5

  // Initialize shuffled pieces
  useEffect(() => {
    // Shuffle order: 1,5,2,4,3 as specified
    const shuffled = [
      { ...puzzlePieces[0] }, // 1
      { ...puzzlePieces[4] }, // 5
      { ...puzzlePieces[1] }, // 2
      { ...puzzlePieces[3] }, // 4
      { ...puzzlePieces[2] }, // 3
    ]
    setShuffledPieces(shuffled)
  }, [puzzlePieces])

  // Calculate which positions are unlocked
  const getUnlockedPositions = () => {
    const unlockedPositions = new Set<number>()

    // Always unlock position 0 (first slot)
    unlockedPositions.add(0)

    // Check each position in order and unlock the next one if current is filled
    for (let i = 0; i < 5; i++) {
      const isCurrentFilled = puzzlePieces.some((piece) => piece.currentPosition === i)
      if (isCurrentFilled && i < 4) {
        unlockedPositions.add(i + 1)
      }
    }

    return unlockedPositions
  }

  const unlockedPositions = getUnlockedPositions()

  // Handle drag start
  const handleDragStart = (id: number) => {
    setDraggedPiece(id)
  }

  // Handle drag over
  const handleDragOver = (e: React.DragEvent, position: number) => {
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

    // Find the piece that was dragged
    const draggedPieceObj = puzzlePieces.find((piece) => piece.id === draggedPiece)

    if (!draggedPieceObj) return

    // Check if this is the correct position for this piece
    if (draggedPieceObj.correctPosition !== position) {
      return // Silently ignore incorrect placements
    }

    // Check if this piece is already placed somewhere
    if (draggedPieceObj.currentPosition !== null) {
      // Remove it from its current position
      setPuzzlePieces((prevPieces) =>
        prevPieces.map((piece) => (piece.id === draggedPiece ? { ...piece, currentPosition: null } : piece)),
      )
    }

    // Check if the position is already occupied
    const occupyingPiece = puzzlePieces.find((piece) => piece.currentPosition === position)

    if (occupyingPiece) {
      // Swap positions
      setPuzzlePieces((prevPieces) =>
        prevPieces.map((piece) => {
          if (piece.id === draggedPiece) {
            return { ...piece, currentPosition: position }
          } else if (piece.id === occupyingPiece.id) {
            return { ...piece, currentPosition: null }
          }
          return piece
        }),
      )
    } else {
      // Place the piece in the empty position
      setPuzzlePieces((prevPieces) =>
        prevPieces.map((piece) => (piece.id === draggedPiece ? { ...piece, currentPosition: position } : piece)),
      )
    }

    setDraggedPiece(null)

    // Check if puzzle is completed
    setTimeout(() => {
      // Create updated pieces array to check completion
      const updatedPieces = puzzlePieces.map((piece) =>
        piece.id === draggedPiece ? { ...piece, currentPosition: position } : piece,
      )

      // Check if all pieces are in their correct positions
      const allCorrect = updatedPieces.every((piece) => piece.currentPosition === piece.correctPosition)

      console.log("Checking puzzle completion:", {
        pieces: updatedPieces.map((p) => ({ id: p.id, current: p.currentPosition, correct: p.correctPosition })),
        allCorrect,
      })

      if (allCorrect) {
        setIsCompleted(true)
        setSuccessMessage(getRandomSuccessMessage())
        console.log("🎉 Puzzle game completed! All pieces correctly placed!")

        // Record completion when game is finished
        if (isLoggedIn) {
          recordCompletion("puzzle-game")
        }
      }
    }, 100)
  }

  // Reset the game
  const resetGame = () => {
    setPuzzlePieces((prevPieces) => prevPieces.map((piece) => ({ ...piece, currentPosition: null })))
    setIsCompleted(false)
    setSuccessMessage("")
  }

  return (
    <div className="w-full max-w-6xl" style={{ backgroundColor: themeColors.backgroundColor }}>
      {/* Header with title */}
      <div className="w-full max-w-4xl mx-auto flex justify-between items-center mb-8">
        <div className="relative w-16 h-16">
          <Image
            src={themeColors.soundIcon || "/placeholder.svg"}
            alt="Sound"
            fill
            className="object-contain cursor-pointer"
          />
        </div>

        <div className="relative h-24 w-80 md:w-[500px] flex items-center justify-center">
          <Image src={themeColors.titleBox || "/placeholder.svg"} alt="Title box" fill className="object-contain" />
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

      {/* Game area */}
      <div className="flex justify-center items-center">
        <div className="flex flex-col">
          {/* Main game container */}
          <div className="flex items-center">
            {/* Single rectangular puzzle board - exact dimensions with no gaps */}
            <div
              className="relative bg-white border-2 border-gray-300 rounded-md flex overflow-hidden"
              style={{ width: `${totalWidth}px`, height: `${pieceHeight}px` }}
            >
              {/* Puzzle slots with no gaps between them */}
              {[0, 1, 2, 3, 4].map((position) => {
                const isUnlocked = unlockedPositions.has(position)
                return (
                  <div
                    key={`slot-${position}`}
                    className={`relative ${!isUnlocked ? "bg-gray-400 opacity-50" : ""}`}
                    style={{
                      width: `${pieceWidth}px`,
                      height: `${pieceHeight}px`,
                      padding: 0,
                      margin: 0,
                    }}
                    onDragOver={(e) => handleDragOver(e, position)}
                    onDrop={(e) => handleDrop(e, position)}
                  >
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
                              style={{ objectFit: "contain" }}
                              className="select-none"
                            />
                          </div>
                        ),
                    )}
                  </div>
                )
              })}
            </div>

            {/* Puzzle pieces in a single horizontal line */}
            <div className="flex ml-6">
              {shuffledPieces.map((piece) => {
                // Only show pieces that aren't placed on the board
                const originalPiece = puzzlePieces.find((p) => p.id === piece.id)
                if (originalPiece && originalPiece.currentPosition !== null) return null

                return (
                  <div
                    key={`piece-${piece.id}`}
                    draggable
                    onDragStart={() => handleDragStart(piece.id)}
                    className="relative cursor-grab"
                    style={{
                      width: `${pieceWidth}px`,
                      height: `${pieceHeight}px`,
                      marginRight: "4px",
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
            <div className="mt-6 text-center">
              <div className="bg-green-100 border-2 border-green-500 rounded-lg p-6 inline-block">
                <div className="text-green-800 text-3xl font-bold mb-2">🎉 {successMessage} 🎉</div>
              </div>
            </div>
          )}

          {/* Reset button - only visible when puzzle is completed */}
          {isCompleted && (
            <div className="flex justify-center mt-4">
              <button 
                onClick={resetGame} 
                className="text-white px-6 py-2 rounded-full font-sour-gummy text-lg shadow-lg hover:opacity-90 transition-opacity"
                style={{ backgroundColor: themeColors.buttonColor }}
              >
                Wstecz
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
