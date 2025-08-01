"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useGameCompletionWithHistory } from "@/hooks/use-game-completion"
import { getRandomSuccessMessage } from "@/lib/success-messages"
import { useSeason } from "@/contexts/season-context"
import SuccessMessage from "./success-message"
import SoundButtonEnhanced from "./sound-button-enhanced"

interface FindIncorrectLadybugGameProps {
  onMenuClick: () => void
  onBack?: () => void
  onNext?: () => void
  onRetry?: () => void
  userLoggedIn?: boolean
  currentSeason?: string
  isGameCompleted?: boolean
}

export default function FindIncorrectLadybugGame({ onMenuClick, onBack, onNext, onRetry, userLoggedIn = false, currentSeason = "wiosna", isGameCompleted = false }: FindIncorrectLadybugGameProps) {
  const [incorrectLadybugIndex, setIncorrectLadybugIndex] = useState<number>(0)
  const [selectedLadybug, setSelectedLadybug] = useState<number | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Use the game completion hook
  const { recordCompletion, isLoggedIn, isHistoricallyCompleted } = useGameCompletionWithHistory("find-incorrect-ladybug-game")

  const { selectedSeason, getThemeColors } = useSeason()
  const theme = getThemeColors()

  // Check seasons
  const isWinter = selectedSeason === "zima"
  const isAutumn = selectedSeason === "jesien"

  // Initialize game with random incorrect ladybug
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * 48) // 48 total ladybugs (4 rows × 12 ladybugs)
    setIncorrectLadybugIndex(randomIndex)
  }, [])

  const handleLadybugClick = async (index: number) => {
    if (isCompleted) return

    setSelectedLadybug(index)

    if (index === incorrectLadybugIndex) {
      // Correct selection
      setIsCompleted(true)
      setSuccessMessage(getRandomSuccessMessage())

      // Record the game completion
      await recordCompletion()
    } else {
      // Wrong selection - just reset selection after brief delay, no visual feedback
      setTimeout(() => {
        setSelectedLadybug(null)
      }, 300)
    }
  }

  const resetGame = () => {
    const randomIndex = Math.floor(Math.random() * 48)
    setIncorrectLadybugIndex(randomIndex)
    setSelectedLadybug(null)
    setIsCompleted(false)
    setSuccessMessage(null)
  }

  const renderLadybug = (index: number) => {
    const isIncorrect = index === incorrectLadybugIndex
    const isCorrect = isCompleted && index === incorrectLadybugIndex

    // Choose images based on season
    let correctImage, incorrectImage, altText, titleText

    if (isWinter) {
      correctImage = "/images/elf_correct_winter.svg"
      incorrectImage = "/images/elf_incorrect_winter.svg"
      altText = "Elf"
      titleText = "KTÓRY ELF SIĘ RÓŻNI"
    } else if (isAutumn) {
      correctImage = "/images/mushroom_red_autumn.svg"
      incorrectImage = "/images/mushroom_red_autumn_incorrect.svg"
      altText = "Grzyb"
      titleText = "KTÓRY GRZYB SIĘ RÓŻNI"
    } else if (selectedSeason === "lato") {
      correctImage = "/images/sunflower_summer.svg"
      incorrectImage = "/images/incorrect_sunflower_summer.svg"
      altText = "Sunflower"
      titleText = "KTÓRY SŁONECZNIK SIĘ RÓŻNI"
    } else {
      correctImage = "/images/ladybug.svg"
      incorrectImage = "/images/incorrect_ladybug.svg"
      altText = "Ladybug"
      titleText = "KTÓRA BIEDRONKA SIĘ RÓŻNI"
    }

    return (
      <div
        key={index}
        className={`relative cursor-pointer transition-all duration-200 ${!isCompleted ? "hover:scale-105" : ""} flex items-center justify-center`}
        onClick={() => handleLadybugClick(index)}
      >
        <div className="relative flex items-center justify-center">
          {/* Shadow for autumn mushrooms */}
          {isAutumn && (
            <div
              className="absolute inset-0 bg-black/20 rounded-full blur-sm transform translate-y-1"
              style={{ width: "80%", height: "20%", bottom: "-5px", left: "10%" }}
            />
          )}
          <Image
            src={isIncorrect ? incorrectImage : correctImage}
            alt={altText}
            width={96}
            height={96}
            className="transition-transform duration-200 relative z-10"
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

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * 48)
    setIncorrectLadybugIndex(randomIndex)
    setSelectedLadybug(null)
    setIsCompleted(false)
    setSuccessMessage(null)
  }, [selectedSeason])

  // Get title text based on season
  const getTitleText = () => {
    if (isWinter) {
      return "KTÓRY ELF SIĘ RÓŻNI"
    } else if (isAutumn) {
      return "KTÓRY GRZYB SIĘ RÓŻNI"
    } else if (selectedSeason === "lato") {
      return "KTÓRY SŁONECZNIK SIĘ RÓŻNI"
    } else {
      return "KTÓRA BIEDRONKA SIĘ RÓŻNI"
    }
  }

  // Get header images based on season
  const getHeaderImages = () => {
    if (isWinter) {
      return {
        soundIcon: "/images/sound_winter.svg",
        titleBox: "/images/title_box_small_winter.svg",
        menuIcon: "/images/menu_winter.svg",
      }
    } else if (isAutumn) {
      return {
        soundIcon: "/images/sound_autumn.svg",
        titleBox: "/images/title_box_small_autumn.svg",
        menuIcon: "/images/menu_autumn.svg",
      }
    } else if (selectedSeason === "lato") {
      return {
        soundIcon: "/images/sound_summer.svg",
        titleBox: "/images/title_box_small_summer.svg",
        menuIcon: "/images/menu_summer.svg",
      }
    } else {
      return {
        soundIcon: theme.soundIcon || "/placeholder.svg",
        titleBox: "/images/title_box_small.png",
        menuIcon: theme.menuIcon || "/placeholder.svg",
      }
    }
  }

  const headerImages = getHeaderImages()

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header with title */}
      <div className="w-full flex justify-between items-center mb-8">
        <div className="relative w-16 h-16">
          <SoundButtonEnhanced
            text={getTitleText()}
            soundIcon={theme.soundIcon || "/images/sound_icon_dragon_page.svg"}
            size="xl"
            className="w-full h-full"
          />
        </div>

        <div className="relative h-24 w-80 md:w-[500px] flex items-center justify-center">
          <Image src={headerImages.titleBox || "/placeholder.svg"} alt="Title box" fill className="object-contain" />
          <span className="relative z-10 text-white text-2xl md:text-3xl font-sour-gummy font-thin">
            {getTitleText()}
          </span>
        </div>

        <div className="relative w-16 h-16" onClick={onMenuClick}>
          <Image
            src={headerImages.menuIcon || "/placeholder.svg"}
            alt="Menu"
            fill
            className="object-contain cursor-pointer"
          />
        </div>
      </div>

      {/* Game area */}
      <div className="flex flex-col items-center mt-16">
        {/* Ladybug grid - 3 rows of 9 ladybugs */}
        <div className="grid grid-cols-12 gap-2 mb-8">
          {Array.from({ length: 48 }, (_, index) => renderLadybug(index))}
        </div>

        {/* Success message */}
        {successMessage && <SuccessMessage message={successMessage} />}
      </div>

      {/* New Navigation Buttons - Always visible */}
      <div className="flex justify-center gap-4 mt-8 w-full">
        {/* All buttons in same container with identical dimensions */}
        <div className="flex gap-4 items-end">
          {/* WRÓĆ Button - always available in find-incorrect-ladybug-game */}
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
