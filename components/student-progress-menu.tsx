"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"
import { useSeason } from "@/contexts/season-context"
import { useStudentProgress } from "@/hooks/use-student-progress"
import SeasonGamePopup from "./season-game-popup"
import UserLogoutButton from "./user-logout-button"

interface StudentProgressMenuProps {
  onGameStart: (gameIndex: number) => void
  onMenuClick: () => void
}

// Game list in order - matches the gameOrder from page.tsx, 36 games per season = 144 total games
// 12 medals per season (medal after every 3rd game) = 48 total medals
// Using actual titles from the title boxes in games
// IDs match gameOrder from page.tsx which is what the progress system uses
const GAMES_LIST = [
  { id: "matching", name: "UŁÓŻ TAK SAMO." },
  { id: "sequence", name: "CO PASUJE? UZUPEŁNIJ." },
  { id: "butterfly-pairs", name: "ZNAJDŹ PARY." },
  { id: "odd-one-out", name: "WYBIERZ, CO NIE PASUJE." },
  { id: "puzzle", name: "UŁÓŻ OBRAZEK." },
  { id: "connect", name: "POŁĄCZ." },
  { id: "sorting", name: "UŁÓŻ DALEJ." },
  { id: "category-sorting", name: "PODZIEL OBRAZKI." },
  { id: "memory", name: "ZNAJDŹ PARY." },
  { id: "spot-difference", name: "ZNAJDŹ 3 RÓŻNICE." },
  { id: "easter-basket", name: "WYBIERZ, CO NIE PASUJE DO KOSZYCZKA." },
  { id: "easter-sequence", name: "CO PASUJE? UZUPEŁNIJ. WIELKANOC." },
  { id: "maze", name: "ZNAJDŹ DROGĘ DO GNIAZDA." },
  { id: "sorting-2", name: "UŁÓŻ DALEJ." },
  { id: "memory-5", name: "ZNAJDŹ PARY." },
  { id: "memory-3", name: "ZNAJDŹ PARY." },
  { id: "puzzle-assembly-2", name: "UŁÓŻ OBRAZEK - FARMA." },
  { id: "spot-difference-5", name: "ZNAJDŹ 5 RÓŻNIC." },
  { id: "memory-7", name: "ZNAJDŹ PARY." },
  { id: "category-sorting-3", name: "PODZIEL OBRAZKI." },
  { id: "sequence-2", name: "CO PASUJE? UZUPEŁNIJ." },
  { id: "find-missing", name: "ZAZNACZ TO, CZEGO BRAKUJE NA OBRAZKU." },
  { id: "sequential-order-2", name: "UŁÓŻ PO KOLEI." },
  { id: "memory-4", name: "ZNAJDŹ PARY." },
  { id: "memory-match", name: "ZAPAMIĘTAJ I UŁÓŻ TAK SAMO." },
  { id: "maze-3", name: "ZNAJDŹ DROGĘ DO KWIATKA." },
  { id: "find-missing-half", name: "ZNAJDŹ BRAKUJĄCĄ POŁOWĘ." },
  { id: "find-flipped-rabbit", name: "ZNAJDŹ ODWRÓCONEGO KRÓLICZKA." },
  { id: "branch-sequence", name: "DOKOŃCZ UKŁADANIE." },
  { id: "find-6-differences", name: "ZNAJDŹ 6 RÓŻNIC." },
  { id: "birds-puzzle", name: "UŁÓŻ OBRAZEK - PTAKI." },
  { id: "memory-match-2x4", name: "ZAPAMIĘTAJ I UŁÓŻ TAK SAMO." },
  { id: "sudoku", name: "SUDOKU - OBRAZKI." },
  { id: "pattern-completion", name: "UZUPEŁNIJ WZÓR." },
  { id: "find-incorrect-ladybug", name: "ZNAJDŹ BŁĘDNĄ BIEDRONKĘ." },
  { id: "sequential-order-3", name: "UŁÓŻ PO KOLEI." },
  // Remaining games from gameOrder
  { id: "memory-2", name: "ZNAJDŹ PARY." },
  { id: "memory-6", name: "ZNAJDŹ PARY." },
  { id: "sorting-3", name: "UŁÓŻ DALEJ." },
  { id: "sorting-4", name: "UŁÓŻ DALEJ." },
  { id: "sequential-order", name: "UŁÓŻ PO KOLEI." },
  { id: "category-sorting-2", name: "PODZIEL OBRAZKI." },
  { id: "category-sorting-4", name: "PODZIEL OBRAZKI." },
  { id: "easter-basket-2", name: "WYBIERZ, CO NIE PASUJE DO KOSZYCZKA." },
  { id: "maze-2", name: "ZNAJDŹ DROGĘ DO GNIAZDA." },
  { id: "maze-4", name: "ZNAJDŹ DROGĘ DO GNIAZDA." },
]

