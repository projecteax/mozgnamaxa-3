"use client"

import type React from "react"

import { useState, useMemo } from "react"
import Image from "next/image"
import { useGameCompletionWithHistory } from "@/hooks/use-game-completion"
import { getRandomSuccessMessage } from "@/lib/success-messages"
import { useSeason } from "@/contexts/season-context"
import SuccessMessage from "./success-message"
import SoundButtonEnhanced from "./sound-button-enhanced"

interface EasterSequenceGameProps {
  onMenuClick: () => void
  onComplete?: () => void
  onBack?: () => void
  onNext?: () => void
  onRetry?: () => void
  userLoggedIn?: boolean
  currentSeason?: string
  isGameCompleted?: boolean
}

export default function EasterSequenceGame({ onMenuClick, onComplete, onBack, onNext, onRetry, userLoggedIn = false, currentSeason = "wiosna", isGameCompleted = false }: EasterSequenceGameProps) {
  const { selectedSeason, getThemeColors } = useSeason()
  const theme = getThemeColors()

  // Define the sequence items - alternating red and blue eggs/flowers
  const sequenceItems = [
    {
      id: "red-egg-1",
      image:
        selectedSeason === "zima"
          ? "/images/cookie_01_winter.svg"
          : selectedSeason === "lato"
            ? "/images/red_flower_summer.svg"
            : selectedSeason === "jesien"
              ? "/images/apple_autumn.svg"
              : "/images/egg_red.svg",
    },
    {
      id: "blue-egg-1",
      image:
        selectedSeason === "zima"
          ? "/images/cookie_02_winter.svg"
          : selectedSeason === "lato"
            ? "/images/dark_blue_flower_summer.svg"
            : selectedSeason === "jesien"
              ? "/images/pear_autumn.svg"
              : "/images/egg_dark_blue.svg",
    },
    { id: "empty", image: "" }, // Empty slot to be filled
    {
      id: "blue-egg-2",
      image:
        selectedSeason === "zima"
          ? "/images/cookie_02_winter.svg"
          : selectedSeason === "lato"
            ? "/images/dark_blue_flower_summer.svg"
            : selectedSeason === "jesien"
              ? "/images/pear_autumn.svg"
              : "/images/egg_dark_blue.svg",
    },
    {
      id: "red-egg-2",
      image:
        selectedSeason === "zima"
          ? "/images/cookie_01_winter.svg"
          : selectedSeason === "lato"
            ? "/images/red_flower_summer.svg"
            : selectedSeason === "jesien"
              ? "/images/apple_autumn.svg"
              : "/images/egg_red.svg",
    },
    {
      id: "blue-egg-3",
      image:
        selectedSeason === "zima"
          ? "/images/cookie_02_winter.svg"
          : selectedSeason === "lato"
            ? "/images/dark_blue_flower_summer.svg"
            : selectedSeason === "jesien"
              ? "/images/pear_autumn.svg"
              : "/images/egg_dark_blue.svg",
    },
  ]

  // Draggable items - the options to choose from
  const draggableItems = [
    {
      id: "red-egg",
      image:
        selectedSeason === "zima"
          ? "/images/cookie_01_winter.svg"
          : selectedSeason === "lato"
            ? "/images/red_flower_summer.svg"
            : selectedSeason === "jesien"
              ? "/images/apple_autumn.svg"
              : "/images/egg_red.svg",
    },
    {
      id: "blue-egg",
      image:
        selectedSeason === "zima"
          ? "/images/cookie_02_winter.svg"
          : selectedSeason === "lato"
            ? "/images/dark_blue_flower_summer.svg"
            : selectedSeason === "jesien"
              ? "/images/pear_autumn.svg"
              : "/images/egg_dark_blue.svg",
    },
  ]

  // State for tracking if the sequence is completed
  const [isCompleted, setIsCompleted] = useState(false)

  // State for tracking the current dragged item
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  // State for success message
  const [successMessage, setSuccessMessage] = useState<string>("")

  const { recordCompletion, isLoggedIn, isHistoricallyCompleted } = useGameCompletionWithHistory("easter-sequence-game")
  const [hasRecordedCompletion, setHasRecordedCompletion] = useState(false)

  // Handle drag start
  const handleDragStart = (id: string) => {
    setDraggedItem(id)
  }

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  // Handle drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()

    // The correct answer for this sequence is "red-egg" (to continue the pattern)
    if (draggedItem === "red-egg") {
      setIsCompleted(true)
      setSuccessMessage(getRandomSuccessMessage())

      // Record completion when the correct egg is placed
      if (!hasRecordedCompletion) {
        recordCompletion()
          .then(() => {
            console.log("Easter sequence game completion recorded successfully")
            setHasRecordedCompletion(true)
            // Call onComplete callback after 3 seconds to show success message
            if (onComplete) {
              setTimeout(() => {
              onComplete()
              }, 3000) // 3 second delay
            }
          })
          .catch((error) => {
            console.error("Failed to record easter sequence completion:", error)
          })
      }
    }

    setDraggedItem(null)
  }

  // Reset the game
  const resetGame = () => {
    setIsCompleted(false)
    setSuccessMessage("")
    setHasRecordedCompletion(false)
  }

  return (
    <div className="w-full max-w-4xl" style={{ backgroundColor: theme.background }}>
      {/* Header with title - updated icons and title text */}
      <div className="w-full flex justify-between items-center mb-8">
        <div className="relative w-16 h-16">
          <SoundButtonEnhanced
            text="CO PASUJE? UZUPEŁNIJ."
            soundIcon={selectedSeason === "zima" ? "/images/sound_winter.svg" : theme.soundIcon || "/images/sound_icon_dragon_page.svg"}
            size="xl"
            className="w-full h-full"
          />
        </div>

        <div className="relative h-24 w-80 md:w-[500px] flex items-center justify-center">
          <Image
            src={
              selectedSeason === "zima"
                ? "/images/title_box_small_winter.svg"
                : theme.titleBox || "/images/title_box_small.svg"
            }
            alt="Title box"
            fill
            className="object-contain"
          />
          <span className="relative z-10 text-white text-2xl md:text-3xl font-sour-gummy font-thin">
            CO PASUJE? UZUPEŁNIJ.
          </span>
        </div>

        <div className="relative w-16 h-16" onClick={onMenuClick}>
          <Image
            src={selectedSeason === "zima" ? "/images/menu_winter.svg" : theme.menuIcon || "/placeholder.svg"}
            alt="Menu"
            fill
            className="object-contain cursor-pointer"
          />
        </div>
      </div>

      {/* Game area */}
      <div className="flex flex-col items-center">
        {/* Sequence row */}
        <div className="flex justify-center gap-4 w-full mb-16">
          {sequenceItems.map((item, index) => (
            <div
              key={`sequence-${index}`}
              className="relative h-[100px] w-[100px]"
              onDragOver={item.id === "empty" ? handleDragOver : undefined}
              onDrop={item.id === "empty" ? handleDrop : undefined}
            >
              {item.id !== "empty" ? (
                <Image src={item.image || "/placeholder.svg"} alt={item.id} fill className="object-contain" />
              ) : (
                <div className="relative h-full w-full">
                  <div className="absolute -top-[7.5px] -left-[7.5px] w-[115px] h-[115px]">
                    <Image src="/images/white_box_medium.svg" alt="Empty Box" fill className="object-contain" />
                  </div>
                  {isCompleted && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative h-[80px] w-[80px]">
                        <Image
                          src={
                            selectedSeason === "zima"
                              ? "/images/cookie_01_winter.svg"
                              : selectedSeason === "lato"
                                ? "/images/red_flower_summer.svg"
                                : selectedSeason === "jesien"
                                  ? "/images/apple_autumn.svg"
                                  : "/images/egg_red.svg"
                          }
                          alt="Red Egg"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Draggable items */}
        <div className="flex justify-center gap-16">
          {draggableItems.map((item) => (
            <div
              key={`draggable-${item.id}`}
              draggable
              onDragStart={() => handleDragStart(item.id)}
              className="relative h-[100px] w-[100px] cursor-grab"
            >
              <Image src={item.image || "/placeholder.svg"} alt={item.id} fill className="object-contain" />
            </div>
          ))}
        </div>
      </div>

      {/* Success message */}
      {isCompleted && successMessage && <SuccessMessage message={successMessage} />}

      {/* New Navigation Buttons */}
      <div className="flex justify-center gap-4 mt-8 w-full">
        {/* All buttons in same container with identical dimensions */}
        <div className="flex gap-4 items-end">
          {/* WRÓĆ Button - always available in easter-sequence-game */}
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
