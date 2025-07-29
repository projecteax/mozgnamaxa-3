"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"

import { useGameCompletion } from "@/hooks/use-game-completion"
import { getRandomSuccessMessage } from "@/lib/success-messages"
import { useSeason } from "@/contexts/season-context"

interface MemoryMatchGame2x4Props {
  onMenuClick: () => void
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
  isUnlocked: boolean
}

export default function MemoryMatchGame2x4({ onMenuClick }: MemoryMatchGame2x4Props) {
  // Use the game completion hook
  const { recordCompletion, isLoggedIn } = useGameCompletion()

  // Use season context
  const { selectedSeason, getThemeColors } = useSeason()
  const theme = getThemeColors()
  const isSummer = selectedSeason === "lato"
  const isAutumn = selectedSeason === "jesien"
  const isWinter = selectedSeason === "zima"

  // Define the memory items (top row) - 4 items for 2x4 grid
  const [memoryItems, setMemoryItems] = useState<MemoryItem[]>([])

  // Define the draggable items (right side)
  const [draggableItems, setDraggableItems] = useState([])

  // Define the drop zones (bottom row) - 4 zones in a row
  const [dropZones, setDropZones] = useState<DropZone[]>([])

  // State for tracking the current dragged item
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  // State for tracking if the game is completed
  const [isCompleted, setIsCompleted] = useState(false)

  const [successMessage, setSuccessMessage] = useState<string>("")

  // Timeout ref for memory item reveal
  const revealTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize game with shuffled positions
  useEffect(() => {
    // Update items based on season
    const newMemoryItems = isWinter
      ? [
          { id: "ant", image: "/images/santa_winter.svg", name: "Santa", revealed: false },
          { id: "butterfly", image: "/images/gift_winter.svg", name: "Gift", revealed: false },
          { id: "frog", image: "/images/raindeer_winter.svg", name: "Raindeer", revealed: false },
          { id: "stork", image: "/images/elf_winter.svg", name: "Elf", revealed: false },
        ]
      : isAutumn
        ? [
            { id: "nut_01", image: "/images/nut_01_autumn.svg", name: "Nut 01", revealed: false },
            { id: "nut_02", image: "/images/nut_02_autumn.svg", name: "Nut 02", revealed: false },
            { id: "chestnut_01", image: "/images/chestnut_01_autumn.svg", name: "Chestnut 01", revealed: false },
            { id: "chestnut_02", image: "/images/chestnut_02_autumn.svg", name: "Chestnut 02", revealed: false },
          ]
        : isSummer
          ? [
              { id: "ant", image: "/images/ball_02_summer.svg", name: "Ball", revealed: false },
              { id: "butterfly", image: "/images/icecream_summer.svg", name: "Ice Cream", revealed: false },
              { id: "frog", image: "/images/shell_02_summer.svg", name: "Shell", revealed: false },
              { id: "stork", image: "/images/sun_summer.svg", name: "Sun", revealed: false },
            ]
          : [
              { id: "ant", image: "/images/ant.svg", name: "Ant", revealed: false },
              { id: "butterfly", image: "/images/butterfly_orange.svg", name: "Butterfly", revealed: false },
              { id: "frog", image: "/images/frog.svg", name: "Frog", revealed: false },
              { id: "stork", image: "/images/stork.svg", name: "Stork", revealed: false },
            ]

    // Shuffle the memory items and update drop zones accordingly
    const shuffledItems = [...newMemoryItems].sort(() => Math.random() - 0.5)
    setMemoryItems(shuffledItems)

    // Update draggable items
    setDraggableItems(newMemoryItems.map((item) => ({ ...item, placed: false })))

    // Update drop zones to match the shuffled order, only first one unlocked
    const newDropZones = shuffledItems.map((item, index) => ({
      id: `drop-${index + 1}`,
      itemId: null,
      correctItemId: item.id,
      isUnlocked: index === 0, // Only first zone is unlocked initially
    }))
    setDropZones(newDropZones)

    // Reset game state when season changes
    setIsCompleted(false)
    setSuccessMessage("")
  }, [selectedSeason, isSummer, isAutumn, isWinter])

  // Auto-reveal memory items on game load
  useEffect(() => {
    // Reveal all items initially
    setMemoryItems((prevItems) => prevItems.map((item) => ({ ...item, revealed: true })))

    // Hide all items after 2 seconds
    const autoHideTimeout = setTimeout(() => {
      setMemoryItems((prevItems) => prevItems.map((item) => ({ ...item, revealed: false })))
    }, 2000)

    return () => {
      clearTimeout(autoHideTimeout)
    }
  }, [memoryItems.length]) // Depend on items length to re-trigger when season changes

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

    // If drop zone is not unlocked, do nothing
    if (!dropZone.isUnlocked) return

    // If drop zone already has an item, do nothing
    if (dropZone.itemId) return

    // Check if the placement is correct
    const isCorrect = dropZone.correctItemId === draggedItem

    if (isCorrect) {
      // If correct, update the drop zone with the dragged item
      setDropZones((prevZones) => {
        const updatedZones = prevZones.map((zone) => (zone.id === dropZoneId ? { ...zone, itemId: draggedItem } : zone))

        // Unlock the next zone
        const currentZoneIndex = updatedZones.findIndex((zone) => zone.id === dropZoneId)
        if (currentZoneIndex < updatedZones.length - 1) {
          updatedZones[currentZoneIndex + 1].isUnlocked = true
        }

        return updatedZones
      })

      // Mark the dragged item as placed
      setDraggableItems((prevItems) =>
        prevItems.map((item) => (item.id === draggedItem ? { ...item, placed: true } : item)),
      )

      // Check if all items are placed correctly
      setTimeout(() => {
        setDropZones((currentZones) => {
          const allZonesFilled = currentZones.every((zone) => zone.itemId !== null)
          const allCorrect = currentZones.every((zone) => zone.itemId === zone.correctItemId)

          if (allZonesFilled && allCorrect && !isCompleted) {
            console.log("Game completed! All items placed correctly.")
            setIsCompleted(true)
            setSuccessMessage(getRandomSuccessMessage())

            // Record completion in database
            if (isLoggedIn) {
              console.log("Recording completion for memory-match-2x4 game")
              recordCompletion("memory-match-2x4")
            } else {
              console.log("User not logged in - completion not recorded")
            }
          }

          return currentZones
        })
      }, 100)
    }
    // If incorrect placement, item returns to original position (no feedback message)

    // Reset dragged item
    setDraggedItem(null)
  }

  // Reset the game
  const resetGame = () => {
    setSuccessMessage("")
    // Reset drop zones - only first one unlocked
    setDropZones((prevZones) =>
      prevZones.map((zone, index) => ({
        ...zone,
        itemId: null,
        isUnlocked: index === 0,
      })),
    )

    // Reset draggable items
    setDraggableItems((prevItems) => prevItems.map((item) => ({ ...item, placed: false })))

    // Reset memory items
    setMemoryItems((prevItems) => prevItems.map((item) => ({ ...item, revealed: false })))

    // Reset game state
    setIsCompleted(false)

    // Shuffle items again
    const newMemoryItems = isWinter
      ? [
          { id: "ant", image: "/images/santa_winter.svg", name: "Santa", revealed: false },
          { id: "butterfly", image: "/images/gift_winter.svg", name: "Gift", revealed: false },
          { id: "frog", image: "/images/raindeer_winter.svg", name: "Raindeer", revealed: false },
          { id: "stork", image: "/images/elf_winter.svg", name: "Elf", revealed: false },
        ]
      : isAutumn
        ? [
            { id: "nut_01", image: "/images/nut_01_autumn.svg", name: "Nut 01", revealed: false },
            { id: "nut_02", image: "/images/nut_02_autumn.svg", name: "Nut 02", revealed: false },
            { id: "chestnut_01", image: "/images/chestnut_01_autumn.svg", name: "Chestnut 01", revealed: false },
            { id: "chestnut_02", image: "/images/chestnut_02_autumn.svg", name: "Chestnut 02", revealed: false },
          ]
        : isSummer
          ? [
              { id: "ant", image: "/images/ball_02_summer.svg", name: "Ball", revealed: false },
              { id: "butterfly", image: "/images/icecream_summer.svg", name: "Ice Cream", revealed: false },
              { id: "frog", image: "/images/shell_02_summer.svg", name: "Shell", revealed: false },
              { id: "stork", image: "/images/sun_summer.svg", name: "Sun", revealed: false },
            ]
          : [
              { id: "ant", image: "/images/ant.svg", name: "Ant", revealed: false },
              { id: "butterfly", image: "/images/butterfly_orange.svg", name: "Butterfly", revealed: false },
              { id: "frog", image: "/images/frog.svg", name: "Frog", revealed: false },
              { id: "stork", image: "/images/stork.svg", name: "Stork", revealed: false },
            ]

    const shuffledItems = [...newMemoryItems].sort(() => Math.random() - 0.5)
    setMemoryItems(shuffledItems)

    const newDropZones = shuffledItems.map((item, index) => ({
      id: `drop-${index + 1}`,
      itemId: null,
      correctItemId: item.id,
      isUnlocked: index === 0, // Only first zone is unlocked initially
    }))
    setDropZones(newDropZones)
  }

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (revealTimeoutRef.current) {
        clearTimeout(revealTimeoutRef.current)
      }
    }
  }, [])

  // Get the correct item image based on season and item id
  const getItemImage = (itemId: string) => {
    if (isWinter) {
      switch (itemId) {
        case "ant":
          return "/images/santa_winter.svg"
        case "butterfly":
          return "/images/gift_winter.svg"
        case "frog":
          return "/images/raindeer_winter.svg"
        case "stork":
          return "/images/elf_winter.svg"
        default:
          return "/placeholder.svg"
      }
    } else if (isAutumn) {
      switch (itemId) {
        case "nut_01":
          return "/images/nut_01_autumn.svg"
        case "nut_02":
          return "/images/nut_02_autumn.svg"
        case "chestnut_01":
          return "/images/chestnut_01_autumn.svg"
        case "chestnut_02":
          return "/images/chestnut_02_autumn.svg"
        default:
          return "/placeholder.svg"
      }
    } else if (isSummer) {
      switch (itemId) {
        case "ant":
          return "/images/ball_02_summer.svg"
        case "butterfly":
          return "/images/icecream_summer.svg"
        case "frog":
          return "/images/shell_02_summer.svg"
        case "stork":
          return "/images/sun_summer.svg"
        default:
          return "/placeholder.svg"
      }
    } else {
      switch (itemId) {
        case "ant":
          return "/images/ant.svg"
        case "butterfly":
          return "/images/butterfly_orange.svg"
        case "frog":
          return "/images/frog.svg"
        case "stork":
          return "/images/stork.svg"
        default:
          return "/placeholder.svg"
      }
    }
  }

  return (
    <div className="w-full max-w-4xl">
      {/* Header with title */}
      <div className="w-full flex justify-between items-center mb-8">
        <div className="relative w-16 h-16">
          <Image
            src={
              isWinter
                ? "/images/sound_winter.svg"
                : isAutumn
                  ? "/images/sound_autumn.svg"
                  : theme.soundIcon || "/placeholder.svg"
            }
            alt="Sound"
            fill
            className="object-contain cursor-pointer"
          />
        </div>

        <div className="relative h-24 w-80 md:w-[500px] flex items-center justify-center">
          <Image
            src={
              isWinter
                ? "/images/title_box_small_winter.svg"
                : isAutumn
                  ? "/images/title_box_small_autumn.svg"
                  : isSummer
                    ? "/images/title_box_small_summer.svg"
                    : "/images/green_large_box.svg"
            }
            alt="Title box"
            fill
            className="object-contain"
          />
          <span className="relative z-10 text-white text-2xl md:text-3xl font-sour-gummy font-thin tracking-wider">
            ZAPAMIĘTAJ I UŁÓŻ TAK SAMO.
          </span>
        </div>

        <div className="relative w-16 h-16" onClick={onMenuClick}>
          <Image
            src={
              isWinter
                ? "/images/menu_winter.svg"
                : isAutumn
                  ? "/images/menu_autumn.svg"
                  : theme.menuIcon || "/placeholder.svg"
            }
            alt="Menu"
            fill
            className="object-contain cursor-pointer"
          />
        </div>
      </div>

      {/* Game area */}
      <div className="flex flex-col items-center mt-8">
        {/* Main content area */}
        <div className="w-full flex">
          {/* Left side with memory and drop zones */}
          <div className="w-3/4 flex flex-col gap-8 justify-center">
            {/* Memory items row (top row) - 4 items in a row */}
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
                    <Image
                      src={
                        isWinter
                          ? "/images/box_covered_winter.svg"
                          : isAutumn
                            ? "/images/box_covered_autumn.svg"
                            : isSummer
                              ? "/images/box_covered_summer.svg"
                              : "/images/box_covered.png"
                      }
                      alt="Covered box"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Drop zones row (bottom row) - 4 zones in a row */}
            <div className="flex justify-center gap-6">
              {dropZones.map((zone) => (
                <div
                  key={`zone-${zone.id}`}
                  className={`relative h-32 w-32 ${zone.isUnlocked ? "" : "opacity-50"}`}
                  onDragOver={zone.isUnlocked ? handleDragOver : undefined}
                  onDrop={zone.isUnlocked ? (e) => handleDrop(e, zone.id) : undefined}
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
                          src={getItemImage(zone.itemId) || "/placeholder.svg"}
                          alt={zone.itemId}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right side with draggable items - arranged in rows like matching-game */}
          <div className="w-1/4 flex flex-col items-center justify-center gap-4">
            {/* First row - 1 icon */}
            <div className="flex justify-center">
              {draggableItems.slice(0, 1).map((item) => {
                if (item.placed) return <div key={`empty-${item.id}`} className="h-24 w-24" />
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

            {/* Second row - 2 icons */}
            <div className="flex justify-center gap-4">
              {draggableItems.slice(1, 3).map((item) => {
                if (item.placed) return <div key={`empty-${item.id}`} className="h-24 w-24" />
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

            {/* Third row - 1 icon */}
            <div className="flex justify-center">
              {draggableItems.slice(3, 4).map((item) => {
                if (item.placed) return <div key={`empty-${item.id}`} className="h-24 w-24" />
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
      </div>

      {/* Success message and button - only visible when the game is complete */}
      {isCompleted && (
        <div className="flex flex-col items-center mt-8">
          <div className="mb-4 p-4 bg-green-100 border-2 border-green-400 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-800 mb-2">🎉 {successMessage} 🎉</div>
          </div>
          <button onClick={resetGame} className="bg-[#539e1b] text-white px-6 py-3 rounded-full font-bold text-lg">
            Zagraj ponownie
          </button>
        </div>
      )}
    </div>
  )
}
