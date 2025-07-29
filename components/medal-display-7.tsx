"use client"
import { useEffect } from "react"
import Image from "next/image"
import { useSeason } from "@/contexts/season-context"

interface MedalDisplay7Props {
  onComplete: () => void
}

export default function MedalDisplay7({ onComplete }: MedalDisplay7Props) {
  const { selectedSeason } = useSeason()

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onComplete])

  const getMedalAndBackground = () => {
    switch (selectedSeason) {
      case "lato":
        return {
          medal: "/images/medal_07_summer.svg",
          background: "bg-[#FFE082]",
        }
      case "jesien":
        return {
          medal: "/images/medal_07_autumn.svg",
          background: "bg-[#FF8A65]",
        }
      case "zima":
        return {
          medal: "/images/medal_07_winter.svg",
          background: "bg-[#81D4FA]",
        }
      default: // wiosna
        return {
          medal: "/images/medal_07.svg",
          background: "bg-[#C8E6C9]",
        }
    }
  }

  const { medal, background } = getMedalAndBackground()

  return (
    <div className={`w-full h-screen ${background} flex items-center justify-center overflow-hidden relative`}>
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
          src={medal || "/placeholder.svg"}
          alt="Medal 07"
          width={200}
          height={200}
          className="object-contain drop-shadow-2xl"
          priority
        />
      </div>
    </div>
  )
}
