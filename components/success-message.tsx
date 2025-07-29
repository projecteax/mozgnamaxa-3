"use client"

import { useSeason } from "@/contexts/season-context"

interface SuccessMessageProps {
  message: string
}

export default function SuccessMessage({ message }: SuccessMessageProps) {
  const { selectedSeason } = useSeason()
  
  // Get colors based on season
  const getThemeColors = () => {
    switch (selectedSeason) {
      case "lato":
        return {
          borderColor: "border-yellow-400",
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-800"
        }
      case "jesien":
        return {
          borderColor: "border-orange-400",
          bgColor: "bg-orange-100", 
          textColor: "text-orange-800"
        }
      case "zima":
        return {
          borderColor: "border-blue-400",
          bgColor: "bg-blue-100",
          textColor: "text-blue-800"
        }
      default:
        return {
          borderColor: "border-green-400",
          bgColor: "bg-green-100",
          textColor: "text-green-800"
        }
    }
  }

  const colors = getThemeColors()

  return (
    <div className="flex flex-col items-center mt-8">
      <div className={`mb-4 p-4 ${colors.bgColor} border-2 ${colors.borderColor} rounded-lg text-center`}>
        <div className={`text-2xl font-bold ${colors.textColor} mb-2`}>🎉 {message} 🎉</div>
      </div>
    </div>
  )
} 