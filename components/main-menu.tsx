
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
    <div className="w-full h-screen bg-[#E8F4FD] relative">
      {/* Sound Icon - Top Right Corner with 50px margins */}
      <div className="absolute top-[60px] right-[60px]">
        <SoundButtonEnhanced
          text="Cześć! Jestem MAX! Będę Ci towarzyszyć podczas rozwiązywania zadań."
          soundIcon="/images/sound_main_menu.svg"
          size="lg"
          className="w-20 h-20"
        />
      </div>

      {/* Dragon - Always stuck to left bottom corner, 75% of screen height */}
      <Image
        src="/images/dragon_menu.svg"
        alt="Dragon Menu"
        width={800}
        height={800}
        className="absolute bottom-0 left-0"
        style={{ 
          height: '75vh',
          width: 'auto',
          objectFit: 'contain',
          objectPosition: 'bottom left'
        }}
      />

      {/* Cloud - Positioned relative to dragon */}
      <div 
        className="absolute"
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

      {/* Menu Buttons - Below the cloud */}
      <div className="absolute" style={{ top: 'calc(37.5vh + 50px)', left: 'calc(75vh * 1 + 80px)' }}>
        <div>
          {/* Student Login Button */}
          <button
            onClick={onStudentLogin}
            className="relative w-[clamp(200px, 25vw, 800px)] h-[clamp(40px, 5vh, 120px)] flex items-center justify-center group hover:scale-105 transition-transform duration-200"
            style={{ marginBottom: 'clamp(30px, 8vh, 90px)' }}
          >
            <Image 
              src="/images/main_menu_box.svg" 
              alt="Menu Button" 
              width={1600} 
              height={240} 
              className="w-full h-full object-contain" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                transform: 'scale(clamp(1.2, 1.5vw, 1.8))'
              }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-[#3e459c] font-sour-gummy-extrabold tracking-wide whitespace-nowrap px-2" style={{ fontSize: 'clamp(1rem, 1.8vw, 2.5rem)' }}>
              LOGOWANIE DLA UCZNIA
            </span>
          </button>

          {/* Play Without Login Button */}
          <button
            onClick={onPlayWithoutLogin}
            className="relative w-[clamp(200px, 25vw, 800px)] h-[clamp(40px, 5vh, 120px)] flex items-center justify-center group hover:scale-105 transition-transform duration-200"
            style={{ marginBottom: 'clamp(30px, 8vh, 90px)' }}
          >
            <Image 
              src="/images/main_menu_box.svg" 
              alt="Menu Button" 
              width={1600} 
              height={240} 
              className="w-full h-full object-contain" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                transform: 'scale(clamp(1.2, 1.5vw, 1.8))'
              }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-[#3e459c] font-sour-gummy-extrabold tracking-wide whitespace-nowrap px-2" style={{ fontSize: 'clamp(1rem, 1.8vw, 2.5rem)' }}>
              ZAGRAJ BEZ LOGOWANIA
            </span>
          </button>

          {/* Teacher Login Button */}
          <button
            onClick={onTeacherLogin}
            className="relative w-[clamp(200px, 25vw, 800px)] h-[clamp(40px, 5vh, 120px)] flex items-center justify-center group hover:scale-105 transition-transform duration-200"
          >
            <Image 
              src="/images/main_menu_box.svg" 
              alt="Menu Button" 
              width={1600} 
              height={240} 
              className="w-full h-full object-contain" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                transform: 'scale(clamp(1.2, 1.5vw, 1.8))'
              }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-[#3e459c] font-sour-gummy-extrabold tracking-wide whitespace-nowrap px-2" style={{ fontSize: 'clamp(1rem, 1.8vw, 2.5rem)' }}>
              LOGOWANIE DLA NAUCZYCIELA
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}