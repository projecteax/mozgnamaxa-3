"use client"
import Image from "next/image"
import { useSeason } from "@/contexts/season-context"
import SoundButtonEnhanced from "./sound-button-enhanced"

interface CongratulationsPage3Props {
  onStartClick: () => void
}

export default function CongratulationsPage3({ onStartClick }: CongratulationsPage3Props) {
  const { selectedSeason, getThemeColors } = useSeason()
  const theme = getThemeColors()

  const getSeasonContent = () => {
    switch (selectedSeason) {
      case "lato":
        return {
          text: (
            <>
              <p className="mb-1">A to zabawne!</p>
              <p className="mb-1">Przez jakie ryby można skakać?</p>
              <p className="mb-2">Przez płotki!</p>
              <p className="italic">A tak na poważnie: Płotka to niewielka ryba słodkowodna żyjąca w jeziorach i rzekach. Jej ciało jest spłaszczone i błyszczące.</p>
            </>
          ),
          speechText: "A to zabawne! Przez jakie ryby można skakać? Przez płotki! A tak na poważnie: Płotka to niewielka ryba słodkowodna żyjąca w jeziorach i rzekach. Jej ciało jest spłaszczone i błyszczące.",
          dragon: "/images/dragon_03_summer.svg",
          
          textColor: "text-[#FF8C00]",
        }
      case "jesien":
        return {
          text: (
            <>
              <p className="mb-1">A to zabawne!</p>
              <p className="mb-1">Co robi drzewo gdy się nudzi?</p>
              <p>Liście się!</p>
            </>
          ),
          speechText: "A to zabawne! Co robi drzewo gdy się nudzi? Liście się!",
          dragon: "/images/dragon_03_autumn.svg",
          
          textColor: "text-[#D2691E]",
        }
      case "zima":
        return {
          text: (
            <>
              <p className="mb-1">A to zabawne!</p>
              <p className="mb-1">Jaka część ciała najwięcej razy mówi „pa"?</p>
              <p className="mb-2">Stopa.</p>
              <p className="italic">A tak na poważnie: Stopy umożliwiają nam chodzenie i utrzymanie równowagi. Składają się z 26 kości i ponad 100 mięśni, więzadeł i ścięgien!</p>
            </>
          ),
          speechText: "A to zabawne! Jaka część ciała najwięcej razy mówi pa? Stopa. A tak na poważnie: Stopy umożliwiają nam chodzenie i utrzymanie równowagi. Składają się z 26 kości i ponad 100 mięśni, więzadeł i ścięgien!",
          dragon: "/images/dragon_03_winter.svg",
          
          textColor: "text-[#4682B4]",
        }
      default: // wiosna
        return {
          text: (
            <>
              <p className="mb-1">A to zabawne!</p>
              <p className="mb-1">Jak nazywa się mrówka, która ma jad?</p>
              <p className="mb-2">Mrówkojad!</p>
              <p className="italic">A tak na poważnie: Mrówkojad to ssak z Ameryki Południowej. Nie ma zębów, a językiem, który może mieć nawet 60 cm długości, zjada mrówki i termity!</p>
            </>
          ),
          speechText: "A to zabawne! Jak nazywa się mrówka, która ma jad? Mrówkojad! A tak na poważnie: Mrówkojad to ssak z Ameryki Południowej. Nie ma zębów, a językiem, który może mieć nawet 60 cm długości, zjada mrówki i termity!",
          dragon: "/images/dragon_03.svg",
          
          textColor: "text-[#539e1b]",
        }
    }
  }

  const seasonContent = getSeasonContent()

  return (
    <div
      className="w-full h-screen flex items-center justify-center px-12 overflow-hidden"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <div className="flex items-center justify-between w-full max-w-6xl gap-16">
        {/* Speech bubble with seasonal text - 40% larger with shadow */}
        <div className="relative w-[969px] h-[444px] flex-shrink-0 drop-shadow-lg">
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
