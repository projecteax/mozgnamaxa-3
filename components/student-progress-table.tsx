"use client"

import { useState } from "react"

interface StudentProgressTableProps {
  studentName: string
  progress: any
  onBack: () => void
}

// Game name mapping from database game IDs to title box names
const gameNames: Record<string, string> = {
  // Special case: matching-game uses kebab-case
  "matching-game": "UŁÓŻ TAK SAMO.",
  "matching-game-summer": "UŁÓŻ TAK SAMO.",
  "matching-game-autumn": "UŁÓŻ TAK SAMO.",
  "matching-game-winter": "UŁÓŻ TAK SAMO.",
  // Special case: sequence-game uses kebab-case
  "sequence-game": "CO PASUJE? UZUPEŁNIJ.",
  "sequence-game-2": "UŁÓŻ PO KOLEI.",
  // All other games use camelCase
  "butterflyPairs": "ZNAJDŹ PARY.",
  "oddOneOut": "WYBIERZ, CO NIE PASUJE.",
  "puzzleGame": "UŁÓŻ OBRAZEK.",
  "connectGame": "POŁĄCZ.",
  "sortingGame": "UŁÓŻ DALEJ.",
  "sortingGame2": "UŁÓŻ DALEJ.",
  "sortingGame3": "UŁÓŻ DALEJ 3.",
  "sortingGame4": "UŁÓŻ DALEJ 4.",
  "categorySorting": "PODZIEL OBRAZKI.",
  "categorySorting2": "PODZIEL OBRAZKI.",
  "categorySorting3": "PODZIEL OBRAZKI.",
  "categorySorting4": "PODZIEL OBRAZKI.",
  "memoryGame": "ZNAJDŹ PARY.",
  "memoryGame2": "ZNAJDŹ PARY.",
  "memoryGame3": "ZNAJDŹ PARY",
  "memoryGame4": "ZNAJDŹ PARY.",
  "memoryGame5": "ZNAJDŹ PARY.",
  "memoryGame6": "ZNAJDŹ PARY.",
  "memoryGame7": "ZNAJDŹ PARY.",
  "memoryMatch": "ZAPAMIĘTAJ I UŁÓŻ TAK SAMO.",
  "memoryMatch2x4": "ZAPAMIĘTAJ I UŁÓŻ TAK SAMO.",
  "spotDifference": "ZNAJDŹ RÓŻNICE.",
  "spotDifference5": "ZNAJDŹ RÓŻNICE.",
  "easterBasket": "WYBIERZ, CO NIE PASUJE DO KOSZYCZKA.",
  "easterBasket2": "WYBIERZ, CO NIE PASUJE DO KOSZYCZKA.",
  "easterSequence": "CO PASUJE? UZUPEŁNIJ. WIELKANOC.",
  "mazeGame": "ZNAJDŹ DROGĘ DO GNIAZDA.",
  "mazeGame2": "ZNAJDŹ DROGĘ DO GNIAZDA.",
  "mazeGame3": "ZNAJDŹ DROGĘ DO KWIATKA.",
  "mazeGame4": "ZNAJDŹ DROGĘ DO GNIAZDA.",
  "findMissing": "ZAZNACZ TO, CZEGO BRAKUJE NA OBRAZKU.",
  "findMissingHalf": "ZNAJDŹ BRAKUJĄCĄ POŁOWĘ.",
  "findFlippedRabbit": "ZNAJDŹ ODWRÓCONEGO KRÓLICZKA.",
  "branchSequence": "DOKOŃCZ UKŁADANIE.",
  "find6Differences": "ZNAJDŹ 6 RÓŻNIC.",
  "birdsPuzzle": "UŁÓŻ OBRAZEK.",
  "sequentialOrder": "UŁÓŻ PO KOLEI.",
  "sequentialOrder2": "UŁÓŻ PO KOLEI.",
  "sequentialOrder3": "UŁÓŻ PO KOLEI.",
  "puzzleAssembly2": "UŁÓŻ OBRAZEK.",
  "sudokuGame": "UZUPEŁNIJ SUDOKU.",
  "patternCompletion": "CO PASUJE? UZUPEŁNIJ.",
  "findIncorrectLadybug": "ZNAJDŹ NIEPRAWIDŁOWĄ BIEDRONKĘ.",
}

