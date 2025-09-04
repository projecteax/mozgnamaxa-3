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
              <p className="mb-2">W nieparzyste!</p>
              <p className="italic">A tak na poważnie: Pokrzywa parzy, bo ma na liściach włoski wypełnione kwasem mrówkowym.</p>
            </>
          ),
          speechText: "A to zabawne! W jakie dni pokrzywa nie parzy? W nieparzyste! A tak na poważnie: Pokrzywa parzy, bo ma na liściach włoski wypełnione kwasem mrówkowym.",
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
              <p className="mb-2">Narzeka.</p>
              <p className="italic">A tak na poważnie: Wisła to najdłuższa rzeka w Polsce — ma ponad 1000 km!</p>
            </>
          ),
          speechText: "A to zabawne! Co robi rzeka jak jej się coś nie podoba? Narzeka. A tak na poważnie: Wisła to najdłuższa rzeka w Polsce — ma ponad 1000 km!",
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
              <p className="mb-2">Mizernie!</p>
              <p className="italic">A tak na poważnie: Ogórek to warzywo o wysokiej zawartości wody — świetnie nawadnia organizm.</p>
            </>
          ),
          speechText: "A to zabawne! Jak się czuje ogórek w śmietanie? Mizernie! A tak na poważnie: Ogórek to warzywo o wysokiej zawartości wody — świetnie nawadnia organizm.",
          dragonImage: "/images/dragon_01.svg",
          startButtonBg: "/images/start_button.svg",
          textColor: "text-[#539e1b]",
        }
    }
  }

  const seasonContent = getSeasonContent()

  return (
    <div 
      className="w-full min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 overflow-hidden"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <div className="flex flex-col lg:flex-row items-center justify-center w-full max-w-7xl gap-4 sm:gap-6 md:gap-4 sm:gap-6 md:gap-8 lg:gap-4 sm:gap-6 md:gap-4 sm:gap-6 md:gap-8 lg:gap-16">
        {/* Speech bubble with joke text - responsive sizing */}
        <div className="relative w-full max-w-[280px] sm:max-w-[400px] md:max-w-[600px] lg:max-w-[800px] xl:max-w-[969px] aspect-[969/444] flex-shrink-0 drop-shadow-lg">
          <Image src="/images/cloud_text.svg" alt="Speech bubble" fill className="object-contain" />

          {/* Joke text overlay - responsive text sizing and positioning */}
          <div className="absolute inset-0 flex flex-col justify-center pl-4 sm:pl-8 md:pl-12 lg:pl-16 xl:pl-20 pr-3 sm:pr-6 md:pr-10 lg:pr-14 xl:pr-16">
            <div className={`font-bold text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl leading-tight text-left dragon-speech-text ${seasonContent.textColor}`}>
              {seasonContent.text}
            </div>
          </div>
        </div>

        {/* Dragon and buttons column - responsive sizing */}
        <div className="flex flex-col items-center gap-4 sm:gap-6 md:gap-4 sm:gap-6 md:gap-8 flex-shrink-0">
          {/* Dragon character with responsive sizing */}
          <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 xl:w-[420px] xl:h-[420px] drop-shadow-lg">
            <Image
              src={seasonContent.dragonImage || "/placeholder.svg"}
              alt="Funny dragon"
              fill
              className="object-contain"
            />
          </div>

          {/* Buttons positioned under the dragon - responsive sizing */}
          <div className="flex items-center gap-4 sm:gap-6 md:gap-4 sm:gap-6 md:gap-8">
            {/* Enhanced Sound button with better Polish pronunciation */}
            <SoundButtonEnhanced 
              text={seasonContent.speechText}
              soundIcon={theme.soundIcon}
              size="md"
            />

            {/* START button with responsive sizing and matching text styling */}
            <div
              className="relative w-32 h-8 sm:w-36 sm:h-9 md:w-40 md:h-10 lg:w-44 lg:h-11 xl:w-48 xl:h-12 cursor-pointer hover:scale-105 transition-transform drop-shadow-lg"
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
                  <span className={`font-bold text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl dragon-speech-text ${seasonContent.textColor}`}>START</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
