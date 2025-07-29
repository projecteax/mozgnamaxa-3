"use client"

interface GameMenuProps {
  currentGame:
    | "matching"
    | "sequence"
    | "sequence-2"
    | "puzzle"
    | "butterfly-pairs"
    | "odd-one-out"
    | "connect"
    | "sorting"
    | "sorting-2"
    | "sorting-3"
    | "sorting-4"
    | "category-sorting"
    | "category-sorting-2"
    | "category-sorting-3"
    | "category-sorting-4"
    | "memory"
    | "memory-2"
    | "memory-3"
    | "memory-4"
    | "memory-5"
    | "memory-6"
    | "memory-7"
    | "memory-match"
    | "memory-match-2x4"
    | "sudoku"
    | "spot-difference"
    | "spot-difference-5"
    | "easter-basket"
    | "easter-basket-2"
    | "easter-sequence"
    | "maze"
    | "maze-2"
    | "maze-3"
    | "maze-4"
    | "find-missing"
    | "find-missing-half"
    | "find-flipped-rabbit"
    | "find-incorrect-ladybug"
    | "sequential-order-3"
    | "branch-sequence"
    | "find-6-differences"
    | "birds-puzzle"
    | "sequential-order"
    | "sequential-order-2"
    | "teacher-panel"
    | "student-panel"
    | "puzzle-assembly-2"
    | "pattern-completion"
  onSelectGame: (
    game:
      | "matching"
      | "sequence"
      | "sequence-2"
      | "puzzle"
      | "butterfly-pairs"
      | "odd-one-out"
      | "connect"
      | "sorting"
      | "sorting-2"
      | "sorting-3"
      | "sorting-4"
      | "category-sorting"
      | "category-sorting-2"
      | "category-sorting-3"
      | "category-sorting-4"
      | "memory"
      | "memory-2"
      | "memory-3"
      | "memory-4"
      | "memory-5"
      | "memory-6"
      | "memory-7"
      | "memory-match"
      | "memory-match-2x4"
      | "sudoku"
      | "spot-difference"
      | "spot-difference-5"
      | "easter-basket"
      | "easter-basket-2"
      | "easter-sequence"
      | "maze"
      | "maze-2"
      | "maze-3"
      | "maze-4"
      | "find-missing"
      | "find-missing-half"
      | "find-flipped-rabbit"
      | "find-incorrect-ladybug"
      | "sequential-order-3"
      | "branch-sequence"
      | "find-6-differences"
      | "birds-puzzle"
      | "sequential-order"
      | "sequential-order-2"
      | "teacher-panel"
      | "student-panel"
      | "puzzle-assembly-2"
      | "pattern-completion",
  ) => void
  onClose: () => void
}

