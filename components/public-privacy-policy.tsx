"use client"

import { X } from "lucide-react"

interface PublicPrivacyPolicyProps {
  onClose: () => void
}

export default function PublicPrivacyPolicy({ onClose }: PublicPrivacyPolicyProps) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-[#4A90E2] to-[#357ABD] px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-sour-gummy">Polityka Prywatności</h1>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Zamknij"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)] px-6 py-6">
          <div className="prose prose-lg max-w-none">
            <div className="text-gray-800 leading-relaxed space-y-4 font-sour-gummy">
              <p>
                Niniejsza Polityka Prywatności określa zasady przetwarzania i ochrony danych osobowych
                przekazanych przez Użytkowników w związku z korzystaniem przez nich z aplikacji MÓZG
                NA MAXA – ćwiczenia wspierające rozwój procesów myślowych u dzieci.
              </p>
              
              <p>
                Administratorem danych osobowych zawartych w serwisie jest Fundacja EduSEN z siedzibą
                w Przylepki 5b, 63-112 Brodnica.
              </p>
              
              <p>
                W trosce o bezpieczeństwo powierzonych nam danych opracowaliśmy wewnętrzne
                procedury i zalecenia, które mają zapobiec udostępnieniu danych osobom
                nieupoważnionym. Kontrolujemy ich wykonywanie i stale sprawdzamy ich zgodność z
                odpowiednimi aktami prawnymi – ustawą o ochronie danych osobowych, ustawą o
                świadczeniu usług drogą elektroniczną, a także wszelkiego rodzaju aktach wykonawczych i
                aktach prawa wspólnotowego.
              </p>
              
              <p>
                Dane Osobowe przetwarzane są na podstawie zgody wyrażanej przez Użytkownika oraz w
                przypadkach, w których przepisy prawa upoważniają Administratora do przetwarzania
                danych osobowych na podstawie przepisów prawa lub w celu realizacji zawartej pomiędzy
                stronami umowy.
              </p>
              
              <p>
                Serwis realizuje funkcje pozyskiwania informacji o użytkownikach i ich zachowaniach w
                następujący sposób:
              </p>
              
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>poprzez dobrowolnie wprowadzone w formularzach informacje</li>
                <li>poprzez gromadzenie plików „cookies"</li>
              </ul>
              
              <p>
                Serwis zbiera informacje dobrowolnie podane przez użytkownika. Dane podane w
                formularzu są przetwarzane w celu wynikającym z funkcji konkretnego formularza np. w
                celu rejestracji konta użytkownika lub przeprowadzenia procesu obsługi zgłoszenia serwisowego.
              </p>
              
              <p>
                Dane osobowe pozostawione w serwisie nie zostaną sprzedane ani udostępnione osobom
                trzecim, zgodnie z przepisami Ustawy o ochronie danych osobowych.
              </p>
              
              <p>
                Do danych zawartych w formularzu przysługuje wgląd osobie fizycznej, która je tam
                umieściła. Osoba ta ma również prawo do modyfikacji i zaprzestania przetwarzania
                swoich danych w dowolnym momencie.
              </p>
              
              <p>
                Zastrzegamy sobie prawo do zmiany w polityce ochrony prywatności serwisu.
                O wszelkich zmianach będziemy informować w sposób widoczny i zrozumiały.
              </p>
              
              <p>
                W razie wątpliwości co któregokolwiek z zapisów niniejszej polityki prywatności jesteśmy do
                dyspozycji – nasze dane kontaktowe: <a href="mailto:fundacja@edukacjasen.pl" className="text-blue-600 hover:text-blue-800 underline">fundacja@edukacjasen.pl</a>
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">Polityka plików cookies</h2>
              
              <p>
                Aplikacja MÓZG NA MAXA – ćwiczenia wspierające rozwój procesów myślowych u dzieci
                korzysta z plików cookie. Plik cookie to plik zawierający identyfikator (ciąg liter i cyfr), który
                jest wysyłany przez serwer internetowy do przeglądarki internetowej i przechowywany przez
                przeglądarkę na urządzeniu użytkownika serwisu.
              </p>
              
              <p>
                Dane identyfikacyjne są ponownie przesyłane na serwer za każdym razem, gdy
                przeglądarka internetowa wyśle żądanie otwarcia strony znajdującej się na serwerze.
              </p>
              
              <p>
                Pliki cookie mogą być „trwałymi" lub „sesyjnymi" plikami cookie:
              </p>
              
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>
                  trwałe pliki cookie będą przechowywane przez przeglądarkę internetową i pozostaną
                  ważne do ustalonej daty wygaśnięcia, chyba że użytkownik usunie je przed datą
                  wygaśnięcia,
                </li>
                <li>
                  sesyjny plik cookie wygasa z końcem sesji użytkownika, gdy przeglądarka
                  internetowa jest zamykana.
                </li>
              </ul>
              
              <p>
                Pliki cookies nie powodują zmian konfiguracyjnych w urządzeniu ani w oprogramowaniu
                zainstalowanym w tym urządzeniu. W każdym czasie użytkownik ma możliwość wyłączenia
                lub przywrócenia opcji gromadzenia cookies poprzez zmianę ustawień w przeglądarce
                internetowej. Instrukcja zarządzania plikami cookies jest dostępna na stronie:
                <br />
                <a href="http://www.allaboutcookies.org/manage-cookies" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">http://www.allaboutcookies.org/manage-cookies</a>
              </p>
              
              <p>
                Aplikacja wykorzystuje pliki cookie w celu:
              </p>
              
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Personalizacji treści wyświetlanych użytkownikowi</li>
                <li>Zapamiętywania preferencji użytkownika i ustawień wyświetlania</li>
                <li>Utrzymywania sesji użytkownika po zalogowaniu</li>
                <li>Zbierania anonimowych danych statystycznych dotyczących korzystania z aplikacji</li>
              </ul>
              
              <p className="mt-8 pt-4 border-t-2 border-gray-200 text-sm text-gray-600">
                Ostatnia aktualizacja: {new Date().toLocaleDateString('pl-PL')}
              </p>
            </div>
          </div>
        </div>

        {/* Footer z przyciskiem */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-[#4A90E2] to-[#357ABD] hover:from-[#357ABD] hover:to-[#2868A8] text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-sour-gummy text-lg"
          >
            Zamknij
          </button>
        </div>
      </div>
    </div>
  )
}

