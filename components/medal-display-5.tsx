"use client"
import { useEffect } from "react"
import Image from "next/image"
import { useSeason } from "@/contexts/season-context"

interface MedalDisplay5Props {
  onComplete: () => void
}

export default function MedalDisplay5({ onComplete }: MedalDisplay5Props) {
  const { selectedSeason, getThemeColors } = useSeason()
  const theme = getThemeColors()

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onComplete])

  const getMedalSrc = () => {
    switch (selectedSeason) {
      case "lato":
        return "/images/medal_05_summer.svg"
      case "jesien":
        return "/images/medal_05_autumn.svg"
      case "zima":
        return "/images/medal_05_winter.svg"
      default: // wiosna
        return "/images/medal_05.svg"
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

      {/* Medal positioned on top of star */}
      <div className="relative z-10 flex items-center justify-center">
        <Image
          src={getMedalSrc() || "/placeholder.svg"}
          alt="Medal 05"
          width={200}
          height={200}
          className="object-contain drop-shadow-2xl"
          priority
        />
      </div>
    </div>
  )
}
