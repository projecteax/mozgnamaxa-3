"use client"
import Image from "next/image"
import { useSeason } from "@/contexts/season-context"
import SoundButtonEnhanced from "./sound-button-enhanced"

interface CongratulationsPageProps {
  onStartClick: () => void
}

export default function CongratulationsPage({ onStartClick }: CongratulationsPageProps) {
  const { selectedSeason, getThemeColors } = useSeason()
  const theme = getThemeColors()

  // Get season-specific content
  const getSeasonContent = () => {
    switch (selectedSeason) {
      case "lato":
        return {
          text: (
            <>
              <p className="mb-1">A to zabawne!</p>
              <p className="mb-1">W jakie dni pokrzywa nie parzy?</p>
              <p>W nieparzyste!</p>
            </>
          ),
          speechText: "A to zabawne! W jakie dni pokrzywa nie parzy? W nieparzyste!",
          dragonImage: "/images/dragon_01_summer.svg",
          soundIcon: "/images/sound_summer.svg",
          startButtonBg: "/images/start_summer.svg",
          textColor: "text-[#FF8C00]",
        }
      case "jesien":
        return {
          text: (
            <>
              <p className="mb-1">A to ciekawe!</p>
              <p className="mb-1">Za jesienne zapachy nie odpowiadają tylko liście.</p>
              <p>Wilgoć w powietrzu uwalnia aromaty z ziemi, grzybów i kory drzew.</p>
            </>
          ),
          speechText: "A to ciekawe! Za jesienne zapachy nie odpowiadają tylko liście. Wilgoć w powietrzu uwalnia aromaty z ziemi, grzybów i kory drzew.",
          dragonImage: "/images/dragon_01_autumn.svg",
          soundIcon: "/images/sound_autumn.svg",
          startButtonBg: "/images/start_button.svg",
          textColor: "text-[#D2691E]",
        }
      case "zima":
        return {
          text: (
            <>
              <p className="mb-1">A to zabawne!</p>
              <p className="mb-1">Co robi rzeka jak jej się coś nie podoba?</p>
              <p>Narzeka.</p>
            </>
          ),
          speechText: "A to zabawne! Co robi rzeka jak jej się coś nie podoba? Narzeka.",
          dragonImage: "/images/dragon_01_winter.svg",
          soundIcon: "/images/sound_winter.svg",
          startButtonBg: "/images/start_button.svg",
          textColor: "text-[#4682B4]",
        }
      default: // spring/wiosna
        return {
          text: (
            <>
              <p className="mb-1">A to zabawne!</p>
              <p className="mb-1">Jak się czuje ogórek w śmietanie?</p>
              <p>Mizernie!</p>
            </>
          ),
          speechText: "A to zabawne! Jak się czuje ogórek w śmietanie? Mizernie!",
          dragonImage: "/images/dragon_01.svg",
          startButtonBg: "/images/start_button.svg",
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
        {/* Speech bubble with joke text - 150% larger with shadow */}
        <div className="relative w-[692px] h-[317px] flex-shrink-0 drop-shadow-lg">
          <Image src="/images/cloud_text.svg" alt="Speech bubble" fill className="object-contain" />

          {/* Joke text overlay - left aligned, 120% larger text */}
          <div className="absolute inset-0 flex flex-col justify-center pl-20 pr-16">
            <div className={`font-bold text-3xl leading-tight text-left dragon-speech-text ${seasonContent.textColor}`}>
              {seasonContent.text}
            </div>
          </div>
        </div>

        {/* Dragon and buttons column */}
        <div className="flex flex-col items-center gap-8 flex-shrink-0">
          {/* Dragon character with shadow */}
          <div className="relative w-[420px] h-[420px] drop-shadow-lg">
            <Image
              src={seasonContent.dragonImage || "/placeholder.svg"}
              alt="Funny dragon"
              fill
              className="object-contain"
            />
          </div>

          {/* Buttons positioned under the dragon */}
          <div className="flex items-center gap-8">
            {/* Enhanced Sound button with better Polish pronunciation */}
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
              <Image
                src={seasonContent.startButtonBg || "/placeholder.svg"}
                alt="Start button background"
                fill
                className="object-contain"
              />
              {/* Only show START text for non-summer seasons */}
              {selectedSeason !== "lato" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`font-bold text-2xl ${seasonContent.textColor}`}>START</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
