"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"

interface CategorySortingGame4Props {
  onMenuClick: () => void
}

interface SortableItem {
  id: string
  name: string
  image: string
  category: "land" | "air"
  placed: boolean
}

export default function CategorySortingGame4({ onMenuClick }: CategorySortingGame4Props) {
  // Define the items for sorting
  const [items, setItems] = useState<SortableItem[]>([
    { id: "car", name: "Car", image: "/images/car.svg", category: "land", placed: false },
    { id: "scooter", name: "Scooter", image: "/images/scooter.svg", category: "land", placed: false },
    { id: "snail", name: "Snail", image: "/images/snail.svg", category: "land", placed: false },
    { id: "plane", name: "Plane", image: "/images/plane.svg", category: "air", placed: false },
    { id: "kite", name: "Kite", image: "/images/kite.svg", category: "air", placed: false },
    { id: "butterfly", name: "Butterfly", image: "/images/butterfly_orange.svg", category: "air", placed: false },
  ])

  // State for tracking items placed in each category
  const [landItems, setLandItems] = useState<string[]>([])
  const [airItems, setAirItems] = useState<string[]>([])

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

  // Handle drop on land category
  const handleDropOnLand = (e: React.DragEvent) => {
    e.preventDefault()

    if (!draggedItem) return

    // Find the dragged item
    const item = items.find((item) => item.id === draggedItem)
    if (!item) return

    // Check if this item belongs to the land category
    if (item.category === "land") {
      // Add to land items
      setLandItems([...landItems, item.id])

      // Mark as placed
      setItems((prevItems) =>
        prevItems.map((prevItem) => (prevItem.id === item.id ? { ...prevItem, placed: true } : prevItem)),
      )

      setErrorMessage(null)
    } else {
      // Wrong category
      setErrorMessage("Przykro mi to tutaj nie pasuje")
    }

    setDraggedItem(null)

    // Check if all items are placed
    setTimeout(checkCompletion, 100)
  }

  // Handle drop on air category
  const handleDropOnAir = (e: React.DragEvent) => {
    e.preventDefault()

    if (!draggedItem) return

    // Find the dragged item
    const item = items.find((item) => item.id === draggedItem)
    if (!item) return

    // Check if this item belongs to the air category
    if (item.category === "air") {
      // Add to air items
      setAirItems([...airItems, item.id])

      // Mark as placed
      setItems((prevItems) =>
        prevItems.map((prevItem) => (prevItem.id === item.id ? { ...prevItem, placed: true } : prevItem)),
      )

      setErrorMessage(null)
    } else {
      // Wrong category
      setErrorMessage("Przykro mi to tutaj nie pasuje")
    }

    setDraggedItem(null)

    // Check if all items are placed
    setTimeout(checkCompletion, 100)
  }

  // Check if all items are placed correctly
  const checkCompletion = () => {
    const allPlaced = items.every((item) => item.placed)
    if (allPlaced) {
      setIsCompleted(true)
    }
  }

  // Reset the game
  const resetGame = () => {
    setItems((prevItems) => prevItems.map((item) => ({ ...item, placed: false })))
    setLandItems([])
    setAirItems([])
    setIsCompleted(false)
    setErrorMessage(null)
  }

  return (
    <div className="w-full max-w-6xl">
      {/* Header with title */}
      <div className="w-full flex justify-between items-center mb-8">
        <div className="relative w-16 h-16">
          <Image src="/images/sound.png" alt="Sound" fill className="object-contain cursor-pointer" />
        </div>

        <div className="relative h-24 w-80 md:w-[500px] flex items-center justify-center">
          <Image src="/images/title_box_small.png" alt="Title box" fill className="object-contain" />
          <span className="relative z-10 text-white text-2xl md:text-3xl font-bold">PODZIEL OBRAZKI 4.</span>
        </div>

        <div className="relative w-16 h-16" onClick={onMenuClick}>
          <Image src="/images/menu.png" alt="Menu" fill className="object-contain cursor-pointer" />
        </div>
      </div>

      {/* Game area */}
      <div className="flex flex-col items-center">
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
          {/* Land category box */}
          <div className="relative" onDragOver={handleDragOver} onDrop={handleDropOnLand}>
            <div className="relative w-[350px] h-[200px]">
              <Image src="/images/frame_box_large.svg" alt="Land box" fill className="object-contain" />

              {/* Container for all land items, vertically centered */}
              <div className="absolute inset-0 flex items-center">
                {/* Category indicator - bike (already placed) */}
                <div className="relative h-16 w-16 ml-4">
                  <Image src="/images/bike.svg" alt="Land category" fill className="object-contain" />
                </div>

                {/* Placed land items - in a horizontal line */}
                <div className="flex flex-row items-center ml-4">
                  {landItems.map((id) => {
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

          {/* Air category box */}
          <div className="relative" onDragOver={handleDragOver} onDrop={handleDropOnAir}>
            <div className="relative w-[350px] h-[200px]">
              <Image src="/images/frame_box_large.svg" alt="Air box" fill className="object-contain" />

              {/* Container for all air items, vertically centered */}
              <div className="absolute inset-0 flex items-center">
                {/* Category indicator - stork (already placed) */}
                <div className="relative h-16 w-16 ml-4">
                  <Image src="/images/stork.svg" alt="Air category" fill className="object-contain" />
                </div>

                {/* Placed air items - in a horizontal line */}
                <div className="flex flex-row items-center ml-4">
                  {airItems.map((id) => {
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

        {/* Error message */}
        {errorMessage && <div className="mt-8 text-red-600 font-medium text-lg text-center">{errorMessage}</div>}

        {/* Reset button - only visible when at least one item is placed */}
        {(landItems.length > 0 || airItems.length > 0) && (
          <div className="flex justify-center mt-8">
            <button onClick={resetGame} className="bg-[#539e1b] text-white px-6 py-2 rounded-full font-bold">
              Reset Game
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
