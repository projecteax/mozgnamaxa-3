"use client"
import Image from "next/image"
import SoundButtonEnhanced from "./sound-button-enhanced"
import { useSeason } from "@/contexts/season-context"

interface CongratulationsPage11Props {
  onStartClick: () => void
}

export default function CongratulationsPage11({ onStartClick }: CongratulationsPage11Props) {
  const { selectedSeason, getThemeColors } = useSeason()
  const theme = getThemeColors()

  const getSeasonContent = () => {
    switch (selectedSeason) {
      case "lato":
        return {
          text: (
            <>
              <p className="mb-1">A to zabawne!</p>
              <p className="mb-1">Jak nazywa się specjalista od owiec?</p>
              <p className="mb-2">Fachowiec!</p>
              <p className="italic">A tak na poważnie: Owca ma bardzo szerokie pole widzenia, dzięki czemu doskonale widzi co dzieje się za nią bez odwracania głowy!</p>
            </>
          ),
          
          speechText: "A to zabawne! Jak nazywa się specjalista od owiec? Fachowiec! A tak na poważnie: Owca ma bardzo szerokie pole widzenia, dzięki czemu doskonale widzi co dzieje się za nią bez odwracania głowy!",
          textColor: "text-[#FF8C00]",
        }
      case "jesien":
        return {
          text: (
            <>
              <p className="mb-1">A to ciekawe!</p>
              <p className="mb-1">Powietrze jesienią jest mniej wilgotne, więc</p>
              <p className="mb-1">rozpraszanie światła daje bardziej intensywny</p>
              <p>odcień błękitu przez co niebo wydaje się bardziej niebieskie.</p>
            </>
          ),
          
          speechText: "A to ciekawe! Powietrze jesienią jest mniej wilgotne, więc rozpraszanie światła daje bardziej intensywny odcień błękitu przez co niebo wydaje się bardziej niebieskie.",
          textColor: "text-[#D2691E]",
        }
      case "zima":
        return {
          text: (
            <>
              <p className="mb-1">A to zabawne!</p>
              <p className="mb-1">Gdzie Ania schowała książkę?</p>
              <p className="mb-2">Podręcznik.</p>
              <p className="italic">A tak na poważnie: Podręcznik to książka używana w szkole. Zawiera treści nauczania i pomaga uczniom zdobywać wiedzę.</p>
            </>
          ),
          
          speechText: "A to zabawne! Gdzie Ania schowała książkę? Podręcznik. A tak na poważnie: Podręcznik to książka używana w szkole. Zawiera treści nauczania i pomaga uczniom zdobywać wiedzę.",
          textColor: "text-[#4682B4]",
        }
      default: // wiosna
        return {
          text: (
            <>
              <p className="mb-1">A to zabawne!</p>
              <p className="mb-1">Jak się nazywa sekretny kret?</p>
              <p className="mb-2">Sekrecik.</p>
              <p className="italic">A tak na poważnie: Kret to ssak, który kopie korytarze pod ziemią za pomocą silnych łap. Ma słaby wzrok, ale doskonały węch i słuch.</p>
            </>
          ),
          
          speechText: "A to zabawne! Jak się nazywa sekretny kret? Sekrecik. A tak na poważnie: Kret to ssak, który kopie korytarze pod ziemią za pomocą silnych łap. Ma słaby wzrok, ale doskonały węch i słuch.",
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
                  ? "/images/dragon_11_summer.svg"
                  : selectedSeason === "jesien"
                    ? "/images/dragon_11_autumn.svg"
                    : selectedSeason === "zima"
                      ? "/images/dragon_11_winter.svg"
                      : "/images/dragon_11.svg"
              }
              alt="Dragon 11"
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