export default function GameMenu({ currentGame, onSelectGame, onClose }: GameMenuProps) {
  return (
    <div className="absolute top-0 right-0 mt-20 mr-4 bg-white rounded-lg shadow-lg p-4 z-50">
      <div className="flex flex-col gap-2">
        <button
          className={`px-4 py-2 rounded-md font-dongle ${
            currentGame === "matching" ? "bg-[#539e1b] text-white" : "bg-gray-100 hover:bg-gray-200"
          }`}
          onClick={() => onSelectGame("matching")}
        >
          Ułóż tak samo
        </button>
        <button
          className={`px-4 py-2 rounded-md font-dongle ${
            currentGame === "sequence" ? "bg-[#539e1b] text-white" : "bg-gray-100 hover:bg-gray-200"
          }`}
          onClick={() => onSelectGame("sequence")}
        >
          Co pasuje? Uzupełnij
        </button>
        <button
          className={`px-4 py-2 rounded-md font-dongle ${
            currentGame === "butterfly-pairs" ? "bg-[#539e1b] text-white" : "bg-gray-100 hover:bg-gray-200"
          }`}
          onClick={() => onSelectGame("butterfly-pairs")}
        >
          Znajdź pary
        </button>
        <button
          className={`px-4 py-2 rounded-md font-dongle ${
            currentGame === "odd-one-out" ? "bg-[#539e1b] text-white" : "bg-gray-100 hover:bg-gray-200"
          }`}
          onClick={() => onSelectGame("odd-one-out")}
        >
          Wybierz, co nie pasuje
        </button>
        <button
          className={`px-4 py-2 rounded-md font-dongle ${
            currentGame === "puzzle" ? "bg-[#539e1b] text-white" : "bg-gray-100 hover:bg-gray-200"
          }`}
          onClick={() => onSelectGame("puzzle")}
        >
          Ułóż obrazek
        </button>
        <button
          className={`px-4 py-2 rounded-md font-dongle ${
            currentGame === "connect" ? "bg-[#539e1b] text-white" : "bg-gray-100 hover:bg-gray-200"
          }`}
          onClick={() => onSelectGame("connect")}
        >
          Połącz
        </button>
        <button
          className={`px-4 py-2 rounded-md font-dongle ${
            currentGame === "sorting" ? "bg-[#539e1b] text-white" : "bg-gray-100 hover:bg-gray-200"
          }`}
          onClick={() => onSelectGame("sorting")}
        >
          Ułóż dalej
        </button>
        <button
          className={`px-4 py-2 rounded-md font-dongle ${
            currentGame === "category-sorting" ? "bg-[#539e1b] text-white" : "bg-gray-100 hover:bg-gray-200"
          }`}
          onClick={() => onSelectGame("category-sorting")}
        >
          Podziel obrazki
        </button>
        <button
          className={`px-4 py-2 rounded-md font-dongle ${
            currentGame === "memory" ? "bg-[#539e1b] text-white" : "bg-gray-100 hover:bg-gray-200"
          }`}
          onClick={() => onSelectGame("memory")}
        >
          Znajdź pary (Pamięć)
        </button>
        <button
          className={`px-4 py-2 rounded-md font-dongle ${
            currentGame === "spot-difference" ? "bg-[#539e1b] text-white" : "bg-gray-100 hover:bg-gray-200"
          }`}
          onClick={() => onSelectGame("spot-difference")}
        >
          Znajdź 3 różnice
        </button>
        <button
          className={`px-4 py-2 rounded-md font-dongle ${
            currentGame === "easter-basket" ? "bg-[#539e1b] text-white" : "bg-gray-100 hover:bg-gray-200"
          }`}
          onClick={() => onSelectGame("easter-basket")}
        >
          Wybierz, co nie pasuje do koszyczka
        </button>
        <button
          className={`px-4 py-2 rounded-md font-dongle ${
            currentGame === "easter-sequence" ? "bg-[#539e1b] text-white" : "bg-gray-100 hover:bg-gray-200"
          }`}
          onClick={() => onSelectGame("easter-sequence")}
        >
          Co pasuje? Uzupełnij. Wielkanoc
        </button>
        <button
          className={`px-4 py-2 rounded-md font-dongle ${
            currentGame === "maze" ? "bg-[#539e1b] text-white" : "bg-gray-100 hover:bg-gray-200"
          }`}
          onClick={() => onSelectGame("maze")}
        >
          Znajdź drogę do gniazda
        </button>
        <button
          className={`px-4 py-2 rounded-md font-dongle ${
            currentGame === "sorting-2" ? "bg-[#539e1b] text-white" : "bg-gray-100 hover:bg-gray-200"
          }`}
          onClick={() => onSelectGame("sorting-2")}
        >
          Ułóż dalej 2
        </button>
        <button
          className={`px-4 py-2 rounded-md font-dongle ${
            currentGame === "memory-5" ? "bg-[#539e1b] text-white" : "bg-gray-100 hover:bg-gray-200"
          }`}
          onClick={() => onSelectGame("memory-5")}
        >
          Znajdź pary 5
        </button>
        <button
          className={`px-4 py-2 rounded-md font-dongle ${
            currentGame === "memory-3" ? "bg-[#539e1b] text-white" : "bg-gray-100 hover:bg-gray-200"
          }`}
          onClick={() => onSelectGame("memory-3")}
        >
          Znajdź pary 3
        </button>
        <button
          className={`px-4 py-2 rounded-md font-dongle ${
            currentGame === "puzzle-assembly-2" ? "bg-[#539e1b] text-white" : "bg-gray-100 hover:bg-gray-200"
          }`}
          onClick={() => onSelectGame("puzzle-assembly-2")}
        >
          Ułóż obrazek - farma
        </button>
        <button
          className={`px-4 py-2 rounded-md font-dongle ${
            currentGame === "spot-difference-5" ? "bg-[#539e1b] text-white" : "bg-gray-100 hover:bg-gray-200"
          }`}
          onClick={() => onSelectGame("spot-difference-5")}
        >
          Znajdź 5 różnic
        </button>
        <button
          className={`px-4 py-2 rounded-md font-dongle ${
            currentGame === "memory-7" ? "bg-[#539e1b] text-white" : "bg-gray-100 hover:bg-gray-200"
          }`}
          onClick={() => onSelectGame("memory-7")}
        >
          Znajdź pary 7
        </button>
        <button
          className={`px-4 py-2 rounded-md font-dongle ${
            currentGame === "category-sorting-3" ? "bg-[#539e1b] text-white" : "bg-gray-100 hover:bg-gray-200"
          }`}
          onClick={() => onSelectGame("category-sorting-3")}
        >
          Podziel obrazki 3
        </button>
        <button
          className={`px-4 py-2 rounded-md font-dongle ${
            currentGame === "sequence-2" ? "bg-[#539e1b] text-white" : "bg-gray-100 hover:bg-gray-200"
          }`}
          onClick={() => onSelectGame("sequence-2")}
        >
          Co pasuje? Uzupełnij 2
        </button>
        <button
          className={`px-4 py-2 rounded-md font-dongle ${
            currentGame === "find-missing" ? "bg-[#539e1b] text-white" : "bg-gray-100 hover:bg-gray-200"
          }`}
          onClick={() => onSelectGame("find-missing")}
        >
          Zaznacz to, czego brakuje na obrazku
        </button>
        <button
          className={`px-4 py-2 rounded-md font-dongle ${
            currentGame === "sequential-order-2" ? "bg-[#539e1b] text-white" : "bg-gray-100 hover:bg-gray-200"
          }`}
          onClick={() => onSelectGame("sequential-order-2")}
        >
          Ułóż po kolei 2
        </button>
        <button
          className={`px-4 py-2 rounded-md font-dongle ${
            currentGame === "memory-4" ? "bg-[#539e1b] text-white" : "bg-gray-100 hover:bg-gray-200"
          }`}
          onClick={() => onSelectGame("memory-4")}
        >
          Znajdź pary 4
        </button>
        <button
          className={`px-4 py-2 rounded-md font-dongle ${
            currentGame === "memory-match" ? "bg-[#539e1b] text-white" : "bg-gray-100 hover:bg-gray-200"
          }`}
          onClick={() => onSelectGame("memory-match")}
        >
          Zapamiętaj i ułóż tak samo
        </button>
        <button
          className={`px-4 py-2 rounded-md font-dongle ${
            currentGame === "maze-3" ? "bg-[#539e1b] text-white" : "bg-gray-100 hover:bg-gray-200"
          }`}
          onClick={() => onSelectGame("maze-3")}
        >
          Znajdź drogę do kwiatka
        </button>
        <button
          className={`px-4 py-2 rounded-md font-dongle ${
            currentGame === "find-missing-half" ? "bg-[#539e1b] text-white" : "bg-gray-100 hover:bg-gray-200"
          }`}
          onClick={() => onSelectGame("find-missing-half")}
        >
          Znajdź brakującą połowę
        </button>
        <button
          className={`px-4 py-2 rounded-md font-dongle ${
            currentGame === "find-flipped-rabbit" ? "bg-[#539e1b] text-white" : "bg-gray-100 hover:bg-gray-200"
          }`}
          onClick={() => onSelectGame("find-flipped-rabbit")}
        >
          Znajdź odwróconego króliczka
        </button>
        <button
          className={`px-4 py-2 rounded-md font-dongle ${
            currentGame === "branch-sequence" ? "bg-[#539e1b] text-white" : "bg-gray-100 hover:bg-gray-200"
          }`}
          onClick={() => onSelectGame("branch-sequence")}
        >
          Dokończ układanie
        </button>
        <button
          className={`px-4 py-2 rounded-md font-dongle ${
            currentGame === "find-6-differences" ? "bg-[#539e1b] text-white" : "bg-gray-100 hover:bg-gray-200"
          }`}
          onClick={() => onSelectGame("find-6-differences")}
        >
          Znajdź 6 różnic
        </button>
        <button
          className={`px-4 py-2 rounded-md font-dongle ${
            currentGame === "birds-puzzle" ? "bg-[#539e1b] text-white" : "bg-gray-100 hover:bg-gray-200"
          }`}
          onClick={() => onSelectGame("birds-puzzle")}
        >
          Ułóż obrazek - ptaki
        </button>
        <button
          className={`px-4 py-2 rounded-md font-dongle ${
            currentGame === "memory-match-2x4" ? "bg-[#539e1b] text-white" : "bg-gray-100 hover:bg-gray-200"
          }`}
          onClick={() => onSelectGame("memory-match-2x4")}
        >
          Zapamiętaj i ułóż tak samo 2x4
        </button>
        <button
          className={`px-4 py-2 rounded-md font-dongle ${
            currentGame === "sudoku" ? "bg-[#539e1b] text-white" : "bg-gray-100 hover:bg-gray-200"
          }`}
          onClick={() => onSelectGame("sudoku")}
        >
          Uzupełnij sudoku
        </button>
        <button
          className={`px-4 py-2 rounded-md font-dongle ${
            currentGame === "pattern-completion" ? "bg-[#539e1b] text-white" : "bg-gray-100 hover:bg-gray-200"
          }`}
          onClick={() => onSelectGame("pattern-completion")}
        >
          Co pasuje? Uzupełnij
        </button>
        <button
          className={`px-4 py-2 rounded-md font-dongle ${
            currentGame === "find-incorrect-ladybug" ? "bg-[#539e1b] text-white" : "bg-gray-100 hover:bg-gray-200"
          }`}
          onClick={() => onSelectGame("find-incorrect-ladybug")}
        >
          Znajdź nieprawidłową biedronkę
        </button>
        <button
          className={`px-4 py-2 rounded-md font-dongle ${
            currentGame === "sequential-order-3" ? "bg-[#539e1b] text-white" : "bg-gray-100 hover:bg-gray-200"
          }`}
          onClick={() => onSelectGame("sequential-order-3")}
        >
          Ułóż po kolei
        </button>

        <button
          className={`px-4 py-2 rounded-md font-dongle ${
            currentGame === "student-panel" ? "bg-[#539e1b] text-white" : "bg-gray-100 hover:bg-gray-200"
          }`}
          onClick={() => onSelectGame("student-panel")}
        >
          Panel Ucznia
        </button>
        <button
          className={`px-4 py-2 rounded-md font-dongle ${
            currentGame === "teacher-panel" ? "bg-[#539e1b] text-white" : "bg-gray-100 hover:bg-gray-200"
          }`}
          onClick={() => onSelectGame("teacher-panel")}
        >
          Panel Nauczyciela
        </button>
        <button className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 mt-2 font-dongle" onClick={onClose}>
          Zamknij
        </button>
      </div>
    </div>
  )
}
