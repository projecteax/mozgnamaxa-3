"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"

interface LoginFormProps {
  onRegisterClick: () => void
  onForgotPasswordClick: () => void
  onSuccess?: () => void
}

export default function LoginForm({ onRegisterClick, onForgotPasswordClick, onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await login(email, password)
      if (onSuccess) {
        onSuccess()
      }
    } catch (err: any) {
      let errorMessage = "Wystąpił błąd podczas logowania."

      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        errorMessage = "Nieprawidłowy email lub hasło."
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "Nieprawidłowy format adresu email."
      } else if (err.code === "auth/too-many-requests") {
        errorMessage = "Zbyt wiele nieudanych prób logowania. Spróbuj ponownie później."
      }

      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-[#3e459c]/20">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#3e459c] font-dongle">Logowanie dla nauczyciela</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 font-dongle">
            {error}
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

          <div>
            <label htmlFor="password" className="block text-[1.6rem] font-medium text-[#3e459c] mb-1 font-dongle">
              Hasło
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border-2 border-[#3e459c]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3e459c] focus:border-[#3e459c] font-dongle text-[1.6rem]"
              placeholder="Wprowadź hasło"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#3e459c] hover:bg-[#2d3470] text-white font-bold py-2 px-4 rounded-md transition-colors disabled:opacity-50 font-dongle text-[1.6rem]"
          >
            {isLoading ? "Logowanie..." : "Zaloguj się"}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <button onClick={onForgotPasswordClick} className="text-[#3e459c] hover:underline font-dongle text-[1.6rem]">
            Zapomniałeś hasła?
          </button>
          <div>
            <button onClick={onRegisterClick} className="text-[#3e459c] hover:underline font-dongle text-[1.6rem]">
              Nie masz konta? Zarejestruj się
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
