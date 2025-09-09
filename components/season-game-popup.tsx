"use client"

import { useState } from "react"
import Image from "next/image"
import { useSeason } from "@/contexts/season-context"

// Game module mapping for consistent display
const gameModuleMapping: Record<string, { module: string, task: string, polishName: string }> = {
  "matching": { module: "MODUŁ 1", task: "ZADANIE 1", polishName: "Ułóż tak samo" },
  "sequence": { module: "MODUŁ 1", task: "ZADANIE 2", polishName: "Co pasuje? Uzupełnij" },
  "butterfly-pairs": { module: "MODUŁ 1", task: "ZADANIE 3", polishName: "Znajdź pary" },
  "odd-one-out": { module: "MODUŁ 2", task: "ZADANIE 1", polishName: "Wybierz, co nie pasuje" },
  "puzzle": { module: "MODUŁ 2", task: "ZADANIE 2", polishName: "Ułóż obrazek" },
  "connect": { module: "MODUŁ 2", task: "ZADANIE 3", polishName: "Połącz" },
  "sorting": { module: "MODUŁ 3", task: "ZADANIE 1", polishName: "Ułóż dalej" },
  "category-sorting": { module: "MODUŁ 3", task: "ZADANIE 2", polishName: "Podziel obrazki" },
  "memory": { module: "MODUŁ 3", task: "ZADANIE 3", polishName: "Znajdź pary (Pamięć)" },
  "spot-difference": { module: "MODUŁ 4", task: "ZADANIE 1", polishName: "Znajdź 3 różnice" },
  "easter-basket": { module: "MODUŁ 4", task: "ZADANIE 2", polishName: "Wybierz, co nie pasuje do koszyczka" },
  "easter-sequence": { module: "MODUŁ 4", task: "ZADANIE 3", polishName: "Co pasuje? Uzupełnij. Wielkanoc" },
  "maze": { module: "MODUŁ 5", task: "ZADANIE 1", polishName: "Znajdź drogę do gniazda" },
  "sorting-2": { module: "MODUŁ 5", task: "ZADANIE 2", polishName: "Ułóż dalej 2" },
  "memory-5": { module: "MODUŁ 5", task: "ZADANIE 3", polishName: "Znajdź pary 5" },
  "memory-3": { module: "MODUŁ 6", task: "ZADANIE 1", polishName: "Znajdź pary 3" },
  "puzzle-assembly-2": { module: "MODUŁ 6", task: "ZADANIE 2", polishName: "Ułóż obrazek - farma" },
  "spot-difference-5": { module: "MODUŁ 6", task: "ZADANIE 3", polishName: "Znajdź 5 różnic" },
  "memory-7": { module: "MODUŁ 7", task: "ZADANIE 1", polishName: "Znajdź pary 7" },
  "category-sorting-3": { module: "MODUŁ 7", task: "ZADANIE 2", polishName: "Podziel obrazki 3" },
  "sequence-2": { module: "MODUŁ 7", task: "ZADANIE 3", polishName: "Co pasuje? Uzupełnij 2" },
  "find-missing": { module: "MODUŁ 8", task: "ZADANIE 1", polishName: "Zaznacz to, czego brakuje na obrazku" },
  "sequential-order-2": { module: "MODUŁ 8", task: "ZADANIE 2", polishName: "Ułóż po kolei 2" },
  "memory-4": { module: "MODUŁ 8", task: "ZADANIE 3", polishName: "Znajdź pary 4" },
  "memory-match": { module: "MODUŁ 9", task: "ZADANIE 1", polishName: "Zapamiętaj i ułóż tak samo" },
  "maze-3": { module: "MODUŁ 9", task: "ZADANIE 2", polishName: "Znajdź drogę do kwiatka" },
  "find-missing-half": { module: "MODUŁ 9", task: "ZADANIE 3", polishName: "Znajdź brakującą połowę" },
  "find-flipped-rabbit": { module: "MODUŁ 10", task: "ZADANIE 1", polishName: "Znajdź odwróconego króliczka" },
  "branch-sequence": { module: "MODUŁ 10", task: "ZADANIE 2", polishName: "Dokończ układanie" },
  "find-6-differences": { module: "MODUŁ 10", task: "ZADANIE 3", polishName: "Znajdź 6 różnic" },
  "birds-puzzle": { module: "MODUŁ 11", task: "ZADANIE 1", polishName: "Ułóż obrazek - ptaki" },
  "memory-match-2x4": { module: "MODUŁ 11", task: "ZADANIE 2", polishName: "Zapamiętaj i ułóż tak samo 2x4" },
  "sudoku": { module: "MODUŁ 11", task: "ZADANIE 3", polishName: "Uzupełnij sudoku" },
  "pattern-completion": { module: "MODUŁ 12", task: "ZADANIE 1", polishName: "Co pasuje? Uzupełnij - wzór" },
  "find-incorrect-ladybug": { module: "MODUŁ 12", task: "ZADANIE 2", polishName: "Znajdź nieprawidłową biedronkę" },
  "sequential-order-3": { module: "MODUŁ 12", task: "ZADANIE 3", polishName: "Ułóż po kolei" },
}

