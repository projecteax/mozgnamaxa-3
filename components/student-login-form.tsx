"use client"

import type React from "react"

import { useState } from "react"
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { db } from "@/lib/firebase"
import { useAuth } from "@/contexts/auth-context"

interface StudentLoginFormProps {
  onRegisterClick: () => void
  onForgotPasswordClick: () => void
  onSuccess: () => void
}

export default function StudentLoginForm({ onRegisterClick, onForgotPasswordClick, onSuccess }: StudentLoginFormProps) {
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and limit to 4 digits
    const numericValue = e.target.value.replace(/[^0-9]/g, "").slice(0, 4)
    setCode(numericValue)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Add "00" to the 4-digit code to create the 6-character password
      const password = `${code}00`
      
      // First try to log in normally
      try {
        await login(email, password)
        onSuccess()
        return
      } catch (loginError: any) {
        // If login fails, check if student exists in our database but doesn't have Firebase Auth account yet
        if (loginError.code === "auth/user-not-found" || loginError.code === "auth/invalid-credential") {
          console.log("User not found in Firebase Auth, checking students collection...")
          
          // Check if student exists in students collection
          const studentsQuery = query(
            collection(db, "students"),
            where("email", "==", email),
            where("password", "==", password),
            where("authCreated", "==", false)
          )
          const studentsSnapshot = await getDocs(studentsQuery)
          
          if (!studentsSnapshot.empty) {
            // Student exists but doesn't have Firebase Auth account yet - create it
            const studentDoc = studentsSnapshot.docs[0]
            const studentData = studentDoc.data()
            
            console.log("Creating Firebase Auth account for student...")
            
            // Create Firebase Auth account
            const authResult = await createUserWithEmailAndPassword(
              (await import("firebase/auth")).getAuth(),
              email,
              password
            )
            
            // Update student document with real Firebase UID and mark auth as created
            await updateDoc(doc(db, "students", studentDoc.id), {
              uid: authResult.user.uid,
              authCreated: true,
              password: null // Remove password from storage for security
            })
            
            console.log("Firebase Auth account created successfully")
            onSuccess()
            return
          }
        }
        
        // If we get here, either login failed for other reasons or student doesn't exist
        throw loginError
      }
    } catch (error: any) {
      setError("Nieprawidłowy email lub kod nauczyciela")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-[#3e459c]/20">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#3e459c] font-dongle">Logowanie ucznia</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 font-dongle">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-[1.6rem] font-medium text-[#3e459c] mb-1 font-dongle">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border-2 border-[#3e459c]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3e459c] focus:border-[#3e459c] font-dongle text-[1.6rem]"
              required
            />
          </div>

          <div>
            <label htmlFor="code" className="block text-[1.6rem] font-medium text-[#3e459c] mb-1 font-dongle">
              Kod nauczyciela (4 cyfry)
            </label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={handleCodeChange}
              maxLength={4}
              pattern="[0-9]{4}"
              inputMode="numeric"
              className="w-full px-3 py-2 border-2 border-[#3e459c]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3e459c] focus:border-[#3e459c] font-dongle text-[1.6rem]"
              required
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
            <span className="text-gray-600 font-dongle text-[1.6rem]">Nie masz konta? </span>
            <button onClick={onRegisterClick} className="text-[#3e459c] hover:underline font-bold font-dongle text-[1.6rem]">
              Zarejestruj się
            </button>
          </div>
        </div>
      </div>

      {/* Creative Commons License Footer */}
      <div className="w-full max-w-md mx-auto mt-4 mb-4">
        <div className="text-center text-sm text-gray-600">
          <p>
            Niniejszy materiał opublikowany jest na licencji{" "}
            <a 
              href="https://creativecommons.org/licenses/by/4.0/deed.pl" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              CC BY 4.0 (Creative Commons – Uznanie autorstwa – 4.0 Międzynarodowe)
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
