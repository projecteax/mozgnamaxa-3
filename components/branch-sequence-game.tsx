"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useGameCompletionWithHistory } from "@/hooks/use-game-completion"
import { getRandomSuccessMessage } from "@/lib/success-messages"
import { useSeason } from "@/contexts/season-context"
import SoundButtonEnhanced from "./sound-button-enhanced"
import SuccessMessage from "./success-message"

interface BranchSequenceGameProps {
  onMenuClick: () => void
  onBack?: () => void
  onNext?: () => void
  onRetry?: () => void
  userLoggedIn?: boolean
  currentSeason?: string
  isGameCompleted?: boolean
}

export default function BranchSequenceGame({ onMenuClick, onBack, onNext, onRetry, userLoggedIn = false, currentSeason = "wiosna", isGameCompleted = false }: BranchSequenceGameProps) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [placedItem, setPlacedItem] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  // Use the game completion hook
  const { recordCompletion, isLoggedIn, isHistoricallyCompleted } = useGameCompletionWithHistory("branch-sequence-game")

  // Use season context
  const { selectedSeason, getThemeColors } = useSeason()
  const isSummer = selectedSeason === "lato"
  const isAutumn = selectedSeason === "jesien"
  const isWinter = selectedSeason === "zima"
  const theme = getThemeColors()

  // Reset game when season changes
  useEffect(() => {
    resetGame()
  }, [selectedSeason])

  // Define the sequence based on season
  const getImageName = (baseName: string) => {
    if (isSummer) {
      return baseName.replace("branch_", "dinner_summer_")
    }
    if (isAutumn) {
      // Map branch_XX to mushroom_autumn_XX
      if (baseName === "branch_01") return "mushroom_autumn_01"
      if (baseName === "branch_02") return "mushroom_autumn_02"
      if (baseName === "branch_03") return "mushroom_autumn_03"
    }
    if (isWinter) {
      // Map branch_XX to winter items
      if (baseName === "branch_01") return "heart_winter"
      if (baseName === "branch_02") return "rose_winter"
      if (baseName === "branch_03") return "balon_winter"
    }
    return baseName // Default for other seasons or if no specific mapping
  }

  const firstPart = ["branch_01", "branch_02", "branch_03", "branch_01"].map(getImageName)
  const secondPart = ["branch_03", "branch_01", "branch_02", "branch_03"].map(getImageName)

  // Available draggable items
  const draggableItems = ["branch_03", "branch_01", "branch_02"].map(getImageName)

  // Get the correct answer based on season
  const correctAnswer = getImageName("branch_02")

  const handleDragStart = (item: string) => {
    setDraggedItem(item)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()

    if (draggedItem) {
      // Only allow the correct answer to be placed
      if (draggedItem === correctAnswer) {
        setPlacedItem(draggedItem)
        setIsCompleted(true)
        setShowSuccess(true)
        setSuccessMessage(getRandomSuccessMessage())

        console.log("🎉 Branch sequence game completed! Correct item placed.")

        // Record completion when game is finished
        if (isLoggedIn) {
          recordCompletion().then((success) => {
            if (success) {
              console.log("✅ Branch sequence game completion recorded successfully")
            }
          })
        }
      }
      // If incorrect item, don't place it (silent rejection like sequence-game)
    }

    setDraggedItem(null)
  }

  const resetGame = () => {
    setIsCompleted(false)
    setSuccessMessage(null)
    setShowSuccess(false)
    setPlacedItem(null)
    setDraggedItem(null)
  }

  const renderSequenceItem = (item: string, index: number) => {
    return (
      <div key={index} className="relative h-[100px] w-[100px]">
        <Image src={`/images/${item}.svg`} alt={item} fill className="object-contain" />
      </div>
    )
  }

  // Get UI assets based on season
  const soundIcon = isWinter ? "/images/sound_winter.svg" : isAutumn ? "/images/sound_autumn.svg" : theme.soundIcon
  const menuIcon = isWinter ? "/images/menu_winter.svg" : isAutumn ? "/images/menu_autumn.svg" : theme.menuIcon
  const titleBox = isWinter
    ? "/images/title_box_small_winter.svg"
    : isAutumn
      ? "/images/title_box_small_autumn.svg"
      : isSummer
        ? "/images/title_box_small_summer.svg"
        : "/images/title_box_small.png"
  const titleText = isWinter ? "DOKOŃCZ UKŁADANIE" : isAutumn ? "DOKOŃCZ UKŁADANIE" : "DOKOŃCZ UKŁADANIE"

  return (
    <div className="w-full max-w-6xl">
      {/* Header with title */}
      <div className="w-full flex justify-between items-center mb-12">
        <div className="relative w-16 h-16">
          <SoundButtonEnhanced
            text="DOKOŃCZ UKŁADANIE"
            soundIcon={theme.soundIcon || "/images/sound_icon_dragon_page.svg"}
            size="xl"
            className="w-full h-full"
          />
        </div>

        <div className="relative h-24 w-80 md:w-[500px] flex items-center justify-center">
          <Image src={titleBox || "/placeholder.svg"} alt="Title box" fill className="object-contain" />
          <span className="relative z-10 text-white text-2xl md:text-3xl font-sour-gummy font-thin">{titleText}</span>
        </div>

        <div className="relative w-16 h-16" onClick={onMenuClick}>
          <Image src={menuIcon || "/placeholder.svg"} alt="Menu" fill className="object-contain cursor-pointer" />
        </div>
      </div>

      {/* Game area */}
      <div className="flex flex-col items-center mt-[50px]">
        {/* Main sequence row: 4 items + white box + 4 items */}
        <div className="flex justify-center items-center gap-4 w-full mb-16">
          {/* First 4 items */}
          {firstPart.map((item, index) => renderSequenceItem(item, index))}

          {/* Empty white box in the middle */}
          <div className="relative h-[100px] w-[100px] mx-2" onDragOver={handleDragOver} onDrop={handleDrop}>
            {placedItem ? (
              <Image src={`/images/${placedItem}.svg`} alt={placedItem} fill className="object-contain" />
            ) : (
              <div className="relative h-full w-full">
                <div className="relative h-[140px] w-[140px] -mt-5 -ml-5">
                  <Image src="/images/white_box_medium.svg" alt="Empty Box" fill className="object-contain" />
                </div>
              </div>
            )}
          </div>

          {/* Last 4 items */}
          {secondPart.map((item, index) => renderSequenceItem(item, index + 5))}
        </div>

        {/* Draggable items row */}
        <div className="flex justify-center gap-16">
          {draggableItems.map((item) => (
            <div
              key={`draggable-${item}`}
              draggable
              onDragStart={() => handleDragStart(item)}
              className="relative h-[100px] w-[100px] cursor-grab"
            >
              <Image src={`/images/${item}.svg`} alt={item} fill className="object-contain" />
            </div>
          ))}
        </div>

        {/* Success message - only show when game is completed */}
        {showSuccess && (
          <div className="mt-8 flex flex-col items-center">
            <SuccessMessage message={successMessage} />
          </div>
        )}
      </div>

      {/* New Navigation Buttons - Always visible */}
      <div className="flex justify-center gap-4 mt-8 w-full">
        {/* All buttons in same container with identical dimensions */}
        <div className="flex gap-4 items-end">
          {/* WRÓĆ Button - always available in branch-sequence-game */}
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

      {/* Login reminder for non-logged in users */}
      {!isLoggedIn && (
        <div className="mt-4 text-center text-gray-600">
          <p>Zaloguj się, aby zapisać swój postęp!</p>
        </div>
      )}
    </div>
  )
}
