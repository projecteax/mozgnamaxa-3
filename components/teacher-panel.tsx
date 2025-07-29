"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import LoginForm from "./login-form"
import RegisterForm from "./register-form"
import ForgotPasswordForm from "./forgot-password-form"
import StudentProgressTable from "./student-progress-table"
import UserAvatar from "./user-avatar"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { getTeacherStudents, type StudentProgress } from "@/lib/progress-service"
import Image from "next/image"

interface TeacherPanelProps {
  onMenuClick: () => void
}

type AuthView = "login" | "register" | "forgot-password" | "dashboard" | "student-progress"

export default function TeacherPanel({ onMenuClick }: TeacherPanelProps) {
  const [view, setView] = useState<AuthView>("login")
  const [teacherData, setTeacherData] = useState<any>(null)
  const [students, setStudents] = useState<StudentProgress[]>([])
  const [selectedStudent, setSelectedStudent] = useState<StudentProgress | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { user, logout } = useAuth()

  // Fetch teacher data when user is authenticated
  useEffect(() => {
    const fetchTeacherData = async () => {
      if (!user) {
        setTeacherData(null)
        setStudents([])
        return
      }

      setIsLoading(true)
      try {
        const q = query(collection(db, "users"), where("uid", "==", user.uid))
        const querySnapshot = await getDocs(q)

        if (!querySnapshot.empty) {
          const teacher = {
            id: querySnapshot.docs[0].id,
            ...querySnapshot.docs[0].data(),
          }
          setTeacherData(teacher)

          // Fetch students for this teacher
          if (teacher.unique_code) {
            console.log("Teacher unique code:", teacher.unique_code)
            const teacherStudents = await getTeacherStudents(teacher.unique_code)
            console.log("Teacher students fetched:", teacherStudents)
            setStudents(teacherStudents)
          }

          setView("dashboard")
        }
      } catch (error) {
        console.error("Error fetching teacher data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTeacherData()
  }, [user])

  const handleLogout = async () => {
    try {
      await logout()
      setView("login")
      setTeacherData(null)
      setStudents([])
      setSelectedStudent(null)
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const handleStudentClick = (student: StudentProgress) => {
    console.log("Student clicked:", student.name, "Progress:", student.progress)
    setSelectedStudent(student)
    setView("student-progress")
  }

  const handleBackToStudents = () => {
    setSelectedStudent(null)
    setView("dashboard")
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
          <span className="relative z-10 text-white text-2xl md:text-3xl font-bold font-dongle">PANEL NAUCZYCIELA</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Show avatar when logged in */}
          {teacherData && <UserAvatar name={teacherData.name} size="md" />}
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
            <LoginForm
              onRegisterClick={() => setView("register")}
              onForgotPasswordClick={() => setView("forgot-password")}
              onSuccess={() => setView("dashboard")}
            />
          ) : view === "register" ? (
            <RegisterForm onLoginClick={() => setView("login")} onSuccess={() => setView("dashboard")} />
          ) : view === "forgot-password" ? (
            <ForgotPasswordForm onBackToLogin={() => setView("login")} />
          ) : view === "student-progress" && selectedStudent ? (
            <StudentProgressTable
              studentName={selectedStudent.name}
              progress={selectedStudent.progress}
              onBack={handleBackToStudents}
            />
          ) : (
            <div className="w-full max-w-4xl">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-4xl font-bold text-[#3e459c] font-dongle">
                  Witaj, {teacherData?.name || "Nauczycielu"}!
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
                    <p className="font-bold text-2xl text-[#3e459c] font-dongle">{teacherData?.name}</p>
                  </div>
                  <div className="bg-[#e3f7ff] p-6 rounded-xl border-2 border-[#3e459c]/20">
                    <p className="text-xl text-gray-600 mb-2 font-dongle">Email</p>
                    <p className="font-bold text-2xl text-[#3e459c] font-dongle">{teacherData?.email}</p>
                  </div>
                  <div className="bg-[#e3f7ff] p-6 rounded-xl border-2 border-[#3e459c]/20">
                    <p className="text-xl text-gray-600 mb-2 font-dongle">Szkoła</p>
                    <p className="font-bold text-2xl text-[#3e459c] font-dongle">{teacherData?.school}</p>
                  </div>
                  <div className="bg-[#e3f7ff] p-6 rounded-xl border-2 border-[#3e459c]/20">
                    <p className="text-xl text-gray-600 mb-2 font-dongle">Unikalny kod</p>
                    <p className="font-bold text-4xl text-[#3e459c] font-dongle">{teacherData?.unique_code}</p>
                  </div>
                </div>
              </div>

              {/* Students List */}
              <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
                <h3 className="text-3xl font-bold mb-6 text-[#3e459c] font-dongle">
                  Twoi uczniowie ({students.length})
                </h3>
                {students.length === 0 ? (
                  <p className="text-xl text-gray-600 font-dongle text-center py-8">Brak zarejestrowanych uczniów</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {students.map((student) => {
                      return (
                        <div
                          key={student.uid}
                          onClick={() => handleStudentClick(student)}
                          className="bg-[#e3f7ff] p-6 rounded-xl border-2 border-[#3e459c]/20 cursor-pointer hover:bg-[#b8e6ff] transition-colors"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <UserAvatar name={student.name} size="sm" />
                            <div>
                              <p className="font-bold text-lg text-[#3e459c] font-dongle">{student.name}</p>
                              <p className="text-sm text-gray-600 font-dongle">{student.email}</p>
                            </div>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600 font-dongle">Ukończone gry:</p>
                            <p className="font-bold text-md text-[#3e459c] font-dongle">
                              {(() => {
                                const progress = student.progress || {};
                                const gameResults = progress.gameResults || {};
                                
                                // Debug logging
                                console.log(`Student ${student.name} progress:`, progress);
                                console.log(`Student ${student.name} gameResults:`, gameResults);
                                
                                const seasons = [
                                  { key: 'wiosna', label: 'Wiosna' },
                                  { key: 'lato', label: 'Lato' },
                                  { key: 'jesien', label: 'Jesień' },
                                  { key: 'zima', label: 'Zima' },
                                ];
                                return seasons.map((season, idx) => {
                                  const seasonGames = gameResults[season.key] || {};
                                  console.log(`Student ${student.name} ${season.key} games:`, seasonGames);
                                  const completed = Object.values(seasonGames).reduce((sum: number, g: any) => {
                                    console.log(`Game completion data:`, g);
                                    return sum + (g.completed || 0);
                                  }, 0);
                                  console.log(`Student ${student.name} ${season.key} total completed:`, completed);
                                  return `${season.label} - ${completed}` + (idx < seasons.length - 1 ? ', ' : '');
                                }).join(' ');
                              })()}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              <div className="bg-[#e3f7ff] border-l-4 border-[#3e459c] p-6 rounded-lg">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-xl text-[#3e459c] font-dongle">
                      <strong>Informacja:</strong> Twój unikalny kod to{" "}
                      <span className="font-bold text-2xl">{teacherData?.unique_code}</span>. Możesz go udostępnić
                      uczniom, aby mogli dołączyć do Twojej klasy. Kliknij na ucznia, aby zobaczyć jego postępy.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
