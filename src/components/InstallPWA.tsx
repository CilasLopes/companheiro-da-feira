import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, X, Share, PlusSquare } from 'lucide-react';

export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return;
    }

    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Listen for beforeinstallprompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show prompt after a short delay to not annoy the user immediately
      const hasDismissed = localStorage.getItem('pwa_prompt_dismissed');
      if (!hasDismissed) {
        setTimeout(() => setShowPrompt(true), 3000);
      }
    });

    // For iOS, show the prompt manually if they haven't dismissed it
    if (isIOSDevice) {
      const hasDismissed = localStorage.getItem('pwa_prompt_dismissed');
      if (!hasDismissed) {
        setTimeout(() => setShowPrompt(true), 4000);
      }
    }
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const dismissPrompt = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-24 left-4 right-4 z-50"
        >
          <div className="bg-white/90 backdrop-blur-xl border border-emerald-100 rounded-3xl shadow-2xl p-5 overflow-hidden relative">
            <button 
              onClick={dismissPrompt}
              className="absolute top-4 right-4 p-1 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200 shrink-0">
                <Download size={32} />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-emerald-900 font-bold text-lg leading-tight">
                  Instalar App
                </h3>
                <p className="text-emerald-600 text-sm leading-tight mt-1">
                  Acesse a feira direto da sua tela inicial!
                </p>
              </div>
            </div>

            <div className="mt-5">
              {isIOS ? (
                <div className="bg-emerald-50 rounded-2xl p-3 flex items-center gap-3 text-emerald-800 text-sm border border-emerald-100">
                  <div className="flex flex-wrap items-center gap-1 leading-relaxed">
                    <span>Toque em</span>
                    <Share size={18} className="inline mx-1 text-emerald-600" />
                    <span>e selecione</span>
                    <span className="font-bold inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg shadow-sm border border-emerald-100">
                      <PlusSquare size={14} /> Adicionar à Tela de Início
                    </span>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleInstall}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-lg shadow-emerald-200 active:scale-95 flex items-center justify-center gap-2"
                >
                  <Download size={20} />
                  Instalar Agora
                </button>
              )}
            </div>
            
            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
