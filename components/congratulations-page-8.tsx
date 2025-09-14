"use client"
import Image from "next/image"
import SoundButtonEnhanced from "./sound-button-enhanced"
import { useSeason } from "@/contexts/season-context"

interface CongratulationsPage8Props {
  onStartClick: () => void
}

export default function CongratulationsPage8({ onStartClick }: CongratulationsPage8Props) {
  const { selectedSeason, getThemeColors } = useSeason()
  const theme = getThemeColors()

  const getSeasonContent = () => {
    switch (selectedSeason) {
      case "lato":
        return {
          text: (
            <>
              <p className="mb-1">A to ciekawe!</p>
              <p className="mb-1">W sierpniu obserwować możemy noce spadających</p>
              <p className="mb-1">gwiazd. Są to Perseidy, czyli jedne</p>
              <p>z najpiękniejszych rojów meteorów.</p>
            </>
          ),
          
          speechText: "A to ciekawe! W sierpniu obserwować możemy noce spadających gwiazd. Są to Perseidy, czyli jedne z najpiękniejszych rojów meteorów.",
          textColor: "text-[#FF8C00]",
        }
      case "jesien":
        return {
          text: (
            <>
              <p className="mb-1">A to zabawne!</p>
              <p className="mb-1">Co ma wspólnego łyżka z jesienią?</p>
              <p className="mb-2">Je się nią.</p>
              <p className="italic">A tak na poważnie: Jesień to czas zbiorów — dynie, buraki, ziemniaki to idealne produkty na pyszne dania.</p>
            </>
          ),
          
          speechText: "A to zabawne! Co ma wspólnego łyżka z jesienią? Je się nią. A tak na poważnie: Jesień to czas zbiorów — dynie, buraki, ziemniaki to idealne produkty na pyszne dania.",
          textColor: "text-[#D2691E]",
        }
      case "zima":
        return {
          text: (
            <>
              <p className="mb-1">A to ciekawe!</p>
              <p className="mb-1">Niektóre zwierzęta zmieniają kolor futra –</p>
              <p className="mb-1">na przykład lis polarny czy zając bielak</p>
              <p>latem są brązowe, a zimą białe.</p>
            </>
          ),
          
          speechText: "A to ciekawe! Niektóre zwierzęta zmieniają kolor futra – na przykład lis polarny czy zając bielak latem są brązowe, a zimą białe.",
          textColor: "text-[#4682B4]",
        }
      default: // wiosna
        return {
          text: (
            <>
              <p className="mb-1">A to ciekawe!</p>
              <p className="mb-1">Wiosną często występują burze.</p>
              <p>To czas, kiedy zimne i ciepłe powietrze spotykają się, tworząc zjawiska atmosferyczne.</p>
            </>
          ),
          
          speechText: "A to ciekawe! Wiosną często występują burze. To czas, kiedy zimne i ciepłe powietrze spotykają się, tworząc zjawiska atmosferyczne.",
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
                  ? "/images/dragon_08_summer.svg"
                  : selectedSeason === "jesien"
                    ? "/images/dragon_08_autumn.svg"
                    : selectedSeason === "zima"
                      ? "/images/dragon_08_winter.svg"
                      : "/images/dragon_08.svg"
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
