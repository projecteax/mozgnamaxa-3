"use client"

import { useState } from "react"
import Image from "next/image"

interface WelcomeScreenProps {
  onStart: () => void
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleStart = async () => {
    setIsLoading(true)
    // Add a small delay for visual feedback
    await new Promise((resolve) => setTimeout(resolve, 500))
    onStart()
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: "#E3F7FF" }}>
      {/* Top Left Cloud with Fundacja Logo */}
      <div className="absolute top-0 left-0 z-10">
        <div className="relative">
          <Image
            src="/images/welcome/cloud_top_left_corner.svg"
            alt="Cloud"
            width={300}
            height={200}
            className="object-contain w-[clamp(180px,22.5vw,450px)] h-[clamp(120px,15vw,300px)] sm:w-[clamp(225px,22.5vw,450px)] sm:h-[clamp(150px,15vw,300px)]"
          />
          <div className="absolute top-[clamp(9px,1.2vw,30px)] left-[clamp(9px,1.2vw,30px)] sm:top-[clamp(12px,1.5vw,30px)] sm:left-[clamp(12px,1.5vw,30px)]">
            <Image
              src="/images/welcome/logo_fundacja.svg"
              alt="Fundacja Logo"
              width={200}
              height={100}
              className="object-contain w-[clamp(120px,12vw,300px)] h-[clamp(60px,6vw,150px)] sm:w-[clamp(150px,15vw,300px)] sm:h-[clamp(75px,7.5vw,150px)]"
            />
          </div>
        </div>
      </div>

      {/* Main App Logo - Moved slightly left from center to avoid dragon elements */}
      <div className="absolute top-[clamp(60px,6vw,150px)] sm:top-[clamp(80px,8vw,150px)] left-[calc(50%-380px)] z-20">
        <Image
          src="/images/welcome/app_logo.svg"
          alt="App Logo"
          width={400}
          height={200}
          className="object-contain w-[clamp(288px,28.8vw,720px)] h-[clamp(144px,14.4vw,360px)] sm:w-[clamp(360px,36vw,720px)] sm:h-[clamp(180px,18vw,360px)]"
        />
      </div>

      {/* Dragon Welcome - Bottom Right with responsive sizing */}
      <div className="absolute bottom-0 right-0 z-40">
        <Image
          src="/images/welcome/dragon_welcome.svg"
          alt="Dragon Welcome"
          width={1400}
          height={1750}
          className="object-contain"
          style={{ 
            width: 'clamp(70vw, 85vw, 100vw)', 
            height: 'clamp(70vh, 85vh, 100vh)',
            maxWidth: 'none',
            maxHeight: 'none',
            objectPosition: 'bottom right'
          }}
        />
      </div>

      {/* START Button - Above the white stripe with responsive positioning */}
      <div className="absolute bottom-[clamp(80px,10vh,175px)] sm:bottom-[clamp(100px,12vh,175px)] left-0 right-0 z-50">
        <div className="flex justify-center">
          <button
            onClick={handleStart}
            disabled={isLoading}
            className="relative hover:scale-105 transition-transform duration-200 disabled:opacity-50"
          >
            <Image
              src="/images/welcome/button_START.svg"
              alt="Start Button"
              width={200}
              height={60}
              className="object-contain w-[clamp(150px,15vw,300px)] h-[clamp(45px,4.5vw,90px)] sm:w-[clamp(180px,18vw,300px)] sm:h-[clamp(54px,5.4vw,90px)]"
            />
          </button>
        </div>
      </div>

      {/* White Stripe with Bottom Logos - Below dragon with responsive padding */}
      <div className="absolute bottom-0 left-0 right-0 z-30">
        <div className="bg-white w-full py-[clamp(6px,0.8vh,16px)] sm:py-[clamp(8px,1vh,16px)] flex justify-center">
          <Image
            src="/images/welcome/bottom_logos.svg"
            alt="Bottom Logos"
            width={600}
            height={80}
            className="object-contain w-[clamp(250px,25vw,600px)] h-[clamp(32px,3.2vw,80px)] sm:w-[clamp(300px,30vw,600px)] sm:h-[clamp(40px,4vw,80px)]"
          />
        </div>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 flex items-center justify-center space-x-2 bg-white bg-opacity-80 rounded-lg px-4 py-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-blue-600 text-sm">Ładowanie...</span>
        </div>
      )}
    </div>
  )
}
