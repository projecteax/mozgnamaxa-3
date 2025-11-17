"use client"

import Image from "next/image"

export default function CCLicenseFooter() {
  return (
    <div className="w-full max-w-6xl mx-auto mt-6 mb-4">
      <div className="bg-white/80 rounded-xl p-6 border-2 border-gray-200 shadow-md">
        <div className="flex flex-col items-center gap-4">
          {/* CC License Badge */}
          <div className="flex items-center gap-3">
            <a
              href="https://creativecommons.org/licenses/by/4.0/deed.pl"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <Image
                src="https://mirrors.creativecommons.org/presskit/buttons/88x31/svg/by.svg"
                alt="CC BY 4.0"
                width={88}
                height={31}
                className="object-contain"
              />
            </a>
          </div>

          {/* License Text */}
          <div className="text-center space-y-3 text-gray-700 font-sour-gummy">
            <p className="text-base sm:text-lg leading-relaxed">
              Niniejszy materiał opublikowany jest na licencji{" "}
              <strong>CC BY 4.0 (Creative Commons – Uznanie autorstwa – 4.0 Międzynarodowe)</strong>.
            </p>
            
            <p className="text-base sm:text-lg leading-relaxed">
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

            <p className="text-base sm:text-lg leading-relaxed">
              Co do zasady masz prawo do korzystania, używania i remiksowania niniejszego materiału w celach komercyjnych i niekomercyjnych, 
              przy jednoczesnej konieczności podania autorów i autorek materiału.
            </p>

            <p className="text-base sm:text-lg leading-relaxed">
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
    </div>
  )
}

