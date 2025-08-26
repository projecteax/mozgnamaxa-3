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
            className="object-contain"
          />
              <div className="absolute top-5 left-5">
      <Image
        src="/images/welcome/logo_fundacja.svg"
        alt="Fundacja Logo"
        width={200}
        height={100}
        className="object-contain"
      />
    </div>
        </div>
      </div>

      {/* Main App Logo - Centered horizontally, 150px from top */}
      <div className="absolute top-[150px] left-1/2 transform -translate-x-1/2 z-20">
        <Image
          src="/images/welcome/app_logo.svg"
          alt="App Logo"
          width={400}
          height={200}
          className="object-contain"
        />
      </div>

      {/* Dragon Welcome - Bottom Right */}
      <div className="absolute bottom-0 right-0 z-40">
        <Image
          src="/images/welcome/dragon_welcome.svg"
          alt="Dragon Welcome"
          width={1400}
          height={1750}
          className="object-contain"
        />
      </div>

      {/* START Button - Above the white stripe */}
      <div className="absolute bottom-[175px] left-0 right-0 z-50">
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
              className="object-contain"
            />
          </button>
        </div>
      </div>

      {/* White Stripe with Bottom Logos - Below dragon */}
      <div className="absolute bottom-0 left-0 right-0 z-30">
        <div className="bg-white w-full py-4 flex justify-center">
          <Image
            src="/images/welcome/bottom_logos.svg"
            alt="Bottom Logos"
            width={600}
            height={80}
            className="object-contain"
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
