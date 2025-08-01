"use client"

import { useState } from "react"
import Image from "next/image"
import { useGameCompletionWithHistory } from "@/hooks/use-game-completion"
import { getRandomSuccessMessage } from "@/lib/success-messages"
import { useSeason } from "@/contexts/season-context"
import SuccessMessage from "./success-message"
import SoundButtonEnhanced from "./sound-button-enhanced"

interface FindMissingGameProps {
  onMenuClick: () => void
  onBack?: () => void
  onNext?: () => void
  onRetry?: () => void
  userLoggedIn?: boolean
  currentSeason?: string
  isGameCompleted?: boolean
}

interface OptionItem {
  id: string
  name: string
  image: string
  isCorrect: boolean
}

export default function FindMissingGame({ onMenuClick, onBack, onNext, onRetry, userLoggedIn = false, currentSeason = "wiosna", isGameCompleted = false }: FindMissingGameProps) {
  // Use the season context
  const { selectedSeason, getThemeColors } = useSeason()
  const theme = getThemeColors()

  // Use the game completion hook
  const { recordCompletion, isLoggedIn, isHistoricallyCompleted } = useGameCompletionWithHistory("find-missing-game")

  // Define the options based on season
  const getOptions = (): OptionItem[] => {
    if (selectedSeason === "zima") {
      return [
        { id: "slaigh", name: "Slaigh", image: "/images/slaigh_winter.svg", isCorrect: false },
        { id: "snawball", name: "Snowball", image: "/images/snawball_winter.svg", isCorrect: false },
        { id: "snowflake", name: "Snowflake", image: "/images/snowflake_winter.svg", isCorrect: false },
        { id: "pinguin", name: "Pinguin", image: "/images/pinguin_winter.svg", isCorrect: true }, // This is the correct answer
        { id: "fox", name: "Fox", image: "/images/fox_winter.svg", isCorrect: false },
      ]
    } else if (selectedSeason === "jesien") {
      return [
        { id: "mushroom", name: "Red Mushroom", image: "/images/mushroom_red_autumn.svg", isCorrect: false },
        { id: "fox", name: "Fox", image: "/images/fox_autumn.svg", isCorrect: false },
        { id: "apple", name: "Apple", image: "/images/apple_autumn.svg", isCorrect: false },
        { id: "chestnut_leaf", name: "Chestnut Leaf", image: "/images/chestnut_leaf_autumn.svg", isCorrect: true }, // This is the correct answer
        { id: "yellow_leaf", name: "Yellow Leaf", image: "/images/yellow_leaf_autumn.svg", isCorrect: false },
      ]
    } else if (selectedSeason === "lato") {
      return [
        { id: "shell", name: "Shell", image: "/images/shell_02_summer.svg", isCorrect: false },
        { id: "duck", name: "Duck", image: "/images/duck_02_summer.svg", isCorrect: false },
        { id: "tomato", name: "Tomato", image: "/images/tomato_summer.svg", isCorrect: false },
        { id: "ball", name: "Pink Ball", image: "/images/pink_ball_summer.svg", isCorrect: true }, // This is the correct answer
        { id: "wheel", name: "Rescue Wheel", image: "/images/rescue_wheel_summer.svg", isCorrect: false },
      ]
    } else {
      return [
        { id: "flower", name: "Orange Flower", image: "/images/flower_orange.svg", isCorrect: false },
        { id: "frog", name: "Frog", image: "/images/frog2.svg", isCorrect: false },
        { id: "stork", name: "Stork", image: "/images/stork.svg", isCorrect: false },
        { id: "snail", name: "Snail", image: "/images/snail.svg", isCorrect: true }, // This is the correct answer
        { id: "bee", name: "Bee", image: "/images/bee_top_view.svg", isCorrect: false },
      ]
    }
  }

  const options = getOptions()

  // State for tracking the selected option
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  // State for feedback message
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)

  // State for tracking if the game is completed
  const [isCompleted, setIsCompleted] = useState(false)

  // Success message state
  const [successMessage, setSuccessMessage] = useState<string>("")

  // Handle option click
  const handleOptionClick = (id: string, isCorrect: boolean) => {
    // If game is already completed, do nothing
    if (isCompleted) return

    setSelectedOption(id)

    if (isCorrect) {
      setFeedbackMessage("Brawo! Znalazłeś brakujący element!")
      setSuccessMessage(getRandomSuccessMessage())
      setIsCompleted(true)

      // Record completion in database
      if (isLoggedIn) {
        recordCompletion()
      }
    } else {
      setFeedbackMessage("Przykro mi ale ten obiekt znajduje się na obrazku")
    }
  }

  // Reset the game
  const resetGame = () => {
    setSelectedOption(null)
    setFeedbackMessage(null)
    setIsCompleted(false)
    setSuccessMessage("")
  }

  // Get main image based on season
  const getMainImage = () => {
    if (selectedSeason === "zima") {
      return "/images/find_missing_image.svg"
    } else if (selectedSeason === "jesien") {
      return "/images/find_whats_missing_autumn.svg"
    } else if (selectedSeason === "lato") {
      return "/images/missing_summer.svg"
    } else {
      return "/images/find_whats_missing.svg"
    }
  }

  // Get title box based on season
  const getTitleBox = () => {
    if (selectedSeason === "zima") {
      return "/images/title_box_small_winter.svg"
    } else if (selectedSeason === "jesien") {
      return "/images/title_box_small_autumn.svg"
    } else if (selectedSeason === "lato") {
      return "/images/title_box_small_summer.svg"
    } else {
      return "/images/green_large_box.svg"
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4" style={{ backgroundColor: theme.background }}>
      {/* Header with title */}
      <div className="w-full flex justify-between items-center mb-8">
        <div className="relative w-16 h-16">
          <SoundButtonEnhanced
            text="ZAZNACZ TO, CZEGO BRAKUJE NA OBRAZKU."
            soundIcon={theme.soundIcon || "/images/sound_icon_dragon_page.svg"}
            size="xl"
            className="w-full h-full"
          />
        </div>

        <div className="relative h-24 w-80 md:w-[500px] flex items-center justify-center">
          <Image src={getTitleBox() || "/placeholder.svg"} alt="Title box" fill className="object-contain" />
          <span className="relative z-10 text-white text-lg md:text-xl font-sour-gummy font-thin text-center">
            ZAZNACZ TO, CZEGO BRAKUJE NA OBRAZKU.
          </span>
        </div>

        <div className="relative w-16 h-16" onClick={onMenuClick}>
          <Image src={theme.menuIcon || "/placeholder.svg"} alt="Menu" fill className="object-contain cursor-pointer" />
        </div>
      </div>

      {/* Game area - following Figma design */}
      <div className="w-full flex gap-8 justify-center items-start">
        {/* Main image - div size matches picture size */}
        <div className="flex-shrink-0">
          <div className="relative w-[900px] h-[450px]">
            <Image
              src={getMainImage() || "/placeholder.svg"}
              alt="Find what's missing"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Options layout - takes up 1/4 of the space */}
        <div className="flex-shrink-0 w-[200px] h-[450px] flex flex-col justify-between">
          {/* First row: First two options */}
          <div className="flex gap-4 justify-center">
            <div
              className={`relative h-20 w-20 cursor-pointer transition-all duration-300 hover:scale-105 ${
                selectedOption === options[0].id ? (options[0].isCorrect ? "scale-105 drop-shadow-lg" : "") : ""
              }`}
              onClick={() => handleOptionClick(options[0].id, options[0].isCorrect)}
            >
              <Image
                src={options[0].image || "/placeholder.svg"}
                alt={options[0].name}
                fill
                className="object-contain"
              />
            </div>

            <div
              className={`relative h-20 w-20 cursor-pointer transition-all duration-300 hover:scale-105 ${
                selectedOption === options[1].id ? (options[1].isCorrect ? "scale-105 drop-shadow-lg" : "") : ""
              }`}
              onClick={() => handleOptionClick(options[1].id, options[1].isCorrect)}
            >
              <Image
                src={options[1].image || "/placeholder.svg"}
                alt={options[1].name}
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Second row: Third option (130% larger, centered) */}
          <div className="flex justify-center">
            <div
              className={`relative h-30 w-30 cursor-pointer transition-all duration-300 hover:scale-105 ${
                selectedOption === options[2].id ? (options[2].isCorrect ? "scale-105 drop-shadow-lg" : "") : ""
              }`}
              style={{ height: "120px", width: "120px" }}
              onClick={() => handleOptionClick(options[2].id, options[2].isCorrect)}
            >
              <Image
                src={options[2].image || "/placeholder.svg"}
                alt={options[2].name}
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Third row: Last two options */}
          <div className="flex gap-4 justify-center">
            <div
              className={`relative h-20 w-20 cursor-pointer transition-all duration-300 hover:scale-105 ${
                selectedOption === options[3].id ? (options[3].isCorrect ? "scale-105 drop-shadow-lg" : "") : ""
              }`}
              onClick={() => handleOptionClick(options[3].id, options[3].isCorrect)}
            >
              <Image
                src={options[3].image || "/placeholder.svg"}
                alt={options[3].name}
                fill
                className="object-contain"
              />
            </div>

            <div
              className={`relative h-20 w-20 cursor-pointer transition-all duration-300 hover:scale-105 ${
                selectedOption === options[4].id ? (options[4].isCorrect ? "scale-105 drop-shadow-lg" : "") : ""
              }`}
              onClick={() => handleOptionClick(options[4].id, options[4].isCorrect)}
            >
              <Image
                src={options[4].image || "/placeholder.svg"}
                alt={options[4].name}
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Success message */}
      {isCompleted && <SuccessMessage message={successMessage} />}

      {/* New Navigation Buttons */}
      <div className="flex justify-center gap-4 mt-8 w-full">
        {/* All buttons in same container with identical dimensions */}
        <div className="flex gap-4 items-end">
          {/* WRÓĆ Button - always available in find-missing-game */}
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
