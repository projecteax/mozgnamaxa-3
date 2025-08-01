"use client"
import Image from "next/image"
import { useSeason } from "@/contexts/season-context"

interface ProgressPage12Props {
  onContinue: () => void
}

export default function ProgressPage12({ onContinue }: ProgressPage12Props) {
  const { selectedSeason, getThemeColors } = useSeason()
  const theme = getThemeColors()

  const getSeasonalStyles = () => {
    switch (selectedSeason) {
      case "lato": // summer
        return {
          medalSuffix: "_summer",
          buttonColor: "#ffc402", // Yellow for summer
        }
      case "jesien": // autumn
        return {
          medalSuffix: "_autumn",
          buttonColor: "#ed6b19", // Orange for autumn
        }
      case "zima": // winter
        return {
          medalSuffix: "_winter",
          buttonColor: "#00abc6", // Blue for winter
        }
      default: // wiosna (spring)
        return {
          background: "bg-[#C8E6C9]",
          medalSuffix: "",
        }
    }
  }

  const { medalSuffix, buttonColor } = getSeasonalStyles()

  const handleDalejClick = () => {
    onContinue()
  }

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center px-12"
      style={{ backgroundColor: theme.backgroundColor }}>
      {/* Grid of boxes - 2 rows of 6 */}
      <div className="grid grid-cols-6 gap-6 mb-16">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="relative w-48 h-48">
            <Image src="/images/white_box_medium.svg" alt="Active box" fill className="object-contain" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-24 h-24">
                <Image src={`/images/medal_${String(i+1).padStart(2, '0')}${medalSuffix}.svg`} alt={`Medal ${i+1}`} fill className="object-contain" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DALEJ button */}
      <div
        className="relative w-48 h-12 cursor-pointer hover:scale-105 transition-transform"
        onClick={handleDalejClick}
      >
        <Image src="/images/start_button.svg" alt="Continue button background" fill className="object-contain" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-bold text-2xl" style={{ color: buttonColor }}>DALEJ</span>
        </div>
      </div>
    </div>
  )
} 