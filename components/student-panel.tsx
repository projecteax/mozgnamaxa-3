"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import StudentLoginForm from "./student-login-form"
import StudentRegisterForm from "./student-register-form"
import ForgotPasswordForm from "./forgot-password-form"
import UserAvatar from "./user-avatar"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { getStudentProgress, type GameProgress } from "@/lib/progress-service"
import Image from "next/image"

interface StudentPanelProps {
  onMenuClick: () => void
}

type AuthView = "login" | "register" | "forgot-password" | "dashboard"

export default function StudentPanel({ onMenuClick }: StudentPanelProps) {
  const [view, setView] = useState<AuthView>("login")
  const [studentData, setStudentData] = useState<any>(null)
  const [teacherData, setTeacherData] = useState<any>(null)
  const [progress, setProgress] = useState<GameProgress>({})
  const [isLoading, setIsLoading] = useState(false)
  const { user, logout } = useAuth()

  // Fetch student data when user is authenticated
  useEffect(() => {
    const fetchStudentData = async () => {
      if (!user) {
        setStudentData(null)
        setTeacherData(null)
        setProgress({})
        return
      }

      setIsLoading(true)
      try {
        const q = query(collection(db, "students"), where("uid", "==", user.uid))
        const querySnapshot = await getDocs(q)

        if (!querySnapshot.empty) {
          const student = {
            id: querySnapshot.docs[0].id,
            ...querySnapshot.docs[0].data(),
          }
          setStudentData(student)

          // Fetch progress
          const studentProgress = await getStudentProgress(user.uid)
          setProgress(studentProgress)

          // Fetch teacher data using teacher_code
          if (student.teacher_code) {
            const teacherQuery = query(collection(db, "users"), where("unique_code", "==", student.teacher_code))
            const teacherSnapshot = await getDocs(teacherQuery)

            if (!teacherSnapshot.empty) {
              setTeacherData({
                id: teacherSnapshot.docs[0].id,
                ...teacherSnapshot.docs[0].data(),
              })
            }
          }

          setView("dashboard")
        }
      } catch (error) {
        console.error("Error fetching student data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStudentData()
  }, [user])

  const handleLogout = async () => {
    try {
      await logout()
      setView("login")
      setStudentData(null)
      setTeacherData(null)
      setProgress({})
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const getTotalCompletions = () => {
    return Object.values(progress).reduce((total, count) => total + count, 0)
  }

  return (
    <div className="w-full max-w-6xl min-h-screen bg-[#e3f7ff] p-4">
      {/* Header with title - matching other games exactly */}
      <div className="w-full flex justify-between items-center mb-8">
        <div className="relative w-16 h-16">
          <Image src="/images/sound.png" alt="Sound" fill className="object-contain cursor-pointer" />
        </div>

        <div className="relative h-24 w-80 md:w-[500px] flex items-center justify-center">
          <Image src="/images/title_box_small.png" alt="Title box" fill className="object-contain" />
          <span className="relative z-10 text-white text-2xl md:text-3xl font-bold font-dongle">PANEL UCZNIA</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Show avatar when logged in */}
          {studentData && <UserAvatar name={studentData.name} size="md" />}
          <div className="relative w-16 h-16" onClick={onMenuClick}>
            <Image src="/images/menu.png" alt="Menu" fill className="object-contain cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Game area - matching other games layout */}
      <div className="flex justify-center items-center mt-16">
        <div className="flex flex-col items-center w-full">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3e459c]"></div>
            </div>
          ) : view === "login" ? (
            <StudentLoginForm
              onRegisterClick={() => setView("register")}
              onForgotPasswordClick={() => setView("forgot-password")}
              onSuccess={() => setView("dashboard")}
            />
          ) : view === "register" ? (
            <StudentRegisterForm onLoginClick={() => setView("login")} onSuccess={() => setView("dashboard")} />
          ) : view === "forgot-password" ? (
            <ForgotPasswordForm onBackToLogin={() => setView("login")} />
          ) : (
            <div className="w-full max-w-4xl">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-4xl font-bold text-[#3e459c] font-dongle">
                  Witaj, {studentData?.name || "Uczniu"}!
                </h2>
                <button
                  onClick={handleLogout}
                  className="px-6 py-3 bg-[#3e459c] hover:bg-[#2d3a8c] text-white rounded-full font-bold text-xl transition-colors font-dongle"
                >
                  Wyloguj się
                </button>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
                <h3 className="text-3xl font-bold mb-6 text-[#3e459c] font-dongle">Twoje informacje</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[#e3f7ff] p-6 rounded-xl border-2 border-[#3e459c]/20">
                    <p className="text-xl text-gray-600 mb-2 font-dongle">Imię i nazwisko</p>
                    <p className="font-bold text-2xl text-[#3e459c] font-dongle">{studentData?.name}</p>
                  </div>
                  <div className="bg-[#e3f7ff] p-6 rounded-xl border-2 border-[#3e459c]/20">
                    <p className="text-xl text-gray-600 mb-2 font-dongle">Email</p>
                    <p className="font-bold text-2xl text-[#3e459c] font-dongle">{studentData?.email}</p>
                  </div>
                  <div className="bg-[#e3f7ff] p-6 rounded-xl border-2 border-[#3e459c]/20">
                    <p className="text-xl text-gray-600 mb-2 font-dongle">Kod nauczyciela</p>
                    <p className="font-bold text-4xl text-[#3e459c] font-dongle">{studentData?.teacher_code}</p>
                  </div>
                  <div className="bg-[#e3f7ff] p-6 rounded-xl border-2 border-[#3e459c]/20">
                    <p className="text-xl text-gray-600 mb-2 font-dongle">Ukończone gry</p>
                    <p className="font-bold text-4xl text-[#3e459c] font-dongle">{getTotalCompletions()}</p>
                  </div>
                </div>
              </div>

              {teacherData && (
                <div className="bg-[#e3f7ff] border-l-4 border-[#3e459c] p-6 rounded-lg">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-xl text-[#3e459c] font-dongle">
                        <strong>Informacja:</strong> Jesteś przypisany do klasy nauczyciela{" "}
                        <span className="font-bold text-2xl">{teacherData.name}</span> ze szkoły{" "}
                        <span className="font-bold">{teacherData.school}</span>.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
