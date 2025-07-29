"use client"

import type React from "react"

import { useState, useMemo } from "react"
import Image from "next/image"
import { useGameCompletion } from "@/hooks/use-game-completion"
import { getRandomSuccessMessage } from "@/lib/success-messages"
import { useSeason } from "@/contexts/season-context"
import SuccessMessage from "./success-message"

interface SequenceGameProps {
  onMenuClick: () => void
}

export default function SequenceGame({ onMenuClick }: SequenceGameProps) {
  const { selectedSeason, getThemeColors } = useSeason()
  const theme = getThemeColors()

  // Define items based on season
  const springItems = useMemo(
    () => ({
      butterfly: { id: "butterfly", image: "/images/butterfly_yellow_new.svg" },
      ladybug: { id: "ladybug", image: "/images/ladybug.svg" },
    }),
    [],
  )

  const summerItems = useMemo(
    () => ({
      butterfly: { id: "butterfly", image: "/images/watermelon_summer.svg" },
      ladybug: { id: "ladybug", image: "/images/strawberry_summer.svg" },
    }),
    [],
  )

  const autumnItems = useMemo(
    () => ({
      butterfly: { id: "butterfly", image: "/images/squirel_autumn.svg" },
      ladybug: { id: "ladybug", image: "/images/hedgehog_autumn.svg" },
    }),
    [],
  )

  const winterItems = useMemo(
    () => ({
      butterfly: { id: "butterfly", image: "/images/snowman_winter.svg" },
      ladybug: { id: "ladybug", image: "/images/snowflake_01_winter.svg" },
    }),
    [],
  )

  const items = useMemo(() => {
    if (selectedSeason === "lato") return summerItems
    if (selectedSeason === "jesien") return autumnItems
    if (selectedSeason === "zima") return winterItems // Added winter items
    return springItems
  }, [selectedSeason, springItems, summerItems, autumnItems, winterItems])

  // Define the sequence items
  const sequenceItems = useMemo(
    () => [
      items.butterfly,
      items.ladybug,
      items.butterfly,
      { id: "empty", image: "" }, // Empty slot to be filled
      items.butterfly,
      items.ladybug,
    ],
    [items],
  )

  // Draggable items
  const draggableItems = useMemo(() => [items.butterfly, items.ladybug], [items])

  // Get title box and game ID based on season
  const titleBoxImage =
    selectedSeason === "lato"
      ? "/images/title_box_small_summer.svg"
      : selectedSeason === "jesien"
        ? "/images/title_box_small_autumn.svg"
        : selectedSeason === "zima" // Added winter title box
          ? "/images/title_box_small_winter.svg"
          : "/images/title_box_small.png"

  const gameId =
    selectedSeason === "lato"
      ? "sequence-game-summer"
      : selectedSeason === "jesien"
        ? "sequence-game-autumn"
        : selectedSeason === "zima" // Added winter game ID
          ? "sequence-game-winter"
          : "sequence-game"

  // State for tracking if the sequence is completed
  const [isCompleted, setIsCompleted] = useState(false)

  // State for tracking the current dragged item
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  // Add after existing state declarations
  const [completedPlacements, setCompletedPlacements] = useState<Set<number>>(new Set())
  const [showSuccess, setShowSuccess] = useState(false)

  // State for success message
  const [successMessage, setSuccessMessage] = useState<string>("")

  // Use the game completion hook
  const { recordCompletion, isLoggedIn } = useGameCompletion()

  // Handle drag start
  const handleDragStart = (id: string) => {
    setDraggedItem(id)
  }

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  // Handle drop
  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()

    // Find the target slot (should be empty)
    const targetItem = sequenceItems[targetIndex]
    if (targetItem.id !== "empty") {
      return // Can't drop on non-empty slots
    }

    // Determine the correct answer based on the pattern
    // Pattern: butterfly, ladybug, butterfly, [empty], butterfly, ladybug
    // So position 3 (index 3) should be "ladybug"
    const correctAnswer = targetIndex === 3 ? "ladybug" : "butterfly"

    if (draggedItem === correctAnswer) {
      // Mark this placement as completed
      const newCompletedPlacements = new Set(completedPlacements)
      newCompletedPlacements.add(targetIndex)
      setCompletedPlacements(newCompletedPlacements)

      // Check if all empty slots are now filled correctly
      const emptySlots = sequenceItems.map((item, index) => ({ item, index })).filter(({ item }) => item.id === "empty")

      const allSlotsCompleted = emptySlots.every(({ index }) => newCompletedPlacements.has(index))

      if (allSlotsCompleted) {
        setIsCompleted(true)
        setShowSuccess(true)
        // Get a random success message
        setSuccessMessage(getRandomSuccessMessage())

        console.log("🎉 Sequence game completed! All items placed correctly.")

        // Record completion when game is finished
        if (isLoggedIn) {
          recordCompletion(gameId).then((success) => {
            if (success) {
              console.log("✅ Sequence game completion recorded successfully")
            }
          })
        }
      }
    }
    // Remove error handling - no messages for incorrect placements

    setDraggedItem(null)
  }

  // Handle touch events for tablets
  const handleTouchStart = (e: React.TouchEvent, id: string) => {
    e.preventDefault()
    setDraggedItem(id)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault()
  }

  const handleTouchEnd = (e: React.TouchEvent, targetIndex?: number) => {
    e.preventDefault()

    if (draggedItem && targetIndex !== undefined) {
      // Find the target slot (should be empty)
      const targetItem = sequenceItems[targetIndex]
      if (targetItem.id !== "empty") {
        setDraggedItem(null)
        return // Can't drop on non-empty slots
      }

      // Determine the correct answer based on the pattern
      const correctAnswer = targetIndex === 3 ? "ladybug" : "butterfly"

      if (draggedItem === correctAnswer) {
        // Mark this placement as completed
        const newCompletedPlacements = new Set(completedPlacements)
        newCompletedPlacements.add(targetIndex)
        setCompletedPlacements(newCompletedPlacements)

        // Check if all empty slots are now filled correctly
        const emptySlots = sequenceItems
          .map((item, index) => ({ item, index }))
          .filter(({ item }) => item.id === "empty")

        const allSlotsCompleted = emptySlots.every(({ index }) => newCompletedPlacements.has(index))

        if (allSlotsCompleted) {
          setIsCompleted(true)
          setShowSuccess(true)
          // Get a random success message
          setSuccessMessage(getRandomSuccessMessage())

          console.log("🎉 Sequence game completed! All items placed correctly.")

          // Record completion when game is finished
          if (isLoggedIn) {
            recordCompletion(gameId).then((success) => {
              if (success) {
                console.log("✅ Sequence game completion recorded successfully")
              }
            })
          }
        }
      }
    }

    setDraggedItem(null)
  }

  // Replace the resetGame function
  const resetGame = () => {
    setIsCompleted(false)
    setShowSuccess(false)
    setCompletedPlacements(new Set())
    setSuccessMessage("")
  }

  return (
    <div className="w-full max-w-4xl" style={{ backgroundColor: theme.background }}>
      {/* Header with title */}
      <div className="w-full flex justify-between items-center mb-12">
        <div className="relative w-16 h-16">
          <Image
            src={selectedSeason === "zima" ? "/images/sound_winter.svg" : theme.soundIcon || "/placeholder.svg"}
            alt="Sound"
            fill
            className="object-contain cursor-pointer"
          />
        </div>

        <div className="relative h-24 w-80 md:w-[500px] flex items-center justify-center">
          <Image src={titleBoxImage || "/placeholder.svg"} alt="Title box" fill className="object-contain" />
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
      <div className="flex flex-col items-center mt-[50px]">
        {/* Sequence row */}
        <div className="flex justify-center gap-4 w-full mb-16">
          {sequenceItems.map((item, index) => (
            <div
              key={`sequence-${index}`}
              className="relative h-[100px] w-[100px]"
              onDragOver={item.id === "empty" ? handleDragOver : undefined}
              onDrop={item.id === "empty" ? (e) => handleDrop(e, index) : undefined}
              onTouchEnd={item.id === "empty" ? (e) => handleTouchEnd(e, index) : undefined}
            >
              {item.id !== "empty" ? (
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.id}
                  fill
                  className={`object-contain ${selectedSeason === "zima" ? "winter-item-shadow" : ""}`}
                />
              ) : completedPlacements.has(index) ? (
                <Image
                  src={index === 3 ? items.ladybug.image : items.butterfly.image}
                  alt={index === 3 ? "Ladybug" : "Butterfly"}
                  fill
                  className={`object-contain ${selectedSeason === "zima" ? "winter-item-shadow" : ""}`}
                />
              ) : (
                <div className="relative h-full w-full">
                  <div className="relative h-[140px] w-[140px] -mt-5 -ml-5">
                    <Image src="/images/white_box_medium.svg" alt="Empty Box" fill className="object-contain" />
                  </div>
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
              onTouchStart={(e) => handleTouchStart(e, item.id)}
              onTouchMove={handleTouchMove}
              onTouchEnd={(e) => handleTouchEnd(e)}
              className={`relative h-[100px] w-[100px] cursor-grab touch-manipulation`}
            >
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.id}
                fill
                className={`object-contain ${selectedSeason === "zima" ? "winter-item-shadow" : ""}`}
              />
            </div>
          ))}
        </div>

        {/* Success message */}
        {showSuccess && <SuccessMessage message={successMessage} />}
      </div>

      {/* Login reminder for non-logged in users */}
      {!isLoggedIn && (
        <div className="mt-4 text-center text-gray-600">
          <p>Zaloguj się, aby zapisać swój postęp!</p>
        </div>
      )}
      {/* Winter-specific styles */}
      <style jsx>{`
        .winter-item-shadow {
          filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3));
        }
      `}</style>
    </div>
  )
}
