import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function usePWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [swRegistered, setSwRegistered] = useState(false);

  useEffect(() => {
    // 1. REGISTER SERVICE WORKER
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        const swUrl = './sw.js';
        navigator.serviceWorker
          .register(swUrl)
          .then((registration) => {
            if (import.meta.env.DEV) {
              console.log('[KALBUD PWA] ServiceWorker registered with scope:', registration.scope);
            }
            setSwRegistered(true);
          })
          .catch((error) => {
            console.error('[KALBUD PWA] ServiceWorker registration failed:', error);
          });
      });
    }

    // 2. DETECT IF ALREADY RUNNING AS INSTALLED PWA
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true;
    if (isStandalone) {
      setIsInstalled(true);
    }

    // 3. LISTEN TO BEFOREINSTALLPROMPT
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 4. LISTEN TO APP INSTALLED
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      if (import.meta.env.DEV) {
        console.log('[KALBUD PWA] App was successfully installed!');
      }
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    // 5. ONLINE / OFFLINE STATUS
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) {
      // Fallback instructions for iOS/Safari where beforeinstallprompt isn't fired
      alert(
        'Aby zainstalować aplikację KALBUD:\n\n' +
        '• Na iOS (iPhone/iPad): Stuknij przycisk "Udostępnij" w Safari, a następnie wybierz "Do ekranu początkowego".\n' +
        '• Na Android / Chrome: Wybierz menu (trzy kropki) i kliknij "Zainstaluj aplikację".'
      );
      return;
    }

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the PWA install prompt');
        setIsInstalled(true);
      } else {
        console.log('User dismissed the PWA install prompt');
      }
      setDeferredPrompt(null);
      setIsInstallable(false);
    } catch (err) {
      console.error('Error launching install prompt:', err);
    }
  };

  return {
    isInstallable,
    isInstalled,
    isOffline,
    swRegistered,
    installApp,
  };
}
