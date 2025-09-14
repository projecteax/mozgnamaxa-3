"use client"
import Image from "next/image"
import SoundButtonEnhanced from "./sound-button-enhanced"
import { useSeason } from "@/contexts/season-context"

interface CongratulationsPage6Props {
  onStartClick: () => void
}

export default function CongratulationsPage6({ onStartClick }: CongratulationsPage6Props) {
  const { selectedSeason, getThemeColors } = useSeason()
  const theme = getThemeColors()

  const getSeasonContent = () => {
    switch (selectedSeason) {
      case "lato":
        return {
          text: (
            <>
              <p className="mb-1">A to ciekawe!</p>
              <p className="mb-1">Pszczoły latem są najbardziej pracowite –</p>
              <p className="mb-1">w upalne dni zbierają nektar nawet</p>
              <p>przez 12 godzin dziennie!</p>
            </>
          ),
          speechText: "A to ciekawe! Pszczoły latem są najbardziej pracowite – w upalne dni zbierają nektar nawet przez 12 godzin dziennie!",
          textColor: "text-[#FF8C00]",
        }
      case "jesien":
        return {
          text: (
            <>
              <p className="mb-1">A to zabawne!</p>
              <p className="mb-1">Jak nazywa się człowiek, który kocha drzewa?</p>
              <p className="mb-2">Lovelas.</p>
              <p className="italic">A tak na poważnie: Drzewa produkują tlen, oczyszczają powietrze i dają cień — są bardzo ważne dla środowiska.</p>
            </>
          ),
          speechText: "A to zabawne! Jak nazywa się człowiek, który kocha drzewa? Lovelas. A tak na poważnie: Drzewa produkują tlen, oczyszczają powietrze i dają cień — są bardzo ważne dla środowiska.",
          textColor: "text-[#D2691E]",
        }
      case "zima":
        return {
          text: (
            <>
              <p className="mb-1">A to ciekawe!</p>
              <p className="mb-1">Lód na jeziorach śpiewa – zamarzająca woda</p>
              <p className="mb-1">kurczy się i pęka, wydając tajemnicze,</p>
              <p>dźwięczne odgłosy.</p>
            </>
          ),
          speechText: "A to ciekawe! Lód na jeziorach śpiewa – zamarzająca woda kurczy się i pęka, wydając tajemnicze, dźwięczne odgłosy.",
          textColor: "text-[#4682B4]",
        }
      default: // wiosna
        return {
          text: (
            <>
              <p className="mb-1">A to ciekawe!</p>
              <p className="mb-1">Żaby i węże, zapadają w zimowy sen</p>
              <p className="mb-1">(hibernację) i budzą się gdy</p>
              <p>temperatura wzrośnie wiosną.</p>
            </>
          ),
          speechText: "A to ciekawe! Żaby i węże, zapadają w zimowy sen (hibernację) i budzą się gdy temperatura wzrośnie wiosną.",
          textColor: "text-[#539e1b]",
        }
    }
  }

  const seasonContent = getSeasonContent()

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden"
      style={{ backgroundColor: theme.backgroundColor }}>
      <div className="flex flex-col lg:flex-row items-center justify-between w-full max-w-6xl gap-2 sm:gap-4 md:gap-6">
        {/* Speech bubble with hibernation text */}
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
                  ? "/images/dragon_06_summer.svg"
                  : selectedSeason === "jesien"
                    ? "/images/dragon_06_autumn.svg"
                    : selectedSeason === "zima"
                      ? "/images/dragon_06_winter.svg"
                      : "/images/dragon_06.svg"
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
