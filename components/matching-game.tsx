"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import { useGameCompletion } from "@/hooks/use-game-completion"
import { getRandomSuccessMessage } from "@/lib/success-messages"
import { useSeason } from "@/contexts/season-context"

type Item = {
  id: string
  name: string
  image: string
}

interface MatchingGameProps {
  onMenuClick: () => void
}

// Helper function to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function MatchingGame({ onMenuClick }: MatchingGameProps) {
  const { selectedSeason, getThemeColors } = useSeason()
  const theme = getThemeColors()
  const isSummer = selectedSeason === "lato"
  const isAutumn = selectedSeason === "jesien"
  const isWinter = selectedSeason === "zima"

  const springItemSets = useMemo(
    () => [
      [
        { id: "ladybug", name: "Ladybug", image: "/images/ladybug.svg" },
        { id: "yellow-flower", name: "Yellow Flower", image: "/images/flower_yellow.svg" },
        { id: "butterfly", name: "Butterfly", image: "/images/butterfly_orange.svg" },
        { id: "red-flower", name: "Red Flower", image: "/images/flower_red.svg" },
      ],
      [
        { id: "bee", name: "Bee", image: "/images/bee.svg" },
        { id: "pink-flower", name: "Pink Flower", image: "/images/flower_pink.svg" },
        { id: "ant", name: "Ant", image: "/images/ant.svg" },
        { id: "purple-flower", name: "Purple Flower", image: "/images/flower_purple.svg" },
      ],
    ],
    [],
  )

  const summerItemSets = useMemo(
    () => [
      [
        { id: "sun", name: "Sun", image: "/images/sun_summer.svg" },
        { id: "icecream", name: "Ice Cream", image: "/images/icecream_summer.svg" },
        { id: "bike", name: "Bike", image: "/images/bike_summer.svg" },
        { id: "strawberry", name: "Strawberry", image: "/images/strawberry_summer.svg" },
      ],
    ],
    [],
  )

  const autumnItemSets = useMemo(
    () => [
      [
        { id: "orange-leaf", name: "Orange Leaf", image: "/images/leaf_orange_autumn.svg" },
        { id: "yellow-leaf", name: "Yellow Leaf", image: "/images/leaf_yellow_autumn.svg" },
        { id: "green-leaf", name: "Green Leaf", image: "/images/leaf_green_autumn.svg" },
        { id: "brown-leaf", name: "Brown Leaf", image: "/images/leaf_brown_autumn.svg" },
      ],
    ],
    [],
  )

  const winterItemSets = useMemo(
    () => [
      [
        { id: "snowman", name: "Snowman", image: "/images/snowman_winter.svg" },
        { id: "snowflake", name: "Snowflake", image: "/images/snowflake_01_winter.svg" },
        { id: "scarf", name: "Scarf", image: "/images/scarf_winter.svg" },
        { id: "hat", name: "Hat", image: "/images/hat_01_winter.svg" },
      ],
    ],
    [],
  )

  const itemSets = useMemo(() => {
    if (isSummer) return summerItemSets
    if (isAutumn) return autumnItemSets
    if (isWinter) return winterItemSets
    return springItemSets
  }, [isSummer, isAutumn, isWinter, springItemSets, summerItemSets, autumnItemSets, winterItemSets])

  const [currentSetIndex, setCurrentSetIndex] = useState(0)
  const baseItems = useMemo(() => itemSets[currentSetIndex] || itemSets[0], [itemSets, currentSetIndex])

  // Scramble the items for target boxes (top row)
  const scrambledTargetItems = useMemo(() => {
    return shuffleArray(baseItems)
  }, [baseItems])

  // Scramble the items for draggable items (right column) - different order
  const scrambledDraggableItems = useMemo(() => {
    return shuffleArray(baseItems)
  }, [baseItems])

  // Create a mapping from scrambled position to original position for correct matching
  const positionMapping = useMemo(() => {
    const mapping: { [key: string]: number } = {}
    scrambledTargetItems.forEach((item, index) => {
      const originalIndex = baseItems.findIndex(originalItem => originalItem.id === item.id)
      mapping[item.id] = originalIndex
    })
    return mapping
  }, [scrambledTargetItems, baseItems])

  const [correctItems, setCorrectItems] = useState<string[]>([])
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [isGameComplete, setIsGameComplete] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string>("")
  const { recordCompletion, isLoggedIn } = useGameCompletion()

  // Reset game state when items change (season change or new game)
  useEffect(() => {
    setCorrectItems([])
    setIsGameComplete(false)
    setSuccessMessage("")
  }, [scrambledTargetItems])

  useEffect(() => {
    if (correctItems.length === scrambledTargetItems.length) {
      setIsGameComplete(true)
      setSuccessMessage((prev) => prev || getRandomSuccessMessage())
      if (isLoggedIn) {
        const gameId = isSummer
          ? "matching-game-summer"
          : isAutumn
            ? "matching-game-autumn"
            : isWinter
              ? "matching-game-winter"
              : "matching-game"
        recordCompletion(gameId as any)
      }
    } else {
      setIsGameComplete(false)
    }
  }, [correctItems.length, scrambledTargetItems.length, isLoggedIn, recordCompletion, isSummer, isAutumn, isWinter])

  const handleDragStart = (id: string) => setDraggedItem(id)
  const handleDragOver = (e: React.DragEvent) => e.preventDefault()

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    if (
      draggedItem &&
      targetId === draggedItem &&
      correctItems.length < scrambledTargetItems.length
    ) {
      // Check if this is the next correct item in sequence
      const currentCorrectCount = correctItems.length
      const expectedNextItem = scrambledTargetItems[currentCorrectCount]
      
      if (targetId === expectedNextItem.id) {
        setCorrectItems([...correctItems, targetId])
      }
    }
    setDraggedItem(null)
  }

  const handleTouchStart = (e: React.TouchEvent, id: string) => {
    e.preventDefault()
    setDraggedItem(id)
  }

  const handleTouchMove = (e: React.TouchEvent) => e.preventDefault()

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault()
    const touch = e.changedTouches[0]
    const dropZone = document.elementFromPoint(touch.clientX, touch.clientY)
    const targetId = dropZone?.getAttribute("data-id")

    if (
      draggedItem &&
      targetId &&
      targetId === draggedItem &&
      correctItems.length < scrambledTargetItems.length
    ) {
      // Check if this is the next correct item in sequence
      const currentCorrectCount = correctItems.length
      const expectedNextItem = scrambledTargetItems[currentCorrectCount]
      
      if (targetId === expectedNextItem.id) {
        setCorrectItems([...correctItems, targetId])
      }
    }
    setDraggedItem(null)
  }

  const titleBoxImage = theme.titleBox

  if (!scrambledTargetItems) {
    return <div>Ładowanie...</div>
  }

  return (
    <div className="w-full max-w-4xl">
      <div className="w-full flex justify-between items-center mb-8">
        <div className="relative w-16 h-16">
          <Image
            src={theme.soundIcon || "/placeholder.svg"}
            alt="Sound"
            fill
            className="object-contain cursor-pointer"
            style={{
              filter: "drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3))",
            }}
          />
        </div>
        <div className="relative h-24 w-80 md:w-[500px] flex items-center justify-center">
          <Image src={titleBoxImage || "/placeholder.svg"} alt="Title box" fill className="object-contain" />
          <span className="relative z-10 text-white text-2xl md:text-3xl font-sour-gummy font-thin">
            UŁÓŻ TAK SAMO.
          </span>
        </div>
        <div className="relative w-16 h-16" onClick={onMenuClick}>
          <Image
            src={theme.menuIcon || "/placeholder.svg"}
            alt="Menu"
            fill
            className="object-contain cursor-pointer"
            style={{
              filter: "drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3))",
            }}
          />
        </div>
      </div>

      <div className="relative w-full">
        <div className="flex flex-col items-start pl-4">
          <div className="flex gap-2 w-full">
            {scrambledTargetItems.map((item) => (
              <div key={`target-${item.id}`} className="relative h-[140px] w-[140px]">
                <Image src="/images/white_box_medium.svg" alt="Box" fill className="object-contain" priority />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative h-[80px] w-[80px]">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-contain"
                      style={{
                        filter: "drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.25))",
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 w-full mt-8">
            {scrambledTargetItems.map((item) => (
              <div
                key={`dropzone-${item.id}`}
                data-id={item.id}
                className="relative h-[140px] w-[140px]"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, item.id)}
                onTouchEnd={handleTouchEnd}
              >
                <Image src="/images/white_box_medium.svg" alt="Box" fill className="object-contain" priority />
                {correctItems.includes(item.id) && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative h-[80px] w-[80px]">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-contain"
                        style={{
                          filter: "drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.25))",
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="absolute right-4 top-0 h-full flex flex-col justify-center gap-8">
          {scrambledDraggableItems.map(
            (item) =>
              !correctItems.includes(item.id) && (
                <div
                  key={`draggable-${item.id}`}
                  draggable
                  onDragStart={() => handleDragStart(item.id)}
                  onTouchStart={(e) => handleTouchStart(e, item.id)}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  className="relative h-[80px] w-[80px] cursor-grab touch-manipulation"
                >
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-contain"
                    style={{
                      filter: "drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.25))",
                    }}
                  />
                </div>
              ),
          )}
        </div>
      </div>

      {isGameComplete && (
        <div className="flex flex-col items-center mt-8">
          <div className="mb-4 p-4 bg-green-100 border-2 border-green-400 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-800 mb-2">🎉 {successMessage} 🎉</div>
          </div>
        </div>
      )}
    </div>
  )
}
