import { Compass, ExternalLink, MapPin, Clock, Store } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getStatus } from '../utils/helpers';

export const Parceiros = ({ restaurants, appSettings }: { restaurants: any[], appSettings?: any }) => {
  const { t } = useTranslation();
  return (
    <div className="pt-4 pb-40 space-y-4">
      {/* Premium Hero Section */}
      <section className="relative px-6 pt-0 pb-2">
        <div className="absolute top-0 left-6 right-6 h-full bg-gradient-to-b from-primary/5 to-transparent rounded-[32px] -z-10" />
        <div className="flex flex-col items-center justify-center pt-4 pb-0">
          <div className="w-14 h-14 bg-gradient-to-br from-primary to-emerald-800 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20 mb-3">
            <Store size={28} strokeWidth={1.5} />
          </div>
          <h2 className="font-display text-4xl text-primary font-black tracking-tight text-center mb-1.5">{t('partners.title')}</h2>
          <p className="text-on-surface-variant text-sm font-medium text-center max-w-[280px] leading-relaxed">
            {t('partners.subtitle')}
          </p>
        </div>
      </section>

      <section className="space-y-6 px-6">
        {restaurants.map((rest) => {
          const status = getStatus(rest.hours);
          return (
            <div key={rest.id} className="relative bg-white rounded-[32px] border border-outline-variant/30 shadow-[0_12px_40px_rgba(0,0,0,0.08)] p-6 flex flex-col gap-4 overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-primary/80 to-secondary/80 opacity-100" />
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h4 className="font-display font-bold text-primary text-2xl leading-tight">{rest.name}</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-secondary mt-1">{rest.type}</p>
                </div>
                <div 
                  style={{ backgroundColor: `${status.color}15`, color: status.color, borderColor: `${status.color}30` }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shrink-0 shadow-sm"
                >
                  {status.isOpen && (
                    <span className="relative flex h-2 w-2">
                      <span style={{ backgroundColor: status.color }} className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"></span>
                      <span style={{ backgroundColor: status.color }} className="relative inline-flex rounded-full h-2 w-2"></span>
                    </span>
                  )}
                  {status.label}
                </div>
              </div>

              <div className="text-sm text-on-surface-variant font-medium mt-1 space-y-2.5">
                <p className="flex items-center gap-2.5"><MapPin size={16} className="text-primary/60 shrink-0" /> {rest.address}, {rest.number}</p>
                <p className="flex items-center gap-2.5"><Clock size={16} className="text-primary/60 shrink-0" /> {rest.hours}</p>
              </div>

              {rest.description && (
                <div className="mt-2 pl-3 py-2 border-l-2 border-surface-container-high bg-surface-container-lowest">
                  <p className="text-sm text-on-surface-variant italic leading-relaxed">
                    {rest.description}
                  </p>
                </div>
              )}

              <button 
                onClick={() => window.open(`https://maps.google.com/?q=${rest.address}, ${rest.number}`, '_blank')}
                className="mt-3 w-full py-3.5 bg-primary/10 text-primary rounded-2xl text-xs font-black uppercase tracking-[0.1em] flex items-center justify-center gap-2 border border-primary/20 active:bg-primary/20 transition-colors"
              >
                <ExternalLink size={16} strokeWidth={2.5} /> {t('partners.view_map')}
              </button>
            </div>
          );
        })}
      </section>
      
      <div className="mx-6 mt-10 bg-gradient-to-r from-emerald-600 to-primary text-white p-5 rounded-[28px] shadow-lg shadow-emerald-900/20 relative overflow-hidden flex items-center gap-4 border border-white/10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
        
        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0 backdrop-blur-md border border-white/20">
          <Store size={24} strokeWidth={2} />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-display font-bold text-white text-base leading-tight">{t('partners.be_partner_title')}</h4>
          <p className="text-[10px] text-emerald-50/80 font-medium leading-tight mt-0.5 line-clamp-2">{t('partners.be_partner_subtitle')}</p>
        </div>

        <button 
          onClick={() => {
            if (appSettings?.whatsapp) {
              window.open(`https://wa.me/${appSettings.whatsapp}`, '_blank');
            } else {
              alert('Número de contato não configurado. Por favor, acesse o painel Admin e configure o número do WhatsApp.');
            }
          }}
          className="shrink-0 px-4 py-2.5 bg-white text-emerald-700 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-md active:scale-95 transition-all"
        >
          {t('partners.learn_more')}
        </button>
      </div>
    </div>
  );
};
