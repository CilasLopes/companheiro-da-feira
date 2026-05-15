import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Leaf, ShoppingBasket, Coffee, Compass, LeafyGreen, Search, Sprout, MapPin, X, ExternalLink, Users, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import { isPriceFilled, getStatus } from '../utils/helpers';
import { Skeleton, BannerSkeleton } from '../components/Skeleton';
import { RemoteImage } from '../components/RemoteImage';

export const HomeViva = ({ onNavigate, products, fairSchedules, restaurants = [], heroSettings, producers = [] }: { onNavigate: (tab: string) => void, products: any[], fairSchedules: any[], restaurants?: any[], heroSettings: any, producers?: any[] }) => {
  const { t } = useTranslation();

  // Traduz o nome do dia (armazenado como chave/key) para o idioma ativo
  const translateDay = (day: string): string => {
    return t(`home.days.${day}`);
  };

  const [activeSchedules, setActiveSchedules] = useState<any[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simula carregamento premium ultra rápido para não travar a UI
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const updateActiveSchedules = () => {
      const now = new Date();
      const currentDayNum = now.getDay();
      const dayKeys = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const currentDayKey = dayKeys[currentDayNum];
      
      const daysMap: { [key: string]: number } = {
        'Domingo': 0, 'Segunda': 1, 'Terça': 2, 'Quarta': 3, 'Quinta': 4, 'Sexta': 5, 'Sábado': 6,
        'Segunda-feira': 1, 'Terça-feira': 2, 'Quarta-feira': 3, 'Quinta-feira': 4, 'Sexta-feira': 5,
        'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5, 'Saturday': 6
      };

      const currentTime = now.getHours() * 60 + now.getMinutes();

      // Encontrar todas que estão acontecendo agora
      const happeningNow = fairSchedules.filter(s => {
        // Suporte para sistema novo (chaves em inglês) ou legado (strings PT)
        const isToday = s.day === currentDayKey || daysMap[s.day] === currentDayNum;
        if (!isToday) return false;

        const [startH, startM] = s.startTime.split(':').map(Number);
        const [endH, endM] = s.endTime.split(':').map(Number);
        const startTime = startH * 60 + startM;
        const endTime = endH * 60 + endM;

        return currentTime >= startTime && currentTime <= endTime;
      });

      if (happeningNow.length > 0) {
        setActiveSchedules(happeningNow.map(s => ({ ...s, status: t('home.happening_now'), isHappening: true })));
      } else {
        // Encontrar as próximas
        const sortedSchedules = [...fairSchedules].sort((a, b) => {
          const dayA = daysMap[a.day] ?? 0;
          const dayB = daysMap[b.day] ?? 0;
          
          // Ajustar para ordem relativa ao dia de hoje
          const diffA = (dayA - currentDayNum + 7) % 7;
          const diffB = (dayB - currentDayNum + 7) % 7;
          
          if (diffA !== diffB) return diffA - diffB;
          return a.startTime.localeCompare(b.startTime);
        });

        // Pega o primeiro dia que tem feira
        const nextFair = sortedSchedules.find(s => {
          const scheduleDay = daysMap[s.day];
          if (scheduleDay !== currentDayNum) return true;
          const [startH, startM] = s.startTime.split(':').map(Number);
          return (startH * 60 + startM) > currentTime;
        });

        if (nextFair) {
          // Filtra todas as feiras que acontecem NO MESMO DIA da próxima feira encontrada
          const nextDayFairs = sortedSchedules.filter(s => s.day === nextFair.day);
          setActiveSchedules(nextDayFairs.map(s => ({ ...s, status: t('home.next_fair'), isHappening: false })));
        } else {
          setActiveSchedules([]);
        }
      }
    };

    updateActiveSchedules();
    const interval = setInterval(updateActiveSchedules, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [fairSchedules]);

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!heroSettings || heroSettings.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSettings.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSettings]);

  return (
    <div className="pt-4 pb-40 space-y-8">
      {/* Hero Banner Section */}
      <section className="px-6 pt-4">
        {isLoading ? (
          <BannerSkeleton />
        ) : (
          <div className="relative h-64 w-full rounded-[48px] overflow-hidden shadow-2xl group">
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentSlide}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <RemoteImage 
                  src={heroSettings[currentSlide]?.backgroundImage || 'https://images.unsplash.com/photo-1488459711616-df95856602fc?auto=format&fit=crop&q=80&w=1200'} 
                  className="w-full h-full" 
                  alt="Hero Banner" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8 space-y-3">
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-1"
                  >
                    <span className="bg-primary-container text-on-primary-container text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg">
                      {heroSettings[currentSlide]?.subtitle}
                    </span>
                    <h2 className="font-display text-4xl text-white font-bold leading-tight drop-shadow-md">
                      {heroSettings[currentSlide]?.title}
                    </h2>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Slide Indicators */}
            {heroSettings.length > 1 && (
              <div className="absolute bottom-4 right-8 flex gap-2 z-10">
                {heroSettings.map((_: any, idx: number) => (
                  <button 
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Widget Feira */}
      <section className="px-6 space-y-4">
        <AnimatePresence mode="popLayout">
          {activeSchedules.length > 0 ? (
            activeSchedules.map((schedule) => (
              <motion.div 
                key={schedule.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`relative overflow-hidden bg-white p-5 rounded-[32px] flex items-center justify-between shadow-[0_8px_30px_rgba(0,0,0,0.06)] border ${
                  schedule.isHappening 
                    ? 'border-primary/40 bg-primary/[0.02]' 
                    : 'border-outline-variant/30'
                }`}
              >
                <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b opacity-100 ${schedule.isHappening ? 'from-primary to-emerald-400' : 'from-primary to-secondary'}`} />
                <div className="flex items-center gap-5 pl-3">
                  <div className={`w-14 h-14 rounded-[22px] flex items-center justify-center shrink-0 shadow-inner ${schedule.isHappening ? 'bg-primary text-white animate-pulse shadow-primary/30' : 'bg-gradient-to-br from-primary/10 to-primary/5 text-primary'}`}>
                    <Clock size={24} strokeWidth={schedule.isHappening ? 2.5 : 2} />
                  </div>
                  <div className="space-y-0.5">
                    <p className={`text-[10px] font-black uppercase tracking-widest ${schedule.isHappening ? 'text-primary' : 'text-on-surface-variant/60'}`}>
                      {schedule.status}
                    </p>
                    <p className="font-display font-bold text-primary text-lg leading-tight">
                      {translateDay(schedule.day)},{' '}
                      {i18n.language.startsWith('en') ? 'from' : i18n.language.startsWith('es') ? 'de' : 'das'}{' '}
                      {schedule.startTime}{' '}
                      {i18n.language.startsWith('en') ? 'to' : i18n.language.startsWith('es') ? 'a' : 'às'}{' '}
                      {schedule.endTime}
                    </p>
                    {schedule.accessibility && (
                      <div className="flex items-center gap-1.5 pt-1">
                        <Leaf size={10} className="text-secondary opacity-80" />
                        <span className="text-[10px] font-medium text-on-surface-variant/70 italic">{schedule.accessibility}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="shrink-0 pl-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-secondary bg-secondary/10 px-3.5 py-1.5 rounded-full shadow-sm border border-secondary/20">
                    {schedule.location}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="bg-surface-container-low border border-dashed border-outline-variant/30 p-5 rounded-[32px] text-center italic text-sm text-on-surface-variant">
              {t('home.no_fair_scheduled')}
            </div>
          )}
        </AnimatePresence>
      </section>

      {/* Intentions Grid */}
      <section className="px-6 space-y-6">
        <h2 className="font-display text-3xl leading-tight text-primary font-bold">{t('home.plan_title')}</h2>
        <div className="grid grid-cols-2 gap-4">
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('market')}
            className="h-44 p-6 rounded-[32px] flex flex-col justify-end items-start relative overflow-hidden shadow-xl shadow-emerald-900/10 bg-gradient-to-br from-emerald-800 to-emerald-950 text-white"
          >
            <div className="absolute top-4 right-4 bg-white/10 p-2 rounded-full backdrop-blur-md opacity-100 border border-white/10">
              <ArrowRight size={16} />
            </div>
            <ShoppingBasket size={100} className="absolute -top-4 -right-4 opacity-15" strokeWidth={1} />
            <div className="space-y-1">
              <span className="block text-[10px] font-black uppercase tracking-[0.2em] opacity-60">{t('home.market_tab')}</span>
              <span className="font-display text-2xl font-bold leading-none">{t('home.market_title')}</span>
            </div>
          </motion.button>

          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('cafe')}
            className="h-44 p-6 rounded-[32px] flex flex-col justify-end items-start relative overflow-hidden shadow-xl shadow-orange-900/10 bg-gradient-to-br from-orange-600 to-orange-800 text-white"
          >
            <div className="absolute top-4 right-4 bg-white/10 p-2 rounded-full backdrop-blur-md opacity-100 border border-white/10">
              <ArrowRight size={16} />
            </div>
            <Coffee size={100} className="absolute -top-4 -right-4 opacity-15" strokeWidth={1} />
            <div className="space-y-1">
              <span className="block text-[10px] font-black uppercase tracking-[0.2em] opacity-60">{t('home.cafe_tab')}</span>
              <span className="font-display text-2xl font-bold leading-none">{t('home.cafe_title')}</span>
            </div>
          </motion.button>

          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('partners')}
            className="h-44 p-6 rounded-[32px] flex flex-col justify-end items-start relative overflow-hidden shadow-xl shadow-stone-900/10 bg-gradient-to-br from-stone-600 to-stone-800 text-white"
          >
            <div className="absolute top-4 right-4 bg-white/10 p-2 rounded-full backdrop-blur-md opacity-100 border border-white/10">
              <ArrowRight size={16} />
            </div>
            <Compass size={100} className="absolute -top-4 -right-4 opacity-15" strokeWidth={1} />
            <div className="space-y-1">
              <span className="block text-[10px] font-black uppercase tracking-[0.2em] opacity-60">{t('home.explore_tab')}</span>
              <span className="font-display text-2xl font-bold leading-none">{t('home.explore_title')}</span>
            </div>
          </motion.button>

          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('list')}
            className="h-44 p-6 rounded-[32px] flex flex-col justify-end items-start relative overflow-hidden shadow-xl shadow-lime-900/10 bg-gradient-to-br from-lime-700 to-lime-900 text-white"
          >
            <div className="absolute top-4 right-4 bg-white/10 p-2 rounded-full backdrop-blur-md opacity-100 border border-white/10">
              <ArrowRight size={16} />
            </div>
            <LeafyGreen size={100} className="absolute -top-4 -right-4 opacity-15" strokeWidth={1} />
            <div className="space-y-1">
              <span className="block text-[10px] font-black uppercase tracking-[0.2em] opacity-60">{t('home.plan_tab')}</span>
              <span className="font-display text-2xl font-bold leading-none">{t('home.plan_title_card')}</span>
            </div>
          </motion.button>

          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('producers')}
            className="h-44 p-8 rounded-[40px] flex flex-col justify-end items-start relative overflow-hidden shadow-2xl shadow-red-950/20 bg-gradient-to-br from-red-800 to-red-950 text-white col-span-2 border border-white/5"
          >
            <div className="absolute top-6 right-6 bg-white/10 p-3 rounded-full backdrop-blur-md border border-white/10">
              <ArrowRight size={24} />
            </div>
            <Users size={150} className="absolute -top-10 -right-10 opacity-15" strokeWidth={1} />
            <div className="space-y-2 relative z-10">
              <span className="block text-xs font-black uppercase tracking-[0.3em] text-orange-400">{t('home.origin_tab')}</span>
              <h3 className="font-display text-3xl font-bold leading-tight">{t('home.origin_title')}</h3>
            </div>
            
            {/* Glossy overlay effect */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
          </motion.button>
        </div>
      </section>

      {/* Quem faz a sua feira */}
      {producers && producers.length > 0 && (
        <section className="px-6 space-y-6">
          <div className="flex justify-between items-end">
            <h3 className="font-display text-3xl text-primary font-bold">{t('home.who_makes_title')}</h3>
            <button 
              onClick={() => onNavigate('producers')}
              className="text-secondary font-black text-[10px] uppercase tracking-widest"
            >
              {t('home.see_stories')}
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 mask-edges px-1">
            {producers.filter((p: any) => !p.hidden).map((producer) => (
              <motion.div 
                key={producer.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate('producers')}
                className="shrink-0 w-72 bg-white border border-outline-variant/10 rounded-[40px] overflow-hidden shadow-sm"
              >
                <div className="h-40 overflow-hidden relative">
                  <RemoteImage src={producer.image} className="w-full h-full object-cover" alt={producer.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-4 left-4 bg-white/20 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-white/20">
                    {producer.location}
                  </span>
                </div>
                <div className="p-5 space-y-2">
                  <h4 className="font-bold text-primary text-xl">{producer.name}</h4>
                  <p className="text-xs text-on-surface-variant line-clamp-2 opacity-80 leading-relaxed italic">
                    "{producer.history}"
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Parceiros em Destaque */}
      {restaurants && restaurants.length > 0 && (
        <section className="px-6 space-y-6">
          <div className="flex justify-between items-end">
            <h3 className="font-display text-3xl text-primary font-bold">{t('home.partners_title')}</h3>
            <button 
              onClick={() => onNavigate('partners')}
              className="text-secondary font-black text-[10px] uppercase tracking-widest hover:underline decoration-2"
            >
              {t('home.see_all')}
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 mask-edges px-1">
            {restaurants.slice(0, 5).map((rest) => {
              const status = getStatus(rest.hours);
              return (
                <motion.div 
                  key={rest.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedRestaurant(rest)}
                  className="shrink-0 w-64 bg-surface-container-low border border-outline-variant/20 p-5 rounded-[32px] space-y-3 cursor-pointer shadow-sm relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-8 -mt-8" />
                  <div>
                    <h4 className="font-bold text-primary text-xl relative z-10">{rest.name}</h4>
                    <p className="text-[10px] font-black uppercase tracking-widest text-secondary mt-1">{rest.type}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                    <MapPin size={14} className="text-primary" />
                    <span className="truncate">{rest.address}, {rest.number}</span>
                  </div>
                  <div 
                    style={{ backgroundColor: `${status.color}15`, color: status.color }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest mt-2 w-fit"
                  >
                    {status.isOpen && (
                      <span className="relative flex h-2 w-2">
                        <span style={{ backgroundColor: status.color }} className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"></span>
                        <span style={{ backgroundColor: status.color }} className="relative inline-flex rounded-full h-2 w-2"></span>
                      </span>
                    )}
                    {status.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* Restaurant Modal */}
      <AnimatePresence>
        {selectedRestaurant && (
          <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedRestaurant(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              className="bg-surface w-full max-w-lg rounded-[40px] p-6 relative z-10 shadow-2xl"
            >
              <button 
                onClick={() => setSelectedRestaurant(null)}
                className="absolute top-4 right-4 p-2 bg-surface-container rounded-full text-on-surface"
              >
                <X size={20} />
              </button>
              
              <div className="space-y-6 pt-2">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                      <Compass size={24} />
                    </div>
                    <div>
                      <h3 className="font-display text-2xl font-bold text-primary">{selectedRestaurant.name}</h3>
                      <p className="text-xs font-black uppercase tracking-widest text-secondary">{selectedRestaurant.type}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container-low p-4 rounded-3xl border border-outline-variant/30 space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-on-surface">{t('home.address')}</p>
                      <p className="text-sm text-on-surface-variant">{selectedRestaurant.address}, {selectedRestaurant.number}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock size={18} className="text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-on-surface">{t('home.opening_hours')}</p>
                      <p className="text-sm text-on-surface-variant">{selectedRestaurant.hours}</p>
                    </div>
                  </div>
                </div>
                
                {selectedRestaurant.description && (
                  <div className="bg-primary/5 p-5 rounded-3xl border border-primary/10">
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">{t('home.about')}</p>
                    <p className="text-sm text-on-surface-variant leading-relaxed italic">
                      "{selectedRestaurant.description}"
                    </p>
                  </div>
                )}

                <button 
                  onClick={() => window.open(`https://maps.google.com/?q=${selectedRestaurant.address}, ${selectedRestaurant.number}`, '_blank')}
                  className="w-full py-4 bg-primary text-white rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-all"
                >
                  <ExternalLink size={18} />
                  {t('home.google_maps')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
