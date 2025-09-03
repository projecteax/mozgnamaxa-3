"use client"
import Image from "next/image"
import SoundButtonEnhanced from "./sound-button-enhanced"
import { useSeason } from "@/contexts/season-context"

interface CongratulationsPage10Props {
  onStartClick: () => void
}

export default function CongratulationsPage10({ onStartClick }: CongratulationsPage10Props) {
  const { selectedSeason, getThemeColors } = useSeason()
  const theme = getThemeColors()

  const getSeasonContent = () => {
    switch (selectedSeason) {
      case "lato":
        return {
          text: (
            <>
              <p className="mb-1">A to ciekawe!</p>
              <p className="mb-1">Plaże powiększają się latem – ciepło powoduje</p>
              <p className="mb-1">rozszerzanie się piasku więc niektóre plaże</p>
              <p>stają się większe.</p>
            </>
          ),
          
          speechText: "A to ciekawe! Plaże powiększają się latem – ciepło powoduje rozszerzanie się piasku więc niektóre plaże stają się większe.",
          textColor: "text-[#FF8C00]",
        }
      case "jesien":
        return {
          text: (
            <>
              <p className="mb-1">A to zabawne!</p>
              <p className="mb-1">Jak się nazywa warzywo puste w środku?</p>
              <p className="mb-2">Kapusta.</p>
              <p className="italic">A tak na poważnie: Kiszenie kapusty to tradycyjna metoda jej przechowywania. Kapusta w takiej formie jest bardzo zdrowa.</p>
            </>
          ),
          
          speechText: "A to zabawne! Jak się nazywa warzywo puste w środku? Kapusta. A tak na poważnie: Kiszenie kapusty to tradycyjna metoda jej przechowywania. Kapusta w takiej formie jest bardzo zdrowa.",
          textColor: "text-[#D2691E]",
        }
      case "zima":
        return {
          text: (
            <>
              <p className="mb-1">A to ciekawe!</p>
              <p className="mb-1">Śnieg nie jest biały – w rzeczywistości jest</p>
              <p className="mb-1">przezroczysty, a jego struktura odbija światło,</p>
              <p>co sprawia, że wygląda na biały.</p>
            </>
          ),
          
          speechText: "A to ciekawe! Śnieg nie jest biały – w rzeczywistości jest przezroczysty, a jego struktura odbija światło, co sprawia, że wygląda na biały.",
          textColor: "text-[#4682B4]",
        }
      default: // wiosna
        return {
          text: (
            <>
              <p className="mb-1">A to ciekawe!</p>
              <p className="mb-1">Wiosną można zaobserwować piękne tęcze,</p>
              <p className="mb-1">które powstają, gdy promienie słońca</p>
              <p>przechodzą przez krople deszczu w powietrzu.</p>
            </>
          ),
          
          speechText: "A to ciekawe! Wiosną można zaobserwować piękne tęcze, które powstają, gdy promienie słońca przechodzą przez krople deszczu w powietrzu.",
          textColor: "text-[#539e1b]",
        }
    }
  }

  const seasonContent = getSeasonContent()

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 overflow-hidden"
      style={{ backgroundColor: theme.backgroundColor }}>
      <div className="flex items-center justify-between w-full max-w-6xl gap-4 sm:gap-6 md:gap-4 sm:gap-6 md:gap-8 lg:gap-16">
        {/* Speech bubble with new text - 40% larger with shadow */}
        <div className="relative w-full max-w-[280px] sm:max-w-[400px] md:max-w-[600px] lg:max-w-[800px] xl:max-w-[969px] aspect-[969/444] flex-shrink-0 drop-shadow-lg">
          <Image src="/images/cloud_text.svg" alt="Speech bubble" fill className="object-contain" />

          {/* Text overlay - left aligned, 120% larger text */}
          <div className="absolute inset-0 flex flex-col justify-center pl-4 sm:pl-6 md:pl-10 lg:pl-14 xl:pl-16 pr-3 sm:pr-5 md:pr-8 lg:pr-10 xl:pr-12">
            <div className={`font-bold text-2xl leading-tight text-left dragon-speech-text ${seasonContent.textColor}`}>
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
                  ? "/images/dragon_10_summer.svg"
                  : selectedSeason === "jesien"
                    ? "/images/dragon_10_autumn.svg"
                    : selectedSeason === "zima"
                      ? "/images/dragon_10_winter.svg"
                      : "/images/dragon_10.svg"
              }
              alt="Dragon 10"
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
