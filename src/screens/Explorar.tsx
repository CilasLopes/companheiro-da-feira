import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Leaf, Clock, X, Timer, Calendar, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import { getGoogleDriveDirectLink } from '../utils/imageHelper';

export const Explorar = ({ onNavigate, recipes, seasonalItems, events, fairSchedules = [] }: { onNavigate: (tab: string) => void, recipes: any[], seasonalItems: any[], events: any[], fairSchedules?: any[] }) => {
  const { t } = useTranslation();
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);

  return (
    <div className="min-h-screen bg-surface pt-4 pb-40 space-y-12 overflow-hidden relative">
      {/* Elementos decorativos de fundo */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-secondary/5 rounded-full blur-3xl -ml-36" />

      {/* Hero Section */}
      <section className="px-8 space-y-3 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-[46px] text-primary font-black leading-[1.1]">
            {t('explore.guide_title')}
            <span className="text-secondary block">da Feira</span>
          </h2>
          <p className="text-on-surface-variant/80 text-lg font-medium max-w-[280px] mt-2">
            {t('explore.guide_subtitle')}
          </p>
        </motion.div>
      </section>

      {/* Sazonalidade */}
      {seasonalItems && seasonalItems.length > 0 && (
        <section className="space-y-4">
          <div className="px-8 flex justify-between items-end">
            <h3 className="font-display text-2xl text-primary font-bold">{t('explore.season_title')}</h3>
            <span className="text-[10px] font-black uppercase tracking-widest text-secondary bg-secondary/10 px-3 py-1 rounded-full">Fresquinhos</span>
          </div>
          <div className="flex gap-5 overflow-x-auto pb-6 scrollbar-hide snap-x px-8">
            {seasonalItems.map((item, idx) => {
              const colors = [
                'bg-red-50 border-red-100 text-red-700',
                'bg-emerald-50 border-emerald-100 text-emerald-700',
                'bg-orange-50 border-orange-100 text-orange-700',
                'bg-purple-50 border-purple-100 text-purple-700',
                'bg-amber-50 border-amber-100 text-amber-700'
              ];
              const colorClass = colors[idx % colors.length];
              
              return (
                <motion.div 
                  key={item.id} 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="min-w-[150px] snap-start space-y-4 group"
                >
                  <div className={`aspect-square rounded-[36px] overflow-hidden p-3 shadow-lg transition-transform group-hover:scale-105 duration-500 ${colorClass.split(' ')[0]} border-2 ${colorClass.split(' ')[1]}`}>
                    <img 
                      src={getGoogleDriveDirectLink(item.img)} 
                      alt={item.name} 
                      className="w-full h-full object-cover rounded-[28px] shadow-sm" 
                    />
                  </div>
                  <div className="px-1 text-center">
                    <p className="text-base font-bold text-primary leading-none mb-1">{item.name}</p>
                    <p className={`text-[9px] font-black uppercase tracking-[0.15em] ${colorClass.split(' ')[2]}`}>
                      {item.benefit}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* Agenda */}
      <section className="px-6 space-y-6 relative">
        <div className="absolute top-0 right-0 -z-10 w-40 h-40 bg-primary/5 rounded-full blur-2xl" />
        <h3 className="font-display text-2xl text-primary font-bold px-2">{t('explore.agenda_title')}</h3>
        <div className="space-y-4">
          {fairSchedules.map((schedule, idx) => (
            <motion.div 
              key={schedule.id}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative overflow-hidden bg-white/60 backdrop-blur-md p-5 rounded-[32px] flex items-center justify-between shadow-xl shadow-primary/5 border border-white/40"
            >
              {/* Faixa lateral colorida vibrante */}
              <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${idx % 2 === 0 ? 'from-emerald-500 to-primary' : 'from-orange-500 to-secondary'} opacity-100`} />
              
              <div className="flex items-center gap-5 pl-3">
                <div className={`w-14 h-14 rounded-[22px] flex items-center justify-center shrink-0 shadow-lg ${idx % 2 === 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                  <Clock size={24} strokeWidth={2.5} />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40">
                    {t('explore.agenda_title')}
                  </p>
                  <p className="font-display font-bold text-primary text-xl leading-tight">
                    {t(`home.days.${schedule.day}`)},{' '}
                    <span className="text-secondary font-black">
                      {schedule.startTime} às {schedule.endTime}
                    </span>
                  </p>
                  {schedule.accessibility && (
                    <div className="flex items-center gap-1.5 pt-1">
                      <div className="w-1 h-1 rounded-full bg-secondary" />
                      <span className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-wider">{schedule.accessibility}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="shrink-0 pl-2">
                <div className="bg-white shadow-sm border border-outline-variant/30 px-4 py-2 rounded-2xl flex flex-col items-center">
                  <span className="text-[8px] font-black uppercase text-on-surface-variant/40 leading-none mb-1">Local</span>
                  <p className="text-[11px] font-black uppercase tracking-tighter text-primary">
                    {schedule.location}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Eventos Especiais */}
      {events.length > 0 && (
        <section className="px-6 space-y-6 relative">
          <div className="absolute bottom-0 left-0 -z-10 w-48 h-48 bg-secondary/5 rounded-full blur-3xl" />
          <h3 className="font-display text-2xl text-primary font-bold px-2">{t('explore.agenda_special_events')}</h3>
          <div className="space-y-4">
            {events.map((event, idx) => (
              <motion.div 
                key={event.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative overflow-hidden bg-white p-5 rounded-[32px] flex items-center gap-5 shadow-xl shadow-secondary/5 border border-outline-variant/20"
              >
                {/* Faixa lateral colorida */}
                <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${idx % 2 === 0 ? 'from-amber-400 to-orange-600' : 'from-rose-400 to-red-600'} opacity-100`} />
                
                <div className={`w-16 h-16 rounded-[24px] flex flex-col items-center justify-center shrink-0 shadow-lg ml-2 ${idx % 2 === 0 ? 'bg-amber-500 text-white shadow-amber-200' : 'bg-rose-500 text-white shadow-rose-200'}`}>
                  <span className="text-xl font-black leading-none">{event.day}</span>
                  <span className="text-[10px] font-black uppercase tracking-tighter">{t(`months.${event.month?.toUpperCase()}`)}</span>
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40">
                    {t('explore.agenda_special_events')}
                  </p>
                  <h4 className="font-display font-bold text-primary text-lg leading-tight">{t(event.title)}</h4>
                  
                  {event.desc && (
                    <p className="text-xs text-on-surface-variant/70 leading-snug line-clamp-2">
                      {event.desc}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-wide">
                    <Timer size={14} className="text-secondary" />
                    <span>{event.time} • {event.local}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Receitas */}
      <section className="px-6 space-y-6 pb-20 relative">
        <div className="absolute top-1/2 right-0 -z-10 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
        <h3 className="font-display text-3xl text-primary font-bold px-2">{t('explore.cooking_title')}</h3>
        <div className="grid grid-cols-2 gap-4">
          {recipes.map((recipe, idx) => (
            <motion.div 
              key={recipe.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setSelectedRecipe(recipe)}
              className="bg-white p-3 rounded-[32px] flex flex-col gap-3 shadow-xl shadow-primary/5 border border-outline-variant/20 cursor-pointer relative overflow-hidden group active:scale-95 transition-all"
            >
              <div className="aspect-[4/3] w-full rounded-[24px] overflow-hidden bg-surface-container relative">
                <img 
                  src={getGoogleDriveDirectLink(recipe.img)} 
                  alt={recipe.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-md px-2 py-1 rounded-full shadow-sm">
                  <span className="text-[8px] font-black uppercase tracking-widest text-primary">
                    {recipe.diff}
                  </span>
                </div>
              </div>
              <div className="px-1 pb-1">
                <h4 className="font-display font-bold text-primary text-base leading-tight line-clamp-2 min-h-[3rem]">
                  {recipe.title}
                </h4>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1">
                    <Timer size={10} className="text-secondary" />
                    <span className="text-[9px] font-black text-on-surface-variant/60 uppercase">15 min</span>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <ArrowRight size={12} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Modal de Receita */}
      <AnimatePresence>
        {selectedRecipe && (
          <div className="fixed inset-0 z-[60] flex items-end justify-center px-0 sm:px-4 sm:items-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRecipe(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="relative w-full max-w-lg bg-surface rounded-t-[36px] sm:rounded-[36px] overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
            >
              <div className="relative h-64 shrink-0">
                <img src={getGoogleDriveDirectLink(selectedRecipe.img)} alt={selectedRecipe.title} className="w-full h-full object-cover" />
                <button 
                  onClick={() => setSelectedRecipe(null)}
                  className="absolute top-5 right-5 p-2 bg-black/20 backdrop-blur-md rounded-full text-white"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 overflow-y-auto space-y-6">
                <h3 className="text-3xl font-display font-bold text-primary">{selectedRecipe.title}</h3>
                <p className="text-on-surface-variant italic leading-relaxed">"{selectedRecipe.intro}"</p>
                <div className="space-y-4">
                  <h4 className="font-bold text-primary uppercase text-xs tracking-widest">{t('explore.ingredients')}</h4>
                  <div className="space-y-2">
                    {selectedRecipe.ingredients?.split('\n').map((ing: string, i: number) => (
                      <p key={i} className="text-sm text-on-surface">• {ing}</p>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-bold text-primary uppercase text-xs tracking-widest">{t('explore.instructions')}</h4>
                  <p className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-line pb-8">{selectedRecipe.instructions}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
