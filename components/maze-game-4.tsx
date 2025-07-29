"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { getRandomSuccessMessage } from "@/lib/success-messages"

interface MazeGame4Props {
  onMenuClick: () => void
}

export default function MazeGame4({ onMenuClick }: MazeGame4Props) {
  // State to track if the game is completed
  const [isCompleted, setIsCompleted] = useState(false)
  // State for feedback message
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)
  // State for success message
  const [successMessage, setSuccessMessage] = useState<string>("")
  // Reference to the butterfly element
  const butterflyRef = useRef<HTMLDivElement>(null)
  // Reference to the top flower element (target for this game)
  const topFlowerRef = useRef<HTMLDivElement>(null)
  // Reference to the game container
  const gameContainerRef = useRef<HTMLDivElement>(null)
  // Initial butterfly position
  const initialPosition = { x: 100, y: 300 }
  // Current butterfly position
  const [butterflyPosition, setButterflyPosition] = useState(initialPosition)
  // Track if we're dragging
  const [isDragging, setIsDragging] = useState(false)
  // Track mouse offset for dragging
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  // Handle mouse down on butterfly
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isCompleted) return

    // Calculate offset from mouse position to butterfly top-left corner
    if (butterflyRef.current) {
      const rect = butterflyRef.current.getBoundingClientRect()
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
      setButterflyPosition({
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

    // Check if butterfly is dropped on the top flower
    if (topFlowerRef.current && gameContainerRef.current) {
      const flowerRect = topFlowerRef.current.getBoundingClientRect()
      const containerRect = gameContainerRef.current.getBoundingClientRect()

      // Get mouse position relative to container
      const mouseX = e.clientX - containerRect.left
      const mouseY = e.clientY - containerRect.top

      // Check if mouse is over the flower
      const isOverFlower =
        mouseX >= flowerRect.left - containerRect.left &&
        mouseX <= flowerRect.right - containerRect.left &&
        mouseY >= flowerRect.top - containerRect.top &&
        mouseY <= flowerRect.bottom - containerRect.top

      if (isOverFlower) {
        // Success! Butterfly reached the correct flower
        setIsCompleted(true)
        setSuccessMessage(getRandomSuccessMessage())

        // Center the butterfly in the flower
        if (butterflyRef.current) {
          const butterflyRect = butterflyRef.current.getBoundingClientRect()
          setButterflyPosition({
            x: flowerRect.left - containerRect.left + (flowerRect.width - butterflyRect.width) / 2,
            y: flowerRect.top - containerRect.top + (flowerRect.height - butterflyRect.height) / 2,
          })
        }
      } else {
        // Reset butterfly position
        setButterflyPosition(initialPosition)
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
    setIsCompleted(false)
    setButterflyPosition(initialPosition)
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
          <span className="relative z-10 text-white text-2xl md:text-3xl font-bold">ZNAJDŹ DROGĘ DO KWIATKA 2.</span>
        </div>

        <div className="relative w-16 h-16" onClick={onMenuClick}>
          <Image src="/images/menu.png" alt="Menu" fill className="object-contain cursor-pointer" />
        </div>
      </div>

      {/* Game area */}
      <div ref={gameContainerRef} className="flex justify-center items-center mt-8 relative">
        <div className="relative w-full h-[600px]">
          {/* Butterfly - positioned on the left */}
          <div
            ref={butterflyRef}
            className={`absolute h-32 w-32 cursor-grab ${isDragging ? "opacity-50" : ""}`}
            onMouseDown={handleMouseDown}
            style={{
              left: `${butterflyPosition.x}px`,
              top: `${butterflyPosition.y}px`,
              zIndex: 10,
              transition: isDragging ? "none" : "all 0.3s ease",
            }}
          >
            <Image src="/images/butterfly_orange.svg" alt="Butterfly" fill className="object-contain" />
          </div>

          {/* Maze in the center */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[500px] w-[600px]">
            <Image
              src={isCompleted ? "/images/maze_04_finished.svg" : "/images/maze_04.svg"}
              alt="Maze"
              fill
              className="object-contain"
            />
          </div>

          {/* Flowers on the right */}
          <div className="absolute right-[200px] top-1/2 transform -translate-y-1/2 flex flex-col gap-16">
            {/* Top flower - white (the correct one) */}
            <div ref={topFlowerRef} className="relative h-16 w-16 mt-[-15px]">
              <Image src="/images/flower_white_top.svg" alt="White Flower" fill className="object-contain" />
            </div>

            {/* Middle flower - yellow */}
            <div className="relative h-16 w-16 mt-[-29px]">
              <Image src="/images/flower_yellow_top.svg" alt="Yellow Flower" fill className="object-contain" />
            </div>

            {/* Bottom flower - red */}
            <div className="relative h-16 w-16 mt-[-43px]">
              <Image src="/images/flower_red_top.svg" alt="Red Flower" fill className="object-contain" />
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
