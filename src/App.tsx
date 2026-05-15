import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { Coffee, LeafyGreen, Edit2, X, Sparkles } from 'lucide-react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { PullToRefresh } from './components/PullToRefresh';
import { HomeViva } from './screens/HomeViva';
import { Mercado } from './screens/Mercado';
import { Explorar } from './screens/Explorar';
import { CafeParque } from './screens/CafeParque';
import { Parceiros } from './screens/Parceiros';
import { Produtores } from './screens/Produtores';
import { Lista } from './screens/Lista';
import { Admin } from './screens/Admin';
import { ProducerPanel } from './screens/ProducerPanel';
import { isPriceFilled } from './utils/helpers';

import { 
  defaultProducts, 
  defaultRecipes, 
  defaultEvents, 
  defaultItems, 
  defaultFairSchedules, 
  defaultSeasonalItems,
  defaultRestaurants,
  defaultCafeItems
} from './data/mockData';

function App() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('home');
  const [showAdmin, setShowAdmin] = useState(false);
  const [showProducerPanel, setShowProducerPanel] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [savedLists, setSavedLists] = useState(() => {
    const saved = localStorage.getItem('savedLists');
    return saved ? JSON.parse(saved) : [];
  });

  const [welcomePopup, setWelcomePopup] = useState(() => {
    const saved = localStorage.getItem('welcomePopup');
    return saved ? JSON.parse(saved) : { active: false, title: 'Feliz Ano Novo!', message: 'Desejamos a todos um próspero ano novo cheio de realizações.', image: '' };
  });
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (welcomePopup.active) {
      const hasSeen = sessionStorage.getItem('hasSeenWelcome');
      if (!hasSeen) {
        setShowWelcome(true);
        sessionStorage.setItem('hasSeenWelcome', 'true');
      }
    }
  }, [welcomePopup.active]);

  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('shoppingList');
    return saved ? JSON.parse(saved) : defaultItems;
  });
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('catalogProducts');
    if (saved) {
      const parsed = JSON.parse(saved);
      return (parsed.length <= 4) ? defaultProducts : parsed;
    }
    return defaultProducts;
  });
  const [recipes, setRecipes] = useState(() => {
    const saved = localStorage.getItem('recipes');
    return saved ? JSON.parse(saved) : defaultRecipes;
  });
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('events');
    return saved ? JSON.parse(saved) : defaultEvents;
  });

  const [restaurants, setRestaurants] = useState(() => {
    const saved = localStorage.getItem('restaurants');
    return saved ? JSON.parse(saved) : defaultRestaurants;
  });

  const [cafeItems, setCafeItems] = useState(() => {
    const saved = localStorage.getItem('cafeItems');
    return saved ? JSON.parse(saved) : defaultCafeItems;
  });

  const [seasonalItems, setSeasonalItems] = useState(() => {
    const saved = localStorage.getItem('seasonalItems');
    return saved ? JSON.parse(saved) : defaultSeasonalItems;
  });

  const [fairSchedules, setFairSchedules] = useState(() => {
    const saved = localStorage.getItem('fairSchedules');
    const data = saved ? JSON.parse(saved) : defaultFairSchedules;

    const dayToKey: { [key: string]: string } = {
      'Segunda-feira': 'Monday',
      'Terça-feira': 'Tuesday',
      'Quarta-feira': 'Wednesday',
      'Quinta-feira': 'Thursday',
      'Sexta-feira': 'Friday',
      'Sábado': 'Saturday',
      'Domingo': 'Sunday',
      'Segunda': 'Monday',
      'Terça': 'Tuesday',
      'Quarta': 'Wednesday',
      'Quinta': 'Thursday',
      'Sexta': 'Friday'
    };

    return data.map((s: any) => ({
      ...s,
      day: dayToKey[s.day] || s.day
    }));
  });

  const [heroSettings, setHeroSettings] = useState(() => {
    const saved = localStorage.getItem('heroSettings');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) {
        return [
          {
            id: 1,
            title: parsed.title || 'Os sabores mais puros da terra.',
            subtitle: parsed.subtitle || '🎉 Colheita Especial de Verão',
            backgroundImage: parsed.backgroundImage || 'https://images.unsplash.com/photo-1488459711616-df95856602fc?auto=format&fit=crop&q=80&w=1200'
          }
        ];
      }
      return parsed;
    }
    return [
      {
        id: 1,
        title: 'Os sabores mais puros da terra.',
        subtitle: '🎉 Colheita Especial de Verão',
        backgroundImage: 'https://images.unsplash.com/photo-1488459711616-df95856602fc?auto=format&fit=crop&q=80&w=1200'
      },
      {
        id: 2,
        title: 'Café da manhã no parque!',
        subtitle: '☕ Todo Sábado e Domingo',
        backgroundImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=1200'
      }
    ];
  });

  const [producers, setProducers] = useState(() => {
    const saved = localStorage.getItem('producers');
    const defaultProducers = [
      {
        id: 1,
        name: 'Família Silva',
        history: 'Produtores de orgânicos há 3 gerações no interior de SP. Especialistas em hortaliças e frutas da estação.',
        image: 'https://images.unsplash.com/photo-1595033003999-ed49fe57159c?auto=format&fit=crop&q=80&w=800',
        location: 'Sítio Novo Horizonte, Jundiaí',
        products: ['Hortaliças', 'Frutas', 'Ovos Caipira']
      },
      {
        id: 2,
        name: 'Sítio das Oliveiras',
        history: 'Dedicados ao cultivo de azeitonas e produção de azeite artesanal extra virgem. Nossa missão é trazer o sabor do Mediterrâneo para a sua mesa de forma pura.',
        image: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&q=80&w=800',
        location: 'Serra da Mantiqueira, MG',
        products: ['Azeite', 'Azeitonas', 'Conservas']
      },
      {
        id: 3,
        name: 'Mel da Terra',
        history: 'Apicultores apaixonados pela biodiversidade. Produzimos mel silvestre e própolis de forma sustentável, respeitando o ciclo das abelhas.',
        image: 'https://images.unsplash.com/photo-1473973266408-ed4e27abdd47?auto=format&fit=crop&q=80&w=800',
        location: 'Vale do Paraíba, SP',
        products: ['Mel', 'Própolis', 'Favos']
      }
    ];

    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length === 1 && parsed[0].id === 1) return defaultProducers;
      return parsed.length > 0 ? parsed : defaultProducers;
    }
    return defaultProducers;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('notifications');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        title: 'Bem-vindo ao Novo App!',
        message: 'Agora você pode acompanhar as feiras e fazer sua lista de compras com muito mais facilidade.',
        date: new Date().toISOString(),
        type: 'info',
        read: false
      }
    ];
  });

  const [appSettings, setAppSettings] = useState(() => {
    const saved = localStorage.getItem('appSettings');
    return saved ? JSON.parse(saved) : { whatsapp: '' };
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    localStorage.setItem('catalogProducts', JSON.stringify(products));
    localStorage.setItem('shoppingList', JSON.stringify(items));
    localStorage.setItem('recipes', JSON.stringify(recipes));
    localStorage.setItem('events', JSON.stringify(events));
    localStorage.setItem('restaurants', JSON.stringify(restaurants));
    localStorage.setItem('cafeItems', JSON.stringify(cafeItems));
    localStorage.setItem('seasonalItems', JSON.stringify(seasonalItems));
    localStorage.setItem('fairSchedules', JSON.stringify(fairSchedules));
    localStorage.setItem('savedLists', JSON.stringify(savedLists));
    localStorage.setItem('heroSettings', JSON.stringify(heroSettings));
    localStorage.setItem('producers', JSON.stringify(producers));
    localStorage.setItem('notifications', JSON.stringify(notifications));
    localStorage.setItem('welcomePopup', JSON.stringify(welcomePopup));
    localStorage.setItem('appSettings', JSON.stringify(appSettings));
  }, [products, items, recipes, events, restaurants, cafeItems, seasonalItems, fairSchedules, savedLists, heroSettings, producers, notifications, welcomePopup, appSettings]);

  const addToList = (product: any) => {
    const exists = items.find((i: any) => i.name === product.name);
    if (!exists) {
      setItems([...items, { 
        id: Date.now(), 
        name: product.name, 
        desc: isPriceFilled(product.price) ? product.price : '1 un.', 
        category: product.type || 'Outros', 
        found: false, 
        bought: false 
      }]);
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'home': return t('app_name');
      case 'market': return t('mercado.title');
      case 'cafe': return t('home.cafe_title');
      case 'explorar': return t('explore.guide_title');
      case 'list': return t('list.title');
      case 'partners': return t('home.partners_title');
      case 'producers': return t('home.who_makes_title');
      default: return t('app_name');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeViva onNavigate={setActiveTab} products={products} fairSchedules={fairSchedules} restaurants={restaurants} heroSettings={heroSettings} producers={producers} />;
      case 'market':
        return <Mercado products={products} producers={producers} onNavigate={setActiveTab} onAddToList={addToList} items={items} />;
      case 'explorar':
        return <Explorar onNavigate={setActiveTab} recipes={recipes} seasonalItems={seasonalItems} events={events} fairSchedules={fairSchedules} />;
      case 'cafe':
        return <CafeParque cafeItems={cafeItems} />;
      case 'partners':
        return <Parceiros restaurants={restaurants} appSettings={appSettings} />;
      case 'producers':
        return <Produtores producers={producers} fairSchedules={fairSchedules} />;
      case 'list':
        return <Lista items={items} setItems={setItems} savedLists={savedLists} setSavedLists={setSavedLists} />;
      default:
        return <HomeViva onNavigate={setActiveTab} products={products} fairSchedules={fairSchedules} restaurants={restaurants} heroSettings={heroSettings} />;
    }
  };

  const handleRefresh = async () => {
    await new Promise(resolve => setTimeout(resolve, 1500));
  };



  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div 
        className="min-h-screen bg-surface font-sans text-on-surface selection:bg-primary/20"
      >
        {activeTab !== 'market' && (
        <Header 
          title={getPageTitle()} 
          showBack={activeTab !== 'home'} 
          onBack={() => setActiveTab('home')}
          onAdminClick={() => setShowAdmin(true)}
          onProducerClick={() => setShowProducerPanel(true)}
          notifications={notifications}
          setNotifications={setNotifications}
        />
      )}

      <main className="overflow-x-hidden w-full pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-full min-h-screen"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} listCount={items.length} />

      <AnimatePresence>
        {showWelcome && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-surface w-full max-sm rounded-[32px] p-6 shadow-2xl relative text-center"
            >
              <button 
                onClick={() => setShowWelcome(false)}
                className="absolute top-4 right-4 p-2 bg-surface-container hover:bg-surface-container-high rounded-full transition-colors text-on-surface-variant"
              >
                <X size={20} />
              </button>
              {welcomePopup.image && (
                <img src={welcomePopup.image} alt="Welcome" className="w-full h-40 object-cover rounded-2xl mb-6" />
              )}
              {!welcomePopup.image && (
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                  <Sparkles size={32} />
                </div>
              )}
              <h2 className="text-2xl font-display font-bold text-on-surface mb-2">{welcomePopup.title}</h2>
              <p className="text-on-surface-variant mb-6">{welcomePopup.message}</p>
              <button 
                onClick={() => setShowWelcome(false)}
                className="w-full py-4 bg-primary text-white rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-primary/20 active:scale-95 transition-transform"
              >
                Continuar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showProducerPanel && (
          <ProducerPanel
            producers={producers}
            setProducers={setProducers}
            products={products}
            setProducts={setProducts}
            fairSchedules={fairSchedules}
            onClose={() => setShowProducerPanel(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAdmin && (
          <Admin 
            onClose={() => setShowAdmin(false)}
            products={products} setProducts={setProducts}
            recipes={recipes} setRecipes={setRecipes}
            events={events} setEvents={setEvents}
            restaurants={restaurants} setRestaurants={setRestaurants}
            cafeItems={cafeItems} setCafeItems={setCafeItems}
            seasonalItems={seasonalItems} setSeasonalItems={setSeasonalItems}
            fairSchedules={fairSchedules} setFairSchedules={setFairSchedules}
            heroSettings={heroSettings} setHeroSettings={setHeroSettings}
            producers={producers} setProducers={setProducers}
            notifications={notifications} setNotifications={setNotifications}
            welcomePopup={welcomePopup} setWelcomePopup={setWelcomePopup}
            appSettings={appSettings} setAppSettings={setAppSettings}
          />
        )}
      </AnimatePresence>
    </div>
    </PullToRefresh>
  );
}

export default App;
