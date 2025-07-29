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
    <div className="w-full max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-8 text-[#539e1b] font-dongle">Logowanie</h2>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-xl font-dongle">
          {error}
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

        <div>
          <label htmlFor="password" className="block text-xl font-bold text-gray-700 mb-3">
            Hasło
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-4 border-2 border-[#e0ebd7] rounded-lg focus:border-[#539e1b] focus:outline-none text-xl font-dongle"
            placeholder="Wprowadź hasło"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 rounded-lg font-bold text-2xl transition-colors font-dongle ${
            isLoading ? "bg-gray-400 text-gray-600 cursor-not-allowed" : "bg-[#539e1b] text-white hover:bg-[#468619]"
          }`}
        >
          {isLoading ? "Logowanie..." : "Zaloguj się"}
        </button>
      </form>

      <div className="mt-8 flex flex-col items-center space-y-4">
        <button onClick={onForgotPasswordClick} className="text-[#539e1b] hover:text-[#468619] text-xl font-dongle">
          Zapomniałeś hasła?
        </button>
        <button onClick={onRegisterClick} className="text-[#539e1b] hover:text-[#468619] font-bold text-xl font-dongle">
          Nie masz konta? Zarejestruj się
        </button>
      </div>
    </div>
  )
}