// Seasons mapping
const SEASONS = [
  { 
    id: "wiosna", 
    name: "WIOSNA", 
    color: "#539e1b", 
    bgColor: "bg-green-50",
    borderColor: "border-green-700",
    icon: "🌸",
    description: "Rozpocznij swoją przygodę!"
  },
  { 
    id: "lato", 
    name: "LATO", 
    color: "#ffc402", 
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-300",
    icon: "☀️",
    description: "Słoneczne wyzwania czekają!"
  },
  { 
    id: "jesien", 
    name: "JESIEŃ", 
    color: "#ed6b19", 
    bgColor: "bg-orange-50",
    borderColor: "border-orange-300",
    icon: "🍂",
    description: "Kolorowe zagadki jesieni!"
  },
  { 
    id: "zima", 
    name: "ZIMA", 
    color: "#00abc6", 
    bgColor: "bg-blue-50",
    borderColor: "border-blue-300",
    icon: "❄️",
    description: "Zimowe przygody!"
  }
]

export default function StudentProgressMenu({ onGameStart, onMenuClick }: StudentProgressMenuProps) {
  const { user } = useAuth()
  const { setSelectedSeason, getThemeColors } = useSeason()
  const { progress, loading } = useStudentProgress()
  
  // Popup state
  const [selectedSeasonPopup, setSelectedSeasonPopup] = useState<{
    season: typeof SEASONS[0]
    seasonIndex: number
  } | null>(null)

  // Use real progress data or fallback to empty array
  const completedGames = progress?.completedGames || []
  const gameCompletionCounts = progress?.gameCompletionCounts || {}

  // Calculate progress - 50 total games (all games in the order)
  const totalGames = 50 // Total number of games in the order
  const gamesPerSeason = 36
  const medalsPerSeason = 12 // medal every 3 games
  const completedCount = completedGames.length
  const medals = progress?.medals || Math.floor(completedCount / 3)
  const progressPercent = (completedCount / totalGames) * 100

  // Determine next game and season based on sequential progression
  const getNextGameInfo = () => {
    // Early return if progress is not available
    if (!progress) {
      return null
    }
    
    // Check each season in order (spring -> summer -> autumn -> winter)
    for (let seasonIndex = 0; seasonIndex < SEASONS.length; seasonIndex++) {
      const seasonId = SEASONS[seasonIndex].id as keyof typeof progress.seasonProgress
      const seasonCompletedGames = progress?.seasonProgress?.[seasonId]?.completedGames || []
      
      // If this season is not complete (less than 36 games), find the next game
      if (seasonCompletedGames.length < gamesPerSeason) {
        // Find which game number they should play next (0-35)
        const nextGameIndexInSeason = seasonCompletedGames.length
        
        // Make sure we don't go beyond 36 games
        if (nextGameIndexInSeason < gamesPerSeason && nextGameIndexInSeason < GAMES_LIST.length) {
          const nextGame = GAMES_LIST[nextGameIndexInSeason]
          
          return {
            gameIndex: nextGameIndexInSeason, // Local index for this season (0-35)
            seasonId: seasonId,
            gameName: nextGame.name,
            seasonIndex: seasonIndex
          }
        }
      }
    }
    
    // If all games in all seasons are completed, return null
    return null
  }

  const nextGameInfo = getNextGameInfo()
  const nextGameIndex = nextGameInfo?.gameIndex || 0

  // Helper function to get medal suffix based on season
  const getMedalSuffix = (seasonId: string) => {
    switch (seasonId) {
      case "lato": return "_summer"
      case "jesien": return "_autumn"
      case "zima": return "_winter"
      default: return "" // spring has no suffix
    }
  }

  // Check if season is unlocked - use real data if available
  const isSeasonUnlocked = (seasonIndex: number) => {
    if (progress?.unlockedSeasons) {
      return progress.unlockedSeasons.includes(SEASONS[seasonIndex].id)
    }
    // Fallback calculation - need to complete all games in previous season
    const gamesNeededForSeason = seasonIndex * gamesPerSeason
    return completedCount >= gamesNeededForSeason
  }

  const handleSeasonSelect = (seasonId: string, seasonIndex: number) => {
    if (!isSeasonUnlocked(seasonIndex)) return
    
    // Open popup for this season
    setSelectedSeasonPopup({
      season: SEASONS[seasonIndex],
      seasonIndex
    })
  }

  const handleGameSelectFromPopup = (gameId: string, gameIndex: number) => {
    if (!selectedSeasonPopup) return
    
    // For now, we use the same 36 games for each season, so gameIndex is correct
    // The season context is handled by setSelectedSeason
    setSelectedSeason(selectedSeasonPopup.season.id as any)
    onGameStart(gameIndex) // Use the gameIndex directly since it's 0-35 for each season
    setSelectedSeasonPopup(null)
  }

  const handleContinueFromPopup = () => {
    if (!selectedSeasonPopup) return
    
    const nextGameInSeason = getNextGameInSeason(selectedSeasonPopup.seasonIndex)
    if (nextGameInSeason) {
      setSelectedSeason(selectedSeasonPopup.season.id as any)
      // Use the local game index directly (0-35) since all seasons use the same 36 games
      onGameStart(nextGameInSeason.index)
    }
    setSelectedSeasonPopup(null)
  }

  const handleClosePopup = () => {
    setSelectedSeasonPopup(null)
  }

  // Find the next available game in the current season
  const getNextGameInSeason = (seasonIndex: number) => {
    // Early return if progress is not available
    if (!progress) {
      return undefined
    }
    
    // Get season-specific completed games
    const seasonId = SEASONS[seasonIndex].id as keyof typeof progress.seasonProgress
    const seasonCompletedGames = progress?.seasonProgress?.[seasonId]?.completedGames || []
    
    // Hardcode: Always return the first game if season has no completed games
    if (seasonCompletedGames.length === 0) {
      const firstGame = GAMES_LIST[0] // Always the first game in GAMES_LIST for any season
      console.log(`Returning first game for season ${seasonId}:`, firstGame)
      return {
        id: firstGame.id,
        name: firstGame.name,
        index: 0 // Always index 0 since we're using the same 36 games for each season
      }
    }
    
    // Find the first uncompleted game in this season - only check first 36 games
    for (let i = 0; i < gamesPerSeason && i < GAMES_LIST.length; i++) {
      const game = GAMES_LIST[i]
      if (game && !seasonCompletedGames.includes(game.id)) {
        return {
          id: game.id,
          name: game.name,
          index: i // This is the correct index (0-35) for the season
        }
      }
    }
    
    // If all games in this season are completed, return undefined
    return undefined
  }

  const handleContinueGame = () => {
    if (nextGameInfo) {
      // Set the season for the next game
      setSelectedSeason(nextGameInfo.seasonId as any)
      // Use the local game index directly (0-35) since all seasons use the same 36 games
      onGameStart(nextGameInfo.gameIndex)
    }
  }

  if (loading) {
    return (
      <div className="w-full max-w-6xl flex items-center justify-center min-h-[400px]">
        <div className="text-2xl font-sour-gummy text-gray-600">Ładowanie postępu...</div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-6xl">
      {/* Header */}
      <div className="w-full flex justify-between items-center mb-8">
        <div className="w-16 h-16"></div> {/* Empty space for balance */}
        <div className="text-center">
          <h1 className="text-4xl font-sour-gummy font-bold" style={{ color: '#3E459C' }}>
                          Witaj {(user?.displayName || user?.email?.split('@')[0] || 'Uczniu').toUpperCase()}!
          </h1>
          <p className="text-lg font-sour-gummy mt-2" style={{ color: '#3E459C' }}>
            {completedCount} / {totalGames} gier ukończonych • {medals} 🏅 medali zdobytych
          </p>
        </div>
        <div className="relative w-16 h-16">
          <UserLogoutButton onLogout={onMenuClick} />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-green-400 to-blue-500 h-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="text-center mt-2">
          <span className="text-sm font-sour-gummy" style={{ color: '#3E459C' }}>
            {progressPercent.toFixed(1)}% ukończone
          </span>
        </div>
      </div>

              {/* Continue Playing Button */}
        {nextGameInfo && (
          <div className="mb-8 text-center flex flex-col items-center">
            <div className="relative w-48 h-12 cursor-pointer hover:scale-105 transition-transform" onClick={handleContinueGame}>
              <Image src="/images/button_default.svg" alt="Continue button background" fill className="object-contain" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-sour-gummy font-bold text-2xl" style={{ color: '#3E459C' }}>GRAJ DALEJ</span>
              </div>
            </div>
            <p className="text-sm font-sour-gummy mt-2" style={{ color: '#3E459C' }}>
              Następna gra: {nextGameInfo.gameName}
            </p>
          </div>
        )}

      {/* Seasons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SEASONS.map((season, seasonIndex) => {
          const isUnlocked = isSeasonUnlocked(seasonIndex)
          const seasonStart = seasonIndex * gamesPerSeason
          const seasonEnd = (seasonIndex + 1) * gamesPerSeason
          const seasonGames = GAMES_LIST.slice(0, gamesPerSeason) // Each season has same 36 games
          // Use season-specific progress data
          const seasonKey = season.id as keyof typeof progress.seasonProgress
          const seasonData = progress?.seasonProgress?.[seasonKey]
          const seasonCompletedGames = seasonData?.completedGames?.length || 0
          const seasonTotal = gamesPerSeason
          const seasonProgress = (seasonCompletedGames / seasonTotal) * 100
          const medalSuffix = getMedalSuffix(season.id)
          const seasonMedals = seasonData?.medals || 0 // medals earned in this season

          return (
            <div
              key={season.id}
              className={`
                relative p-6 rounded-3xl border-4 transition-all duration-300 cursor-pointer
                ${isUnlocked 
                  ? `${season.bgColor} ${season.borderColor} hover:shadow-xl hover:scale-105` 
                  : 'bg-gray-100 border-gray-300 opacity-50 cursor-not-allowed'
                }
              `}
              onClick={() => isUnlocked && handleSeasonSelect(season.id, seasonIndex)}
            >
              {/* Lock overlay for locked seasons */}
              {!isUnlocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-80 rounded-3xl">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🔒</div>
                    <div className="font-sour-gummy text-gray-600">
                      Ukończ wszystkie gry w {SEASONS[seasonIndex - 1]?.name}
                    </div>
                  </div>
                </div>
              )}

              {/* Season Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{season.icon}</span>
                  <h3 
                    className="text-3xl font-sour-gummy font-bold" 
                    style={{ color: season.color }}
                  >
                    {season.name}
                  </h3>
                </div>
                {isUnlocked && seasonCompletedGames === seasonTotal && (
                  <div className="text-3xl">✅</div>
                )}
              </div>

              {/* Description */}
              <p className="text-lg font-sour-gummy mb-4" style={{ color: '#3E459C' }}>
                {season.description}
              </p>

              {/* Progress */}
              {isUnlocked && (
                <>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm font-sour-gummy mb-1" style={{ color: '#3E459C' }}>
                      <span>Postęp</span>
                      <span>{seasonCompletedGames} / {seasonTotal}</span>
                    </div>
                    <div className="bg-white rounded-full h-3 overflow-hidden">
                      <div 
                        className="h-full transition-all duration-500"
                        style={{ 
                          width: `${seasonProgress}%`,
                          backgroundColor: season.color
                        }}
                      />
                    </div>
                  </div>

                  {/* Medal Boxes Display */}
                  <div className="grid grid-cols-6 gap-3 mt-4">
                    {Array.from({ length: medalsPerSeason }).map((_, medalIndex) => {
                      const medalNumber = medalIndex + 1
                      const isEarned = medalIndex < seasonMedals
                      const medalNumberPadded = medalNumber.toString().padStart(2, '0')
                      
                      return (
                        <div key={medalIndex} className="relative w-12 h-12">
                          {/* White box background */}
                          <Image 
                            src="/images/white_box_medium.svg" 
                            alt="Medal box" 
                            fill 
                            className={`object-contain ${!isEarned ? 'opacity-40 grayscale' : ''}`}
                          />
                          {/* Medal image if earned */}
                          {isEarned && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="relative w-8 h-8">
                                <Image 
                                  src={`/images/medal_${medalNumberPadded}${medalSuffix}.svg`} 
                                  alt={`Medal ${medalNumber}`} 
                                  fill 
                                  className="object-contain" 
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* Medal indicator */}
                  <div className="mt-4 text-center">
                    <div className="text-sm font-sour-gummy" style={{ color: '#3E459C' }}>
                      Medale zdobyte: {seasonMedals} / {medalsPerSeason}
                    </div>
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>

      {/* All games completed */}
      {completedCount >= totalGames && (
        <div className="mt-8 text-center p-8 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-3xl border-4 border-yellow-400">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-4xl font-sour-gummy font-bold text-yellow-800 mb-2">
            Gratulacje!
          </h2>
          <p className="text-xl font-sour-gummy text-yellow-700">
            Ukończyłeś wszystkie 144 gry we wszystkich porach roku!
          </p>
          <div className="text-2xl mt-4">
            🏅 {medals} medali zdobytych (z 48 możliwych)!
          </div>
        </div>
      )}

      {/* Season Game Selection Popup */}
      {selectedSeasonPopup && progress && (
        <SeasonGamePopup
          isOpen={true}
          onClose={handleClosePopup}
          season={selectedSeasonPopup.season}
          games={GAMES_LIST} // All 36 games (same for each season)
          completedGames={progress?.seasonProgress?.[selectedSeasonPopup.season.id as keyof typeof progress.seasonProgress]?.completedGames || []}
          gameCompletionCounts={gameCompletionCounts}
          onGameSelect={handleGameSelectFromPopup}
          onContinueGame={handleContinueFromPopup}
          nextGameAfterCompleted={getNextGameInSeason(selectedSeasonPopup.seasonIndex)}
        />
      )}
    </div>
  )
}