"use client"
import Image from "next/image"
import { useSeason } from "@/contexts/season-context"
import SoundButtonEnhanced from "./sound-button-enhanced"

interface CongratulationsPage3Props {
  onStartClick: () => void
}

export default function CongratulationsPage3({ onStartClick }: CongratulationsPage3Props) {
  const { selectedSeason, getThemeColors } = useSeason()
  const theme = getThemeColors()

  const getSeasonContent = () => {
    switch (selectedSeason) {
      case "lato":
        return {
          text: (
            <>
              <p className="mb-1">A to ciekawe!</p>
              <p className="mb-1">W lesie latem można spotkać więcej zwierząt,</p>
              <p className="mb-1">które wychodzą z ukrycia, aby korzystać</p>
              <p>z obfitości pożywienia.</p>
            </>
          ),
          speechText: "A to ciekawe! W lesie latem można spotkać więcej zwierząt, które wychodzą z ukrycia, aby korzystać z obfitości pożywienia.",
          dragon: "/images/dragon_03_summer.svg",
          
          textColor: "text-[#FF8C00]",
        }
      case "jesien":
        return {
          text: (
            <>
              <p className="mb-1">A to zabawne!</p>
              <p className="mb-1">Co robi drzewo gdy się nudzi?</p>
              <p>Liście się!</p>
            </>
          ),
          speechText: "A to zabawne! Co robi drzewo gdy się nudzi? Liście się!",
          dragon: "/images/dragon_03_autumn.svg",
          
          textColor: "text-[#D2691E]",
        }
      case "zima":
        return {
          text: (
            <>
              <p className="mb-1">A to ciekawe!</p>
              <p className="mb-1">Śnieg jest biały, ponieważ odbija wszystkie</p>
              <p className="mb-1">kolory światła, ale najczęściej widzimy</p>
              <p>go w świetle słonecznym.</p>
            </>
          ),
          speechText: "A to ciekawe! Śnieg jest biały, ponieważ odbija wszystkie kolory światła, ale najczęściej widzimy go w świetle słonecznym.",
          dragon: "/images/dragon_03_winter.svg",
          
          textColor: "text-[#4682B4]",
        }
      default: // wiosna
        return {
          text: (
            <>
              <p className="mb-1">A to ciekawe!</p>
              <p className="mb-1">Wiosną ptaki śpiewają głośniej, aby</p>
              <p className="mb-1">przyciągnąć partnerów i oznaczyć</p>
              <p>swoje terytorium.</p>
            </>
          ),
          speechText: "A to ciekawe! Wiosną ptaki śpiewają głośniej, aby przyciągnąć partnerów i oznaczyć swoje terytorium.",
          dragon: "/images/dragon_03.svg",
          
          textColor: "text-[#539e1b]",
        }
    }
  }

  const seasonContent = getSeasonContent()

  return (
    <div
      className="w-full h-screen flex items-center justify-center px-12 overflow-hidden"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <div className="flex items-center justify-between w-full max-w-6xl gap-16">
        {/* Speech bubble with seasonal text - 150% larger with shadow */}
        <div className="relative w-[692px] h-[317px] flex-shrink-0 drop-shadow-lg">
          <Image src="/images/cloud_text.svg" alt="Speech bubble" fill className="object-contain" />

          {/* Seasonal text overlay - left aligned, 120% larger text */}
          <div className="absolute inset-0 flex flex-col justify-center pl-16 pr-12">
            <div className={`font-bold text-2xl leading-tight text-left dragon-speech-text ${seasonContent.textColor}`}>
              {seasonContent.text}
            </div>
          </div>
        </div>

        {/* Dragon and buttons column */}
        <div className="flex flex-col items-center gap-8 flex-shrink-0">
          {/* Dragon character with shadow */}
          <div className="relative w-[420px] h-[420px] drop-shadow-lg">
            <Image
              src={seasonContent.dragon || "/placeholder.svg"}
              alt="Funny dragon"
              fill
              className="object-contain"
            />
          </div>

          {/* Buttons positioned under the dragon */}
          <div className="flex items-center gap-8">
            {/* Sound button with speech functionality */}
            <SoundButtonEnhanced 
              text={seasonContent.speechText}
              soundIcon={theme.soundIcon}
              size="md"
            />

            {/* START button with shadow */}
            <div
              className="relative w-48 h-12 cursor-pointer hover:scale-105 transition-transform drop-shadow-lg"
              onClick={onStartClick}
            >
              <Image src="/images/start_button.svg" alt="Start button background" fill className="object-contain" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-bold text-2xl" style={{ color: theme.buttonColor }}>START</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
