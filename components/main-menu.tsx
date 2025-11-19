
"use client"

import Image from "next/image"
import SoundButtonEnhanced from "./sound-button-enhanced"

interface MainMenuProps {
  onStudentLogin: () => void
  onTeacherLogin: () => void
  onPlayWithoutLogin: () => void
}

export default function MainMenu({
  onStudentLogin,
  onTeacherLogin,
  onPlayWithoutLogin,
}: MainMenuProps) {
  return (
    <div className="w-full h-screen bg-[#E8F4FD] relative overflow-hidden">
      {/* Sound Icon - Top Right Corner with 50px margins */}
      <div className="absolute top-[60px] right-[60px] z-30">
        <SoundButtonEnhanced
          text="Cześć! Jestem MAX! Będę Ci towarzyszyć podczas rozwiązywania zadań."
          soundIcon="/images/sound_main_menu.svg"
          size="lg"
          className="w-20 h-20"
        />
      </div>

      {/* Dragon - Always stuck to left bottom corner, 75% of screen height, above footer */}
      <Image
        src="/images/dragon_menu.svg"
        alt="Dragon Menu"
        width={800}
        height={800}
        className="absolute bottom-0 left-0 z-10"
        style={{ 
          height: '75vh',
          width: 'auto',
          objectFit: 'contain',
          objectPosition: 'bottom left'
        }}
      />

      {/* Cloud - Positioned relative to dragon */}
      <div 
        className="absolute z-20"
        style={{
          top: 'calc(25vh - 18.75vh - 20px)',
          left: 'calc(75vh - 120px)',
          width: 'clamp(75vh, 75vh, 75vh)',
          height: 'clamp(37.5vh, 37.5vh, 37.5vh)'
        }}
      >
        <Image
          src="/images/cloud_main_menu.svg"
          alt="Cloud"
          width={1250}
          height={625}
          className="w-full h-full object-contain"
        />
        <div className="absolute inset-3 flex items-center justify-center px-1 py-1" style={{ transform: 'translateY(-10px)' }}>
          <span className="text-[#3e459c] font-sour-gummy text-left leading-tight" style={{ 
            fontSize: 'clamp(0.8rem, 1.4vw, 2.8rem)', 
            marginLeft: 'clamp(8px, 2.5vw, 25px)',
            maxWidth: '90%',
            wordWrap: 'break-word',
            fontWeight: 'normal'
          }}>
            Cześć! Jestem MAX! Będę Ci towarzyszyć podczas rozwiązywania zadań. <br/><br/>
            
          </span>
        </div>
      </div>

      {/* Menu Buttons Container - Spans from dragon's right edge to screen's right edge */}
      <div 
        className="absolute buttons-container z-20" 
        style={{ 
          top: 'clamp(200px, calc(37.5vh + 50px), 400px)', 
          left: '75vh',
          right: '0',
          width: 'calc(100vw - 75vh)',
          height: 'auto',
          paddingLeft: 'clamp(20px, 3vw, 60px)',
          paddingRight: '20px',
          paddingBottom: 'clamp(80px, 15vh, 120px)', // Responsive space for footer
          boxSizing: 'border-box'
        }}
      >
        <div className="flex flex-col items-start button-gap w-full">
          {/* Student Login Button */}
          <button
            onClick={onStudentLogin}
            className="relative group hover:scale-105 transition-transform duration-200 menu-button"
            style={{ 
              width: 'clamp(250px, 40vw, 600px)', 
              height: 'clamp(60px, 8vh, 120px)',
              maxWidth: '100%'
            }}
          >
            <Image 
              src="/images/main_menu_box.svg" 
              alt="Menu Button" 
              width={800} 
              height={160} 
              className="w-full h-full object-contain" 
            />
            <span className="absolute inset-0 flex items-center justify-center text-[#3e459c] font-sour-gummy-extrabold tracking-wide whitespace-nowrap px-4 button-text">
              LOGOWANIE DLA UCZNIA
            </span>
          </button>

          {/* Play Without Login Button */}
          <button
            onClick={onPlayWithoutLogin}
            className="relative group hover:scale-105 transition-transform duration-200 menu-button"
            style={{ 
              width: 'clamp(250px, 40vw, 600px)', 
              height: 'clamp(60px, 8vh, 120px)',
              maxWidth: '100%'
            }}
          >
            <Image 
              src="/images/main_menu_box.svg" 
              alt="Menu Button" 
              width={800} 
              height={160} 
              className="w-full h-full object-contain" 
            />
            <span className="absolute inset-0 flex items-center justify-center text-[#3e459c] font-sour-gummy-extrabold tracking-wide whitespace-nowrap px-4 button-text">
              ZAGRAJ BEZ LOGOWANIA
            </span>
          </button>

          {/* Teacher Login Button */}
          <button
            onClick={onTeacherLogin}
            className="relative group hover:scale-105 transition-transform duration-200 menu-button"
            style={{ 
              width: 'clamp(250px, 40vw, 600px)', 
              height: 'clamp(60px, 8vh, 120px)',
              maxWidth: '100%'
            }}
          >
            <Image 
              src="/images/main_menu_box.svg" 
              alt="Menu Button" 
              width={800} 
              height={160} 
              className="w-full h-full object-contain" 
            />
            <span className="absolute inset-0 flex items-center justify-center text-[#3e459c] font-sour-gummy-extrabold tracking-wide whitespace-nowrap px-4 button-text">
              LOGOWANIE DLA NAUCZYCIELA
            </span>
          </button>
        </div>
      </div>

      {/* Footer with CC License - Fixed at bottom, below dragon - Compact with full text */}
      <div className="absolute bottom-0 left-0 right-0 z-0 bg-white/95 border-t border-gray-200 py-1 px-2 footer-cc" style={{ minHeight: 'clamp(60px, 12vh, 100px)' }}>
        <div className="w-full mx-auto max-w-6xl">
          <div className="flex flex-col items-center gap-1">
            {/* CC License Badge - At the very bottom, responsive size */}
            <a
              href="https://creativecommons.org/licenses/by/4.0/deed.pl"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <img
                src="https://mirrors.creativecommons.org/presskit/buttons/88x31/svg/by.svg"
                alt="CC BY 4.0"
                className="cc-badge-size"
              />
            </a>

            {/* License Text - Full text but very responsive font */}
            <div className="text-center text-gray-700 font-sour-gummy leading-tight space-y-0.5 footer-text-container">
              <p className="footer-text">
                Niniejszy materiał opublikowany jest na licencji{" "}
                <strong>CC BY 4.0 (Creative Commons – Uznanie autorstwa – 4.0 Międzynarodowe)</strong>.
                Szczegóły licencji znajdziesz{" "}
                <a
                  href="https://creativecommons.org/licenses/by/4.0/deed.pl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline font-bold"
                >
                  TUTAJ
                </a>
                .
              </p>
              <p className="footer-text">
                Co do zasady masz prawo do korzystania, używania i remiksowania niniejszego materiału w celach komercyjnych i niekomercyjnych, 
                przy jednoczesnej konieczności podania autorów i autorek materiału.
              </p>
              <p className="footer-text">
                Prosimy również, aby podać informację, że materiał powstał w ramach projektu{" "}
                <strong>„POPOJUTRZE 3.0 – KSZTAŁCENIE"</strong>,{" "}
                <a
                  href="https://www.popojutrze.pl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline font-bold"
                >
                  www.popojutrze.pl
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        /* Text scaling - scales proportionally with button height using vh units */
        .button-text {
          font-size: clamp(1rem, 2vh, 2.5rem) !important;
          max-height: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.2 !important;
          padding: 0 clamp(4px, 0.5vw, 12px) !important;
        }
        
        /* Progressive text scaling based on viewport height - matches button scaling */
        @media (max-width: 1366px) {
          .button-text {
            font-size: clamp(0.9rem, 1.8vh, 2.2rem) !important;
          }
        }
        @media (max-width: 1200px) {
          .button-text {
            font-size: clamp(0.85rem, 1.6vh, 2rem) !important;
          }
        }
        @media (max-width: 1024px) {
          .button-text {
            font-size: clamp(0.75rem, 1.4vh, 1.8rem) !important;
          }
        }
        @media (max-width: 768px) {
          .button-text {
            font-size: clamp(0.7rem, 1.2vh, 1.5rem) !important;
          }
        }
        @media (max-width: 600px) {
          .button-text {
            font-size: clamp(0.65rem, 1vh, 1.3rem) !important;
          }
        }
        
        .buttons-container {
          /* Container spans from dragon's right edge (75vh) to screen's right edge (100vw) */
          /* This ensures buttons never overlap dragon and always fit on screen */
        }

        /* Responsive button gap - scales with viewport - doubled spacing */
        .button-gap {
          gap: clamp(3vh, 4vh, 6vh) !important;
        }

        /* Progressive button scaling - consistent with dragon */
        .menu-button {
          width: clamp(200px, 35vw, 600px) !important;
          height: clamp(50px, 7vh, 120px) !important;
        }

        @media (max-width: 1200px) {
          .menu-button {
            width: clamp(180px, 32vw, 550px) !important;
            height: clamp(45px, 6.5vh, 110px) !important;
          }
          .button-gap {
            gap: clamp(2.4vh, 3.6vh, 5vh) !important;
          }
        }

        @media (max-width: 1024px) {
          .buttons-container {
            left: 75vh !important;
            width: calc(100vw - 75vh) !important;
            paddingLeft: clamp(10px, 2vw, 40px) !important;
            paddingRight: 20px !important;
          }
          .menu-button {
            width: clamp(160px, 30vw, 500px) !important;
            height: clamp(40px, 6vh, 100px) !important;
          }
          .button-gap {
            gap: clamp(2vh, 3vh, 4vh) !important;
          }
        }

        @media (max-width: 768px) {
          .buttons-container {
            left: 0 !important;
            width: 100vw !important;
            paddingLeft: 20px !important;
            paddingRight: 20px !important;
          }
          .menu-button {
            width: clamp(140px, 28vw, 450px) !important;
            height: clamp(35px, 5.5vh, 90px) !important;
          }
          .button-gap {
            gap: clamp(1.6vh, 2.4vh, 3.6vh) !important;
          }
        }

        /* Footer CC License - Very responsive sizing */
        .footer-cc {
          padding-left: clamp(75vh, 75vh, 75vh) !important;
        }

        .cc-badge-size {
          height: clamp(8px, 1.2vh, 20px) !important;
          width: auto !important;
        }

        .footer-text {
          font-size: clamp(6px, 0.8vw, 12px) !important;
          padding: 0 clamp(2px, 0.3vw, 8px) !important;
          line-height: 1.2 !important;
        }

        .footer-text-container {
          max-width: calc(100vw - 75vh) !important;
        }

        /* Adjust footer for very small screens */
        @media (max-width: 1200px) {
          .footer-cc {
            padding-left: clamp(50vh, 60vh, 75vh) !important;
          }
          .footer-text-container {
            max-width: calc(100vw - clamp(50vh, 60vh, 75vh)) !important;
          }
        }

        @media (max-width: 768px) {
          .footer-cc {
            padding-left: 0 !important;
          }
          .footer-text-container {
            max-width: 100vw !important;
            padding: 0 10px !important;
          }
          .footer-text {
            font-size: clamp(7px, 1vw, 10px) !important;
          }
        }

        @media (max-width: 600px) {
          .footer-text {
            font-size: clamp(6px, 0.9vw, 9px) !important;
          }
          .cc-badge-size {
            height: clamp(6px, 1vh, 16px) !important;
          }
        }
      `}</style>
    </div>
  )
}