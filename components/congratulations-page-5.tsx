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
    <div className="w-full min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 overflow-hidden"
      style={{ backgroundColor: theme.backgroundColor }}>
      <div className="flex items-center justify-between w-full max-w-6xl gap-4 sm:gap-6 md:gap-4 sm:gap-6 md:gap-8 lg:gap-16">
        {/* Speech bubble with frog text - 40% larger with shadow */}
        <div className="relative w-full max-w-[280px] sm:max-w-[400px] md:max-w-[600px] lg:max-w-[800px] xl:max-w-[969px] aspect-[969/444] flex-shrink-0 drop-shadow-lg">
          <Image src="/images/cloud_text.svg" alt="Speech bubble" fill className="object-contain" />

          {/* Text overlay - left aligned, 120% larger text */}
          <div className="absolute inset-0 flex flex-col justify-center pl-4 sm:pl-8 md:pl-12 lg:pl-16 xl:pl-20 pr-3 sm:pr-6 md:pr-10 lg:pr-14 xl:pr-16">
            <div className={`font-bold text-3xl leading-tight text-left dragon-speech-text ${seasonContent.textColor}`}>
              {seasonContent.text}
            </div>
          </div>
        </div>

        {/* Dragon and buttons column */}
        <div className="flex flex-col items-center gap-4 sm:gap-6 md:gap-8 flex-shrink-0">
          {/* Dragon character with shadow */}
          <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 xl:w-[420px] xl:h-[420px] drop-shadow-lg">
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
          <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
            {/* Sound button with speech functionality */}
            <SoundButtonEnhanced 
              text={seasonContent.speechText}
              soundIcon={theme.soundIcon}
              size="md"
            />

            {/* START button with shadow */}
            <div
              className="relative w-32 h-8 sm:w-36 sm:h-9 md:w-40 md:h-10 lg:w-44 lg:h-11 xl:w-48 xl:h-12 cursor-pointer hover:scale-105 transition-transform drop-shadow-lg"
              onClick={onStartClick}
            >
              <Image src="/images/start_button.svg" alt="Start button background" fill className="object-contain" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-bold text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl" style={{ color: theme.buttonColor }}>START</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
