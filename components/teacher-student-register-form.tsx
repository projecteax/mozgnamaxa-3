"use client"

import type React from "react"
import { useState } from "react"
import { collection, addDoc, query, where, getDocs } from "firebase/firestore"
import { getAuth, signOut } from "firebase/auth"
import { db } from "@/lib/firebase"
import { useAuth } from "@/contexts/auth-context"

interface TeacherStudentRegisterFormProps {
  onSuccess: () => void
  onCancel: () => void
  teacherCode: string
  isCreatingStudent: boolean
  setIsCreatingStudent: (value: boolean) => void
}

export default function TeacherStudentRegisterForm({ onSuccess, onCancel, teacherCode, isCreatingStudent, setIsCreatingStudent }: TeacherStudentRegisterFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const { } = useAuth()
  const auth = getAuth()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    setSuccessMessage("")

    try {
      // Set flag to prevent redirection during student creation
      setIsCreatingStudent(true)

      // Create password by adding "00" to the teacher code
      const password = `${teacherCode}00`

      // Generate a temporary UID for the student (we'll create the Firebase Auth account when they first log in)
      const tempUid = `student_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // Save student data to students collection
      await addDoc(collection(db, "students"), {
        uid: tempUid, // Temporary UID, will be replaced when they first log in
        name: formData.name,
        email: formData.email,
        teacher_code: teacherCode,
        password: password, // Store the password temporarily (in real app, hash this!)
        createdAt: new Date(),
        authCreated: false, // Flag to indicate Firebase Auth account not yet created
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
      
      // Clear the flag to allow normal redirection again
      setIsCreatingStudent(false)

      setSuccessMessage(`Konto ucznia "${formData.name}" zostało pomyślnie utworzone!`)

      // Reset form
      setFormData({
        name: "",
        email: "",
      })

      // Don't automatically close - let teacher create more accounts
      // Only close after a longer delay or when they click a button
    } catch (err: any) {
      let errorMessage = "Wystąpił błąd podczas tworzenia konta ucznia."

      if (err.code === "auth/email-already-in-use") {
        errorMessage = "Ten adres email jest już używany."
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "Nieprawidłowy adres email."
      } else if (err.code === "auth/weak-password") {
        errorMessage = "Hasło jest zbyt słabe."
      }

      setError(errorMessage)
      // Clear the flag on error as well
      setIsCreatingStudent(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-[#3e459c]/20">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#3e459c] font-dongle">Stwórz konto ucznia</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 font-dongle">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 font-dongle">
            {successMessage}
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setSuccessMessage("")
                  setFormData({ name: "", email: "" })
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-dongle"
              >
                Stwórz kolejne konto
              </button>
              <button
                type="button"
                onClick={onSuccess}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-dongle"
              >
                Wróć do panelu
              </button>
            </div>
          </div>
        )}

        {!successMessage && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-[1.6rem] font-medium text-[#3e459c] mb-1 font-dongle">
                Imię i Nazwisko ucznia *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border-2 border-[#3e459c]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3e459c] focus:border-[#3e459c] font-dongle text-[1.6rem]"
                placeholder="Wprowadź imię i nazwisko ucznia"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-[1.6rem] font-medium text-[#3e459c] mb-1 font-dongle">
                Adres Email ucznia *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border-2 border-[#3e459c]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3e459c] focus:border-[#3e459c] font-dongle text-[1.6rem]"
                placeholder="Wprowadź adres email ucznia"
              />
            </div>

            <div className="bg-[#e3f7ff] p-4 rounded-lg border-2 border-[#3e459c]/20">
              <p className="text-sm text-[#3e459c] font-dongle">
                <strong>Informacja:</strong> Hasło dla ucznia zostanie automatycznie ustawione na Twój kod nauczyciela z dodatkowymi dwoma zerami na końcu.
              </p>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-colors font-dongle text-[1.6rem]"
              >
                Anuluj
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-[#3e459c] hover:bg-[#2d3470] text-white font-bold py-2 px-4 rounded-md transition-colors disabled:opacity-50 font-dongle text-[1.6rem]"
              >
                {isLoading ? "Tworzenie..." : "Stwórz konto"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
