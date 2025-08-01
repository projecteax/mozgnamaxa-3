"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { useGameCompletionWithHistory } from "@/hooks/use-game-completion"
import { getRandomSuccessMessage } from "@/lib/success-messages"
import { useSeason } from "@/contexts/season-context"
import SuccessMessage from "./success-message"
import SoundButtonEnhanced from "./sound-button-enhanced"

interface MazeGame3Props {
  onMenuClick: () => void
  onBack?: () => void
  onNext?: () => void
  onRetry?: () => void
  userLoggedIn?: boolean
  currentSeason?: string
  isGameCompleted?: boolean
}

export default function MazeGame3({ onMenuClick, onBack, onNext, onRetry, userLoggedIn = false, currentSeason = "wiosna", isGameCompleted = false }: MazeGame3Props) {
  // Use the game completion hook
  const { recordCompletion, isLoggedIn, isHistoricallyCompleted } = useGameCompletionWithHistory("maze-game-3")
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

  const { selectedSeason, getThemeColors } = useSeason()
  const theme = getThemeColors()
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
          recordCompletion()
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

  // Get title text based on season
  const getTitleText = () => {
    if (isWinter) {
      return "ZNAJDŹ DROGĘ DO IGLO."
    } else if (isAutumn) {
      return "ZNAJDŹ DROGĘ DO DZIUPLI."
    } else if (isSummer) {
      return "ZNAJDŹ DROGĘ NA SZCZYT."
    } else {
      return "ZNAJDŹ DROGĘ DO KWIATKA."
    }
  }

  return (
    <div className="w-full max-w-4xl" style={{ backgroundColor: theme.backgroundColor }}>
      {/* Header with title */}
      <div className="w-full flex justify-between items-center mb-8">
        <div className="relative w-16 h-16">
          <SoundButtonEnhanced
            text={getTitleText()}
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
                  : isSummer
                    ? "/images/title_box_small_summer.svg"
                    : "/images/title_box_small.png"
            }
            alt="Title box"
            fill
            className="object-contain"
          />
          <span className="relative z-10 text-white text-2xl md:text-3xl font-sour-gummy font-thin tracking-wider">
            {getTitleText()}
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
        </div>
      )}

      {/* New Navigation Buttons - Always visible */}
      <div className="flex justify-center gap-4 mt-8 w-full">
        {/* All buttons in same container with identical dimensions */}
        <div className="flex gap-4 items-end">
          {/* WRÓĆ Button - always available in maze-game-3 */}
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
