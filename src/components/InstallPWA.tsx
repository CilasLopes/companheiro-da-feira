import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Share, PlusSquare, Smartphone } from 'lucide-react';

export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [promptReady, setPromptReady] = useState(false);

  useEffect(() => {
    // Check if already installed as standalone
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as any).standalone === true;

    if (isStandalone) return;

    // Check if user already dismissed
    const hasDismissed = localStorage.getItem('pwa_prompt_dismissed');
    if (hasDismissed) return;

    // Detect iOS
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // For iOS: show prompt immediately (no native install event)
    if (isIOSDevice) {
      setShowPrompt(true);
      setPromptReady(true);
      return;
    }

    // For Android/Desktop: listen for the native install event
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setPromptReady(true);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Fallback: if event doesn't fire in 6 seconds, show manual instructions
    const fallbackTimer = setTimeout(() => {
      setPromptReady(true);
      setShowPrompt(true);
    }, 6000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      clearTimeout(fallbackTimer);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      // No native prompt available — show manual instructions
      setDeferredPrompt(null);
      return;
    }

    try {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;

      if (choiceResult.outcome === 'accepted') {
        setShowPrompt(false);
      }
    } catch (err) {
      console.error('PWA install error:', err);
    }

    // Prompt can only be used once
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center bg-black/50"
        >
          {/* Tap outside to dismiss */}
          <div className="absolute inset-0" onClick={handleDismiss} />

          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Green header */}
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 px-6 pt-6 pb-8 text-center text-white">
              <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl mx-auto flex items-center justify-center mb-4">
                <Smartphone size={32} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold">
                Instale o App
              </h2>
              <p className="mt-1 text-emerald-100 text-sm">
                Acesse mais rápido direto da sua tela inicial
              </p>
            </div>

            {/* Content */}
            <div className="px-6 py-5 space-y-3">
              <div className="flex items-center gap-3 bg-emerald-50 p-3 rounded-xl">
                <div className="w-9 h-9 bg-emerald-600 rounded-full flex items-center justify-center text-white shrink-0">
                  <PlusSquare size={18} />
                </div>
                <div>
                  <p className="text-emerald-900 font-semibold text-sm">Acesso Instantâneo</p>
                  <p className="text-emerald-600 text-xs">Abra direto da tela inicial.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-emerald-50 p-3 rounded-xl">
                <div className="w-9 h-9 bg-emerald-600 rounded-full flex items-center justify-center text-white shrink-0">
                  <Download size={18} />
                </div>
                <div>
                  <p className="text-emerald-900 font-semibold text-sm">Funciona Offline</p>
                  <p className="text-emerald-600 text-xs">Consulte feiras sem internet.</p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="px-6 pb-6 pt-2">
              {isIOS ? (
                <div className="bg-emerald-600 text-white p-4 rounded-2xl text-center">
                  <p className="text-sm font-semibold leading-relaxed">
                    Toque em <Share size={16} className="inline -mt-0.5" /> e depois em<br />
                    <span className="bg-white/20 px-3 py-1 rounded-lg mt-1 inline-block">
                      "Adicionar à Tela de Início"
                    </span>
                  </p>
                </div>
              ) : deferredPrompt ? (
                <button
                  onClick={handleInstall}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-base shadow-lg shadow-emerald-200"
                >
                  <Download size={20} />
                  Instalar Agora
                </button>
              ) : (
                <div className="bg-emerald-600 text-white p-4 rounded-2xl text-center">
                  <p className="text-sm font-semibold leading-relaxed">
                    No menu do navegador (<span className="font-mono">⋮</span>) selecione:<br />
                    <span className="bg-white/20 px-3 py-1 rounded-lg mt-1 inline-block">
                      "Instalar Aplicativo"
                    </span>
                  </p>
                </div>
              )}

              <button
                onClick={handleDismiss}
                className="w-full mt-3 py-3 text-emerald-500 text-sm font-semibold hover:text-emerald-700 transition-colors"
              >
                Agora não
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
