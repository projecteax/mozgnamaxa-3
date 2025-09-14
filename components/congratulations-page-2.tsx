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
              <p className="mb-1">Niektóre kwiaty potrafią przebijać się przez śnieg,</p>
              <p className="mb-1">aby pokazać światu swoje kolory!</p>
              <p>Nawet gdy ziemia jest jeszcze bardzo zimna!</p>
            </>
          ),
          speechText: "A to ciekawe! Niektóre kwiaty potrafią przebijać się przez śnieg, aby pokazać światu swoje kolory! Nawet gdy ziemia jest jeszcze bardzo zimna!",
          dragon: "/images/dragon_02.svg",
          
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
        {/* Speech bubble with seasonal text */}
        <div className="relative w-full max-w-[390px] sm:max-w-[520px] md:max-w-[650px] lg:max-w-[780px] aspect-[969/444] flex-shrink-0 drop-shadow-lg">
          <Image src="/images/cloud_text.svg" alt="Speech bubble" fill className="object-contain" />

          {/* Seasonal text overlay */}
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
              src={seasonContent.dragon || "/placeholder.svg"}
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
