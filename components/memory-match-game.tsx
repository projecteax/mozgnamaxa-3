"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"

import { useGameCompletionWithHistory } from "@/hooks/use-game-completion"
import { getRandomSuccessMessage } from "@/lib/success-messages"
import { useSeason } from "@/contexts/season-context"
import SuccessMessage from "./success-message"
import SoundButtonEnhanced from "./sound-button-enhanced"

interface MemoryMatchGameProps {
  onMenuClick: () => void
  onBack?: () => void
  onNext?: () => void
  onRetry?: () => void
  userLoggedIn?: boolean
  currentSeason?: string
  isGameCompleted?: boolean
}

interface MemoryItem {
  id: string
  image: string
  name: string
  revealed: boolean
}

interface DropZone {
  id: string
  itemId: string | null
  correctItemId: string
}

export default function MemoryMatchGame({ onMenuClick, onBack, onNext, onRetry, userLoggedIn = false, currentSeason = "wiosna", isGameCompleted = false }: MemoryMatchGameProps) {
  // Use the game completion hook
  const { recordCompletion, isLoggedIn, isHistoricallyCompleted } = useGameCompletionWithHistory("memory-match-game")

  // Use season context
  const { selectedSeason, getThemeColors } = useSeason()
  const theme = getThemeColors()
  const isSummer = selectedSeason === "lato"
  const isAutumn = selectedSeason === "jesien"
  const isWinter = selectedSeason === "zima"

  // Get theme-specific assets
  const soundIcon = isSummer
    ? "/images/sound_summer.svg"
    : isAutumn
      ? "/images/sound_autumn.svg"
      : isWinter
        ? "/images/sound_winter.svg"
        : "/images/sound_new.svg"
  const menuIcon = isSummer
    ? "/images/menu_summer.svg"
    : isAutumn
      ? "/images/menu_autumn.svg"
      : isWinter
        ? "/images/menu_winter.svg"
        : "/images/menu_new.svg"
  const titleBox = isSummer
    ? "/images/title_box_small_summer.svg"
    : isAutumn
      ? "/images/title_box_small_autumn.svg"
      : isWinter
        ? "/images/title_box_small_winter.svg"
        : "/images/green_large_box.svg"
  const cardCover = isSummer
    ? "/images/box_covered_summer.svg"
    : isAutumn
      ? "/images/box_covered_autumn.svg"
      : isWinter
        ? "/images/box_covered_winter.svg"
        : "/images/box_covered.png"

  // Define the memory items (top row) - different for each season
  const getMemoryItems = () => {
    if (isSummer) {
      return [
        { id: "sunglasses", image: "/images/sunglasses_summer.svg", name: "Sunglasses", revealed: false },
        { id: "umbrella", image: "/images/umbrella_summer.svg", name: "Umbrella", revealed: false },
        { id: "towel", image: "/images/towel_summer.svg", name: "Towel", revealed: false },
      ]
    } else if (isAutumn) {
      return [
        { id: "boots", image: "/images/boots_autumn.svg", name: "Boots", revealed: false },
        { id: "umbrella", image: "/images/umbrella_autumn.svg", name: "Umbrella", revealed: false },
        { id: "sweater", image: "/images/sweater_autumn.svg", name: "Sweater", revealed: false },
      ]
    } else if (isWinter) {
      return [
        { id: "angel", image: "/images/angel_winter.svg", name: "Angel", revealed: false },
        { id: "bell", image: "/images/bell_winter.svg", name: "Bell", revealed: false },
        { id: "lights", image: "/images/lights_winter.svg", name: "Lights", revealed: false },
      ]
    } else {
      return [
        { id: "snail", image: "/images/snail.svg", name: "Snail", revealed: false },
        { id: "frog", image: "/images/frog.svg", name: "Frog", revealed: false },
        { id: "grass", image: "/images/grass.svg", name: "Grass", revealed: false },
      ]
    }
  }

  const getDraggableItems = () => {
    if (isSummer) {
      return [
        { id: "sunglasses", image: "/images/sunglasses_summer.svg", name: "Sunglasses", placed: false },
        { id: "umbrella", image: "/images/umbrella_summer.svg", name: "Umbrella", placed: false },
        { id: "towel", image: "/images/towel_summer.svg", name: "Towel", placed: false },
      ]
    } else if (isAutumn) {
      return [
        { id: "boots", image: "/images/boots_autumn.svg", name: "Boots", placed: false },
        { id: "umbrella", image: "/images/umbrella_autumn.svg", name: "Umbrella", placed: false },
        { id: "sweater", image: "/images/sweater_autumn.svg", name: "Sweater", placed: false },
      ]
    } else if (isWinter) {
      return [
        { id: "angel", image: "/images/angel_winter.svg", name: "Angel", placed: false },
        { id: "bell", image: "/images/bell_winter.svg", name: "Bell", placed: false },
        { id: "lights", image: "/images/lights_winter.svg", name: "Lights", placed: false },
      ]
    } else {
      return [
        { id: "snail", image: "/images/snail.svg", name: "Snail", placed: false },
        { id: "frog", image: "/images/frog.svg", name: "Frog", placed: false },
        { id: "grass", image: "/images/grass.svg", name: "Grass", placed: false },
      ]
    }
  }

  const getDropZones = () => {
    if (isSummer) {
      return [
        { id: "drop-1", itemId: null, correctItemId: "sunglasses" },
        { id: "drop-2", itemId: null, correctItemId: "umbrella" },
        { id: "drop-3", itemId: null, correctItemId: "towel" },
      ]
    } else if (isAutumn) {
      return [
        { id: "drop-1", itemId: null, correctItemId: "boots" },
        { id: "drop-2", itemId: null, correctItemId: "umbrella" },
        { id: "drop-3", itemId: null, correctItemId: "sweater" },
      ]
    } else if (isWinter) {
      return [
        { id: "drop-1", itemId: null, correctItemId: "angel" },
        { id: "drop-2", itemId: null, correctItemId: "bell" },
        { id: "drop-3", itemId: null, correctItemId: "lights" },
      ]
    } else {
      return [
        { id: "drop-1", itemId: null, correctItemId: "snail" },
        { id: "drop-2", itemId: null, correctItemId: "frog" },
        { id: "drop-3", itemId: null, correctItemId: "grass" },
      ]
    }
  }

  const [memoryItems, setMemoryItems] = useState<MemoryItem[]>(getMemoryItems())
  const [draggableItems, setDraggableItems] = useState(getDraggableItems())
  const [dropZones, setDropZones] = useState<DropZone[]>(getDropZones())

  // State for tracking the current dragged item
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  // State for tracking if the game is completed
  const [isCompleted, setIsCompleted] = useState(false)

  // State for feedback message
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)

  const [successMessage, setSuccessMessage] = useState<string>("")

  // Timeout ref for memory item reveal
  const revealTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Get the number of correctly placed items
  const correctlyPlacedCount = dropZones.filter((zone) => zone.itemId !== null).length

  // Update items when season changes
  useEffect(() => {
    setMemoryItems(getMemoryItems())
    setDraggableItems(getDraggableItems())
    setDropZones(getDropZones())
    setIsCompleted(false)
    setFeedbackMessage(null)
    setSuccessMessage("")
  }, [selectedSeason])

  // Handle memory item click (reveal all items for 2 seconds)
  const handleMemoryItemClick = () => {
    // If all items are already revealed, do nothing
    if (memoryItems.every((item) => item.revealed)) return

    // Reveal all items
    setMemoryItems((prevItems) => prevItems.map((item) => ({ ...item, revealed: true })))

    // Hide all items after 2 seconds
    if (revealTimeoutRef.current) {
      clearTimeout(revealTimeoutRef.current)
    }

    revealTimeoutRef.current = setTimeout(() => {
      setMemoryItems((prevItems) => prevItems.map((item) => ({ ...item, revealed: false })))
    }, 2000)
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
  const handleDrop = (e: React.DragEvent, dropZoneId: string) => {
    e.preventDefault()

    if (!draggedItem) return

    // Check if the drop zone already has an item
    const dropZone = dropZones.find((zone) => zone.id === dropZoneId)
    if (!dropZone) return

    // If drop zone already has an item, do nothing
    if (dropZone.itemId) return

    // Get the index of the drop zone
    const dropZoneIndex = dropZones.findIndex((zone) => zone.id === dropZoneId)

    // Only allow drops in sequence - check if this is the next expected drop zone
    if (dropZoneIndex !== correctlyPlacedCount) {
      // Show error feedback for wrong sequence
      setFeedbackMessage("Ułóż w kolejności!")
      setTimeout(() => {
        setFeedbackMessage(null)
      }, 2000)
      setDraggedItem(null)
      return
    }

    // Check if the placement is correct
    const isCorrect = dropZone.correctItemId === draggedItem

    if (isCorrect) {
      // If correct, update the drop zone with the dragged item
      setDropZones((prevZones) =>
        prevZones.map((zone) => (zone.id === dropZoneId ? { ...zone, itemId: draggedItem } : zone)),
      )

      // Mark the dragged item as placed
      setDraggableItems((prevItems) =>
        prevItems.map((item) => (item.id === draggedItem ? { ...item, placed: true } : item)),
      )

      // Show success feedback
      setFeedbackMessage("Brawo! Dobrze dopasowane!")
    } else {
      // If incorrect, do not update the drop zone (item returns to original position)
      // Show error feedback
      setFeedbackMessage("Przykro mi, to nie pasuje tutaj.")
    }

    // Clear feedback message after 2 seconds
    setTimeout(() => {
      setFeedbackMessage(null)
    }, 2000)

    // Reset dragged item
    setDraggedItem(null)

    // Check if all items are placed correctly - simplified logic
    const updatedZones = dropZones.map((zone) => (zone.id === dropZoneId ? { ...zone, itemId: draggedItem } : zone))

    // Check if all zones have items and all are correct
    const allZonesFilled = updatedZones.every((zone) => zone.itemId !== null)
    const allCorrect = updatedZones.every((zone) => zone.itemId === zone.correctItemId)

    if (allZonesFilled && allCorrect && !isCompleted) {
      console.log("Game completed! All items placed correctly.")
      setIsCompleted(true)
      setFeedbackMessage(null)
      setSuccessMessage(getRandomSuccessMessage())

      // Record completion in database
      if (isLoggedIn) {
        console.log("Recording completion for memory-match game")
        recordCompletion()
      } else {
        console.log("User not logged in - completion not recorded")
      }
    }
  }

  // Reset the game
  const resetGame = () => {
    setSuccessMessage("")
    // Reset drop zones
    setDropZones((prevZones) => prevZones.map((zone) => ({ ...zone, itemId: null })))

    // Reset draggable items - all available again
    setDraggableItems((prevItems) =>
      prevItems.map((item) => ({
        ...item,
        placed: false,
      })),
    )

    // Reset memory items
    setMemoryItems((prevItems) => prevItems.map((item) => ({ ...item, revealed: false })))

    // Reset game state
    setIsCompleted(false)
    setFeedbackMessage(null)

    // Auto-reveal items again for 2 seconds
    setMemoryItems((prevItems) => prevItems.map((item) => ({ ...item, revealed: true })))
    setTimeout(() => {
      setMemoryItems((prevItems) => prevItems.map((item) => ({ ...item, revealed: false })))
    }, 2000)
  }

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (revealTimeoutRef.current) {
        clearTimeout(revealTimeoutRef.current)
      }
    }
  }, [])

  // Auto-reveal items when game loads
  useEffect(() => {
    // Reveal all items immediately when component mounts
    setMemoryItems((prevItems) => prevItems.map((item) => ({ ...item, revealed: true })))

    // Hide all items after 2 seconds
    const timeout = setTimeout(() => {
      setMemoryItems((prevItems) => prevItems.map((item) => ({ ...item, revealed: false })))
    }, 2000)

    return () => clearTimeout(timeout)
  }, [])

  return (
    <div className="w-full max-w-4xl" style={{ backgroundColor: theme.background }}>
      {/* Header with title */}
      <div className="w-full flex justify-between items-center mb-8">
        <div className="relative w-16 h-16">
          <SoundButtonEnhanced
            text="ZAPAMIĘTAJ I UŁÓŻ TAK SAMO."
            soundIcon={theme.soundIcon || "/images/sound_icon_dragon_page.svg"}
            size="xl"
            className="w-full h-full"
          />
        </div>

        <div className="relative h-24 w-80 md:w-[500px] flex items-center justify-center">
          <Image src={titleBox || "/placeholder.svg"} alt="Title box" fill className="object-contain" />
          <span className="relative z-10 text-white text-xl md:text-2xl font-sour-gummy font-thin tracking-wider">
            ZAPAMIĘTAJ I UŁÓŻ TAK SAMO.
          </span>
        </div>

        <div className="relative w-16 h-16" onClick={onMenuClick}>
          <Image src={menuIcon || "/placeholder.svg"} alt="Menu" fill className="object-contain cursor-pointer" />
        </div>
      </div>

      {/* Game area */}
      <div className="flex flex-col items-center mt-8">
        {/* Main content area */}
        <div className="w-full flex">
          {/* Left side with memory and drop zones */}
          <div className="w-3/4 flex flex-col gap-8 justify-center">
            {/* Memory items row (top row) */}
            <div className="flex justify-center gap-6">
              {memoryItems.map((item) => (
                <div
                  key={`memory-${item.id}`}
                  className="relative h-32 w-32 cursor-pointer"
                  onClick={handleMemoryItemClick}
                >
                  {/* White box background */}
                  <div className="absolute inset-0">
                    <Image src="/images/white_box_medium.svg" alt="Box" fill className="object-contain" />
                  </div>

                  {/* Item image (visible when revealed) */}
                  <div
                    className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                      item.revealed ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <div className="relative h-24 w-24">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-contain" />
                    </div>
                  </div>

                  {/* Green cover (visible when not revealed) */}
                  <div
                    className={`absolute inset-0 transition-opacity duration-300 ${
                      item.revealed ? "opacity-0" : "opacity-100"
                    }`}
                  >
                    <Image src={cardCover || "/placeholder.svg"} alt="Covered box" fill className="object-contain" />
                  </div>
                </div>
              ))}
            </div>

            {/* Drop zones row (bottom row) */}
            <div className="flex justify-center gap-6">
              {dropZones.map((zone, index) => {
                // Determine if this box should be semi-transparent
                // Only make it semi-transparent if it's empty AND not the next available box
                const isAvailable = zone.itemId !== null || correctlyPlacedCount === index

                return (
                  <div
                    key={`zone-${zone.id}`}
                    className={`relative h-32 w-32 ${isAvailable ? "" : "opacity-50 pointer-events-none"}`}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, zone.id)}
                  >
                    {/* White box background */}
                    <div className="absolute inset-0">
                      <Image src="/images/white_box_medium.svg" alt="Box" fill className="object-contain" />
                    </div>

                    {/* Show the dropped item if any */}
                    {zone.itemId && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative h-24 w-24">
                          <Image
                            src={
                              isSummer
                                ? `/images/${zone.itemId}_summer.svg`
                                : isAutumn
                                  ? `/images/${zone.itemId}_autumn.svg`
                                  : isWinter
                                    ? `/images/${zone.itemId}_winter.svg`
                                    : `/images/${zone.itemId}.svg`
                            }
                            alt={zone.itemId}
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right side with draggable items */}
          <div className="w-1/4 flex flex-col items-center justify-center gap-8">
            {draggableItems.map((item) => {
              // Skip if already placed
              if (item.placed) return null

              return (
                <div
                  key={`drag-${item.id}`}
                  className="relative h-24 w-24 cursor-grab"
                  draggable
                  onDragStart={() => handleDragStart(item.id)}
                >
                  <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-contain" />
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Success message and button - only visible when the game is complete */}
      {isCompleted && (
        <div className="flex flex-col items-center mt-8">
          <SuccessMessage message={successMessage} />
        </div>
      )}

      {/* New Navigation Buttons - Always visible */}
      <div className="flex justify-center gap-4 mt-8 w-full">
        {/* All buttons in same container with identical dimensions */}
        <div className="flex gap-4 items-end">
          {/* WRÓĆ Button - always available in memory-match-game */}
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
