import React, { useState } from 'react';
import { motion, AnimatePresence, Reorder, useDragControls } from 'motion/react';
import { 
  Plus, Trash2, Edit2, Check, X, GripVertical, Bell, AlertCircle, 
  Calendar, Info, Layout, Megaphone, Users, ShoppingBag, 
  BookOpen, Utensils, Coffee, Sparkles, ChevronLeft, Languages, Globe, Settings, Gift,
  Download, Upload, FileJson, FileSpreadsheet, History, Eye, EyeOff
} from 'lucide-react';
import { exportToJSON, exportToCSV, parseCSV } from '../utils/dataTransfer';
import { useTranslation } from 'react-i18next';
import { ImageUploadField } from '../components/ImageUploadField';

import { getGoogleDriveDirectLink } from '../utils/imageHelper';
import { RemoteImage } from '../components/RemoteImage';

// Auxiliar para garantir que os dias nos painéis internos sejam SEMPRE em Português
const translateDayToPT = (day: string): string => {
  if (!day) return '';
  const ptDaysMap: { [key: string]: string } = {
    'SUNDAY': 'Domingo', 'MONDAY': 'Segunda-feira', 'TUESDAY': 'Terça-feira', 'WEDNESDAY': 'Quarta-feira',
    'THURSDAY': 'Quinta-feira', 'FRIDAY': 'Sexta-feira', 'SATURDAY': 'Sábado',
    'Sunday': 'Domingo', 'Monday': 'Segunda-feira', 'Tuesday': 'Terça-feira', 'Wednesday': 'Quarta-feira',
    'Thursday': 'Quinta-feira', 'Friday': 'Sexta-feira', 'Saturday': 'Sábado',
    'DOMINGO': 'Domingo', 'SEGUNDA': 'Segunda-feira', 'TERÇA': 'Terça-feira', 'QUARTA': 'Quarta-feira',
    'QUINTA': 'Quinta-feira', 'SEXTA': 'Sexta-feira', 'SABADO': 'Sábado',
    'Sábado': 'Sábado', 'Segunda': 'Segunda-feira', 'Terça': 'Terça-feira', 'Quarta': 'Quarta-feira', 'Quinta': 'Quinta-feira', 'Sexta': 'Sexta-feira'
  };
  const normalized = day.toUpperCase();
  return ptDaysMap[normalized] || ptDaysMap[day] || day;
};


