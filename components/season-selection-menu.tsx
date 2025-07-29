"use client"
import Image from "next/image"

interface SeasonSelectionMenuProps {
  onSeasonSelect: (season: string) => void
  onMenuClick: () => void
}

export default function SeasonSelectionMenu({ onSeasonSelect, onMenuClick }: SeasonSelectionMenuProps) {
  return (
    <div className="w-full max-w-4xl">
      {/* Header with sound and menu icons */}
      <div className="w-full flex justify-between items-center mb-8">
        <div className="relative w-16 h-16">
          <Image src="/images/sound_new.svg" alt="Sound" fill className="object-contain cursor-pointer" />
        </div>

        <div className="flex-1"></div>

        <div className="relative w-16 h-16" onClick={onMenuClick}>
          <Image src="/images/menu_new.svg" alt="Menu" fill className="object-contain cursor-pointer" />
        </div>
      </div>

      {/* Season selection grid */}
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-8">
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
            className="relative w-64 h-32 bg-[#d4c4b0] rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-200 flex items-center justify-center group"
          >
            <span className="text-4xl font-bold text-[#ed6b19] font-sour-gummy group-hover:scale-105 transition-transform duration-200">
              JESIEŃ
            </span>
          </button>

          {/* Zima (Winter) button */}
          <button
            onClick={() => onSeasonSelect("zima")}
            className="relative w-64 h-32 bg-[#d4c4b0] rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-200 flex items-center justify-center group"
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
