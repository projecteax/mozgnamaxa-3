
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
          paddingBottom: '100px', // Space for footer with full text
          boxSizing: 'border-box'
        }}
      >
        <div className="flex flex-col items-start gap-8 w-full">
          {/* Student Login Button */}
          <button
            onClick={onStudentLogin}
            className="relative group hover:scale-105 transition-transform duration-200"
            style={{ 
              width: 'clamp(250px, 40vw, 600px)', 
              height: 'clamp(60px, 8vh, 120px)',
              marginBottom: 'clamp(20px, 5vh, 60px)',
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
            className="relative group hover:scale-105 transition-transform duration-200"
            style={{ 
              width: 'clamp(250px, 40vw, 600px)', 
              height: 'clamp(60px, 8vh, 120px)',
              marginBottom: 'clamp(20px, 5vh, 60px)',
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
            className="relative group hover:scale-105 transition-transform duration-200"
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
      <div className="absolute bottom-0 left-0 right-0 z-0 bg-white/95 border-t border-gray-200 py-1 px-2 footer-cc">
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
        /* Text scaling - scales proportionally with button size */
        .button-text {
          font-size: clamp(0.9rem, 1.8vw, 2.2rem);
          max-height: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        @media (max-width: 1366px) {
          .button-text {
            font-size: clamp(0.85rem, 1.6vw, 2rem);
          }
        }
        @media (max-width: 1024px) {
          .button-text {
            font-size: clamp(0.8rem, 1.4vw, 1.8rem);
          }
        }
        @media (max-width: 768px) {
          .button-text {
            font-size: clamp(0.75rem, 1.2vw, 1.5rem);
          }
        }
        
        .buttons-container {
          /* Container spans from dragon's right edge (75vh) to screen's right edge (100vw) */
          /* This ensures buttons never overlap dragon and always fit on screen */
        }
        
        /* On smaller screens where 75vh might be too wide, adjust container */
        @media (max-width: 1024px) {
          .buttons-container {
            left: 75vh !important;
            width: calc(100vw - 75vh) !important;
            paddingLeft: clamp(10px, 2vw, 40px) !important;
            paddingRight: 20px !important;
          }
        }
        @media (max-width: 768px) {
          .buttons-container {
            left: 0 !important;
            width: 100vw !important;
            paddingLeft: 20px !important;
            paddingRight: 20px !important;
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