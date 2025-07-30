"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"

interface TeacherUserButtonProps {
  onLogout: () => void
  onGoToSeasonSelection: () => void
  teacherName?: string
}

export default function TeacherUserButton({ onLogout, onGoToSeasonSelection, teacherName }: TeacherUserButtonProps) {
  const { user, logout } = useAuth()
  const [showPopup, setShowPopup] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      onLogout()
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  // Get user initials from teacher name, display name or email
  const getUserInitials = () => {
    if (teacherName) {
      return teacherName
        .split(' ')
        .map(name => name.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    if (user?.displayName) {
      return user.displayName
        .split(' ')
        .map(name => name.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase()
    }
    return 'N'
  }

  return (
    <div className="relative">
      {/* User Avatar Button */}
      <button
        onClick={() => setShowPopup(!showPopup)}
        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg cursor-pointer transition-all duration-200 hover:scale-110"
        style={{ backgroundColor: '#3E459C' }}
      >
        {getUserInitials()}
      </button>

      {/* Dropdown Menu */}
      {showPopup && (
        <div className="absolute top-14 right-0 z-50">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2 min-w-36">
            <button
              onClick={() => {
                onGoToSeasonSelection()
                setShowPopup(false)
              }}
              className="w-full text-left px-4 py-2 text-sm font-sour-gummy hover:bg-gray-100 rounded transition-colors"
              style={{ color: '#3E459C' }}
            >
              Zagraj
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm font-sour-gummy hover:bg-gray-100 rounded transition-colors"
              style={{ color: '#3E459C' }}
            >
              Wyloguj
            </button>
          </div>
        </div>
      )}

      {/* Backdrop to close popup */}
      {showPopup && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowPopup(false)}
        />
      )}
    </div>
  )
}