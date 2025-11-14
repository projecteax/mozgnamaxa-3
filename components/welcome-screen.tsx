"use client"

import { useState } from "react"
import Image from "next/image"
import MobileNotSupported from "./mobile-not-supported"

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
    <>
      <MobileNotSupported />
      <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: "#E3F7FF" }}>
      {/* Top Left Cloud with Fundacja Logo */}
      <div className="absolute top-0 left-0 z-10">
        <div className="relative">
          <Image
            src="/images/welcome/cloud_top_left_corner.svg"
            alt="Cloud"
            width={300}
            height={200}
            className="object-contain w-[clamp(120px,20vw,300px)] h-[clamp(80px,13.3vw,200px)] sm:w-[clamp(180px,22.5vw,450px)] sm:h-[clamp(120px,15vw,300px)] md:w-[clamp(225px,22.5vw,450px)] md:h-[clamp(150px,15vw,300px)] lg:w-[clamp(300px,22.5vw,450px)] lg:h-[clamp(200px,15vw,300px)]"
          />
          <div className="absolute top-[clamp(6px,1vw,20px)] left-[clamp(6px,1vw,20px)] sm:top-[clamp(9px,1.2vw,30px)] sm:left-[clamp(9px,1.2vw,30px)] md:top-[clamp(12px,1.5vw,30px)] md:left-[clamp(12px,1.5vw,30px)]">
            <Image
              src="/images/welcome/logo_fundacja.svg"
              alt="Fundacja Logo"
              width={200}
              height={100}
              className="object-contain w-[clamp(80px,10vw,200px)] h-[clamp(40px,5vw,100px)] sm:w-[clamp(120px,12vw,300px)] sm:h-[clamp(60px,6vw,150px)] md:w-[clamp(150px,15vw,300px)] md:h-[clamp(75px,7.5vw,150px)] lg:w-[clamp(200px,15vw,300px)] lg:h-[clamp(100px,7.5vw,150px)]"
            />
          </div>
        </div>
      </div>

      {/* Main App Logo - Responsive positioning and sizing */}
      <div className="absolute top-[clamp(30px,6vh,60px)] xs:top-[clamp(40px,8vh,80px)] sm:top-[clamp(60px,6vw,150px)] md:top-[clamp(80px,8vw,150px)] left-1/2 transform -translate-x-1/2 z-20 px-2 xs:px-4 sm:px-0 logo-container">
        <Image
          src="/images/welcome/app_logo.svg"
          alt="App Logo"
          width={400}
          height={200}
          className="object-contain"
          style={{
            height: '30vh',
            width: 'auto'
          }}
        />
      </div>

      {/* Dragon Welcome - Bottom Right with improved responsive sizing */}
      <div className="absolute right-0 z-20 dragon-small" style={{ bottom: '14vh' }}>
        <Image
          src="/images/welcome/dragon_welcome 1.svg"
          alt="Dragon Welcome"
          width={1400}
          height={1750}
          className="object-contain"
          style={{ 
            height: '75vh',
            width: 'auto',
            objectPosition: 'bottom right'
          }}
        />
      </div>
      
      {/* Dragon Welcome - Larger for screens above 1600px */}
      <div className="absolute right-0 z-20 dragon-large" style={{ bottom: '14vh' }}>
        <Image
          src="/images/welcome/dragon_welcome 1.svg"
          alt="Dragon Welcome"
          width={1800}
          height={2250}
          className="object-contain"
          style={{ 
            height: '75vh',
            width: 'auto',
            objectPosition: 'bottom right'
          }}
        />
      </div>
      
      <style jsx>{`
        .dragon-small {
          display: block;
        }
        .dragon-large {
          display: none;
        }
        @media (min-width: 1600px) {
          .dragon-small {
            display: none;
          }
          .dragon-large {
            display: block;
          }
        }
        /* Improve scaling on smaller screens - keep large screens (1920px+) unchanged */
        @media (max-width: 1919px) {
          .dragon-small {
            height: clamp(400px, 70vh, 75vh) !important;
          }
        }
        @media (max-width: 1366px) {
          .dragon-small {
            height: clamp(400px, 65vh, 70vh) !important;
          }
        }
        @media (max-width: 1024px) {
          .dragon-small {
            height: clamp(350px, 60vh, 65vh) !important;
          }
        }
        @media (max-width: 768px) {
          .dragon-small {
            height: clamp(300px, 55vh, 60vh) !important;
          }
        }
        /* Adjust logo margin on smaller screens */
        @media (max-width: 1919px) {
          .logo-container {
            margin-left: clamp(-30px, -2vw, -50px) !important;
          }
        }
        @media (max-width: 1366px) {
          .logo-container {
            margin-left: clamp(-20px, -1.5vw, -30px) !important;
          }
        }
        /* Adjust bottom stripe and button on smaller screens */
        @media (max-width: 1366px) {
          .bottom-stripe {
            height: clamp(50px, 12vh, 14vh) !important;
          }
          .start-button-container {
            bottom: calc(clamp(50px, 12vh, 14vh) + clamp(15px, 2vh, 20px)) !important;
          }
        }
        @media (max-width: 1024px) {
          .bottom-stripe {
            height: clamp(45px, 10vh, 12vh) !important;
          }
          .start-button-container {
            bottom: calc(clamp(45px, 10vh, 12vh) + clamp(10px, 1.5vh, 20px)) !important;
          }
        }
      `}</style>

      {/* White Stripe with Project Funding Information - Responsive scaling like dragon */}
      <div className="absolute bottom-0 left-0 right-0 z-40 bg-white bottom-stripe" style={{ height: '14vh' }}>
        <div className="relative w-full h-full flex items-center justify-center px-4">
          <Image
            src="/images/welcome/bottom_logos.svg"
            alt="Projekt dofinansowany ze środków Funduszu Europejskiego dla dla Rozwoju Społecznego"
            width={600}
            height={80}
            className="object-contain"
            style={{
              height: '100%',
              width: 'auto'
            }}
          />
        </div>
      </div>

      {/* START Button - Positioned above bottom stripe with proper spacing */}
      <div className="absolute left-0 right-0 z-50 px-2 xs:px-4 start-button-container" style={{ bottom: 'calc(14vh + 2vh + 20px)' }}>
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
              style={{
                height: '7vh',
                width: 'auto'
              }}
            />
          </button>
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
    </>
  )
}
