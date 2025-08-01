"use client"
import Image from "next/image"
import { useSeason } from "@/contexts/season-context"

interface ProgressPageProps {
  onContinue: () => void
}

export default function ProgressPage({ onContinue }: ProgressPageProps) {
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
          medalSuffix: "",
          buttonColor: "#539e1b", // Green for spring
        }
    }
  }

  const { medalSuffix, buttonColor } = getSeasonalStyles()

  const handleDalejClick = () => {
    console.log("DALEJ button clicked - Going to dragon page 2")
    onContinue()
  }

  return (
    <div 
      className="w-full h-screen flex flex-col items-center justify-center px-12"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      {/* Grid of boxes - enlarged by 200% */}
      <div className="grid grid-cols-6 gap-6 mb-16">
        {/* First box - active with medal - enlarged from w-24 h-24 to w-48 h-48 */}
        <div className="relative w-48 h-48">
          <Image src="/images/white_box_medium.svg" alt="Active box" fill className="object-contain" />
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Medal icon enlarged from w-12 h-12 to w-24 h-24 */}
            <div className="relative w-24 h-24">
              <Image src={`/images/medal_01${medalSuffix}.svg`} alt="Medal" fill className="object-contain" />
            </div>
          </div>
        </div>

        {/* Remaining 11 boxes - greyed out - enlarged from w-24 h-24 to w-48 h-48 */}
        {Array.from({ length: 11 }).map((_, index) => (
          <div key={index} className="relative w-48 h-48">
            <div className="relative w-full h-full opacity-40 grayscale">
              <Image src="/images/white_box_medium.svg" alt="Locked box" fill className="object-contain" />
            </div>
          </div>
        ))}
      </div>

      {/* DALEJ button - goes to dragon page 2 */}
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
