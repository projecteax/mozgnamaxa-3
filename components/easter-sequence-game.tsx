"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { useGameCompletion } from "@/hooks/use-game-completion"
import { getRandomSuccessMessage } from "@/lib/success-messages"
import { useSeason } from "@/contexts/season-context"
import SuccessMessage from "./success-message"

interface EasterSequenceGameProps {
  onMenuClick: () => void
  onComplete?: () => void
}

export default function EasterSequenceGame({ onMenuClick, onComplete }: EasterSequenceGameProps) {
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

  const { recordCompletion } = useGameCompletion()
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
        recordCompletion("easter-sequence")
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
          <Image
            src={selectedSeason === "zima" ? "/images/sound_winter.svg" : theme.soundIcon || "/placeholder.svg"}
            alt="Sound"
            fill
            className="object-contain cursor-pointer"
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

      {/* Reset button - only visible when sequence is completed */}
      {isCompleted && (
        <div className="flex justify-center mt-8">
          <button onClick={resetGame} className="bg-[#539e1b] text-white px-6 py-2 rounded-full font-bold">
            Zagraj ponownie
          </button>
        </div>
      )}
    </div>
  )
}
