"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { useGameCompletion } from "@/hooks/use-game-completion"

interface CategorySortingGame2Props {
  onMenuClick: () => void
}

interface SortableItem {
  id: string
  name: string
  image: string
  category: "vegetable" | "animal"
  placed: boolean
}

export default function CategorySortingGame2({ onMenuClick }: CategorySortingGame2Props) {
  const { recordCompletion, isLoggedIn } = useGameCompletion()

  // Define the items for sorting
  const [items, setItems] = useState<SortableItem[]>([
    { id: "radish", name: "Radish", image: "/images/raddish.svg", category: "vegetable", placed: false },
    { id: "onion", name: "Onion", image: "/images/onion.svg", category: "vegetable", placed: false },
    { id: "chive", name: "Chive", image: "/images/chive.svg", category: "vegetable", placed: false },
    { id: "chicken", name: "Chicken", image: "/images/chicken.svg", category: "animal", placed: false },
    { id: "rabbit", name: "Rabbit", image: "/images/rabbit.svg", category: "animal", placed: false },
    { id: "butterfly", name: "Butterfly", image: "/images/butterfly_yellow.svg", category: "animal", placed: false },
  ])

  // State for tracking items placed in each category
  const [vegetableItems, setVegetableItems] = useState<string[]>([])
  const [animalItems, setAnimalItems] = useState<string[]>([])

  // State for tracking the current dragged item
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  // State for error message
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // State for tracking if the game is completed
  const [isCompleted, setIsCompleted] = useState(false)

  // Handle drag start
  const handleDragStart = (id: string) => {
    setDraggedItem(id)
    setErrorMessage(null)
  }

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  // Handle drop on vegetable category
  const handleDropOnVegetable = (e: React.DragEvent) => {
    e.preventDefault()

    if (!draggedItem) return

    // Find the dragged item
    const item = items.find((item) => item.id === draggedItem)
    if (!item) return

    // Check if this item belongs to the vegetable category
    if (item.category === "vegetable") {
      // Add to vegetable items
      const newVegetableItems = [...vegetableItems, item.id]
      setVegetableItems(newVegetableItems)

      // Mark as placed
      setItems((prevItems) =>
        prevItems.map((prevItem) => (prevItem.id === item.id ? { ...prevItem, placed: true } : prevItem)),
      )

      setErrorMessage(null)

      // Check if all items are placed
      setTimeout(() => checkCompletion(newVegetableItems, animalItems), 100)
    } else {
      // Wrong category
      setErrorMessage("Przykro mi to tutaj nie pasuje")
    }

    setDraggedItem(null)
  }

  // Handle drop on animal category
  const handleDropOnAnimal = (e: React.DragEvent) => {
    e.preventDefault()

    if (!draggedItem) return

    // Find the dragged item
    const item = items.find((item) => item.id === draggedItem)
    if (!item) return

    // Check if this item belongs to the animal category
    if (item.category === "animal") {
      // Add to animal items
      const newAnimalItems = [...animalItems, item.id]
      setAnimalItems(newAnimalItems)

      // Mark as placed
      setItems((prevItems) =>
        prevItems.map((prevItem) => (prevItem.id === item.id ? { ...prevItem, placed: true } : prevItem)),
      )

      setErrorMessage(null)

      // Check if all items are placed
      setTimeout(() => checkCompletion(vegetableItems, newAnimalItems), 100)
    } else {
      // Wrong category
      setErrorMessage("Przykro mi to tutaj nie pasuje")
    }

    setDraggedItem(null)
  }

  // Check if all items are placed correctly
  const checkCompletion = async (currentVegetableItems: string[], currentAnimalItems: string[]) => {
    const totalPlaced = currentVegetableItems.length + currentAnimalItems.length
    console.log(`Items placed: ${totalPlaced}/6`)

    if (totalPlaced === 6 && !isCompleted) {
      console.log("🎉 All items placed correctly! Game completed!")
      setIsCompleted(true)

      // Record completion in database
      const success = await recordCompletion("category-sorting-2")
      if (success) {
        console.log("✅ Game completion recorded in database")
      }
    }
  }

  // Reset the game
  const resetGame = () => {
    setItems((prevItems) => prevItems.map((item) => ({ ...item, placed: false })))
    setVegetableItems([])
    setAnimalItems([])
    setIsCompleted(false)
    setErrorMessage(null)
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
          <span className="relative z-10 text-white text-2xl md:text-3xl font-bold">PODZIEL OBRAZKI 2.</span>
        </div>

        <div className="relative w-16 h-16" onClick={onMenuClick}>
          <Image src="/images/menu_new.svg" alt="Menu" fill className="object-contain cursor-pointer" />
        </div>
      </div>

      {/* Game area */}
      <div className="flex flex-col items-center">
        {/* Progress indicator */}
        <div className="mb-4 text-lg font-medium text-gray-700">
          Umieszczono: {vegetableItems.length + animalItems.length}/6 obrazków
        </div>

        {/* Draggable items at the top */}
        <div className="flex justify-center gap-8 mb-16 flex-wrap">
          {items.map((item) => {
            // Skip items that have been placed
            if (item.placed) return null

            return (
              <div
                key={`draggable-${item.id}`}
                draggable
                onDragStart={() => handleDragStart(item.id)}
                className="relative h-24 w-24 cursor-grab"
              >
                <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-contain" />
              </div>
            )
          })}
        </div>

        {/* Category boxes */}
        <div className="flex justify-center gap-8 w-full">
          {/* Vegetable category box */}
          <div className="relative" onDragOver={handleDragOver} onDrop={handleDropOnVegetable}>
            <div className="relative w-[350px] h-[200px]">
              <Image src="/images/frame_box_large.svg" alt="Vegetable box" fill className="object-contain" />

              {/* Container for all vegetable items, vertically centered */}
              <div className="absolute inset-0 flex items-center">
                {/* Category indicator - lettuce */}
                <div className="relative h-16 w-16 ml-4">
                  <Image src="/images/lattuce.svg" alt="Vegetable category" fill className="object-contain" />
                </div>

                {/* Placed vegetable items - in a horizontal line */}
                <div className="flex flex-row items-center ml-4">
                  {vegetableItems.map((id) => {
                    const item = items.find((item) => item.id === id)
                    if (!item) return null

                    return (
                      <div key={`placed-${id}`} className="relative h-16 w-16 mx-2">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-contain" />
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Animal category box */}
          <div className="relative" onDragOver={handleDragOver} onDrop={handleDropOnAnimal}>
            <div className="relative w-[350px] h-[200px]">
              <Image src="/images/frame_box_large.svg" alt="Animal box" fill className="object-contain" />

              {/* Container for all animal items, vertically centered */}
              <div className="absolute inset-0 flex items-center">
                {/* Category indicator - sparrow */}
                <div className="relative h-16 w-16 ml-4">
                  <Image src="/images/sparrow.svg" alt="Animal category" fill className="object-contain" />
                </div>

                {/* Placed animal items - in a horizontal line */}
                <div className="flex flex-row items-center ml-4">
                  {animalItems.map((id) => {
                    const item = items.find((item) => item.id === id)
                    if (!item) return null

                    return (
                      <div key={`placed-${id}`} className="relative h-16 w-16 mx-2">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-contain" />
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Completion message */}
        {isCompleted && (
          <div className="mt-8 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2 animate-bounce">🎉 BRAWO! 🎉</div>
            <div className="text-lg text-gray-700 mb-2">Wszystkie obrazki zostały poprawnie posortowane!</div>
            {isLoggedIn ? (
              <div className="text-sm text-green-600">✅ Postęp został zapisany!</div>
            ) : (
              <div className="text-sm text-orange-600">⚠️ Zaloguj się, aby zapisać swój postęp!</div>
            )}
          </div>
        )}

        {/* Error message */}
        {errorMessage && <div className="mt-8 text-red-600 font-medium text-lg text-center">{errorMessage}</div>}

        {/* Reset button - only visible when at least one item is placed */}
        {(vegetableItems.length > 0 || animalItems.length > 0) && (
          <div className="flex justify-center mt-8">
            <button
              onClick={resetGame}
              className="bg-[#539e1b] text-white px-6 py-2 rounded-full font-bold hover:bg-[#4a8c18] transition-colors"
            >
              Reset Game
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
