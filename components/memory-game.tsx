"use client"

import { useState, useEffect } from "react"
import { useProgressTracking } from "@/hooks/use-progress-tracking"
import { useGameCompletionWithHistory } from "@/hooks/use-game-completion"
import { useSeason } from "@/contexts/season-context"
import { getRandomSuccessMessage } from "@/lib/success-messages"
import Image from "next/image"
import SuccessMessage from "./success-message"
import SoundButtonEnhanced from "./sound-button-enhanced"

interface MemoryGameProps {
  onMenuClick: () => void
  onBack?: () => void
  onNext?: () => void
  onRetry?: () => void
  userLoggedIn?: boolean
  currentSeason?: string
  isGameCompleted?: boolean
  onComplete?: () => void
}

interface MemoryCard {
  id: number
  image: string
  summerImage: string
  autumnImage: string
  winterImage: string
  name: string
  isFlipped: boolean
  isMatched: boolean
}

export default function MemoryGame({ onMenuClick, onBack, onNext, onRetry, userLoggedIn = false, currentSeason = "wiosna", isGameCompleted = false, onComplete }: MemoryGameProps) {
  const { trackGameCompletion } = useProgressTracking()
  const { recordCompletion, isLoggedIn, isHistoricallyCompleted } = useGameCompletionWithHistory("memory-game")
  const { selectedSeason, getThemeColors } = useSeason()

  // Get theme colors based on selected season
  const theme = getThemeColors()

  // Define the cards for the memory game
  const [cards, setCards] = useState<MemoryCard[]>([])

  // State for tracking the currently flipped cards
  const [flippedCards, setFlippedCards] = useState<number[]>([])

  // State for tracking if the game is completed
  const [isCompleted, setIsCompleted] = useState(false)

  // State for success message
  const [successMessage, setSuccessMessage] = useState<string>("")

  // State for disabling clicks during card flipping animation or checking
  const [isChecking, setIsChecking] = useState(false)

  // Initialize the cards
  useEffect(() => {
    // Define the card pairs
    const cardPairs = [
      {
        image: "/images/stork.svg",
        summerImage: "/images/sunglasses_summer.svg",
        autumnImage: "/images/grape_dark_autumn.svg",
        winterImage: "/images/lights_winter.svg",
        name: "Stork",
      },
      {
        image: "/images/flower_white.svg",
        summerImage: "/images/hat_summer.svg",
        autumnImage: "/images/pear_autumn.svg",
        winterImage: "/images/ball_01_winter.svg",
        name: "White Flower",
      },
      {
        image: "/images/ladybug.svg",
        summerImage: "/images/swimsuit_summer.svg",
        autumnImage: "/images/plum_autumn.svg",
        winterImage: "/images/chain_winter.svg",
        name: "Ladybug",
      },
      {
        image: "/images/yellow_flower.png",
        summerImage: "/images/flip_flops_summer.svg",
        autumnImage: "/images/apple_autumn.svg",
        winterImage: "/images/star_winter.svg",
        name: "Yellow Flower",
      },
    ]

    // Create pairs of cards
    const initialCards: MemoryCard[] = []
    cardPairs.forEach((pair, index) => {
      // Add two cards with the same image
      initialCards.push({
        id: index * 2,
        image: pair.image,
        summerImage: pair.summerImage,
        autumnImage: pair.autumnImage,
        winterImage: pair.winterImage,
        name: pair.name,
        isFlipped: false,
        isMatched: false,
      })
      initialCards.push({
        id: index * 2 + 1,
        image: pair.image,
        summerImage: pair.summerImage,
        autumnImage: pair.autumnImage,
        winterImage: pair.winterImage,
        name: pair.name,
        isFlipped: false,
        isMatched: false,
      })
    })

    // Shuffle the cards
    const shuffledCards = [...initialCards].sort(() => Math.random() - 0.5)

    setCards(shuffledCards)
  }, [])

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
        setCards((prevCards) => {
          const updatedCards = prevCards.map((card) => 
            card.id === firstId || card.id === secondId ? { ...card, isMatched: true } : card
        )

        // Check if all cards are matched
          if (updatedCards.every((card) => card.isMatched)) {
          setIsCompleted(true)
            setSuccessMessage(getRandomSuccessMessage())
          // Record completion for user stats
          recordCompletion()
            // Record completion for medal flow after 3 seconds
          if (onComplete) {
              setTimeout(() => {
            onComplete()
              }, 3000) // 3 second delay
          }
        }
          
          return updatedCards
        })
        setFlippedCards([])
        setIsChecking(false)
      } else {
        // No match, flip cards back after 1.5 seconds (changed from 3 seconds)
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card) =>
              card.id === firstId || card.id === secondId ? { ...card, isFlipped: false } : card,
            ),
          )
          setFlippedCards([])
          setIsChecking(false)
        }, 1500) // Changed from 3000 to 1500 milliseconds
      }
    }
  }, [flippedCards, cards, trackGameCompletion, recordCompletion, onComplete])

  // Reset the game
  const resetGame = () => {
    // Reset all cards
    setCards((prevCards) =>
      prevCards.map((card) => ({
        ...card,
        isFlipped: false,
        isMatched: false,
      })),
    )

    // Shuffle the cards
    setCards((prevCards) => [...prevCards].sort(() => Math.random() - 0.5))

    setFlippedCards([])
    setIsCompleted(false)
    setIsChecking(false)
    setSuccessMessage("")
  }

  // Get the appropriate image based on season
  const getCardImage = (card: MemoryCard) => {
    if (selectedSeason === "lato") {
      return card.summerImage
    } else if (selectedSeason === "jesien") {
      return card.autumnImage
    } else if (selectedSeason === "zima") {
      return card.winterImage
    }
    return card.image
  }

  // Get the appropriate covered box image based on season
  const getCoveredBoxImage = () => {
    if (selectedSeason === "lato") {
      return "/images/box_covered_summer.svg"
    } else if (selectedSeason === "jesien") {
      return "/images/box_covered_autumn.svg"
    } else if (selectedSeason === "zima") {
      return "/images/box_covered_winter.svg"
    }
    return "/images/box_covered.png"
  }

  // Get the appropriate title box image based on season
  const getTitleBoxImage = () => {
    if (selectedSeason === "lato") {
      return "/images/title_box_small_summer.svg"
    } else if (selectedSeason === "jesien") {
      return "/images/title_box_small_autumn.svg"
    } else if (selectedSeason === "zima") {
      return "/images/title_box_small_winter.svg"
    }
    return "/images/title_box_small.png"
  }

  
  

  return (
    <div className="w-full max-w-6xl" style={{ backgroundColor: theme.background }}>
      {/* Header with title */}
      <div className="w-full max-w-4xl mx-auto">
        <div className="w-full flex justify-between items-center mb-12">
          <div className="relative w-16 h-16">
            <SoundButtonEnhanced
              text="ZNAJDŹ PARY"
              soundIcon={theme.soundIcon || "/images/sound_icon_dragon_page.svg"}
              size="xl"
              className="w-full h-full"
            />
          </div>

          <div className="relative h-24 w-80 md:w-[500px] flex items-center justify-center">
            <Image src={getTitleBoxImage() || "/placeholder.svg"} alt="Title box" fill className="object-contain" />
            <span className="relative z-10 text-white text-2xl md:text-3xl font-bold font-sour-gummy">
              ZNAJDŹ PARY.
            </span>
          </div>

          <div className="relative w-16 h-16" onClick={onMenuClick}>
            <Image
              src={theme.menuIcon || "/placeholder.svg"}
              alt="Menu"
              fill
              className="object-contain cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Game area */}
      <div className="flex flex-col items-center">
        {/* Memory cards grid */}
        <div className="grid grid-cols-4 gap-4 w-full max-w-3xl">
          {cards.map((card) => (
            <div
              key={card.id}
              className="relative h-32 w-32 cursor-pointer transition-transform duration-300"
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

              {/* Card back (image) - now using box_medium.svg instead of plain white background */}
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

                  {/* Card image */}
                  <div className="relative h-20 w-20 z-10">
                    <Image
                      src={getCardImage(card) || "/placeholder.svg"}
                      alt={card.name}
                      fill
                      className="object-contain drop-shadow-lg"
                      style={{
                        filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Success message */}
        {isCompleted && successMessage && (
          <div className="mt-8">
            <SuccessMessage message={successMessage} />
          </div>
        )}

        {/* New Navigation Buttons */}
        <div className="flex justify-center gap-4 mt-8 w-full">
          {/* All buttons in same container with identical dimensions */}
          <div className="flex gap-4 items-end">
            {/* WRÓĆ Button - always available in memory-game */}
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
        {!userLoggedIn && (
          <div className="mt-4 text-center text-gray-600">
            <p>Zaloguj się, aby zapisać swój postęp!</p>
          </div>
        )}
      </div>
    </div>
  )
}
