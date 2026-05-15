import { motion } from 'motion/react';
import { RemoteImage } from '../components/RemoteImage';
const MotionRemoteImage = motion.create(RemoteImage);
import { Map as MapIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { isPriceFilled, getNextConfirmedDay } from '../utils/helpers';


export const Produtores = ({ producers, fairSchedules = [] }: { producers: any[], fairSchedules?: any[] }) => {
  const { t } = useTranslation();
  return (
    <div className="pb-40 space-y-20">
      {producers.filter(p => !p.hidden).map((producer, index) => (
        <section key={producer.id} className="relative px-4 pt-6">
          {/* Hero Header para cada produtor */}
          <div className="relative w-full aspect-square overflow-hidden rounded-[32px] shadow-lg">
            <MotionRemoteImage 
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5 }}
              src={producer.image} 
              alt={producer.name} 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
            <div className="absolute bottom-12 left-6 right-6 space-y-4">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="flex flex-wrap gap-2"
              >
                {producer.confirmed && (
                  <div className="flex flex-col bg-emerald-500 text-white px-4 py-2 rounded-xl shadow-lg shadow-emerald-200 border border-white/20">
                    <span className="text-[11px] font-black uppercase tracking-wider flex items-center gap-1">
                      <span>✓</span> {(() => {
                        const nextDay = getNextConfirmedDay(producer.confirmedDays, fairSchedules);
                        return nextDay ? `Confirmado: ${t(`home.days.${nextDay}`)}` : 'Confirmado esta semana';
                      })()}
                    </span>
                  </div>
                )}
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="font-display text-5xl text-primary font-bold leading-tight"
              >
                {producer.name}
              </motion.h2>
              <p className="text-on-surface-variant font-medium flex items-center gap-2">
                <MapIcon size={16} className="text-secondary" /> {producer.location}
              </p>
            </div>
          </div>

          {/* História e Filosofia */}
          <div className="px-0 mt-6 relative z-10 space-y-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="bg-surface-container-lowest p-8 rounded-[40px] border border-outline-variant/20 shadow-xl shadow-primary/5 space-y-6"
            >
              <h3 className="font-display text-3xl text-primary font-bold border-b-2 border-primary/10 pb-3 inline-block">{t('producers.our_story')}</h3>
              <p className="text-lg text-on-surface leading-loose font-medium opacity-90">
                {producer.history}
              </p>
              
              <div className="flex flex-wrap gap-2 pt-4">
                {(Array.isArray(producer.products) ? producer.products : (producer.products?.toString().split(',') || [])).map((tag: any) => {
                  const label = tag?.toString().trim();
                  if (!label) return null;
                  return (
                    <span key={label} className="px-4 py-2 bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-widest rounded-full border border-secondary/20">
                      {label}
                    </span>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>
      ))}

      {producers.length === 0 && (
        <div className="py-40 px-6 text-center space-y-4">
          <MapIcon size={48} className="mx-auto text-outline-variant opacity-30" />
          <p className="text-on-surface-variant font-medium text-lg italic">{t('producers.no_producers')}</p>
        </div>
      )}
    </div>
  );
};
