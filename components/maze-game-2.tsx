"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { getRandomSuccessMessage } from "@/lib/success-messages"

interface MazeGame2Props {
  onMenuClick: () => void
}

export default function MazeGame2({ onMenuClick }: MazeGame2Props) {
  // State to track if the game is completed
  const [isCompleted, setIsCompleted] = useState(false)
  // State for feedback message
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)
  // State for success message
  const [successMessage, setSuccessMessage] = useState<string>("")
  // Reference to the stork element
  const storkRef = useRef<HTMLDivElement>(null)
  // Reference to the top nest element (target for this game)
  const topNestRef = useRef<HTMLDivElement>(null)
  // Reference to the game container
  const gameContainerRef = useRef<HTMLDivElement>(null)
  // Initial stork position
  const initialPosition = { x: 100, y: 300 }
  // Current stork position
  const [storkPosition, setStorkPosition] = useState(initialPosition)
  // Track if we're dragging
  const [isDragging, setIsDragging] = useState(false)
  // Track mouse offset for dragging
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  // Handle mouse down on stork
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isCompleted) return

    // Calculate offset from mouse position to stork top-left corner
    if (storkRef.current) {
      const rect = storkRef.current.getBoundingClientRect()
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
      setIsDragging(true)
      setFeedbackMessage(null)
    }

    e.preventDefault()
  }

  // Handle mouse move
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || isCompleted) return

    if (gameContainerRef.current) {
      const containerRect = gameContainerRef.current.getBoundingClientRect()
      setStorkPosition({
        x: e.clientX - containerRect.left - dragOffset.x,
        y: e.clientY - containerRect.top - dragOffset.y,
      })
    }

    e.preventDefault()
  }

  // Handle mouse up
  const handleMouseUp = (e: MouseEvent) => {
    if (!isDragging || isCompleted) return

    setIsDragging(false)

    // Check if stork is dropped on the top nest
    if (topNestRef.current && gameContainerRef.current) {
      const nestRect = topNestRef.current.getBoundingClientRect()
      const containerRect = gameContainerRef.current.getBoundingClientRect()

      // Get mouse position relative to container
      const mouseX = e.clientX - containerRect.left
      const mouseY = e.clientY - containerRect.top

      // Check if mouse is over the nest
      const isOverNest =
        mouseX >= nestRect.left - containerRect.left &&
        mouseX <= nestRect.right - containerRect.left &&
        mouseY >= nestRect.top - containerRect.top &&
        mouseY <= nestRect.bottom - containerRect.top

      if (isOverNest) {
        // Success! Stork reached the correct nest
        setIsCompleted(true)
        setSuccessMessage(getRandomSuccessMessage())

        // Center the stork in the nest
        if (storkRef.current) {
          const storkRect = storkRef.current.getBoundingClientRect()
          setStorkPosition({
            x: nestRect.left - containerRect.left + (nestRect.width - storkRect.width) / 2,
            y: nestRect.top - containerRect.top + (nestRect.height - storkRect.height) / 2,
          })
        }
      } else {
        // Reset stork position
        setStorkPosition(initialPosition)
      }
    }

    e.preventDefault()
  }

  // Set up and clean up event listeners
  useEffect(() => {
    // Add event listeners when component mounts
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    // Clean up event listeners when component unmounts
    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, isCompleted]) // Re-add listeners when these states change

  // Reset the game
  const resetGame = () => {
    setStorkPosition(initialPosition)
    setIsCompleted(false)
    setFeedbackMessage(null)
    setSuccessMessage("")
  }

  return (
    <div className="w-full max-w-6xl">
      {/* Header with title */}
      <div className="w-full flex justify-between items-center mb-8">
        <div className="relative w-16 h-16">
          <Image src="/images/sound.png" alt="Sound" fill className="object-contain cursor-pointer" />
        </div>

        <div className="relative h-24 w-80 md:w-[500px] flex items-center justify-center">
          <Image src="/images/title_box_small.png" alt="Title box" fill className="object-contain" />
          <span className="relative z-10 text-white text-2xl md:text-3xl font-bold">ZNAJDŹ DROGĘ DO GNIAZDA 2.</span>
        </div>

        <div className="relative w-16 h-16" onClick={onMenuClick}>
          <Image src="/images/menu.png" alt="Menu" fill className="object-contain cursor-pointer" />
        </div>
      </div>

      {/* Game area */}
      <div ref={gameContainerRef} className="flex justify-center items-center mt-8 relative">
        <div className="relative w-full h-[600px]">
          {/* Stork - positioned absolutely */}
          <div
            ref={storkRef}
            className={`absolute h-32 w-32 cursor-grab ${isDragging ? "opacity-50" : ""}`}
            onMouseDown={handleMouseDown}
            style={{
              left: `${storkPosition.x}px`,
              top: `${storkPosition.y}px`,
              zIndex: 10,
              transition: isDragging ? "none" : "all 0.3s ease",
            }}
          >
            <Image src="/images/stork.svg" alt="Stork" fill className="object-contain" />
          </div>

          {/* Maze in the center - much larger now */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[500px] w-[600px]">
            <Image
              src={isCompleted ? "/images/maze_02_finished.svg" : "/images/maze_02.svg"}
              alt="Maze"
              fill
              className="object-contain"
            />
          </div>

          {/* Nests on the right */}
          <div className="absolute right-[100px] top-1/2 transform -translate-y-1/2 flex flex-col gap-16">
            {/* Top nest - the correct one for this game */}
            <div ref={topNestRef} className="relative h-32 w-32">
              <Image src="/images/nest.svg" alt="Nest" fill className="object-contain" />
            </div>

            {/* Bottom nest */}
            <div className="relative h-32 w-32">
              <Image src="/images/nest.svg" alt="Nest" fill className="object-contain" />
            </div>
          </div>
        </div>

        {/* Success message - positioned below the maze */}
        {isCompleted && successMessage && (
          <div className="absolute left-1/2 transform -translate-x-1/2" style={{ top: "calc(50% + 260px)" }}>
            <div className="bg-green-100 border-2 border-green-500 rounded-lg p-6 text-center max-w-md">
              <div className="text-green-700 text-xl font-medium">🎉 {successMessage} 🎉</div>
            </div>
          </div>
        )}

        {/* Reset button - only visible when game is completed, positioned below the success message */}
        {isCompleted && (
          <div className="absolute left-1/2 transform -translate-x-1/2" style={{ top: "calc(50% + 340px)" }}>
            <button onClick={resetGame} className="bg-[#539e1b] text-white px-6 py-2 rounded-full font-bold">
              Zagraj ponownie
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
