"use client"

import { useSeason } from "@/contexts/season-context"
import SoundButtonEnhanced from "./sound-button-enhanced"

interface SuccessMessageProps {
  message: string
}

export default function SuccessMessage({ message }: SuccessMessageProps) {
  const { selectedSeason, getThemeColors } = useSeason()
  const theme = getThemeColors()
  
  // Get colors based on season
  const getBorderColors = () => {
    switch (selectedSeason) {
      case "lato":
        return {
          borderColor: "border-yellow-600", // Dark yellow for summer
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-800"
        }
      case "jesien":
        return {
          borderColor: "border-orange-600", // Dark orange for autumn
          bgColor: "bg-orange-100", 
          textColor: "text-orange-800"
        }
      case "zima":
        return {
          borderColor: "border-blue-600", // Dark blue for winter
          bgColor: "bg-blue-100",
          textColor: "text-blue-800"
        }
      default:
        return {
          borderColor: "border-green-600", // Dark green for spring
          bgColor: "bg-green-100",
          textColor: "text-green-800"
        }
    }
  }

  const colors = getBorderColors()

  return (
    <div className="flex flex-col items-center mt-8">
      <div className={`mb-4 p-4 ${colors.bgColor} border-4 ${colors.borderColor} rounded-lg text-center`}>
        <div className={`text-2xl font-bold ${colors.textColor} mb-4`}>🎉 {message} 🎉</div>
        <div className="flex justify-center">
          <SoundButtonEnhanced 
            text={message}
            soundIcon={theme.soundIcon}
            size="md"
          />
        </div>
      </div>
    </div>
  )
} 