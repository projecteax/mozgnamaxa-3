"use client"
import { useEffect } from "react"
import Image from "next/image"
import { useSeason } from "@/contexts/season-context"

interface MedalDisplayProps {
  onNextClick: () => void
}

export default function MedalDisplay({ onNextClick }: MedalDisplayProps) {
  const { selectedSeason, getThemeColors } = useSeason()
  const theme = getThemeColors()

  // Auto-redirect after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onNextClick()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onNextClick])

  // Get season-appropriate medal and background
  const getMedalSrc = () => {
    switch (selectedSeason) {
      case "lato":
        return "/images/medal_01_summer.svg"
      case "jesien":
        return "/images/medal_01_autumn.svg"
      case "zima":
        return "/images/medal_01_winter.svg"
      default: // wiosna
        return "/images/medal_01.svg"
    }
  }

  return (
    <div
      className="w-full h-screen flex items-center justify-center overflow-hidden relative"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      {/* Star background */}
      <div className="absolute inset-0 flex items-center justify-center z-0">
        <Image
          src="/images/star_icon.svg"
          alt="Star background"
          width={600}
          height={600}
          className="object-contain"
          priority
        />
      </div>

      {/* Medal on top */}
      <div className="relative z-10 flex items-center justify-center">
        <Image
          src={getMedalSrc() || "/placeholder.svg"}
          alt="Achievement Medal"
          width={200}
          height={200}
          className="object-contain drop-shadow-2xl"
          priority
        />
      </div>
    </div>
  )
}
