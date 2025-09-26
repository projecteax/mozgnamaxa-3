"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import { useGameCompletionWithHistory } from "@/hooks/use-game-completion"
import { getRandomSuccessMessage } from "@/lib/success-messages"
import { useSeason } from "@/contexts/season-context"
import SuccessMessage from "./success-message"
import SoundButtonEnhanced from "./sound-button-enhanced"

type Item = {
  id: string
  name: string
  image: string
}

interface MatchingGameProps {
  onMenuClick: () => void
  onBack?: () => void
  onNext?: () => void
  onRetry?: () => void
  userLoggedIn?: boolean
  currentSeason?: string
  isGameCompleted?: boolean
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

export default function MatchingGame({ onMenuClick, onBack, onNext, onRetry, userLoggedIn = false, currentSeason = "wiosna", isGameCompleted = false }: MatchingGameProps) {
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
  const [touchStartPos, setTouchStartPos] = useState<{ x: number; y: number } | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(null)
  const { recordCompletion, isLoggedIn } = useGameCompletionWithHistory("matching-game")

  // Reset game state when items change (season change or new game)
  useEffect(() => {
    setCorrectItems([])
    setIsGameComplete(false)
    setSuccessMessage("")
  }, [scrambledTargetItems])

  // Prevent scrolling during drag operations and update drag position
  useEffect(() => {
    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (isDragging && draggedItem) {
        e.preventDefault()
        const touch = e.touches[0]
        setDragOffset({ 
          x: touch.clientX, 
          y: touch.clientY 
        })
      }
    }

    const preventScroll = (e: TouchEvent) => {
      if (isDragging) {
        e.preventDefault()
      }
    }

    if (isDragging) {
      document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false })
      document.addEventListener('touchmove', preventScroll, { passive: false })
      document.body.style.overflow = 'hidden'
    } else {
      document.removeEventListener('touchmove', handleGlobalTouchMove)
      document.removeEventListener('touchmove', preventScroll)
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.removeEventListener('touchmove', handleGlobalTouchMove)
      document.removeEventListener('touchmove', preventScroll)
      document.body.style.overflow = 'auto'
    }
  }, [isDragging, draggedItem])

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
    e.stopPropagation()
    
    const touch = e.touches[0]
    const rect = e.currentTarget.getBoundingClientRect()
    
    setTouchStartPos({ x: touch.clientX, y: touch.clientY })
    setDragOffset({ 
      x: touch.clientX - rect.left, 
      y: touch.clientY - rect.top 
    })
    setDraggedItem(id)
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!draggedItem) return
    
    const touch = e.touches[0]
    const deltaX = Math.abs(touch.clientX - (touchStartPos?.x || 0))
    const deltaY = Math.abs(touch.clientY - (touchStartPos?.y || 0))
    
    // Only consider it dragging if moved more than 10px
    if (deltaX > 10 || deltaY > 10) {
      setIsDragging(true)
      // Update drag offset for visual feedback
      const rect = e.currentTarget.getBoundingClientRect()
      setDragOffset({ 
        x: touch.clientX - rect.left, 
        y: touch.clientY - rect.top 
      })
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!draggedItem) {
      setIsDragging(false)
      setTouchStartPos(null)
      setDragOffset(null)
      setDraggedItem(null)
      return
    }

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
    setIsDragging(false)
    setTouchStartPos(null)
    setDragOffset(null)
  }

  const handleClick = (itemId: string) => {
    if (correctItems.length < scrambledTargetItems.length) {
      const currentCorrectCount = correctItems.length
      const expectedNextItem = scrambledTargetItems[currentCorrectCount]
      
      if (itemId === expectedNextItem.id) {
        setCorrectItems([...correctItems, itemId])
      }
    }
  }

  const handleRetry = () => {
    // Reset game state without reloading the page
    setCorrectItems([])
    setIsGameComplete(false)
    setSuccessMessage("")
    setDraggedItem(null)
    setIsDragging(false)
    setTouchStartPos(null)
    setDragOffset(null)
  }

  // Get the appropriate title box based on season
  const getTitleBox = () => {
    switch (selectedSeason) {
      case "lato":
        return "/images/title_box_small_summer.svg"
      case "jesien":
        return "/images/title_box_small_autumn.svg"
      case "zima":
        return "/images/title_box_small_winter.svg"
      default:
        return "/images/title_box_small.png"
    }
  }

  const titleBoxImage = getTitleBox()

  if (!scrambledTargetItems) {
    return <div>Ładowanie...</div>
  }

  return (
    <div className="w-full max-w-4xl">
      <div className="w-full flex justify-between items-center mb-8">
        <div className="relative w-16 h-16">
          <SoundButtonEnhanced
            text="UŁÓŻ TAK SAMO"
            soundIcon={theme.soundIcon || "/images/sound_icon_dragon_page.svg"}
            size="xl"
            className="w-full h-full"
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
            {scrambledTargetItems.map((item, index) => {
              const isAvailable = correctItems.length === index && !correctItems.includes(item.id)
              const isFilled = correctItems.includes(item.id)
              
              return (
                <div
                  key={`dropzone-${item.id}`}
                  data-id={item.id}
                  className={`relative h-[140px] w-[140px] transition-all duration-200 ${
                    !isAvailable && !isFilled 
                      ? 'opacity-40' 
                      : isAvailable 
                        ? 'hover:scale-105 cursor-pointer' 
                        : ''
                  }`}
                  onDragOver={isAvailable ? handleDragOver : undefined}
                  onDrop={isAvailable ? (e) => handleDrop(e, item.id) : undefined}
                  onTouchEnd={isAvailable ? handleTouchEnd : undefined}
                  style={{
                    touchAction: 'none',
                    userSelect: 'none',
                    WebkitUserSelect: 'none'
                  }}
                >
                  <Image 
                    src="/images/white_box_medium.svg" 
                    alt="Box" 
                    fill 
                    className="object-contain" 
                    priority 
                  />
                  {isFilled && (
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
              )
            })}
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
                  onClick={() => handleClick(item.id)}
                  className={`relative h-[80px] w-[80px] cursor-grab touch-manipulation transition-all duration-200 ${
                    draggedItem === item.id && isDragging 
                      ? 'scale-110 opacity-80 shadow-lg z-50' 
                      : 'hover:scale-105'
                  }`}
                  style={{
                    touchAction: 'none',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    WebkitTouchCallout: 'none',
                    position: draggedItem === item.id && isDragging ? 'fixed' : 'relative',
                    left: draggedItem === item.id && isDragging && dragOffset 
                      ? `${dragOffset.x - 40}px` 
                      : undefined,
                    top: draggedItem === item.id && isDragging && dragOffset 
                      ? `${dragOffset.y - 40}px` 
                      : undefined,
                    zIndex: draggedItem === item.id && isDragging ? 1000 : undefined
                  }}
                >
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-contain pointer-events-none"
                    style={{
                      filter: draggedItem === item.id && isDragging 
                        ? "drop-shadow(4px 4px 8px rgba(0, 0, 0, 0.4))" 
                        : "drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.25))",
                    }}
                  />
                </div>
              ),
          )}
        </div>
      </div>

      {isGameComplete && <SuccessMessage message={successMessage} />}

      {/* New Navigation Buttons */}
      <div className="flex justify-center gap-4 mt-8 w-full">
        {/* All buttons in same container with identical dimensions */}
        <div className="flex gap-4 items-end">
          {/* WRÓĆ Button - unavailable in spring matching-game, available in others */}
          <div 
            className={`relative w-36 h-14 transition-all ${currentSeason === "wiosna" ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-105'}`}
            onClick={currentSeason !== "wiosna" ? onBack : undefined}
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



          {/* DALEJ Button - only unlocked when game completed (for logged users) or always available (for non-logged users) */}
          <div 
            className={`relative w-36 h-14 transition-all ${(userLoggedIn && !isGameCompleted) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-105'}`}
            onClick={(userLoggedIn && !isGameCompleted) ? undefined : onNext}
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
