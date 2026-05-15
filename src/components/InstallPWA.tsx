import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, X, Share, PlusSquare } from 'lucide-react';

export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;
    if (isStandalone) {
      console.log('App is already installed');
      return;
    }

    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Show prompt immediately if not installed
    const hasDismissed = localStorage.getItem('pwa_prompt_dismissed');
    if (!hasDismissed) {
      setShowPrompt(true);
    }

    // Safety timeout: if event doesn't fire in 4s, show manual instructions
    const timer = setTimeout(() => {
      setIsReady(true);
      console.log('PWA: Ready timer triggered');
    }, 4000);

    // Listen for beforeinstallprompt
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsReady(true);
      console.log('beforeinstallprompt event fired');
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      clearTimeout(timer);
    };
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-xl"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-white w-full max-w-sm rounded-[32px] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Background pattern - Reduced height */}
            <div className="shrink-0 h-24 bg-emerald-600 flex items-center justify-center overflow-hidden relative">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute w-48 h-48 border-[15px] border-emerald-500/30 rounded-full"
              />
              <div className="relative w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center text-emerald-600">
                <Download size={28} />
              </div>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col items-center">
              <div className="text-center">
                <h2 className="text-2xl font-display font-black text-emerald-950 leading-tight">
                  Instale para <span className="text-emerald-600">Começar</span>
                </h2>
                <p className="mt-2 text-emerald-700 font-medium text-base">
                  Para a melhor experiência na feira, instale nosso app.
                </p>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 text-left bg-emerald-50 p-3 rounded-2xl border border-emerald-100">
                    <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white shrink-0">
                      <PlusSquare size={16} />
                    </div>
                    <div>
                      <p className="text-emerald-900 font-bold text-sm">Acesso Instantâneo</p>
                      <p className="text-emerald-700 text-xs">Na sua tela inicial.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-left bg-emerald-50 p-3 rounded-2xl border border-emerald-100">
                    <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white shrink-0">
                      <Share size={16} />
                    </div>
                    <div>
                      <p className="text-emerald-900 font-bold text-sm">Modo Offline</p>
                      <p className="text-emerald-700 text-xs">Mesmo sem internet.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  {isIOS ? (
                    <div className="bg-emerald-600 text-white p-4 rounded-2xl shadow-lg">
                      <p className="text-sm font-bold flex flex-wrap items-center justify-center gap-2 leading-relaxed text-center">
                        Toque em <Share size={18} /> e selecione <br/>
                        <span className="bg-white/20 px-2 py-1 rounded-lg">"Adicionar à Tela de Início"</span>
                      </p>
                    </div>
                  ) : (
                    <div className="w-full">
                      {deferredPrompt ? (
                        <button
                          onClick={handleInstall}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-3 text-base"
                        >
                          <Download size={20} />
                          Instalar Aplicativo
                        </button>
                      ) : (
                        <div className="space-y-3">
                          {!isReady ? (
                            <button
                              disabled
                              className="w-full bg-emerald-50 text-emerald-300 font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 text-base cursor-wait"
                            >
                              <div className="w-4 h-4 border-2 border-emerald-300 border-t-transparent rounded-full animate-spin" />
                              Preparando...
                            </button>
                          ) : (
                            <div className="bg-emerald-600 text-white p-4 rounded-2xl shadow-lg">
                              <p className="text-sm font-bold leading-relaxed text-center">
                                No menu do navegador (<span className="inline-block border border-white/40 rounded px-1">⋮</span> ou <span className="inline-block border border-white/40 rounded px-1">≡</span>) selecione: <br/>
                                <span className="bg-white/20 px-2 py-1 rounded-lg mt-1.5 inline-block">"Instalar Aplicativo"</span>
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  
                  <button 
                    onClick={() => setShowPrompt(false)}
                    className="mt-5 text-emerald-400 text-xs font-bold uppercase tracking-widest hover:text-emerald-600 transition-colors"
                  >
                    Talvez mais tarde
                  </button>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-emerald-100/50 rounded-full -z-10" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
