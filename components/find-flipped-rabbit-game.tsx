"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useGameCompletion } from "@/hooks/use-game-completion"
import { getRandomSuccessMessage } from "@/lib/success-messages"
import { useSeason } from "@/contexts/season-context"

interface FindFlippedRabbitGameProps {
  onMenuClick: () => void
}

export default function FindFlippedRabbitGame({ onMenuClick }: FindFlippedRabbitGameProps) {
  const [flippedRabbitIndex, setFlippedRabbitIndex] = useState<number>(0)
  const [selectedRabbit, setSelectedRabbit] = useState<number | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Use the game completion hook
  const { recordCompletion } = useGameCompletion()

  const { selectedSeason, getThemeColors } = useSeason()
  const { background: themeBackgroundColor } = getThemeColors()

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
      await recordCompletion("find-flipped-rabbit-game")
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
          <Image src={soundIcon || "/placeholder.svg"} alt="Sound" fill className="object-contain cursor-pointer" />
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
        {successMessage && (
          <div className="mt-8 bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg text-center">
            <div className="text-2xl font-bold mb-2">🎉 {successMessage} 🎉</div>
          </div>
        )}

        {/* Reset button - only visible when game is completed */}
        {isCompleted && (
          <div className="flex justify-center mt-8">
            <button
              onClick={resetGame}
              className="bg-[#539e1b] text-white px-8 py-3 rounded-full font-bold text-xl shadow-lg hover:bg-[#468619] transition-colors"
            >
              Spróbuj ponownie
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
