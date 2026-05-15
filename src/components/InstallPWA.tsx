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
          className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-emerald-950/40 backdrop-blur-2xl"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-white w-full max-w-sm rounded-[40px] shadow-2xl p-8 relative overflow-hidden"
          >
            {/* Background pattern */}
            <div className="absolute top-0 left-0 w-full h-32 bg-emerald-600 flex items-center justify-center overflow-hidden">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute w-64 h-64 border-[20px] border-emerald-500/30 rounded-full"
              />
              <div className="relative w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center text-emerald-600">
                <Download size={40} />
              </div>
            </div>

            <div className="mt-28 text-center">
              <h2 className="text-3xl font-display font-black text-emerald-950 leading-tight">
                Instale para <span className="text-emerald-600">Começar</span>
              </h2>
              <p className="mt-4 text-emerald-700 font-medium">
                Para garantir a melhor experiência na feira, instale nosso aplicativo oficial.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-4 text-left bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                  <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white shrink-0">
                    <PlusSquare size={16} />
                  </div>
                  <div>
                    <p className="text-emerald-900 font-bold text-sm">Acesso Instantâneo</p>
                    <p className="text-emerald-700 text-xs mt-0.5">Abra o app direto da sua tela inicial.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 text-left bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                  <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white shrink-0">
                    <Share size={16} />
                  </div>
                  <div>
                    <p className="text-emerald-900 font-bold text-sm">Modo Offline</p>
                    <p className="text-emerald-700 text-xs mt-0.5">Consulte as feiras mesmo sem internet.</p>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                {isIOS ? (
                  <div className="bg-emerald-600 text-white p-5 rounded-3xl shadow-lg shadow-emerald-200">
                    <p className="text-sm font-bold flex flex-wrap items-center justify-center gap-2 leading-relaxed text-center">
                      Toque em <Share size={20} /> e selecione <br/>
                      <span className="bg-white/20 px-3 py-1 rounded-xl">"Adicionar à Tela de Início"</span>
                    </p>
                  </div>
                ) : (
                  <>
                    {deferredPrompt ? (
                      <button
                        onClick={handleInstall}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-5 px-6 rounded-3xl transition-all shadow-xl shadow-emerald-200 active:scale-95 flex items-center justify-center gap-3 text-lg"
                      >
                        <Download size={24} />
                        Instalar Aplicativo
                      </button>
                    ) : (
                      <div className="space-y-4">
                        {!isReady ? (
                          <button
                            disabled
                            className="w-full bg-emerald-50 text-emerald-300 font-bold py-5 px-6 rounded-3xl flex items-center justify-center gap-3 text-lg cursor-wait"
                          >
                            <div className="w-5 h-5 border-2 border-emerald-300 border-t-transparent rounded-full animate-spin" />
                            Preparando...
                          </button>
                        ) : (
                          <div className="bg-emerald-600 text-white p-5 rounded-3xl shadow-lg shadow-emerald-200">
                            <p className="text-sm font-bold leading-relaxed text-center">
                              Clique no menu do navegador (três pontos <span className="inline-block border border-white/40 rounded px-1">⋮</span> ou <span className="inline-block border border-white/40 rounded px-1">≡</span>) e selecione: <br/>
                              <span className="bg-white/20 px-3 py-1 rounded-xl mt-2 inline-block">"Instalar Aplicativo"</span>
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
                
                {/* Opcional: Um botão de "Não agora" bem discreto se necessário, 
                    mas conforme pedido, estamos forçando */}
                <button 
                  onClick={() => setShowPrompt(false)}
                  className="mt-6 text-emerald-400 text-xs font-bold uppercase tracking-widest hover:text-emerald-600 transition-colors"
                >
                  Talvez mais tarde
                </button>
              </div>
            </div>

            <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-emerald-100 rounded-full" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
