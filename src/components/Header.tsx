import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, SlidersHorizontal, Bell, X, Info, AlertCircle, Calendar, Globe, Check, Store, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Header = ({ 
  title, 
  showBack = false, 
  onBack, 
  onAdminClick,
  onProducerClick,
  notifications = [],
  setNotifications
}: { 
  title: string, 
  showBack?: boolean, 
  onBack?: () => void, 
  onAdminClick?: () => void,
  onProducerClick?: () => void,
  notifications?: any[],
  setNotifications?: any
}) => {
  const { t, i18n } = useTranslation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const languages = [
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' }
  ];

  const markAsRead = () => {
    if (setNotifications) {
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    }
  };

  const deleteNotification = (id: number) => {
    if (setNotifications) {
      setNotifications(notifications.filter(n => n.id !== id));
    }
  };

  const clearAll = () => {
    if (setNotifications) {
      setNotifications([]);
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-surface/90 backdrop-blur-xl border-b border-outline-variant/10">
        <div className="flex items-center gap-4">
          {showBack && onBack && (
            <button onClick={onBack} className="p-1 -ml-2 rounded-full hover:bg-surface-container-high active:scale-95 transition-all text-primary">
              <ArrowLeft size={28} />
            </button>
          )}
          <div className="flex items-center gap-3">
            {!showBack && (
              <img 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop" 
                alt="Profile" 
                className="w-10 h-10 rounded-full object-cover border-2 border-primary/20 shadow-sm"
              />
            )}
            <h1 className="font-display text-2xl font-semibold text-primary">{title}</h1>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {onProducerClick && (
            <button 
              onClick={onProducerClick}
              className="p-2.5 rounded-full active:scale-95 transition-all text-primary"
              title="Login"
            >
              <User size={24} />
            </button>
          )}

          {/* Seletor de Idioma */}
          <div className="relative">
            <button 
              id="lang-selector"
              onClick={() => setShowLanguages(!showLanguages)}
              className={`flex items-center gap-2 px-3 py-2 rounded-full hover:bg-surface-container-high active:scale-95 transition-all relative ${showLanguages ? 'bg-primary/10 ring-1 ring-primary/20' : 'bg-surface-container-low border border-outline-variant/10'}`}
            >
              <span className="text-[10px] font-black uppercase tracking-wider text-primary">
                {i18n.language.split('-')[0].toUpperCase()}
              </span>
              <Globe size={14} className={showLanguages ? 'text-primary' : 'text-on-surface-variant/60'} />
            </button>

            {/* Popover de Idiomas */}
            <AnimatePresence>
              {showLanguages && (
                <>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowLanguages(false)}
                    className="fixed inset-0 z-[60]"
                  />
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-48 bg-surface rounded-3xl shadow-2xl border border-outline-variant/20 overflow-hidden z-[70] backdrop-blur-xl"
                  >
                    <div className="p-2 space-y-1">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            i18n.changeLanguage(lang.code);
                            setShowLanguages(false);
                          }}
                          className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all ${
                            i18n.language.startsWith(lang.code)
                              ? 'bg-primary/10 text-primary'
                              : 'hover:bg-surface-container-high text-on-surface'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{lang.flag}</span>
                            <span className="text-sm font-bold">{lang.name}</span>
                          </div>
                          {i18n.language.startsWith(lang.code) && (
                            <Check size={16} className="text-primary" />
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <div className="relative">
            <button 
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications) markAsRead();
              }}
              className={`p-2.5 rounded-full active:scale-95 transition-all relative ${showNotifications ? 'bg-primary/10 text-primary' : 'hover:bg-surface-container-high text-primary'}`}
            >
              <Bell size={24} />
              {unreadCount > 0 && (
                <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-secondary rounded-full border-2 border-surface animate-pulse"></span>
              )}
            </button>

            {/* Painel de Notificações Popover */}
            <AnimatePresence>
              {showNotifications && (
                <>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowNotifications(false)}
                    className="fixed inset-0 z-[60]"
                  />
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-[320px] max-h-[400px] bg-surface rounded-3xl shadow-2xl border border-outline-variant/20 z-[70] flex flex-col overflow-hidden"
                  >
                    <div className="p-4 border-b border-outline-variant/10 flex items-center justify-between bg-surface-container-lowest">
                      <h2 className="font-display text-sm font-bold text-on-surface flex items-center gap-2">
                        <Bell size={16} className="text-primary" /> {t('header.notifications_title')}
                      </h2>
                      {notifications.length > 0 && (
                        <button 
                          onClick={clearAll}
                          className="text-[10px] font-bold text-primary hover:bg-primary/10 px-2 py-1 rounded-full transition-colors uppercase tracking-wider"
                        >
                          {t('header.notifications_clear_all')}
                        </button>
                      )}
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                      {notifications.length === 0 ? (
                        <div className="py-8 flex flex-col items-center justify-center text-center opacity-40">
                          <Bell size={32} className="mb-2 text-outline" />
                          <p className="text-xs font-medium">{t('header.notifications_empty')}</p>
                        </div>
                      ) : (
                        notifications.map((n: any) => (
                          <motion.div 
                            key={n.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className={`relative p-3 rounded-2xl border transition-all group ${n.type === 'warning' ? 'bg-error/5 border-error/20' : n.type === 'event' ? 'bg-tertiary/5 border-tertiary/20' : 'bg-surface-container-lowest border-outline-variant/10 hover:border-primary/20 hover:bg-surface-container-low'}`}
                          >
                            <button 
                              onClick={() => deleteNotification(n.id)}
                              className="absolute top-2 right-2 p-1 text-on-surface-variant/30 md:opacity-0 group-hover:opacity-100 hover:text-error hover:bg-error/10 rounded-full transition-all"
                            >
                              <X size={14} />
                            </button>
                            
                            <div className="flex items-center gap-1.5 mb-1.5 pr-6">
                              {n.type === 'warning' ? <AlertCircle size={14} className="text-error" /> : n.type === 'event' ? <Calendar size={14} className="text-tertiary" /> : <Info size={14} className="text-primary" />}
                              <span className={`text-[9px] font-black uppercase tracking-widest ${n.type === 'warning' ? 'text-error' : n.type === 'event' ? 'text-tertiary' : 'text-primary'}`}>
                                {n.type === 'warning' ? t('header.notif_urgent') : n.type === 'event' ? t('header.notif_event') : t('header.notif_info')}
                              </span>
                            </div>
                            <h3 className="text-[13px] font-bold text-on-surface mb-1 pr-4">{n.title}</h3>
                            <p className="text-[11px] text-on-surface-variant leading-relaxed line-clamp-3">{n.message}</p>
                            <p className="text-[9px] text-outline mt-2 font-bold">{new Date(n.date).toLocaleDateString(i18n.language === 'en' ? 'en-US' : i18n.language === 'es' ? 'es-ES' : 'pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>
    </>
  );
};
