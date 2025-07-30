"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { collection, addDoc, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface RegisterFormProps {
  onSuccess?: () => void
  onLoginClick: () => void
}

export default function RegisterForm({ onSuccess, onLoginClick }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    school: "",
    role: "teacher" as "teacher" | "student",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [generatedCode, setGeneratedCode] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const { register } = useAuth()

  // Generate a unique 4-digit code
  const generateUniqueCode = async (): Promise<string> => {
    let code: string
    let isUnique = false

    while (!isUnique) {
      // Generate random 4-digit code
      code = Math.floor(1000 + Math.random() * 9000).toString()

      // Check if code already exists in database
      const q = query(collection(db, "users"), where("unique_code", "==", code))
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        isUnique = true
        return code
      }
    }

    return "0000" // fallback, should never reach here
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Hasła nie są identyczne.")
      setIsLoading(false)
      return
    }

    // Validate password strength
    if (formData.password.length < 6) {
      setError("Hasło musi mieć co najmniej 6 znaków.")
      setIsLoading(false)
      return
    }

    try {
      // Register user with Firebase Auth
      const user = await register(formData.email, formData.password)

      // Generate unique code
      const uniqueCode = await generateUniqueCode()

      // Add user to Firestore
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: formData.name,
        email: formData.email,
        school: formData.school,
        role: formData.role,
        unique_code: uniqueCode,
        created_at: new Date().toISOString(),
      })

      setGeneratedCode(uniqueCode)
      setSuccessMessage("Konto zostało pomyślnie utworzone! Zostałeś automatycznie zalogowany.")

      // Reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        school: "",
        role: "teacher",
      })

      // User is automatically logged in by Firebase Auth after registration
      // Call onSuccess to trigger the dashboard view
      setTimeout(() => {
        if (onSuccess) {
          onSuccess()
        }
      }, 2000) // Show success message for 2 seconds before redirecting
    } catch (err: any) {
      let errorMessage = "Wystąpił błąd podczas rejestracji."

      if (err.code === "auth/email-already-in-use") {
        errorMessage = "Ten adres email jest już używany."
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "Nieprawidłowy adres email."
      } else if (err.code === "auth/weak-password") {
        errorMessage = "Hasło jest zbyt słabe."
      }

      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-[#3e459c]/20">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#3e459c] font-dongle">Utwórz konto</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 font-dongle">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 font-dongle">
            {successMessage}
            {generatedCode && (
              <div className="mt-3 font-bold text-2xl font-dongle">Twój unikalny kod: {generatedCode}</div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-[1.6rem] font-medium text-[#3e459c] mb-1 font-dongle">
              Imię i Nazwisko *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border-2 border-[#3e459c]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3e459c] focus:border-[#3e459c] font-dongle text-[1.6rem]"
              placeholder="Wprowadź imię i nazwisko"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-[1.6rem] font-medium text-[#3e459c] mb-1 font-dongle">
              Adres Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border-2 border-[#3e459c]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3e459c] focus:border-[#3e459c] font-dongle text-[1.6rem]"
              placeholder="Wprowadź adres email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-[1.6rem] font-medium text-[#3e459c] mb-1 font-dongle">
              Hasło *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border-2 border-[#3e459c]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3e459c] focus:border-[#3e459c] font-dongle text-[1.6rem]"
              placeholder="Wprowadź hasło (min. 6 znaków)"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-[1.6rem] font-medium text-[#3e459c] mb-1 font-dongle">
              Potwierdź Hasło *
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border-2 border-[#3e459c]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3e459c] focus:border-[#3e459c] font-dongle text-[1.6rem]"
              placeholder="Potwierdź hasło"
            />
          </div>

          <div>
            <label htmlFor="school" className="block text-[1.6rem] font-medium text-[#3e459c] mb-1 font-dongle">
              Nazwa Szkoły *
            </label>
            <input
              type="text"
              id="school"
              name="school"
              value={formData.school}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border-2 border-[#3e459c]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3e459c] focus:border-[#3e459c] font-dongle text-[1.6rem]"
              placeholder="Wprowadź nazwę szkoły"
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-[1.6rem] font-medium text-[#3e459c] mb-1 font-dongle">
              Rola *
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border-2 border-[#3e459c]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3e459c] focus:border-[#3e459c] font-dongle text-[1.6rem]"
            >
              <option value="teacher">Nauczyciel</option>
              <option value="student">Uczeń</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#3e459c] hover:bg-[#2d3470] text-white font-bold py-2 px-4 rounded-md transition-colors disabled:opacity-50 font-dongle text-[1.6rem]"
          >
            {isLoading ? "Rejestracja..." : "Zarejestruj się"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={onLoginClick} className="text-[#3e459c] hover:underline font-dongle text-[1.6rem]">
            Masz już konto? Zaloguj się
          </button>
        </div>
      </div>
    </div>
  )
}
