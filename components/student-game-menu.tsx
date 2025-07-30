"use client"

import { useAuth } from "@/contexts/auth-context"
import { useSeason } from "@/contexts/season-context"
import Image from "next/image"

interface StudentGameMenuProps {
  onGoHome: () => void
  onLogout: () => void
  onClose: () => void
}

export default function StudentGameMenu({ onGoHome, onLogout, onClose }: StudentGameMenuProps) {
  const { logout } = useAuth()
  const { selectedSeason, getThemeColors } = useSeason()
  const theme = getThemeColors()

  // Get season-specific text color
  const getTextColor = () => {
    switch (selectedSeason) {
      case "wiosna":
        return "#539e1b" // Dark green for spring
      case "lato":
        return "#d4af37" // Dark yellow for summer
      case "jesien":
        return "#ff8c00" // Dark orange for autumn
      case "zima":
        return "#1e3a8a" // Dark blue for winter
      default:
        return "#3e459c" // Default color
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      onLogout()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <div className="fixed top-24 right-8 bg-white rounded-lg shadow-lg p-4 z-50 min-w-48">
      <div className="flex flex-col gap-3">
        <button
          className="relative w-full h-12 flex items-center justify-center group hover:scale-105 transition-transform duration-200"
          onClick={onGoHome}
        >
          <Image src="/images/button_default.svg" alt="Button background" width={200} height={48} className="w-full h-full" />
          <span 
            className="absolute inset-0 flex items-center justify-center font-bold text-lg font-sour-gummy tracking-wide"
            style={{ color: getTextColor() }}
          >
            Strona Główna
          </span>
        </button>
        <button
          className="relative w-full h-12 flex items-center justify-center group hover:scale-105 transition-transform duration-200"
          onClick={handleLogout}
        >
          <Image src="/images/button_default.svg" alt="Button background" width={200} height={48} className="w-full h-full" />
          <span 
            className="absolute inset-0 flex items-center justify-center font-bold text-lg font-sour-gummy tracking-wide"
            style={{ color: getTextColor() }}
          >
            Wyloguj
          </span>
        </button>
      </div>
    </div>
  )
} 