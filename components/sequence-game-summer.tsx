"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useSeason } from "@/contexts/season-context"
import { useProgressTracking } from "@/hooks/use-progress-tracking"

interface SequenceItem {
  id: string
  image: string
  name: string
}

export default function SequenceGameSummer() {
  const { season } = useSeason()
  const { markGameCompleted } = useProgressTracking()

  const sequenceItems = useMemo(
    () => [
      { id: "watermelon", image: "/images/watermelon_summer.svg", name: "Watermelon" },
      { id: "strawberry", image: "/images/strawberry_summer.svg", name: "Strawberry" },
      { id: "sun", image: "/images/sun_summer.svg", name: "Sun" },
      { id: "icecream", image: "/images/icecream_summer.svg", name: "Ice Cream" },
    ],
    [],
  )

  const [currentSequence, setCurrentSequence] = useState<SequenceItem[]>([])
  const [playerSequence, setPlayerSequence] = useState<SequenceItem[]>([])
  const [isShowingSequence, setIsShowingSequence] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [showingIndex, setShowingIndex] = useState(-1)

  const generateSequence = useCallback(() => {
    const sequence: SequenceItem[] = []
    for (let i = 0; i < 4; i++) {
      const randomItem = sequenceItems[Math.floor(Math.random() * sequenceItems.length)]
      sequence.push(randomItem)
    }
    return sequence
  }, [sequenceItems])

  const startGame = useCallback(() => {
    const newSequence = generateSequence()
    setCurrentSequence(newSequence)
    setPlayerSequence([])
    setGameStarted(true)
    setGameWon(false)
    setCurrentStep(0)
    setIsShowingSequence(true)
    setShowingIndex(0)
  }, [generateSequence])

  useEffect(() => {
    if (isShowingSequence && showingIndex < currentSequence.length) {
      const timer = setTimeout(() => {
        if (showingIndex === currentSequence.length - 1) {
          setIsShowingSequence(false)
          setShowingIndex(-1)
        } else {
          setShowingIndex(showingIndex + 1)
        }
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isShowingSequence, showingIndex, currentSequence.length])

  const handleItemClick = useCallback(
    (item: SequenceItem) => {
      if (isShowingSequence || gameWon) return

      const newPlayerSequence = [...playerSequence, item]
      setPlayerSequence(newPlayerSequence)

      if (item.id !== currentSequence[playerSequence.length].id) {
        // Wrong item clicked - restart
        setTimeout(() => {
          startGame()
        }, 1000)
        return
      }

      if (newPlayerSequence.length === currentSequence.length) {
        // Sequence completed successfully
        setGameWon(true)
        markGameCompleted("sequence-game-summer")
      }
    },
    [isShowingSequence, gameWon, playerSequence, currentSequence, startGame, markGameCompleted],
  )

  const resetGame = useCallback(() => {
    setCurrentSequence([])
    setPlayerSequence([])
    setGameStarted(false)
    setGameWon(false)
    setCurrentStep(0)
    setIsShowingSequence(false)
    setShowingIndex(-1)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-green-200 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => window.history.back()} className="p-2">
            <img src="/images/menu_summer.svg" alt="Menu" className="w-10 h-10" />
          </button>

          <div className="relative">
            <img src="/images/title_box_small_summer.svg" alt="Title" className="h-12" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h1 className="text-lg font-bold text-white">Sequence Game</h1>
            </div>
          </div>

          <button className="p-2">
            <img src="/images/sound_summer.svg" alt="Sound" className="w-10 h-10" />
          </button>
        </div>

        {/* Game Area */}
        <div className="bg-white rounded-lg p-6 shadow-lg">
          {!gameStarted ? (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Remember the Sequence!</h2>
              <p className="text-gray-600 mb-6">
                Watch the sequence and repeat it by clicking the items in the same order.
              </p>
              <button
                onClick={startGame}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-xl"
              >
                Start Game
              </button>
            </div>
          ) : (
            <>
              {/* Sequence Display */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4 text-center">
                  {isShowingSequence ? "Watch the sequence!" : gameWon ? "Well done!" : "Your turn!"}
                </h3>
                <div className="flex justify-center gap-4 mb-6">
                  {currentSequence.map((item, index) => (
                    <div
                      key={index}
                      className={`w-20 h-20 rounded-lg border-4 flex items-center justify-center transition-all duration-300 ${
                        showingIndex === index
                          ? "border-yellow-400 bg-yellow-100 scale-110"
                          : playerSequence[index]
                            ? "border-green-400 bg-green-100"
                            : "border-gray-300 bg-gray-100"
                      }`}
                    >
                      {(showingIndex >= index || playerSequence[index]) && (
                        <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-12 h-12" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Item Selection */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {sequenceItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    disabled={isShowingSequence || gameWon}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      isShowingSequence || gameWon
                        ? "border-gray-300 bg-gray-100 cursor-not-allowed opacity-50"
                        : "border-blue-300 bg-white hover:border-blue-500 hover:bg-blue-50 cursor-pointer"
                    }`}
                  >
                    <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-16 h-16 mx-auto mb-2" />
                    <p className="text-sm font-medium">{item.name}</p>
                  </button>
                ))}
              </div>

              {/* Game Controls */}
              <div className="text-center">
                {gameWon ? (
                  <div>
                    <p className="text-green-600 font-bold text-xl mb-4">Congratulations! You got it right!</p>
                    <button
                      onClick={startGame}
                      className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg mr-4"
                    >
                      Play Again
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={resetGame}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg"
                  >
                    Reset Game
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
