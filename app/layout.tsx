import type React from "react"
import type { Metadata } from "next"
import { Dongle } from "next/font/google"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { SeasonProvider } from "@/contexts/season-context"

const dongle = Dongle({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dongle",
})

export const metadata: Metadata = {
  title: "Children's Learning Platform",
  description: "Interactive educational games for children",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={dongle.variable} suppressHydrationWarning>
      <body className={`${dongle.className} font-dongle`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <AuthProvider>
            <SeasonProvider>{children}</SeasonProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
