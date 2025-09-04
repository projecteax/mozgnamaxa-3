"use client"
import Image from "next/image"
import { useSeason } from "@/contexts/season-context"
import SoundButtonEnhanced from "./sound-button-enhanced"

interface CongratulationsPage2Props {
  onStartClick: () => void
}

export default function CongratulationsPage2({ onStartClick }: CongratulationsPage2Props) {
  const { selectedSeason, getThemeColors } = useSeason()
  const theme = getThemeColors()

  const getSeasonContent = () => {
    switch (selectedSeason) {
      case "lato":
        return {
          text: (
            <>
              <p className="mb-1">A to ciekawe!</p>
              <p className="mb-1">Las pachnie intensywniej latem ze względu na wyższą</p>
              <p className="mb-1">temperaturę, dzięki której uwalniane są olejki</p>
              <p>eteryczne z drzew iglastych.</p>
            </>
          ),
          speechText: "A to ciekawe! Las pachnie intensywniej latem ze względu na wyższą temperaturę, dzięki której uwalniane są olejki eteryczne z drzew iglastych.",
          dragon: "/images/dragon_02_summer.svg",
          
          textColor: "text-[#FF8C00]",
        }
      case "jesien":
        return {
          text: (
            <>
              <p className="mb-1">A to zabawne!</p>
              <p className="mb-1">Jak szybko przemieszcza się burza?</p>
              <p className="mb-2">Błyskawicznie!</p>
              <p className="italic">A tak na poważnie: Dźwięk grzmotu słyszymy później, bo dźwięk przemieszcza się wolniej niż światło.</p>
            </>
          ),
          speechText: "A to zabawne! Jak szybko przemieszcza się burza? Błyskawicznie! A tak na poważnie: Dźwięk grzmotu słyszymy później, bo dźwięk przemieszcza się wolniej niż światło.",
          dragon: "/images/dragon_02_autumn.svg",
          
          textColor: "text-[#D2691E]",
        }
      case "zima":
        return {
          text: (
            <>
              <p className="mb-1">A to ciekawe!</p>
              <p className="mb-1">Oczy reniferów w lecie są złote, a zimą zmieniają się</p>
              <p className="mb-1">na niebieskie – dzięki temu lepiej widzą</p>
              <p>potencjalnych drapieżników.</p>
            </>
          ),
          speechText: "A to ciekawe! Oczy reniferów w lecie są złote, a zimą zmieniają się na niebieskie – dzięki temu lepiej widzą potencjalnych drapieżników.",
          dragon: "/images/dragon_02_winter.svg",
          
          textColor: "text-[#4682B4]",
        }
      default: // wiosna
        return {
          text: (
            <>
              <p className="mb-1">A to ciekawe!</p>
              <p className="mb-1">Krokusy potrafią przebijać się przez śnieg,</p>
              <p className="mb-1">aby pokazać światu swoje kolory!</p>
              <p>Nawet gdy ziemia jest jeszcze bardzo zimna!</p>
            </>
          ),
          speechText: "A to ciekawe! Krokusy potrafią przebijać się przez śnieg, aby pokazać światu swoje kolory! Nawet gdy ziemia jest jeszcze bardzo zimna!",
          dragon: "/images/dragon_02.svg",
          
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
        {/* Speech bubble with seasonal text - responsive sizing */}
        <div className="relative w-full max-w-[280px] sm:max-w-[400px] md:max-w-[600px] lg:max-w-[800px] xl:max-w-[969px] aspect-[969/444] flex-shrink-0 drop-shadow-lg">
          <Image src="/images/cloud_text.svg" alt="Speech bubble" fill className="object-contain" />

          {/* Seasonal text overlay - responsive text sizing and positioning */}
          <div className="absolute inset-0 flex flex-col justify-center pl-4 sm:pl-6 md:pl-10 lg:pl-14 xl:pl-16 pr-3 sm:pr-5 md:pr-8 lg:pr-10 xl:pr-12">
            <div className={`font-bold text-sm sm:text-lg md:text-xl lg:text-2xl leading-tight text-left dragon-speech-text ${seasonContent.textColor}`}>
              {seasonContent.text}
            </div>
          </div>
        </div>

        {/* Dragon and buttons column - responsive sizing */}
        <div className="flex flex-col items-center gap-4 sm:gap-6 md:gap-4 sm:gap-6 md:gap-8 flex-shrink-0">
          {/* Dragon character with responsive sizing */}
          <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 xl:w-[420px] xl:h-[420px] drop-shadow-lg">
            <Image
              src={seasonContent.dragon || "/placeholder.svg"}
              alt="Funny dragon"
              fill
              className="object-contain"
            />
          </div>

          {/* Buttons positioned under the dragon - responsive sizing */}
          <div className="flex items-center gap-4 sm:gap-6 md:gap-4 sm:gap-6 md:gap-8">
            {/* Sound button with speech functionality */}
            <SoundButtonEnhanced 
              text={seasonContent.speechText}
              soundIcon={theme.soundIcon}
              size="md"
            />

            {/* START button with responsive sizing */}
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
