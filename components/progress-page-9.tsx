"use client"
import Image from "next/image"
import { useSeason } from "@/contexts/season-context"

interface ProgressPage9Props {
  onContinue: () => void
}

export default function ProgressPage9({ onContinue }: ProgressPage9Props) {
  const { selectedSeason } = useSeason()

  const getSeasonalStyles = () => {
    switch (selectedSeason) {
      case "lato": // summer
        return {
          background: "bg-[#FFE082]",
          medalSuffix: "_summer",
        }
      case "jesien": // autumn
        return {
          background: "bg-[#FF8A65]",
          medalSuffix: "_autumn",
        }
      case "zima": // winter
        return {
          background: "bg-[#81D4FA]",
          medalSuffix: "_winter",
        }
      default: // wiosna (spring)
        return {
          background: "bg-[#C8E6C9]",
          medalSuffix: "",
        }
    }
  }

  const { background, medalSuffix } = getSeasonalStyles()

  const handleDalejClick = () => {
    console.log("DALEJ button clicked from progress page 9")
    onContinue()
  }

  return (
    <div className={`w-full h-screen ${background} flex flex-col items-center justify-center px-12`}>
      {/* Grid of boxes - enlarged by 200% */}
      <div className="grid grid-cols-6 gap-6 mb-16">
        {/* First box - active with medal 01 - enlarged from w-24 h-24 to w-48 h-48 */}
        <div className="relative w-48 h-48">
          <Image src="/images/white_box_medium.svg" alt="Active box" fill className="object-contain" />
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Medal icon enlarged from w-12 h-12 to w-24 h-24 */}
            <div className="relative w-24 h-24">
              <Image src={`/images/medal_01${medalSuffix}.svg`} alt="Medal 01" fill className="object-contain" />
            </div>
          </div>
        </div>

        {/* Second box - active with medal 02 - enlarged from w-24 h-24 to w-48 h-48 */}
        <div className="relative w-48 h-48">
          <Image src="/images/white_box_medium.svg" alt="Active box" fill className="object-contain" />
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Medal icon enlarged from w-12 h-12 to w-24 h-24 */}
            <div className="relative w-24 h-24">
              <Image src={`/images/medal_02${medalSuffix}.svg`} alt="Medal 02" fill className="object-contain" />
            </div>
          </div>
        </div>

        {/* Third box - active with medal 03 - enlarged from w-24 h-24 to w-48 h-48 */}
        <div className="relative w-48 h-48">
          <Image src="/images/white_box_medium.svg" alt="Active box" fill className="object-contain" />
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Medal icon enlarged from w-12 h-12 to w-24 h-24 */}
            <div className="relative w-24 h-24">
              <Image src={`/images/medal_03${medalSuffix}.svg`} alt="Medal 03" fill className="object-contain" />
            </div>
          </div>
        </div>

        {/* Fourth box - active with medal 04 - enlarged from w-24 h-24 to w-48 h-48 */}
        <div className="relative w-48 h-48">
          <Image src="/images/white_box_medium.svg" alt="Active box" fill className="object-contain" />
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Medal icon enlarged from w-12 h-12 to w-24 h-24 */}
            <div className="relative w-24 h-24">
              <Image src={`/images/medal_04${medalSuffix}.svg`} alt="Medal 04" fill className="object-contain" />
            </div>
          </div>
        </div>

        {/* Fifth box - active with medal 05 - enlarged from w-24 h-24 to w-48 h-48 */}
        <div className="relative w-48 h-48">
          <Image src="/images/white_box_medium.svg" alt="Active box" fill className="object-contain" />
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Medal icon enlarged from w-12 h-12 to w-24 h-24 */}
            <div className="relative w-24 h-24">
              <Image src={`/images/medal_05${medalSuffix}.svg`} alt="Medal 05" fill className="object-contain" />
            </div>
          </div>
        </div>

        {/* Sixth box - active with medal 06 - enlarged from w-24 h-24 to w-48 h-48 */}
        <div className="relative w-48 h-48">
          <Image src="/images/white_box_medium.svg" alt="Active box" fill className="object-contain" />
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Medal icon enlarged from w-12 h-12 to w-24 h-24 */}
            <div className="relative w-24 h-24">
              <Image src={`/images/medal_06${medalSuffix}.svg`} alt="Medal 06" fill className="object-contain" />
            </div>
          </div>
        </div>

        {/* Seventh box - active with medal 07 - enlarged from w-24 h-24 to w-48 h-48 */}
        <div className="relative w-48 h-48">
          <Image src="/images/white_box_medium.svg" alt="Active box" fill className="object-contain" />
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Medal icon enlarged from w-12 h-12 to w-24 h-24 */}
            <div className="relative w-24 h-24">
              <Image src={`/images/medal_07${medalSuffix}.svg`} alt="Medal 07" fill className="object-contain" />
            </div>
          </div>
        </div>

        {/* Eighth box - active with medal 08 - enlarged from w-24 h-24 to w-48 h-48 */}
        <div className="relative w-48 h-48">
          <Image src="/images/white_box_medium.svg" alt="Active box" fill className="object-contain" />
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Medal icon enlarged from w-12 h-12 to w-24 h-24 */}
            <div className="relative w-24 h-24">
              <Image src={`/images/medal_08${medalSuffix}.svg`} alt="Medal 08" fill className="object-contain" />
            </div>
          </div>
        </div>

        {/* Ninth box - active with medal 09 - enlarged from w-24 h-24 to w-48 h-48 */}
        <div className="relative w-48 h-48">
          <Image src="/images/white_box_medium.svg" alt="Active box" fill className="object-contain" />
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Medal icon enlarged from w-12 h-12 to w-24 h-24 */}
            <div className="relative w-24 h-24">
              <Image src={`/images/medal_09${medalSuffix}.svg`} alt="Medal 09" fill className="object-contain" />
            </div>
          </div>
        </div>

        {/* Remaining 3 boxes - greyed out - enlarged from w-24 h-24 to w-48 h-48 */}
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="relative w-48 h-48">
            <div className="relative w-full h-full opacity-40 grayscale">
              <Image src="/images/white_box_medium.svg" alt="Locked box" fill className="object-contain" />
            </div>
          </div>
        ))}
      </div>

      {/* DALEJ button */}
      <div
        className="relative w-48 h-12 cursor-pointer hover:scale-105 transition-transform"
        onClick={handleDalejClick}
      >
        <Image src="/images/start_button.svg" alt="Continue button background" fill className="object-contain" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[#539e1b] font-bold text-2xl">DALEJ</span>
        </div>
      </div>
    </div>
  )
}
