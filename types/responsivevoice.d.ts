declare module 'responsivevoice' {
  interface ResponsiveVoiceOptions {
    pitch?: number;
    rate?: number;
    volume?: number;
    voice?: string;
    lang?: string;
  }

  interface ResponsiveVoice {
    speak(text: string, voice?: string, options?: ResponsiveVoiceOptions): void;
    stop(): void;
    isPlaying(): boolean;
    getVoices(): string[];
    setDefaultVoice(voice: string): void;
    setDefaultRate(rate: number): void;
    setDefaultPitch(pitch: number): void;
    setDefaultVolume(volume: number): void;
  }

  const responsiveVoice: ResponsiveVoice;
  export default responsiveVoice;
}
