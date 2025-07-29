"use client"

import Image from "next/image"

interface MainMenuProps {
  onStudentLogin: () => void
  onTeacherLogin: () => void
  onTeacherRegister: () => void
  onPlayWithoutLogin: () => void
}

export default function MainMenu({
  onStudentLogin,
  onTeacherLogin,
  onTeacherRegister,
  onPlayWithoutLogin,
}: MainMenuProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e3f7ff] to-[#b8e6ff] flex flex-col items-center justify-center p-8">
      <div className="flex flex-col items-center space-y-8 w-full max-w-md">
        {/* Student Login Button */}
        <button
          onClick={onStudentLogin}
          className="relative w-full h-[60px] flex items-center justify-center group hover:scale-105 transition-transform duration-200"
        >
          <Image src="/images/main_menu_box.svg" alt="Menu Button" width={323} height={51} className="w-full h-full" />
          <span className="absolute inset-0 flex items-center justify-center text-[#3e459c] font-bold text-lg font-dongle tracking-wide">
            LOGOWANIE DLA UCZNIA
          </span>
        </button>

        {/* Teacher Register Button */}
        <button
          onClick={onTeacherRegister}
          className="relative w-full h-[60px] flex items-center justify-center group hover:scale-105 transition-transform duration-200"
        >
          <Image src="/images/main_menu_box.svg" alt="Menu Button" width={323} height={51} className="w-full h-full" />
          <span className="absolute inset-0 flex items-center justify-center text-[#3e459c] font-bold text-lg font-dongle tracking-wide">
            UTWÓRZ KONTO
          </span>
        </button>

        {/* Play Without Login Button */}
        <button
          onClick={onPlayWithoutLogin}
          className="relative w-full h-[60px] flex items-center justify-center group hover:scale-105 transition-transform duration-200"
        >
          <Image src="/images/main_menu_box.svg" alt="Menu Button" width={323} height={51} className="w-full h-full" />
          <span className="absolute inset-0 flex items-center justify-center text-[#3e459c] font-bold text-lg font-dongle tracking-wide">
            ZAGRAJ BEZ LOGOWANIA
          </span>
        </button>

        {/* Teacher Login Button */}
        <button
          onClick={onTeacherLogin}
          className="relative w-full h-[60px] flex items-center justify-center group hover:scale-105 transition-transform duration-200"
        >
          <Image src="/images/main_menu_box.svg" alt="Menu Button" width={323} height={51} className="w-full h-full" />
          <span className="absolute inset-0 flex items-center justify-center text-[#3e459c] font-bold text-lg font-dongle tracking-wide">
            LOGOWANIE DLA NAUCZYCIELA
          </span>
        </button>
      </div>
    </div>
  )
}
