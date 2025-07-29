"use client"

import { useState } from "react"
import Image from "next/image"
import { useGameCompletion } from "@/hooks/use-game-completion"
import { getRandomSuccessMessage } from "@/lib/success-messages"
import { useSeason } from "@/contexts/season-context"

interface EasterBasketGameProps {
  onMenuClick: () => void
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

export default function EasterBasketGame({ onMenuClick }: EasterBasketGameProps) {
  const { recordCompletion } = useGameCompletion()
  const { selectedSeason, getThemeColors } = useSeason()
  const theme = getThemeColors()

  // Define the game items with their positions moved higher up to align with the red line
  const gameItems: GameItem[] = [
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
      isCorrect: true, // This is the item that doesn't belong
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
      isCorrect: false, // This was the correct item for spring/summer, but not for autumn/winter
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

  // Handle item click
  const handleItemClick = (id: string, isCorrect: boolean) => {
    if (isCompleted) return

    setSelectedItem(id)

    // For autumn season, only zebra (egg item) is correct
    // For winter season, only bike (egg item) is correct
    const isCorrectForSeason =
      selectedSeason === "jesien" ? id === "egg" : selectedSeason === "zima" ? id === "egg" : isCorrect

    if (isCorrectForSeason) {
      setIsCompleted(true)
      setSuccessMessage(getRandomSuccessMessage())

      // Record completion for logged-in users
      if (!hasRecordedCompletion) {
        recordCompletion("easter-basket")
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
      return item.summerImage
    } else if (selectedSeason === "jesien") {
      return item.autumnImage
    } else if (selectedSeason === "zima") {
      return item.winterImage
    } else {
      return item.image
    }
  }

  // Get the appropriate title box based on season
  const getTitleBox = () => {
    return theme.titleBox || "/images/green_large_box.svg"
  }

  return (
    <div className="w-full max-w-4xl">
      {/* Header with title - enlarged title box by 120% and updated font */}
      <div className="w-full flex justify-between items-center mb-8">
        <div className="relative w-16 h-16">
          <Image
            src={theme.soundIcon || "/placeholder.svg"}
            alt="Sound"
            fill
            className="object-contain cursor-pointer"
          />
        </div>

        <div className="relative h-[115px] w-[384px] md:w-[600px] flex items-center justify-center">
          <Image src={getTitleBox() || "/placeholder.svg"} alt="Title box" fill className="object-contain" />
          <span className="relative z-10 text-white text-center text-xl md:text-2xl font-sour-gummy font-thin px-4">
            {getTitleText()}
          </span>
        </div>

        <div className="relative w-16 h-16" onClick={onMenuClick}>
          <Image src={theme.menuIcon || "/placeholder.svg"} alt="Menu" fill className="object-contain cursor-pointer" />
        </div>
      </div>

      {/* Game area */}
      <div className="flex justify-center items-center">
        <div className="flex flex-col items-center w-full">
          {/* Game items - positioned higher up to align with the red line and reduced in size */}
          <div
            className="relative w-full h-[350px] rounded-lg"
            style={{ backgroundColor: theme.background || "transparent" }}
          >
            {gameItems.map((item) => {
              // For autumn season, only zebra (egg item) should be highlighted when correct
              // For winter season, only bike (egg item) should be highlighted when correct
              const isCorrectForCurrentSeason =
                selectedSeason === "jesien"
                  ? item.id === "egg"
                  : selectedSeason === "zima"
                    ? item.id === "egg"
                    : item.isCorrect

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
                className="bg-[#539e1b] text-white px-6 py-2 rounded-full font-bold hover:bg-[#4a8c18] transition-colors"
              >
                Zagraj ponownie
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
