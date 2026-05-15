import { useState } from 'react';
import { Coffee, MapPin, Clock, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CafeParque = ({ cafeItems }: { cafeItems: any[] }) => {
  const [activeCategory, setActiveCategory] = useState('Todos');

  // Obter categorias únicas
  const categories = ['Todos', ...Array.from(new Set(cafeItems.map(item => item.category || 'Outros')))];

  // Filtrar itens
  const filteredItems = cafeItems.filter(item => 
    activeCategory === 'Todos' || (item.category || 'Outros') === activeCategory
  );

  // Agrupar itens filtrados por categoria (apenas se 'Todos' estiver selecionado)
  const groupedItems = filteredItems.reduce((acc: any, item: any) => {
    const category = item.category || 'Outros';
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {});

  const displayedCategories = Object.keys(groupedItems);

  return (
    <div className="pt-4 pb-40 space-y-4">
      {/* Premium Hero Section */}
      <section className="relative px-6 pt-0 pb-2">
        <div className="absolute top-0 left-6 right-6 h-full bg-gradient-to-b from-primary/5 to-transparent rounded-[32px] -z-10" />
        <div className="flex flex-col items-center justify-center pt-4 pb-0">
          <div className="w-14 h-14 bg-gradient-to-br from-primary to-emerald-800 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20 mb-3">
            <Coffee size={28} strokeWidth={1.5} />
          </div>
          <h2 className="font-display text-4xl text-primary font-black tracking-tight text-center mb-1.5">Café no Parque</h2>
          <p className="text-on-surface-variant text-sm font-medium text-center max-w-[280px] leading-relaxed">
            Sinta o aroma do campo e o frescor da natureza em cada detalhe.
          </p>
        </div>
      </section>

      {/* Filtros de Categoria */}
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-6 -mx-0 px-6">
        {categories.map((cat: any) => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-[0.15em] transition-all duration-300 ${
              activeCategory === cat 
                ? 'bg-primary text-white shadow-[0_8px_20px_rgba(0,0,0,0.12)] scale-105' 
                : 'bg-white border border-outline-variant/30 text-on-surface-variant'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-16">
        <AnimatePresence mode="popLayout">
          {displayedCategories.map((category) => (
            <motion.section 
              key={category} 
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4 px-6">
                <h3 className="font-display text-3xl text-primary font-black tracking-tight whitespace-nowrap">{category}</h3>
                <div className="h-[1px] w-full bg-gradient-to-r from-outline-variant/40 to-transparent" />
              </div>
              
              <div className="space-y-5 px-6">
                {groupedItems[category].map((item: any) => (
                  <motion.div 
                    key={item.id} 
                    layout
                    className="relative bg-white rounded-[32px] border border-outline-variant/30 shadow-[0_12px_40px_rgba(0,0,0,0.08)] p-6 md:p-8 flex flex-col gap-4 overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-primary/80 to-secondary/80 opacity-100" />
                    
                    <div className="flex justify-between items-start gap-4">
                      <h4 className="font-display font-bold text-primary text-2xl leading-tight">{item.name}</h4>
                      <span className="font-display font-bold text-secondary text-lg bg-secondary/5 border border-secondary/10 px-4 py-1.5 rounded-xl shrink-0 shadow-sm">{item.price}</span>
                    </div>
                    
                    {item.description && (
                      <p className="text-base text-on-surface-variant/90 leading-relaxed font-medium">{item.description}</p>
                    )}
                    
                    <div className="space-y-4 pt-4 border-t border-outline-variant/10">
                      {item.ingredients && (
                        <div className="space-y-1.5">
                          <p className="font-black text-primary/70 uppercase tracking-[0.2em] text-[10px] flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-secondary/60"></span> Ingredientes
                          </p>
                          <p className="text-sm text-on-surface-variant font-medium leading-relaxed pl-3 border-l-2 border-surface-container-high">{item.ingredients}</p>
                        </div>
                      )}
                      {item.process && (
                        <div className="space-y-1.5">
                          <p className="font-black text-primary/70 uppercase tracking-[0.2em] text-[10px] flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-secondary/60"></span> Como é feito
                          </p>
                          <p className="text-sm text-on-surface-variant font-medium leading-relaxed pl-3 border-l-2 border-surface-container-high">{item.process}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          ))}
        </AnimatePresence>

        {filteredItems.length === 0 && (
          <div className="py-20 mx-6 text-center flex flex-col items-center gap-4 bg-surface-container-low rounded-[48px] border-2 border-dashed border-outline-variant/20">
            <div className="text-outline-variant opacity-30">
              <Filter size={48} strokeWidth={1} />
            </div>
            <p className="text-on-surface-variant font-medium italic">Nenhum item encontrado.</p>
          </div>
        )}
      </div>
    </div>
  );
};
