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
              <p className="mb-1">Jakie ryby łowi matematyk?</p>
              <p className="mb-2">Sumy!</p>
              <p className="italic">A tak na poważnie: Suma to wynik dodawania. Sum to jedna z największych ryb w Europie.</p>
            </>
          ),
          speechText: "A to zabawne! Jakie ryby łowi matematyk? Sumy! A tak na poważnie: Suma to wynik dodawania. Sum to jedna z największych ryb w Europie.",
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
      className="w-full min-h-screen flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <div className="flex flex-col lg:flex-row items-center justify-between w-full max-w-6xl gap-2 sm:gap-4 md:gap-6">
        {/* Speech bubble with joke text */}
        <div className="relative w-full max-w-[390px] sm:max-w-[520px] md:max-w-[650px] lg:max-w-[780px] aspect-[969/444] flex-shrink-0 drop-shadow-lg">
          <Image src="/images/cloud_text.svg" alt="Speech bubble" fill className="object-contain" />

          {/* Joke text overlay */}
          <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-6 md:px-8 lg:px-10">
            <div className={`font-bold leading-tight text-left dragon-speech-text ${seasonContent.textColor}`} style={{ fontSize: 'clamp(0.8rem, 2vw, 1.5rem)' }}>
              {seasonContent.text}
            </div>
          </div>
        </div>

        {/* Dragon and buttons column */}
        <div className="flex flex-col items-center gap-2 sm:gap-4 md:gap-6 flex-shrink-0">
          {/* Dragon character with shadow */}
          <div className="relative drop-shadow-lg" style={{ width: 'clamp(120px, 25vw, 280px)', height: 'clamp(120px, 25vw, 280px)' }}>
            <Image
              src={seasonContent.dragonImage || "/placeholder.svg"}
              alt="Funny dragon"
              fill
              className="object-contain"
            />
          </div>

          {/* Buttons positioned under the dragon */}
          <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
            {/* Enhanced Sound button with better Polish pronunciation */}
            <SoundButtonEnhanced 
              text={seasonContent.speechText}
              soundIcon={theme.soundIcon}
              size="md"
            />

            {/* START button with shadow */}
            <div
              className="relative cursor-pointer hover:scale-105 transition-transform drop-shadow-lg"
              style={{ width: 'clamp(80px, 15vw, 140px)', height: 'clamp(24px, 4vw, 40px)' }}
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
                  <span className={`font-bold dragon-speech-text ${seasonContent.textColor}`} style={{ fontSize: 'clamp(0.6rem, 1.5vw, 1.2rem)' }}>START</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
