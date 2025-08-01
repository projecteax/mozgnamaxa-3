"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { useGameCompletionWithHistory } from "@/hooks/use-game-completion"
import { getRandomSuccessMessage } from "@/lib/success-messages"
import { useSeason } from "@/contexts/season-context"
import SuccessMessage from "./success-message"
import SoundButtonEnhanced from "./sound-button-enhanced"

// Define the types for our halves
type Half = {
  id: string
  name: string
  image: string
  type: "left" | "right"
  pairId: string
}

interface FindMissingHalfGameProps {
  onMenuClick: () => void
  onComplete?: () => void
  onBack?: () => void
  onNext?: () => void
  onRetry?: () => void
  userLoggedIn?: boolean
  currentSeason?: string
  isGameCompleted?: boolean
}

export default function FindMissingHalfGame({ onMenuClick, onComplete, onBack, onNext, onRetry, userLoggedIn = false, currentSeason = "wiosna", isGameCompleted = false }: FindMissingHalfGameProps) {
  const { selectedSeason, getThemeColors } = useSeason()
  const theme = getThemeColors()
  const isSummer = selectedSeason === "lato"
  const isAutumn = selectedSeason === "jesien"
  const isWinter = selectedSeason === "zima"

  // Define the halves based on season
  const getHalves = (): Half[] => {
    if (isWinter) {
      return [
        // Top row - left halves
        {
          id: "mask_01_left",
          name: "Mask 01 Left",
          image: "/images/mask_01_winter_left.svg",
          type: "left",
          pairId: "01",
        },
        {
          id: "mask_02_left",
          name: "Mask 02 Left",
          image: "/images/mask_02_winter_left.svg",
          type: "left",
          pairId: "02",
        },
        {
          id: "mask_03_left",
          name: "Mask 03 Left",
          image: "/images/mask_03_winter_left.svg",
          type: "left",
          pairId: "03",
        },
        {
          id: "mask_04_left",
          name: "Mask 04 Left",
          image: "/images/mask_04_winter_left.svg",
          type: "left",
          pairId: "04",
        },
        // Bottom row - right halves (in different order)
        {
          id: "mask_02_right",
          name: "Mask 02 Right",
          image: "/images/mask_02_winter_right.svg",
          type: "right",
          pairId: "02",
        },
        {
          id: "mask_04_right",
          name: "Mask 04 Right",
          image: "/images/mask_04_winter_right.svg",
          type: "right",
          pairId: "04",
        },
        {
          id: "mask_01_right",
          name: "Mask 01 Right",
          image: "/images/mask_01_winter_right.svg",
          type: "right",
          pairId: "01",
        },
        {
          id: "mask_03_right",
          name: "Mask 03 Right",
          image: "/images/mask_03_winter_right.svg",
          type: "right",
          pairId: "03",
        },
      ]
    } else if (isAutumn) {
      return [
        // Top row - left halves
        {
          id: "leaf_01_left",
          name: "Leaf 01 Left",
          image: "/images/leaf_01_half_left.svg",
          type: "left",
          pairId: "01",
        },
        {
          id: "leaf_02_left",
          name: "Leaf 02 Left",
          image: "/images/leaf_02_half_left.svg",
          type: "left",
          pairId: "02",
        },
        {
          id: "leaf_03_left",
          name: "Leaf 03 Left",
          image: "/images/leaf_03_half_left.svg",
          type: "left",
          pairId: "03",
        },
        {
          id: "leaf_04_left",
          name: "Leaf 04 Left",
          image: "/images/leaf_04_half_left.svg",
          type: "left",
          pairId: "04",
        },
        // Bottom row - right halves (in different order)
        {
          id: "leaf_02_right",
          name: "Leaf 02 Right",
          image: "/images/leaf_02_half_right.svg",
          type: "right",
          pairId: "02",
        },
        {
          id: "leaf_04_right",
          name: "Leaf 04 Right",
          image: "/images/leaf_04_half_right.svg",
          type: "right",
          pairId: "04",
        },
        {
          id: "leaf_01_right",
          name: "Leaf 01 Right",
          image: "/images/leaf_01_half_right.svg",
          type: "right",
          pairId: "01",
        },
        {
          id: "leaf_03_right",
          name: "Leaf 03 Right",
          image: "/images/leaf_03_half_right.svg",
          type: "right",
          pairId: "03",
        },
      ]
    } else if (isSummer) {
      return [
        // Top row - left halves
        {
          id: "icecream_01_left",
          name: "Ice Cream 01 Left",
          image: "/images/icecream_01_summer_left.svg",
          type: "left",
          pairId: "01",
        },
        {
          id: "icecream_02_left",
          name: "Ice Cream 02 Left",
          image: "/images/icecream_02_summer_left.svg",
          type: "left",
          pairId: "02",
        },
        {
          id: "icecream_03_left",
          name: "Ice Cream 03 Left",
          image: "/images/icecream_03_summer_left.svg",
          type: "left",
          pairId: "03",
        },
        {
          id: "icecream_04_left",
          name: "Ice Cream 04 Left",
          image: "/images/icecream_04_summer_left.svg",
          type: "left",
          pairId: "04",
        },
        // Bottom row - right halves (in different order)
        {
          id: "icecream_02_right",
          name: "Ice Cream 02 Right",
          image: "/images/icecream_02_summer_right.svg",
          type: "right",
          pairId: "02",
        },
        {
          id: "icecream_04_right",
          name: "Ice Cream 04 Right",
          image: "/images/icecream_04_summer_right.svg",
          type: "right",
          pairId: "04",
        },
        {
          id: "icecream_01_right",
          name: "Ice Cream 01 Right",
          image: "/images/icecream_01_summer_right.svg",
          type: "right",
          pairId: "01",
        },
        {
          id: "icecream_03_right",
          name: "Ice Cream 03 Right",
          image: "/images/icecream_03_summer_right.svg",
          type: "right",
          pairId: "03",
        },
      ]
    } else {
      return [
        // Top row - left halves
        { id: "chick_01_left", name: "Chick 01 Left", image: "/images/chick_01_left.svg", type: "left", pairId: "01" },
        { id: "chick_02_left", name: "Chick 02 Left", image: "/images/chick_02_left.svg", type: "left", pairId: "02" },
        { id: "chick_03_left", name: "Chick 03 Left", image: "/images/chick_03_left.svg", type: "left", pairId: "03" },
        { id: "chick_04_left", name: "Chick 04 Left", image: "/images/chick_04_left.svg", type: "left", pairId: "04" },
        // Bottom row - right halves (in different order)
        {
          id: "chick_02_right",
          name: "Chick 02 Right",
          image: "/images/chick_02_right.svg",
          type: "right",
          pairId: "02",
        },
        {
          id: "chick_04_right",
          name: "Chick 04 Right",
          image: "/images/chick_04_right.svg",
          type: "right",
          pairId: "04",
        },
        {
          id: "chick_01_right",
          name: "Chick 01 Right",
          image: "/images/chick_01_right.svg",
          type: "right",
          pairId: "01",
        },
        {
          id: "chick_03_right",
          name: "Chick 03 Right",
          image: "/images/chick_03_right.svg",
          type: "right",
          pairId: "03",
        },
      ]
    }
  }

  const halves = getHalves()

  // Separate left and right halves for positioning
  const leftHalves = halves.filter((half) => half.type === "left")
  const rightHalves = [
    halves.find((half) => half.id.includes("02") && half.type === "right")!,
    halves.find((half) => half.id.includes("04") && half.type === "right")!,
    halves.find((half) => half.id.includes("01") && half.type === "right")!,
    halves.find((half) => half.id.includes("03") && half.type === "right")!,
  ]

  // State for tracking matched pairs and their positions
  const [matchedPairs, setMatchedPairs] = useState<Record<string, { topRow: boolean }>>({})

  // State for tracking the current dragged item
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  // State for tracking if the game is complete
  const [isGameComplete, setIsGameComplete] = useState(false)

  // State for success message
  const [successMessage, setSuccessMessage] = useState<string>("")

  // Use the game completion hook
  const { recordCompletion, isLoggedIn, isHistoricallyCompleted } = useGameCompletionWithHistory("find-missing-half-game")

  // Check if all pairs are matched
  useEffect(() => {
    if (Object.keys(matchedPairs).length === 4) {
      setIsGameComplete(true)
      setSuccessMessage(getRandomSuccessMessage())
      if (isLoggedIn) {
        recordCompletion()
      }
      // Call onComplete callback after 3 seconds to show success message
      if (onComplete) {
        setTimeout(() => {
        onComplete()
        }, 3000) // 3 second delay
      }
    } else {
      setIsGameComplete(false)
    }
  }, [matchedPairs, isLoggedIn, recordCompletion, onComplete])

  // Reset game when season changes
  useEffect(() => {
    setMatchedPairs({})
    setIsGameComplete(false)
    setSuccessMessage("")
    setDraggedItem(null)
  }, [selectedSeason])

  // Reset game function
  const resetGame = () => {
    setMatchedPairs({})
    setIsGameComplete(false)
    setSuccessMessage("")
    setDraggedItem(null)
  }

  // Handle drag start
  const handleDragStart = (id: string) => {
    setDraggedItem(id)
  }

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  // Handle drop
  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()

    if (!draggedItem) return

    const draggedHalf = halves.find((half) => half.id === draggedItem)
    const targetHalf = halves.find((half) => half.id === targetId)

    if (!draggedHalf || !targetHalf) return

    // Check if they form a valid pair (same pairId but different types)
    if (draggedHalf.pairId === targetHalf.pairId && draggedHalf.type !== targetHalf.type) {
      // Determine if the match should be in the top row or bottom row
      const isTargetInTopRow = leftHalves.some((half) => half.id === targetId)

      // Add the pair to matched pairs if not already matched
      if (!matchedPairs[draggedHalf.pairId]) {
        setMatchedPairs((prev) => ({
          ...prev,
          [draggedHalf.pairId]: { topRow: isTargetInTopRow },
        }))
      }
    }

    setDraggedItem(null)
  }

  // Check if a half is part of a matched pair
  const isMatched = (half: Half) => {
    return matchedPairs[half.pairId] !== undefined
  }

  // Check if a half should be draggable (not matched)
  const isDraggable = (half: Half) => {
    return !isMatched(half)
  }

  // Check if a matched pair should be displayed in the top row
  const isMatchedInTopRow = (pairId: string) => {
    return matchedPairs[pairId]?.topRow === true
  }

  // Get the right half image for a given pair ID
  const getRightHalfImage = (pairId: string) => {
    if (isWinter) {
      return `/images/mask_${pairId}_winter_right.svg`
    } else if (isAutumn) {
      return `/images/leaf_${pairId}_half_right.svg`
    } else if (isSummer) {
      return `/images/icecream_${pairId}_summer_right.svg`
    } else {
      return `/images/chick_${pairId}_right.svg`
    }
  }

  // Get the left half image for a given pair ID
  const getLeftHalfImage = (pairId: string) => {
    if (isWinter) {
      return `/images/mask_${pairId}_winter_left.svg`
    } else if (isAutumn) {
      return `/images/leaf_${pairId}_half_left.svg`
    } else if (isSummer) {
      return `/images/icecream_${pairId}_summer_left.svg`
    } else {
      return `/images/chick_${pairId}_left.svg`
    }
  }

  // Theme-specific assets
  const soundIcon = isWinter
    ? "/images/sound_winter.svg"
    : isAutumn
      ? "/images/sound_autumn.svg"
      : isSummer
        ? "/images/sound_summer.svg"
        : "/images/sound_new.svg"
  const menuIcon = isWinter
    ? "/images/menu_winter.svg"
    : isAutumn
      ? "/images/menu_autumn.svg"
      : isSummer
        ? "/images/menu_summer.svg"
        : "/images/menu_new.svg"
  const titleBox = isWinter
    ? "/images/title_box_small_winter.svg"
    : isAutumn
      ? "/images/title_box_small_autumn.svg"
      : isSummer
        ? "/images/title_box_small_summer.svg"
        : "/images/title_box_small.png"

  return (
    <div className="w-full max-w-6xl" style={{ backgroundColor: theme.backgroundColor }}>
      {/* Header with title - consistent with matching-game */}
      <div className="w-full flex justify-between items-center mb-8">
        <div className="relative w-16 h-16">
          <SoundButtonEnhanced
            text="ZNAJDŹ BRAKUJĄCĄ POŁOWĘ."
            soundIcon={soundIcon || "/images/sound_icon_dragon_page.svg"}
            size="xl"
            className="w-full h-full"
          />
        </div>

        <div className="relative h-24 w-80 md:w-[500px] flex items-center justify-center">
          <Image src={titleBox || "/placeholder.svg"} alt="Title box" fill className="object-contain" />
          <span className="relative z-10 text-white text-2xl md:text-3xl font-sour-gummy font-thin">
            ZNAJDŹ BRAKUJĄCĄ POŁOWĘ.
          </span>
        </div>

        <div className="relative w-16 h-16" onClick={onMenuClick}>
          <Image src={menuIcon || "/placeholder.svg"} alt="Menu" fill className="object-contain cursor-pointer" />
        </div>
      </div>

      {/* Game area */}
      <div className="flex flex-col items-center gap-12">
        {/* Top row */}
        <div className="flex gap-8 justify-center items-center">
          {leftHalves.map((leftHalf) => {
            const isLeftMatched = isMatched(leftHalf)
            const shouldShowMatchedPairHere = isLeftMatched && isMatchedInTopRow(leftHalf.pairId)

            return (
              <div key={leftHalf.id} className="flex items-center justify-center min-w-[144px] min-h-[144px]">
                {/* Extended drop zone that covers the image and area to the right */}
                <div
                  className="flex items-center justify-center relative"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, leftHalf.id)}
                  style={{
                    minWidth: "192px",
                    minHeight: "144px",
                    position: "relative",
                  }}
                >
                  {/* Invisible extended drop area to the right for left halves */}
                  <div
                    className="absolute inset-0 w-full h-full"
                    style={{
                      left: "0",
                      right: "-96px",
                      top: "0",
                      bottom: "0",
                      zIndex: 1,
                    }}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, leftHalf.id)}
                  />

                  {/* Show matched pair or individual left half */}
                  {shouldShowMatchedPairHere ? (
                    // Show complete matched pair using simple positioning
                    <div
                      className="relative z-10"
                      style={{
                        width: "auto",
                        height: "auto",
                        position: "relative",
                      }}
                    >
                      <img
                        src={leftHalf.image || "/placeholder.svg"}
                        alt={leftHalf.name}
                        style={{
                          height: "auto",
                          width: "auto",
                          transform: "scale(1.2)",
                          display: "block",
                          float: "left",
                        }}
                      />
                      <img
                        src={getRightHalfImage(leftHalf.pairId) || "/placeholder.svg"}
                        alt={`${isWinter ? "Mask" : isAutumn ? "Leaf" : isSummer ? "Ice Cream" : "Chick"} ${leftHalf.pairId} Right`}
                        style={{
                          height: "auto",
                          width: "auto",
                          transform: "scale(1.2)",
                          display: "block",
                          float: "left",
                          marginLeft: "0px", // Set to 0px for all seasons to ensure proper alignment
                        }}
                      />
                      <div style={{ clear: "both" }}></div>
                    </div>
                  ) : !isLeftMatched ? (
                    // Show draggable left half
                    <img
                      src={leftHalf.image || "/placeholder.svg"}
                      alt={leftHalf.name}
                      draggable={true}
                      onDragStart={() => handleDragStart(leftHalf.id)}
                      className="cursor-grab opacity-90 relative z-10"
                      style={{
                        height: "auto",
                        width: "auto",
                        transform: "scale(1.2)",
                        display: "block",
                      }}
                    />
                  ) : null}
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom row */}
        <div className="flex gap-8 justify-center items-center">
          {rightHalves.map((rightHalf) => {
            const isRightMatched = isMatched(rightHalf)
            const shouldShowMatchedPairHere = isRightMatched && !isMatchedInTopRow(rightHalf.pairId)

            return (
              <div key={rightHalf.id} className="flex items-center justify-center min-w-[144px] min-h-[144px]">
                {/* Extended drop zone that covers the image and area to the left */}
                <div
                  className="flex items-center justify-center relative"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, rightHalf.id)}
                  style={{
                    minWidth: "192px",
                    minHeight: "144px",
                    position: "relative",
                  }}
                >
                  {/* Invisible extended drop area to the left for right halves */}
                  <div
                    className="absolute inset-0 w-full h-full"
                    style={{
                      left: "-96px",
                      right: "0",
                      top: "0",
                      bottom: "0",
                      zIndex: 1,
                    }}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, rightHalf.id)}
                  />

                  {/* Show matched pair or individual right half */}
                  {shouldShowMatchedPairHere ? (
                    // Show complete matched pair using simple positioning
                    <div
                      className="relative z-10"
                      style={{
                        width: "auto",
                        height: "auto",
                        position: "relative",
                      }}
                    >
                      <img
                        src={getLeftHalfImage(rightHalf.pairId) || "/placeholder.svg"}
                        alt={`${isWinter ? "Mask" : isAutumn ? "Leaf" : isSummer ? "Ice Cream" : "Chick"} ${rightHalf.pairId} Left`}
                        style={{
                          height: "auto",
                          width: "auto",
                          transform: "scale(1.2)",
                          display: "block",
                          float: "left",
                        }}
                      />
                      <img
                        src={rightHalf.image || "/placeholder.svg"}
                        alt={rightHalf.name}
                        style={{
                          height: "auto",
                          width: "auto",
                          transform: "scale(1.2)",
                          display: "block",
                          float: "left",
                          marginLeft: "0px", // Set to 0px for all seasons to ensure proper alignment
                        }}
                      />
                      <div style={{ clear: "both" }}></div>
                    </div>
                  ) : !isRightMatched ? (
                    // Show draggable right half
                    <img
                      src={rightHalf.image || "/placeholder.svg"}
                      alt={rightHalf.name}
                      draggable={true}
                      onDragStart={() => handleDragStart(rightHalf.id)}
                      className="cursor-grab opacity-90 relative z-10"
                      style={{
                        height: "auto",
                        width: "auto",
                        transform: "scale(1.2)",
                        display: "block",
                      }}
                    />
                  ) : null}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Success message - only the main success message */}
      {isGameComplete && <SuccessMessage message={successMessage} />}

      {/* New Navigation Buttons - Always visible */}
      <div className="flex justify-center gap-4 mt-8 w-full">
        {/* All buttons in same container with identical dimensions */}
        <div className="flex gap-4 items-end">
          {/* WRÓĆ Button - always available in find-missing-half-game */}
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
            className={`relative w-52 h-14 transition-all ${isGameComplete ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed opacity-50'}`}
            onClick={isGameComplete ? resetGame : undefined}
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
                          className={`relative w-36 h-14 transition-all ${(userLoggedIn && !isGameComplete && !isHistoricallyCompleted) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-105'}`}
                          onClick={(userLoggedIn && !isGameComplete && !isHistoricallyCompleted) ? undefined : onNext}
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
