"use client"
import Image from "next/image"
import { useStudentProgress } from "@/hooks/use-student-progress"
import { useAuth } from "@/contexts/auth-context"
import { SEASON_INFO, Season } from "@/lib/season-utils"

interface SeasonSelectionMenuProps {
  onSeasonSelect: (season: string) => void
  onMenuClick: () => void
}

export default function SeasonSelectionMenu({ onSeasonSelect, onMenuClick }: SeasonSelectionMenuProps) {
  const { progress, loading } = useStudentProgress()
  const { user } = useAuth()
  
  // Get season order and unlocked seasons from progress
  const seasonOrder = progress?.seasonOrder || ['wiosna', 'lato', 'jesien', 'zima']
  
  // For unlogged users, unlock all seasons. For logged users, use their progress
  const unlockedSeasons = user ? (progress?.unlockedSeasons || ['wiosna']) : ['wiosna', 'lato', 'jesien', 'zima']
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      {/* Season selection grid - centered on screen */}
      <div className="flex flex-col items-center gap-8">
        {/* Back to menu button at top */}
        <div className="w-full flex justify-start mb-8">
          <button
            onClick={onMenuClick}
            className="relative w-full h-12 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-200 flex items-center justify-center group"
          >
            <span className="text-xl font-bold text-[#3e459c] font-sour-gummy group-hover:scale-105 transition-transform duration-200">
              POWRÓT DO MENU
            </span>
          </button>
        </div>
        {/* Dynamic seasons based on order */}
        <div className="grid grid-cols-2 gap-8">
          {seasonOrder.map((seasonId, index) => {
            const seasonInfo = SEASON_INFO[seasonId as Season]
            const isUnlocked = unlockedSeasons.includes(seasonId)
            const isFirstSeason = index === 0
            
            return (
              <button
                key={seasonId}
                onClick={() => isUnlocked && onSeasonSelect(seasonId)}
                disabled={!isUnlocked || loading}
                className={`relative w-64 h-32 rounded-3xl shadow-lg transition-all duration-200 flex items-center justify-center group ${
                  isUnlocked 
                    ? 'bg-white hover:shadow-xl cursor-pointer' 
                    : 'bg-gray-300 opacity-60 cursor-not-allowed'
                }`}
              >
                <span 
                  className={`text-4xl font-bold font-sour-gummy transition-transform duration-200 ${
                    isUnlocked 
                      ? `group-hover:scale-105` 
                      : 'text-gray-500'
                  }`}
                  style={{ 
                    color: isUnlocked ? seasonInfo?.color : '#6B7280' 
                  }}
                >
                  {seasonInfo?.name}
                  {/* Only show (START) for logged-in users */}
                  {user && isFirstSeason && (
                    <span className="text-lg ml-2 font-normal">(START)</span>
                  )}
                </span>
                
                {/* Lock icon for locked seasons */}
                {!isUnlocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200/50 rounded-3xl">
                    <span className="text-2xl">🔒</span>
                  </div>
                )}
                
                {/* Loading overlay */}
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-3xl">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
