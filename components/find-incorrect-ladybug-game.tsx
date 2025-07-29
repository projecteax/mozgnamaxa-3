"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useGameCompletion } from "@/hooks/use-game-completion"
import { getRandomSuccessMessage } from "@/lib/success-messages"
import { useSeason } from "@/contexts/season-context"
import SuccessMessage from "./success-message"

interface FindIncorrectLadybugGameProps {
  onMenuClick: () => void
}

export default function FindIncorrectLadybugGame({ onMenuClick }: FindIncorrectLadybugGameProps) {
  const [incorrectLadybugIndex, setIncorrectLadybugIndex] = useState<number>(0)
  const [selectedLadybug, setSelectedLadybug] = useState<number | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Use the game completion hook
  const { recordCompletion } = useGameCompletion()

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
      await recordCompletion("find-incorrect-ladybug-game")
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
          <Image
            src={headerImages.soundIcon || "/placeholder.svg"}
            alt="Sound"
            fill
            className="object-contain cursor-pointer"
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
