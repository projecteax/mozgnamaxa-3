"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type Season = "wiosna" | "lato" | "jesien" | "zima"

interface SeasonContextType {
  selectedSeason: Season
  setSelectedSeason: (season: Season) => void
  getThemeColors: () => {
    backgroundColor: string
    background: string
    soundIcon: string
    menuIcon: string
    titleBox: string
    buttonColor: string
  }
}

const SeasonContext = createContext<SeasonContextType | undefined>(undefined)

export function SeasonProvider({ children }: { children: ReactNode }) {
  const [selectedSeason, setSelectedSeason] = useState<Season>("wiosna")

  const getThemeColors = () => {
    switch (selectedSeason) {
      case "zima":
        return {
          backgroundColor: "#C3F7FD",
          background: "#C3F7FD",
          soundIcon: "/images/sound_winter.svg",
          menuIcon: "/images/menu_winter.svg",
          titleBox: "/images/title_box_small_winter.svg",
          buttonColor: "#00abc6", // Blue for winter
        }
      case "lato":
        return {
          backgroundColor: "#FEF3C7",
          background: "#FEF3C7",
          soundIcon: "/images/sound_summer.svg",
          menuIcon: "/images/menu_summer.svg",
          titleBox: "/images/title_box_small_summer.svg",
          buttonColor: "#ffc402", // Yellow for summer
        }
      case "jesien":
        return {
          backgroundColor: "#FED7AA",
          background: "#FED7AA",
          soundIcon: "/images/sound_autumn.svg",
          menuIcon: "/images/menu_autumn.svg",
          titleBox: "/images/title_box_small_autumn.svg",
          buttonColor: "#ed6b19", // Orange for autumn
        }
      default:
        return {
          backgroundColor: "#DCFCE7",
          background: "#DCFCE7",
          soundIcon: "/images/sound_new.svg",
          menuIcon: "/images/menu_new.svg",
          titleBox: "/images/title_box_small.png",
          buttonColor: "#539e1b", // Green for spring
        }
    }
  }

  return (
    <SeasonContext.Provider value={{ selectedSeason, setSelectedSeason, getThemeColors }}>
      {children}
    </SeasonContext.Provider>
  )
}

export function useSeason() {
  const context = useContext(SeasonContext)
  if (context === undefined) {
    throw new Error("useSeason must be used within a SeasonProvider")
  }
  return context
}
