"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useGameCompletionWithHistory } from "@/hooks/use-game-completion"
import { getRandomSuccessMessage } from "@/lib/success-messages"
import { useSeason } from "@/contexts/season-context"
import SuccessMessage from "./success-message"
import SoundButtonEnhanced from "./sound-button-enhanced"

interface FindFlippedRabbitGameProps {
  onMenuClick: () => void
  onBack?: () => void
  onNext?: () => void
  onRetry?: () => void
  userLoggedIn?: boolean
  currentSeason?: string
  isGameCompleted?: boolean
}

export default function FindFlippedRabbitGame({ onMenuClick, onBack, onNext, onRetry, userLoggedIn = false, currentSeason = "wiosna", isGameCompleted = false }: FindFlippedRabbitGameProps) {
  const [flippedRabbitIndex, setFlippedRabbitIndex] = useState<number>(0)
  const [selectedRabbit, setSelectedRabbit] = useState<number | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Use the game completion hook
  const { recordCompletion, isLoggedIn, isHistoricallyCompleted } = useGameCompletionWithHistory("find-flipped-rabbit-game")

  const { selectedSeason, getThemeColors } = useSeason()
  const theme = getThemeColors()
  const { background: themeBackgroundColor } = theme

  // Determine season-specific settings
  const isAutumn = selectedSeason === "jesien"
  const isWinter = selectedSeason === "zima"
  const isSummer = selectedSeason === "lato"

  // Get theme-specific assets
  const soundIcon = isWinter
    ? "/images/sound_winter.svg"
    : isAutumn
      ? "/images/sound_autumn.svg"
      : isSummer
        ? "/images/sound_summer.svg"
      : "/images/sound_new.svg"
  const menuIcon = isWinter 
    ? "/images/menu_winter.svg" 
    : isAutumn 
      ? "/images/menu_autumn.svg" 
      : isSummer
        ? "/images/menu_summer.svg"
        : "/images/menu_new.svg"
  const titleBox = isWinter
    ? "/images/title_box_small_winter.svg"
    : isAutumn
      ? "/images/title_box_small_autumn.svg"
      : isSummer
        ? "/images/title_box_small_summer.svg"
      : "/images/title_box_small.png"
  const gameIcon = isWinter
    ? "/images/snowman_winter.svg"
    : isAutumn
      ? "/images/squirrel_autumn.svg"
      : isSummer
        ? "/images/banana_summer.svg"
      : "/images/rabbit.svg"

  // Get season-specific title text
  const getTitleText = () => {
    return "KTÓRY ZAJĄC SIĘ RÓŻNI?"
  }

  // Initialize game with random flipped rabbit
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * 27) // 27 total rabbits (3 rows × 9 rabbits)
    setFlippedRabbitIndex(randomIndex)
  }, [])

  // Reset game when season changes
  useEffect(() => {
    resetGame()
  }, [selectedSeason])

  const handleRabbitClick = async (index: number) => {
    if (isCompleted) return

    setSelectedRabbit(index)

    if (index === flippedRabbitIndex) {
      // Correct selection
      setIsCompleted(true)
      setSuccessMessage(getRandomSuccessMessage())

      // Record the game completion
      await recordCompletion()
    } else {
      // Wrong selection - just reset selection after brief delay, no visual feedback
      setTimeout(() => {
        setSelectedRabbit(null)
      }, 300)
    }
  }

  const resetGame = () => {
    const randomIndex = Math.floor(Math.random() * 27)
    setFlippedRabbitIndex(randomIndex)
    setSelectedRabbit(null)
    setIsCompleted(false)
    setSuccessMessage(null)
  }

  const renderRabbit = (index: number) => {
    const isFlipped = index === flippedRabbitIndex
    const isCorrect = isCompleted && index === flippedRabbitIndex

    return (
      <div
        key={index}
        className={`relative cursor-pointer transition-all duration-200 ${!isCompleted ? "hover:scale-105" : ""} flex items-center justify-center`}
        onClick={() => handleRabbitClick(index)}
      >
        <div className="relative flex items-center justify-center">
          <Image
            src={gameIcon || "/placeholder.svg"}
            alt={isWinter ? "Snowman" : isAutumn ? "Squirrel" : isSummer ? "Rabbit" : "Rabbit"}
            width={96}
            height={96}
            className={`${isFlipped ? "scale-x-[-1]" : ""} transition-transform duration-200`}
            style={{
              filter: isCorrect
                ? "drop-shadow(0 4px 8px rgba(34, 197, 94, 0.6)) drop-shadow(0 2px 4px rgba(34, 197, 94, 0.8))"
                : undefined,
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto" style={{ backgroundColor: themeBackgroundColor }}>
      {/* Header with title */}
      <div className="w-full flex justify-between items-center mb-8">
        <div className="relative w-16 h-16">
          <SoundButtonEnhanced
            text="KTÓRY ZAJĄC SIĘ RÓŻNI?"
            soundIcon={soundIcon || "/images/sound_icon_dragon_page.svg"}
            size="xl"
            className="w-full h-full"
          />
        </div>

        <div className="relative h-24 w-80 md:w-[500px] flex items-center justify-center">
          <Image src={titleBox || "/placeholder.svg"} alt="Title box" fill className="object-contain" />
          <span
            className={`relative z-10 text-white font-sour-gummy font-thin ${isWinter ? "text-lg md:text-xl" : "text-2xl md:text-3xl"}`}
          >
            {getTitleText()}
          </span>
        </div>

        <div className="relative w-16 h-16" onClick={onMenuClick}>
          <Image src={menuIcon || "/placeholder.svg"} alt="Menu" fill className="object-contain cursor-pointer" />
        </div>
      </div>

      {/* Game area */}
      <div className="flex flex-col items-center mt-16">
        {/* Rabbit grid - 3 rows of 9 rabbits */}
        <div className="grid grid-cols-9 gap-2 mb-8">
          {Array.from({ length: 27 }, (_, index) => renderRabbit(index))}
        </div>

        {/* Success message */}
        {successMessage && <SuccessMessage message={successMessage} />}
      </div>

      {/* New Navigation Buttons - Always visible */}
      <div className="flex justify-center gap-4 mt-8 w-full">
        {/* All buttons in same container with identical dimensions */}
        <div className="flex gap-4 items-end">
          {/* WRÓĆ Button - always available in find-flipped-rabbit-game */}
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
    </div>
  )
}
