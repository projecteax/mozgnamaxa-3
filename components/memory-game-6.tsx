"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"

import { useGameCompletion } from "@/hooks/use-game-completion"

interface MemoryGame6Props {
  onMenuClick: () => void
}

interface AnimalItem {
  id: string
  name: string
  image: string
  shadowImage: string
  matched: boolean
}

interface DropZone {
  id: string
  animalId: string
  filled: boolean
  position: number
}

export default function MemoryGame6({ onMenuClick }: MemoryGame6Props) {
  // Use the game completion hook
  const { recordCompletion, isLoggedIn } = useGameCompletion()

  // Define the animal items in the order shown in the Figma design
  const [animals, setAnimals] = useState<AnimalItem[]>([
    {
      id: "stork",
      name: "Stork",
      image: "/images/stork.svg",
      shadowImage: "/images/stork_shadow.svg",
      matched: false,
    },
    {
      id: "chicken",
      name: "Chicken",
      image: "/images/chicken.svg",
      shadowImage: "/images/chicken_shadow.svg",
      matched: false,
    },
    {
      id: "bee",
      name: "Bee",
      image: "/images/bee.svg",
      shadowImage: "/images/bee_shadow.svg",
      matched: false,
    },
    {
      id: "rabbit",
      name: "Rabbit",
      image: "/images/rabbit.svg",
      shadowImage: "/images/rabbit_shadow.svg",
      matched: false,
    },
  ])

  // Define the drop zones (shadows) in the order shown in the Figma design
  const [dropZones, setDropZones] = useState<DropZone[]>([
    { id: "zone-rabbit", animalId: "rabbit", filled: false, position: 0 },
    { id: "zone-bee", animalId: "bee", filled: false, position: 1 },
    { id: "zone-stork", animalId: "stork", filled: false, position: 2 },
    { id: "zone-chicken", animalId: "chicken", filled: false, position: 3 },
  ])

  // State for tracking the current dragged item
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  // State for feedback message
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)

  // State for tracking if the game is completed
  const [isCompleted, setIsCompleted] = useState(false)

  // Handle drag start
  const handleDragStart = (id: string) => {
    setDraggedItem(id)
    setFeedbackMessage(null)
  }

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  // Handle drop
  const handleDrop = (e: React.DragEvent, zoneId: string) => {
    e.preventDefault()

    if (!draggedItem) return

    // Find the drop zone
    const dropZone = dropZones.find((zone) => zone.id === zoneId)
    if (!dropZone) return

    // If drop zone already has an item, do nothing
    if (dropZone.filled) {
      setFeedbackMessage("To miejsce jest już zajęte!")
      return
    }

    // Check if this is the correct match
    const isCorrect = dropZone.animalId === draggedItem

    if (isCorrect) {
      // Update the drop zone
      setDropZones((prevZones) => prevZones.map((zone) => (zone.id === zoneId ? { ...zone, filled: true } : zone)))

      // Update the animal as matched
      setAnimals((prevAnimals) =>
        prevAnimals.map((animal) => (animal.id === draggedItem ? { ...animal, matched: true } : animal)),
      )

      // Show success feedback
      setFeedbackMessage("Brawo! Dobrze dopasowane!")
    } else {
      // Show error feedback
      setFeedbackMessage("Przykro mi, to nie pasuje tutaj.")
    }

    // Reset dragged item
    setDraggedItem(null)

    // Check if all animals are matched
    setTimeout(() => {
      const allMatched = animals.every((animal) => (animal.id === draggedItem ? true : animal.matched))
      if (allMatched) {
        setIsCompleted(true)
        setFeedbackMessage("Gratulacje! Wszystkie pary znalezione!")

        // Record completion in database
        if (isLoggedIn) {
          recordCompletion("memory-game-6")
        }
      }
    }, 100)
  }

  // Reset the game
  const resetGame = () => {
    setAnimals((prevAnimals) => prevAnimals.map((animal) => ({ ...animal, matched: false })))
    setDropZones((prevZones) => prevZones.map((zone) => ({ ...zone, filled: false })))
    setIsCompleted(false)
    setFeedbackMessage(null)
  }

  return (
    <div className="w-full max-w-4xl">
      {/* Header with title */}
      <div className="w-full flex justify-between items-center mb-8">
        <div className="relative w-16 h-16">
          <Image src="/images/sound_new.svg" alt="Sound" fill className="object-contain cursor-pointer" />
        </div>

        <div className="relative h-24 w-80 md:w-[500px] flex items-center justify-center">
          <Image src="/images/title_box_small.png" alt="Title box" fill className="object-contain" />
          <span className="relative z-10 text-white text-2xl md:text-3xl font-bold">ZNAJDŹ PARY 6.</span>
        </div>

        <div className="relative w-16 h-16" onClick={onMenuClick}>
          <Image src="/images/menu_new.svg" alt="Menu" fill className="object-contain cursor-pointer" />
        </div>
      </div>

      {/* Game area */}
      <div className="flex flex-col items-center mt-16">
        {/* Top row - draggable animals */}
        <div className="flex justify-center gap-16 mb-24">
          {animals.map((animal) => {
            // Skip if already matched
            if (animal.matched) return null

            return (
              <div
                key={`animal-${animal.id}`}
                draggable
                onDragStart={() => handleDragStart(animal.id)}
                className="relative h-32 w-32 cursor-grab"
              >
                <Image src={animal.image || "/placeholder.svg"} alt={animal.name} fill className="object-contain" />
              </div>
            )
          })}
        </div>

        {/* Bottom row - shadow drop zones */}
        <div className="flex justify-center gap-16">
          {dropZones.map((zone) => {
            // Find the animal for this zone
            const animal = animals.find((a) => a.id === zone.animalId)
            if (!animal) return null

            return (
              <div
                key={`zone-${zone.id}`}
                className={`relative h-32 w-32 ${zone.filled ? "cursor-default" : "cursor-pointer"}`}
                onDragOver={!zone.filled ? handleDragOver : undefined}
                onDrop={!zone.filled ? (e) => handleDrop(e, zone.id) : undefined}
              >
                {/* Shadow image */}
                <Image
                  src={animal.shadowImage || "/placeholder.svg"}
                  alt={`${animal.name} shadow`}
                  fill
                  className="object-contain"
                />

                {/* Show the matched animal on top if filled */}
                {zone.filled && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative h-32 w-32">
                      <Image
                        src={animal.image || "/placeholder.svg"}
                        alt={animal.name}
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

        {/* Feedback message */}
        {feedbackMessage && (
          <div
            className={`mt-8 text-xl font-medium text-center ${
              feedbackMessage.includes("Brawo") || feedbackMessage.includes("Gratulacje")
                ? "text-[#539e1b]"
                : "text-red-600"
            }`}
          >
            {feedbackMessage}
          </div>
        )}

        {/* Reset button - only visible when game is completed */}
        {isCompleted && (
          <div className="flex justify-center mt-8">
            <button onClick={resetGame} className="bg-[#539e1b] text-white px-6 py-2 rounded-full font-bold">
              Zagraj ponownie
            </button>
          </div>
        )}

        {/* Login reminder for non-logged in users */}
        {!isLoggedIn && (
          <div className="mt-4 text-center text-gray-600">
            <p>Zaloguj się, aby zapisać swój postęp!</p>
          </div>
        )}
      </div>
    </div>
  )
}
