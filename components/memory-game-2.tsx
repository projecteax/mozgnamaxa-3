"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useGameCompletion } from "@/hooks/use-game-completion"

interface MemoryGame2Props {
  onMenuClick: () => void
}

interface MemoryCard {
  id: number
  image: string
  name: string
  isFlipped: boolean
  isMatched: boolean
}

export default function MemoryGame2({ onMenuClick }: MemoryGame2Props) {
  // Use the game completion hook
  const { recordCompletion, isLoggedIn } = useGameCompletion()

  // Define the cards for the memory game
  const [cards, setCards] = useState<MemoryCard[]>([])

  // State for tracking the currently flipped cards
  const [flippedCards, setFlippedCards] = useState<number[]>([])

  // State for tracking if the game is completed
  const [isCompleted, setIsCompleted] = useState(false)

  // State for disabling clicks during card flipping animation or checking
  const [isChecking, setIsChecking] = useState(false)

  // Initialize the cards
  useEffect(() => {
    // Define the card pairs with the new icons
    const cardPairs = [
      { image: "/images/purple_flower.svg", name: "Purple Flower" },
      { image: "/images/branch.svg", name: "Branch" },
      { image: "/images/lattuce.svg", name: "Lettuce" },
      { image: "/images/white_flower_daisy.svg", name: "Daisy" },
    ]

    // Create pairs of cards
    const initialCards: MemoryCard[] = []
    cardPairs.forEach((pair, index) => {
      // Add two cards with the same image
      initialCards.push({
        id: index * 2,
        image: pair.image,
        name: pair.name,
        isFlipped: false,
        isMatched: false,
      })
      initialCards.push({
        id: index * 2 + 1,
        image: pair.image,
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
        setCards((prevCards) =>
          prevCards.map((card) => (card.id === firstId || card.id === secondId ? { ...card, isMatched: true } : card)),
        )
        setFlippedCards([])
        setIsChecking(false)

        // Check if all cards are matched
        const allMatched = cards.every((card) => (card.id === firstId || card.id === secondId ? true : card.isMatched))

        if (allMatched) {
          setIsCompleted(true)

          // Record completion in database
          if (isLoggedIn) {
            recordCompletion("memory-game-2")
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
  }, [flippedCards, cards, isLoggedIn, recordCompletion])

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
  }

  return (
    <div className="w-full max-w-4xl">
      {/* Header with title */}
      <div className="w-full flex justify-between items-center mb-8">
        <div className="relative w-16 h-16">
          <Image src="/images/sound_new.svg" alt="Sound" fill className="object-contain cursor-pointer" />
        </div>

        <div className="relative h-24 w-80 md:w-[500px] flex items-center justify-center">
          <Image src="/images/title_box_small.png" alt="Title box" fill className="object-contain" />
          <span className="relative z-10 text-white text-2xl md:text-3xl font-bold">ZNAJDŹ PARY 2.</span>
        </div>

        <div className="relative w-16 h-16" onClick={onMenuClick}>
          <Image src="/images/menu_new.svg" alt="Menu" fill className="object-contain cursor-pointer" />
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
                <Image src="/images/box_covered.png" alt="Card back" fill className="object-contain" />
              </div>

              {/* Card back (image) - using box_medium.svg as background */}
              <div
                className={`absolute inset-0 backface-hidden transition-all duration-300 ${
                  card.isFlipped || card.isMatched ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="relative h-full w-full flex items-center justify-center">
                  {/* Box background */}
                  <div className="absolute inset-0">
                    <Image src="/images/box_medium.svg" alt="Card background" fill className="object-contain" />
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

        {/* Reset button - only visible when game is completed */}
        {isCompleted && (
          <div className="flex justify-center mt-8">
            <button onClick={resetGame} className="bg-[#539e1b] text-white px-6 py-2 rounded-full font-bold">
              Zagraj ponownie
            </button>
          </div>
        )}
      </div>

      {/* Login reminder for non-logged in users */}
      {!isLoggedIn && (
        <div className="mt-4 text-center text-gray-600">
          <p>Zaloguj się, aby zapisać swój postęp!</p>
        </div>
      )}
    </div>
  )
}
