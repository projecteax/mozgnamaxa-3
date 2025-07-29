"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { useGameCompletion } from "@/hooks/use-game-completion"
import { getRandomSuccessMessage } from "@/lib/success-messages"
import { useSeason } from "@/contexts/season-context"

// Shuffle function to randomize array order
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

interface CategorySortingGame3Props {
  onMenuClick: () => void
}

interface SortableItem {
  id: string
  name: string
  image: string
  category: "weather" | "nature" | "garden" | "kitchen" | "snowy" | "sunny"
  placed: boolean
  autumnImage?: string
}

export default function CategorySortingGame3({ onMenuClick }: CategorySortingGame3Props) {
  // Use the season context
  const { selectedSeason, getThemeColors } = useSeason()
  const theme = getThemeColors()

  // Use the game completion hook
  const { recordCompletion, isLoggedIn } = useGameCompletion()

  // Get items based on season
  const getBaseItems = (): SortableItem[] => {
    if (selectedSeason === "zima") {
      // Winter version items - 6 draggable items (3 snowy + 3 sunny)
      return [
        { id: "scarf", name: "Scarf", image: "/images/scarf_winter_snowy.svg", category: "snowy", placed: false },
        { id: "jacket", name: "Jacket", image: "/images/jacket_winter_snowy.svg", category: "snowy", placed: false },
        { id: "hat", name: "Hat", image: "/images/hat_winter_snowy.svg", category: "snowy", placed: false },
        { id: "tshirt", name: "T-shirt", image: "/images/tshort_winter_sunny.svg", category: "sunny", placed: false },
        { id: "flops", name: "Flip Flops", image: "/images/flops_winter_sunny.svg", category: "sunny", placed: false },
        {
          id: "swimsuit",
          name: "Swimsuit",
          image: "/images/swimsuit_winter_sunny.svg",
          category: "sunny",
          placed: false,
        },
      ]
    } else if (selectedSeason === "jesien") {
      // Autumn version items - bucket and garnek are only indicators, not draggable
      return [
        { id: "motyka", name: "Motyka", image: "/images/motyka_autumn_garden.svg", category: "garden", placed: false },
        {
          id: "konewka",
          name: "Konewka",
          image: "/images/konewka_autumn_garden.svg",
          category: "garden",
          placed: false,
        },
        { id: "grabie", name: "Grabie", image: "/images/grabie_autumn_garden.svg", category: "garden", placed: false },
        { id: "shovel", name: "Shovel", image: "/images/shovel_autumn_garden.svg", category: "garden", placed: false },
        {
          id: "shaker",
          name: "Shaker",
          image: "/images/shaker_autumn_kitchen.svg",
          category: "kitchen",
          placed: false,
        },
        {
          id: "chochla",
          name: "Chochla",
          image: "/images/chochla_autumn_kitchen.svg",
          category: "kitchen",
          placed: false,
        },
        { id: "fork", name: "Fork", image: "/images/fork_autumn_kitchen.svg", category: "kitchen", placed: false },
        { id: "spoon", name: "Spoon", image: "/images/spoon_autumn_kitchen.svg", category: "kitchen", placed: false },
      ]
    } else if (selectedSeason === "lato") {
      // Summer version items
      return [
        { id: "map", name: "Map", image: "/images/map_summer.svg", category: "weather", placed: false },
        { id: "zoom", name: "Zoom", image: "/images/zoom_summer.svg", category: "weather", placed: false },
        { id: "boots", name: "Boots", image: "/images/boots_summer.svg", category: "weather", placed: false },
        {
          id: "rescue-wheel",
          name: "Rescue Wheel",
          image: "/images/rescue_wheel_summer.svg",
          category: "nature",
          placed: false,
        },
        {
          id: "swimming-suit",
          name: "Swimming Suit",
          image: "/images/swimming_suit_summer.svg",
          category: "nature",
          placed: false,
        },
        {
          id: "flipflops",
          name: "Flip Flops",
          image: "/images/flipflops_02_summer.svg",
          category: "nature",
          placed: false,
        },
      ]
    } else {
      // Spring version items (original)
      return [
        { id: "cloud", name: "Cloud", image: "/images/cloud.svg", category: "weather", placed: false },
        { id: "raindrops", name: "Raindrops", image: "/images/raindrops.svg", category: "weather", placed: false },
        { id: "rainbow", name: "Rainbow", image: "/images/rainbow.svg", category: "weather", placed: false },
        { id: "flower-pink", name: "Pink Flower", image: "/images/flower_pink.svg", category: "nature", placed: false },
        { id: "tree", name: "Tree", image: "/images/tree.svg", category: "nature", placed: false },
        { id: "bush", name: "Bush", image: "/images/bush.svg", category: "nature", placed: false },
      ]
    }
  }

  const [items, setItems] = useState<SortableItem[]>(() => shuffleArray(getBaseItems()))

  // State for tracking items placed in each category
  const [leftBoxItems, setLeftBoxItems] = useState<string[]>([])
  const [rightBoxItems, setRightBoxItems] = useState<string[]>([])

  // State for tracking the current dragged item
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  // State for error message
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // State for tracking if the game is completed
  const [isCompleted, setIsCompleted] = useState(false)

  // State for success message
  const [successMessage, setSuccessMessage] = useState<string>("")

  // Handle drag start
  const handleDragStart = (id: string) => {
    setDraggedItem(id)
    setErrorMessage(null)
  }

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  // Handle drop on left box
  const handleDropOnLeftBox = (e: React.DragEvent) => {
    e.preventDefault()

    if (!draggedItem) return

    // Find the dragged item
    const item = items.find((item) => item.id === draggedItem)
    if (!item) return

    // Check if this item belongs to the correct category for left box
    const correctCategory =
      selectedSeason === "zima"
        ? "snowy"
        : selectedSeason === "jesien"
          ? "garden"
          : selectedSeason === "lato"
            ? "weather"
            : "weather"

    if (item.category === correctCategory) {
      // Add to left box items
      const newLeftBoxItems = [...leftBoxItems, item.id]
      setLeftBoxItems(newLeftBoxItems)

      // Mark as placed
      setItems((prevItems) =>
        prevItems.map((prevItem) => (prevItem.id === item.id ? { ...prevItem, placed: true } : prevItem)),
      )

      setErrorMessage(null)

      // Check completion after state updates
      setTimeout(() => checkCompletion(newLeftBoxItems, rightBoxItems), 100)
    }

    setDraggedItem(null)
  }

  // Handle drop on right box
  const handleDropOnRightBox = (e: React.DragEvent) => {
    e.preventDefault()

    if (!draggedItem) return

    // Find the dragged item
    const item = items.find((item) => item.id === draggedItem)
    if (!item) return

    // Check if this item belongs to the correct category for right box
    const correctCategory =
      selectedSeason === "zima"
        ? "sunny"
        : selectedSeason === "jesien"
          ? "kitchen"
          : selectedSeason === "lato"
            ? "nature"
            : "nature"

    if (item.category === correctCategory) {
      // Add to right box items
      const newRightBoxItems = [...rightBoxItems, item.id]
      setRightBoxItems(newRightBoxItems)

      // Mark as placed
      setItems((prevItems) =>
        prevItems.map((prevItem) => (prevItem.id === item.id ? { ...prevItem, placed: true } : prevItem)),
      )

      setErrorMessage(null)

      // Check completion after state updates
      setTimeout(() => checkCompletion(leftBoxItems, newRightBoxItems), 100)
    }

    setDraggedItem(null)
  }

  // Check if all items are placed correctly
  const checkCompletion = (currentLeftBoxItems = leftBoxItems, currentRightBoxItems = rightBoxItems) => {
    // Get expected counts based on season
    const expectedCounts =
      selectedSeason === "zima"
        ? { left: 3, right: 3 } // 3 snowy + 3 sunny
        : selectedSeason === "jesien"
          ? { left: 4, right: 4 } // 4 garden + 4 kitchen (bucket and garnek are indicators only)
          : selectedSeason === "lato"
            ? { left: 3, right: 3 } // 3 weather + 3 nature
            : { left: 3, right: 3 } // 3 weather + 3 nature

    const totalPlacedItems = currentLeftBoxItems.length + currentRightBoxItems.length
    const expectedTotal = expectedCounts.left + expectedCounts.right
    const allItemsPlaced = totalPlacedItems === expectedTotal

    console.log(`Placed items: ${totalPlacedItems}/${expectedTotal}`, {
      left: currentLeftBoxItems.length,
      right: currentRightBoxItems.length,
    })

    if (allItemsPlaced && !isCompleted) {
      setIsCompleted(true)
      setSuccessMessage(getRandomSuccessMessage())
      console.log("🎉 Game completed: category-sorting-3")

      // Record completion in database
      if (isLoggedIn) {
        recordCompletion("category-sorting-3")
        console.log("✅ Completion recorded in database")
      } else {
        console.log("⚠️ User not logged in - completion not recorded")
      }
    }
  }

  // Reset the game
  const resetGame = () => {
    const shuffledItems = shuffleArray(getBaseItems())
    setItems(shuffledItems)
    setLeftBoxItems([])
    setRightBoxItems([])
    setIsCompleted(false)
    setSuccessMessage("")
    setErrorMessage(null)
    console.log("🔄 Game reset with shuffled items")
  }

  // Get category indicators based on season
  const getCategoryIndicators = () => {
    if (selectedSeason === "zima") {
      return {
        leftIndicator: "/images/glove_winter_snowy.svg", // Snowy weather indicator
        rightIndicator: "/images/shirts_winter_sunny.svg", // Sunny weather indicator
      }
    } else if (selectedSeason === "jesien") {
      return {
        leftIndicator: "/images/bucket_autumn_garden.svg", // Garden indicator
        rightIndicator: "/images/garnek_autumn_kitchen.svg", // Kitchen indicator
      }
    } else if (selectedSeason === "lato") {
      return {
        leftIndicator: "/images/backpack_summer.svg",
        rightIndicator: "/images/towel_summer.svg",
      }
    } else {
      return {
        leftIndicator: "/images/sun.svg",
        rightIndicator: "/images/grass.svg",
      }
    }
  }

  const { leftIndicator, rightIndicator } = getCategoryIndicators()

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
          <span className="relative z-10 text-white text-2xl md:text-3xl font-bold font-sour-gummy">
            PODZIEL OBRAZKI
          </span>
        </div>

        <div className="relative w-16 h-16" onClick={onMenuClick}>
          <Image src={theme.menuIcon || "/placeholder.svg"} alt="Menu" fill className="object-contain cursor-pointer" />
        </div>
      </div>

      {/* Game area */}
      <div className="flex flex-col items-center">
        {/* Draggable items at the top */}
        <div className="flex justify-center gap-6 mb-16 flex-wrap">
          {items.map((item) => {
            // Skip items that have been placed
            if (item.placed) return null

            return (
              <div
                key={`draggable-${item.id}`}
                draggable
                onDragStart={() => handleDragStart(item.id)}
                className="relative h-20 w-20 cursor-grab drop-shadow-lg"
              >
                <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-contain" />
              </div>
            )
          })}
        </div>

        {/* Category boxes */}
        <div className="flex justify-center gap-8 w-full">
          {/* Left category box */}
          <div className="relative" onDragOver={handleDragOver} onDrop={handleDropOnLeftBox}>
            <div className="relative w-[350px] h-[200px]">
              <Image src="/images/frame_box_large.svg" alt="Left box" fill className="object-contain" />

              {/* Container for all left box items, vertically centered */}
              <div className="absolute inset-0 flex items-center">
                {/* Category indicator */}
                <div className="relative h-16 w-16 ml-4">
                  <Image
                    src={leftIndicator || "/placeholder.svg"}
                    alt="Left category"
                    fill
                    className="object-contain"
                  />
                </div>

                {/* Placed left box items - in a horizontal line */}
                <div className="flex flex-row items-center ml-4 flex-wrap">
                  {leftBoxItems.map((id) => {
                    const item = items.find((item) => item.id === id)
                    if (!item) return null

                    return (
                      <div key={`placed-${id}`} className="relative h-12 w-12 mx-1 drop-shadow-lg">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-contain" />
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right category box */}
          <div className="relative" onDragOver={handleDragOver} onDrop={handleDropOnRightBox}>
            <div className="relative w-[350px] h-[200px]">
              <Image src="/images/frame_box_large.svg" alt="Right box" fill className="object-contain" />

              {/* Container for all right box items, vertically centered */}
              <div className="absolute inset-0 flex items-center">
                {/* Category indicator */}
                <div className="relative h-16 w-16 ml-4">
                  <Image
                    src={rightIndicator || "/placeholder.svg"}
                    alt="Right category"
                    fill
                    className="object-contain"
                  />
                </div>

                {/* Placed right box items - in a horizontal line */}
                <div className="flex flex-row items-center ml-4 flex-wrap">
                  {rightBoxItems.map((id) => {
                    const item = items.find((item) => item.id === id)
                    if (!item) return null

                    return (
                      <div key={`placed-${id}`} className="relative h-12 w-12 mx-1 drop-shadow-lg">
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
        {errorMessage && <div className="mt-4 text-red-600 font-medium text-lg text-center">{errorMessage}</div>}

        {/* Completion message */}
        {isCompleted && successMessage && (
          <div className="mt-8 flex justify-center">
            <div className="bg-green-100 border-2 border-green-400 rounded-xl p-6 max-w-md text-center shadow-lg">
              <div className="text-green-700 font-bold text-xl mb-2">🎉 {successMessage} 🎉</div>
            </div>
          </div>
        )}

        {/* Reset button - only visible when at least one item is placed */}
        {(leftBoxItems.length > 0 || rightBoxItems.length > 0) && (
          <div className="flex justify-center mt-8">
            <button
              onClick={resetGame}
              className="bg-[#539e1b] text-white px-6 py-2 rounded-full font-bold hover:bg-[#4a8c18] transition-colors"
            >
              Zagraj ponownie
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
