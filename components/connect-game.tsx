"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"

// Add the import for useGameCompletion at the top of the file
import { useGameCompletionWithHistory } from "@/hooks/use-game-completion"
import { getRandomSuccessMessage } from "@/lib/success-messages"
import { useSeason } from "@/contexts/season-context"
import SoundButtonEnhanced from "./sound-button-enhanced"
import SuccessMessage from "./success-message"

interface ConnectGameProps {
  onMenuClick: () => void
  onBack?: () => void
  onNext?: () => void
  onRetry?: () => void
  userLoggedIn?: boolean
  currentSeason?: string
  isGameCompleted?: boolean
  onComplete?: () => void
}

interface GameItem {
  id: string
  image: string
  springImage?: string
  autumnImage?: string
  winterImage?: string
  pairId: string
  isLeft: boolean
  matched: boolean
}

type SpringConnectVariant = 1 | 2 | 3

// Helper function to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

// Helper function to shuffle right array ensuring it's different from left array
function shuffleArrayDifferent<T extends { pairId: string }>(rightArray: T[], leftArray: T[]): T[] {
  const shuffled = [...rightArray]
  let attempts = 0
  const maxAttempts = 10

  do {
    // Fisher-Yates shuffle algorithm
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    attempts++

    // Check if the order is different from left array
    const isSameOrder = shuffled.every((rightItem, index) => {
      const leftItem = leftArray[index]
      return leftItem && rightItem.pairId === leftItem.pairId
    })

    if (!isSameOrder || attempts >= maxAttempts) {
      break
    }
  } while (attempts < maxAttempts)

  return shuffled
}