const getAdminSections = () => [
  { id: 'hero', name: 'Banner Principal', icon: Layout, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'popup', name: 'Pop-up Inicial', icon: Gift, color: 'text-pink-500', bg: 'bg-pink-50' },
  { id: 'fair', name: 'Dias de Feira', icon: Calendar, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { id: 'events', name: 'Eventos', icon: Megaphone, color: 'text-orange-500', bg: 'bg-orange-50' },
  { id: 'producers', name: 'Produtores', icon: Users, color: 'text-purple-500', bg: 'bg-purple-50' },
  { id: 'products', name: 'Produtos', icon: ShoppingBag, color: 'text-amber-500', bg: 'bg-amber-50' },
  { id: 'recipes', name: 'Receitas', icon: BookOpen, color: 'text-rose-500', bg: 'bg-rose-50' },
  { id: 'restaurants', name: 'Parceiros/Gastronomia', icon: Utensils, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  { id: 'cafe', name: 'Cardápio Café', icon: Coffee, color: 'text-brown-500', bg: 'bg-stone-100' },
  { id: 'seasonal', name: 'Sazonais', icon: Sparkles, color: 'text-cyan-500', bg: 'bg-cyan-50' },
  { id: 'notifications', name: 'Notificações', icon: Bell, color: 'text-red-500', bg: 'bg-red-50' },
  { id: 'settings', name: 'Configurações', icon: Settings, color: 'text-slate-500', bg: 'bg-slate-50' },
];

// Removido getDayPT standalone pois precisa do hook useTranslation dentro dos componentes

export const Admin = ({ 
  onClose,
  products, setProducts,
  recipes, setRecipes,
  events, setEvents,
  restaurants, setRestaurants,
  cafeItems, setCafeItems,
  seasonalItems, setSeasonalItems,
  fairSchedules, setFairSchedules,
  heroSettings, setHeroSettings,
  producers, setProducers,
  notifications, setNotifications,
  welcomePopup, setWelcomePopup,
  appSettings, setAppSettings
}: { 
  onClose: () => void,
  products: any[], setProducts: any,
  recipes: any[], setRecipes: any,
  events: any[], setEvents: any,
  restaurants: any[], setRestaurants: any,
  cafeItems: any[], setCafeItems: any,
  seasonalItems: any[], setSeasonalItems: any,
  fairSchedules: any[], setFairSchedules: any,
  heroSettings: any, setHeroSettings: any,
  producers: any[], setProducers: any,
  notifications: any[], setNotifications: any,
  welcomePopup: any, setWelcomePopup: any,
  appSettings: any, setAppSettings: any
}) => {
  const { t, i18n } = useTranslation();
  const [adminTab, setAdminTab] = useState<string | null>(null);
  
  // States for Products
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [newProduct, setNewProduct] = useState({ name: '', type: '', price: '', img: '' });

  // States for Recipes
  const [editingRecipe, setEditingRecipe] = useState<any>(null);
  const [newRecipe, setNewRecipe] = useState({ title: '', time: '', diff: '', intro: '', ingredients: '', instructions: '', img: '' });

  // States for Events
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [newEvent, setNewEvent] = useState({ title: '', desc: '', time: '', local: '', fullDate: '' });

  // States for Restaurants
  const [editingRestaurant, setEditingRestaurant] = useState<any>(null);
  const [newRestaurant, setNewRestaurant] = useState({ name: '', type: '', address: '', number: '', openTime: '', closeTime: '', description: '', img: '' });

  // States for Cafe Items
  const [editingCafe, setEditingCafe] = useState<any>(null);
  const [newCafe, setNewCafe] = useState({ name: '', price: '', category: '', description: '', ingredients: '', process: '', img: '' });

  // States for Seasonal Highlights
  const [editingSeasonal, setEditingSeasonal] = useState<any>(null);
  const [newSeasonal, setNewSeasonal] = useState({ name: '', benefit: '', img: '' });

  // States for Fair Schedules
  const [editingSchedule, setEditingSchedule] = useState<any>(null);
  const [newSchedule, setNewSchedule] = useState({ day: '', startTime: '', endTime: '', location: '', accessibility: '' });

  // State for Hero Banner
  const [editingHeroSlide, setEditingHeroSlide] = useState<any>(null);
  const [newHeroSlide, setNewHeroSlide] = useState({ title: '', subtitle: '', backgroundImage: '' });

  // States for Producers
  const [editingProducer, setEditingProducer] = useState<any>(null);
  const [newProducer, setNewProducer] = useState({ name: '', history: '', image: '', location: '', products: '', username: '', password: '', confirmed: false });

  // States for Notifications
  const [editingNotification, setEditingNotification] = useState<any>(null);
  const [newNotification, setNewNotification] = useState({ title: '', message: '', type: 'info', target: 'all' });

  // Modals for Selection (Fair Schedules)
  const [showDayPicker, setShowDayPicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState<'start' | 'end' | null>(null);
  const [pickerTarget, setPickerTarget] = useState<'new' | 'edit'>('new');
  
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const DAYS_OF_WEEK = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday',
    'Friday', 'Saturday', 'Sunday'
  ];

  // --- Handlers for Products ---
  const saveProduct = () => {
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
      setEditingProduct(null);
    } else {
      setProducts([...products, { id: Date.now(), ...newProduct }]);
      setNewProduct({ name: '', type: '', price: '', img: '' });
    }
  };

  const deleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
  };

  // --- Handlers for Recipes ---
  const saveRecipe = () => {
    if (editingRecipe) {
      setRecipes(recipes.map(r => r.id === editingRecipe.id ? editingRecipe : r));
      setEditingRecipe(null);
    } else {
      setRecipes([...recipes, { id: Date.now(), ...newRecipe }]);
      setNewRecipe({ title: '', time: '', diff: '', intro: '', ingredients: '', instructions: '', img: '' });
    }
  };

  const deleteRecipe = (id: number) => {
    setRecipes(recipes.filter(r => r.id !== id));
  };

  // --- Handlers for Events ---
  const saveEvent = () => {
    if (editingEvent) {
      setEvents(events.map(e => e.id === editingEvent.id ? editingEvent : e));
      setEditingEvent(null);
    } else {
      if (!newEvent.title || !newEvent.fullDate) return;
      
      const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
      const [year, m, d] = newEvent.fullDate.split('-');
      const day = d;
      const month = months[parseInt(m) - 1];

      setEvents([...events, { id: Date.now(), ...newEvent, day, month }]);
      setNewEvent({ title: '', desc: '', time: '', local: '', fullDate: '' });
    }
  };

  const deleteEvent = (id: number) => {
    setEvents(events.filter(e => e.id !== id));
  };

  // --- Handlers for Restaurants ---
  const saveRestaurant = () => {
    if (editingRestaurant) {
      setRestaurants(restaurants.map(r => r.id === editingRestaurant.id ? editingRestaurant : r));
      setEditingRestaurant(null);
    } else {
      const hours = `${newRestaurant.openTime || '00:00'} às ${newRestaurant.closeTime || '00:00'}`;
      setRestaurants([...restaurants, { id: Date.now(), name: newRestaurant.name, type: newRestaurant.type, address: newRestaurant.address, number: newRestaurant.number, description: newRestaurant.description, img: newRestaurant.img, hours }]);
      setNewRestaurant({ name: '', type: '', address: '', number: '', openTime: '', closeTime: '', description: '', img: '' });
    }
  };

  const deleteRestaurant = (id: number) => {
    setRestaurants(restaurants.filter(r => r.id !== id));
  };

  // --- Handlers for Seasonal Highlights ---
  const saveSeasonal = () => {
    if (editingSeasonal) {
      setSeasonalItems(seasonalItems.map(s => s.id === editingSeasonal.id ? editingSeasonal : s));
      setEditingSeasonal(null);
    } else {
      setSeasonalItems([...seasonalItems, { id: Date.now(), ...newSeasonal }]);
      setNewSeasonal({ name: '', benefit: '', img: '' });
    }
  };

  const deleteSeasonal = (id: number) => {
    setSeasonalItems(seasonalItems.filter(s => s.id !== id));
  };

  // --- Handlers for Fair Schedules ---
  const saveSchedule = () => {
    if (editingSchedule) {
      setFairSchedules(fairSchedules.map(s => s.id === editingSchedule.id ? editingSchedule : s));
      setEditingSchedule(null);
    } else {
      if (!newSchedule.day || !newSchedule.location) return;
      setFairSchedules([...fairSchedules, { id: Date.now(), ...newSchedule }]);
      setNewSchedule({ day: '', startTime: '', endTime: '', location: '', accessibility: '' });
    }
  };

  const deleteSchedule = (id: number) => {
    setFairSchedules(fairSchedules.filter(s => s.id !== id));
  };

  // --- Handlers for Backup & Data ---
  const handleExportBackup = () => {
    const backup = {
      products, recipes, events, restaurants, cafeItems, 
      seasonalItems, fairSchedules, heroSettings, producers, 
      notifications, welcomePopup,
      version: '1.0',
      exportedAt: new Date().toISOString()
    };
    exportToJSON(backup, 'backup_completo_feira');
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.products) setProducts(data.products);
        if (data.recipes) setRecipes(data.recipes);
        if (data.events) setEvents(data.events);
        if (data.restaurants) setRestaurants(data.restaurants);
        if (data.cafeItems) setCafeItems(data.cafeItems);
        if (data.seasonalItems) setSeasonalItems(data.seasonalItems);
        if (data.fairSchedules) setFairSchedules(data.fairSchedules);
        if (data.heroSettings) setHeroSettings(data.heroSettings);
        if (data.producers) setProducers(data.producers);
        if (data.notifications) setNotifications(data.notifications);
        if (data.welcomePopup) setWelcomePopup(data.welcomePopup);
        alert('Backup restaurado com sucesso!');
      } catch (err) {
        alert('Erro ao importar backup. Verifique se o arquivo é um JSON válido.');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  const handleExportProducts = () => exportToCSV(products, 'catalogo_produtos');
  const handleImportProducts = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = parseCSV(event.target?.result as string);
      if (data.length > 0) {
        // Gera novos IDs para evitar conflito se o usuário estiver duplicando
        const imported = data.map(p => ({ ...p, id: p.id ? Number(p.id) : Date.now() + Math.random() }));
        setProducts([...products, ...imported]);
        alert(`${data.length} produtos importados com sucesso!`);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleExportProducers = () => exportToCSV(producers, 'lista_produtores');
  const handleImportProducers = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = parseCSV(event.target?.result as string);
      if (data.length > 0) {
        const imported = data.map(p => ({ 
          ...p, 
          id: p.id ? Number(p.id) : Date.now() + Math.random(),
          confirmed: p.confirmed === 'true'
        }));
        setProducers([...producers, ...imported]);
        alert(`${data.length} produtores importados com sucesso!`);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // --- Handlers for Cafe Items ---
  const saveCafe = () => {
    if (editingCafe) {
      setCafeItems(cafeItems.map(c => c.id === editingCafe.id ? editingCafe : c));
      setEditingCafe(null);
    } else {
      setCafeItems([...cafeItems, { id: Date.now(), ...newCafe }]);
      setNewCafe({ name: '', price: '', category: '', description: '', ingredients: '', process: '', img: '' });
    }
  };

  const deleteCafe = (id: number) => {
    setCafeItems(cafeItems.filter(c => c.id !== id));
  };

  // --- Handlers for Producers ---
  const saveProducer = () => {
    if (editingProducer) {
      const productsArray = typeof editingProducer.products === 'string' 
        ? editingProducer.products.split(',').map((s: string) => s.trim()).filter(Boolean)
        : editingProducer.products;
      setProducers(producers.map(p => p.id === editingProducer.id ? { ...editingProducer, products: productsArray } : p));
      setEditingProducer(null);
    } else {
      const productsArray = typeof newProducer.products === 'string' 
        ? newProducer.products.split(',').map(s => s.trim()).filter(Boolean)
        : newProducer.products;
      setProducers([...producers, { id: Date.now(), ...newProducer, products: productsArray }]);
      setNewProducer({ name: '', history: '', image: '', location: '', products: '', username: '', password: '', confirmed: false });
    }
  };

  const deleteProducer = (id: number) => {
    setProducers(producers.filter((p: any) => p.id !== id));
  };

  // --- Handlers for Notifications ---
  const saveNotification = () => {
    if (editingNotification) {
      setNotifications(notifications.map(n => n.id === editingNotification.id ? editingNotification : n));
      setEditingNotification(null);
    } else {
      if (!newNotification.title || !newNotification.message) return;
      setNotifications([{ id: Date.now(), ...newNotification, date: new Date().toISOString(), read: false }, ...notifications]);
      setNewNotification({ title: '', message: '', type: 'info', target: 'all' });
    }
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const adminSections = getAdminSections();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-surface flex flex-col md:flex-row h-screen"
    >
      {/* Sidebar - Desktop / Header - Mobile */}
      <div className={`w-full md:w-80 bg-surface md:bg-surface-container-low border-b md:border-b-0 md:border-r border-outline-variant/30 flex flex-col h-full overflow-hidden shadow-xl md:shadow-none z-10 ${adminTab ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-6 md:p-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-primary">Painel de Controle</h1>
            <p className="text-xs text-on-surface-variant font-medium opacity-60">v2.4.0 • Dashboard</p>
          </div>
          <button 
            onClick={onClose}
            className="md:hidden p-2 hover:bg-surface-container-high rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 pb-6 md:pb-8 scrollbar-none">
          <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
            {adminSections.map((section) => (
              <motion.button
                key={section.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setAdminTab(section.id)}
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                  adminTab === section.id 
                    ? 'bg-primary/10 border-primary shadow-sm' 
                    : 'bg-surface border-outline-variant/10 hover:border-outline-variant/30'
                }`}
              >
                <div className={`p-3 rounded-xl ${section.bg} ${section.color}`}>
                  <section.icon size={20} />
                </div>
                <span className={`text-sm font-bold ${adminTab === section.id ? 'text-primary' : 'text-on-surface'}`}>
                  {section.name}
                </span>
              </motion.button>
            ))}
          </div>
          
          <button 
            onClick={onClose}
            className="hidden md:flex mt-8 w-full items-center gap-4 p-4 rounded-2xl bg-error/5 border border-error/10 hover:bg-error/10 transition-all text-error font-bold text-sm"
          >
            <div className="p-3 rounded-xl bg-error/10">
              <X size={20} />
            </div>
            Sair do Painel
          </button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-surface relative">
        {!adminTab ? (
          <div className="p-6 md:p-12 space-y-8">
            <div>
              <h2 className="text-2xl font-display font-bold text-on-surface">Visão Geral</h2>
              <p className="text-on-surface-variant text-sm">Resumo do aplicativo</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-3xl bg-blue-50 border border-blue-100 space-y-2">
                <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <ShoppingBag size={20} className="text-blue-500" />
                </div>
                <p className="text-3xl font-display font-bold text-blue-700">{products.length}</p>
                <p className="text-xs font-bold text-blue-500 uppercase tracking-widest">Produtos</p>
              </div>
              <div className="p-5 rounded-3xl bg-purple-50 border border-purple-100 space-y-2">
                <div className="w-10 h-10 bg-purple-100 rounded-2xl flex items-center justify-center">
                  <Users size={20} className="text-purple-500" />
                </div>
                <p className="text-3xl font-display font-bold text-purple-700">{producers.length}</p>
                <p className="text-xs font-bold text-purple-500 uppercase tracking-widest">Produtores</p>
              </div>
              <div className="p-5 rounded-3xl bg-emerald-50 border border-emerald-100 space-y-2">
                <div className="w-10 h-10 bg-emerald-100 rounded-2xl flex items-center justify-center">
                  <Calendar size={20} className="text-emerald-500" />
                </div>
                <p className="text-3xl font-display font-bold text-emerald-700">{fairSchedules.length}</p>
                <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Dias de Feira</p>
              </div>
              <div className="p-5 rounded-3xl bg-orange-50 border border-orange-100 space-y-2">
                <div className="w-10 h-10 bg-orange-100 rounded-2xl flex items-center justify-center">
                  <Bell size={20} className="text-orange-500" />
                </div>
                <p className="text-3xl font-display font-bold text-orange-700">{notifications.length}</p>
                <p className="text-xs font-bold text-orange-500 uppercase tracking-widest">Notificações</p>
              </div>
            </div>

            {/* Produtores confirmados */}
            <div className="space-y-3">
              <h3 className="font-bold text-on-surface">Presenças Confirmadas</h3>
              {producers.filter(p => p.confirmed).length === 0 ? (
                <div className="p-5 rounded-3xl bg-surface-container/40 border border-outline-variant/20 text-center text-sm text-on-surface-variant">
                  Nenhum produtor confirmado para esta semana.
                </div>
              ) : (
                <div className="space-y-2">
                  {producers.filter(p => p.confirmed).map((p: any) => (
                    <div key={p.id} className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                      <img src={p.image} alt={p.name} className="w-10 h-10 rounded-xl object-cover" />
                      <div className="flex-1">
                        <p className="font-bold text-emerald-800 text-sm">{p.name}</p>
                        <p className="text-xs text-emerald-600">{p.location}</p>
                      </div>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">✓ Confirmado</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Última notificação */}
            {notifications.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-bold text-on-surface">Última Notificação</h3>
                <div className="p-5 rounded-3xl bg-surface-container/40 border border-outline-variant/20 space-y-1">
                  <p className="font-bold text-sm text-on-surface">{notifications[notifications.length - 1].title}</p>
                  <p className="text-xs text-on-surface-variant">{notifications[notifications.length - 1].message}</p>
                  <p className="text-[10px] text-outline font-bold">{new Date(notifications[notifications.length - 1].date).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-4xl mx-auto p-6 md:p-12 pb-32">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setAdminTab(null)}
                  className="p-2 hover:bg-surface-container-high rounded-full transition-colors md:hidden"
                >
                  <ChevronLeft size={24} />
                </button>
                <h2 className="text-3xl font-display font-bold text-on-surface">
                  {adminSections.find(s => s.id === adminTab)?.name}
                </h2>
              </div>
            </div>

            {/* HERO SETTINGS */}
            {adminTab === 'hero' && (
              <div className="space-y-6">
                <div className="bg-primary/5 p-6 rounded-[32px] border border-primary/20 space-y-4">
                  <h3 className="font-bold text-primary">Banner Principal - Adicionar Novo</h3>
                  <input type="text" placeholder="Título do Banner" value={newHeroSlide.title} onChange={e => setNewHeroSlide({...newHeroSlide, title: e.target.value})} className="w-full p-3 rounded-xl bg-surface border border-outline-variant/30 text-sm outline-none" />
                  <input type="text" placeholder="Subtítulo/Evento" value={newHeroSlide.subtitle} onChange={e => setNewHeroSlide({...newHeroSlide, subtitle: e.target.value})} className="w-full p-3 rounded-xl bg-surface border border-outline-variant/30 text-sm outline-none" />
                  <ImageUploadField 
                    label="Imagem de Fundo" 
                    value={newHeroSlide.backgroundImage} 
                    onChange={url => setNewHeroSlide({...newHeroSlide, backgroundImage: url})} 
                    aspect={2}
                    targetWidth={1200}
                    targetHeight={600}
                    category="Banners"
                  />
                  <button 
                    onClick={() => {
                      setHeroSettings([...(Array.isArray(heroSettings) ? heroSettings : []), { id: Date.now(), ...newHeroSlide }]);
                      setNewHeroSlide({ title: '', subtitle: '', backgroundImage: '' });
                    }} 
                    className="w-full py-4 bg-primary text-white rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg"
                  >
                    SALVAR
                  </button>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-bold text-primary px-1">Banners Ativos</h3>
                  <Reorder.Group axis="y" values={Array.isArray(heroSettings) ? heroSettings : []} onReorder={setHeroSettings} className="space-y-3">
                    {Array.isArray(heroSettings) && heroSettings.map((slide: any) => (
                      <HeroSlideItem 
                        key={slide.id} 
                        slide={slide} 
                        editingHeroSlide={editingHeroSlide} 
                        setEditingHeroSlide={setEditingHeroSlide} 
                        saveHeroSlide={() => {
                          setHeroSettings(heroSettings.map((s: any) => s.id === editingHeroSlide.id ? editingHeroSlide : s));
                          setEditingHeroSlide(null);
                        }} 
                        deleteHeroSlide={() => setHeroSettings(heroSettings.filter((s: any) => s.id !== slide.id))} 
                      />
                    ))}
                  </Reorder.Group>
                </div>
              </div>
            )}

            {/* PRODUTORES */}
            {adminTab === 'producers' && (
              <div className="space-y-6">
                <div className="bg-primary/5 p-6 rounded-[32px] border border-primary/20 space-y-4">
                <div className="space-y-4">
                <h3 className="font-bold text-primary">Adicionar Produtor</h3>
                <input type="text" placeholder="Nome do Produtor" value={newProducer.name} onChange={e => setNewProducer({...newProducer, name: e.target.value})} className="w-full p-3 rounded-xl bg-surface border border-outline-variant/30 text-sm outline-none" />
                <textarea placeholder="História do produtor" value={newProducer.history} onChange={e => setNewProducer({...newProducer, history: e.target.value})} className="w-full p-3 rounded-xl bg-surface border border-outline-variant/30 text-sm outline-none resize-none h-24" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="text" placeholder="Localização" value={newProducer.location} onChange={e => setNewProducer({...newProducer, location: e.target.value})} className="w-full p-3 rounded-xl bg-surface border border-outline-variant/30 text-sm outline-none" />
                  <input type="text" placeholder="Produtos (separados por vírgula)" value={newProducer.products} onChange={e => setNewProducer({...newProducer, products: e.target.value})} className="w-full p-3 rounded-xl bg-surface border border-outline-variant/30 text-sm outline-none" />
                </div>
                <ImageUploadField 
                  label="Foto do Produtor" 
                  value={newProducer.image} 
                  onChange={url => setNewProducer({...newProducer, image: url})} 
                  aspect={1}
                  targetWidth={800}
                  targetHeight={800}
                  category="Produtores"
                />
                <div className="p-4 rounded-xl bg-surface border border-outline-variant/30 space-y-3">
                  <div>
                    <p className="text-sm font-bold text-on-surface">Credenciais de Acesso</p>
                    <p className="text-xs text-on-surface-variant">Usadas pelo produtor para entrar no painel próprio</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" placeholder="Usuário" value={newProducer.username} onChange={e => setNewProducer({...newProducer, username: e.target.value})} className="w-full p-2.5 rounded-lg bg-surface-container border border-outline-variant/30 text-sm outline-none" />
                    <input type="password" placeholder="Senha" value={newProducer.password} onChange={e => setNewProducer({...newProducer, password: e.target.value})} className="w-full p-2.5 rounded-lg bg-surface-container border border-outline-variant/30 text-sm outline-none" />
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-surface border border-outline-variant/30 space-y-3">
                  <div>
                    <p className="text-sm font-bold text-on-surface">Presença Confirmada</p>
                    <p className="text-xs text-on-surface-variant">Selecione o próximo dia de feira que o produtor estará presente</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {fairSchedules && fairSchedules.length > 0 ? (
                      fairSchedules.map((schedule: any) => {
                        const confirmedDays = newProducer.confirmedDays || {};
                        const isSelected = !!confirmedDays[schedule.id];
                        return (
                          <button
                            key={schedule.id}
                            onClick={() => {
                              const nextDays = { ...confirmedDays, [schedule.id]: !isSelected };
                              const hasAny = Object.values(nextDays).some(Boolean);
                              setNewProducer({
                                ...newProducer, 
                                confirmedDays: nextDays,
                                confirmed: hasAny
                              });
                            }}
                            className={`px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                              isSelected 
                                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' 
                                : 'bg-surface-container text-on-surface-variant hover:bg-outline-variant/20'
                            }`}
                          >
                            {translateDayToPT(schedule.day).substring(0, 3)} - {schedule.location || 'Feira'}
                          </button>
                        );
                      })
                    ) : (
                      DAYS_OF_WEEK.map((day) => {
                        const confirmedDays = Array.isArray(newProducer.confirmedDays) ? newProducer.confirmedDays : [];
                        const isSelected = confirmedDays.includes(day);
                        return (
                          <button
                            key={day}
                            onClick={() => {
                              const nextDays = isSelected 
                                ? confirmedDays.filter(d => d !== day)
                                : [...confirmedDays, day];
                              setNewProducer({
                                ...newProducer, 
                                confirmedDays: nextDays,
                                confirmed: nextDays.length > 0
                              });
                            }}
                            className={`px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                              isSelected 
                                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' 
                                : 'bg-surface-container text-on-surface-variant hover:bg-outline-variant/20'
                            }`}
                          >
                            {translateDayToPT(day).substring(0, 3)}
                          </button>
                        );
                      })
                    )}
                  </div>
                  {newProducer.confirmed && (
                    <p className="text-[10px] text-emerald-600 font-bold italic">
                      ✓ Produtor confirmado para as feiras selecionadas
                    </p>
                  )}
                </div>
                <button onClick={saveProducer} className="w-full py-4 bg-primary text-white rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg">SALVAR</button>
              </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-primary px-1">Produtores Cadastrados</h3>
                  <Reorder.Group axis="y" values={producers} onReorder={setProducers} className="space-y-3">
                    {producers.map(p => (
                      <ProducerItem 
                        key={p.id} 
                        p={p} 
                        editingProducer={editingProducer} 
                        setEditingProducer={setEditingProducer} 
                        saveProducer={saveProducer} 
                        deleteProducer={deleteProducer} 
                        toggleHidden={() => setProducers(producers.map((prod: any) => prod.id === p.id ? { ...prod, hidden: !prod.hidden } : prod))}
                      />
                    ))}
                  </Reorder.Group>
                </div>
              </div>
            )}

        {/* PRODUTOS */}
        {adminTab === 'products' && (
          <div className="space-y-6">
            <div className="bg-primary/5 p-6 rounded-[32px] border border-primary/20 space-y-4">
              <h3 className="font-bold text-primary">Adicionar Produto</h3>
              <input type="text" placeholder="Nome do Produto" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full p-3 rounded-xl bg-surface border border-outline-variant/30 text-sm outline-none" />
              <input type="text" placeholder="Tipo" value={newProduct.type} onChange={e => setNewProduct({...newProduct, type: e.target.value})} className="w-full p-3 rounded-xl bg-surface border border-outline-variant/30 text-sm outline-none" />
              <input type="text" placeholder="Preço" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="w-full p-3 rounded-xl bg-surface border border-outline-variant/30 text-sm outline-none" />
              <ImageUploadField 
                label="Foto do Produto" 
                value={newProduct.img} 
                onChange={url => setNewProduct({...newProduct, img: url})} 
                aspect={1}
                targetWidth={800}
                targetHeight={800}
              />
              <button onClick={saveProduct} className="w-full py-3 bg-primary text-white rounded-xl font-bold uppercase tracking-widest text-xs">SALVAR</button>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-primary">Produtos Ativos</h3>
              <Reorder.Group axis="y" values={products} onReorder={setProducts} className="space-y-3">
                {products.map(p => (
                  <ProductItem key={p.id} p={p} editingProduct={editingProduct} setEditingProduct={setEditingProduct} saveProduct={saveProduct} deleteProduct={deleteProduct} />
                ))}
              </Reorder.Group>
            </div>
          </div>
        )}

        {/* RECEITAS */}
        {adminTab === 'recipes' && (
          <div className="space-y-6">
            <div className="bg-secondary/5 p-6 rounded-[32px] border border-secondary/20 space-y-4">
              <h3 className="font-bold text-secondary">Adicionar Nova Receita</h3>
              <input type="text" placeholder="Título da Receita" value={newRecipe.title} onChange={e => setNewRecipe({...newRecipe, title: e.target.value})} className="w-full p-3 rounded-xl bg-surface border border-outline-variant/30 text-sm outline-none" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="text" placeholder="Tempo de Preparo" value={newRecipe.time} onChange={e => setNewRecipe({...newRecipe, time: e.target.value})} className="w-full p-3 rounded-xl bg-surface border border-outline-variant/30 text-sm outline-none" />
                <input type="text" placeholder="Dificuldade" value={newRecipe.diff} onChange={e => setNewRecipe({...newRecipe, diff: e.target.value})} className="w-full p-3 rounded-xl bg-surface border border-outline-variant/30 text-sm outline-none" />
              </div>
              <textarea placeholder="Introdução/Curiosidade" value={newRecipe.intro} onChange={e => setNewRecipe({...newRecipe, intro: e.target.value})} className="w-full p-3 rounded-xl bg-surface border border-outline-variant/30 text-sm outline-none resize-none h-20" />
              <textarea placeholder="Ingredientes (um por linha)" value={newRecipe.ingredients} onChange={e => setNewRecipe({...newRecipe, ingredients: e.target.value})} className="w-full p-3 rounded-xl bg-surface border border-outline-variant/30 text-sm outline-none resize-none h-32" />
              <textarea placeholder="Modo de Preparo" value={newRecipe.instructions} onChange={e => setNewRecipe({...newRecipe, instructions: e.target.value})} className="w-full p-3 rounded-xl bg-surface border border-outline-variant/30 text-sm outline-none resize-none h-32" />
              <ImageUploadField 
                label="Foto da Receita" 
                value={newRecipe.img} 
                onChange={url => setNewRecipe({...newRecipe, img: url})} 
                aspect={4/5}
                targetWidth={800}
                targetHeight={1000}
              />
              <button onClick={saveRecipe} className="w-full py-3 bg-primary text-white rounded-xl font-bold uppercase tracking-widest text-xs">SALVAR</button>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-secondary">Receitas Ativas</h3>
              <Reorder.Group axis="y" values={recipes} onReorder={setRecipes} className="space-y-3">
                {recipes.map(r => (
                  <RecipeItem key={r.id} r={r} editingRecipe={editingRecipe} setEditingRecipe={setEditingRecipe} saveRecipe={saveRecipe} deleteRecipe={deleteRecipe} />
                ))}
              </Reorder.Group>
            </div>
          </div>
        )}

        {/* EVENTOS */}
        {adminTab === 'events' && (
          <div className="space-y-6">
            <div className="bg-tertiary/5 p-6 rounded-[32px] border border-tertiary/20 space-y-4">
              <h3 className="font-bold text-tertiary">Agendar Novo Evento</h3>
              <input type="text" placeholder="Nome do Evento" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} className="w-full p-3 rounded-xl bg-surface border border-outline-variant/30 text-sm outline-none" />
              <textarea placeholder="Descrição curta" value={newEvent.desc} onChange={e => setNewEvent({...newEvent, desc: e.target.value})} className="w-full p-3 rounded-xl bg-surface border border-outline-variant/30 text-sm outline-none resize-none h-20" />
              <div className="flex gap-4">
                <div className="flex-1 space-y-1">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest pl-1">Data</label>
                  <input type="date" value={newEvent.fullDate} onChange={e => setNewEvent({...newEvent, fullDate: e.target.value})} className="w-full p-3 rounded-xl bg-surface border border-outline-variant/30 text-sm outline-none" />
                </div>
                <div className="flex-1 space-y-1">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest pl-1">Horário</label>
                  <input type="time" value={newEvent.time} onChange={e => setNewEvent({...newEvent, time: e.target.value})} className="w-full p-3 rounded-xl bg-surface border border-outline-variant/30 text-sm outline-none" />
                </div>
              </div>
              <input type="text" placeholder="Local" value={newEvent.local} onChange={e => setNewEvent({...newEvent, local: e.target.value})} className="w-full p-3 rounded-xl bg-surface border border-outline-variant/30 text-sm outline-none" />
              <button onClick={saveEvent} className="w-full py-3 bg-tertiary text-white rounded-xl font-bold uppercase tracking-widest text-xs">SALVAR</button>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-tertiary">Eventos Agendados</h3>
              <Reorder.Group axis="y" values={events} onReorder={setEvents} className="space-y-3">
                {events.map(e => (
                  <EventItem key={e.id} e={e} editingEvent={editingEvent} setEditingEvent={setEditingEvent} saveEvent={saveEvent} deleteEvent={deleteEvent} />
                ))}
              </Reorder.Group>
            </div>
          </div>
        )}

        {/* PARCEIROS / RESTAURANTES */}
        {adminTab === 'restaurants' && (
          <div className="space-y-6">
            <div className="bg-primary/5 p-6 rounded-[32px] border border-primary/20 space-y-4">
              <h3 className="font-bold text-primary">Adicionar Parceiro</h3>
              <input type="text" placeholder="Nome do Restaurante/Parceiro" value={newRestaurant.name} onChange={e => setNewRestaurant({...newRestaurant, name: e.target.value})} className="w-full p-3 rounded-xl bg-surface border border-outline-variant/30 text-sm outline-none" />
              <input type="text" placeholder="Tipo" value={newRestaurant.type} onChange={e => setNewRestaurant({...newRestaurant, type: e.target.value})} className="w-full p-3 rounded-xl bg-surface border border-outline-variant/30 text-sm outline-none" />
              <div className="flex gap-4">
                <input type="text" placeholder="Endereço" value={newRestaurant.address} onChange={e => setNewRestaurant({...newRestaurant, address: e.target.value})} className="flex-1 p-3 rounded-xl bg-surface border border-outline-variant/30 text-sm outline-none" />
                <input type="text" placeholder="Nº" value={newRestaurant.number} onChange={e => setNewRestaurant({...newRestaurant, number: e.target.value})} className="w-24 p-3 rounded-xl bg-surface border border-outline-variant/30 text-sm outline-none" />
              </div>
              <div className="flex gap-4">
                <div className="flex-1 space-y-1">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest pl-1">Abre às</label>
                  <input type="time" value={newRestaurant.openTime} onChange={e => setNewRestaurant({...newRestaurant, openTime: e.target.value})} className="w-full p-3 rounded-xl bg-surface border border-outline-variant/30 text-sm outline-none" />
                </div>
                <div className="flex-1 space-y-1">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest pl-1">Fecha às</label>
                  <input type="time" value={newRestaurant.closeTime} onChange={e => setNewRestaurant({...newRestaurant, closeTime: e.target.value})} className="w-full p-3 rounded-xl bg-surface border border-outline-variant/30 text-sm outline-none" />
                </div>
              </div>
              <textarea placeholder="Descrição" value={newRestaurant.description || ''} onChange={e => setNewRestaurant({...newRestaurant, description: e.target.value})} className="w-full p-3 rounded-xl bg-surface border border-outline-variant/30 text-sm outline-none min-h-[100px] resize-none" />
              <ImageUploadField 
                label="Foto do Parceiro" 
                value={newRestaurant.img || ''} 
                onChange={url => setNewRestaurant({...newRestaurant, img: url})} 
                aspect={1.5}
                targetWidth={900}
                targetHeight={600}
              />
              <button onClick={saveRestaurant} className="w-full py-3 bg-primary text-white rounded-xl font-bold uppercase tracking-widest text-xs">SALVAR</button>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-primary">Parceiros Cadastrados</h3>
              <Reorder.Group axis="y" values={restaurants} onReorder={setRestaurants} className="space-y-3">
                {restaurants.map(r => (
                  <PartnerItem key={r.id} r={r} editingRestaurant={editingRestaurant} setEditingRestaurant={setEditingRestaurant} saveRestaurant={saveRestaurant} deleteRestaurant={deleteRestaurant} />
                ))}
              </Reorder.Group>
            </div>
          </div>
        )}

        {/* CAFÉ */}
        {adminTab === 'cafe' && (
          <div className="space-y-6">
            <div className="bg-secondary/5 p-6 rounded-[32px] border border-secondary/20 space-y-4">
              <h3 className="font-bold text-secondary">Adicionar Item ao Cardápio</h3>
              <input type="text" placeholder="Nome do Item" value={newCafe.name} onChange={e => setNewCafe({...newCafe, name: e.target.value})} className="w-full p-3 rounded-xl bg-surface border border-outline-variant/30 text-sm outline-none" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="w-full">
                  <input type="text" placeholder="Categoria" value={newCafe.category} onChange={e => setNewCafe({...newCafe, category: e.target.value})} list="cafe-categories" className="w-full p-3 rounded-xl bg-surface border border-outline-variant/30 text-sm outline-none" />
                  <datalist id="cafe-categories">
                    {Array.from(new Set(cafeItems.map(c => c.category))).filter(Boolean).map(cat => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                </div>
                <input type="text" placeholder="Preço" value={newCafe.price} onChange={e => setNewCafe({...newCafe, price: e.target.value})} className="w-full p-3 rounded-xl bg-surface border border-outline-variant/30 text-sm outline-none" />
              </div>
              <textarea placeholder="Ingredientes" value={newCafe.description} onChange={e => setNewCafe({...newCafe, description: e.target.value})} className="w-full p-3 rounded-xl bg-surface border border-outline-variant/30 text-sm outline-none resize-none h-20" />
              <textarea placeholder="Ingredientes" value={newCafe.ingredients} onChange={e => setNewCafe({...newCafe, ingredients: e.target.value})} className="w-full p-3 rounded-xl bg-surface border border-outline-variant/30 text-sm outline-none resize-none h-20" />
              <ImageUploadField 
                label="Foto do Item" 
                value={newCafe.img || ''} 
                onChange={url => setNewCafe({...newCafe, img: url})} 
                aspect={1}
                targetWidth={800}
                targetHeight={800}
              />
              <button onClick={saveCafe} className="w-full py-3 bg-secondary text-white rounded-xl font-bold uppercase tracking-widest text-xs">SALVAR</button>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-secondary">Itens do Cardápio</h3>
              <Reorder.Group axis="y" values={cafeItems} onReorder={setCafeItems} className="space-y-3">
                {cafeItems.map(c => (
                  <CafeItem key={c.id} c={c} editingCafe={editingCafe} setEditingCafe={setEditingCafe} saveCafe={saveCafe} deleteCafe={deleteCafe} />
                ))}
              </Reorder.Group>
            </div>
          </div>
        )}

        {/* DESTAQUES SAZONAIS */}
        {adminTab === 'seasonal' && (
          <div className="space-y-6">
            <div className="bg-secondary/5 p-6 rounded-[32px] border border-secondary/20 space-y-4">
              <h3 className="font-bold text-secondary">Adicionar Item Sazonal</h3>
              <input type="text" placeholder="Nome do Item" value={newSeasonal.name} onChange={e => setNewSeasonal({...newSeasonal, name: e.target.value})} className="w-full p-3 rounded-xl bg-surface border border-outline-variant/30 text-sm outline-none" />
              <input type="text" placeholder="Benefício/Info" value={newSeasonal.benefit} onChange={e => setNewSeasonal({...newSeasonal, benefit: e.target.value})} className="w-full p-3 rounded-xl bg-surface border border-outline-variant/30 text-sm outline-none" />
              <ImageUploadField 
                label="Foto Sazonal" 
                value={newSeasonal.img || ''} 
                onChange={url => setNewSeasonal({...newSeasonal, img: url})} 
                aspect={4/5}
                targetWidth={800}
                targetHeight={1000}
              />
              <button onClick={saveSeasonal} className="w-full py-3 bg-secondary text-white rounded-xl font-bold uppercase tracking-widest text-xs">SALVAR</button>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-secondary">Lista de Sazonais</h3>
              <Reorder.Group axis="y" values={seasonalItems} onReorder={setSeasonalItems} className="space-y-3">
                {seasonalItems.map(s => (
                  <SeasonalItem key={s.id} s={s} editingSeasonal={editingSeasonal} setEditingSeasonal={setEditingSeasonal} saveSeasonal={saveSeasonal} deleteSeasonal={deleteSeasonal} />
                ))}
              </Reorder.Group>
            </div>
          </div>
        )}

        {/* DIAS DE FEIRA */}
        {adminTab === 'fair' && (
          <div className="space-y-6">
            <div className="bg-secondary/5 p-6 rounded-[32px] border border-secondary/20 space-y-4">
              <h3 className="font-bold text-secondary">Adicionar Novo Dia de Feira</h3>
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest pl-1">Dia da Semana</label>
                <button 
                   onClick={() => { setPickerTarget('new'); setShowDayPicker(true); }}
                   className="w-full p-4 rounded-xl bg-surface border border-outline-variant/30 text-sm text-left flex justify-between items-center group hover:border-secondary transition-colors"
                >
                  <span className={newSchedule.day ? "text-on-surface" : "text-on-surface-variant"}>
                    {newSchedule.day ? translateDayToPT(newSchedule.day) : "Selecionar Dia"}
                  </span>
                  <Edit2 size={16} className="text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>

              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest pl-1">Início</label>
                  <button 
                    onClick={() => { setPickerTarget('new'); setShowTimePicker('start'); }}
                    className="w-full p-4 rounded-xl bg-surface border border-outline-variant/30 text-sm text-center font-bold text-secondary hover:bg-secondary/5 transition-colors"
                  >
                    {newSchedule.startTime || "00:00"}
                  </button>
                </div>
                <div className="flex-1 space-y-2">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest pl-1">Término</label>
                  <button 
                    onClick={() => { setPickerTarget('new'); setShowTimePicker('end'); }}
                    className="w-full p-4 rounded-xl bg-surface border border-outline-variant/30 text-sm text-center font-bold text-secondary hover:bg-secondary/5 transition-colors"
                  >
                    {newSchedule.endTime || "00:00"}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest pl-1">Localização</label>
                <input type="text" placeholder="Ex: Parque do Ibirapuera" value={newSchedule.location} onChange={e => setNewSchedule({...newSchedule, location: e.target.value})} className="w-full p-3 rounded-xl bg-surface border border-outline-variant/30 text-sm outline-none" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest pl-1">Acessibilidade/Info</label>
                <input type="text" placeholder="Ex: Estacionamento no local" value={newSchedule.accessibility} onChange={e => setNewSchedule({...newSchedule, accessibility: e.target.value})} className="w-full p-3 rounded-xl bg-surface border border-outline-variant/30 text-sm outline-none" />
              </div>

              <button onClick={saveSchedule} className="w-full py-4 bg-secondary text-white rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-secondary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                SALVAR DIA DE FEIRA
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-secondary px-1">Dias Configurados</h3>
              <Reorder.Group axis="y" values={fairSchedules} onReorder={setFairSchedules} className="space-y-3">
                {fairSchedules.map(s => (
                  <ScheduleItem 
                    key={s.id} 
                    s={s} 
                    editingSchedule={editingSchedule} 
                    setEditingSchedule={setEditingSchedule} 
                    saveSchedule={saveSchedule} 
                    deleteSchedule={deleteSchedule}
                    onOpenDayPicker={() => { setPickerTarget('edit'); setShowDayPicker(true); }}
                    onOpenTimePicker={(type: 'start' | 'end') => { setPickerTarget('edit'); setShowTimePicker(type); }}
                  />
                ))}
              </Reorder.Group>
            </div>
          </div>
        )}

        {/* NOTIFICAÇÕES */}
        {adminTab === 'notifications' && (
          <div className="space-y-6">
            <div className="bg-primary/5 p-6 rounded-[32px] border border-primary/20 space-y-4">
              <h3 className="font-bold text-primary">Nova Notificação</h3>
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant pl-1">Título</label>
                <input 
                  type="text" 
                  placeholder="Título da notificação" 
                  value={newNotification.title} 
                  onChange={e => setNewNotification({...newNotification, title: e.target.value})} 
                  className="w-full p-3 rounded-xl bg-surface border border-outline-variant/30 text-sm outline-none" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant pl-1">Mensagem</label>
                <textarea 
                  placeholder="Escreva a mensagem aqui..." 
                  value={newNotification.message} 
                  onChange={e => setNewNotification({...newNotification, message: e.target.value})} 
                  className="w-full p-3 rounded-xl bg-surface border border-outline-variant/30 text-sm outline-none resize-none h-24" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant pl-1">Tipo</label>
                <div className="flex gap-2">
                  {['info', 'warning', 'event', 'success'].map(type => (
                    <button
                      key={type}
                      onClick={() => setNewNotification({...newNotification, type})}
                      className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${newNotification.type === type ? 'bg-primary text-white shadow-md' : 'bg-surface-container text-on-surface-variant hover:bg-outline-variant/10'}`}
                    >
                      {type === 'info' ? 'Informativo' : 
                       type === 'warning' ? 'Alerta' : 
                       type === 'event' ? 'Evento' : 
                       type === 'success' ? 'Sucesso' : type}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant pl-1">Destinatário</label>
                <div className="flex gap-2">
                  {[
                    { id: 'all', label: 'Todos os Usuários' },
                    { id: 'producers', label: 'Só para Produtores' }
                  ].map(target => (
                    <button
                      key={target.id}
                      onClick={() => setNewNotification({...newNotification, target: target.id})}
                      className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${(newNotification.target || 'all') === target.id ? 'bg-primary text-white shadow-md' : 'bg-surface-container text-on-surface-variant hover:bg-outline-variant/10'}`}
                    >
                      {target.label}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={saveNotification} className="w-full py-4 bg-primary text-white rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-transform active:scale-95">
                <Bell size={18} /> ENVIAR
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-primary px-1">Histórico de Envios</h3>
              <div className="space-y-3">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center bg-surface-container rounded-3xl border border-dashed border-outline-variant/30">
                    <p className="text-sm text-on-surface-variant">Nenhum envio recente.</p>
                  </div>
                ) : (
                  notifications.map((n: any) => (
                    <div key={n.id} className="bg-surface-container p-4 rounded-2xl flex items-center justify-between shadow-sm border border-outline-variant/10">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full ${n.type === 'warning' ? 'bg-error/10 text-error' : n.type === 'event' ? 'bg-tertiary/10 text-tertiary' : 'bg-primary/10 text-primary'}`}>
                          {n.type === 'warning' ? <AlertCircle size={20}/> : n.type === 'event' ? <Calendar size={20}/> : <Info size={20}/>}
                        </div>
                        <div>
                          <p className="font-bold text-on-surface text-sm">{n.title}</p>
                          <p className="text-xs text-on-surface-variant line-clamp-1">{n.message}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-[10px] text-outline font-medium">{new Date(n.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                            <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded-full ${n.target === 'producers' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                              {n.target === 'producers' ? 'Produtores' : 'Todos'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button onClick={() => deleteNotification(n.id)} className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"><Trash2 size={18}/></button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
                {/* POPUP DE BOAS VINDAS */}
        {adminTab === 'popup' && (
          <div className="space-y-6">
            <div className="bg-pink-50 p-6 rounded-[32px] border border-pink-100 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-pink-600">Configurar Pop-up</h3>
                <button 
                  onClick={() => setWelcomePopup({ ...welcomePopup, active: !welcomePopup.active })}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${welcomePopup.active ? 'bg-pink-500 text-white shadow-md' : 'bg-surface border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-high'}`}
                >
                  {welcomePopup.active ? 'Ativado' : 'Desativado'}
                </button>
              </div>
              <input type="text" placeholder="Título (ex: Feliz Ano Novo!)" value={welcomePopup.title} onChange={e => setWelcomePopup({...welcomePopup, title: e.target.value})} className="w-full p-3 rounded-xl bg-surface border border-outline-variant/30 text-sm outline-none focus:border-pink-300 transition-colors" />
              <textarea placeholder="Mensagem de felicitação..." value={welcomePopup.message} onChange={e => setWelcomePopup({...welcomePopup, message: e.target.value})} className="w-full p-3 rounded-xl bg-surface border border-outline-variant/30 text-sm outline-none resize-none h-24 focus:border-pink-300 transition-colors" />
              <input type="text" placeholder="URL da Imagem (opcional)" value={welcomePopup.image} onChange={e => setWelcomePopup({...welcomePopup, image: e.target.value})} className="w-full p-3 rounded-xl bg-surface border border-outline-variant/30 text-sm outline-none focus:border-pink-300 transition-colors" />
            </div>

            <div className="p-6 rounded-[32px] bg-primary/5 border border-primary/10">
              <div className="flex items-center gap-4 mb-3">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <Info size={20} />
                </div>
                <h4 className="font-bold text-primary">
                  Como funciona?
                </h4>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Quando ativado, este pop-up será exibido automaticamente na tela inicial assim que o usuário abrir o aplicativo. Ele é exibido apenas uma vez por sessão para não atrapalhar a navegação.
              </p>
            </div>
          </div>
        )}

        {/* CONFIGURAÇÕES E IDIOMA */}
        {adminTab === 'settings' && (
          <div className="space-y-6">
            {/* Opções Gerais */}
            <div className="p-6 rounded-[32px] bg-emerald-50 border border-emerald-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-600">
                  <Settings size={20} />
                </div>
                <h4 className="font-bold text-emerald-700">
                  Opções Gerais
                </h4>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-emerald-700/80 uppercase tracking-widest pl-1">WhatsApp para Contato (Parceiros)</label>
                <input 
                  type="tel" 
                  placeholder="Ex: 11999999999" 
                  value={appSettings?.whatsapp || ''} 
                  onChange={e => setAppSettings({...appSettings, whatsapp: e.target.value.replace(/\D/g, '')})} 
                  className="w-full p-3 rounded-xl bg-white border border-emerald-200 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all" 
                />
                <p className="text-xs text-emerald-600/70 pl-1">Insira apenas números (DDD + Número). Este número será usado no botão "Saiba Mais" da área de Parceiros.</p>
              </div>
            </div>


<section className="bg-blue-50 p-6 rounded-[32px] border border-blue-200 space-y-4">
              <div className="flex items-center gap-3 text-blue-700">
                <FileJson size={24} />
                <h3 className="font-bold">Backup do Sistema (JSON)</h3>
              </div>
              <p className="text-xs text-blue-600/80 leading-relaxed pl-1">
                Use esta opção para salvar uma cópia completa de todos os dados do aplicativo (produtos, produtores, receitas, etc.). Recomendado fazer semanalmente.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button 
                  onClick={handleExportBackup}
                  className="flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
                >
                  <Download size={18} /> Exportar
                </button>
                <label className="flex items-center justify-center gap-2 bg-white text-blue-600 border-2 border-blue-600 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest cursor-pointer active:scale-95 transition-all">
                  <Upload size={18} /> Importar
                  <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
                </label>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <FileSpreadsheet size={20} className="text-on-surface-variant" />
                <h3 className="font-bold text-on-surface">Gestão por Planilha (CSV)</h3>
              </div>
              
              <div className="space-y-3">
                {/* Gestão de Produtos */}
                <div className="bg-surface-container p-5 rounded-3xl border border-outline-variant/10 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm">Catálogo de Produtos</span>
                    <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold uppercase">{products.length} itens</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleExportProducts}
                      className="flex-1 flex items-center justify-center gap-2 bg-surface border border-outline-variant/30 py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider text-on-surface-variant hover:bg-surface-container-high transition-colors"
                    >
                      <Download size={14} /> Baixar CSV
                    </button>
                    <label className="flex-1 flex items-center justify-center gap-2 bg-surface border border-outline-variant/30 py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer">
                      <Upload size={14} /> Subir CSV
                      <input type="file" accept=".csv" onChange={handleImportProducts} className="hidden" />
                    </label>
                  </div>
                </div>

                {/* Gestão de Produtores */}
                <div className="bg-surface-container p-5 rounded-3xl border border-outline-variant/10 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm">Lista de Produtores</span>
                    <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold uppercase">{producers.length} perfis</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleExportProducers}
                      className="flex-1 flex items-center justify-center gap-2 bg-surface border border-outline-variant/30 py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider text-on-surface-variant hover:bg-surface-container-high transition-colors"
                    >
                      <Download size={14} /> Baixar CSV
                    </button>
                    <label className="flex-1 flex items-center justify-center gap-2 bg-surface border border-outline-variant/30 py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer">
                      <Upload size={14} /> Subir CSV
                      <input type="file" accept=".csv" onChange={handleImportProducers} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="bg-surface-container-highest/30 p-4 rounded-2xl flex items-start gap-3 border border-outline-variant/10">
                <Info size={16} className="text-on-surface-variant mt-0.5" />
                <p className="text-[10px] text-on-surface-variant leading-relaxed">
                  <strong>Dica:</strong> Para editar em massa, exporte o CSV, abra no Excel ou Google Sheets, faça as alterações e importe de volta. Novos itens serão adicionados ao final da lista.
                </p>
              </div>
            </section>

            <div className="p-6 rounded-[32px] bg-primary/5 border border-primary/10">
              <div className="flex items-center gap-4 mb-3">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <Info size={20} />
                </div>
                <h4 className="font-bold text-primary">
                  Sobre o Painel
                </h4>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Este painel permite gerenciar todos os aspectos do aplicativo "Companheiro da Feira". As alterações feitas aqui são salvas localmente no seu dispositivo.
              </p>
            </div>

            <div className="p-6 rounded-[32px] bg-error/5 border border-error/10">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 rounded-xl bg-error/10 text-error">
                  <Trash2 size={20} />
                </div>
                <h4 className="font-bold text-error">
                  Zona de Perigo
                </h4>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
                Abaixo você pode restaurar o aplicativo para o estado original. Isso apagará permanentemente todos os produtos, eventos, dias de feira e configurações que você cadastrou, voltando aos dados de demonstração.
              </p>
              <button 
                onClick={() => setShowResetConfirm(true)}
                className="w-full sm:w-auto px-6 py-3 bg-error text-on-error font-bold rounded-xl active:scale-95 transition-all shadow-sm"
              >
                Restaurar Dados Iniciais
              </button>
            </div>
          </div>
        )}
      </div>
    )}
  </div>

    {/* MODAIS DE SELEÇÃO */}
    <AnimatePresence>
        {showDayPicker && (
          <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDayPicker(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div 
              initial={{ y: '100%', opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              exit={{ y: '100%', opacity: 0 }}
              className="relative w-full max-w-sm bg-surface rounded-[32px] overflow-hidden shadow-2xl border border-outline-variant/20"
            >
              <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container/50">
                <h4 className="font-bold text-on-surface">Selecionar Dia</h4>
                <button onClick={() => setShowDayPicker(false)} className="p-2 hover:bg-error/10 hover:text-error rounded-full transition-colors"><X size={20}/></button>
              </div>
              <div className="p-4 max-h-[60vh] overflow-y-auto">
                {DAYS_OF_WEEK.map((day) => (
                  <button
                    key={day}
                    onClick={() => {
                      if (pickerTarget === 'new') setNewSchedule({ ...newSchedule, day });
                      else setEditingSchedule({ ...editingSchedule, day });
                      setShowDayPicker(false);
                    }}
                    className="w-full p-4 text-left font-medium hover:bg-primary/5 active:bg-primary/10 transition-colors border-b border-outline-variant/5 last:border-0"
                  >
                    {translateDayToPT(day)}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {showTimePicker && (
          <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowTimePicker(null)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-xs bg-surface rounded-[32px] overflow-hidden shadow-2xl border border-outline-variant/20"
            >
              <div className="p-6 border-b border-outline-variant/10 text-center bg-surface-container/50">
                <h4 className="font-bold text-on-surface">
                  {showTimePicker === 'start' ? 'Início' : 'Término'}
                </h4>
              </div>
              <div className="p-8">
                <input 
                  type="time" 
                  autoFocus
                  className="w-full p-4 text-3xl font-black text-center text-primary bg-primary/5 rounded-2xl outline-none"
                  onBlur={(e) => {
                    const time = e.target.value;
                    if (time) {
                      if (pickerTarget === 'new') {
                        if (showTimePicker === 'start') setNewSchedule({...newSchedule, startTime: time});
                        else setNewSchedule({...newSchedule, endTime: time});
                      } else if (editingSchedule) {
                        if (showTimePicker === 'start') setEditingSchedule({...editingSchedule, startTime: time});
                        else setEditingSchedule({...editingSchedule, endTime: time});
                      }
                    }
                    setShowTimePicker(null);
                  }}
                />
              </div>
            </motion.div>
          </div>
        )}

        {showResetConfirm && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-surface rounded-[32px] overflow-hidden shadow-2xl border border-error/20"
            >
              <div className="p-6 bg-error/5 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-error/10 text-error flex items-center justify-center mb-4">
                  <AlertCircle size={32} />
                </div>
                <h3 className="text-xl font-black text-error mb-2">Aviso Crítico</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Isso apagará <strong>permanentemente</strong> todos os dados cadastrados (produtos, dias de feira, eventos, etc.) e restaurará o conteúdo padrão de fábrica.
                </p>
                <p className="text-sm font-bold text-error mt-4">
                  Essa ação não pode ser desfeita.
                </p>
              </div>
              <div className="p-4 bg-surface-container flex gap-3">
                <button 
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-3 bg-outline-variant/20 text-on-surface font-bold rounded-xl active:scale-95 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => {
                    localStorage.clear();
                    window.location.reload();
                  }}
                  className="flex-1 py-3 bg-error text-on-error font-bold rounded-xl active:scale-95 transition-all shadow-sm"
                >
                  Confirmar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// --- Subcomponents for Drag & Drop with Handles ---

const DragHandle = ({ controls }: { controls: any }) => (
  <div 
    className="cursor-grab active:cursor-grabbing text-outline-variant p-2 hover:bg-surface-container-high rounded-lg transition-colors"
    onPointerDown={(e) => controls.start(e)}
  >
    <GripVertical size={20} />
  </div>
);

const ProductItem = ({ p, editingProduct, setEditingProduct, saveProduct, deleteProduct }: any) => {
  const controls = useDragControls();
  return (
    <Reorder.Item 
      value={p}
      dragListener={false}
      dragControls={controls}
      className="bg-surface-container p-4 rounded-2xl flex items-center justify-between shadow-sm border border-outline-variant/10"
      whileDrag={{ scale: 1.02, shadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
    >
      {editingProduct?.id === p.id ? (
        <div className="w-full space-y-2">
          <input type="text" value={editingProduct.name} onChange={(e: any) => setEditingProduct({...editingProduct, name: e.target.value})} className="w-full p-2 rounded-lg bg-surface text-sm" placeholder="Nome" />
          <input type="text" value={editingProduct.type} onChange={(e: any) => setEditingProduct({...editingProduct, type: e.target.value})} className="w-full p-2 rounded-lg bg-surface text-sm" placeholder="Tipo" />
          <input type="text" value={editingProduct.price} onChange={(e: any) => setEditingProduct({...editingProduct, price: e.target.value})} className="w-full p-2 rounded-lg bg-surface text-sm" placeholder="Preço" />
          <ImageUploadField 
            label="Foto do Produto" 
            value={editingProduct.img || ''} 
            onChange={url => setEditingProduct({...editingProduct, img: url})} 
            aspect={1}
            targetWidth={800}
            targetHeight={800}
          />
          <div className="flex gap-2">
            <button onClick={saveProduct} className="flex-1 py-2 bg-secondary text-white rounded-lg text-xs font-bold"><Check size={16} className="inline mr-1"/> Salvar</button>
            <button onClick={() => setEditingProduct(null)} className="flex-1 py-2 bg-outline-variant text-white rounded-lg text-xs font-bold">Cancelar</button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <DragHandle controls={controls} />
            <div>
              <p className="font-bold text-primary">{p.name}</p>
              <p className="text-xs text-on-surface-variant">{p.price} • {p.type}</p>
            </div>
          </div>
          <div className="flex gap-1">
            <button onClick={() => setEditingProduct(p)} className="p-2 text-primary hover:bg-primary/10 rounded-lg"><Edit2 size={16}/></button>
            <button onClick={() => deleteProduct(p.id)} className="p-2 text-error hover:bg-error/10 rounded-lg"><Trash2 size={16}/></button>
          </div>
        </>
      )}
    </Reorder.Item>
  );
};

const RecipeItem = ({ r, editingRecipe, setEditingRecipe, saveRecipe, deleteRecipe }: any) => {
  const controls = useDragControls();
  return (
    <Reorder.Item 
      value={r}
      dragListener={false}
      dragControls={controls}
      className="bg-surface-container p-4 rounded-2xl flex items-center justify-between shadow-sm border border-outline-variant/10"
      whileDrag={{ scale: 1.02, shadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
    >
      {editingRecipe?.id === r.id ? (
        <div className="w-full space-y-2">
          <input type="text" value={editingRecipe.title} onChange={(e: any) => setEditingRecipe({...editingRecipe, title: e.target.value})} className="w-full p-2 rounded-lg bg-surface text-sm" placeholder="Título" />
          <textarea value={editingRecipe.intro} onChange={(ev: any) => setEditingRecipe({...editingRecipe, intro: ev.target.value})} className="w-full p-2 rounded-lg bg-surface text-sm h-16 resize-none" placeholder="Introdução" />
          <textarea value={editingRecipe.ingredients} onChange={(ev: any) => setEditingRecipe({...editingRecipe, ingredients: ev.target.value})} className="w-full p-2 rounded-lg bg-surface text-sm h-24 resize-none" placeholder="Ingredientes" />
          <textarea value={editingRecipe.instructions} onChange={(ev: any) => setEditingRecipe({...editingRecipe, instructions: ev.target.value})} className="w-full p-2 rounded-lg bg-surface text-sm h-24 resize-none" placeholder="Modo de Preparo" />
          <ImageUploadField 
            label="Foto da Receita" 
            value={editingRecipe.img} 
            onChange={url => setEditingRecipe({...editingRecipe, img: url})} 
            aspect={4/5}
            targetWidth={800}
            targetHeight={1000}
          />
          <div className="flex gap-2">
            <input type="text" value={editingRecipe.time} onChange={(e: any) => setEditingRecipe({...editingRecipe, time: e.target.value})} className="flex-1 p-2 rounded-lg bg-surface text-sm" placeholder="Tempo" />
            <input type="text" value={editingRecipe.diff} onChange={(e: any) => setEditingRecipe({...editingRecipe, diff: e.target.value})} className="flex-1 p-2 rounded-lg bg-surface text-sm" placeholder="Dificuldade" />
          </div>
          <div className="flex gap-2">
            <button onClick={saveRecipe} className="flex-1 py-2 bg-secondary text-white rounded-lg text-xs font-bold"><Check size={16} className="inline mr-1"/> Salvar</button>
            <button onClick={() => setEditingRecipe(null)} className="flex-1 py-2 bg-outline-variant text-white rounded-lg text-xs font-bold">Cancelar</button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <DragHandle controls={controls} />
            <div>
              <p className="font-bold text-primary">{r.title}</p>
              <p className="text-xs text-on-surface-variant">{r.time} • {r.diff}</p>
            </div>
          </div>
          <div className="flex gap-1">
            <button onClick={() => setEditingRecipe(r)} className="p-2 text-primary hover:bg-primary/10 rounded-lg"><Edit2 size={16}/></button>
            <button onClick={() => deleteRecipe(r.id)} className="p-2 text-error hover:bg-error/10 rounded-lg"><Trash2 size={16}/></button>
          </div>
        </>
      )}
    </Reorder.Item>
  );
};

const EventItem = ({ e, editingEvent, setEditingEvent, saveEvent, deleteEvent }: any) => {
  const controls = useDragControls();
  return (
    <Reorder.Item 
      value={e}
      dragListener={false}
      dragControls={controls}
      className="bg-surface-container p-4 rounded-2xl flex items-center justify-between shadow-sm border border-outline-variant/10"
      whileDrag={{ scale: 1.02, shadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
    >
      {editingEvent?.id === e.id ? (
        <div className="w-full space-y-2">
          <input type="text" value={editingEvent.title} onChange={(ev: any) => setEditingEvent({...editingEvent, title: ev.target.value})} className="w-full p-2 rounded-lg bg-surface text-sm" placeholder="Título" />
          <textarea value={editingEvent.desc || ''} onChange={(ev: any) => setEditingEvent({...editingEvent, desc: ev.target.value})} className="w-full p-2 rounded-lg bg-surface text-sm h-16" placeholder="Descrição" />
          <div className="flex gap-2">
            <input type="text" value={editingEvent.day} onChange={(ev: any) => setEditingEvent({...editingEvent, day: ev.target.value})} className="w-16 p-2 rounded-lg bg-surface text-sm" placeholder="Dia" />
            <input type="text" value={editingEvent.month} onChange={(ev: any) => setEditingEvent({...editingEvent, month: ev.target.value})} className="w-24 p-2 rounded-lg bg-surface text-sm" placeholder="Mês" />
            <input type="text" value={editingEvent.time} onChange={(ev: any) => setEditingEvent({...editingEvent, time: ev.target.value})} className="flex-1 p-2 rounded-lg bg-surface text-sm" placeholder="Horário" />
          </div>
          <input type="text" value={editingEvent.local} onChange={(ev: any) => setEditingEvent({...editingEvent, local: ev.target.value})} className="w-full p-2 rounded-lg bg-surface text-sm" placeholder="Local" />
          <div className="flex gap-2">
            <button onClick={saveEvent} className="flex-1 py-2 bg-secondary text-white rounded-lg text-xs font-bold"><Check size={16} className="inline mr-1"/> Salvar</button>
            <button onClick={() => setEditingEvent(null)} className="flex-1 py-2 bg-outline-variant text-white rounded-lg text-xs font-bold">Cancelar</button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <DragHandle controls={controls} />
            <div>
              <p className="font-bold text-primary">{e.title}</p>
              <p className="text-xs text-on-surface-variant">{e.day} {e.month} • {e.time}</p>
            </div>
          </div>
          <div className="flex gap-1">
            <button onClick={() => setEditingEvent(e)} className="p-2 text-primary hover:bg-primary/10 rounded-lg"><Edit2 size={16}/></button>
            <button onClick={() => deleteEvent(e.id)} className="p-2 text-error hover:bg-error/10 rounded-lg"><Trash2 size={16}/></button>
          </div>
        </>
      )}
    </Reorder.Item>
  );
};

const PartnerItem = ({ r, editingRestaurant, setEditingRestaurant, saveRestaurant, deleteRestaurant }: any) => {
  const controls = useDragControls();
  return (
    <Reorder.Item 
      value={r}
      dragListener={false}
      dragControls={controls}
      className="bg-surface-container p-4 rounded-2xl flex items-center justify-between shadow-sm border border-outline-variant/10"
      whileDrag={{ scale: 1.02, shadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
    >
      {editingRestaurant?.id === r.id ? (
        <div className="w-full space-y-2">
          <input type="text" value={editingRestaurant.name} onChange={(ev: any) => setEditingRestaurant({...editingRestaurant, name: ev.target.value})} className="w-full p-2 rounded-lg bg-surface text-sm" placeholder="Nome" />
          <input type="text" value={editingRestaurant.type} onChange={(ev: any) => setEditingRestaurant({...editingRestaurant, type: ev.target.value})} className="w-full p-2 rounded-lg bg-surface text-sm" placeholder="Tipo" />
          <div className="flex gap-2">
            <input type="text" value={editingRestaurant.address} onChange={(ev: any) => setEditingRestaurant({...editingRestaurant, address: ev.target.value})} className="flex-1 p-2 rounded-lg bg-surface text-sm" placeholder="Endereço" />
            <input type="text" value={editingRestaurant.number} onChange={(ev: any) => setEditingRestaurant({...editingRestaurant, number: ev.target.value})} className="w-20 p-2 rounded-lg bg-surface text-sm" placeholder="Nº" />
          </div>
          <input type="text" value={editingRestaurant.hours} onChange={(ev: any) => setEditingRestaurant({...editingRestaurant, hours: ev.target.value})} className="w-full p-2 rounded-lg bg-surface text-sm" placeholder="Horário" />
          <textarea value={editingRestaurant.description || ''} onChange={(ev: any) => setEditingRestaurant({...editingRestaurant, description: ev.target.value})} className="w-full p-2 rounded-lg bg-surface text-sm min-h-[80px] resize-none" placeholder="Descrição" />
          <ImageUploadField 
            label="Foto do Restaurante" 
            value={editingRestaurant.img || ''} 
            onChange={url => setEditingRestaurant({...editingRestaurant, img: url})} 
            aspect={1.5}
            targetWidth={900}
            targetHeight={600}
          />
          <div className="flex gap-2">
            <button onClick={saveRestaurant} className="flex-1 py-2 bg-secondary text-white rounded-lg text-xs font-bold"><Check size={16} className="inline mr-1"/> Salvar</button>
            <button onClick={() => setEditingRestaurant(null)} className="flex-1 py-2 bg-outline-variant text-white rounded-lg text-xs font-bold">Cancelar</button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <DragHandle controls={controls} />
            <div>
              <p className="font-bold text-primary">{r.name}</p>
              <p className="text-xs text-on-surface-variant">{r.type} • {r.address}</p>
            </div>
          </div>
          <div className="flex gap-1">
            <button onClick={() => setEditingRestaurant(r)} className="p-2 text-primary hover:bg-primary/10 rounded-lg"><Edit2 size={16}/></button>
            <button onClick={() => deleteRestaurant(r.id)} className="p-2 text-error hover:bg-error/10 rounded-lg"><Trash2 size={16}/></button>
          </div>
        </>
      )}
    </Reorder.Item>
  );
};

const CafeItem = ({ c, editingCafe, setEditingCafe, saveCafe, deleteCafe }: any) => {
  const controls = useDragControls();
  return (
    <Reorder.Item 
      value={c}
      dragListener={false}
      dragControls={controls}
      className="bg-surface-container p-4 rounded-2xl flex items-center justify-between shadow-sm border border-outline-variant/10"
      whileDrag={{ scale: 1.02, shadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
    >
      {editingCafe?.id === c.id ? (
        <div className="w-full space-y-2">
          <input type="text" value={editingCafe.name} onChange={(ev: any) => setEditingCafe({...editingCafe, name: ev.target.value})} className="w-full p-2 rounded-lg bg-surface text-sm" placeholder="Nome" />
          <div className="flex gap-2">
            <input type="text" value={editingCafe.category} onChange={(ev: any) => setEditingCafe({...editingCafe, category: ev.target.value})} list="cafe-categories" className="flex-1 p-2 rounded-lg bg-surface text-sm" placeholder="Categoria" />
            <input type="text" value={editingCafe.price} onChange={(ev: any) => setEditingCafe({...editingCafe, price: ev.target.value})} className="w-24 p-2 rounded-lg bg-surface text-sm" placeholder="Preço" />
          </div>
          <textarea value={editingCafe.description} onChange={(ev: any) => setEditingCafe({...editingCafe, description: ev.target.value})} className="w-full p-2 rounded-lg bg-surface text-sm h-16 resize-none" placeholder="Descrição" />
          <textarea value={editingCafe.ingredients} onChange={(ev: any) => setEditingCafe({...editingCafe, ingredients: ev.target.value})} className="w-full p-2 rounded-lg bg-surface text-sm h-16 resize-none" placeholder="Ingredientes" />
          <input type="text" value={editingCafe.process || ''} onChange={(ev: any) => setEditingCafe({...editingCafe, process: ev.target.value})} className="w-full p-2 rounded-lg bg-surface text-sm" placeholder="Processo" />
          <ImageUploadField 
            label="Foto do Item" 
            value={editingCafe.img || ''} 
            onChange={url => setEditingCafe({...editingCafe, img: url})} 
            aspect={1}
            targetWidth={800}
            targetHeight={800}
          />
          <div className="flex gap-2">
            <button onClick={saveCafe} className="flex-1 py-2 bg-secondary text-white rounded-lg text-xs font-bold"><Check size={16} className="inline mr-1"/> Salvar</button>
            <button onClick={() => setEditingCafe(null)} className="flex-1 py-2 bg-outline-variant text-white rounded-lg text-xs font-bold">Cancelar</button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <DragHandle controls={controls} />
            <div>
              <p className="font-bold text-primary">{c.name}</p>
              <p className="text-xs text-on-surface-variant">{c.category} • {c.price}</p>
            </div>
          </div>
          <div className="flex gap-1">
            <button onClick={() => setEditingCafe(c)} className="p-2 text-primary hover:bg-primary/10 rounded-lg"><Edit2 size={16}/></button>
            <button onClick={() => deleteCafe(c.id)} className="p-2 text-error hover:bg-error/10 rounded-lg"><Trash2 size={16}/></button>
          </div>
        </>
      )}
    </Reorder.Item>
  );
};

const SeasonalItem = ({ s, editingSeasonal, setEditingSeasonal, saveSeasonal, deleteSeasonal }: any) => {
  const controls = useDragControls();
  return (
    <Reorder.Item 
      value={s}
      dragListener={false}
      dragControls={controls}
      className="bg-surface-container p-4 rounded-2xl flex items-center justify-between shadow-sm border border-outline-variant/10"
      whileDrag={{ scale: 1.02, shadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
    >
      {editingSeasonal?.id === s.id ? (
        <div className="w-full space-y-2">
          <input type="text" value={editingSeasonal.name} onChange={(ev: any) => setEditingSeasonal({...editingSeasonal, name: ev.target.value})} className="w-full p-2 rounded-lg bg-surface text-sm" placeholder="Nome" />
          <input type="text" value={editingSeasonal.benefit} onChange={(ev: any) => setEditingSeasonal({...editingSeasonal, benefit: ev.target.value})} className="w-full p-2 rounded-lg bg-surface text-sm" placeholder="Benefício" />
          <ImageUploadField 
            label="Foto Sazonal" 
            value={editingSeasonal.img || ''} 
            onChange={url => setEditingSeasonal({...editingSeasonal, img: url})} 
            aspect={4/5}
            targetWidth={800}
            targetHeight={1000}
          />
          <div className="flex gap-2">
            <button onClick={saveSeasonal} className="flex-1 py-2 bg-secondary text-white rounded-lg text-xs font-bold"><Check size={16} className="inline mr-1"/> Salvar</button>
            <button onClick={() => setEditingSeasonal(null)} className="flex-1 py-2 bg-outline-variant text-white rounded-lg text-xs font-bold">Cancelar</button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <DragHandle controls={controls} />
            <div>
              <p className="font-bold text-primary">{s.name}</p>
              <p className="text-xs text-on-surface-variant">{s.benefit}</p>
            </div>
          </div>
          <div className="flex gap-1">
            <button onClick={() => setEditingSeasonal(s)} className="p-2 text-primary hover:bg-primary/10 rounded-lg"><Edit2 size={16}/></button>
            <button onClick={() => deleteSeasonal(s.id)} className="p-2 text-error hover:bg-error/10 rounded-lg"><Trash2 size={16}/></button>
          </div>
        </>
      )}
    </Reorder.Item>
  );
};

const ScheduleItem = ({ s, editingSchedule, setEditingSchedule, saveSchedule, deleteSchedule, onOpenDayPicker, onOpenTimePicker }: any) => {
  const { t } = useTranslation();
  const controls = useDragControls();
  return (
    <Reorder.Item 
      value={s}
      dragListener={false}
      dragControls={controls}
      className="bg-surface-container p-4 rounded-2xl flex items-center justify-between shadow-sm border border-outline-variant/10"
      whileDrag={{ scale: 1.02, shadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
    >
      {editingSchedule?.id === s.id ? (
        <div className="w-full space-y-3">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest pl-1">Dia</label>
            <button 
              onClick={onOpenDayPicker}
              className="w-full p-3 rounded-xl bg-surface border border-outline-variant/30 text-sm text-left flex justify-between items-center"
            >
              {translateDayToPT(editingSchedule.day)}
              <Edit2 size={14} className="text-secondary" />
            </button>
          </div>

          <div className="flex gap-2">
            <div className="flex-1 space-y-1">
              <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest pl-1">Início</label>
              <button 
                onClick={() => onOpenTimePicker('start')}
                className="w-full p-3 rounded-xl bg-surface border border-outline-variant/30 text-sm font-bold text-secondary"
              >
                {editingSchedule.startTime}
              </button>
            </div>
            <div className="flex-1 space-y-1">
              <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest pl-1">Fim</label>
              <button 
                onClick={() => onOpenTimePicker('end')}
                className="w-full p-3 rounded-xl bg-surface border border-outline-variant/30 text-sm font-bold text-secondary"
              >
                {editingSchedule.endTime}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest pl-1">Local</label>
            <input type="text" value={editingSchedule.location} onChange={(ev: any) => setEditingSchedule({...editingSchedule, location: ev.target.value})} className="w-full p-3 rounded-xl bg-surface border border-outline-variant/30 text-sm" placeholder="Local" />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest pl-1">Acessibilidade</label>
            <input type="text" value={editingSchedule.accessibility || ''} onChange={(ev: any) => setEditingSchedule({...editingSchedule, accessibility: ev.target.value})} className="w-full p-3 rounded-xl bg-surface border border-outline-variant/30 text-sm" placeholder="Acessibilidade" />
          </div>

          <div className="flex gap-2 pt-2">
            <button onClick={saveSchedule} className="flex-1 py-3 bg-secondary text-white rounded-xl text-xs font-bold shadow-lg shadow-secondary/10">
              <Check size={16} className="inline mr-1"/> Salvar Alterações
            </button>
            <button onClick={() => setEditingSchedule(null)} className="px-4 py-3 bg-surface-container-high text-on-surface rounded-xl text-xs font-bold">
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <DragHandle controls={controls} />
            <div>
              <p className="font-bold text-primary">{translateDayToPT(s.day)}</p>
              <p className="text-xs text-on-surface-variant">{s.startTime} - {s.endTime} • {s.location}</p>
              {s.accessibility && <p className="text-[10px] text-primary/60 italic">{s.accessibility}</p>}
            </div>
          </div>
          <div className="flex gap-1">
            <button onClick={() => setEditingSchedule(s)} className="p-2 text-primary hover:bg-primary/10 rounded-lg"><Edit2 size={16}/></button>
            <button onClick={() => deleteSchedule(s.id)} className="p-2 text-error hover:bg-error/10 rounded-lg"><Trash2 size={16}/></button>
          </div>
        </>
      )}
    </Reorder.Item>
  );
};

const HeroSlideItem = ({ slide, editingHeroSlide, setEditingHeroSlide, saveHeroSlide, deleteHeroSlide }: any) => {
  const controls = useDragControls();
  return (
    <Reorder.Item 
      value={slide}
      dragListener={false}
      dragControls={controls}
      className="bg-surface-container p-4 rounded-2xl flex items-center justify-between shadow-sm border border-outline-variant/10"
      whileDrag={{ scale: 1.02, shadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
    >
      {editingHeroSlide?.id === slide.id ? (
        <div className="w-full space-y-2">
          <textarea value={editingHeroSlide.title} onChange={(ev: any) => setEditingHeroSlide({...editingHeroSlide, title: ev.target.value})} className="w-full p-2 rounded-lg bg-surface text-sm h-16 resize-none" placeholder="Título" />
          <input type="text" value={editingHeroSlide.subtitle} onChange={(ev: any) => setEditingHeroSlide({...editingHeroSlide, subtitle: ev.target.value})} className="w-full p-2 rounded-lg bg-surface text-sm" placeholder="Subtítulo" />
          <ImageUploadField 
            label="Imagem de Fundo" 
            value={editingHeroSlide.backgroundImage} 
            onChange={url => setEditingHeroSlide({...editingHeroSlide, backgroundImage: url})} 
            aspect={2}
            targetWidth={1200}
            targetHeight={600}
          />
          <div className="flex gap-2">
            <button onClick={saveHeroSlide} className="flex-1 py-2 bg-secondary text-white rounded-lg text-xs font-bold"><Check size={16} className="inline mr-1"/> Salvar</button>
            <button onClick={() => setEditingHeroSlide(null)} className="flex-1 py-2 bg-outline-variant text-white rounded-lg text-xs font-bold">Cancelar</button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <DragHandle controls={controls} />
            <div className="flex items-center gap-3">
              <RemoteImage src={slide.backgroundImage} alt="" className="w-12 h-12 rounded-lg object-cover shadow-sm" />
              <div>
                <p className="font-bold text-primary text-sm line-clamp-1">{slide.title}</p>
                <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest">{slide.subtitle}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-1">
            <button onClick={() => setEditingHeroSlide(slide)} className="p-2 text-primary hover:bg-primary/10 rounded-lg"><Edit2 size={16}/></button>
            <button onClick={() => deleteHeroSlide()} className="p-2 text-error hover:bg-error/10 rounded-lg"><Trash2 size={16}/></button>
          </div>
        </>
      )}
    </Reorder.Item>
  );
};

const ProducerItem = ({ p, editingProducer, setEditingProducer, saveProducer, deleteProducer, toggleHidden }: any) => {
  const controls = useDragControls();
  return (
    <Reorder.Item 
      value={p}
      dragListener={false}
      dragControls={controls}
      className="bg-surface-container p-4 rounded-2xl flex items-center justify-between shadow-sm border border-outline-variant/10"
      whileDrag={{ scale: 1.02, shadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
    >
      {editingProducer?.id === p.id ? (
        <div className="w-full space-y-2">
          <input type="text" value={editingProducer.name} onChange={ev => setEditingProducer({...editingProducer, name: ev.target.value})} className="w-full p-2 rounded-lg bg-surface text-sm font-bold" />
          <textarea value={editingProducer.history} onChange={ev => setEditingProducer({...editingProducer, history: ev.target.value})} className="w-full p-2 rounded-lg bg-surface text-sm h-20 resize-none" />
          <input type="text" value={editingProducer.location} onChange={ev => setEditingProducer({...editingProducer, location: ev.target.value})} className="w-full p-2 rounded-lg bg-surface text-sm" placeholder="Localização" />
          <input type="text" value={Array.isArray(editingProducer.products) ? editingProducer.products.join(', ') : editingProducer.products} onChange={ev => setEditingProducer({...editingProducer, products: ev.target.value})} className="w-full p-2 rounded-lg bg-surface text-sm" placeholder="Produtos (separados por vírgula)" />
          <ImageUploadField 
            label="Foto do Produtor" 
            value={editingProducer.image} 
            onChange={url => setEditingProducer({...editingProducer, image: url})} 
            aspect={1}
            targetWidth={800}
            targetHeight={800}
          />
          <div className="p-3 rounded-xl bg-surface border border-outline-variant/30 space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant pl-1">Presença</p>
            <div className="flex flex-wrap gap-1.5">
              {fairSchedules && fairSchedules.length > 0 ? (
                fairSchedules.map((schedule: any) => {
                  const confirmedDays = editingProducer.confirmedDays || {};
                  const isSelected = !!confirmedDays[schedule.id];
                  return (
                    <button
                      key={schedule.id}
                      onClick={() => {
                        const nextDays = { ...confirmedDays, [schedule.id]: !isSelected };
                        const hasAny = Object.values(nextDays).some(Boolean);
                        setEditingProducer({
                          ...editingProducer, 
                          confirmedDays: nextDays,
                          confirmed: hasAny
                        });
                      }}
                      className={`px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                        isSelected 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      {schedule.day.substring(0, 3)}
                    </button>
                  );
                })
              ) : (
                ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                  const confirmedDays = Array.isArray(editingProducer.confirmedDays) ? editingProducer.confirmedDays : [];
                  const isSelected = confirmedDays.includes(day);
                  return (
                    <button
                      key={day}
                      onClick={() => {
                        const nextDays = isSelected 
                          ? confirmedDays.filter(d => d !== day)
                          : [...confirmedDays, day];
                        setEditingProducer({
                          ...editingProducer, 
                          confirmedDays: nextDays,
                          confirmed: nextDays.length > 0
                        });
                      }}
                      className={`px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                        isSelected 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      {t(`home.days.${day}`).substring(0, 3)}
                    </button>
                  );
                })
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={saveProducer} className="flex-1 py-2 bg-primary text-white rounded-lg text-xs font-bold">Salvar</button>
            <button onClick={() => setEditingProducer(null)} className="flex-1 py-2 bg-outline-variant text-white rounded-lg text-xs font-bold">Cancelar</button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <DragHandle controls={controls} />
            <div className={`flex items-center gap-3 ${p.hidden ? 'opacity-50 grayscale' : ''}`}>
              <RemoteImage src={p.image} alt="" className="w-12 h-12 rounded-lg object-cover shadow-sm" />
              <div>
                <p className="font-bold text-primary text-sm flex items-center gap-2">
                  {p.name}
                  {p.hidden && <span className="text-[10px] bg-outline-variant/20 text-on-surface-variant px-2 py-0.5 rounded-full uppercase tracking-widest font-black">OCULTO</span>}
                </p>
                <p className="text-[10px] text-on-surface-variant line-clamp-1">{p.location}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-1 items-center">
            <button onClick={toggleHidden} className="p-2 text-on-surface-variant hover:bg-outline-variant/10 rounded-lg" title={p.hidden ? "Mostrar na lista pública" : "Ocultar da lista pública"}>
              {p.hidden ? <EyeOff size={16}/> : <Eye size={16}/>}
            </button>
            <button onClick={() => setEditingProducer(p)} className="p-2 text-primary hover:bg-primary/10 rounded-lg" title="Editar"><Edit2 size={16}/></button>
            <button onClick={() => {
              if (window.confirm('Tem certeza que deseja excluir este produtor? Essa ação não pode ser desfeita. Se o produtor só estiver ausente temporariamente, use o botão de ocultar (olho).')) {
                deleteProducer(p.id);
              }
            }} className="p-2 text-error hover:bg-error/10 rounded-lg" title="Excluir"><Trash2 size={16}/></button>
          </div>
        </>
      )}
    </Reorder.Item>
  );
};