interface SeasonGamePopupProps {
  isOpen: boolean
  onClose: () => void
  season: {
    id: string
    name: string
    color: string
    bgColor: string
    borderColor: string
    icon: string
    description: string
  }
  games: Array<{
    id: string
    name: string
  }>
  completedGames: string[]
  gameCompletionCounts: Record<string, number>
  onGameSelect: (gameId: string, gameIndex: number) => void
  onContinueGame: () => void
  nextGameAfterCompleted?: {
    id: string
    name: string
    index: number
  }
}

export default function SeasonGamePopup({
  isOpen,
  onClose,
  season,
  games,
  completedGames,
  gameCompletionCounts,
  onGameSelect,
  onContinueGame,
  nextGameAfterCompleted
}: SeasonGamePopupProps) {
  

  const { selectedSeason } = useSeason()

  if (!isOpen) return null

  // Get medal suffix for this season
  const getMedalSuffix = (seasonId: string) => {
    switch (seasonId) {
      case "lato": return "_summer"
      case "jesien": return "_autumn"
      case "zima": return "_winter"
      default: return "" // spring has no suffix
    }
  }

  const medalSuffix = getMedalSuffix(season.id)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`relative max-w-4xl w-full max-h-[90vh] overflow-y-auto ${season.bgColor} border-4 ${season.borderColor} rounded-3xl p-6`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <span className="text-4xl">{season.icon}</span>
            <div>
              <h2 
                className="text-3xl font-sour-gummy font-bold" 
                style={{ color: season.color }}
              >
                {season.name}
              </h2>
              <p className="text-lg font-sour-gummy text-gray-700">
                {season.description}
              </p>
            </div>
          </div>
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="w-12 h-12 bg-gray-500 hover:bg-gray-600 text-white rounded-full flex items-center justify-center text-2xl font-bold transition-colors"
          >
            ×
          </button>
        </div>

        {/* Continue Game Button */}
        {nextGameAfterCompleted && (
          <div className="mb-6 text-center flex flex-col items-center">
            <div className="relative w-48 h-12 cursor-pointer hover:scale-105 transition-transform" onClick={onContinueGame}>
              <Image src="/images/button_default.svg" alt="Continue button background" fill className="object-contain" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-sour-gummy font-bold text-2xl" style={{ color: '#3E459C' }}>GRAJ DALEJ</span>
              </div>
            </div>
          </div>
        )}

        {/* Medals Row */}
        <div className="mb-6">
          <h3 className="text-lg font-sour-gummy font-bold mb-3" style={{ color: '#3E459C' }}>
            Medale do zdobycia:
          </h3>
          <div className="flex flex-wrap gap-3">
            {Array.from({ length: 12 }).map((_, medalIndex) => {
              const medalNumber = medalIndex + 1
              const gameIndexForMedal = medalIndex * 3 + 2 // 3rd, 6th, 9th, etc. game (0-indexed)
              const isEarned = gameIndexForMedal < games.length && completedGames.includes(games[gameIndexForMedal].id)
              const medalNumberPadded = medalNumber.toString().padStart(2, '0')
              
              return (
                <div key={medalIndex} className="relative w-12 h-12">
                  <Image 
                    src={`/images/medal_${medalNumberPadded}${medalSuffix}.svg`}
                    alt={`Medal ${medalNumber}`}
                    fill
                    className={`object-contain ${!isEarned ? 'opacity-40 grayscale' : ''}`}
                  />
                  {!isEarned && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-xs font-bold text-gray-500">🔒</div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Games List */}
        <div className="space-y-3">
          {games.map((game, gameIndex) => {
            const isCompleted = completedGames.includes(game.id)
            const isNextGame = nextGameAfterCompleted?.id === game.id
            const isClickable = isCompleted || isNextGame // Only completed games and next game are clickable
            
            // Debug logging
            if (gameIndex === 0) {
              console.log(`Game ${game.id}: isCompleted=${isCompleted}, isNextGame=${isNextGame}, isClickable=${isClickable}`)
              console.log('nextGameAfterCompleted:', nextGameAfterCompleted)
              console.log('completedGames:', completedGames)
            }
            
            // Calculate className step by step to avoid long template literals
            const baseClasses = "relative p-4 rounded-2xl border-2 transition-all duration-200"
            const clickableClasses = isClickable 
              ? "cursor-pointer hover:scale-105 hover:shadow-lg" 
              : "cursor-not-allowed opacity-50"
            const statusClasses = isCompleted 
              ? "bg-green-50 border-green-300 hover:bg-green-100" 
              : isNextGame 
                ? "bg-yellow-50 border-yellow-400 hover:bg-yellow-100 ring-2 ring-yellow-500" 
                : "bg-gray-100 border-gray-300"

            return (
              <div
                key={game.id}
                onClick={isClickable ? () => onGameSelect(game.id, gameIndex) : undefined}
                className={`${baseClasses} ${clickableClasses} ${statusClasses}`}
              >
                  {/* Game Info */}
                  <div className="flex items-center gap-3">
                    <div className="text-2xl flex-shrink-0">
                      {isCompleted ? '✅' : isNextGame ? '▶️' : '🔒'}
                    </div>
                    <div className="flex-1 min-w-0">
                      {(() => {
                        const mapping = gameModuleMapping[game.id]
                        if (mapping) {
                          return (
                            <>
                              <h3 className={`font-sour-gummy font-bold text-lg truncate ${isClickable ? 'text-gray-800' : 'text-gray-500'}`}>
                                {mapping.module} {mapping.task}
                              </h3>
                            </>
                          )
                        } else {
                          return (
                            <h3 className={`font-sour-gummy font-bold text-lg truncate ${isClickable ? 'text-gray-800' : 'text-gray-500'}`}>
                              {game.name}
                            </h3>
                          )
                        }
                      })()}
                      <div className="flex items-center justify-between mt-1">
                        <div className="text-sm font-sour-gummy">
                          {isNextGame ? (
                            <span className="text-yellow-700 font-bold">
                              Następna gra
                            </span>
                          ) : !isCompleted ? (
                            <span className="text-gray-500">
                              Zablokowana
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Current game indicator */}
                  {isNextGame && (
                    <div className="absolute top-2 right-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                    </div>
                  )}

                  {/* Locked indicator */}
                  {!isClickable && !isNextGame && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-75 rounded-2xl">
                      <span className="text-gray-500 font-sour-gummy text-sm">Ukończ poprzednie gry</span>
                    </div>
                  )}
                </div>
            )
          })}
        </div>

        {/* Progress Summary */}
        <div className="mt-6 p-4 bg-white bg-opacity-50 rounded-2xl">
          <div className="flex items-center justify-between">
            <div className="font-sour-gummy">
              <span className="text-lg font-bold" style={{ color: season.color }}>
                Postęp w sezonie {season.name}:
              </span>
              <div className="text-sm text-gray-600 mt-1">
                {completedGames.filter(gameId => games.some(g => g.id === gameId)).length} / 36 gier ukończonych
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold" style={{ color: season.color }}>
                {Math.floor(completedGames.filter(gameId => games.some(g => g.id === gameId)).length / 3)} 🏅
              </div>
              <div className="text-sm font-sour-gummy text-gray-600">
                medali zdobytych
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-4 text-center">
          <p className="text-sm font-sour-gummy text-gray-600">
            Możesz grać ponownie w ukończone gry lub przejść do następnej nowej gry • Użyj "GRAJ DALEJ" aby kontynuować
          </p>
        </div>
      </div>
    </div>
  )
}