"use client"

import { useState, useEffect } from "react"

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Sprawdź czy użytkownik już wyraził zgodę
    const consent = localStorage.getItem("cookieConsent")
    if (!consent) {
      // Pokaż banner po krótkiej chwili dla lepszego UX
      setTimeout(() => setShowBanner(true), 1000)
    }
  }, [])

  const handleAcceptAll = () => {
    localStorage.setItem("cookieConsent", "all")
    setShowBanner(false)
  }

  const handleAcceptEssential = () => {
    localStorage.setItem("cookieConsent", "essential")
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <>
      {/* Overlay - lekkie przyciemnienie tła */}
      <div className="fixed inset-0 bg-black/20 z-[9998] backdrop-blur-sm" />
      
      {/* Cookie Consent Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 sm:p-6 md:p-8">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl border-4 border-[#4A90E2] overflow-hidden">
          <div className="p-6 sm:p-8 md:p-10">
            <div className="flex flex-col gap-6">
              {/* Header z ikoną */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-[#4A90E2] rounded-full flex items-center justify-center">
                  <svg 
                    className="w-6 h-6 sm:w-7 sm:h-7 text-white" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 font-sour-gummy mb-2">
                    🍪 Używamy plików cookies
                  </h2>
                  <p className="text-base sm:text-lg text-gray-700 font-sour-gummy leading-relaxed">
                    Ta strona wykorzystuje pliki cookies w celu zapewnienia prawidłowego działania serwisu, 
                    zapamiętania Twoich preferencji oraz analizy ruchu na stronie. Pliki cookies pomagają 
                    nam dostosować treści do Twoich potrzeb i zapewnić najlepsze doświadczenia.
                  </p>
                </div>
              </div>

              {/* Informacje o typach cookies */}
              <div className="bg-blue-50 rounded-xl p-4 sm:p-5 border-2 border-blue-200">
                <h3 className="font-bold text-gray-800 mb-3 font-sour-gummy text-lg">
                  Jakie pliki cookies używamy:
                </h3>
                <ul className="space-y-2 text-sm sm:text-base text-gray-700 font-sour-gummy">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold flex-shrink-0 mt-1">✓</span>
                    <span><strong>Niezbędne:</strong> Wymagane do podstawowego działania aplikacji i zapisywania postępów w grach</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold flex-shrink-0 mt-1">✓</span>
                    <span><strong>Funkcjonalne:</strong> Zapamiętują Twoje preferencje i ustawienia</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold flex-shrink-0 mt-1">✓</span>
                    <span><strong>Analityczne:</strong> Pomagają nam zrozumieć, jak korzystasz z aplikacji</span>
                  </li>
                </ul>
              </div>

              {/* Przyciski akcji */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={handleAcceptAll}
                  className="flex-1 bg-gradient-to-r from-[#4A90E2] to-[#357ABD] hover:from-[#357ABD] hover:to-[#2868A8] text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-sour-gummy text-lg sm:text-xl"
                >
                  ✓ Akceptuj wszystkie
                </button>
                <button
                  onClick={handleAcceptEssential}
                  className="flex-1 bg-white hover:bg-gray-100 text-gray-700 font-bold py-4 px-6 rounded-xl border-3 border-gray-300 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-sour-gummy text-lg sm:text-xl"
                >
                  Tylko niezbędne
                </button>
              </div>

              {/* Linki do polityki */}
              <div className="text-center pt-2 border-t-2 border-gray-200">
                <p className="text-sm sm:text-base text-gray-600 font-sour-gummy">
                  Kontynuując korzystanie ze strony, wyrażasz zgodę na używanie plików cookies.
                  <br />
                  <button 
                    onClick={() => {
                      // W przyszłości można dodać modal z pełną polityką prywatności
                      alert("Szczegółowa polityka prywatności będzie dostępna wkrótce.")
                    }}
                    className="text-[#4A90E2] hover:text-[#357ABD] underline font-bold mt-1 inline-block"
                  >
                    Przeczytaj naszą Politykę Prywatności
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

