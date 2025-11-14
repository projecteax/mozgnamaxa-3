"use client"
import { useState } from "react"
import Image from "next/image"
import SoundButtonEnhanced from "./sound-button-enhanced"
import StudentGameMenu from "./student-game-menu"
import { useSeason } from "@/contexts/season-context"

interface CongratulationsPage9Props {
  onGoHome?: () => void
  onLogin?: () => void
  onLogout?: () => void
  onStartClick: () => void
}

export default function CongratulationsPage9({ onStartClick, onGoHome, onLogin, onLogout }: CongratulationsPage9Props) {
  const { selectedSeason, getThemeColors } = useSeason()
  const theme = getThemeColors()
  const [showMenu, setShowMenu] = useState(false)

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
          textColor: "text-[#CC6600]",
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
          textColor: "text-[#8B4513]",
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
    <div className="w-full min-h-screen flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden relative"
      style={{ backgroundColor: theme.backgroundColor }}>
      {/* Menu icon in top right corner */}
      {onGoHome && (
        <div className="absolute top-4 right-4 z-40">
          <div className="relative w-16 h-16" onClick={() => setShowMenu(!showMenu)}>
            <Image
              src={theme.menuIcon || "/placeholder.svg"}
              alt="Menu"
              fill
              className="object-contain cursor-pointer"
              style={{
                filter: "drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3))",
              }}
            />
          </div>
        </div>
      )}

      {/* Menu dropdown */}
      {showMenu && onGoHome && (
        <StudentGameMenu 
          onGoHome={onGoHome} 
          onLogout={onLogout || (() => {})} 
          onClose={() => setShowMenu(false)}
          onLogin={onLogin}
        />
      )}
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
