"use client"
import Image from "next/image"
import { useSeason } from "@/contexts/season-context"

interface CongratulationsPageProps {
  onStartClick: () => void
}

export default function CongratulationsPage({ onStartClick }: CongratulationsPageProps) {
  const { selectedSeason } = useSeason()

  // Get season-specific content
  const getSeasonContent = () => {
    switch (selectedSeason) {
      case "lato":
        return {
          text: (
            <>
              <p className="mb-1">A to zabawne!</p>
              <p className="mb-1">W jakie dni pokrzywa nie parzy?</p>
              <p>W nieparzyste!</p>
            </>
          ),
          dragonImage: "/images/dragon_01_summer.svg",
          soundIcon: "/images/sound_summer.svg",
          startButtonBg: "/images/start_summer.svg",
          bgColor: "bg-[#FCFFD6]",
          textColor: "text-[#FF8C00]",
        }
      case "jesien":
        return {
          text: (
            <>
              <p className="mb-1">A to ciekawe!</p>
              <p className="mb-1">Za jesienne zapachy nie odpowiadają tylko liście.</p>
              <p>Wilgoć w powietrzu uwalnia aromaty z ziemi, grzybów i kory drzew.</p>
            </>
          ),
          dragonImage: "/images/dragon_01_autumn.svg",
          soundIcon: "/images/sound_autumn.svg",
          startButtonBg: "/images/start_button.svg",
          bgColor: "bg-[#FFEBE3]",
          textColor: "text-[#D2691E]",
        }
      case "zima":
        return {
          text: (
            <>
              <p className="mb-1">A to zabawne!</p>
              <p className="mb-1">Co robi rzeka jak jej się coś nie podoba?</p>
              <p>Narzeka.</p>
            </>
          ),
          dragonImage: "/images/dragon_01_winter.svg",
          soundIcon: "/images/sound_winter.svg",
          startButtonBg: "/images/start_button.svg",
          bgColor: "bg-[#C3F7FD]",
          textColor: "text-[#4682B4]",
        }
      default: // spring/wiosna
        return {
          text: (
            <>
              <p className="mb-1">A to zabawne!</p>
              <p className="mb-1">Jak się czuje ogórek w śmietanie?</p>
              <p>Mizernie!</p>
            </>
          ),
          dragonImage: "/images/dragon_01.svg",
          soundIcon: "/images/sound_icon_dragon_page.svg",
          startButtonBg: "/images/start_button.svg",
          bgColor: "bg-[#edffe5]",
          textColor: "text-[#539e1b]",
        }
    }
  }

  const seasonContent = getSeasonContent()

  return (
    <div className={`w-full h-screen ${seasonContent.bgColor} flex items-center justify-center px-12 overflow-hidden`}>
      <div className="flex items-center justify-between w-full max-w-6xl gap-16">
        {/* Speech bubble with joke text - 150% larger with shadow */}
        <div className="relative w-[692px] h-[317px] flex-shrink-0 drop-shadow-lg">
          <Image src="/images/cloud_text.svg" alt="Speech bubble" fill className="object-contain" />

          {/* Joke text overlay - left aligned, 120% larger text */}
          <div className="absolute inset-0 flex flex-col justify-center pl-20 pr-16">
            <div className={`font-bold text-3xl leading-tight text-left dragon-speech-text ${seasonContent.textColor}`}>
              {seasonContent.text}
            </div>
          </div>
        </div>

        {/* Dragon and buttons column */}
        <div className="flex flex-col items-center gap-8 flex-shrink-0">
          {/* Dragon character with shadow */}
          <div className="relative w-[420px] h-[420px] drop-shadow-lg">
            <Image
              src={seasonContent.dragonImage || "/placeholder.svg"}
              alt="Funny dragon"
              fill
              className="object-contain"
            />
          </div>

          {/* Buttons positioned under the dragon */}
          <div className="flex items-center gap-8">
            {/* Sound button without white circle, with shadow */}
            <div className="w-16 h-16 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform drop-shadow-lg">
              <Image
                src={seasonContent.soundIcon || "/placeholder.svg"}
                alt="Sound"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>

            {/* START button with shadow */}
            <div
              className="relative w-48 h-12 cursor-pointer hover:scale-105 transition-transform drop-shadow-lg"
              onClick={onStartClick}
            >
              <Image
                src={seasonContent.startButtonBg || "/placeholder.svg"}
                alt="Start button background"
                fill
                className="object-contain"
              />
              {/* Only show START text for non-summer seasons */}
              {selectedSeason !== "lato" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`font-bold text-2xl ${seasonContent.textColor}`}>START</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
