"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useGameCompletion } from "@/hooks/use-game-completion"
import { getRandomSuccessMessage } from "@/lib/success-messages"
import { useSeason } from "@/contexts/season-context"

interface MemoryGame4Props {
  onMenuClick: () => void
  onComplete?: () => void
}

interface MemoryCard {
  id: number
  image: string
  name: string
  isFlipped: boolean
  isMatched: boolean
}

export default function MemoryGame4({ onMenuClick, onComplete }: MemoryGame4Props) {
  // Use the game completion hook
  const { recordCompletion, isLoggedIn } = useGameCompletion()

  // Use season context
  const { selectedSeason } = useSeason()

  // Define the cards for the memory game
  const [cards, setCards] = useState<MemoryCard[]>([])

  // State for tracking the currently flipped cards
  const [flippedCards, setFlippedCards] = useState<number[]>([])

  // State for tracking if the game is completed
  const [isCompleted, setIsCompleted] = useState(false)

  // State for disabling clicks during card flipping animation or checking
  const [isChecking, setIsChecking] = useState(false)

  // State for success message
  const [successMessage, setSuccessMessage] = useState<string>("")

  // Initialize the cards based on season
  useEffect(() => {
    let orderedCards: MemoryCard[] = []

    if (selectedSeason === "zima") {
      // Winter theme with winter items
      orderedCards = [
        // First row
        {
          id: 0,
          image: "/images/slaigh_winter.svg",
          name: "Sleigh",
          isFlipped: false,
          isMatched: false,
        },
        {
          id: 1,
          image: "/images/fox_winter_bw.svg",
          name: "Fox",
          isFlipped: false,
          isMatched: false,
        },
        {
          id: 2,
          image: "/images/hat_winter.svg",
          name: "Hat",
          isFlipped: false,
          isMatched: false,
        },
        {
          id: 3,
          image: "/images/glove_winter.svg",
          name: "Glove",
          isFlipped: false,
          isMatched: false,
        },
        {
          id: 4,
          image: "/images/pinguin_winter_bw.svg",
          name: "Penguin",
          isFlipped: false,
          isMatched: false,
        },
        // Second row
        {
          id: 5,
          image: "/images/glove_winter_bw.svg",
          name: "Glove",
          isFlipped: false,
          isMatched: false,
        },
        {
          id: 6,
          image: "/images/hat_winter_bw.svg",
          name: "Hat",
          isFlipped: false,
          isMatched: false,
        },
        {
          id: 7,
          image: "/images/pinguin_winter.svg",
          name: "Penguin",
          isFlipped: false,
          isMatched: false,
        },
        {
          id: 8,
          image: "/images/slaigh_winter_bw.svg",
          name: "Sleigh",
          isFlipped: false,
          isMatched: false,
        },
        {
          id: 9,
          image: "/images/fox_winter.svg",
          name: "Fox",
          isFlipped: false,
          isMatched: false,
        },
      ]
    } else if (selectedSeason === "jesien") {
      // Autumn theme with autumn items
      orderedCards = [
        // First row
        {
          id: 0,
          image: "/images/leaf_yellow_autumn.svg",
          name: "Yellow Leaf",
          isFlipped: false,
          isMatched: false,
        },
        {
          id: 1,
          image: "/images/hedgehog_autumn_bw.svg",
          name: "Hedgehog",
          isFlipped: false,
          isMatched: false,
        },
        {
          id: 2,
          image: "/images/boots_autumn.svg",
          name: "Boots",
          isFlipped: false,
          isMatched: false,
        },
        {
          id: 3,
          image: "/images/umbrella_autumn.svg",
          name: "Umbrella",
          isFlipped: false,
          isMatched: false,
        },
        {
          id: 4,
          image: "/images/squirrel_autumn_bw.svg",
          name: "Squirrel",
          isFlipped: false,
          isMatched: false,
        },
        // Second row
        {
          id: 5,
          image: "/images/umbrella_autumnt_bw.svg",
          name: "Umbrella",
          isFlipped: false,
          isMatched: false,
        },
        {
          id: 6,
          image: "/images/boots_autumn_bw.svg",
          name: "Boots",
          isFlipped: false,
          isMatched: false,
        },
        {
          id: 7,
          image: "/images/squirrel_autumn.svg",
          name: "Squirrel",
          isFlipped: false,
          isMatched: false,
        },
        {
          id: 8,
          image: "/images/leaf_yellow_autumn_bw.svg",
          name: "Yellow Leaf",
          isFlipped: false,
          isMatched: false,
        },
        {
          id: 9,
          image: "/images/hedgehog_autumn.svg",
          name: "Hedgehog",
          isFlipped: false,
          isMatched: false,
        },
      ]
    } else if (selectedSeason === "lato") {
      // Summer theme with food items
      orderedCards = [
        // First row
        {
          id: 0,
          image: "/images/banana_summer.svg",
          name: "Banana",
          isFlipped: false,
          isMatched: false,
        },
        {
          id: 1,
          image: "/images/icecream_summer_bw.svg",
          name: "Ice Cream",
          isFlipped: false,
          isMatched: false,
        },
        {
          id: 2,
          image: "/images/carrot_summer.svg",
          name: "Carrot",
          isFlipped: false,
          isMatched: false,
        },
        {
          id: 3,
          image: "/images/pepper_summer.svg",
          name: "Pepper",
          isFlipped: false,
          isMatched: false,
        },
        {
          id: 4,
          image: "/images/apple_summer_bw.svg",
          name: "Apple",
          isFlipped: false,
          isMatched: false,
        },
        // Second row
        {
          id: 5,
          image: "/images/pepper_summer_bw.svg",
          name: "Pepper",
          isFlipped: false,
          isMatched: false,
        },
        {
          id: 6,
          image: "/images/carrot_summer_bw.svg",
          name: "Carrot",
          isFlipped: false,
          isMatched: false,
        },
        {
          id: 7,
          image: "/images/apple_summer.svg",
          name: "Apple",
          isFlipped: false,
          isMatched: false,
        },
        {
          id: 8,
          image: "/images/banana_summer_bw.svg",
          name: "Banana",
          isFlipped: false,
          isMatched: false,
        },
        {
          id: 9,
          image: "/images/icecream_summer.svg",
          name: "Ice Cream",
          isFlipped: false,
          isMatched: false,
        },
      ]
    } else {
      // Default spring theme
      orderedCards = [
        // First row
        {
          id: 0,
          image: "/images/butterfly_02_new.png",
          name: "Butterfly",
          isFlipped: false,
          isMatched: false,
        },
        {
          id: 1,
          image: "/images/bee_bw.svg",
          name: "Bee",
          isFlipped: false,
          isMatched: false,
        },
        {
          id: 2,
          image: "/images/flower_pink.svg",
          name: "Pink Flower",
          isFlipped: false,
          isMatched: false,
        },
        {
          id: 3,
          image: "/images/ladybug.svg",
          name: "Ladybug",
          isFlipped: false,
          isMatched: false,
        },
        {
          id: 4,
          image: "/images/red_flower_bw.svg",
          name: "Red Flower",
          isFlipped: false,
          isMatched: false,
        },
        // Second row
        {
          id: 5,
          image: "/images/ladybug_bw.svg",
          name: "Ladybug",
          isFlipped: false,
          isMatched: false,
        },
        {
          id: 6,
          image: "/images/flower_pink_bw.svg",
          name: "Pink Flower",
          isFlipped: false,
          isMatched: false,
        },
        {
          id: 7,
          image: "/images/red_flower.png",
          name: "Red Flower",
          isFlipped: false,
          isMatched: false,
        },
        {
          id: 8,
          image: "/images/butterfly_yellow_bw.svg",
          name: "Butterfly",
          isFlipped: false,
          isMatched: false,
        },
        {
          id: 9,
          image: "/images/bee_new_2.svg",
          name: "Bee",
          isFlipped: false,
          isMatched: false,
        },
      ]
    }

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
        const updatedCards = cards.map((card) =>
          card.id === firstId || card.id === secondId ? { ...card, isMatched: true } : card,
        )
        setCards(updatedCards)
        setFlippedCards([])
        setIsChecking(false)

        // Check if all cards are matched
        if (updatedCards.every((card) => card.isMatched)) {
          setIsCompleted(true)
          setSuccessMessage(getRandomSuccessMessage())
          // Record completion for user stats
          if (isLoggedIn) {
            recordCompletion("memory-game-4")
          }
          // Call onComplete after 3 seconds to show success message
          if (onComplete) {
            setTimeout(() => {
              onComplete()
            }, 3000) // 3 second delay
          }
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
  }, [flippedCards, cards, isLoggedIn, recordCompletion, onComplete])

  const handleMedalComplete = () => {
    // This function is no longer needed as medal flow is removed
  }

  const handleProgressContinue = () => {
    // This function is no longer needed as medal flow is removed
  }

  const handleCongratulationsStart = () => {
    // This function is no longer needed as medal flow is removed
    // Reset the game for next play
    resetGame()
  }

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
    setSuccessMessage("")
    // These states are no longer needed as medal flow is removed
    // setShowMedal(false)
    // setShowProgress(false)
    // setShowCongratulations(false)
  }

  // Show medal display
  // This block is no longer needed as medal flow is removed
  // if (showMedal) {
  //   return <MedalDisplay8 onComplete={handleMedalComplete} />
  // }

  // Show progress page
  // This block is no longer needed as medal flow is removed
  // if (showProgress) {
  //   return <ProgressPage8 onContinue={handleProgressContinue} />
  // }

  // Show congratulations page
  // This block is no longer needed as medal flow is removed
  // if (showCongratulations) {
  //   return <CongratulationsPage9 onStartClick={handleCongratulationsStart} />
  // }

  // Get theme-specific assets based on season
  const soundIcon =
    selectedSeason === "zima"
      ? "/images/sound_winter.svg"
      : selectedSeason === "jesien"
        ? "/images/sound_autumn.svg"
        : selectedSeason === "lato"
          ? "/images/sound_summer.svg"
          : "/images/sound_new.svg"
  const menuIcon =
    selectedSeason === "zima"
      ? "/images/menu_winter.svg"
      : selectedSeason === "jesien"
        ? "/images/menu_autumn.svg"
        : selectedSeason === "lato"
          ? "/images/menu_summer.svg"
          : "/images/menu_new.svg"
  const titleBox =
    selectedSeason === "zima"
      ? "/images/title_box_small_winter.svg"
      : selectedSeason === "jesien"
        ? "/images/title_box_small_autumn.svg"
        : selectedSeason === "lato"
          ? "/images/title_box_small_summer.svg"
          : "/images/title_box_small.png"
  const cardCover =
    selectedSeason === "zima"
      ? "/images/box_covered_winter.svg"
      : selectedSeason === "jesien"
        ? "/images/box_covered_autumn.svg"
        : selectedSeason === "lato"
          ? "/images/box_covered_summer.svg"
          : "/images/box_covered.png"

  return (
    <div className="w-full max-w-4xl">
      {/* Header with title */}
      <div className="w-full flex justify-between items-center mb-8">
        <div className="relative w-16 h-16">
          <Image src={soundIcon || "/placeholder.svg"} alt="Sound" fill className="object-contain cursor-pointer" />
        </div>

        <div className="relative h-24 w-80 md:w-[500px] flex items-center justify-center">
          <Image src={titleBox || "/placeholder.svg"} alt="Title box" fill className="object-contain" />
          <span className="relative z-10 text-white text-2xl md:text-3xl font-sour-gummy font-thin">ZNAJDŹ PARY.</span>
        </div>

        <div className="relative w-16 h-16" onClick={onMenuClick}>
          <Image src={menuIcon || "/placeholder.svg"} alt="Menu" fill className="object-contain cursor-pointer" />
        </div>
      </div>

      {/* Game area */}
      <div className="flex flex-col items-center">
        {/* Memory cards grid - updated to 5x2 layout */}
        <div className="grid grid-cols-5 gap-4 w-full max-w-4xl">
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
                <Image src={cardCover || "/placeholder.svg"} alt="Card back" fill className="object-contain" />
              </div>

              {/* Card back (image) - using white_box_medium.svg as background */}
              <div
                className={`absolute inset-0 backface-hidden transition-all duration-300 ${
                  card.isFlipped || card.isMatched ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="relative h-full w-full flex items-center justify-center">
                  {/* Box background - using matching game white box */}
                  <div className="absolute inset-0">
                    <Image
                      src={card.isMatched ? "/images/white_box_medium_success.svg" : "/images/white_box_medium.svg"}
                      alt="Card background"
                      fill
                      className="object-contain"
                    />
                  </div>

                  {/* Card image */}
                  <div className="relative h-20 w-20 z-10">
                    <Image src={card.image || "/placeholder.svg"} alt={card.name} fill className="object-contain" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Success message */}
        {isCompleted && successMessage && (
          <div className="mt-8">
            <div className="bg-green-100 border-2 border-green-500 rounded-lg p-6 text-center max-w-md mx-auto">
              <div className="text-green-700 text-xl font-medium">🎉 {successMessage} 🎉</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
