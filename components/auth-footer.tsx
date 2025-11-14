"use client"

import { useState } from "react"
import PublicPrivacyPolicy from "./public-privacy-policy"

export default function AuthFooter() {
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false)

  return (
    <>
      <div className="w-full max-w-md mx-auto mt-6 mb-4">
        <div className="text-center space-y-3">
          {/* Creative Commons License */}
          <p className="text-base text-gray-700 font-sour-gummy leading-relaxed">
            Niniejszy materiał opublikowany jest na licencji{" "}
            <a 
              href="https://creativecommons.org/licenses/by/4.0/deed.pl" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-bold"
            >
              CC BY 4.0
            </a>
          </p>
          
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

