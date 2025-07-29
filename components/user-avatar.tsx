"use client"

interface UserAvatarProps {
  name: string
  size?: "sm" | "md" | "lg"
  className?: string
}

export default function UserAvatar({ name, size = "md", className = "" }: UserAvatarProps) {
  // Get initials from name
  const getInitials = (fullName: string): string => {
    const names = fullName.trim().split(" ")
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase()
    }
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase()
  }

  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-12 h-12 text-lg",
    lg: "w-16 h-16 text-xl",
  }

  return (
    <div
      className={`${sizeClasses[size]} bg-[#539e1b] text-white rounded-full flex items-center justify-center font-bold font-dongle ${className}`}
    >
      {getInitials(name)}
    </div>
  )
}
