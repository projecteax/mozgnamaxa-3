"use client"
import Image from "next/image"
import { useSeason } from "@/contexts/season-context"
import SoundButtonEnhanced from "./sound-button-enhanced"

interface CongratulationsPage5Props {
  onStartClick: () => void
}

export default function CongratulationsPage5({ onStartClick }: CongratulationsPage5Props) {
  const { selectedSeason, getThemeColors } = useSeason()
  const theme = getThemeColors()

  const getSeasonContent = () => {
    switch (selectedSeason) {
      case "lato":
        return {
          text: (
            <>
              <p className="mb-1">A to zabawne!</p>
              <p className="mb-1">Jak się nazywa noga konia?</p>
              <p className="mb-2">Kończyna!</p>
              <p className="italic">A tak na poważnie: Kończyna konia zakończona jest kopytem, które trzeba regularnie czyścić i podkuwać.</p>
            </>
          ),
          speechText: "A to zabawne! Jak się nazywa noga konia? Kończyna! A tak na poważnie: Kończyna konia zakończona jest kopytem, które trzeba regularnie czyścić i podkuwać.",
          
          textColor: "text-[#FF8C00]",
        }
      case "jesien":
        return {
          text: (
            <>
              <p className="mb-1">A to ciekawe!</p>
              <p className="mb-1">Żołędzie są prawdziwym przysmakiem dla zwierząt,</p>
              <p>więc jesienią je zbierają i gromadzą na zimę.</p>
            </>
          ),
          speechText: "A to ciekawe! Żołędzie są prawdziwym przysmakiem dla zwierząt, więc jesienią je zbierają i gromadzą na zimę.",
          
          textColor: "text-[#D2691E]",
        }
      case "zima":
        return {
          text: (
            <>
              <p className="mb-1">A to zabawne!</p>
              <p className="mb-1">Dlaczego choinka nie jest głodna?</p>
              <p className="mb-2">Bo jodła.</p>
              <p className="italic">A tak na poważnie: Jodła to drzewo iglaste — ma miękkie igły i rośnie nawet do 50 metrów.</p>
            </>
          ),
          speechText: "A to zabawne! Dlaczego choinka nie jest głodna? Bo jodła. A tak na poważnie: Jodła to drzewo iglaste — ma miękkie igły i rośnie nawet do 50 metrów.",
          
          textColor: "text-[#4682B4]",
        }
      default: // wiosna
        return {
          text: (
            <>
              <p className="mb-1">A to zabawne!</p>
              <p className="mb-1">Co mówi żaba do żaby?</p>
              <p className="mb-2">Kumasz?</p>
              <p className="italic">A tak na poważnie: Żaby oddychają także przez skórę, dlatego potrzebują wilgotnego środowiska.</p>
            </>
          ),
          speechText: "A to zabawne! Co mówi żaba do żaby? Kumasz? A tak na poważnie: Żaby oddychają także przez skórę, dlatego potrzebują wilgotnego środowiska.",
          
          textColor: "text-[#539e1b]",
        }
    }
  }

  const seasonContent = getSeasonContent()

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden"
      style={{ backgroundColor: theme.backgroundColor }}>
      <div className="flex flex-col lg:flex-row items-center justify-between w-full max-w-6xl gap-2 sm:gap-4 md:gap-6">
        {/* Speech bubble with frog text */}
        <div className="relative w-full max-w-[390px] sm:max-w-[520px] md:max-w-[650px] lg:max-w-[780px] aspect-[969/444] flex-shrink-0 drop-shadow-lg">
          <Image src="/images/cloud_text.svg" alt="Speech bubble" fill className="object-contain" />

          {/* Text overlay */}
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
              src={
                selectedSeason === "lato"
                  ? "/images/dragon_05_summer.svg"
                  : selectedSeason === "jesien"
                    ? "/images/dragon_05_autumn.svg"
                    : selectedSeason === "zima"
                      ? "/images/dragon_05_winter.svg"
                      : "/images/dragon_05.svg"
              }
              alt="Funny dragon"
              fill
              className="object-contain"
            />
          </div>

          {/* Buttons positioned under the dragon */}
          <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
            {/* Sound button with speech functionality */}
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
              <Image src="/images/start_button.svg" alt="Start button background" fill className="object-contain" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-bold" style={{ color: theme.buttonColor, fontSize: 'clamp(0.6rem, 1.5vw, 1.2rem)' }}>START</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
