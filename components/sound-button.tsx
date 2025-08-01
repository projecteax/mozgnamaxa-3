"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useSpeechSynthesis } from 'react-speech-kit'

interface SoundButtonProps {
  text: string
  soundIcon?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function SoundButton({ 
  text, 
  soundIcon = "/images/sound_icon_dragon_page.svg",
  className = "", 
  size = 'md' 
}: SoundButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [polishVoice, setPolishVoice] = useState<SpeechSynthesisVoice | null>(null)
  
  const { speak, speaking, cancel } = useSpeechSynthesis()

  // Find Polish voice when component loads
  useEffect(() => {
    const findPolishVoice = () => {
      const voices = window.speechSynthesis.getVoices()
      const polishVoice = voices.find(voice => 
        voice.lang === 'pl-PL' || 
        voice.lang === 'pl' ||
        voice.name.toLowerCase().includes('polish') ||
        voice.name.toLowerCase().includes('polski') ||
        voice.name.toLowerCase().includes('polish') ||
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
      findPolishVoice()
    } else {
      window.speechSynthesis.onvoiceschanged = findPolishVoice
    }
  }, [])

  const handleSpeak = () => {
    if (speaking) {
      cancel()
      setIsPlaying(false)
    } else {
      speak({
        text: text,
        voice: polishVoice || undefined,
        rate: 0.85,  // Slightly slower for better clarity
        pitch: 1.0,
        volume: 1.0,
        lang: 'pl-PL'
      })
      setIsPlaying(true)
      
      // Reset playing state after speech ends
      setTimeout(() => {
        setIsPlaying(false)
      }, text.length * 120) // Approximate duration
    }
  }

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16', 
    lg: 'w-20 h-20'
  }

  const iconSizes = {
    sm: 24,
    md: 40,
    lg: 48
  }

  return (
    <div 
      className={`
        flex items-center justify-center cursor-pointer 
        hover:scale-105 transition-transform drop-shadow-lg
        ${sizeClasses[size]} ${className}
        ${!polishVoice ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      onClick={handleSpeak}
      title={isPlaying || speaking ? "Zatrzymaj odtwarzanie" : "Odtwórz dźwięk"}
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