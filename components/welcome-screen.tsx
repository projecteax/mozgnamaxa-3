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
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#E3F7FF" }}>
      <div className="relative w-full h-screen flex items-center justify-center">
        <div className="relative h-full inline-block">
          <Image
            src="/images/welcome_screen.svg"
            alt="Welcome Screen"
            width={3000}
            height={2000}
            className="h-full w-auto object-contain block"
            priority
          />

          {/* Start Button positioned at center top of the actual SVG image */}
          <button
            onClick={handleStart}
            disabled={isLoading}
            className="absolute top-4 left-1/2 transform -translate-x-1/2 hover:scale-105 transition-transform duration-200 disabled:opacity-50 flex items-center justify-center z-10"
          >
            <div className="relative">
              <Image
                src="/images/welcome_start.svg"
                alt="Start"
                width={300}
                height={75}
                className="drop-shadow-lg hover:drop-shadow-xl transition-all duration-200"
              />
              {/* START text overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-blue-900 font-bold text-3xl tracking-wider drop-shadow-md">START</span>
              </div>
            </div>
          </button>

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
              <span className="text-gray-600 text-sm">Ładowanie...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
