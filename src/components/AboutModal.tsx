import React, { useState } from 'react';
import { X, Info, ShieldCheck, Gavel, Mail, Github, CheckCircle2, AlertTriangle, Calculator, HardDrive, Lock } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'info' | 'licencja' | 'regulamin';
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, defaultTab = 'info' }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'licencja' | 'regulamin'>(defaultTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden text-slate-800 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-xs">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2 flex-wrap">
                <span>KALBUD | kalkulator budowlany</span>
                <span className="text-blue-400 text-xs font-normal px-2 py-0.5 rounded-full bg-blue-950/80 border border-blue-800">
                  v2.0 (2026)
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Informacje o programie, Licencja WLDE oraz Regulamin
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Zamknij"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL TABS */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 pt-3 flex gap-2 overflow-x-auto text-sm font-medium">
          <button
            onClick={() => setActiveTab('info')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'info'
                ? 'bg-white border-blue-600 text-blue-600 font-semibold shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Info className="w-4 h-4" />
            O Programie
          </button>

          <button
            onClick={() => setActiveTab('licencja')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'licencja'
                ? 'bg-white border-emerald-600 text-emerald-600 font-semibold shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Licencja (WLDE)
          </button>

          <button
            onClick={() => setActiveTab('regulamin')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'regulamin'
                ? 'bg-white border-purple-600 text-purple-600 font-semibold shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Gavel className="w-4 h-4" />
            Regulamin & RODO
          </button>
        </div>

        {/* MODAL CONTENT BODY */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm leading-relaxed text-slate-700 max-h-[calc(90vh-140px)]">
          
          {/* TAB 1: INFORMACJE O PROGRAMIE */}
          {activeTab === 'info' && (
            <div className="space-y-6">
              {/* HERO BOX */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 text-xs font-semibold mb-2">
                    <Calculator className="w-3.5 h-3.5" />
                    KALBUD | kalkulator budowlany
                  </div>
                  <h3 className="text-xl font-bold text-white">Kompleksowy Asystent Kosztorysowania</h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-xl">
                    KALBUD | kalkulator budowlany umożliwia dokładne wyliczanie zapotrzebowania na materiały i kosztorysy dla opasek domowych, podjazdów, parkingów, ogrodzeń panelowych, wykopów tarasów oraz zadaszeń drewnianych.
                  </p>
                </div>
                <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/80 text-xs text-slate-300 space-y-1 self-stretch md:self-auto min-w-[200px]">
                  <div><strong className="text-white">Autor:</strong> mgr Krzysztof Jureczek</div>
                  <div><strong className="text-white">Wersja:</strong> 2.0 (2026)</div>
                  <div><strong className="text-white">Status:</strong> PWA / Offline Ready</div>
                </div>
              </div>

              {/* FEATURES GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Możliwości programu KALBUD | kalkulator budowlany
                  </h4>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                    <li>Kalkulacja opaski wokół domu (kostka, tłuczeń, obrzeża, wykopy).</li>
                    <li>Wycena podjazdów i parkingów (prostokątne, L-kształtne, płyty ażurowe).</li>
                    <li>Wycena ogrodzeń panelowych z podwaliną i słupkami.</li>
                    <li>Wycena wykopów i podbudowy pod tarasy oraz zadaszeń drewnianych.</li>
                    <li>Generowanie i eksport profesjonalnych kosztorysów w PDF i JSON.</li>
                  </ul>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-blue-600" />
                    Prywatność i Przechowywanie
                  </h4>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                    <li>100% Offline-First – działa bez stałego dostępu do Internetu.</li>
                    <li>Wszystkie projekty zapisywane są lokalnie w przeglądarce (`localStorage`).</li>
                    <li>Brak śledzenia, brak profili użytkowników, brak reklam.</li>
                    <li>Aplikacja dostosowana do urządzeń mobilnych oraz komputerów (PWA).</li>
                  </ul>
                </div>
              </div>

              {/* AUTHOR & CONTACT */}
              <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="font-semibold text-slate-900">Twórca i Właściciel Praw</h4>
                  <p className="text-xs text-slate-600">
                    <strong>mgr Krzysztof Jureczek</strong> — Copyright © 2026. Wszelkie prawa zastrzeżone.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href="mailto:kjureczek@proton.me"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-blue-200 text-xs font-medium text-blue-700 hover:bg-blue-50 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    kjureczek@proton.me
                  </a>
                  <a
                    href="https://github.com/krzjur-oss"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-xs font-medium text-white hover:bg-slate-800 transition-colors"
                  >
                    <Github className="w-3.5 h-3.5" />
                    github.com/krzjur-oss
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LICENCJA WLDE */}
          {activeTab === 'licencja' && (
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <h3 className="font-bold text-emerald-900 text-base mb-1">
                  Wolna Licencja Domowo-Edukacyjna (Zastrzeżona) — WLDE
                </h3>
                <p className="text-emerald-800 text-xs">
                  Projekt: <strong>KALBUD | kalkulator budowlany (wersja 2.0 i wyższe)</strong>
                  <br />
                  Właściciel praw autorskich i twórca: <strong>mgr Krzysztof Jureczek</strong> (Copyright © 2026)
                </p>
              </div>

              <div className="space-y-3 bg-white border border-slate-200 rounded-xl p-5 font-sans leading-relaxed">
                <h4 className="font-bold text-slate-900 uppercase tracking-wide text-xs">PREAMBUŁA</h4>
                <p className="text-slate-600 text-xs">
                  Niniejsza licencja ma na celu zabezpieczenie niekomercyjnego charakteru projektu „KALBUD | kalkulator budowlany”. Intencją Autora jest bezpłatne udostępnienie aplikacji do użytku domowego (prywatnego) oraz placówkom edukacyjnym, przy jednoczesnym pełnym zachowaniu praw autorskich, integralności kodu źródłowego oraz zakazie jakiejkolwiek komercjalizacji, kopiowania, modyfikacji i rozpowszechniania Oprogramowania bez pisemnej zgody Autora.
                </p>

                <h4 className="font-bold text-slate-900 uppercase tracking-wide text-xs pt-2">§ 1. DEFINICJE</h4>
                <ol className="list-decimal list-inside text-slate-600 text-xs space-y-1">
                  <li><strong>Oprogramowanie</strong> – aplikacja „KALBUD | kalkulator budowlany” wraz z całym kodem źródłowym, plikami wykonywalnymi, grafiką, zasobami multimedialnymi oraz dokumentacją.</li>
                  <li><strong>Autor / Licencjodawca</strong> – mgr Krzysztof Jureczek, jedyny twórca i wyłączny dysponent autorskich praw majątkowych i osobistych do Oprogramowania.</li>
                  <li><strong>Użytkownik / Licencjobiorca</strong> – każda osoba fizyczna korzystająca z Oprogramowania w celach domowych/prywatnych, a także każda szkoła, przedszkole, uczelnia lub inna placówka oświatowo-wychowawcza korzystająca z Oprogramowania w celach dydaktycznych.</li>
                </ol>

                <h4 className="font-bold text-slate-900 uppercase tracking-wide text-xs pt-2">§ 2. DOZWOLONY UŻYTEK (BEZPŁATNY)</h4>
                <p className="text-slate-600 text-xs mb-1">
                  Autor udziela Użytkownikowi bezpłatnej, niewyłącznej, nieprzenoszalnej i ograniczonej licencji na korzystanie z Oprogramowania wyłącznie w celach:
                </p>
                <ul className="list-disc list-inside text-slate-600 text-xs space-y-1 pl-2">
                  <li><strong>Użytek domowy / prywatny</strong> – instalowanie i uruchamianie Oprogramowania przez osoby fizyczne na własny, niekomercyjny użytek.</li>
                  <li><strong>Użytek edukacyjny</strong> – wykorzystanie Oprogramowania w placówkach oświatowych na zajęciach, lekcjach, wykładach i kołach zainteresowań.</li>
                  <li><strong>Instalacja lokalna</strong> – uruchamianie i przechowywanie Oprogramowania (w tym w trybie offline/PWA) na urządzeniach własnych Użytkownika.</li>
                  <li><strong>Prezentacje niekomercyjne</strong> – publiczne demonstrowanie działania Oprogramowania w celach popularyzacji nauki i technologii.</li>
                </ul>

                <h4 className="font-bold text-slate-900 uppercase tracking-wide text-xs pt-2 text-rose-700">§ 3. ZAKAZY I OGRANICZENIA</h4>
                <p className="text-slate-600 text-xs mb-1">
                  Wszelkie działania wykraczające poza § 2 wymagają uprzedniej, pisemnej zgody Autora. W szczególności surowo zabrania się:
                </p>
                <ul className="list-disc list-inside text-slate-600 text-xs space-y-1 pl-2">
                  <li><strong>Kopiowania kodu</strong> – kopiowania, powielania, pobierania w celu redystrybucji, dekompilacji lub inżynierii wstecznej.</li>
                  <li><strong>Modyfikacji</strong> – wprowadzania jakichkolwiek zmian w kodzie źródłowym, interfejsie lub zasobach Oprogramowania.</li>
                  <li><strong>Rozpowszechniania</strong> – dystrybuowania, udostępniania, sublicencjonowania, wynajmu lub publikowania kopii osobom trzecim.</li>
                  <li><strong>Sprzedaży i komercjalizacji</strong> – sprzedaży, pobierania opłat, umieszczania w płatnych pakietach lub wykorzystywania do świadczenia odpłatnych usług.</li>
                  <li><strong>Usuwania oznaczeń autorskich</strong> – usuwania lub modyfikowania informacji o Autorze i prawach autorskich.</li>
                </ul>

                <h4 className="font-bold text-slate-900 uppercase tracking-wide text-xs pt-2">§ 4. WŁASNOŚĆ INTELEKTUALNA I INTEGRALNOŚĆ</h4>
                <p className="text-slate-600 text-xs">
                  Oprogramowanie oraz wszelkie związane z nim prawa autorskie stanowią wyłączną własność Autora. Niniejsza licencja nie przenosi na Użytkownika żadnych praw własności do Oprogramowania.
                </p>

                <h4 className="font-bold text-slate-900 uppercase tracking-wide text-xs pt-2">§ 5. WYŁĄCZENIE ODPOWIEDZIALNOŚCI (AS IS)</h4>
                <p className="text-slate-600 text-xs">
                  Oprogramowanie dostarczane jest w stanie, w jakim się znajduje („AS IS”), bez jakichkolwiek gwarancji. Autor nie ponosi odpowiedzialności za jakiekolwiek szkody bezpośrednie, pośrednie lub następcze wynikłe z użytkowania Oprogramowania.
                </p>

                <h4 className="font-bold text-slate-900 uppercase tracking-wide text-xs pt-2">§ 6. ROZWIĄZANIE LICENCJI</h4>
                <p className="text-slate-600 text-xs">
                  Naruszenie któregokolwiek z warunków niniejszej licencji skutkuje jej natychmiastowym i automatycznym wygaśnięciem.
                </p>

                <h4 className="font-bold text-slate-900 uppercase tracking-wide text-xs pt-2">§ 7. POSTANOWIENIA KOŃCOWE</h4>
                <p className="text-slate-600 text-xs">
                  W sprawach nieuregulowanych zastosowanie mają przepisy ustawy o prawie autorskim i prawach pokrewnych oraz Kodeksu cywilnego RP.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: REGULAMIN I POLITYKA PRYWATNOŚCI */}
          {activeTab === 'regulamin' && (
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <h3 className="font-bold text-purple-900 text-base mb-1">
                  Regulamin i Polityka Prywatności
                </h3>
                <p className="text-purple-800 text-xs">
                  Aplikacja: <strong>KALBUD | kalkulator budowlany</strong> (wersja 2.0 · obowiązuje od 2026 r.)
                  <br />
                  Właściciel i Autor: <strong>mgr Krzysztof Jureczek</strong>
                </p>
              </div>

              <div className="space-y-3 bg-white border border-slate-200 rounded-xl p-5 font-sans leading-relaxed">
                <h4 className="font-bold text-slate-900 uppercase tracking-wide text-xs">§ 1. POSTANOWIENIA OGÓLNE</h4>
                <p className="text-slate-600 text-xs">
                  1. Niniejszy Regulamin określa zasady korzystania z aplikacji „KALBUD | kalkulator budowlany”.<br />
                  2. Właścicielem, twórcą i jedynym autorem Aplikacji jest mgr Krzysztof Jureczek.<br />
                  3. Aplikacja dystrybuowana jest na warunkach Wolnej Licencji Domowo-Edukacyjnej (Zastrzeżonej).<br />
                  4. Korzystanie z Aplikacji oznacza pełną akceptację niniejszego Regulaminu oraz Licencji.
                </p>

                <h4 className="font-bold text-slate-900 uppercase tracking-wide text-xs pt-2">§ 2. PRZEZNACZENIE APLIKACJI</h4>
                <p className="text-slate-600 text-xs">
                  Aplikacja przeznaczona jest wyłącznie do użytku domowego / prywatnego oraz użytku edukacyjnego w placówkach oświatowych. Wszelkie inne zastosowania, w tym komercyjne, wymagają uprzedniej pisemnej zgody Autora.
                </p>

                <h4 className="font-bold text-slate-900 uppercase tracking-wide text-xs pt-2">§ 3. ZASADY KORZYSTANIA</h4>
                <p className="text-slate-600 text-xs">
                  1. Aplikacja jest całkowicie bezpłatna.<br />
                  2. Aplikacja nie zawiera reklam, mikropłatności ani płatnych subskrypcji.<br />
                  3. Użytkownik zobowiązuje się korzystać z Aplikacji zgodnie z jej przeznaczeniem oraz obowiązującym prawem.
                </p>

                <h4 className="font-bold text-slate-900 uppercase tracking-wide text-xs pt-2">§ 4. PRAWA AUTORSKIE</h4>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 my-2 text-xs">
                  <div className="flex items-center gap-2 text-rose-700 font-medium">
                    <X className="w-4 h-4" /> Zabronione: Kopiowanie, modyfikowanie, dekompilowanie, sprzedaż lub komercjalizacja Aplikacji bez zgody Autora.
                  </div>
                  <div className="flex items-center gap-2 text-emerald-700 font-medium mt-1">
                    <CheckCircle2 className="w-4 h-4" /> Dozwolone: Korzystanie zgodnie z przeznaczeniem oraz udostępnianie odnośnika do Aplikacji.
                  </div>
                </div>

                <h4 className="font-bold text-slate-900 uppercase tracking-wide text-xs pt-2">§ 5. DANE I PRYWATNOŚĆ (RODO / GDPR)</h4>
                <p className="text-slate-600 text-xs">
                  1. Aplikacja nie wymaga rejestracji ani logowania i nie zbiera danych osobowych na zewnętrznych serwerach.<br />
                  2. Dane wprowadzane do Aplikacji (wyceny opasek, podjazdów, parkingów, ogrodzeń, tarasów, zadaszeń i cenniki) przechowywane są wyłącznie lokalnie w pamięci przeglądarki użytkownika (`localStorage`) i nigdy nie opuszczają jego urządzenia.<br />
                  3. Aplikacja nie używa śledzących plików cookie ani zewnętrznych systemów analitycznych.<br />
                  4. Użytkownik może w każdej chwili usunąć swoje dane, czyszcząc pamięć przeglądarki.
                </p>

                <h4 className="font-bold text-slate-900 uppercase tracking-wide text-xs pt-2">§ 6. ODPOWIEDZIALNOŚĆ</h4>
                <p className="text-slate-600 text-xs">
                  Aplikacja udostępniana jest w stanie „takim, jakim jest” (as is). Wyceny i wyliczenia ilościowe materiałów mają charakter pomocniczy i orientacyjny — ostateczne zapotrzebowanie powinno być weryfikowane na budowie przez wykonawcę.
                </p>

                <h4 className="font-bold text-slate-900 uppercase tracking-wide text-xs pt-2">§ 7. POSTANOWIENIA KOŃCOWE</h4>
                <p className="text-slate-600 text-xs">
                  W sprawach nieuregulowanych zastosowanie mają przepisy prawa polskiego. Kontakt z Autorem: <strong>kjureczek@proton.me</strong> · GitHub: <strong>github.com/krzjur-oss</strong>
                </p>
              </div>
            </div>
          )}

        </div>

        {/* MODAL FOOTER */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex items-center justify-between">
          <div className="text-xs text-slate-500 hidden sm:block">
            © 2026 Krzysztof Jureczek · KALBUD | kalkulator budowlany
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors cursor-pointer ml-auto"
          >
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );
};
