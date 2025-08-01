"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"

import { useGameCompletionWithHistory } from "@/hooks/use-game-completion"
import { getRandomSuccessMessage } from "@/lib/success-messages"
import { useSeason } from "@/contexts/season-context"
import SoundButtonEnhanced from "./sound-button-enhanced"
import SuccessMessage from "./success-message"

interface SequenceGame2Props {
  onMenuClick: () => void
  onComplete?: () => void
  onBack?: () => void
  onNext?: () => void
  onRetry?: () => void
  userLoggedIn?: boolean
  currentSeason?: string
  isGameCompleted?: boolean
}

export default function SequenceGame2({ onMenuClick, onComplete, onBack, onNext, onRetry, userLoggedIn = false, currentSeason = "wiosna", isGameCompleted = false }: SequenceGame2Props) {
  /* ------------------------------------------------------------------ */
  /*  Context & helpers                                                 */
  /* ------------------------------------------------------------------ */
  const { recordCompletion, isLoggedIn, isHistoricallyCompleted } = useGameCompletionWithHistory("sequence-game-2")

  // Season context gives us the current season and theme getter
  const { selectedSeason, getThemeColors } = useSeason()
  const season = selectedSeason
  const theme = getThemeColors()

  /* ------------------------------------------------------------------ */
  /*  Game data based on season                                         */
  /* ------------------------------------------------------------------ */
  const sequenceItems =
    season === "zima"
      ? [
          { id: "penguin-1", image: "/images/pinguin_winter.svg" },
          { id: "bear-1", image: "/images/bear_winter.svg" },
          { id: "empty-1", image: "" },
          { id: "bear-2", image: "/images/bear_winter.svg" },
          { id: "penguin-2", image: "/images/pinguin_winter.svg" },
          { id: "empty-2", image: "" },
        ]
      : season === "jesien"
        ? [
            { id: "green-leaf-1", image: "/images/single_leaf_green_autumn.svg" },
            { id: "orange-leaf-1", image: "/images/single_leaf_orange_autumn.svg" },
            { id: "empty-1", image: "" },
            { id: "orange-leaf-2", image: "/images/single_leaf_orange_autumn.svg" },
            { id: "green-leaf-2", image: "/images/single_leaf_green_autumn.svg" },
            { id: "empty-2", image: "" },
          ]
        : season === "lato"
          ? [
              { id: "tomato-1", image: "/images/tomato_summer.svg" },
              { id: "cucumber-1", image: "/images/cucamber_02_summer.svg" },
              { id: "empty-1", image: "" },
              { id: "cucumber-2", image: "/images/cucamber_02_summer.svg" },
              { id: "tomato-2", image: "/images/tomato_summer.svg" },
              { id: "empty-2", image: "" },
            ]
          : [
              { id: "sun-1", image: "/images/sun.svg" },
              { id: "cloud-1", image: "/images/cloud.svg" },
              { id: "empty-1", image: "" },
              { id: "cloud-2", image: "/images/cloud.svg" },
              { id: "sun-2", image: "/images/sun.svg" },
              { id: "empty-2", image: "" },
            ]

  const draggableItems =
    season === "zima"
      ? [
          { id: "penguin", image: "/images/pinguin_winter.svg" },
          { id: "bear", image: "/images/bear_winter.svg" },
        ]
      : season === "jesien"
        ? [
            { id: "green-leaf", image: "/images/single_leaf_green_autumn.svg" },
            { id: "orange-leaf", image: "/images/single_leaf_orange_autumn.svg" },
          ]
        : season === "lato"
          ? [
              { id: "tomato", image: "/images/tomato_summer.svg" },
              { id: "cucumber", image: "/images/cucamber_02_summer.svg" },
            ]
          : [
              { id: "sun", image: "/images/sun.svg" },
              { id: "cloud", image: "/images/cloud.svg" },
            ]

  const filledImages =
    season === "zima"
      ? {
          first: "/images/pinguin_winter.svg",
          second: "/images/bear_winter.svg",
        }
      : season === "jesien"
        ? {
            first: "/images/single_leaf_green_autumn.svg",
            second: "/images/single_leaf_orange_autumn.svg",
          }
        : season === "lato"
          ? {
              first: "/images/tomato_summer.svg",
              second: "/images/cucamber_02_summer.svg",
            }
          : {
              first: "/images/sun.svg",
              second: "/images/cloud.svg",
            }

  /* ------------------------------------------------------------------ */
  /*  Local state                                                       */
  /* ------------------------------------------------------------------ */
  const [firstSlotFilled, setFirstSlotFilled] = useState(false)
  const [secondSlotFilled, setSecondSlotFilled] = useState(false)
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [activeSlot, setActiveSlot] = useState<"first" | "second">("first")

  /* ------------------------------------------------------------------ */
  /*  Drag & drop handlers                                              */
  /* ------------------------------------------------------------------ */
  const handleDragStart = (id: string) => {
    setDraggedItem(id)
    setErrorMessage(null)
  }

  const handleDragOver = (e: React.DragEvent) => e.preventDefault()

  const handleDrop = (slot: "first" | "second") => {
    if (!draggedItem) return

    const correctFirst =
      season === "zima" ? "penguin" : season === "jesien" ? "green-leaf" : season === "lato" ? "tomato" : "sun"
    const correctSecond =
      season === "zima" ? "bear" : season === "jesien" ? "orange-leaf" : season === "lato" ? "cucumber" : "cloud"

    if (
      (slot === "first" && draggedItem === correctFirst && !firstSlotFilled) ||
      (slot === "second" && draggedItem === correctSecond && !secondSlotFilled && activeSlot === "second")
    ) {
      if (slot === "first") {
        setFirstSlotFilled(true)
        setActiveSlot("second")
      } else {
        setSecondSlotFilled(true)
      }
      setErrorMessage(null)

      if ((slot === "first" && secondSlotFilled) || (slot === "second" && firstSlotFilled)) {
        setIsCompleted(true)
        setSuccessMessage(getRandomSuccessMessage())
        recordCompletion()
        // Call onComplete after 3 seconds to show success message
        if (onComplete) {
          setTimeout(() => {
            onComplete()
          }, 3000) // 3 second delay
        }
      }
    } else {
      setErrorMessage("Przykro mi to tutaj nie pasuje")
    }

    setDraggedItem(null)
  }

  const resetGame = () => {
    setFirstSlotFilled(false)
    setSecondSlotFilled(false)
    setActiveSlot("first")
    setIsCompleted(false)
    setErrorMessage(null)
    setSuccessMessage("")
  }

  /* ------------------------------------------------------------------ */
  /*  Render                                                            */
  /* ------------------------------------------------------------------ */
  return (
    <div className="w-full max-w-4xl" style={{ backgroundColor: theme.background }}>
      {/* Header */}
      <div className="w-full flex justify-between items-center mb-8">
        <div className="relative w-16 h-16">
          <SoundButtonEnhanced
            text="UŁÓŻ PO KOLEI."
            soundIcon={theme.soundIcon || "/images/sound_icon_dragon_page.svg"}
            size="xl"
            className="w-full h-full"
          />
        </div>

        <div className="relative h-24 w-80 md:w-[500px] flex items-center justify-center">
          <Image src={theme.titleBox || "/placeholder.svg"} alt="Title box" fill className="object-contain" />
          <span className="relative z-10 text-white text-2xl md:text-3xl font-sour-gummy font-thin">UŁÓŻ PO KOLEI.</span>
        </div>

        <div className="relative w-16 h-16" onClick={onMenuClick}>
          <Image src={theme.menuIcon || "/placeholder.svg"} alt="Menu" fill className="object-contain cursor-pointer" />
        </div>
      </div>

      {/* Sequence row */}
      <div className="flex flex-col items-center">
        <div className="flex justify-center gap-4 w-full mb-16">
          {sequenceItems.map((item) => {
            const isFirstEmpty = item.id === "empty-1"
            const isSecondEmpty = item.id === "empty-2"
            const canDrop =
              (isFirstEmpty && !firstSlotFilled) || (isSecondEmpty && !secondSlotFilled && activeSlot === "second")

            return (
              <div
                key={item.id}
                className="relative h-[120px] w-[120px]" // Adjusted size for better centering
                onDragOver={canDrop ? handleDragOver : undefined}
                onDrop={canDrop ? () => handleDrop(isFirstEmpty ? "first" : "second") : undefined}
              >
                {isFirstEmpty || isSecondEmpty ? (
                  <div
                    className={`relative h-full w-full ${
                      isSecondEmpty && activeSlot !== "second" && !secondSlotFilled
                        ? "opacity-50 pointer-events-none"
                        : ""
                    }`}
                  >
                    <Image
                      src="/images/white_box_medium.svg"
                      alt="Empty Box"
                      fill
                      className="object-contain brightness-105"
                      style={{ transform: "scale(1.20)" }} // Added scale transform here
                    />

                    {isFirstEmpty && firstSlotFilled && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative h-[90px] w-[90px]">
                          {" "}
                          {/* Adjusted size for dropped image */}
                          <Image
                            src={filledImages.first || "/placeholder.svg"}
                            alt="Filled"
                            fill
                            className="object-contain drop-shadow-lg"
                          />
                        </div>
                      </div>
                    )}

                    {isSecondEmpty && secondSlotFilled && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative h-[90px] w-[90px]">
                          {" "}
                          {/* Adjusted size for dropped image */}
                          <Image
                            src={filledImages.second || "/placeholder.svg"}
                            alt="Filled"
                            fill
                            className="object-contain drop-shadow-lg"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.id}
                    fill
                    className="object-contain drop-shadow-lg"
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* Draggable items */}
        <div className="flex justify-center gap-16">
          {draggableItems.map((item) => (
            <div
              key={item.id}
              draggable
              onDragStart={() => handleDragStart(item.id)}
              className="relative h-[110px] w-[110px] cursor-grab" // Adjusted size for draggable items
            >
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.id}
                fill
                className="object-contain drop-shadow-lg"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Error message */}
      {errorMessage && <div className="mt-8 text-red-600 font-medium text-lg text-center">{errorMessage}</div>}

      {/* Success message */}
      {isCompleted && successMessage && (
        <div className="mt-8">
          <SuccessMessage message={successMessage} />
        </div>
      )}

      {/* New Navigation Buttons */}
      <div className="flex justify-center gap-4 mt-8 w-full">
        {/* All buttons in same container with identical dimensions */}
        <div className="flex gap-4 items-end">
          {/* WRÓĆ Button - always available in sequence-game-2 */}
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
