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
          
          speechText: "A to ciekawe! W sierpniu obserwować możemy noce spadających gwiazd. Są to Perseidy, czyli jedne <p>z najpiękniejszych rojów meteorów. </> )",
          textColor: "text-[#FF8C00]",
        }
      case "jesien":
        return {
          text: (
            <>
              <p className="mb-1">A to zabawne!</p>
              <p className="mb-1">Co ma wspólnego łyżka z jesienią?</p>
              <p>Je się nią.</p>
            </>
          ),
          
          speechText: "A to zabawne! Co ma wspólnego łyżka z jesienią? <p>Je się nią. </> )",
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
          
          speechText: "A to ciekawe! Niektóre zwierzęta zmieniają kolor futra – na przykład lis polarny czy zając bielak <p>latem są brązowe, a zimą białe. </> )",
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
          
          speechText: "A to ciekawe! Wiosną często występują burze. <p>To czas, kiedy zimne i ciepłe powietrze spotykają się, tworząc zjawiska atmosferyczne. </> )",
          textColor: "text-[#539e1b]",
        }
    }
  }

  const seasonContent = getSeasonContent()

  return (
    <div className="w-full h-screen flex items-center justify-center px-12 overflow-hidden"
      style={{ backgroundColor: theme.backgroundColor }}>
      <div className="flex items-center justify-between w-full max-w-6xl gap-16">
        {/* Speech bubble with hibernation text - 150% larger with shadow */}
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
