"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth"
import { getAuth } from "firebase/auth"
import app from "@/lib/firebase"

function ResetPasswordContent() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isValidCode, setIsValidCode] = useState(false)
  const [email, setEmail] = useState("")
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const auth = getAuth(app)

  useEffect(() => {
    const oobCode = searchParams.get('oobCode')
    const mode = searchParams.get('mode')
    
    if (mode === 'resetPassword' && oobCode) {
      // Verify the password reset code
      verifyPasswordResetCode(auth, oobCode)
        .then((email) => {
          setEmail(email)
          setIsValidCode(true)
        })
        .catch((error) => {
          console.error('Error verifying password reset code:', error)
          setError('Nieprawidłowy lub wygasły link resetowania hasła.')
        })
    } else {
      setError('Nieprawidłowy link resetowania hasła.')
    }
  }, [searchParams, auth])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setMessage("")

    if (password !== confirmPassword) {
      setError("Hasła nie są identyczne.")
      return
    }

    if (password.length < 6) {
      setError("Hasło musi mieć co najmniej 6 znaków.")
      return
    }

    setIsLoading(true)
    const oobCode = searchParams.get('oobCode')

    try {
      if (oobCode) {
        await confirmPasswordReset(auth, oobCode, password)
        setMessage("Hasło zostało pomyślnie zresetowane. Możesz się teraz zalogować.")
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/')
        }, 3000)
      }
    } catch (err: any) {
      let errorMessage = "Wystąpił błąd podczas resetowania hasła."

      if (err.code === "auth/weak-password") {
        errorMessage = "Hasło jest zbyt słabe."
      } else if (err.code === "auth/expired-action-code") {
        errorMessage = "Link resetowania hasła wygasł. Poproś o nowy link."
      } else if (err.code === "auth/invalid-action-code") {
        errorMessage = "Nieprawidłowy link resetowania hasła."
      }

      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isValidCode && !error) {
    return (
      <div className="min-h-screen bg-[#e3f7ff] flex justify-center items-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#3e459c]"></div>
            </div>
            <p className="text-center mt-4 text-gray-600 font-dongle">Weryfikacja linku...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#e3f7ff] flex justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-[#3e459c]/20">
          <h2 className="text-3xl font-bold text-center mb-6 text-[#3e459c] font-dongle">
            Resetowanie Hasła
          </h2>

          {email && (
            <p className="text-center text-gray-600 mb-6 font-dongle">
              Resetowanie hasła dla: <span className="font-bold text-[#3e459c]">{email}</span>
            </p>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-lg font-dongle">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg text-lg font-dongle">
              {message}
            </div>
          )}

          {isValidCode && !message && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-lg font-medium text-[#3e459c] mb-2 font-dongle">
                  Nowe Hasło
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border-2 border-[#3e459c]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3e459c] focus:border-[#3e459c] font-dongle text-lg"
                  placeholder="Wprowadź nowe hasło"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-lg font-medium text-[#3e459c] mb-2 font-dongle">
                  Potwierdź Hasło
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border-2 border-[#3e459c]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3e459c] focus:border-[#3e459c] font-dongle text-lg"
                  placeholder="Potwierdź nowe hasło"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#3e459c] hover:bg-[#2d3470] text-white font-bold py-3 px-4 rounded-md transition-colors disabled:opacity-50 font-dongle text-lg"
              >
                {isLoading ? "Resetowanie..." : "Zresetuj Hasło"}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <button 
              onClick={() => router.push('/')} 
              className="text-[#3e459c] hover:underline font-dongle text-lg"
            >
              Powrót do strony głównej
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#e3f7ff] flex justify-center items-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#3e459c]"></div>
            </div>
            <p className="text-center mt-4 text-gray-600 font-dongle">Ładowanie...</p>
          </div>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}
