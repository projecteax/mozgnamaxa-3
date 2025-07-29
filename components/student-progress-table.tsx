"use client"

import { useState } from "react"
import type { GameProgress } from "@/lib/progress-service"

interface StudentProgressTableProps {
  studentName: string
  progress: GameProgress
  onBack: () => void
}

// Game name mapping
const gameNames: Record<string, string> = {
  "butterfly-pairs": "Motyle pary",
  "category-sorting": "Sortowanie kategorii",
  "category-sorting-2": "Sortowanie kategorii 2",
  "category-sorting-3": "Sortowanie kategorii 3",
  "category-sorting-4": "Sortowanie kategorii 4",
  "connect-game": "Gra w połączenia",
  "easter-basket": "Koszyk wielkanocny",
  "easter-basket-2": "Koszyk wielkanocny 2",
  "easter-sequence": "Sekwencja wielkanocna",
  "find-missing": "Znajdź brakujące",
  "matching-game": "Gra w dopasowywanie",
  "maze-game": "Labirynt",
  "maze-game-2": "Labirynt 2",
  "maze-game-3": "Labirynt 3",
  "maze-game-4": "Labirynt 4",
  "memory-game": "Gra pamięciowa",
  "memory-game-2": "Gra pamięciowa 2",
  "memory-game-3": "Gra pamięciowa 3",
  "memory-game-4": "Gra pamięciowa 4",
  "memory-game-5": "Gra pamięciowa 5",
  "memory-game-6": "Gra pamięciowa 6",
  "memory-game-7": "Gra pamięciowa 7",
  "memory-match": "Dopasowywanie pamięciowe",
  "odd-one-out": "Znajdź niepasujący",
  "puzzle-game": "Układanka",
  "sequence-game": "Gra sekwencyjna",
  "sequence-game-2": "Gra sekwencyjna 2",
  "sequential-order": "Kolejność sekwencyjna",
  "sequential-order-2": "Kolejność sekwencyjna 2",
  "sorting-game": "Gra w sortowanie",
  "sorting-game-2": "Gra w sortowanie 2",
  "sorting-game-3": "Gra w sortowanie 3",
  "sorting-game-4": "Gra w sortowanie 4",
  "spot-difference": "Znajdź różnice",
  "spot-difference-5": "Znajdź różnice 5",
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

  const sortedGames = Object.entries(progress || {})
    .map(([gameId, completions]) => ({
      id: gameId,
      name: gameNames[gameId] || gameId,
      completions,
    }))
    .sort((a, b) => {
      if (sortBy === "name") {
        return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      } else {
        return sortOrder === "asc" ? a.completions - b.completions : b.completions - a.completions
      }
    })

  const totalCompletions = Object.values(progress || {}).reduce((sum, count) => sum + count, 0)

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
                <th
                  className="py-3 px-4 text-right cursor-pointer font-dongle text-xl"
                  onClick={() => handleSort("completions")}
                >
                  <div className="flex items-center justify-end">
                    Ukończenia
                    {sortBy === "completions" && <span className="ml-1">{sortOrder === "asc" ? "▲" : "▼"}</span>}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedGames.length === 0 ? (
                <tr>
                  <td colSpan={2} className="py-8 text-center text-gray-500 font-dongle text-xl">
                    Brak ukończonych gier
                  </td>
                </tr>
              ) : (
                sortedGames.map((game) => (
                  <tr key={game.id} className="border-b border-[#3e459c]/10 hover:bg-[#e3f7ff]/50 transition-colors">
                    <td className="py-3 px-4 font-dongle text-xl">{game.name}</td>
                    <td className="py-3 px-4 text-right font-bold font-dongle text-xl text-[#3e459c]">
                      {game.completions}
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
