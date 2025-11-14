"use client"
import { useState } from "react"
import Image from "next/image"
import { useSeason } from "@/contexts/season-context"
import StudentGameMenu from "./student-game-menu"

interface CongratulationsPage13Props {
  onGoHome?: () => void
  onLogin?: () => void
  onLogout?: () => void
  onStartClick?: () => void
}

export default function CongratulationsPage13({ onStartClick, onGoHome, onLogin, onLogout }: CongratulationsPage13Props) {
  const { getThemeColors } = useSeason()
  const theme = getThemeColors()
  const [showMenu, setShowMenu] = useState(false)

  return (
    <div className="w-full h-screen bg-[#C8E6C9] flex flex-col items-center justify-center relative overflow-hidden p-2 sm:p-4 md:p-6">
      {/* Menu icon in top right corner */}
      {onGoHome && (
        <div className="absolute top-4 right-4 z-40">
          <div className="relative w-16 h-16" onClick={() => setShowMenu(!showMenu)}>
            <Image
              src={theme.menuIcon || "/placeholder.svg"}
              alt="Menu"
              fill
              className="object-contain cursor-pointer"
              style={{
                filter: "drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3))",
              }}
            />
          </div>
        </div>
      )}

      {/* Menu dropdown */}
      {showMenu && onGoHome && (
        <StudentGameMenu 
          onGoHome={onGoHome} 
          onLogout={onLogout || (() => {})} 
          onClose={() => setShowMenu(false)}
          onLogin={onLogin}
        />
      )}
      {/* Dragon background */}
      <div className="absolute inset-0 flex items-center justify-center z-0">
        <Image
          src="/images/dragon_13.svg"
          alt="Dragon"
          width={400}
          height={300}
          className="object-contain"
          style={{ width: 'clamp(200px, 50vw, 400px)', height: 'clamp(150px, 37.5vw, 300px)' }}
          priority
        />
      </div>

      {/* Dalej button aligned right and smaller */}
      <div className="relative z-10 flex w-full justify-end pr-4 sm:pr-8 md:pr-16 mt-auto mb-4 sm:mb-8 md:mb-12">
        <button
          onClick={onStartClick}
          className="px-4 sm:px-6 md:px-8 py-1 sm:py-2 bg-white text-gray-800 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-lg font-dongle"
          style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}
        >
          Dalej
        </button>
      </div>
    </div>
  )
} 