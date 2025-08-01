declare module 'react-speech-kit' {
  export interface SpeechSynthesisOptions {
    text: string
    voice?: SpeechSynthesisVoice
    rate?: number
    pitch?: number
    volume?: number
    lang?: string
  }

  export interface UseSpeechSynthesisReturn {
    speak: (options: SpeechSynthesisOptions) => void
    speaking: boolean
    cancel: () => void
    supported: boolean
  }

  export function useSpeechSynthesis(): UseSpeechSynthesisReturn
} 