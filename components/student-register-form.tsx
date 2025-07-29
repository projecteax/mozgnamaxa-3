"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { collection, addDoc, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/contexts/auth-context"

interface FormData {
  name: string
  email: string
  teacherCode: string
}

interface StudentRegisterFormProps {
  onLoginClick: () => void
  onSuccess: () => void
}

export default function StudentRegisterForm({ onLoginClick, onSuccess }: StudentRegisterFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    teacherCode: "",
  })
  const [teacherInfo, setTeacherInfo] = useState<any>(null)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isValidatingCode, setIsValidatingCode] = useState(false)
  const { register, login } = useAuth()

  // Validate teacher code in real-time
  useEffect(() => {
    const validateTeacherCode = async () => {
      if (formData.teacherCode.length === 4) {
        setIsValidatingCode(true)
        try {
          const q = query(collection(db, "users"), where("unique_code", "==", formData.teacherCode))
          const querySnapshot = await getDocs(q)

          if (!querySnapshot.empty) {
            const teacherData = querySnapshot.docs[0].data()
            setTeacherInfo(teacherData)
            setError("")
          } else {
            setTeacherInfo(null)
            setError("Nieprawidłowy kod nauczyciela")
          }
        } catch (error) {
          setTeacherInfo(null)
          setError("Błąd podczas sprawdzania kodu nauczyciela")
        } finally {
          setIsValidatingCode(false)
        }
      } else {
        setTeacherInfo(null)
        if (formData.teacherCode.length > 0) {
          setError("Kod nauczyciela musi mieć 4 cyfry")
        } else {
          setError("")
        }
      }
    }

    validateTeacherCode()
  }, [formData.teacherCode])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    // Restrict teacher code to only numbers and max 4 digits
    if (name === "teacherCode") {
      const numericValue = value.replace(/[^0-9]/g, "").slice(0, 4)
      setFormData({ ...formData, [name]: numericValue })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!teacherInfo) {
      setError("Musisz podać prawidłowy kod nauczyciela")
      return
    }

    setIsLoading(true)

    try {
      // Create password by adding "00" to the teacher code
      const password = `${formData.teacherCode}00`

      // Register user with email and the modified password
      const user = await register(formData.email, password)

      // Save student data with minimal structure - game data will be added when games are played
      await addDoc(collection(db, "students"), {
        uid: user.uid,
        name: formData.name,
        email: formData.email,
        teacher_code: formData.teacherCode,
        createdAt: new Date(),
        // Game results will be added dynamically when games are played
        gameResults: {},
        // Overall statistics
        overallStats: {
          totalGamesCompleted: 0,
          totalPlayTime: 0,
          favoriteGame: null,
          lastSessionDate: null,
          sessionsCount: 0
        },
        // Progress tracking
        progressTracking: {
          currentSeason: 'wiosna',
          unlockedSeasons: ['wiosna'],
          achievements: [],
          medals: []
        }
      })

      // Auto-login after registration
      await login(formData.email, password)
      onSuccess()
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        setError("Ten email jest już zarejestrowany")
      } else {
        setError("Błąd podczas rejestracji: " + error.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-[#3e459c]/20">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#3e459c] font-dongle">Rejestracja ucznia</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 font-dongle">
            {error}
          </div>
        )}

        {teacherInfo && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 font-dongle">
            ✓ Znaleziono nauczyciela: {teacherInfo.name}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[#3e459c] mb-1 font-dongle">
              Imię i nazwisko
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border-2 border-[#3e459c]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3e459c] focus:border-[#3e459c] font-dongle"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#3e459c] mb-1 font-dongle">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border-2 border-[#3e459c]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3e459c] focus:border-[#3e459c] font-dongle"
              required
            />
          </div>

          <div>
            <label htmlFor="teacherCode" className="block text-sm font-medium text-[#3e459c] mb-1 font-dongle">
              Kod nauczyciela (4 cyfry)
            </label>
            <input
              type="text"
              id="teacherCode"
              name="teacherCode"
              value={formData.teacherCode}
              onChange={handleChange}
              maxLength={4}
              pattern="[0-9]{4}"
              inputMode="numeric"
              className="w-full px-3 py-2 border-2 border-[#3e459c]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3e459c] focus:border-[#3e459c] font-dongle"
              required
            />
            {isValidatingCode && <p className="text-sm text-[#3e459c] mt-1 font-dongle">Sprawdzanie kodu...</p>}
            <p className="text-xs text-gray-500 mt-1 font-dongle">Ten kod będzie również Twoim hasłem do logowania</p>
          </div>

          <button
            type="submit"
            disabled={isLoading || !teacherInfo}
            className="w-full bg-[#3e459c] hover:bg-[#2d3470] text-white font-bold py-2 px-4 rounded-md transition-colors disabled:opacity-50 font-dongle"
          >
            {isLoading ? "Rejestrowanie..." : "Zarejestruj się"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <span className="text-gray-600 font-dongle">Masz już konto? </span>
          <button onClick={onLoginClick} className="text-[#3e459c] hover:underline font-bold font-dongle">
            Zaloguj się
          </button>
        </div>
      </div>
    </div>
  )
}
