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
  const [polishVoice, setPolishVoice] = useState<SpeechSynthesisVoice | null>(null)
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([])

  // Find best available voices when component loads
  useEffect(() => {
    const findVoices = () => {
      const voices = window.speechSynthesis.getVoices()
      setAvailableVoices(voices)
      
      // Priority order for Polish voices
      const polishVoice = voices.find(voice => 
        voice.lang === 'pl-PL' || 
        voice.lang === 'pl' ||
        voice.name.toLowerCase().includes('polish') ||
        voice.name.toLowerCase().includes('polski') ||
        voice.name.toLowerCase().includes('polska')
      )
      
      if (polishVoice) {
        setPolishVoice(polishVoice)
      } else {
        // Fallback to first available voice
        setPolishVoice(voices[0] || null)
      }
    }

    // Wait for voices to load
    if (window.speechSynthesis.getVoices().length > 0) {
      findVoices()
    } else {
      window.speechSynthesis.onvoiceschanged = findVoices
    }
  }, [])

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      // Stop any previous speech
      window.speechSynthesis.cancel()
      
      const utterance = new SpeechSynthesisUtterance(text)
      
      // Set Polish voice if available
      if (polishVoice) {
        utterance.voice = polishVoice
      }
      
      // Enhanced settings for better Polish pronunciation
      utterance.lang = 'pl-PL'
      utterance.rate = 0.75  // Even slower for better clarity
      utterance.pitch = 1.1   // Slightly higher pitch for better Polish sounds
      utterance.volume = 1.0
      
      utterance.onstart = () => setIsPlaying(true)
      utterance.onend = () => setIsPlaying(false)
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event)
        setIsPlaying(false)
      }
      
      window.speechSynthesis.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    window.speechSynthesis.cancel()
    setIsPlaying(false)
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
        ${!polishVoice ? 'opacity-50 cursor-not-allowed' : ''}
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