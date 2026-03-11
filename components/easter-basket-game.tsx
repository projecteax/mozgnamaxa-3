"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useGameCompletionWithHistory } from "@/hooks/use-game-completion"
import { getRandomSuccessMessage } from "@/lib/success-messages"
import { useSeason } from "@/contexts/season-context"
import SuccessMessage from "./success-message"
import SoundButtonEnhanced from "./sound-button-enhanced"

interface EasterBasketGameProps {
  onMenuClick: () => void
  onBack?: () => void
  onNext?: () => void
  onRetry?: () => void
  userLoggedIn?: boolean
  currentSeason?: string
  isGameCompleted?: boolean
}

interface GameItem {
  id: string
  image: string
  summerImage?: string
  autumnImage?: string
  winterImage?: string
  isCorrect: boolean
  category: string
  position: string
  size: string
}

type SpringEasterBasketVariant = 1 | 2 | 3

export default function EasterBasketGame({ onMenuClick, onBack, onNext, onRetry, userLoggedIn = false, currentSeason = "wiosna", isGameCompleted = false }: EasterBasketGameProps) {
  const { recordCompletion, isLoggedIn, isHistoricallyCompleted } = useGameCompletionWithHistory("easter-basket-game")
  const { selectedSeason, getThemeColors } = useSeason()
  const theme = getThemeColors()
  const [diagnosticSpringVariant, setDiagnosticSpringVariant] = useState<0 | SpringEasterBasketVariant>(0)
  const [randomSpringVariant] = useState<SpringEasterBasketVariant>(() => (Math.floor(Math.random() * 3) + 1) as SpringEasterBasketVariant)
  const activeSpringVariant = diagnosticSpringVariant === 0 ? randomSpringVariant : diagnosticSpringVariant

  // Define the game items with their positions moved higher up to align with the red line
  const baseGameItems: GameItem[] = [
    {
      id: "branch",
      image: "/images/branch_new.svg",
      summerImage: "/images/cucamber_summer.svg",
      autumnImage: "/images/hedgehog_autumn.svg",
      winterImage: "/images/decor_winter.svg",
      isCorrect: false,
      category: "easter",
      position: "top-[60px] left-[20%] transform -translate-x-1/2",
      size: "h-24 w-24",
    },
    {
      id: "lamb",
      image: "/images/lamb_new.svg",
      summerImage: "/images/strawberries_summer.svg",
      autumnImage: "/images/owl_autumn.svg",
      winterImage: "/images/mask_01_winter.svg",
      isCorrect: false,
      category: "easter",
      position: "top-[200px] left-[25%] transform -translate-x-1/2",
      size: "h-24 w-24",
    },
    {
      id: "egg",
      image: "/images/colored_egg_light_blue_new.svg",
      summerImage: "/images/banana_summer.svg",
      autumnImage: "/images/zebra_autumn.svg",
      winterImage: "/images/bike_winter.svg",
      isCorrect: false, // Correct for autumn/winter, but not spring/summer
      category: "non-easter",
      position: "top-[60px] left-[50%] transform -translate-x-1/2",
      size: "h-24 w-24",
    },
    {
      id: "cake",
      image: "/images/cake_new.svg",
      summerImage: "/images/watermelons_02_summer.svg",
      autumnImage: "/images/boar_autumn.svg",
      winterImage: "/images/baloon_winter.svg",
      isCorrect: false,
      category: "easter",
      position: "top-[60px] left-[80%] transform -translate-x-1/2",
      size: "h-24 w-24",
    },
    {
      id: "banana",
      image: "/images/banana_new.svg",
      summerImage: "/images/toothbrush_summer.svg",
      autumnImage: "/images/fox_autumn.svg",
      winterImage: "/images/party_hat_winter.svg",
      isCorrect: true, // Correct for spring/summer, but not for autumn/winter
      category: "non-easter",
      position: "top-[200px] left-[50%] transform -translate-x-1/2",
      size: "h-24 w-24",
    },
    {
      id: "sausage",
      image: "/images/sausage_new.svg",
      summerImage: "/images/cup_summer.svg",
      autumnImage: "/images/squirel_autumn.svg",
      winterImage: "/images/sparks_winter.svg",
      isCorrect: false,
      category: "easter",
      position: "top-[200px] left-[75%] transform -translate-x-1/2",
      size: "h-24 w-24",
    },
  ]

  const springVariant2Items: GameItem[] = [
    {
      id: "beach-ball",
      image: "/images/easter_v2_pilka.svg",
      isCorrect: true,
      category: "non-easter",
      position: "top-[60px] left-[20%] transform -translate-x-1/2",
      size: "h-24 w-24",
    },
    {
      id: "babka",
      image: "/images/easter_v2_babka.svg",
      isCorrect: false,
      category: "easter",
      position: "top-[60px] left-[50%] transform -translate-x-1/2",
      size: "h-24 w-24",
    },
    {
      id: "lamb-v2",
      image: "/images/easter_v2_baranek.svg",
      isCorrect: false,
      category: "easter",
      position: "top-[60px] left-[80%] transform -translate-x-1/2",
      size: "h-24 w-24",
    },
    {
      id: "mazurek",
      image: "/images/easter_v2_mazurek.svg",
      isCorrect: false,
      category: "easter",
      position: "top-[200px] left-[25%] transform -translate-x-1/2",
      size: "h-24 w-24",
    },
    {
      id: "egg-v2",
      image: "/images/easter_v2_pisanka_07.svg",
      isCorrect: false,
      category: "easter",
      position: "top-[200px] left-[50%] transform -translate-x-1/2",
      size: "h-24 w-24",
    },
    {
      id: "bazie",
      image: "/images/easter_v2_bazie.svg",
      isCorrect: false,
      category: "easter",
      position: "top-[200px] left-[75%] transform -translate-x-1/2",
      size: "h-24 w-24",
    },
  ]

  const springVariant3Items: GameItem[] = [
    {
      id: "sausage-v3",
      image: "/images/easter_v3_kielbasa.svg",
      isCorrect: false,
      category: "non-easter",
      position: "top-[60px] left-[20%] transform -translate-x-1/2",
      size: "h-24 w-24",
    },
    {
      id: "rabbit-v3",
      image: "/images/easter_v3_krolik.svg",
      isCorrect: false,
      category: "easter",
      position: "top-[60px] left-[50%] transform -translate-x-1/2",
      size: "h-24 w-24",
    },
    {
      id: "palm-v3",
      image: "/images/easter_v3_palemka.svg",
      isCorrect: false,
      category: "easter",
      position: "top-[60px] left-[80%] transform -translate-x-1/2",
      size: "h-24 w-24",
    },
    {
      id: "rose-v3",
      image: "/images/easter_v3_roza.svg",
      isCorrect: true,
      category: "easter",
      position: "top-[200px] left-[25%] transform -translate-x-1/2",
      size: "h-24 w-24",
    },
    {
      id: "egg-v3",
      image: "/images/easter_v3_pisanka_08.svg",
      isCorrect: false,
      category: "easter",
      position: "top-[200px] left-[50%] transform -translate-x-1/2",
      size: "h-24 w-24",
    },
    {
      id: "napkin-v3",
      image: "/images/easter_v3_serwetka.svg",
      isCorrect: false,
      category: "easter",
      position: "top-[200px] left-[75%] transform -translate-x-1/2",
      size: "h-24 w-24",
    },
  ]

  const gameItems: GameItem[] =
    selectedSeason === "wiosna"
      ? activeSpringVariant === 2
        ? springVariant2Items
        : activeSpringVariant === 3
          ? springVariant3Items
          : baseGameItems
      : baseGameItems

  // State for tracking if the correct item has been selected
  const [selectedItem, setSelectedItem] = useState<string | null>(null)

  // State for tracking if the game is completed
  const [isCompleted, setIsCompleted] = useState(false)

  // State for tracking if completion has been recorded
  const [hasRecordedCompletion, setHasRecordedCompletion] = useState(false)

  // State for success message
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Get the appropriate title text based on season
  const getTitleText = () => {
    if (selectedSeason === "lato") {
      return "WYBIERZ, CO NIE PASUJE DO KOSZYCZKA PIKNIKOWEGO."
    } else if (selectedSeason === "jesien") {
      return "KOGO NIE SPOTKAMY W LESIE?"
    } else if (selectedSeason === "zima") {
      return "CZEGO NIE ZOBACZYMY NA BALU KARNAWAŁOWYM"
    } else {
      return "WYBIERZ, CO NIE PASUJE DO KOSZYCZKA WIELKANOCNEGO."
    }
  }

  const isCorrectItemForCurrentSeason = (id: string) => {
    if (selectedSeason === "wiosna") {
      if (activeSpringVariant === 2) return id === "beach-ball"
      if (activeSpringVariant === 3) return id === "rose-v3"
      return id === "banana"
    }
    if (selectedSeason === "lato") return id === "banana"
    if (selectedSeason === "jesien") return id === "egg"
    if (selectedSeason === "zima") return id === "egg"
    return false
  }

  // Handle item click
  const handleItemClick = (id: string, isCorrect: boolean) => {
    if (isCompleted) return

    setSelectedItem(id)
    const isCorrectForSeason = isCorrectItemForCurrentSeason(id) || isCorrect

    if (isCorrectForSeason) {
      setIsCompleted(true)
      setSuccessMessage(getRandomSuccessMessage())

      // Record completion for logged-in users
      if (!hasRecordedCompletion) {
        recordCompletion()
          .then(() => {
            console.log("Easter basket game completion recorded successfully")
            setHasRecordedCompletion(true)
          })
          .catch((error) => {
            console.error("Failed to record easter basket game completion:", error)
          })
      }
    }
    // Removed the error message - no feedback for incorrect clicks
  }

  // Reset the game
  const resetGame = () => {
    setSelectedItem(null)
    setIsCompleted(false)
    setHasRecordedCompletion(false)
    setSuccessMessage(null)
  }

  // Get the appropriate image based on season
  const getItemImage = (item: GameItem) => {
    if (selectedSeason === "lato") {
      return item.summerImage || item.image
    } else if (selectedSeason === "jesien") {
      return item.autumnImage || item.image
    } else if (selectedSeason === "zima") {
      return item.winterImage || item.image
    } else {
      return item.image
    }
  }

  useEffect(() => {
    setSelectedItem(null)
    setIsCompleted(false)
    setHasRecordedCompletion(false)
    setSuccessMessage(null)
  }, [selectedSeason, activeSpringVariant])

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

  return (
    <div className="w-full max-w-4xl">
      {/* Header with title - enlarged title box by 120% and updated font */}
      <div className="w-full flex justify-between items-center mb-8">
        <div className="relative w-16 h-16">
          <SoundButtonEnhanced
            text={getTitleText()}
            soundIcon={theme.soundIcon || "/images/sound_icon_dragon_page.svg"}
            size="xl"
            className="w-full h-full"
          />
        </div>

        <div className="relative h-[115px] w-[384px] md:w-[600px] flex items-center justify-center">
          <Image src={getTitleBox()} alt="Title box" fill className="object-contain" />
          <span className="relative z-10 text-white text-center text-xl md:text-2xl font-sour-gummy font-thin px-4">
            {getTitleText()}
          </span>
        </div>

        <div className="relative w-16 h-16" onClick={onMenuClick}>
          <Image src={theme.menuIcon || "/placeholder.svg"} alt="Menu" fill className="object-contain cursor-pointer" />
        </div>
      </div>

      {selectedSeason === "wiosna" && (
        <div className="w-full max-w-4xl mx-auto mb-4 p-3 rounded-lg bg-white/80 border border-[#3e459c]/20 flex items-center gap-3">
          <span className="text-sm font-medium text-[#3e459c]">Wariant (diagnostyka):</span>
          <select
            value={diagnosticSpringVariant}
            onChange={(e) => setDiagnosticSpringVariant(Number(e.target.value) as 0 | SpringEasterBasketVariant)}
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
      <div className="flex justify-center items-center">
        <div className="flex flex-col items-center w-full">
          {/* Game items - positioned higher up to align with the red line and reduced in size */}
          <div
            className="relative w-full h-[350px] rounded-lg"
            style={{ backgroundColor: theme.background || "transparent" }}
          >
            {gameItems.map((item) => {
              const isCorrectForCurrentSeason = isCorrectItemForCurrentSeason(item.id)

              return (
                <div
                  key={item.id}
                  className={`absolute ${item.position} cursor-pointer transition-all duration-300 ${
                    selectedItem === item.id && !isCorrectForCurrentSeason ? "opacity-50" : ""
                  } ${isCompleted && isCorrectForCurrentSeason ? "scale-110" : ""}`}
                  onClick={() => handleItemClick(item.id, item.isCorrect)}
                >
                  <div className={`relative ${item.size}`}>
                    <Image
                      src={getItemImage(item) || "/placeholder.svg"}
                      alt={item.id}
                      fill
                      className="object-contain drop-shadow-lg"
                      style={{
                        filter:
                          isCompleted && isCorrectForCurrentSeason
                            ? "drop-shadow(0 0 8px #539e1b)"
                            : "drop-shadow(2px 2px 4px rgba(0,0,0,0.3))",
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Success message - only shown when game is completed */}
          {successMessage && <SuccessMessage message={successMessage} />}

          {/* New Navigation Buttons */}
          <div className="flex justify-center gap-4 mt-8 w-full">
            {/* All buttons in same container with identical dimensions */}
            <div className="flex gap-4 items-end">
              {/* WRÓĆ Button - always available in easter-basket-game */}
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

              {/* Retry button removed */}

              {/* DALEJ Button - only unlocked when game completed (for logged users) or always available (for non-logged users) */}
              <div 
                className={`relative w-36 h-14 transition-all ${(userLoggedIn && !isGameCompleted && !isHistoricallyCompleted) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-105'}`}
                onClick={(userLoggedIn && !isGameCompleted && !isHistoricallyCompleted) ? undefined : onNext}
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
    </div>
  )
}