export default function StudentProgressTable({ studentName, progress, onBack }: StudentProgressTableProps) {
  const [sortBy, setSortBy] = useState<"name" | "completions">("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const handleSort = (column: "name" | "completions") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("asc")
    }
  }



  // Extract game results from the new flat structure
  const gameResults = progress?.gameResults || {}
  const seasons = ['wiosna', 'lato', 'jesien', 'zima']
  
  console.log('Raw progress data:', progress)
  console.log('Game results:', gameResults)
  console.log('Progress type:', typeof progress)
  console.log('Progress keys:', progress ? Object.keys(progress) : 'null')
  if (progress && progress.gameResults) {
    console.log('Game results keys:', Object.keys(progress.gameResults))
    Object.entries(progress.gameResults).forEach(([gameKey, gameData]) => {
      console.log(`${gameKey}:`, gameData)
    })
  }
  
  // Function to get display name for a game ID (extract base game ID from gameId-season format)
  const getDisplayName = (gameKey: string): string => {
    // Extract the base game ID from the gameId-englishSeason format
    const parts = gameKey.split('-')
    const englishSeasons = ['spring', 'summer', 'autumn', 'winter']
    const lastPart = parts[parts.length - 1]
    
    let baseGameId = gameKey
    if (englishSeasons.includes(lastPart)) {
      // Remove the English season suffix
      baseGameId = parts.slice(0, -1).join('-')
    }
    
    const gameIdMap: Record<string, string> = {
      // Exact mappings based on menu order and titles
      'matching-game': 'Ułóż tak samo',
      'sequence-game': 'Co pasuje? Uzupełnij',
      'butterfly-pairs-game': 'Znajdź pary',
      'odd-one-out-game': 'Wybierz, co nie pasuje',
      'puzzle-game': 'Ułóż obrazek',
      'connect-game': 'Połącz',
      'sorting-game': 'Ułóż dalej',
      'category-sorting-game': 'Podziel obrazki',
      'memory-game': 'Znajdź pary (Pamięć)',
      'spot-difference-game': 'Znajdź 3 różnice',
      'spot-differences-game': 'Znajdź 3 różnice',
      'easter-basket-game': 'Wybierz, co nie pasuje do koszyczka',
      'easter-sequence-game': 'Co pasuje? Uzupełnij. Wielkanoc',
      'maze-game': 'Znajdź drogę do gniazda',
      'sorting-game-2': 'Ułóż dalej 2',
      'memory-game-5': 'Znajdź pary 5',
      'memory-game-3': 'Znajdź pary 3',
      'puzzle-assembly-game-2': 'Ułóż obrazek - farma',
      'spot-difference-game-5': 'Znajdź 5 różnic',
      'spot-differences-game-2': 'Znajdź 5 różnic',
      'memory-game-7': 'Znajdź pary 7',
      'category-sorting-game-3': 'Podziel obrazki 3',
      'sequence-game-2': 'Co pasuje? Uzupełnij 2',
      'find-missing-game': 'Zaznacz to, czego brakuje na obrazku',
      'sequential-order-game-2': 'Ułóż po kolei 2',
      'memory-game-4': 'Znajdź pary 4',
      'memory-match-game': 'Zapamiętaj i ułóż tak samo',
      'maze-game-3': 'Znajdź drogę do kwiatka',
      'find-missing-half-game': 'Znajdź brakującą połowę',
      'find-flipped-rabbit-game': 'Znajdź odwróconego króliczka',
      'branch-sequence-game': 'Dokończ układanie',
      'find-6-differences-game': 'Znajdź 6 różnic',
      'birds-puzzle-game': 'Ułóż obrazek - ptaki',
      'memory-match-game-2x4': 'Zapamiętaj i ułóż tak samo 2x4',
      'sudoku-game': 'Uzupełnij sudoku',
      'pattern-completion-game': 'Co pasuje? Uzupełnij - wzór',
      'find-incorrect-ladybug-game': 'Znajdź nieprawidłową biedronkę',
      'sequential-order-game-3': 'Ułóż po kolei',
      'sorting-game-3': 'Ułóż dalej 3',
      'sorting-game-4': 'Ułóż dalej 4',
      'category-sorting-game-2': 'Podziel obrazki 2',
      'category-sorting-game-4': 'Podziel obrazki 4',
      'memory-game-2': 'Znajdź pary 2',
      'memory-game-6': 'Znajdź pary 6',
      'maze-game-2': 'Znajdź drogę do gniazda 2',
      'maze-game-4': 'Znajdź drogę do gniazda 4',
      'easter-basket-game-2': 'Wybierz, co nie pasuje do koszyczka 2',
      'sequential-order-game': 'Ułóż po kolei',
    }
    
    return gameIdMap[baseGameId] || baseGameId
  }

  // Create a map to aggregate data by display name
  const aggregatedGames = new Map<string, { name: string, technicalName: string, seasons: Record<string, number> }>()
  
  // Process the new flat structure: gameResults -> gameId-englishSeason -> completed
  Object.entries(gameResults).forEach(([gameKey, gameData]: [string, any]) => {
    // Extract English season from the game key (last part after the last dash)
    const parts = gameKey.split('-')
    const englishSeason = parts[parts.length - 1] // e.g., "butterfly-pairs-game-spring" -> "spring"
    const baseGameId = parts.slice(0, -1).join('-') // e.g., "butterfly-pairs-game-spring" -> "butterfly-pairs-game"
    
    // Convert English season back to Polish for display
    const seasonMap: Record<string, string> = {
      'spring': 'wiosna',
      'summer': 'lato',
      'autumn': 'jesien',
      'winter': 'zima'
    }
    const polishSeason = seasonMap[englishSeason] || englishSeason
    
    const displayName = getDisplayName(gameKey)
    console.log(`Processing game: ${gameKey} -> baseGameId: ${baseGameId} -> displayName: ${displayName} (season: ${polishSeason})`)
    
    // Debug: Log if we get a raw game ID instead of a display name
    if (displayName === baseGameId) {
      console.log(`⚠️ WARNING: No mapping found for ${baseGameId} from ${gameKey}`)
    }
    
    if (!aggregatedGames.has(displayName)) {
      aggregatedGames.set(displayName, {
        name: displayName,
        technicalName: baseGameId,
        seasons: { wiosna: 0, lato: 0, jesien: 0, zima: 0 }
      })
    }
    const game = aggregatedGames.get(displayName)!
    game.seasons[polishSeason] += gameData.completed || 0
    console.log(`Added ${gameData.completed || 0} completions for ${displayName} in ${polishSeason}`)
  })
  
  // Debug: Log all game keys to see what's missing
  console.log('All game keys in database:', Object.keys(gameResults))
  console.log('All game keys sorted:', Object.keys(gameResults).sort())
  console.log('Total number of game keys:', Object.keys(gameResults).length)
  
  // Debug: Show which games are being processed vs which are missing
  const processedGames = new Set<string>()
  Object.entries(gameResults).forEach(([gameKey, gameData]: [string, any]) => {
    const parts = gameKey.split('-')
    const baseGameId = parts.slice(0, -1).join('-')
    processedGames.add(baseGameId)
  })
  console.log('Processed base game IDs:', Array.from(processedGames).sort())
  
  // Check which games are missing from gameIdMap
  const gameIdMapKeys = [
    'matching-game', 'sequence-game', 'sequence-game-2', 'butterfly-pairs-game', 'odd-one-out-game',
    'puzzle-game', 'connect-game', 'sorting-game', 'sorting-game-2', 'sorting-game-3', 'sorting-game-4',
    'category-sorting-game', 'category-sorting-game-2', 'category-sorting-game-3', 'category-sorting-game-4',
    'memory-game', 'memory-game-2', 'memory-game-3', 'memory-game-4', 'memory-game-5', 'memory-game-6', 'memory-game-7',
    'memory-match-game', 'memory-match-game-2x4', 'spot-difference-game', 'spot-difference-game-5',
    'spot-differences-game', 'spot-differences-game-2', 'easter-basket-game', 'easter-basket-game-2',
    'easter-sequence-game', 'maze-game', 'maze-game-2', 'maze-game-3', 'maze-game-4', 'find-missing-game',
    'find-missing-half-game', 'find-flipped-rabbit-game', 'find-incorrect-ladybug-game', 'branch-sequence-game',
    'find-6-differences-game', 'birds-puzzle-game', 'sequential-order-game', 'sequential-order-game-2',
    'sequential-order-game-3', 'puzzle-assembly-game-2', 'sudoku-game', 'pattern-completion-game'
  ]
  const missingGames = Array.from(processedGames).filter(gameId => !gameIdMapKeys.includes(gameId))
  console.log('Missing games from gameIdMap:', missingGames)

  console.log('Aggregated games:', Array.from(aggregatedGames.entries()).map(([name, game]) => ({ name, total: Object.values(game.seasons).reduce((sum: number, count: number) => sum + count, 0) })))
  
  const sortedGames = Array.from(aggregatedGames.entries())
    .map(([displayName, game]) => ({
      id: displayName,
      name: game.name,
      technicalName: game.technicalName,
      seasons: game.seasons,
      totalCompletions: Object.values(game.seasons).reduce((sum: number, count: number) => sum + count, 0)
    }))
    .sort((a, b) => {
      if (sortBy === "name") {
        // Sort by menu order using display names
          const menuOrderNames = [
    "Ułóż tak samo", "Co pasuje? Uzupełnij", "Znajdź pary", "Wybierz, co nie pasuje",
    "Ułóż obrazek", "Połącz", "Ułóż dalej", "Podziel obrazki", "Znajdź pary (Pamięć)",
    "Znajdź 3 różnice", "Wybierz, co nie pasuje do koszyczka", "Co pasuje? Uzupełnij. Wielkanoc",
    "Znajdź drogę do gniazda", "Ułóż dalej 2", "Znajdź pary 5", "Znajdź pary 3",
    "Ułóż obrazek - farma", "Znajdź 5 różnic", "Znajdź pary 7", "Podziel obrazki 3",
    "Co pasuje? Uzupełnij 2", "Zaznacz to, czego brakuje na obrazku", "Ułóż po kolei 2",
    "Znajdź pary 4", "Zapamiętaj i ułóż tak samo", "Znajdź drogę do kwiatka",
    "Znajdź brakującą połowę", "Znajdź odwróconego króliczka", "Dokończ układanie",
    "Znajdź 6 różnic", "Ułóż obrazek - ptaki", "Zapamiętaj i ułóż tak samo 2x4",
    "Uzupełnij sudoku", "Co pasuje? Uzupełnij - wzór", "Znajdź nieprawidłową biedronkę",
    "Ułóż po kolei", "Ułóż dalej 3", "Ułóż dalej 4", "Podziel obrazki 2", "Podziel obrazki 4",
    "Znajdź pary 2", "Znajdź pary 6", "Znajdź drogę do gniazda 2", "Znajdź drogę do gniazda 4",
    "Wybierz, co nie pasuje do koszyczka 2", "Ułóż po kolei"
  ]
        const aIndex = menuOrderNames.indexOf(a.name)
        const bIndex = menuOrderNames.indexOf(b.name)
        if (aIndex === -1 && bIndex === -1) return 0
        if (aIndex === -1) return 1
        if (bIndex === -1) return -1
        return sortOrder === "asc" ? aIndex - bIndex : bIndex - aIndex
      } else {
        return sortOrder === "asc" ? a.totalCompletions - b.totalCompletions : b.totalCompletions - a.totalCompletions
      }
    })

  // Function to determine row highlight color based on completion seasons
  const getRowHighlightColor = (seasons: Record<string, number>) => {
    const completedSeasons = Object.entries(seasons).filter(([_, count]) => count > 0)
    
    if (completedSeasons.length === 0) return ""
    
    // Find the latest season with completion data (progression: wiosna -> lato -> jesien -> zima)
    const seasonOrder = ['wiosna', 'lato', 'jesien', 'zima']
    let latestSeason = 'wiosna'
    
    for (const season of seasonOrder) {
      if (seasons[season] > 0) {
        latestSeason = season
      }
    }
    
    const color = (() => {
      switch (latestSeason) {
        case 'wiosna': return 'bg-green-200'
        case 'lato': return 'bg-yellow-200'
        case 'jesien': return 'bg-orange-200'
        case 'zima': return 'bg-blue-200'
        default: return ''
      }
    })()
    console.log(`Row color for latest season ${latestSeason}: ${color}`)
    return color
  }

  const totalCompletions = sortedGames.reduce((sum, game) => sum + game.totalCompletions, 0)

  return (
    <div className="w-full max-w-4xl min-h-screen bg-[#e3f7ff] p-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-bold text-[#3e459c] font-dongle">Postępy ucznia: {studentName}</h2>
        <button
          onClick={onBack}
          className="px-6 py-3 bg-[#3e459c] hover:bg-[#2d3a8c] text-white rounded-full font-bold text-xl transition-colors font-dongle"
        >
          Powrót
        </button>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-3xl font-bold text-[#3e459c] font-dongle">Ukończone gry: {totalCompletions}</h3>
          <div className="text-sm text-gray-500">Kliknij nagłówek kolumny, aby sortować</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#e3f7ff] border-b-2 border-[#3e459c]/20">
                <th
                  className="py-3 px-4 text-left cursor-pointer font-dongle text-xl"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center">
                    Nazwa gry
                    {sortBy === "name" && <span className="ml-1">{sortOrder === "asc" ? "▲" : "▼"}</span>}
                  </div>
                </th>
                <th className="py-3 px-4 text-center font-dongle text-xl">Wiosna</th>
                <th className="py-3 px-4 text-center font-dongle text-xl">Lato</th>
                <th className="py-3 px-4 text-center font-dongle text-xl">Jesień</th>
                <th className="py-3 px-4 text-center font-dongle text-xl">Zima</th>
                <th
                  className="py-3 px-4 text-right cursor-pointer font-dongle text-xl"
                  onClick={() => handleSort("completions")}
                >
                  <div className="flex items-center justify-end">
                    Razem
                    {sortBy === "completions" && <span className="ml-1">{sortOrder === "asc" ? "▲" : "▼"}</span>}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedGames.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500 font-dongle text-xl">
                    Brak ukończonych gier
                  </td>
                </tr>
              ) : (
                sortedGames.map((game) => (
                  <tr 
                    key={game.id} 
                    className={`border-b border-[#3e459c]/10 hover:bg-[#e3f7ff]/50 transition-colors ${getRowHighlightColor(game.seasons)}`}
                  >
                    <td className="py-3 px-4 font-dongle text-xl">
                      <div>
                        <div className="font-bold">{game.name}</div>
                        <div className="text-sm text-gray-500 font-mono">{game.technicalName}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-bold font-dongle text-xl text-[#3e459c]">
                      {game.seasons.wiosna}
                    </td>
                    <td className="py-3 px-4 text-center font-bold font-dongle text-xl text-[#3e459c]">
                      {game.seasons.lato}
                    </td>
                    <td className="py-3 px-4 text-center font-bold font-dongle text-xl text-[#3e459c]">
                      {game.seasons.jesien}
                    </td>
                    <td className="py-3 px-4 text-center font-bold font-dongle text-xl text-[#3e459c]">
                      {game.seasons.zima}
                    </td>
                    <td className="py-3 px-4 text-right font-bold font-dongle text-xl text-[#3e459c]">
                      {game.totalCompletions}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
