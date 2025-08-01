"use client"
import Image from "next/image"
import { useSeason } from "@/contexts/season-context"

interface ProgressPage4Props {
  onContinue: () => void
}

export default function ProgressPage4({ onContinue }: ProgressPage4Props) {
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
    console.log("DALEJ button clicked from progress page 4")
    onContinue()
  }

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center px-12"
      style={{ backgroundColor: theme.backgroundColor }}>
      {/* Grid of boxes - enlarged by 200% */}
      <div className="grid grid-cols-6 gap-6 mb-16">
        {/* First box - active with medal 01 - enlarged from w-24 h-24 to w-48 h-48 */}
        <div className="relative w-48 h-48">
          <Image src="/images/white_box_medium.svg" alt="Active box" fill className="object-contain" />
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Medal icon enlarged from w-12 h-12 to w-24 h-24 */}
            <div className="relative w-24 h-24">
              <Image src={`/images/medal_01${medalSuffix}.svg`} alt="Medal 01" fill className="object-contain" />
            </div>
          </div>
        </div>

        {/* Second box - active with medal 02 - enlarged from w-24 h-24 to w-48 h-48 */}
        <div className="relative w-48 h-48">
          <Image src="/images/white_box_medium.svg" alt="Active box" fill className="object-contain" />
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Medal icon enlarged from w-12 h-12 to w-24 h-24 */}
            <div className="relative w-24 h-24">
              <Image src={`/images/medal_02${medalSuffix}.svg`} alt="Medal 02" fill className="object-contain" />
            </div>
          </div>
        </div>

        {/* Third box - active with medal 03 - enlarged from w-24 h-24 to w-48 h-48 */}
        <div className="relative w-48 h-48">
          <Image src="/images/white_box_medium.svg" alt="Active box" fill className="object-contain" />
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Medal icon enlarged from w-12 h-12 to w-24 h-24 */}
            <div className="relative w-24 h-24">
              <Image src={`/images/medal_03${medalSuffix}.svg`} alt="Medal 03" fill className="object-contain" />
            </div>
          </div>
        </div>

        {/* Fourth box - active with medal 04 - enlarged from w-24 h-24 to w-48 h-48 */}
        <div className="relative w-48 h-48">
          <Image src="/images/white_box_medium.svg" alt="Active box" fill className="object-contain" />
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Medal icon enlarged from w-12 h-12 to w-24 h-24 */}
            <div className="relative w-24 h-24">
              <Image src={`/images/medal_04${medalSuffix}.svg`} alt="Medal 04" fill className="object-contain" />
            </div>
          </div>
        </div>

        {/* Remaining 8 boxes - greyed out - enlarged from w-24 h-24 to w-48 h-48 */}
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="relative w-48 h-48">
            <div className="relative w-full h-full opacity-40 grayscale">
              <Image src="/images/white_box_medium.svg" alt="Locked box" fill className="object-contain" />
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
