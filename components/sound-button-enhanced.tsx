"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface SoundButtonProps {
  text: string
  soundIcon?: string
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export default function SoundButtonEnhanced({ 
  text, 
  soundIcon = "/images/sound_icon_dragon_page.svg",
  className = "", 
  size = 'md' 
}: SoundButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  // Initialize ResponsiveVoice with Polish voice preferences
  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined' && (window as any).responsiveVoice) {
      const ResponsiveVoice = (window as any).responsiveVoice;
      
      // Set default Polish voice settings
      ResponsiveVoice.setDefaultVoice("Polish Female");
      ResponsiveVoice.setDefaultRate(0.75); // Slower for better clarity
      ResponsiveVoice.setDefaultPitch(1.1); // Slightly higher pitch
      ResponsiveVoice.setDefaultVolume(1.0);
      
      console.log('ResponsiveVoice initialized with Polish Female voice');
    }
  }, [])

  const speak = (text: string) => {
    if (typeof window === 'undefined' || !(window as any).responsiveVoice) {
      console.log('ResponsiveVoice not available');
      return;
    }
    
    try {
      const ResponsiveVoice = (window as any).responsiveVoice;
      console.log('Speaking text:', text);
      ResponsiveVoice.speak(text, "Polish Female", {
        rate: 0.75,
        pitch: 1.1,
        volume: 1.0
      });
      setIsPlaying(true);
      
      // Check if speech is playing to update state
      const checkPlaying = setInterval(() => {
        if (!ResponsiveVoice.isPlaying()) {
          setIsPlaying(false);
          clearInterval(checkPlaying);
        }
      }, 100);
      
    } catch (error) {
      console.error('Error in speak function:', error);
      setIsPlaying(false);
    }
  }

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && (window as any).responsiveVoice) {
      (window as any).responsiveVoice.stop();
    }
    setIsPlaying(false);
  }

  const handleClick = () => {
    if (isPlaying) {
      stopSpeaking()
    } else {
      speak(text)
    }
  }

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16', 
    lg: 'w-20 h-20',
    xl: 'w-24 h-24'
  }

  const iconSizes = {
    sm: 24,
    md: 40,
    lg: 48,
    xl: 64
  }

  return (
    <div 
      className={`
        flex items-center justify-center cursor-pointer 
        hover:scale-105 transition-transform drop-shadow-lg
        ${sizeClasses[size]} ${className}
      `}
      onClick={handleClick}
      title={isPlaying ? "Zatrzymaj odtwarzanie" : "Odtwórz dźwięk"}
    >
      <Image
        src={soundIcon}
        alt="Sound"
        width={iconSizes[size]}
        height={iconSizes[size]}
        className="object-contain"
      />
    </div>
  )
} 