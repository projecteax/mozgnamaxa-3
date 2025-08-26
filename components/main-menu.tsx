"use client"

import Image from "next/image"

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
    <div className="min-h-screen bg-gradient-to-b from-[#e3f7ff] to-[#b8e6ff] flex flex-col items-center justify-center p-8 relative">
      <div className="flex flex-col items-center space-y-16 w-full max-w-md ml-[25%] z-50">
        {/* Student Login Button */}
        <button
          onClick={onStudentLogin}
          className="relative w-full h-[120px] flex items-center justify-center group hover:scale-105 transition-transform duration-200"
        >
          <Image src="/images/main_menu_box.svg" alt="Menu Button" width={323} height={51} className="w-full h-full" style={{ transform: 'scale(2)' }} />
          <span className="absolute inset-0 flex items-center justify-center text-[#3e459c] font-bold text-[4.4rem] font-dongle tracking-wide whitespace-nowrap">
            LOGOWANIE DLA UCZNIA
          </span>
        </button>

        {/* Teacher Login Button */}
        <button
          onClick={onTeacherLogin}
          className="relative w-full h-[120px] flex items-center justify-center group hover:scale-105 transition-transform duration-200"
        >
          <Image src="/images/main_menu_box.svg" alt="Menu Button" width={323} height={51} className="w-full h-full" style={{ transform: 'scale(2)' }} />
          <span className="absolute inset-0 flex items-center justify-center text-[#3e459c] font-bold text-[4.4rem] font-dongle tracking-wide whitespace-nowrap">
            LOGOWANIE DLA NAUCZYCIELA
          </span>
        </button>

        {/* Play Without Login Button */}
        <button
          onClick={onPlayWithoutLogin}
          className="relative w-full h-[120px] flex items-center justify-center group hover:scale-105 transition-transform duration-200"
        >
          <Image src="/images/main_menu_box.svg" alt="Menu Button" width={323} height={51} className="w-full h-full" style={{ transform: 'scale(2)' }} />
          <span className="absolute inset-0 flex items-center justify-center text-[#3e459c] font-bold text-[4.4rem] font-dongle tracking-wide whitespace-nowrap">
            ZAGRAJ BEZ LOGOWANIA
          </span>
        </button>
      </div>

      {/* Dragon in bottom left corner */}
      <div className="absolute bottom-0 left-0 z-10">
        <Image
          src="/images/dragon_menu.svg"
          alt="Dragon Menu"
          width={1440}
          height={1920}
          className="object-contain"
          style={{ 
            width: '480px', 
            height: '640px',
            maxWidth: 'none',
            maxHeight: 'none'
          }}
        />
      </div>
    </div>
  )
}
