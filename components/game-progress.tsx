"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { getStudentProgress } from "@/lib/progress-service"
import type { GameId } from "@/lib/progress-service"

interface GameProgressProps {
  gameId: GameId
}

export default function GameProgress({ gameId }: GameProgressProps) {
  const { user } = useAuth()
  const [completionCount, setCompletionCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProgress() {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        const progress = await getStudentProgress(user.uid)
        if (progress) {
          setCompletionCount(progress[gameId] || 0)
        }
        setLoading(false)
      } catch (error) {
        console.error("Error fetching progress:", error)
        setLoading(false)
      }
    }

    fetchProgress()
  }, [user, gameId])

  if (loading || !user) {
    return null
  }

  return (
    <div className="w-full max-w-md mx-auto mt-4 text-center">
      <div className="bg-white rounded-lg shadow-sm p-3">
        <p className="text-gray-700">
          Ukończono: <span className="font-bold text-[#539e1b]">{completionCount}</span> razy
        </p>
      </div>
    </div>
  )
}