export default function ConnectGame({ onMenuClick, onBack, onNext, onRetry, userLoggedIn = false, currentSeason = "wiosna", isGameCompleted = false, onComplete }: ConnectGameProps) {
  // First, add a useGameCompletion hook at the top with other hooks
  const { recordCompletion, isLoggedIn, isHistoricallyCompleted } = useGameCompletionWithHistory("connect-game")
  const { selectedSeason, getThemeColors } = useSeason()
  const [diagnosticSpringVariant, setDiagnosticSpringVariant] = useState<0 | SpringConnectVariant>(0)
  const [randomSpringVariant] = useState<SpringConnectVariant>(() => (Math.floor(Math.random() * 3) + 1) as SpringConnectVariant)
  const activeSpringVariant = diagnosticSpringVariant === 0 ? randomSpringVariant : diagnosticSpringVariant

  // Define the game items with new SVG files
  const [leftItems, setLeftItems] = useState<GameItem[]>([
    // SPRING (wiosna)
    selectedSeason === "wiosna"
      ? [
          {
            id: "single-flower",
            image: "/images/red_flower.svg",
            pairId: "flower",
            isLeft: true,
            matched: false,
          },
          {
            id: "single-bee",
            image: "/images/bee.svg",
            pairId: "bee",
            isLeft: true,
            matched: false,
          },
          {
            id: "single-butterfly",
            image: "/images/butterfly_orange.svg",
            pairId: "butterfly",
            isLeft: true,
            matched: false,
          },
        ]
      : [
    {
      id: "single-leaf",
      image: "/images/leaf_green_autumn.svg",
            springImage: "/images/leaf_green_spring.svg",
      autumnImage: "/images/onion_autumn.svg",
      winterImage: "/images/person_winter.svg",
      pairId: selectedSeason === "zima" ? "person" : selectedSeason === "jesien" ? "onion" : "leaf",
      isLeft: true,
      matched: false,
    },
    {
      id: "single-hedgehog",
      image: "/images/hedgehog_autumn.svg",
            springImage: "/images/hedgehog_spring.svg",
      autumnImage: "/images/carrot_autumn.svg",
      winterImage: "/images/cookie_winter.svg",
      pairId: selectedSeason === "zima" ? "cookie" : selectedSeason === "jesien" ? "carrot" : "hedgehog",
      isLeft: true,
      matched: false,
    },
    {
      id: "single-nut",
      image: "/images/husselnut_autumn.svg",
            springImage: "/images/husselnut_spring.svg",
      autumnImage: "/images/beetroot_autumn.svg",
      winterImage: "/images/ball_winter.svg",
      pairId: selectedSeason === "zima" ? "ball" : selectedSeason === "jesien" ? "beetroot" : "nut",
      isLeft: true,
      matched: false,
    },
        ],
  ].flat())

  // Define the right items
  const [rightItems, setRightItems] = useState<GameItem[]>([])

  // State for tracking the current dragged item
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  // State for tracking if the dragged item is from the left or right
  const [draggedIsLeft, setDraggedIsLeft] = useState<boolean>(false)

  // State for feedback message
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)

  // State for tracking matched pairs
  const [matchedPairs, setMatchedPairs] = useState<{ [key: string]: boolean }>()

  // State for tracking if all pairs are matched
  const [allMatched, setAllMatched] = useState(false)

  // State for success message
  const [successMessage, setSuccessMessage] = useState<string>("")

  // State to track if success message has been set (to prevent multiple random messages)
  const [hasSetSuccessMessage, setHasSetSuccessMessage] = useState(false)

  // Function to get the correct image based on season
  const getImageForSeason = (item: GameItem) => {
    if (selectedSeason === "zima" && item.winterImage) {
      return item.winterImage
    }
    if (selectedSeason === "jesien" && item.autumnImage) {
      return item.autumnImage
    }
    if ((selectedSeason === "wiosna" || !selectedSeason) && item.springImage) {
      return item.springImage
    }
    return item.image
  }

  // Function to get the correct title box based on season
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

  // Initialize right items in specific order with new SVG files
  useEffect(() => {
    if (selectedSeason === "wiosna") {
      if (activeSpringVariant === 2) {
        const left = [
          { id: "v2-snowdrop-single", image: "/images/connect_v2_snowdrop_single.svg", pairId: "snowdrop", isLeft: true, matched: false },
          { id: "v2-ant-single", image: "/images/connect_v2_ant_single.svg", pairId: "ant", isLeft: true, matched: false },
          { id: "v2-radish-single", image: "/images/connect_v2_radish_single.svg", pairId: "radish", isLeft: true, matched: false },
        ]
        const right = [
          { id: "v2-ant-group", image: "/images/connect_v2_ant_group.svg", pairId: "ant", isLeft: false, matched: false },
          { id: "v2-radish-bunch", image: "/images/connect_v2_radish_bunch.svg", pairId: "radish", isLeft: false, matched: false },
          { id: "v2-snowdrop-bouquet", image: "/images/connect_v2_snowdrop_bouquet.svg", pairId: "snowdrop", isLeft: false, matched: false },
        ]
        setLeftItems(left)
        setRightItems(right)
      } else if (activeSpringVariant === 3) {
        const left = [
          { id: "v3-bee-single", image: "/images/connect_v3_bee_single.svg", pairId: "bee", isLeft: true, matched: false },
          { id: "v3-lark-single", image: "/images/connect_v3_lark_single.svg", pairId: "lark", isLeft: true, matched: false },
          { id: "v3-daffodil-single", image: "/images/connect_v3_daffodil_single.svg", pairId: "daffodil", isLeft: true, matched: false },
        ]
        const right = [
          { id: "v3-nest-group", image: "/images/connect_v3_nest_group.svg", pairId: "lark", isLeft: false, matched: false },
          { id: "v3-daffodil-bouquet", image: "/images/connect_v3_daffodil_bouquet.svg", pairId: "daffodil", isLeft: false, matched: false },
          { id: "v3-bee-group", image: "/images/connect_v3_bee_group.svg", pairId: "bee", isLeft: false, matched: false },
        ]
        setLeftItems(left)
        setRightItems(right)
      } else {
        const left = [
          {
            id: "single-flower",
            image: "/images/red_flower.svg",
            pairId: "flower",
            isLeft: true,
            matched: false,
          },
          {
            id: "single-bee",
            image: "/images/bee.svg",
            pairId: "bee",
            isLeft: true,
            matched: false,
          },
          {
            id: "single-butterfly",
            image: "/images/butterfly_orange.svg",
            pairId: "butterfly",
            isLeft: true,
            matched: false,
          },
        ]
        const rightArray = [
          {
            id: "set-of-flowers",
            image: "/images/red_flowers_multiple.svg",
            pairId: "flower",
            isLeft: false,
            matched: false,
          },
          {
            id: "set-of-bees",
            image: "/images/bees.svg",
            pairId: "bee",
            isLeft: false,
            matched: false,
          },
          {
            id: "set-of-butterflies",
            image: "/images/butterflies.svg",
            pairId: "butterfly",
            isLeft: false,
            matched: false,
          },
        ]
        const right = rightArray
        setLeftItems(left)
        setRightItems(right)
      }
      setMatchedPairs({})
      setAllMatched(false)
      return
    }
    // Update left items with correct pairIds based on season
    setLeftItems((prevItems) =>
      prevItems.map((item) => ({
        ...item,
        pairId:
          item.id === "single-leaf"
            ? selectedSeason === "zima"
              ? "person"
              : selectedSeason === "jesien"
                ? "onion"
                : "leaf"
            : item.id === "single-hedgehog"
              ? selectedSeason === "zima"
                ? "cookie"
                : selectedSeason === "jesien"
                  ? "carrot"
                  : "hedgehog"
              : selectedSeason === "zima"
                ? "ball"
                : selectedSeason === "jesien"
                  ? "beetroot"
                  : "nut",
      })),
    )

    // Build and shuffle left and right items for other seasons
    const left = shuffleArray(
      selectedSeason === "lato" 
        ? [
            // Summer-specific items
            {
              id: "single-digger",
              image: "/images/digger.svg",
              pairId: "digger",
              isLeft: true,
              matched: false,
            },
            {
              id: "single-sun",
              image: "/images/sun_summer.svg",
              pairId: "sun",
              isLeft: true,
              matched: false,
            },
            {
              id: "single-flamingo",
              image: "/images/flamingo_summer.svg",
              pairId: "flamingo",
              isLeft: true,
              matched: false,
            },
          ]
        : [
            {
              id: "single-leaf",
              image: "/images/leaf_green_autumn.svg",
              springImage: "/images/leaf_green_spring.svg",
              autumnImage: "/images/onion_autumn.svg",
              winterImage: "/images/person_winter.svg",
              pairId: selectedSeason === "zima" ? "person" : selectedSeason === "jesien" ? "onion" : "leaf",
              isLeft: true,
              matched: false,
            },
            {
              id: "single-hedgehog",
              image: "/images/hedgehog_autumn.svg",
              springImage: "/images/hedgehog_spring.svg",
              autumnImage: "/images/carrot_autumn.svg",
              winterImage: "/images/cookie_winter.svg",
              pairId: selectedSeason === "zima" ? "cookie" : selectedSeason === "jesien" ? "carrot" : "hedgehog",
              isLeft: true,
              matched: false,
            },
            {
              id: "single-nut",
              image: "/images/husselnut_autumn.svg",
              springImage: "/images/husselnut_spring.svg",
              autumnImage: "/images/beetroot_autumn.svg",
              winterImage: "/images/ball_winter.svg",
              pairId: selectedSeason === "zima" ? "ball" : selectedSeason === "jesien" ? "beetroot" : "nut",
              isLeft: true,
              matched: false,
            },
          ]
    )
    const rightArray = selectedSeason === "lato"
      ? [
          // Summer-specific right items
          {
            id: "set-of-bucket",
            image: "/images/bucket_summer.svg",
            pairId: "digger",
            isLeft: false,
            matched: false,
          },
          {
            id: "set-of-sunglasses",
            image: "/images/sunglasses_summer.svg",
            pairId: "sun",
            isLeft: false,
            matched: false,
          },
          {
            id: "set-of-swimsuit",
            image: "/images/swimsuit_summer.svg",
            pairId: "flamingo",
            isLeft: false,
            matched: false,
          },
        ]
      : [
          {
            id: "set-of-leaves",
            image: "/images/leaf_orange_autumn.svg",
            springImage: "/images/leaf_orange_spring.svg",
            autumnImage: "/images/onion_autumn_multiple.svg",
            winterImage: "/images/people_winter.svg",
            pairId: selectedSeason === "zima" ? "person" : selectedSeason === "jesien" ? "onion" : "leaf",
            isLeft: false,
            matched: false,
          },
          {
            id: "set-of-hedgehogs",
            image: "/images/squirel_autumn.svg",
            springImage: "/images/squirel_spring.svg",
            autumnImage: "/images/carrot_autumn_multiple.svg",
            winterImage: "/images/cookies_winter.svg",
            pairId: selectedSeason === "zima" ? "cookie" : selectedSeason === "jesien" ? "carrot" : "hedgehog",
            isLeft: false,
            matched: false,
          },
          {
            id: "set-of-nuts",
            image: "/images/zoladz_autumn.svg",
            springImage: "/images/zoladz_spring.svg",
            autumnImage: "/images/beetroot_autumn_multiple.svg",
            winterImage: "/images/balls_multiple_winter.svg",
            pairId: selectedSeason === "zima" ? "ball" : selectedSeason === "jesien" ? "beetroot" : "nut",
            isLeft: false,
            matched: false,
          },
        ]
    const right = shuffleArrayDifferent(rightArray, left)
    setLeftItems(left)
    setRightItems(right)
  }, [selectedSeason, activeSpringVariant])

  // Handle drag start
  const handleDragStart = (id: string, isLeft: boolean) => {
    setDraggedItem(id)
    setDraggedIsLeft(isLeft)
    setFeedbackMessage(null)
  }

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  // Handle drop - updated to handle both icon drops and adjacent drops
  const handleDrop = (e: React.DragEvent, targetId: string, targetIsLeft: boolean) => {
    e.preventDefault()

    if (!draggedItem) return

    // Don't allow dropping on the same type (left on left or right on right)
    if (draggedIsLeft === targetIsLeft) return

    let draggedItemObj, targetItemObj

    // Find the dragged and target items based on whether they're left or right
    if (draggedIsLeft) {
      draggedItemObj = leftItems.find((item) => item.id === draggedItem)
      targetItemObj = rightItems.find((item) => item.id === targetId)
    } else {
      draggedItemObj = rightItems.find((item) => item.id === draggedItem)
      targetItemObj = leftItems.find((item) => item.id === targetId)
    }

    if (!draggedItemObj || !targetItemObj) return

    // Check if this is the correct match
    if (draggedItemObj.pairId === targetItemObj.pairId) {
      // Correct match
      setMatchedPairs({ ...matchedPairs, [draggedItemObj.pairId]: true })

      setLeftItems((prevItems) =>
        prevItems.map((item) => (item.pairId === draggedItemObj.pairId ? { ...item, matched: true } : item)),
      )

      setRightItems((prevItems) =>
        prevItems.map((item) => (item.pairId === draggedItemObj.pairId ? { ...item, matched: true } : item)),
      )

      // Remove this line:
      // setFeedbackMessage("Brawo")
    }
    // Remove error feedback for incorrect matches

    setDraggedItem(null)

    // Update the setTimeout block in the handleDrop function:
    setTimeout(() => {
      // Create updated matched pairs object
      const updatedMatchedPairs = { ...matchedPairs, [draggedItemObj.pairId]: true }

      // Check if all pairs are matched (we have 3 pairs: leaf, hedgehog, nut)
      const totalPairs = 3
      const matchedCount = Object.keys(updatedMatchedPairs).length

      console.log(`Connect game progress: ${matchedCount}/${totalPairs} pairs matched`)
      console.log("Matched pairs:", updatedMatchedPairs)

      if (matchedCount === totalPairs) {
        console.log("🎉 Connect game completed! All 3 pairs matched!")
        setAllMatched(true)
        // Get a random success message only once
        if (!hasSetSuccessMessage) {
          setSuccessMessage(getRandomSuccessMessage())
          setHasSetSuccessMessage(true)
        }
        setFeedbackMessage(null)

        // Record completion when all pairs are matched
        if (isLoggedIn) {
          recordCompletion()
        }

        // Trigger completion callback for medal sequence after 3 seconds
        if (onComplete) {
          setTimeout(() => {
          onComplete()
          }, 3000) // 3 second delay
        }
      }
    }, 100)
  }

  // Reset the game
  const resetGame = () => {
    setLeftItems((prevItems) => prevItems.map((item) => ({ ...item, matched: false })))
    setRightItems((prevItems) => {
      // Maintain the same order when resetting
      return prevItems.map((item) => ({ ...item, matched: false }))
    })
    setAllMatched(false)
    setFeedbackMessage(null)
    setMatchedPairs({})
    setSuccessMessage("")
    setHasSetSuccessMessage(false)
  }

  const themeColors = getThemeColors()
  const useSpringFreeLayout = selectedSeason === "wiosna"
  const springAbsolutePositions = useMemo((): Record<string, React.CSSProperties> => {
    if (activeSpringVariant === 1) {
      return {
        "single-flower": { left: "110px", top: "46px", width: "76px", height: "110px" },
        "single-bee": { left: "140px", top: "148px", width: "92px", height: "70px" },
        "single-butterfly": { left: "76px", top: "214px", width: "124px", height: "94px" },
        "set-of-bees": { left: "608px", top: "50px", width: "110px", height: "84px" },
        "set-of-butterflies": { left: "504px", top: "138px", width: "150px", height: "88px" },
        "set-of-flowers": { left: "650px", top: "222px", width: "94px", height: "96px" },
      }
    }
    if (activeSpringVariant === 2) {
      return {
        "v2-snowdrop-single": { left: "88px", top: "48px", width: "80px", height: "100px" },
        "v2-ant-single": { left: "210px", top: "115px", width: "78px", height: "55px" },
        "v2-radish-single": { left: "100px", top: "185px", width: "72px", height: "92px" },
        "v2-ant-group": { left: "590px", top: "50px", width: "120px", height: "70px" },
        "v2-radish-bunch": { left: "520px", top: "132px", width: "92px", height: "120px" },
        "v2-snowdrop-bouquet": { left: "665px", top: "168px", width: "90px", height: "100px" },
      }
    }
    if (activeSpringVariant === 3) {
      return {
        "v3-bee-single": { left: "132px", top: "58px", width: "72px", height: "62px" },
        "v3-lark-single": { left: "204px", top: "102px", width: "106px", height: "96px" },
        "v3-daffodil-single": { left: "108px", top: "178px", width: "88px", height: "100px" },
        "v3-nest-group": { left: "552px", top: "46px", width: "140px", height: "96px" },
        "v3-daffodil-bouquet": { left: "494px", top: "132px", width: "90px", height: "102px" },
        "v3-bee-group": { left: "634px", top: "170px", width: "116px", height: "95px" },
      }
    }
    return {}
  }, [activeSpringVariant])

  
  

  return (
    <div className="w-full max-w-6xl" style={{ backgroundColor: themeColors.background }}>
      {/* Header with title */}
      <div className="w-full max-w-4xl mx-auto">
        <div className="w-full flex justify-between items-center mb-8">
          <div className="relative w-16 h-16">
            <SoundButtonEnhanced
              text="POŁĄCZ."
              soundIcon={themeColors.soundIcon || "/images/sound_icon_dragon_page.svg"}
              size="xl"
              className="w-full h-full"
            />
          </div>

          <div className="relative h-24 w-80 md:w-[500px] flex items-center justify-center">
            <Image src={getTitleBox()} alt="Title box" fill className="object-contain" />
            <span className="relative z-10 text-white text-2xl md:text-3xl font-sour-gummy font-thin">POŁĄCZ.</span>
          </div>

          <div className="relative w-16 h-16" onClick={onMenuClick}>
            <Image
              src={themeColors.menuIcon || "/placeholder.svg"}
              alt="Menu"
              fill
              className="object-contain cursor-pointer"
            />
          </div>
        </div>
      </div>

      {selectedSeason === "wiosna" && (
        <div className="w-full max-w-4xl mx-auto mb-4 p-3 rounded-lg bg-white/80 border border-[#3e459c]/20 flex items-center gap-3">
          <span className="text-sm font-medium text-[#3e459c]">Wariant (diagnostyka):</span>
          <select
            value={diagnosticSpringVariant}
            onChange={(e) => setDiagnosticSpringVariant(Number(e.target.value) as 0 | SpringConnectVariant)}
            className="px-2 py-1 text-sm border border-[#3e459c]/30 rounded-md bg-white text-[#3e459c]"
          >
            <option value={0}>Auto (losowo)</option>
            <option value={1}>Wariant 1</option>
            <option value={2}>Wariant 2</option>
            <option value={3}>Wariant 3</option>
          </select>
          <span className="text-xs text-gray-600">Aktywny: {activeSpringVariant}</span>
        </div>
      )}

      {/* Game area */}
      <div className="flex justify-center items-center mt-16">
        <div className="flex flex-col items-center w-full">
          {/* Game container */}
          {useSpringFreeLayout ? (
            <div className="w-full max-w-4xl">
              <div className="relative w-full h-[330px]">
                {[...leftItems, ...rightItems].map((item) => {
                  if (item.matched && !item.isLeft) return null
                  const pos = springAbsolutePositions[item.id]
                  if (!pos) return null
                  const pairItem = rightItems.find((right) => right.pairId === item.pairId)

                  if (item.matched && item.isLeft && pairItem) {
                    return (
                      <div key={item.id} className="absolute" style={pos}>
                        <div className="relative w-full h-full flex items-center justify-center gap-2">
                          <div className="relative w-[48%] h-[85%]">
                            <Image
                              src={getImageForSeason(item) || "/placeholder.svg"}
                              alt={`Single ${item.pairId}`}
                              fill
                              className="object-contain"
                              style={{ filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))" }}
                            />
                          </div>
                          <div className="relative w-[48%] h-[85%]">
                            <Image
                              src={getImageForSeason(pairItem) || "/placeholder.svg"}
                              alt={`Set of ${item.pairId}s`}
                              fill
                              className="object-contain"
                              style={{ filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))" }}
                            />
                          </div>
                        </div>
                      </div>
                    )
                  }

                  return (
                    <div
                      key={item.id}
                      className="absolute"
                      style={pos}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, item.id, item.isLeft)}
                    >
                      <div
                        className="relative w-full h-full cursor-grab"
                        draggable
                        onDragStart={() => handleDragStart(item.id, item.isLeft)}
                      >
                        <Image
                          src={getImageForSeason(item) || "/placeholder.svg"}
                          alt={item.pairId}
                          fill
                          className="object-contain"
                          style={{ filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))" }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="flex justify-between w-full max-w-4xl">
              {/* Left column - single items */}
              <div className="flex flex-col gap-4">
                {leftItems.map((item) => (
                  <div key={item.id} className="relative">
                    {item.matched ? (
                      // When matched, display both items side by side
                      <div className="flex items-center gap-4">
                        {/* Left item */}
                        <div className="relative h-20 w-20">
                          <Image
                            src={getImageForSeason(item) || "/placeholder.svg"}
                            alt={`Single ${item.pairId}`}
                            fill
                            className="object-contain"
                            style={{
                              filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))",
                              transform: "scale(0.8)"
                            }}
                          />
                        </div>

                        {/* Right item */}
                        <div className="relative h-20 w-20">
                          <Image
                            src={getImageForSeason(rightItems.find((right) => right.pairId === item.pairId)!) || ""}
                            alt={`Set of ${item.pairId}s`}
                            fill
                            className="object-contain"
                            style={{
                              filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))",
                              transform: "scale(0.8)"
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      // When not matched, display draggable item with extended drop zone
                      <div className="flex items-center">
                        {/* Left drop zone */}
                        <div
                          className="w-12 h-24"
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, item.id, true)}
                        />

                        {/* Main icon */}
                        <div className="p-1">
                          <div
                            className="relative h-20 w-20 cursor-grab"
                            draggable
                            onDragStart={() => handleDragStart(item.id, true)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, item.id, true)}
                          >
                            <Image
                              src={getImageForSeason(item) || "/placeholder.svg"}
                              alt={`Single ${item.pairId}`}
                              fill
                              className="object-contain"
                              style={{
                                filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))",
                                transform: "scale(0.8)"
                              }}
                            />
                          </div>
                        </div>

                        {/* Right drop zone */}
                        <div
                          className="w-12 h-24"
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, item.id, true)}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Right column - sets of items */}
              <div className="flex flex-col gap-4">
                {rightItems.map((item) => (
                  <div key={item.id} className={`relative ${item.matched ? "opacity-0" : ""}`}>
                    {/* Extended drop zone with areas on both sides */}
                    <div className="flex items-center">
                      {/* Left drop zone */}
                      <div
                        className="w-12 h-24"
                        onDragOver={item.matched ? undefined : handleDragOver}
                        onDrop={item.matched ? undefined : (e) => handleDrop(e, item.id, false)}
                      />

                      {/* Main icon */}
                      <div className="p-1">
                        <div
                          className={`relative h-20 w-20 ${item.matched ? "opacity-0" : "cursor-grab"}`}
                          draggable={!item.matched}
                          onDragStart={item.matched ? undefined : () => handleDragStart(item.id, false)}
                          onDragOver={item.matched ? undefined : handleDragOver}
                          onDrop={item.matched ? undefined : (e) => handleDrop(e, item.id, false)}
                        >
                          <Image
                            src={getImageForSeason(item) || "/placeholder.svg"}
                            alt={`Set of ${item.pairId}s`}
                            fill
                            className="object-contain"
                            style={{
                              filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))",
                              transform: "scale(0.8)"
                            }}
                          />
                        </div>
                      </div>

                      {/* Right drop zone */}
                      <div
                        className="w-12 h-24"
                        onDragOver={item.matched ? undefined : handleDragOver}
                        onDrop={item.matched ? undefined : (e) => handleDrop(e, item.id, false)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Feedback message */}
          {feedbackMessage && !allMatched && (
            <div className="mt-8 text-center">
              <div className={`text-xl font-medium ${feedbackMessage === "Brawo" ? "text-[#539e1b]" : "text-red-600"}`}>
                {feedbackMessage}
              </div>
            </div>
          )}

          {/* Success message */}
          {allMatched && successMessage && (
            <SuccessMessage message={successMessage} />
          )}

          {/* New Navigation Buttons */}
          <div className="flex justify-center gap-4 mt-8 w-full">
            {/* All buttons in same container with identical dimensions */}
            <div className="flex gap-4 items-end">
              {/* WRÓĆ Button - always available in connect-game */}
              <div 
                className="relative w-36 h-14 transition-all cursor-pointer hover:scale-105"
                onClick={onBack}
              >
                <Image 
                  src={themeColors.wrocDalejButton || "/images/wroc_dalej_wiosna.svg"} 
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

              {/* Retry button removed */}

              {/* DALEJ Button - disabled when not completed or when completed and waiting for medal */}
              <div 
                className={`relative w-36 h-14 transition-all ${(userLoggedIn && !isGameCompleted && !isHistoricallyCompleted) || allMatched ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-105'}`}
                onClick={(userLoggedIn && !isGameCompleted && !isHistoricallyCompleted) || allMatched ? undefined : onNext}
              >
                <Image 
                  src={themeColors.wrocDalejButton || "/images/wroc_dalej_wiosna.svg"} 
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
      {!isLoggedIn && (
        <div className="mt-4 text-center text-gray-600">
          <p>Zaloguj się, aby zapisać swój postęp!</p>
        </div>
      )}
    </div>
  )
}
