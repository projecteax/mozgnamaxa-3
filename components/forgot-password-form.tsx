"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"

interface ForgotPasswordFormProps {
  onBackToLogin: () => void
}

export default function ForgotPasswordForm({ onBackToLogin }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { resetPassword } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setMessage("")
    setIsLoading(true)

    try {
      await resetPassword(email)
      setMessage("Link do resetowania hasła został wysłany na podany adres email.")
    } catch (err: any) {
      let errorMessage = "Wystąpił błąd podczas wysyłania linku resetującego hasło."

      if (err.code === "auth/user-not-found") {
        errorMessage = "Nie znaleziono użytkownika z podanym adresem email."
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "Nieprawidłowy format adresu email."
      }

      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-8 text-[#539e1b] font-dongle">Resetowanie Hasła</h2>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-xl font-dongle">
          {error}
        </div>
      )}

      {message && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg text-xl font-dongle">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-xl font-bold text-gray-700 mb-3 font-dongle">
            Adres Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-4 border-2 border-[#e0ebd7] rounded-lg focus:border-[#539e1b] focus:outline-none text-xl font-dongle"
            placeholder="Wprowadź adres email"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 rounded-lg font-bold text-2xl transition-colors font-dongle ${
            isLoading ? "bg-gray-400 text-gray-600 cursor-not-allowed" : "bg-[#539e1b] text-white hover:bg-[#468619]"
          }`}
        >
          {isLoading ? "Wysyłanie..." : "Wyślij link resetujący"}
        </button>
      </form>

      <div className="mt-8 text-center">
        <button onClick={onBackToLogin} className="text-[#539e1b] hover:text-[#468619] text-xl font-bold font-dongle">
          Powrót do logowania
        </button>
      </div>
    </div>
  )
}
