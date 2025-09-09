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
      console.log("Attempting to send password reset email to:", email)
      await resetPassword(email)
      console.log("Password reset email sent successfully")
      setMessage("Link do resetowania hasła został wysłany na podany adres email. Sprawdź folder spam, jeśli nie otrzymałeś wiadomości w ciągu kilku minut.")
    } catch (err: any) {
      console.error("Password reset error:", err)
      console.error("Error code:", err.code)
      console.error("Error message:", err.message)
      
      let errorMessage = "Wystąpił błąd podczas wysyłania linku resetującego hasło."

      if (err.code === "auth/user-not-found") {
        errorMessage = "Nie znaleziono użytkownika z podanym adresem email."
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "Nieprawidłowy format adresu email."
      } else if (err.code === "auth/too-many-requests") {
        errorMessage = "Zbyt wiele prób. Spróbuj ponownie później."
      } else if (err.code === "auth/network-request-failed") {
        errorMessage = "Błąd połączenia. Sprawdź połączenie internetowe."
      } else {
        errorMessage = `Błąd: ${err.message || err.code || "Nieznany błąd"}`
      }

      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-screen w-screen bg-[#e3f7ff] flex justify-center items-center m-0 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-[#3e459c]/20">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#3e459c] font-dongle">Resetowanie Hasła</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 font-dongle">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 font-dongle">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-[1.6rem] font-medium text-[#3e459c] mb-1 font-dongle">
              Adres Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border-2 border-[#3e459c]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3e459c] focus:border-[#3e459c] font-dongle text-[1.6rem]"
              placeholder="Wprowadź adres email"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#3e459c] hover:bg-[#2d3470] text-white font-bold py-2 px-4 rounded-md transition-colors disabled:opacity-50 font-dongle text-[1.6rem]"
          >
            {isLoading ? "Wysyłanie..." : "Wyślij link resetujący"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={onBackToLogin} className="text-[#3e459c] hover:underline font-dongle text-[1.6rem]">
            Powrót do logowania
          </button>
        </div>
        </div>
      </div>
    </div>
  )
}
