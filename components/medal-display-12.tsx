"use client"
import { useEffect, useState } from "react"
import Image from "next/image"
import { useSeason } from "@/contexts/season-context"

interface MedalDisplay12Props {
  onComplete?: () => void
}

export default function MedalDisplay12({ onComplete }: MedalDisplay12Props) {
  const { selectedSeason } = useSeason()
  const [medalAndBackground, setMedalAndBackground] = useState({ medal: "", background: "" })

  useEffect(() => {
  const getMedalAndBackground = () => {
    switch (selectedSeason) {
      case "lato":
        return {
          medal: "/images/medal_12_summer.svg",
          background: "bg-[#FFE082]",
        }
      case "jesien":
        return {
          medal: "/images/medal_12_autumn.svg",
          background: "bg-[#FF8A65]",
        }
      case "zima":
        return {
          medal: "/images/medal_12_winter.svg",
          background: "bg-[#81D4FA]",
        }
      default: // wiosna
        return {
          medal: "/images/medal_12.svg",
          background: "bg-[#C8E6C9]",
        }
    }
  }

    setMedalAndBackground(getMedalAndBackground())
  }, [selectedSeason])

  // Auto-redirect after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) {
        onComplete()
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [onComplete])

  const { medal, background } = medalAndBackground

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
          alt="Medal 12"
          width={200}
          height={200}
          className="object-contain drop-shadow-2xl"
          priority
        />
      </div>
    </div>
  )
}
