"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { useGameCompletionWithHistory } from "@/hooks/use-game-completion"
import { getRandomSuccessMessage } from "@/lib/success-messages"
import { useSeason } from "@/contexts/season-context"
import SuccessMessage from "./success-message"
import SoundButtonEnhanced from "./sound-button-enhanced"

interface CategorySortingGameProps {
  onMenuClick: () => void
  onBack?: () => void
  onNext?: () => void
  onRetry?: () => void
  userLoggedIn?: boolean
  currentSeason?: string
  isGameCompleted?: boolean
}

interface SortableItem {
  id: string
  name: string
  image: string
  summerImage: string
  autumnImage: string
  winterImage: string
  category: "animal" | "flower" | "fruit" | "easter" | "xmas"
  placed: boolean
  isIndicator?: boolean
}

export default function CategorySortingGame({ onMenuClick, onBack, onNext, onRetry, userLoggedIn = false, currentSeason = "wiosna", isGameCompleted = false }: CategorySortingGameProps) {
  const { recordCompletion, isLoggedIn, isHistoricallyCompleted } = useGameCompletionWithHistory("category-sorting-game")
  const { selectedSeason, getThemeColors } = useSeason()
  const theme = getThemeColors()

  // Define the items for sorting
  const [items, setItems] = useState<SortableItem[]>([
    {
      id: "ladybug",
      name: "Ladybug",
      image: "/images/ladybug.svg",
      summerImage: "/images/purple_flower_02_summer.svg",
      autumnImage: "/images/squirel_autumn_animal.svg",
      winterImage: "/images/bunny_winter_easter.svg",
      category: selectedSeason === "jesien" ? "animal" : selectedSeason === "zima" ? "easter" : "animal",
      placed: false,
    },
    {
      id: "yellow-flower",
      name: "Yellow Flower",
      image: "/images/flower_yellow.svg",
      summerImage: "/images/raspberry_summer.svg",
      autumnImage: "/images/pear_autumn_fruit.svg",
      winterImage: "/images/egg_winter_easter.svg",
      category: selectedSeason === "jesien" ? "fruit" : selectedSeason === "zima" ? "easter" : "flower",
      placed: false,
    },
    {
      id: "bee",
      name: "Bee",
      image: "/images/bee.svg",
      summerImage: "/images/red_flower_summer.svg",
      autumnImage: "/images/fox_autumn_animal.svg",
      winterImage: "/images/santa_winter_xmas.svg",
      category: selectedSeason === "jesien" ? "animal" : selectedSeason === "zima" ? "xmas" : "animal",
      placed: false,
    },
    {
      id: "white-flower",
      name: "White Flower",
      image: "/images/flower_white.svg",
      summerImage: "/images/cherry_summer.svg",
      autumnImage: "/images/plum_autumn_fruit.svg",
      winterImage: "/images/palm_winter_easter.svg",
      category: selectedSeason === "jesien" ? "fruit" : selectedSeason === "zima" ? "easter" : "flower",
      placed: false,
    },
    {
      id: "purple-flower",
      name: "Purple Flower",
      image: "/images/flower_purple.svg",
      summerImage: "/images/agrest_summer.svg",
      autumnImage: "/images/boar_autumn_animal.svg",
      winterImage: "/images/tree_winter_xmas.svg",
      category: selectedSeason === "jesien" ? "animal" : selectedSeason === "zima" ? "xmas" : "flower",
      placed: false,
    },
    {
      id: "butterfly",
      name: "Butterfly",
      image: "/images/butterfly.png",
      summerImage: "/images/rose_summer.svg",
      autumnImage: "/images/carrot_autumn_fruit.svg",
      winterImage: "/images/tree_02_winter_xmas.svg",
      category: selectedSeason === "jesien" ? "fruit" : selectedSeason === "zima" ? "xmas" : "animal",
      placed: false,
    },
  ])

  // State for tracking items placed in each category
  const [leftBoxItems, setLeftBoxItems] = useState<string[]>([]) // fruits for autumn, easter for winter
  const [rightBoxItems, setRightBoxItems] = useState<string[]>([]) // animals for autumn, xmas for winter

  // State for tracking the current dragged item
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  // State for tracking if the game is completed
  const [isCompleted, setIsCompleted] = useState(false)

  // State for success message
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Helper function to get the appropriate image based on season
  const getItemImage = (item: SortableItem) => {
    if (selectedSeason === "zima") return item.winterImage
    if (selectedSeason === "jesien") return item.autumnImage
    if (selectedSeason === "lato") return item.summerImage
    return item.image
  }

  // Helper function to get category indicator image
  const getCategoryImage = (isLeftBox: boolean) => {
    if (selectedSeason === "zima") {
      return isLeftBox ? "/images/basket_winter_easter.svg" : "/images/star_winter_xmas.svg"
    }
    if (selectedSeason === "jesien") {
      return isLeftBox ? "/images/apple_autumn_fruit.svg" : "/images/hedgehog_autumn_animal.svg"
    }
    if (selectedSeason === "lato") {
      return isLeftBox ? "/images/purple_flower_summer.svg" : "/images/peach_summer.svg"
    }
    return isLeftBox ? "/images/ant.svg" : "/images/flower_red.svg"
  }

  // Helper function to get title box image
  const getTitleBox = () => {
    if (selectedSeason === "zima") return "/images/title_box_small_winter.svg"
    if (selectedSeason === "jesien") return "/images/title_box_small_autumn.svg"
    if (selectedSeason === "lato") return "/images/title_box_small_summer.svg"
    return "/images/title_box_small.png"
  }

  // Handle drag start
  const handleDragStart = (id: string) => {
    setDraggedItem(id)
  }

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDropOnLeftBox = (e: React.DragEvent) => {
    e.preventDefault()

    if (!draggedItem) return

    // Find the dragged item
    const item = items.find((item) => item.id === draggedItem)
    if (!item) return

    // For autumn: only accept fruits in left box
    // For winter: only accept easter items in left box
    // For other seasons: only accept animals in left box
    const expectedCategory = selectedSeason === "jesien" ? "fruit" : selectedSeason === "zima" ? "easter" : "animal"
    if (item.category !== expectedCategory) {
      setDraggedItem(null)
      return
    }

    // Add to left box items
    const newLeftBoxItems = [...leftBoxItems, item.id]
    setLeftBoxItems(newLeftBoxItems)

    // Mark as placed
    const updatedItems = items.map((prevItem) => (prevItem.id === item.id ? { ...prevItem, placed: true } : prevItem))
    setItems(updatedItems)

    setDraggedItem(null)

    // Check completion
    const allPlaced = updatedItems.every((item) => item.placed)
    if (allPlaced && !isCompleted) {
      setIsCompleted(true)
      setSuccessMessage(getRandomSuccessMessage())
      recordCompletion("category-sorting")
    }
  }

  const handleDropOnRightBox = (e: React.DragEvent) => {
    e.preventDefault()

    if (!draggedItem) return

    // Find the dragged item
    const item = items.find((item) => item.id === draggedItem)
    if (!item) return

    // For autumn: only accept animals in right box
    // For winter: only accept xmas items in right box
    // For other seasons: only accept flowers in right box
    const expectedCategory = selectedSeason === "jesien" ? "animal" : selectedSeason === "zima" ? "xmas" : "flower"
    if (item.category !== expectedCategory) {
      setDraggedItem(null)
      return
    }

    // Add to right box items
    const newRightBoxItems = [...rightBoxItems, item.id]
    setRightBoxItems(newRightBoxItems)

    // Mark as placed
    const updatedItems = items.map((prevItem) => (prevItem.id === item.id ? { ...prevItem, placed: true } : prevItem))
    setItems(updatedItems)

    setDraggedItem(null)

    // Check completion
    const allPlaced = updatedItems.every((item) => item.placed)
    if (allPlaced && !isCompleted) {
      setIsCompleted(true)
      setSuccessMessage(getRandomSuccessMessage())
      recordCompletion("category-sorting")
    }
  }

  // Reset the game
  const resetGame = () => {
    setItems((prevItems) => prevItems.map((item) => ({ ...item, placed: false })))
    setLeftBoxItems([])
    setRightBoxItems([])
    setIsCompleted(false)
    setSuccessMessage(null)
  }

  
  

  return (
    <div className="w-full max-w-6xl" style={{ backgroundColor: theme.background }}>
      {/* Header with title */}
      <div className="w-full max-w-4xl mx-auto">
        <div className="w-full flex justify-between items-center mb-12">
          <div className="relative w-16 h-16">
            <SoundButtonEnhanced
              text="PODZIEL OBRAZKI."
              soundIcon={selectedSeason === "zima" ? "/images/sound_winter.svg" : theme.soundIcon || "/images/sound_icon_dragon_page.svg"}
              size="xl"
              className="w-full h-full"
            />
          </div>

          <div className="relative h-24 w-80 md:w-[500px] flex items-center justify-center">
            <Image src={getTitleBox() || "/placeholder.svg"} alt="Title box" fill className="object-contain" />
            <span className="relative z-10 text-white text-2xl md:text-3xl font-bold font-sour-gummy">
              PODZIEL OBRAZKI.
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
                className="relative h-24 w-24 cursor-grab drop-shadow-md"
              >
                <Image src={getItemImage(item) || "/placeholder.svg"} alt={item.name} fill className="object-contain" />
              </div>
            )
          })}
        </div>

        {/* Category boxes - enlarged by 20% */}
        <div className="flex justify-center gap-8 w-full">
          {/* Left category box - fruits for autumn, easter for winter, animals for other seasons */}
          <div className="relative" onDragOver={handleDragOver} onDrop={handleDropOnLeftBox}>
            <div className="relative w-[420px] h-[240px]">
              <Image src="/images/frame_box_large.svg" alt="Left box" fill className="object-contain" />

              {/* Container for all items, vertically centered */}
              <div className="absolute inset-0 flex items-center">
                {/* Category indicator */}
                <div className="relative h-16 w-16 ml-4">
                  <Image
                    src={getCategoryImage(true) || "/placeholder.svg"}
                    alt="Left category"
                    fill
                    className="object-contain"
                  />
                </div>

                {/* Placed items - in a horizontal line */}
                <div className="flex flex-row items-center ml-4">
                  {leftBoxItems.map((id) => {
                    const item = items.find((item) => item.id === id)
                    if (!item) return null

                    return (
                      <div key={`placed-left-${id}`} className="relative h-16 w-16 mx-2">
                        <Image
                          src={getItemImage(item) || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right category box - animals for autumn, xmas for winter, flowers for other seasons */}
          <div className="relative" onDragOver={handleDragOver} onDrop={handleDropOnRightBox}>
            <div className="relative w-[420px] h-[240px]">
              <Image src="/images/frame_box_large.svg" alt="Right box" fill className="object-contain" />

              {/* Container for all items, vertically centered */}
              <div className="absolute inset-0 flex items-center">
                {/* Category indicator */}
                <div className="relative h-16 w-16 ml-4">
                  <Image
                    src={getCategoryImage(false) || "/placeholder.svg"}
                    alt="Right category"
                    fill
                    className="object-contain"
                  />
                </div>

                {/* Placed items - in a horizontal line */}
                <div className="flex flex-row items-center ml-4">
                  {rightBoxItems.map((id) => {
                    const item = items.find((item) => item.id === id)
                    if (!item) return null

                    return (
                      <div key={`placed-right-${id}`} className="relative h-16 w-16 mx-2">
                        <Image
                          src={getItemImage(item) || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Success message */}
        {successMessage && <SuccessMessage message={successMessage} />}

        {/* New Navigation Buttons */}
        <div className="flex justify-center gap-4 mt-8 w-full">
          {/* All buttons in same container with identical dimensions */}
          <div className="flex gap-4 items-end">
            {/* WRÓĆ Button - always available in category-sorting-game */}
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
              className={`relative w-52 h-14 transition-all ${(leftBoxItems.length > 0 || rightBoxItems.length > 0) ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed opacity-50'}`}
              onClick={(leftBoxItems.length > 0 || rightBoxItems.length > 0) ? resetGame : undefined}
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
              className={`relative w-36 h-14 transition-all ${(userLoggedIn && !(leftBoxItems.length > 0 || rightBoxItems.length > 0) && !isHistoricallyCompleted) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-105'}`}
              onClick={(userLoggedIn && !(leftBoxItems.length > 0 || rightBoxItems.length > 0) && !isHistoricallyCompleted) ? undefined : onNext}
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
    </div>
  )
}
