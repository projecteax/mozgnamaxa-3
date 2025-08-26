"use client"
import Image from "next/image"

interface SeasonSelectionMenuProps {
  onSeasonSelect: (season: string) => void
  onMenuClick: () => void
}

export default function SeasonSelectionMenu({ onSeasonSelect, onMenuClick }: SeasonSelectionMenuProps) {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      {/* Season selection grid - centered on screen */}
      <div className="flex flex-col items-center gap-8">
        {/* Back to menu button at top */}
        <div className="w-full flex justify-start mb-8">
          <button
            onClick={onMenuClick}
            className="relative w-full h-12 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-200 flex items-center justify-center group"
          >
            <span className="text-xl font-bold text-[#3e459c] font-sour-gummy group-hover:scale-105 transition-transform duration-200">
              POWRÓT DO MENU
            </span>
          </button>
        </div>
        {/* Top row - Wiosna and Lato */}
        <div className="flex gap-8">
          {/* Wiosna (Spring) button */}
          <button
            onClick={() => onSeasonSelect("wiosna")}
            className="relative w-64 h-32 bg-white rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-200 flex items-center justify-center group"
          >
            <span className="text-4xl font-bold text-[#539e1b] font-sour-gummy group-hover:scale-105 transition-transform duration-200">
              WIOSNA
            </span>
          </button>

          {/* Lato (Summer) button */}
          <button
            onClick={() => onSeasonSelect("lato")}
            className="relative w-64 h-32 bg-white rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-200 flex items-center justify-center group"
          >
            <span className="text-4xl font-bold text-[#ffc402] font-sour-gummy group-hover:scale-105 transition-transform duration-200">
              LATO
            </span>
          </button>
        </div>

        {/* Bottom row - Jesień and Zima */}
        <div className="flex gap-8">
          {/* Jesień (Autumn) button */}
          <button
            onClick={() => onSeasonSelect("jesien")}
            className="relative w-64 h-32 bg-white rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-200 flex items-center justify-center group"
          >
            <span className="text-4xl font-bold text-[#ed6b19] font-sour-gummy group-hover:scale-105 transition-transform duration-200">
              JESIEŃ
            </span>
          </button>

          {/* Zima (Winter) button */}
          <button
            onClick={() => onSeasonSelect("zima")}
            className="relative w-64 h-32 bg-white rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-200 flex items-center justify-center group"
          >
            <span className="text-4xl font-bold text-[#00abc6] font-sour-gummy group-hover:scale-105 transition-transform duration-200">
              ZIMA
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
