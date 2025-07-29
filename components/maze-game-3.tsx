"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { useGameCompletion } from "@/hooks/use-game-completion"
import { getRandomSuccessMessage } from "@/lib/success-messages"
import { useSeason } from "@/contexts/season-context"
import SuccessMessage from "./success-message"

interface MazeGame3Props {
  onMenuClick: () => void
}

export default function MazeGame3({ onMenuClick }: MazeGame3Props) {
  // Use the game completion hook
  const { recordCompletion, isLoggedIn } = useGameCompletion()
  // State to track if the game is completed
  const [isCompleted, setIsCompleted] = useState(false)
  // Reference to the butterfly element
  const butterflyRef = useRef<HTMLDivElement>(null)
  // Reference to the target element (top tree for autumn, bottom flower for others)
  const targetRef = useRef<HTMLDivElement>(null)
  // Reference to the game container
  const gameContainerRef = useRef<HTMLDivElement>(null)
  // Initial butterfly position - on the left side of the game area, vertically centered with maze
  const initialPosition = { x: 20, y: 180 }
  // Current butterfly position
  const [butterflyPosition, setButterflyPosition] = useState(initialPosition)
  // Track if we're dragging
  const [isDragging, setIsDragging] = useState(false)
  // Track mouse offset for dragging
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  const { selectedSeason, backgroundColor } = useSeason()
  const isSummer = selectedSeason === "lato"
  const isAutumn = selectedSeason === "jesien"
  const isWinter = selectedSeason === "zima"

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

    // Check if butterfly is dropped on the target
    if (targetRef.current && gameContainerRef.current) {
      const targetRect = targetRef.current.getBoundingClientRect()
      const containerRect = gameContainerRef.current.getBoundingClientRect()

      // Get mouse position relative to container
      const mouseX = e.clientX - containerRect.left
      const mouseY = e.clientY - containerRect.top

      // Check if mouse is over the target
      const isOverTarget =
        mouseX >= targetRect.left - containerRect.left &&
        mouseX <= targetRect.right - containerRect.left &&
        mouseY >= targetRect.top - containerRect.top &&
        mouseY <= targetRect.bottom - containerRect.top

      if (isOverTarget) {
        // Success! Butterfly reached the correct target
        setIsCompleted(true)

        // Record completion in database
        if (isLoggedIn) {
          recordCompletion("maze-game-3")
        }

        // Center the butterfly on the target
        if (butterflyRef.current) {
          const butterflyRect = butterflyRef.current.getBoundingClientRect()
          setButterflyPosition({
            x: targetRect.left - containerRect.left + (targetRect.width - butterflyRect.width) / 2,
            y: targetRect.top - containerRect.top + (targetRect.height - butterflyRect.height) / 2,
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
  }

  return (
    <div className="w-full max-w-4xl" style={{ backgroundColor }}>
      {/* Header with title */}
      <div className="w-full flex justify-between items-center mb-8">
        <div className="relative w-16 h-16">
          <Image
            src={
              isWinter
                ? "/images/sound_winter.svg"
                : isAutumn
                  ? "/images/sound_autumn.svg"
                  : isSummer
                    ? "/images/sound_summer.svg"
                    : "/images/sound_new.svg"
            }
            alt="Sound"
            fill
            className="object-contain cursor-pointer"
          />
        </div>

        <div className="relative h-24 w-80 md:w-[500px] flex items-center justify-center">
          <Image
            src={
              isWinter
                ? "/images/title_box_small_winter.svg"
                : isAutumn
                  ? "/images/title_box_small_autumn.svg"
                  : isSummer
                    ? "/images/title_box_small_summer.svg"
                    : "/images/title_box_small.png"
            }
            alt="Title box"
            fill
            className="object-contain"
          />
          <span className="relative z-10 text-white text-2xl md:text-3xl font-sour-gummy font-thin tracking-wider">
            {isWinter ? "ZNAJDŹ DROGĘ DO IGLO." : "ZNAJDŹ DROGĘ DO DZIUPLI."}
          </span>
        </div>

        <div className="relative w-16 h-16" onClick={onMenuClick}>
          <Image
            src={
              isWinter
                ? "/images/menu_winter.svg"
                : isAutumn
                  ? "/images/menu_autumn.svg"
                  : isSummer
                    ? "/images/menu_summer.svg"
                    : "/images/menu_new.svg"
            }
            alt="Menu"
            fill
            className="object-contain cursor-pointer"
          />
        </div>
      </div>

      {/* Game area */}
      <div ref={gameContainerRef} className="flex justify-center items-center mt-2 relative">
        <div className="relative w-full h-[400px]">
          {/* Butterfly/Squirrel/Eskimo - positioned on the left */}
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
            <Image
              src={
                isWinter
                  ? "/images/eskimo_winter.svg"
                  : isAutumn
                    ? "/images/squirrel_autumn.svg"
                    : isSummer
                      ? "/images/sign_01_summer.svg"
                      : "/images/butterfly_orange.svg"
              }
              alt={isWinter ? "Eskimo" : isAutumn ? "Squirrel" : isSummer ? "Sign" : "Butterfly"}
              fill
              className="object-contain"
            />
          </div>

          {/* Maze in the center */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[400px] w-[500px]">
            <Image
              src={
                isWinter
                  ? "/images/maze_eskimo.svg"
                  : isAutumn
                    ? "/images/maze_02_autumn.svg"
                    : isSummer
                      ? "/images/maze_mountains_summer.svg"
                      : isCompleted
                        ? "/images/maze_03_finished.svg"
                        : "/images/maze_03.svg"
              }
              alt="Maze"
              fill
              className="object-contain"
            />
          </div>

          {/* Destinations on the right */}
          <div className="absolute right-[50px] top-1/2 transform -translate-y-1/2 flex flex-col gap-16">
            {/* Top destination - the correct target for autumn and winter */}
            <div ref={isAutumn || isWinter ? targetRef : undefined} className="relative h-16 w-16 mt-[-15px]">
              <Image
                src={
                  isWinter
                    ? "/images/igloo_winter_01.svg"
                    : isAutumn
                      ? "/images/tree_03_autumn.svg"
                      : isSummer
                        ? "/images/mountain_01_summer.svg"
                        : "/images/flower_yellow_top.svg"
                }
                alt={isWinter ? "Igloo 1" : isAutumn ? "Tree 3" : isSummer ? "Mountain 1" : "Yellow Flower"}
                fill
                className="object-contain"
              />
            </div>

            {/* Middle destination */}
            <div className="relative h-16 w-16 mt-[-29px]">
              <Image
                src={
                  isWinter
                    ? "/images/igloo_winter_02.svg"
                    : isAutumn
                      ? "/images/tree_02_autumn.svg"
                      : isSummer
                        ? "/images/mountain_02_summer.svg"
                        : "/images/flower_white_top.svg"
                }
                alt={isWinter ? "Igloo 2" : isAutumn ? "Tree 2" : isSummer ? "Mountain 2" : "White Flower"}
                fill
                className="object-contain"
              />
            </div>

            {/* Bottom destination - the correct target for spring/summer */}
            <div ref={!isAutumn && !isWinter ? targetRef : undefined} className="relative h-16 w-16 mt-[-43px]">
              <Image
                src={
                  isWinter
                    ? "/images/igloo_winter_03.svg"
                    : isAutumn
                      ? "/images/tree_01_autumn.svg"
                      : isSummer
                        ? "/images/mountain_03_summer.svg"
                        : "/images/flower_red_top.svg"
                }
                alt={isWinter ? "Igloo 3" : isAutumn ? "Tree 1" : isSummer ? "Mountain 3" : "Red Flower"}
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Success message and button - only visible when the game is complete */}
      {isCompleted && (
        <div className="flex flex-col items-center mt-8">
          <SuccessMessage message={getRandomSuccessMessage()} />
          <button onClick={resetGame} className="bg-[#539e1b] text-white px-6 py-3 rounded-full font-sour-gummy text-lg">
            Zagraj ponownie
          </button>
        </div>
      )}
    </div>
  )
}
