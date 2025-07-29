"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useGameCompletion } from "@/hooks/use-game-completion"
import { getRandomSuccessMessage } from "@/lib/success-messages"
import { useSeason } from "@/contexts/season-context"

interface BranchSequenceGameProps {
  onMenuClick: () => void
}

export default function BranchSequenceGame({ onMenuClick }: BranchSequenceGameProps) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [placedItem, setPlacedItem] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  // Use the game completion hook
  const { recordCompletion, isLoggedIn } = useGameCompletion()

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
          recordCompletion("branch-sequence-game").then((success) => {
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
          <Image src={soundIcon || "/placeholder.svg"} alt="Sound" fill className="object-contain cursor-pointer" />
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
            <div className="p-6 bg-green-100 border-4 border-green-400 rounded-xl text-center mb-4">
              <div className="text-3xl font-bold text-green-800">🎉 {successMessage} 🎉</div>
            </div>
            <button
              onClick={resetGame}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full transition-colors"
            >
              Zagraj ponownie
            </button>
          </div>
        )}
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
