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
      className="w-full min-h-screen flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <div className="flex flex-col lg:flex-row items-center justify-between w-full max-w-6xl gap-2 sm:gap-4 md:gap-6">
        {/* Speech bubble with seasonal text */}
        <div className="relative w-full max-w-[390px] sm:max-w-[520px] md:max-w-[650px] lg:max-w-[780px] aspect-[969/444] flex-shrink-0 drop-shadow-lg">
          <Image src="/images/cloud_text.svg" alt="Speech bubble" fill className="object-contain" />

          {/* Seasonal text overlay */}
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
              src={seasonContent.dragon || "/placeholder.svg"}
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
