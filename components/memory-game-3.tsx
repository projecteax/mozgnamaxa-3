"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useGameCompletionWithHistory } from "@/hooks/use-game-completion"
import { getRandomSuccessMessage } from "@/lib/success-messages"
import { useSeason } from "@/contexts/season-context"
import SoundButtonEnhanced from "./sound-button-enhanced"
import SuccessMessage from "./success-message"

interface MemoryGameProps {
  onMenuClick: () => void
  onBack?: () => void
  onNext?: () => void
  onRetry?: () => void
  userLoggedIn?: boolean
  currentSeason?: string
}

interface MemoryCard {
  id: number
  image: string
  name: string
  isFlipped: boolean
  isMatched: boolean
}

export default function MemoryGame3({ onMenuClick, onBack, onNext, onRetry, userLoggedIn = false, currentSeason = "wiosna", isGameCompleted = false }: MemoryGameProps) {
  const { selectedSeason, getThemeColors } = useSeason()
  const theme = getThemeColors()

  // Define the cards for the memory game
  const [cards, setCards] = useState<MemoryCard[]>([])

  // State for tracking the currently flipped cards
  const [flippedCards, setFlippedCards] = useState<number[]>([])

  // State for tracking if the game is completed
  const [isCompleted, setIsCompleted] = useState(false)

  // State for disabling clicks during card flipping animation or checking
  const [isChecking, setIsChecking] = useState(false)

  // State for random success message
  const [successMessage, setSuccessMessage] = useState<string>("")

  const { recordCompletion, isLoggedIn, isHistoricallyCompleted } = useGameCompletionWithHistory("memory-game-3")
  const [progressSaved, setProgressSaved] = useState(false)

  // Helper function to get the correct image based on season
  const getImageForSeason = (springImage: string, summerImage: string, autumnImage: string, winterImage?: string) => {
    if (selectedSeason === "zima" && winterImage) return winterImage
    if (selectedSeason === "lato") return summerImage
    if (selectedSeason === "jesien") return autumnImage
    return springImage
  }

  // Helper function to get the correct covered box image
  const getCoveredBoxImage = () => {
    if (selectedSeason === "zima") return "/images/box_covered_winter.svg"
    if (selectedSeason === "lato") return "/images/box_covered_summer.svg"
    if (selectedSeason === "jesien") return "/images/box_covered_autumn.svg"
    return "/images/box_covered.png"
  }

  // Initialize the cards
  useEffect(() => {
    // Create cards in the specific order requested
    const orderedCards: MemoryCard[] = [
      // First row
      {
        id: 0,
        image: getImageForSeason(
          "/images/big_rabbit.svg",
          "/images/big_castle_summer.svg",
          "/images/pumpkin_autumn.svg",
          "/images/sock_01_winter.svg",
        ),
        name: "Item1",
        isFlipped: false,
        isMatched: false,
      },
      {
        id: 1,
        image: getImageForSeason(
          "/images/big_sparrow.svg",
          "/images/big_mountains_summer.svg",
          "/images/wallnut_autumn.svg",
          "/images/sock_02_winter.svg",
        ),
        name: "Item2",
        isFlipped: false,
        isMatched: false,
      },
      {
        id: 2,
        image: getImageForSeason(
          "/images/big_chicken.svg",
          "/images/big_sea_summer.svg",
          "/images/chestnut_autumn.svg",
          "/images/sock_03_winter.svg",
        ),
        name: "Item3",
        isFlipped: false,
        isMatched: false,
      },
      {
        id: 3,
        image: getImageForSeason(
          "/images/big_lamb.svg",
          "/images/big_tent_summer.svg",
          "/images/pepper_autumn.svg",
          "/images/sock_04_winter.svg",
        ),
        name: "Item4",
        isFlipped: false,
        isMatched: false,
      },
      // Second row
      {
        id: 4,
        image: getImageForSeason(
          "/images/baby_rabbit.svg",
          "/images/small_castle_summer.svg",
          "/images/pumpkin_autumn_baby.svg",
          "/images/sock_01_winter.svg",
        ),
        name: "Item1",
        isFlipped: false,
        isMatched: false,
      },
      {
        id: 5,
        image: getImageForSeason(
          "/images/baby_chicken.svg",
          "/images/small_sea_summer.svg",
          "/images/chestnut_autumn_baby.svg",
          "/images/sock_03_winter.svg",
        ),
        name: "Item3",
        isFlipped: false,
        isMatched: false,
      },
      {
        id: 6,
        image: getImageForSeason(
          "/images/small_lamb.svg",
          "/images/small_tent_summer.svg",
          "/images/pepper_autumn_baby.svg",
          "/images/sock_04_winter.svg",
        ),
        name: "Item4",
        isFlipped: false,
        isMatched: false,
      },
      {
        id: 7,
        image: getImageForSeason(
          "/images/small_sparrow.svg",
          "/images/small_mountains_summer.svg",
          "/images/wallnut_autumn_baby.svg",
          "/images/sock_02_winter.svg",
        ),
        name: "Item2",
        isFlipped: false,
        isMatched: false,
      },
    ]

    setCards(orderedCards)
  }, [selectedSeason])

  // Handle card click
  const handleCardClick = (id: number) => {
    // Ignore clicks if already checking or if card is already flipped or matched
    if (isChecking || flippedCards.length >= 2) return

    const clickedCard = cards.find((card) => card.id === id)
    if (!clickedCard || clickedCard.isFlipped || clickedCard.isMatched) return

    // Flip the card
    setCards((prevCards) => prevCards.map((card) => (card.id === id ? { ...card, isFlipped: true } : card)))

    // Add to flipped cards
    setFlippedCards((prev) => [...prev, id])
  }

  // Check for matches when two cards are flipped
  useEffect(() => {
    if (flippedCards.length === 2) {
      setIsChecking(true)

      const [firstId, secondId] = flippedCards
      const firstCard = cards.find((card) => card.id === firstId)
      const secondCard = cards.find((card) => card.id === secondId)

      if (firstCard && secondCard && firstCard.name === secondCard.name) {
        // Match found
        setCards((prevCards) =>
          prevCards.map((card) => (card.id === firstId || card.id === secondId ? { ...card, isMatched: true } : card)),
        )
        setFlippedCards([])
        setIsChecking(false)

        // Check if all cards are matched
        const allMatched = cards.every((card) => (card.id === firstId || card.id === secondId ? true : card.isMatched))

        if (allMatched) {
          setIsCompleted(true)
          setSuccessMessage(getRandomSuccessMessage())
          handleGameCompletion()
        }
      } else {
        // No match, flip cards back after 1.5 seconds
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card) =>
              card.id === firstId || card.id === secondId ? { ...card, isFlipped: false } : card,
            ),
          )
          setFlippedCards([])
          setIsChecking(false)
        }, 1500)
      }
    }
  }, [flippedCards, cards])

  const resetGame = () => {
    // Reset all cards but keep the same order
    setCards((prevCards) =>
      prevCards.map((card) => ({
        ...card,
        isFlipped: false,
        isMatched: false,
      })),
    )

    setFlippedCards([])
    setIsCompleted(false)
    setIsChecking(false)
    setProgressSaved(false)
    setSuccessMessage("")
  }

  const handleGameCompletion = async () => {
    try {
              await recordCompletion()
      setProgressSaved(true)
    } catch (error) {
      console.error("Failed to record completion:", error)
    }
  }

  return (
    <div className="w-full max-w-4xl" style={{ backgroundColor: theme.background }}>
      {/* Header with title */}
      <div className="w-full flex justify-between items-center mb-8">
        <div className="relative w-16 h-16">
          <SoundButtonEnhanced
            text="ZNAJDŹ PARY"
            soundIcon={theme.soundIcon || "/images/sound_icon_dragon_page.svg"}
            size="xl"
            className="w-full h-full"
          />
        </div>

        <div className="relative h-24 w-80 md:w-[500px] flex items-center justify-center">
          <Image src={theme.titleBox || "/placeholder.svg"} alt="Title box" fill className="object-contain" />
          <span className="relative z-10 text-white text-2xl md:text-3xl font-sour-gummy font-thin">ZNAJDŹ PARY</span>
        </div>

        <div className="relative w-16 h-16" onClick={onMenuClick}>
          <Image src={theme.menuIcon || "/placeholder.svg"} alt="Menu" fill className="object-contain cursor-pointer" />
        </div>
      </div>

      {/* Game area */}
      <div className="flex flex-col items-center">
        {/* Memory cards grid - enlarged by 120% */}
        <div className="grid grid-cols-4 gap-4 w-full max-w-4xl">
          {cards.map((card) => (
            <div
              key={card.id}
              className="relative cursor-pointer transition-transform duration-300 drop-shadow-lg"
              style={{ height: "154px", width: "154px" }} // 128px * 1.2 = 154px (rounded)
              onClick={() => handleCardClick(card.id)}
            >
              {/* Card front (covered) */}
              <div
                className={`absolute inset-0 backface-hidden transition-all duration-300 ${
                  card.isFlipped || card.isMatched ? "opacity-0" : "opacity-100"
                }`}
              >
                <Image
                  src={getCoveredBoxImage() || "/placeholder.svg"}
                  alt="Card back"
                  fill
                  className="object-contain"
                />
              </div>

              {/* Card back (image) - using white_box_medium.svg as background */}
              <div
                className={`absolute inset-0 backface-hidden transition-all duration-300 ${
                  card.isFlipped || card.isMatched ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="relative h-full w-full flex items-center justify-center">
                  {/* Box background */}
                  <div className="absolute inset-0">
                    <Image src="/images/white_box_medium.svg" alt="Card background" fill className="object-contain" />
                  </div>

                  {/* Card image with shadow */}
                  <div className="relative h-20 w-20 z-10 drop-shadow-md">
                    <Image src={card.image || "/placeholder.svg"} alt={card.name} fill className="object-contain" />
                  </div>
                </div>
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
            {/* WRÓĆ Button - always available in memory-game-3 */}
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
    </div>
  )
}
