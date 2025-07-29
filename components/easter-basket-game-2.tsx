"use client"

import { useState } from "react"
import Image from "next/image"

interface EasterBasketGame2Props {
  onMenuClick: () => void
}

interface GameItem {
  id: string
  image: string
  isCorrect: boolean
  category: string
  position: string
  size: string
}

export default function EasterBasketGame2({ onMenuClick }: EasterBasketGame2Props) {
  // Define the game items with their positions matching the design
  const gameItems: GameItem[] = [
    {
      id: "napkin",
      image: "/images/napkin.svg",
      isCorrect: false,
      category: "easter",
      position: "top-[120px] left-[20%] transform -translate-x-1/2",
      size: "h-36 w-36",
    },
    {
      id: "choco-bunny",
      image: "/images/choco_bunny.svg",
      isCorrect: false,
      category: "easter",
      position: "top-[300px] left-[25%] transform -translate-x-1/2",
      size: "h-36 w-36",
    },
    {
      id: "egg",
      image: "/images/egg_green.svg",
      isCorrect: false,
      category: "easter",
      position: "top-[120px] left-[50%] transform -translate-x-1/2",
      size: "h-36 w-36",
    },
    {
      id: "palm",
      image: "/images/palm.svg",
      isCorrect: false,
      category: "easter",
      position: "top-[120px] left-[80%] transform -translate-x-1/2",
      size: "h-36 w-36",
    },
    {
      id: "toothbrush",
      image: "/images/tooth_brush.svg",
      isCorrect: true, // This is the item that doesn't belong
      category: "non-easter",
      position: "top-[300px] left-[50%] transform -translate-x-1/2",
      size: "h-36 w-36",
    },
    {
      id: "bread",
      image: "/images/bread.svg",
      isCorrect: false,
      category: "easter",
      position: "top-[300px] left-[75%] transform -translate-x-1/2",
      size: "h-36 w-36",
    },
  ]

  // State for tracking if the correct item has been selected
  const [selectedItem, setSelectedItem] = useState<string | null>(null)

  // State for feedback message
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)

  // State for tracking if the game is completed
  const [isCompleted, setIsCompleted] = useState(false)

  // Handle item click
  const handleItemClick = (id: string, isCorrect: boolean) => {
    if (isCompleted) return

    setSelectedItem(id)

    if (isCorrect) {
      setFeedbackMessage("Brawo! Szczoteczka do zębów nie pasuje do koszyczka wielkanocnego.")
      setIsCompleted(true)
    } else {
      setFeedbackMessage("Przykro mi. To nie to")
    }
  }

  // Reset the game
  const resetGame = () => {
    setSelectedItem(null)
    setFeedbackMessage(null)
    setIsCompleted(false)
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header with title - using the green_large_box.svg */}
      <div className="w-full flex justify-between items-center mb-8">
        <div className="relative w-16 h-16">
          <Image src="/images/sound.png" alt="Sound" fill className="object-contain cursor-pointer" />
        </div>

        <div className="relative h-24 w-[475px] flex items-center justify-center">
          <Image src="/images/green_large_box.svg" alt="Title box" fill className="object-contain" />
          <span className="relative z-10 text-white text-center text-2xl md:text-3xl font-bold px-4">
            WYBIERZ, CO NIE PASUJE DO KOSZYCZKA WIELKANOCNEGO.
          </span>
        </div>

        <div className="relative w-16 h-16" onClick={onMenuClick}>
          <Image src="/images/menu.png" alt="Menu" fill className="object-contain cursor-pointer" />
        </div>
      </div>

      {/* Game area */}
      <div className="flex justify-center items-center mt-8">
        <div className="flex flex-col items-center w-full">
          {/* Game items - positioned to match the design */}
          <div className="relative w-full h-[500px] bg-[#edffe5]">
            {gameItems.map((item) => (
              <div
                key={item.id}
                className={`absolute ${item.position} cursor-pointer transition-all duration-300 ${
                  selectedItem === item.id && !item.isCorrect ? "opacity-50" : ""
                } ${isCompleted && item.isCorrect ? "scale-110" : ""}`}
                onClick={() => handleItemClick(item.id, item.isCorrect)}
              >
                <div className={`relative ${item.size}`}>
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.id}
                    fill
                    className="object-contain"
                    style={{
                      filter: isCompleted && item.isCorrect ? "drop-shadow(0 0 8px #539e1b)" : "none",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Feedback message */}
          {feedbackMessage && (
            <div
              className={`mt-8 text-xl font-medium text-center ${
                feedbackMessage.includes("Brawo") ? "text-[#539e1b]" : "text-red-600"
              }`}
            >
              {feedbackMessage}
            </div>
          )}

          {/* Reset button - only visible when game is completed */}
          {isCompleted && (
            <div className="flex justify-center mt-8">
              <button onClick={resetGame} className="bg-[#539e1b] text-white px-6 py-2 rounded-full font-bold">
                Zagraj ponownie
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
