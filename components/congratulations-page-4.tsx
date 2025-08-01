"use client"
import Image from "next/image"
import { useSeason } from "@/contexts/season-context"
import SoundButtonEnhanced from "./sound-button-enhanced"

interface CongratulationsPage4Props {
  onStartClick: () => void
}

export default function CongratulationsPage4({ onStartClick }: CongratulationsPage4Props) {
  const { selectedSeason, getThemeColors } = useSeason()
  const theme = getThemeColors()

  const getSeasonContent = () => {
    switch (selectedSeason) {
      case "lato":
        return {
          text: (
            <>
              <p className="mb-1">A to ciekawe!</p>
              <p className="mb-1">Słoneczniki podążają za słońcem – młode rośliny</p>
              <p className="mb-1">obracają się w kierunku słońca w ciągu dnia,</p>
              <p>ale dojrzałe już nie!</p>
            </>
          ),
          speechText: "A to ciekawe! Słoneczniki podążają za słońcem – młode rośliny obracają się w kierunku słońca w ciągu dnia, ale dojrzałe już nie!",
          
          textColor: "text-[#FF8C00]",
        }
      case "jesien":
        return {
          text: (
            <>
              <p className="mb-1">A to zabawne!</p>
              <p className="mb-1">Dlaczego woda nie zdała egzaminu?</p>
              <p>Bo go oblała!</p>
            </>
          ),
          speechText: "A to zabawne! Dlaczego woda nie zdała egzaminu? Bo go oblała!",
          
          textColor: "text-[#D2691E]",
        }
      case "zima":
        return {
          text: (
            <>
              <p className="mb-1">A to ciekawe!</p>
              <p className="mb-1">Choinki początkowo dekorowano owocami i świecami,</p>
              <p>dopiero później pojawiły się bombki i lampki.</p>
            </>
          ),
          speechText: "A to ciekawe! Choinki początkowo dekorowano owocami i świecami, dopiero później pojawiły się bombki i lampki.",
          
          textColor: "text-[#4682B4]",
        }
      default: // wiosna
        return {
          text: (
            <>
              <p className="mb-1">A to ciekawe!</p>
              <p className="mb-1">Tulipan rozchyla swoje płatki rano,</p>
              <p className="mb-1">a wieczorem je zamyka,</p>
              <p>by chronić się przed chłodnym powietrzem nocą.</p>
            </>
          ),
          speechText: "A to ciekawe! Tulipan rozchyla swoje płatki rano, a wieczorem je zamyka, by chronić się przed chłodnym powietrzem nocą.",
          
          textColor: "text-[#539e1b]",
        }
    }
  }

  const seasonContent = getSeasonContent()

  return (
    <div className="w-full h-screen flex items-center justify-center px-12 overflow-hidden"
      style={{ backgroundColor: theme.backgroundColor }}>
      <div className="flex items-center justify-between w-full max-w-6xl gap-16">
        {/* Speech bubble with tulip text - 150% larger with shadow */}
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
                  ? "/images/dragon_04_summer.svg"
                  : selectedSeason === "jesien"
                    ? "/images/dragon_04_autumn.svg"
                    : selectedSeason === "zima"
                      ? "/images/dragon_04_winter.svg"
                      : "/images/dragon_04.svg"
              }
              alt="Funny dragon"
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
