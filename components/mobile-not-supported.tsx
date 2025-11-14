"use client"

import { useEffect, useState } from "react"

export default function MobileNotSupported() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent
      // Only detect mobile phones, not tablets
      const isMobilePhone = /Android.*Mobile|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
      const isSmallScreen = window.innerWidth < 768
      setIsMobile(isMobilePhone || isSmallScreen)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (!isMobile) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-md mx-auto text-center bg-white rounded-lg shadow-lg p-8">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Strona nie jest dostosowana do urządzeń mobilnych
          </h1>
          <p className="text-gray-600 leading-relaxed">
            Ta aplikacja została zaprojektowana z myślą o przeglądarkach komputerowych. 
            Aby uzyskać najlepsze doświadczenie, prosimy o korzystanie z przeglądarki 
            na komputerze lub laptopie.
          </p>
          <p className="text-gray-600 leading-relaxed mt-3 font-semibold">
            Zalecana rozdzielczość to 1920x1080
          </p>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">Zalecane przeglądarki:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Google Chrome</li>
            <li>• Mozilla Firefox</li>
            <li>• Microsoft Edge</li>
            <li>• Safari (na Mac)</li>
          </ul>
        </div>

        <div className="text-sm text-gray-500">
          <p>Dziękujemy za zrozumienie!</p>
        </div>
      </div>
    </div>
  )
}
