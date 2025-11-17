"use client"

import { useState } from "react"
import PublicPrivacyPolicy from "./public-privacy-policy"

export default function AuthFooter() {
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false)

  return (
    <>
      <div className="w-full max-w-md mx-auto mt-6 mb-4">
        <div className="text-center space-y-4">
          {/* Creative Commons License - Compact version for forms */}
          <div className="bg-white/80 rounded-xl p-4 border-2 border-gray-200">
            <div className="flex flex-col items-center gap-3">
              {/* CC License Badge */}
              <a
                href="https://creativecommons.org/licenses/by/4.0/deed.pl"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <img
                  src="https://mirrors.creativecommons.org/presskit/buttons/88x31/svg/by.svg"
                  alt="CC BY 4.0"
                  className="h-8 w-auto"
                />
              </a>

              {/* License Text - Compact */}
              <div className="text-center space-y-2 text-gray-700 font-sour-gummy text-sm">
                <p className="leading-relaxed">
                  Niniejszy materiał opublikowany jest na licencji{" "}
                  <strong>CC BY 4.0 (Creative Commons – Uznanie autorstwa – 4.0 Międzynarodowe)</strong>.
                </p>
                
                <p className="leading-relaxed">
                  Szczegóły licencji znajdziesz{" "}
                  <a
                    href="https://creativecommons.org/licenses/by/4.0/deed.pl"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline font-bold"
                  >
                    TUTAJ
                  </a>
                  .
                </p>

                <p className="leading-relaxed text-xs">
                  Co do zasady masz prawo do korzystania, używania i remiksowania niniejszego materiału w celach komercyjnych i niekomercyjnych, 
                  przy jednoczesnej konieczności podania autorów i autorek materiału.
                </p>

                <p className="leading-relaxed text-xs">
                  Prosimy również, aby podać informację, że materiał powstał w ramach projektu{" "}
                  <strong>„POPOJUTRZE 3.0 – KSZTAŁCENIE"</strong>,{" "}
                  <a
                    href="https://www.popojutrze.pl"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline font-bold"
                  >
                    www.popojutrze.pl
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
          
          {/* Privacy Policy Link */}
          <p className="text-base text-gray-700 font-sour-gummy">
            <button
              onClick={() => setShowPrivacyPolicy(true)}
              className="text-blue-600 hover:text-blue-800 underline font-bold transition-colors"
            >
              📋 Polityka Prywatności
            </button>
          </p>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      {showPrivacyPolicy && (
        <PublicPrivacyPolicy onClose={() => setShowPrivacyPolicy(false)} />
      )}
    </>
  )
}

