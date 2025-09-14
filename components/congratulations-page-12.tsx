"use client"
import Image from "next/image"
import SoundButtonEnhanced from "./sound-button-enhanced"
import { useSeason } from "@/contexts/season-context"

interface CongratulationsPage12Props {
  onStartClick: () => void
}

export default function CongratulationsPage12({ onStartClick }: CongratulationsPage12Props) {
  const { selectedSeason, getThemeColors } = useSeason()
  const theme = getThemeColors()

  const getSeasonContent = () => {
    switch (selectedSeason) {
      case "lato":
        return {
          text: (
            <>
              <p className="mb-1">A to ciekawe!</p>
              <p className="mb-1">Przez temperaturę i sól morską w powietrzu,</p>
              <p className="mb-1">która przyspiesza proces topnienia, lody na</p>
              <p>nadmorskiej plaży topnieją szybciej!</p>
            </>
          ),
          
          speechText: "A to ciekawe! Przez temperaturę i sól morską w powietrzu, która przyspiesza proces topnienia, lody na nadmorskiej plaży topnieją szybciej!",
          textColor: "text-[#FF8C00]",
        }
      case "jesien":
        return {
          text: (
            <>
              <p className="mb-1">A to zabawne!</p>
              <p className="mb-1">Jak się śmieje las?</p>
              <p className="mb-2">Mech, mech, mech!</p>
              <p className="italic">A tak na poważnie: Mech nie ma korzeni, tylko chwytniki. Pobiera wodę bezpośrednio z otoczenia. Zatrzymuje wilgoć i oczyszcza powietrze w lesie.</p>
            </>
          ),
          
          speechText: "A to zabawne! Jak się śmieje las? Mech, mech, mech! A tak na poważnie: Mech nie ma korzeni, tylko chwytniki. Pobiera wodę bezpośrednio z otoczenia. Zatrzymuje wilgoć i oczyszcza powietrze w lesie.",
          textColor: "text-[#D2691E]",
        }
      case "zima":
        return {
          text: (
            <>
              <p className="mb-1">A to ciekawe!</p>
              <p className="mb-1">Niedźwiedzie polarne mają czarną skórę –</p>
              <p>dzięki temu lepiej łapią ciepło ze słońca.</p>
            </>
          ),
          
          speechText: "A to ciekawe! Niedźwiedzie polarne mają czarną skórę – dzięki temu lepiej łapią ciepło ze słońca.",
          textColor: "text-[#4682B4]",
        }
      default: // wiosna
        return {
          text: (
            <>
              <p className="mb-1">A to ciekawe!</p>
              <p className="mb-1">Magnolie to jedne z pierwszych</p>
              <p className="mb-1">drzew, które kwitną wiosną.</p>
              <p>Ich duże kwiaty przyciągają</p>
              <p>pszczoły i motyle.</p>
            </>
          ),
          
          speechText: "A to ciekawe! Magnolie to jedne z pierwszych drzew, które kwitną wiosną. Ich duże kwiaty przyciągają pszczoły i motyle.",
          textColor: "text-[#539e1b]",
        }
    }
  }

  const seasonContent = getSeasonContent()

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden"
      style={{ backgroundColor: theme.backgroundColor }}>
      <div className="flex flex-col lg:flex-row items-center justify-between w-full max-w-6xl gap-2 sm:gap-4 md:gap-6">
        {/* Speech bubble with new text */}
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
                  ? "/images/dragon_12_summer.svg"
                  : selectedSeason === "jesien"
                    ? "/images/dragon_12_autumn.svg"
                    : selectedSeason === "zima"
                      ? "/images/dragon_12_winter.svg"
                      : "/images/dragon_12.svg"
              }
              alt="Dragon 12"
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
