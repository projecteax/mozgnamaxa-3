"use client"
import Image from "next/image"

interface CongratulationsPage13Props {
  onStartClick?: () => void
}

export default function CongratulationsPage13({ onStartClick }: CongratulationsPage13Props) {
  return (
    <div className="w-full h-screen bg-[#C8E6C9] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Dragon background */}
      <div className="absolute inset-0 flex items-center justify-center z-0">
        <Image
          src="/images/dragon_13.svg"
          alt="Dragon"
          width={400}
          height={300}
          className="object-contain"
          priority
        />
      </div>

      {/* Dalej button aligned right and smaller */}
      <div className="relative z-10 flex w-full justify-end pr-16 mt-auto mb-12">
        <button
          onClick={onStartClick}
          className="px-8 py-2 bg-white text-gray-800 rounded-lg font-bold text-xl hover:bg-gray-100 transition-colors shadow-lg font-dongle"
        >
          Dalej
        </button>
      </div>
    </div>
  )
} 