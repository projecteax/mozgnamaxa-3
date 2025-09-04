"use client"
import Image from "next/image"
import SoundButtonEnhanced from "./sound-button-enhanced"
import { useSeason } from "@/contexts/season-context"

interface CongratulationsPage9Props {
  onStartClick: () => void
}

export default function CongratulationsPage9({ onStartClick }: CongratulationsPage9Props) {
  const { selectedSeason, getThemeColors } = useSeason()
  const theme = getThemeColors()

  const getSeasonContent = () => {
    switch (selectedSeason) {
      case "lato":
        return {
          text: (
            <>
              <p className="mb-1">A to zabawne!</p>
              <p className="mb-1">Jak nazywa się ryba szpieg?</p>
              <p className="mb-2">Śledź.</p>
              <p className="italic">A tak na poważnie: Śledź to ryba morska. Jest źródłem zdrowych tłuszczów omega-3 oraz witamin D i B12.</p>
            </>
          ),
          
          speechText: "A to zabawne! Jak nazywa się ryba szpieg? Śledź. A tak na poważnie: Śledź to ryba morska. Jest źródłem zdrowych tłuszczów omega-3 oraz witamin D i B12.",
          textColor: "text-[#FF8C00]",
        }
      case "jesien":
        return {
          text: (
            <>
              <p className="mb-1">A to ciekawe!</p>
              <p className="mb-1">Rekordowe okazy dyni mogą osiągnąć</p>
              <p>nawet 1100 kg!</p>
            </>
          ),
          
          speechText: "A to ciekawe! Rekordowe okazy dyni mogą osiągnąć nawet 1100 kg!",
          textColor: "text-[#D2691E]",
        }
      case "zima":
        return {
          text: (
            <>
              <p className="mb-1">A to zabawne!</p>
              <p className="mb-1">Jak się nazywają kury jeżdżące na sankach?</p>
              <p className="mb-2">Kokosanki.</p>
              <p className="italic">A tak na poważnie: Kokosanki to ciasteczka z wiórków kokosowych, często pieczone bez mąki.</p>
            </>
          ),
          
          speechText: "A to zabawne! Jak się nazywają kury jeżdżące na sankach? Kokosanki. A tak na poważnie: Kokosanki to ciasteczka z wiórków kokosowych, często pieczone bez mąki.",
          textColor: "text-[#4682B4]",
        }
      default: // wiosna
        return {
          text: (
            <>
              <p className="mb-1">A to zabawne!</p>
              <p className="mb-1">Jak nazywamy pasącego się konia?</p>
              <p className="mb-2">Pasikonik.</p>
              <p className="italic">A tak na poważnie: Pasikonik to owad z długimi nogami, potrafiący wydawać dźwięki przez pocieranie skrzydeł.</p>
            </>
          ),
          
          speechText: "A to zabawne! Jak nazywamy pasącego się konia? Pasikonik. A tak na poważnie: Pasikonik to owad z długimi nogami, potrafiący wydawać dźwięki przez pocieranie skrzydeł.",
          textColor: "text-[#539e1b]",
        }
    }
  }

  const seasonContent = getSeasonContent()

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 overflow-hidden"
      style={{ backgroundColor: theme.backgroundColor }}>
      <div className="flex items-center justify-between w-full max-w-6xl gap-4 sm:gap-6 md:gap-4 sm:gap-6 md:gap-4 sm:gap-6 md:gap-8 lg:gap-4 sm:gap-6 md:gap-4 sm:gap-6 md:gap-8 lg:gap-16">
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
        <div className="flex flex-col items-center gap-4 sm:gap-6 md:gap-4 sm:gap-6 md:gap-8 flex-shrink-0">
          {/* Dragon character with shadow */}
          <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 xl:w-[420px] xl:h-[420px] drop-shadow-lg">
            <Image
              src={
                selectedSeason === "lato"
                  ? "/images/dragon_09_summer.svg"
                  : selectedSeason === "jesien"
                    ? "/images/dragon_09_autumn.svg"
                    : selectedSeason === "zima"
                      ? "/images/dragon_09_winter.svg"
                      : "/images/dragon_09.svg"
              }
              alt="Funny dragon"
              fill
              className="object-contain"
            />
          </div>

          {/* Buttons positioned under the dragon */}
          <div className="flex items-center gap-4 sm:gap-6 md:gap-4 sm:gap-6 md:gap-8">
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
