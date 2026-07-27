import React, { useState } from 'react';
import { usePWA } from '../utils/pwaManager';
import { Download, WifiOff, CheckCircle2, Smartphone, ShieldCheck, X, Sparkles } from 'lucide-react';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isOffline, installApp } = usePWA();
  const [dismissed, setDismissed] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  return (
    <>
      {/* OFFLINE STATUS NOTIFICATION BANNER */}
      {isOffline && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-bold flex items-center justify-center gap-2 shadow-sm animate-fadeIn">
          <WifiOff className="w-4 h-4 shrink-0" />
          <span>Pracujesz w trybie <strong>OFFLINE</strong> — wszystkie kalkulatory, zapisy i funkcje działają bez dostępu do Internetu!</span>
        </div>
      )}

      {/* INSTALL PROMPT BANNER (IF INSTALLABLE AND NOT DISMISSED) */}
      {isInstallable && !isInstalled && !dismissed && (
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white px-4 py-2.5 text-xs border-b border-blue-500/30 flex items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black shrink-0 shadow-xs">
              <Smartphone className="w-4 h-4" />
            </div>
            <div className="truncate">
              <span className="font-bold text-blue-200">Aplikacja KALBUD dostępna do instalacji! </span>
              <span className="hidden sm:inline text-slate-300">Zainstaluj na pulpicie lub telefonie, aby korzystać offline bez otwierania przeglądarki.</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={installApp}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Zainstaluj teraz</span>
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="text-slate-400 hover:text-white p-1 rounded-md transition cursor-pointer"
              title="Zamknij informację"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* COMPACT PWA HEADER BUTTON / STATUS */}
      <div className="hidden sm:flex items-center gap-1.5 ml-auto">
        {isInstalled ? (
          <div className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-[11px] font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>PWA Aktywna (Offline)</span>
          </div>
        ) : (
          <button
            onClick={() => {
              if (isInstallable) {
                installApp();
              } else {
                setShowInfoModal(true);
              }
            }}
            title="Zainstaluj KALBUD jako aplikację PWA (telefon/komputer)"
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold transition cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Zainstaluj Aplikację</span>
          </button>
        )}
      </div>

      {/* INFO MODAL FOR PWA INSTALLATION INSTRUCTIONS */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-600 text-white rounded-xl">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Instalacja PWA KALBUD</h3>
                  <p className="text-xs text-slate-500">Praca 100% Offline na telefonie i komputerze</p>
                </div>
              </div>
              <button
                onClick={() => setShowInfoModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-2 text-blue-900">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  Aplikacja KALBUD została wyposażona w pełną technologię <strong>Progressive Web App (PWA)</strong>.
                </span>
              </div>

              <div className="space-y-2 pt-1">
                <div className="font-bold text-slate-800">Jak zainstalować na swoim urządzeniu?</div>
                <ul className="space-y-2 pl-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Komputer (Chrome / Edge / Safari):</strong> Kliknij ikonę instalacji w pasku adresu przeglądarki (po prawej stronie) lub przycisk "Zainstaluj teraz" w banerze.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Telefon Android (Chrome / Firefox):</strong> Wybierz menu (3 kropki) i kliknij "Dodaj do ekranu głównego" lub "Zainstaluj aplikację".</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>iPhone / iPad (Safari):</strong> Kliknij ikonę "Udostępnij" (kwadrat z strzałką) w Safari i wybierz "Do ekranu początkowego".</span>
                  </li>
                </ul>
              </div>

              <div className="pt-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                ⚡ Po zainstalowaniu program uruchamia się jak natywna aplikacja, nie wymaga połączenia z siecią internetową i pamięta wszystkie zapisane projekty!
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  setShowInfoModal(false);
                  installApp();
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5 shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>Próbuj zainstalować</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
