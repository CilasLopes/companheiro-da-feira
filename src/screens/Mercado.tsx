import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronLeft, Plus, Check, ShoppingCart, ArrowRight, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { RemoteImage } from '../components/RemoteImage';
import { Skeleton, ProductSkeleton } from '../components/Skeleton';


export const Mercado = ({ products, producers = [], onNavigate, onAddToList, items = [] }: { products: any[], producers?: any[], onNavigate: (tab: string) => void, onAddToList?: (p: any) => void, items?: any[] }) => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState(t('mercado.categories.highlights'));
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [addedItems, setAddedItems] = useState<{ [key: number]: boolean }>({});
  const [isLoading, setIsLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const categoryMap = [
    { id: 'highlights', label: t('mercado.categories.highlights'), internal: 'Destaques' },
    { id: 'organics', label: t('mercado.categories.organics'), internal: 'Orgânicos,Orgânico' },
    { id: 'greens', label: t('mercado.categories.greens'), internal: 'Verduras,Verdura' },
    { id: 'vegetables', label: t('mercado.categories.vegetables'), internal: 'Legumes,Legume' },
    { id: 'fruits', label: t('mercado.categories.fruits'), internal: 'Frutas,Fruta' },
    { id: 'spices', label: t('mercado.categories.spices'), internal: 'Temperos,Tempero' }
  ];

  const dynamicCategories = Array.from(new Set(
    products
      .map(p => p.type || p.cat)
      .filter(type => {
        if (!type) return false;
        const isMapped = categoryMap.some(cm => cm.internal.toLowerCase().includes(type.trim().toLowerCase()));
        return !isMapped;
      })
  )).map(type => (type as string).trim());

  const categories = [...categoryMap.map(c => c.label), ...dynamicCategories];
  
  const getInternalTypes = (label: string) => {
    const mapped = categoryMap.find(c => c.label === label);
    if (mapped) return mapped.internal.split(',');
    return [label];
  };
  
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ProductCard = ({ p, isVertical = false }: { p: any, isVertical?: boolean, key?: any }) => {
    const producer = producers?.find(prod => {
      if (p.producerId) {
        return prod.id === p.producerId;
      }
      const prodProducts = Array.isArray(prod.products) ? prod.products : (prod.products?.toString().split(',') || []);
      return prodProducts.some((prodName: string) => {
        const pn = prodName.trim().toLowerCase();
        const productName = (p.name || '').toLowerCase();
        const productType = (p.type || p.cat || '').toLowerCase();
        return pn === productName || pn === productType;
      });
    });

    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex flex-col gap-2 group ${isVertical ? 'w-full' : 'min-w-[140px] w-[140px]'}`}
      >
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#F2F2F2]">
          <RemoteImage 
            src={p.img || p.image} 
            alt={p.name}
            className="w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAddToList?.(p);
              setAddedItems(prev => ({ ...prev, [p.id]: true }));
              setTimeout(() => setAddedItems(prev => ({ ...prev, [p.id]: false })), 2000);
            }}
            className={`absolute bottom-2 right-2 w-8 h-8 rounded-full shadow-lg flex items-center justify-center transition-all active:scale-90 ${
              addedItems[p.id] ? 'bg-secondary text-white' : 'bg-white text-primary'
            }`}
          >
            {addedItems[p.id] ? <Check size={18} strokeWidth={3} /> : <Plus size={18} strokeWidth={3} className="text-red-500" />}
          </button>
        </div>
        <div className="space-y-0.5 pt-1">
          <h4 className="text-[12px] text-[#333] font-bold leading-tight line-clamp-2">
            {p.name}
          </h4>
          <div className="flex flex-col">
            <span className="text-[#2E7D32] font-black text-sm">{p.price}</span>
            {producer && (
              <span className="text-[10px] text-on-surface-variant font-medium mt-0.5 line-clamp-1">
                👨‍🌾 {producer.name}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="bg-white min-h-screen pb-40">
      {/* Header Estilo iFood Premium */}
      <header className="fixed top-0 left-0 right-0 bg-surface/95 backdrop-blur-xl z-50 px-4 pt-3 pb-2 border-b border-outline-variant/10 shadow-sm">
        <div className="flex items-center justify-between h-10 gap-4">
          <button 
            onClick={() => {
              if (isSearching) {
                setIsSearching(false);
                setSearchQuery('');
              } else if (activeCategory !== t('mercado.categories.highlights')) {
                setActiveCategory(t('mercado.categories.highlights'));
              } else {
                onNavigate('home');
              }
            }} 
            className="text-secondary flex-shrink-0 p-1 -ml-1 active:scale-90 transition-all"
          >
            <ChevronLeft size={28} />
          </button>
          
          {isSearching ? (
            <div className="flex-1 bg-[#F2F2F2] rounded-full px-4 py-1.5 flex items-center gap-2">
              <Search size={18} className="text-outline-variant" />
              <input 
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('mercado.search_placeholder')}
                className="bg-transparent border-none outline-none w-full text-sm text-[#3E3E3E]"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')}>
                  <X size={16} className="text-outline-variant" />
                </button>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center">
              <h1 className="font-display text-lg font-bold text-primary tracking-tight">
                {activeCategory === t('mercado.categories.highlights') ? t('mercado.title') : activeCategory}
              </h1>
              <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] -mt-0.5 opacity-80">
                {t('mercado.subtitle')}
              </p>
            </div>
          )}

          <button 
            onClick={() => setIsSearching(!isSearching)}
            className="text-secondary flex-shrink-0 p-2 -mr-2 active:scale-90 transition-all"
          >
            {isSearching ? <span className="text-xs font-bold uppercase tracking-wider">{t('mercado.cancel')}</span> : <Search size={24} />}
          </button>
        </div>

        {/* Categorias com Scroll Horizontal */}
        {!isSearching && (
          <div className="flex overflow-x-auto scrollbar-hide gap-2 mt-2 px-4 pb-2 -mx-4">
            {categories.map((cat) => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-5 py-2 rounded-full text-xs font-bold transition-all active:scale-95 ${
                  activeCategory === cat 
                    ? 'bg-secondary text-white shadow-md shadow-secondary/20' 
                    : 'bg-surface-container text-on-surface-variant border border-outline-variant/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Conteúdo Principal */}
      <main className={`${isSearching ? 'pt-[16px]' : 'pt-[41px]'} px-4`}>
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Card Informativo / Guia de Uso */}
            {!isSearching && activeCategory === t('mercado.categories.highlights') && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-[32px] p-6 flex items-center gap-5 shadow-xl shadow-emerald-900/10 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-110 transition-transform duration-500" />
                <div className="bg-white/20 backdrop-blur-md text-white p-3 rounded-2xl shrink-0 border border-white/20">
                  <ShoppingCart size={24} strokeWidth={2.5} />
                </div>
                <div className="space-y-1 relative z-10">
                  <h4 className="text-white font-display text-xl font-bold leading-tight">
                    {t('mercado.info_card_title', 'Monte sua lista de feira!')}
                  </h4>
                  <p className="text-emerald-50/80 text-[11px] font-medium leading-relaxed">
                    {t('mercado.info_card_desc', 'Conheça os produtos e organize suas compras. A feira é o lugar do encontro!')}
                  </p>
                </div>
              </motion.div>
            )}

            {isSearching || activeCategory !== t('mercado.categories.highlights') ? (
              // Visão de Busca ou Categoria Única
              <section className="space-y-6">
                {isSearching && (
                  <p className="text-xs text-outline-variant font-medium">
                    {searchQuery ? t('mercado.results_for', { query: searchQuery }) : t('mercado.type_to_search')}
                  </p>
                )}
                <div className="grid grid-cols-2 gap-x-4 gap-y-8">
                  {(isSearching ? filteredProducts : products.filter(p => {
                      const pType = p.type || p.cat;
                      const activeInternals = getInternalTypes(activeCategory);
                      return activeInternals.some(ci => pType?.toLowerCase().includes(ci.trim().toLowerCase())) || (activeInternals.includes('Verduras') && !pType);
                    }))
                    .map(p => (
                      <ProductCard key={p.id} p={p} isVertical />
                    ))
                  }
                </div>
                {(isSearching ? filteredProducts : []).length === 0 && searchQuery && (
                  <div className="py-20 text-center space-y-2">
                    <p className="text-outline-variant text-sm italic">{t('mercado.no_products')}</p>
                  </div>
                )}
              </section>
            ) : (
              // Visão Geral com Seções Horizontais
              // Visão Geral com Seções Horizontais
              categories.filter(c => c !== t('mercado.categories.highlights')).map(cat => {
                const catInternals = getInternalTypes(cat);
                const catProducts = products.filter(p => {
                  const pType = p.type || p.cat;
                  return catInternals.some(ci => pType?.toLowerCase().includes(ci.trim().toLowerCase())) || (catInternals.includes('Verduras') && !pType);
                });
                if (catProducts.length === 0) return null;

                return (
                  <section key={cat} className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-lg text-[#3E3E3E]">{cat}</h3>
                      <button 
                        onClick={() => setActiveCategory(cat)}
                        className="text-red-500 text-xs font-bold flex items-center gap-1"
                      >
                        {t('mercado.see_more')} <ArrowRight size={14} />
                      </button>
                    </div>
                    
                    <div className="flex gap-4 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2">
                      {catProducts.map(p => (
                        <ProductCard key={p.id} p={p} />
                      ))}
                    </div>
                  </section>
                );
              })
            )}
          </div>
        )}
      </main>

      {/* Barra de Resumo Estilo iFood (Carrinho/Lista) */}
      <AnimatePresence>
        {items.length > 0 && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-24 left-4 right-4 z-50"
          >
            <button 
              onClick={() => onNavigate('list')}
              className="w-full bg-white border border-outline-variant/20 shadow-2xl rounded-2xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="bg-[#E8F5E9] p-2 rounded-xl">
                  <ShoppingCart size={20} className="text-[#2E7D32]" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black uppercase tracking-widest text-outline-variant">{t('mercado.your_list')}</p>
                  <p className="text-sm font-bold text-[#3E3E3E]">{t('mercado.items_selected', { count: items.length })}</p>
                </div>
              </div>
              <div className="bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-bold">
                {t('mercado.view_list')}
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
