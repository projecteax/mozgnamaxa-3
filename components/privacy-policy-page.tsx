"use client"
import Image from "next/image"
import { useSeason } from "@/contexts/season-context"

interface PrivacyPolicyPageProps {
  onBackClick: () => void
}

export default function PrivacyPolicyPage({ onBackClick }: PrivacyPolicyPageProps) {
  const { getThemeColors } = useSeason()
  const theme = getThemeColors()

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center px-8 overflow-hidden bg-[#e3f7ff]">
      
      {/* Header */}
      <div className="w-full max-w-4xl flex justify-center items-center mb-6">
        <h1 className="text-3xl font-bold" style={{ color: theme.primaryColor }}>Polityka Prywatności</h1>
      </div>

      {/* Content container */}
      <div className="w-full max-w-4xl bg-white bg-opacity-95 rounded-2xl shadow-2xl p-8">
        <div className="prose prose-lg max-w-none">
          <div className="text-gray-800 leading-relaxed space-y-4">
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
              Aplikacja realizuje funkcje pozyskiwania informacji o użytkownikach i ich zachowaniach w
              następujący sposób:
            </p>
            
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>poprzez dobrowolnie wprowadzone w formularzach informacje</li>
              <li>poprzez gromadzenie tzw. plików cookies.</li>
            </ul>
            
            <p>
              Aplikacja zbiera informacje dobrowolnie podane przez użytkownika.
              Dane podane w formularzu są przetwarzane w celu wynikającym z funkcji konkretnego
              formularza np. w celu dokonania procesu utworzenia konta użytkownika.
            </p>
            
            <p>
              Dane osobowe pozostawione w serwisie nie zostaną sprzedane ani udostępnione osobom
              trzecim, zgodnie z przepisami Ustawy o ochronie danych osobowych.
            </p>
            
            <p>
              Do danych zawartych w formularzu przysługuje wgląd osobie fizycznej, która je tam
              umieściła. Osoba ta ma również prawo do modyfikacji i zaprzestania przetwarzania swoich
              danych w dowolnym momencie.
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
              Pliki cookie zazwyczaj nie zawierają żadnych informacji identyfikujących użytkownika, ale
              dane osobowe, które przechowujemy, mogą być powiązane z informacjami
              przechowywanymi w plikach cookie.
            </p>
            
            <p>
              Nasze pliki cookie, są nam niezbędne do korzystania z narzędzi analitycznych.
            </p>
            
            <p>
              Większość przeglądarek pozwala odmówić przyjęcia plików cookie, można to zrobić
              zmieniając ustawienia swojej przeglądarki internetowej.
            </p>
            
            <p>
              Zablokowanie wszystkich plików cookie będzie miało negatywny wpływ na możliwość
              korzystania z wielu stron internetowych. Jeśli pliki cookie zostaną zablokowane, nie będzie
              możliwości korzystania w pełni ze wszystkich funkcji naszej aplikacji.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
