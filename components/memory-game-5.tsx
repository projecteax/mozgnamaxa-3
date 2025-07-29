"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useGameCompletion } from "@/hooks/use-game-completion"
import { getRandomSuccessMessage } from "@/lib/success-messages"
import { useSeason } from "@/contexts/season-context"

interface MemoryGame5Props {
  onMenuClick: () => void
  onComplete?: () => void
}

interface AnimalItem {
  id: string
  name: string
  image: string
  shadowImage: string
  summerImage: string
  summerShadowImage: string
  autumnImage: string
  autumnShadowImage: string
  winterImage: string
  winterShadowImage: string
  matched: boolean
}

interface DropZone {
  id: string
  animalId: string
  filled: boolean
  position: number
}

export default function MemoryGame5({ onMenuClick, onComplete }: MemoryGame5Props) {
  const { selectedSeason, getThemeColors } = useSeason()
  const theme = getThemeColors()

  // Define the animal items
  const [animals, setAnimals] = useState<AnimalItem[]>([
    {
      id: "frog",
      name: "Frog",
      image: "/images/frog2.svg",
      shadowImage: "/images/frog2_shadow.svg",
      summerImage: "/images/sunglasses_summer.svg",
      summerShadowImage: "/images/sunglasses_shadow.svg",
      autumnImage: "/images/pumpkin_autumn.svg",
      autumnShadowImage: "/images/pumpkin_autumn_shadow.svg",
      winterImage: "/images/snowman_01_winter.svg",
      winterShadowImage: "/images/snowman_01_winter_shadow.svg",
      matched: false,
    },
    {
      id: "sparrow",
      name: "Sparrow",
      image: "/images/sparrow.svg",
      shadowImage: "/images/sparrow_shadow.svg",
      summerImage: "/images/umbrella_summer.svg",
      summerShadowImage: "/images/umbrella_shadow_summer.svg",
      autumnImage: "/images/plum_autumn.svg",
      autumnShadowImage: "/images/plum_autumn_shadow.svg",
      winterImage: "/images/snowman_02_winter.svg",
      winterShadowImage: "/images/snowman_02_winter_shadow.svg",
      matched: false,
    },
    {
      id: "ladybug",
      name: "Ladybug",
      image: "/images/ladybug.svg",
      shadowImage: "/images/ladybug_shadow.svg",
      summerImage: "/images/shell_summer.svg",
      summerShadowImage: "/images/shell_shadow_summer.svg",
      autumnImage: "/images/chestnut_autumn.svg",
      autumnShadowImage: "/images/chestnut_autumn_shadow.svg",
      winterImage: "/images/snowman_03_winter.svg",
      winterShadowImage: "/images/snowman_03_winter_shadow.svg",
      matched: false,
    },
    {
      id: "butterfly",
      name: "Butterfly",
      image: "/images/butterfly_orange.svg",
      shadowImage: "/images/butterfly_orange_shadow.svg",
      summerImage: "/images/swimmingboots_summer.svg",
      summerShadowImage: "/images/swimmingboots_shadow_summer.svg",
      autumnImage: "/images/mushrooms_autumn.svg",
      autumnShadowImage: "/images/mushrooms_autumn_shadow.svg",
      winterImage: "/images/snowman_04_winter.svg",
      winterShadowImage: "/images/snowman_04_winter_shadow.svg",
      matched: false,
    },
  ])

  // Define the drop zones (shadows)
  const [dropZones, setDropZones] = useState<DropZone[]>([
    { id: "zone-butterfly", animalId: "butterfly", filled: false, position: 0 },
    { id: "zone-ladybug", animalId: "ladybug", filled: false, position: 1 },
    { id: "zone-frog", animalId: "frog", filled: false, position: 2 },
    { id: "zone-sparrow", animalId: "sparrow", filled: false, position: 3 },
  ])

  // State for tracking the current dragged item
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  // State for tracking if the game is completed
  const [isCompleted, setIsCompleted] = useState(false)

  // State for success message
  const [successMessage, setSuccessMessage] = useState<string>("")

  // State for tracking if progress is saved
  const [progressSaved, setProgressSaved] = useState(false)

  // Use the game completion hook
  const { recordCompletion, isLoggedIn } = useGameCompletion()

  // Helper function to get the correct image based on season
  const getAnimalImage = (animal: AnimalItem) => {
    if (selectedSeason === "lato") {
      return animal.summerImage
    } else if (selectedSeason === "jesien") {
      return animal.autumnImage
    } else if (selectedSeason === "zima") {
      return animal.winterImage
    }
    return animal.image
  }

  // Helper function to get the correct shadow image based on season
  const getShadowImage = (animal: AnimalItem) => {
    if (selectedSeason === "lato") {
      return animal.summerShadowImage
    } else if (selectedSeason === "jesien") {
      return animal.autumnShadowImage
    } else if (selectedSeason === "zima") {
      return animal.winterShadowImage
    }
    return animal.shadowImage
  }

  // Helper function to get the correct title text based on season
  const getTitleText = () => {
    return "ZNAJDŹ PARY"
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
  const handleDrop = (e: React.DragEvent, zoneId: string) => {
    e.preventDefault()

    if (!draggedItem) return

    // Find the drop zone
    const dropZone = dropZones.find((zone) => zone.id === zoneId)
    if (!dropZone) return

    // If drop zone already has an item, do nothing
    if (dropZone.filled) {
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
    }

    // Reset dragged item
    setDraggedItem(null)

    // Check if all animals are matched
    setTimeout(() => {
      const allMatched = animals.every((animal) => (animal.id === draggedItem ? true : animal.matched))
      if (allMatched) {
        setIsCompleted(true)
        handleGameCompletion()
      }
    }, 100)
  }

  // Handle game completion and record progress
  const handleGameCompletion = async () => {
    setSuccessMessage(getRandomSuccessMessage())
    
    if (isLoggedIn) {
      try {
        await recordCompletion("memory-game-5")
        setProgressSaved(true)
        // Trigger completion flow after 3 seconds to show success message
        if (onComplete) {
          setTimeout(() => {
            onComplete()
          }, 3000) // 3 second delay
        }
      } catch (error) {
        console.error("Failed to record game completion:", error)
      }
    } else if (onComplete) {
      // For non-logged users, still trigger completion after 3 seconds
      setTimeout(() => {
        onComplete()
      }, 3000) // 3 second delay
    }
  }

  // Reset the game
  const resetGame = () => {
    setAnimals((prevAnimals) => prevAnimals.map((animal) => ({ ...animal, matched: false })))
    setDropZones((prevZones) => prevZones.map((zone) => ({ ...zone, filled: false })))
    setIsCompleted(false)
    setProgressSaved(false)
    setSuccessMessage("")
  }

  return (
    <div className="w-full max-w-4xl" style={{ backgroundColor: theme.background }}>
      {/* Header with title */}
      <div className="w-full flex justify-between items-center mb-8">
        <div className="relative w-16 h-16">
          <Image
            src={theme.soundIcon || "/placeholder.svg"}
            alt="Sound"
            fill
            className="object-contain cursor-pointer"
          />
        </div>

        <div className="relative h-24 w-80 md:w-[500px] flex items-center justify-center">
          <Image src={theme.titleBox || "/placeholder.svg"} alt="Title box" fill className="object-contain" />
          <span className="relative z-10 text-white text-2xl md:text-3xl font-sour-gummy font-thin">ZNAJDŹ PARY.</span>
        </div>

        <div className="relative w-16 h-16" onClick={onMenuClick}>
          <Image src={theme.menuIcon || "/placeholder.svg"} alt="Menu" fill className="object-contain cursor-pointer" />
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
                <Image
                  src={getAnimalImage(animal) || "/placeholder.svg"}
                  alt={animal.name}
                  fill
                  className="object-contain"
                />
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
                  src={getShadowImage(animal) || "/placeholder.svg"}
                  alt={`${animal.name} shadow`}
                  fill
                  className="object-contain"
                />

                {/* Show the matched animal on top if filled */}
                {zone.filled && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative h-32 w-32">
                      <Image
                        src={getAnimalImage(animal) || "/placeholder.svg"}
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

        {/* Success message */}
        {isCompleted && successMessage && (
          <div className="mt-8">
            <div className="bg-green-100 border-2 border-green-500 rounded-lg p-6 text-center max-w-md mx-auto">
              <div className="text-green-700 text-xl font-medium">🎉 {successMessage} 🎉</div>
            </div>
          </div>
        )}

        {/* Progress saved message - only show if completed and not transitioning to medal */}
        {isCompleted && !onComplete && (
          <div className="mt-8 text-center">
            {isLoggedIn ? (
              progressSaved ? (
                <p className="text-[#539e1b] font-medium">Twój postęp został zapisany!</p>
              ) : (
                <p className="text-gray-600">Zapisywanie postępu...</p>
              )
            ) : (
              <p className="text-gray-600">Zaloguj się, aby zapisać swój postęp.</p>
            )}
          </div>
        )}

        {/* Reset button - only visible when game is completed and not transitioning to medal */}
        {isCompleted && !onComplete && (
          <div className="flex justify-center mt-8">
            <button 
              onClick={resetGame} 
              className="text-white px-6 py-2 rounded-full font-sour-gummy text-lg shadow-lg hover:opacity-90 transition-opacity"
              style={{ backgroundColor: theme.buttonColor }}
            >
              Wstecz
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
