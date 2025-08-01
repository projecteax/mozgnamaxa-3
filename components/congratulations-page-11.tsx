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
              <p>Fachowiec!</p>
            </>
          ),
          
          speechText: "A to zabawne! Jak nazywa się specjalista od owiec? <p>Fachowiec! </> )",
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
          
          speechText: "A to ciekawe! Powietrze jesienią jest mniej wilgotne, więc rozpraszanie światła daje bardziej intensywny <p>odcień błękitu przez co niebo wydaje się bardziej niebieskie. </> )",
          textColor: "text-[#D2691E]",
        }
      case "zima":
        return {
          text: (
            <>
              <p className="mb-1">A to zabawne!</p>
              <p className="mb-1">Gdzie Ania schowała książkę?</p>
              <p>Podręcznik.</p>
            </>
          ),
          
          speechText: "A to zabawne! Gdzie Ania schowała książkę? <p>Podręcznik. </> )",
          textColor: "text-[#4682B4]",
        }
      default: // wiosna
        return {
          text: (
            <>
              <p className="mb-1">A to zabawne!</p>
              <p className="mb-1">Jak się nazywa sekretny kret?</p>
              <p>Sekrecik.</p>
            </>
          ),
          
          speechText: "A to zabawne! Jak się nazywa sekretny kret? <p>Sekrecik. </> )",
          textColor: "text-[#539e1b]",
        }
    }
  }

  const seasonContent = getSeasonContent()

  return (
    <div className="w-full h-screen flex items-center justify-center px-12 overflow-hidden"
      style={{ backgroundColor: theme.backgroundColor }}>
      <div className="flex items-center justify-between w-full max-w-6xl gap-16">
        {/* Speech bubble with new text - 150% larger with shadow */}
        <div className="relative w-[692px] h-[317px] flex-shrink-0 drop-shadow-lg">
          <Image src="/images/cloud_text.svg" alt="Speech bubble" fill className="object-contain" />

          {/* Text overlay - left aligned, 120% larger text */}
          <div className="absolute inset-0 flex flex-col justify-center pl-16 pr-12">
            <div className={`font-bold text-2xl leading-tight text-left dragon-speech-text ${seasonContent.textColor}`}>
              {seasonContent.text}
            </div>
          </div>
        </div>

        {/* Dragon and buttons column */}
        <div className="flex flex-col items-center gap-8 flex-shrink-0">
          {/* Dragon character with shadow */}
          <div className="relative w-[420px] h-[420px] drop-shadow-lg">
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
          <div className="flex items-center gap-8">
            {/* Sound button with speech functionality */}
            <SoundButtonEnhanced 
              text={seasonContent.speechText}
              soundIcon={theme.soundIcon}
              size="md"
            />
            

            {/* START button with shadow */}
            <div
              className="relative w-48 h-12 cursor-pointer hover:scale-105 transition-transform drop-shadow-lg"
              onClick={onStartClick}
            >
              <Image src="/images/start_button.svg" alt="Start button background" fill className="object-contain" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-bold text-2xl" style={{ color: theme.buttonColor }}>START</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
