"use client"
import Image from "next/image"
import { useSeason } from "@/contexts/season-context"

interface CongratulationsPage2Props {
  onStartClick: () => void
}

export default function CongratulationsPage2({ onStartClick }: CongratulationsPage2Props) {
  const { selectedSeason } = useSeason()

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
          dragon: "/images/dragon_02_summer.svg",
          bgColor: "#FCFFD6",
          textColor: "text-[#FF8C00]",
        }
      case "jesien":
        return {
          text: (
            <>
              <p className="mb-1">A to zabawne!</p>
              <p className="mb-1">Jak szybko przemieszcza się burza?</p>
              <p>Błyskawicznie!</p>
            </>
          ),
          dragon: "/images/dragon_02_autumn.svg",
          bgColor: "#FFEBE3",
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
          dragon: "/images/dragon_02_winter.svg",
          bgColor: "#C3F7FD",
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
          dragon: "/images/dragon_02.svg",
          bgColor: "#edffe5",
          textColor: "text-[#539e1b]",
        }
    }
  }

  const seasonContent = getSeasonContent()

  return (
    <div
      className="w-full h-screen flex items-center justify-center px-12 overflow-hidden"
      style={{ backgroundColor: seasonContent.bgColor }}
    >
      <div className="flex items-center justify-between w-full max-w-6xl gap-16">
        {/* Speech bubble with seasonal text - 150% larger with shadow */}
        <div className="relative w-[692px] h-[317px] flex-shrink-0 drop-shadow-lg">
          <Image src="/images/cloud_text.svg" alt="Speech bubble" fill className="object-contain" />

          {/* Seasonal text overlay - left aligned, 120% larger text */}
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
              src={seasonContent.dragon || "/placeholder.svg"}
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
                src="/images/sound_icon_dragon_page.svg"
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
              <Image src="/images/start_button.svg" alt="Start button background" fill className="object-contain" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[#539e1b] font-bold text-2xl">START</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
