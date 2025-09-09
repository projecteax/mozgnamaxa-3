"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import LoginForm from "./login-form"
import RegisterForm from "./register-form"
import ForgotPasswordForm from "./forgot-password-form"
import StudentProgressTable from "./student-progress-table"
import UserAvatar from "./user-avatar"
import TeacherUserButton from "./teacher-user-button"
import TeacherStudentRegisterForm from "./teacher-student-register-form"
import PrivacyPolicyPage from "./privacy-policy-page"
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { getTeacherStudents, type StudentProgress } from "@/lib/progress-service"
import { Season, SEASON_INFO, isValidSeason } from "@/lib/season-utils"
import Image from "next/image"

interface TeacherPanelProps {
  onMenuClick: () => void
  isCreatingStudent: boolean
  setIsCreatingStudent: (value: boolean) => void
}

type AuthView = "login" | "register" | "forgot-password" | "dashboard" | "student-progress" | "create-student" | "privacy-policy"

export default function TeacherPanel({ onMenuClick, isCreatingStudent, setIsCreatingStudent }: TeacherPanelProps) {
  const [view, setView] = useState<AuthView>("login")
  const [teacherData, setTeacherData] = useState<any>(null)
  const [students, setStudents] = useState<any[]>([])
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null)
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
          const teacherData = querySnapshot.docs[0].data()
          const teacher = {
            id: querySnapshot.docs[0].id,
            ...teacherData,
          }
          setTeacherData(teacher)

          // Fetch students for this teacher
          if (teacherData.unique_code) {
            console.log("Teacher unique code:", teacherData.unique_code)
            const teacherStudents = await getTeacherStudents(teacherData.unique_code)
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

  const handleStudentClick = (student: any) => {
    console.log("Student clicked:", student.name, "Progress:", student.progress)
    setSelectedStudent(student)
    setView("student-progress")
  }

  const handleBackToStudents = () => {
    setSelectedStudent(null)
    setView("dashboard")
  }

  const handleCreateStudentAccount = () => {
    setView("create-student")
  }

  const handlePrivacyPolicy = () => {
    setView("privacy-policy")
  }

  const handleTeacherPanel = () => {
    setView("dashboard")
  }

  const handleStudentCreated = () => {
    setView("dashboard")
    // Refresh students list
    if (teacherData?.unique_code) {
      getTeacherStudents(teacherData.unique_code).then(setStudents)
    }
  }

  const handleInitialSeasonChange = async (studentId: string, newSeason: Season) => {
    try {
      setIsLoading(true)
      
      // Update student document with new initial season
      const studentRef = doc(db, "students", studentId)
      await updateDoc(studentRef, {
        initialSeason: newSeason,
        updatedAt: new Date()
      })
      
      // Refresh students list to reflect changes
      if (teacherData?.unique_code) {
        const updatedStudents = await getTeacherStudents(teacherData.unique_code)
        setStudents(updatedStudents)
      }
      
      console.log(`Updated initial season for student ${studentId} to ${newSeason}`)
    } catch (error) {
      console.error("Error updating student initial season:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteStudent = async () => {
    if (!selectedStudent?.id) return

    try {
      // Delete student from Firestore
      await deleteDoc(doc(db, "students", selectedStudent.id))
      
      // Remove from local state
      setStudents(students.filter(s => s.id !== selectedStudent.id))
      setSelectedStudent(null)
      setView("dashboard")
      
      console.log("Student deleted successfully")
    } catch (error) {
      console.error("Error deleting student:", error)
    }
  }

  return (
    <div className="min-h-screen bg-[#e3f7ff] flex justify-center items-center p-4">
      <div className="w-full max-w-6xl min-h-screen rounded-lg p-4">
        {/* Header with title */}
        <div className="w-full flex justify-between items-center mb-8">
          {/* Empty space for layout balance */}
          <div className="w-16 h-16"></div>

          {/* Title without background image */}
          <div className="flex items-center justify-center">
            <h1 className="text-2xl md:text-3xl font-bold font-sour-gummy" style={{ color: '#3E459C' }}>
              PANEL NAUCZYCIELA
            </h1>
          </div>

          {/* User initials button with dropdown */}
          <div className="flex items-center">
            {teacherData && (
              <TeacherUserButton 
                onLogout={handleLogout}
                onCreateStudentAccount={handleCreateStudentAccount}
                onPrivacyPolicy={handlePrivacyPolicy}
                onTeacherPanel={handleTeacherPanel}
                teacherName={teacherData.name}
              />
            )}
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
                onDeleteStudent={handleDeleteStudent}
                studentId={selectedStudent.id}
              />
            ) : view === "create-student" ? (
              <TeacherStudentRegisterForm
                onSuccess={handleStudentCreated}
                onCancel={() => setView("dashboard")}
                teacherCode={teacherData?.unique_code || ""}
                isCreatingStudent={isCreatingStudent}
                setIsCreatingStudent={setIsCreatingStudent}
              />
            ) : view === "privacy-policy" ? (
              <PrivacyPolicyPage
                onBackClick={() => setView("dashboard")}
              />
            ) : (
              <div className="w-full max-w-4xl">
                <div className="flex justify-center items-center mb-8">
                  <h2 className="text-4xl font-bold text-[#3e459c] font-sour-gummy text-center">
                    Witaj, {teacherData?.name || "Nauczycielu"}!
                  </h2>
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
                  
                  {/* Additional information text */}
                  <div className="mt-6 p-4 bg-[#e3f7ff] rounded-xl border-2 border-[#3e459c]/20">
                    <p className="text-lg text-gray-700 leading-relaxed font-dongle">
                      Twój unikalny kod to <span className="font-bold text-[#3e459c]">{teacherData?.unique_code}</span>. 
                      Po stworzeniu konta ucznia udostępnij mu kod wraz z mailem, np. imię@mozgnamaxa.pl, 
                      aby mógł się zalogować i dołączyć do Twojego panelu. Dla każdego ucznia wybierz startową porę roku. 
                      Kliknij na ucznia, aby zobaczyć jego postępy.
                    </p>
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
                                   console.log(`Student ${student.name} full student object:`, student);
                                   console.log(`Student ${student.name} progress:`, progress);
                                   console.log(`Student ${student.name} gameResults:`, gameResults);
                                   console.log(`Student ${student.name} gameResults keys:`, Object.keys(gameResults));
                                   
                                   // Process the flat structure like in student-progress-table
                                   const seasonMap: Record<string, string> = {
                                     'spring': 'wiosna',
                                     'summer': 'lato',
                                     'autumn': 'jesien',
                                     'winter': 'zima'
                                   }
                                   
                                   const seasonCounts: Record<string, number> = { wiosna: 0, lato: 0, jesien: 0, zima: 0 };
                                   
                                   Object.entries(gameResults).forEach(([gameKey, gameData]: [string, any]) => {
                                     const parts = gameKey.split('-');
                                     const englishSeason = parts[parts.length - 1];
                                     const polishSeason = seasonMap[englishSeason];
                                     
                                     if (polishSeason && gameData.completed) {
                                       seasonCounts[polishSeason] += gameData.completed || 0;
                                     }
                                   });
                                   
                                   const seasons = [
                                     { key: 'wiosna', label: 'Wiosna' },
                                     { key: 'lato', label: 'Lato' },
                                     { key: 'jesien', label: 'Jesień' },
                                     { key: 'zima', label: 'Zima' },
                                   ];
                                   
                                   return seasons.map((season, idx) => {
                                     const completed = seasonCounts[season.key] || 0;
                                     console.log(`Student ${student.name} ${season.key} total completed:`, completed);
                                     return `${season.label} - ${completed}` + (idx < seasons.length - 1 ? ', ' : '');
                                   }).join(' ');
                                 })()}
                               </p>
                            </div>
                            
                            {/* Initial Season Selector */}
                            <div className="mt-4 pt-4 border-t border-[#3e459c]/20">
                              <p className="text-sm text-gray-600 font-dongle mb-2">Startowa pora roku:</p>
                              <select 
                                value={student.initialSeason || "wiosna"}
                                onChange={(e) => {
                                  e.stopPropagation() // Prevent card click
                                  const newSeason = e.target.value as Season
                                  if (isValidSeason(newSeason)) {
                                    handleInitialSeasonChange(student.id, newSeason)
                                  }
                                }}
                                onClick={(e) => e.stopPropagation()} // Prevent card click
                                className="w-full px-3 py-2 text-sm border border-[#3e459c]/30 rounded-lg bg-white font-dongle focus:outline-none focus:ring-2 focus:ring-[#3e459c]/50"
                                disabled={isLoading}
                              >
                                {Object.values(SEASON_INFO).map((season) => (
                                  <option key={season.id} value={season.id}>
                                    {season.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>
        </div>

        {/* Creative Commons License Footer */}
        <div className="w-full max-w-6xl mx-auto mt-8 mb-4">
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
    </div>
  )
}
