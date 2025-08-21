"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  type User,
} from "firebase/auth"
import app from "@/lib/firebase"

interface AuthContextType {
  user: User | null
  register: (email: string, password: string) => Promise<any>
  createUserWithoutSignIn: (email: string, password: string) => Promise<any>
  login: (email: string, password: string) => Promise<any>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  setAuthListenerEnabled: (enabled: boolean) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [authListenerEnabled, setAuthListenerEnabled] = useState(true)
  const auth = getAuth(app)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (authListenerEnabled) {
        setUser(user)
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [auth, authListenerEnabled])

  const register = async (email: string, password: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    return result.user
  }

  const createUserWithoutSignIn = async (email: string, password: string) => {
    // Temporarily disable auth state listener to prevent redirection
    const currentUser = auth.currentUser
    
    // Create the new user (this will sign them in)
    const result = await createUserWithEmailAndPassword(auth, email, password)
    
    // Immediately sign out the newly created user
    await signOut(auth)
    
    // If there was a previous user, we need to sign them back in
    // This is a limitation of Firebase Auth - we can't create users without signing them in
    // So we'll need to handle this differently
    
    return result.user
  }

  const login = async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password)
    return result.user
  }

  const logout = async () => {
    await signOut(auth)
  }

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email)
  }

  const value = {
    user,
    register,
    createUserWithoutSignIn,
    login,
    logout,
    resetPassword,
    setAuthListenerEnabled,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
