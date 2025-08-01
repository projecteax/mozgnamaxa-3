"use client"

import { useState } from "react"
import Image from "next/image"
import { useGameCompletionWithHistory } from "@/hooks/use-game-completion"
import { getRandomSuccessMessage } from "@/lib/success-messages"
import { useSeason } from "@/contexts/season-context"
import SoundButtonEnhanced from "./sound-button-enhanced"
import SuccessMessage from "./success-message"

interface OddOneOutGameProps {
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
  summerImage: string
  autumnImage: string
  winterImage: string
  isCorrect: boolean
  category: string
  position: string
  size: string
}

export default function OddOneOutGame({ onMenuClick, onBack, onNext, onRetry, userLoggedIn = false, currentSeason = "wiosna", isGameCompleted = false }: OddOneOutGameProps) {
  const { selectedSeason, getThemeColors } = useSeason()
  const theme = getThemeColors()

  // Define the game items with their positions matching the Figma design but centralized
  const gameItems: GameItem[] = [
    {
      id: "bee",
      image: "/images/bee_new.svg",
      summerImage: "/images/cayaker_summer.svg",
      autumnImage: "/images/chestnut_semiclosed_autumn.svg",
      winterImage: "/images/suit_winter.svg",
      isCorrect: false,
      category: "animal",
      position: "top-0 left-[25%] transform -translate-x-1/2",
      size: "h-36 w-36",
    },
    {
      id: "stork",
      image: "/images/stork.svg",
      summerImage: "/images/biker_summer.svg",
      autumnImage: "/images/husselnut_autumn.svg",
      winterImage: "/images/jacket_winter.svg",
      isCorrect: false,
      category: "animal",
      position: "top-[150px] left-[50%] transform -translate-x-1/2",
      size: "h-56 w-56",
    },
    {
      id: "butterfly",
      image: "/images/butterfly_orange_new.svg",
      summerImage: "/images/swimmer_summer.svg",
      autumnImage: "/images/zoladz_autumn.svg",
      winterImage: "/images/hat_winter.svg",
      isCorrect: false,
      category: "animal",
      position: "top-[300px] left-[25%] transform -translate-x-1/2",
      size: "h-36 w-36",
    },
    {
      id: "ladybug",
      image: "/images/ladybug.svg",
      summerImage: "/images/runner_summer.svg",
      autumnImage: "/images/jarzebina_autumn.svg",
      winterImage: "/images/boots_winter.svg",
      isCorrect: false,
      category: "animal",
      position: "top-0 left-[75%] transform -translate-x-1/2",
      size: "h-36 w-36",
    },
    {
      id: "flower",
      image: "/images/flower_white.svg",
      summerImage: "/images/skier_summer.svg",
      autumnImage: "/images/strawberry_autumn.svg",
      winterImage: "/images/sanki_winter.svg",
      isCorrect: true,
      category: "plant",
      position: "top-[300px] left-[75%] transform -translate-x-1/2",
      size: "h-36 w-36",
    },
  ]

  // State for tracking if the correct item has been selected
  const [selectedItem, setSelectedItem] = useState<string | null>(null)

  // State for success message
  const [successMessage, setSuccessMessage] = useState<string>("")

  // State for tracking if the game is completed
  const [isCompleted, setIsCompleted] = useState(false)

  // Use the game completion hook
  const { recordCompletion, isLoggedIn, isHistoricallyCompleted } = useGameCompletionWithHistory("odd-one-out-game")

  // Handle item click
  const handleItemClick = (id: string, isCorrect: boolean) => {
    if (isCompleted) return

    setSelectedItem(id)

    if (isCorrect) {
      setIsCompleted(true)
      setSuccessMessage(getRandomSuccessMessage())

      // Record completion when game is finished
      if (isLoggedIn) {
        recordCompletion()
      }
    }
  }

  // Reset the game
  const resetGame = () => {
    setSelectedItem(null)
    setIsCompleted(false)
    setSuccessMessage("")
  }

  // Get the appropriate image based on season
  const getImageForSeason = (item: GameItem) => {
    switch (selectedSeason) {
      case "lato":
        return item.summerImage
      case "jesien":
        return item.autumnImage
      case "zima":
        return item.winterImage
      default:
        return item.image
    }
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

  


  return (
    <div className="w-full" style={{ backgroundColor: theme.background }}>
      {/* Header with title */}
      <div className="w-full max-w-4xl mx-auto flex justify-between items-center mb-8">
        <div className="relative w-16 h-16">
          <SoundButtonEnhanced
            text="WYBIERZ, CO NIE PASUJE."
            soundIcon={theme.soundIcon || "/images/sound_icon_dragon_page.svg"}
            size="xl"
            className="w-full h-full"
          />
        </div>

        <div className="relative h-24 w-80 md:w-[500px] flex items-center justify-center">
          <Image src={getTitleBox() || "/placeholder.svg"} alt="Title box" fill className="object-contain" />
          <span className="relative z-10 text-white text-2xl md:text-3xl font-sour-gummy font-thin">
            WYBIERZ, CO NIE PASUJE.
          </span>
        </div>

        <div className="relative w-16 h-16" onClick={onMenuClick}>
          <Image src={theme.menuIcon || "/placeholder.svg"} alt="Menu" fill className="object-contain cursor-pointer" />
        </div>
      </div>

      {/* Game area */}
      <div className="flex justify-center items-center mt-8">
        <div className="flex flex-col items-center w-full">
          {/* Game items - positioned to be centralized */}
          <div className="relative w-full max-w-4xl mx-auto h-[450px]">
            {gameItems.map((item) => (
              <div
                key={item.id}
                className={`absolute ${item.position} cursor-pointer`}
                onClick={() => handleItemClick(item.id, item.isCorrect)}
              >
                <div className={`relative ${item.size}`}>
                  <Image
                    src={getImageForSeason(item) || "/placeholder.svg"}
                    alt={item.id}
                    fill
                    className="object-contain"
                    style={{
                      filter: isCompleted && item.isCorrect ? "drop-shadow(0 0 8px #539e1b)" : "none",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Success message */}
          {isCompleted && successMessage && (
            <SuccessMessage message={successMessage} />
          )}

          {/* New Navigation Buttons */}
          <div className="flex justify-center gap-4 mt-8 w-full">
            {/* All buttons in same container with identical dimensions */}
            <div className="flex gap-4 items-end">
              {/* WRÓĆ Button - always available in odd-one-out-game */}
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
                className={`relative w-52 h-14 transition-all ${isCompleted ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed opacity-50'}`}
                onClick={isCompleted ? resetGame : undefined}
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

          {/* Login reminder for non-logged in users */}
          {!isLoggedIn && (
            <div className="text-center text-gray-600">
              <p>Zaloguj się, aby zapisać swój postęp!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
