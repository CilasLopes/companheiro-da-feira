import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { ImageUploadField } from '../components/ImageUploadField';
import { RemoteImage } from '../components/RemoteImage';
import {
  X, LogOut, Store, MapPin, User, ShoppingBag,
  Plus, Trash2, Check, CalendarCheck, Info,
  ChevronRight, BarChart2, Camera, Eye, EyeOff, Lock, Edit2
} from 'lucide-react';


interface ProducerPanelProps {
  producers: any[];
  setProducers: (p: any[]) => void;
  products: any[];
  setProducts: (p: any[]) => void;
  fairSchedules?: any[];
  onClose: () => void;
}

const NAV = [
  { id: 'overview', label: 'Visão Geral', icon: BarChart2 },
  { id: 'profile', label: 'Meu Perfil', icon: User },
  { id: 'products', label: 'Meus Produtos', icon: ShoppingBag },
];

export const ProducerPanel = ({ producers, setProducers, products, setProducts, fairSchedules = [], onClose }: ProducerPanelProps) => {
  const { t } = useTranslation();
  const [step, setStep] = useState<'login' | 'dashboard'>('login');
  const [loginType, setLoginType] = useState<'producer' | 'admin'>('producer');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loggedProducer, setLoggedProducer] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Profile edit state
  const [profile, setProfile] = useState<any>(null);
  const [profileSaved, setProfileSaved] = useState(false);

  // Password change state
  const [showChangePw, setShowChangePw] = useState(false);
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwSaved, setPwSaved] = useState(false);

  // Product state
  const [newProduct, setNewProduct] = useState({ name: '', type: '', price: '', img: '' });
  const [addingProduct, setAddingProduct] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);

  const myProducts = products.filter(p => p.producerId === loggedProducer?.id);

  const handleLogin = () => {
    setLoginError('');
    
    // LOGIN COMO ADMIN
    if (loginType === 'admin') {
      if (username.trim().toLowerCase() === 'admin' && password.trim() === 'feira123') {
        if ((window as any).showAdminPanel) {
          (window as any).showAdminPanel();
        } else {
          setLoginError('Erro: Função administrativa não encontrada.');
        }
        return;
      } else {
        setLoginError('Credenciais de Admin incorretas.');
        return;
      }
    }

    // LOGIN COMO PRODUTOR
    const found = producers.find(
      p => p.username && p.password &&
        p.username.trim().toLowerCase() === username.trim().toLowerCase() &&
        p.password === password.trim()
    );
    if (found) {
      setLoggedProducer(found);
      setProfile({ ...found });
      setStep('dashboard');
    } else {
      setLoginError('Usuário ou senha de Produtor incorretos.');
    }
  };

  const handleLogout = () => {
    setStep('login');
    setUsername(''); setPassword('');
    setLoggedProducer(null); setProfile(null);
    setActiveTab('overview'); setLoginError('');
  };

  const { t } = useTranslation();

  // Per-day presence toggle
  const toggleDay = (dayId: string) => {
    const current: Record<string, boolean> = loggedProducer.confirmedDays || {};
    const next = { ...current, [dayId]: !current[dayId] };
    const anyConfirmed = Object.values(next).some(Boolean);
    const updated = producers.map(p =>
      p.id === loggedProducer.id ? { ...p, confirmedDays: next, confirmed: anyConfirmed } : p
    );
    setProducers(updated);
    const nextProducer = { ...loggedProducer, confirmedDays: next, confirmed: anyConfirmed };
    setLoggedProducer(nextProducer);
    setProfile((pr: any) => ({ ...pr, confirmedDays: next, confirmed: anyConfirmed }));
  };

  // Change password
  const handleChangePw = () => {
    setPwError('');
    if (newPw.length < 4) { setPwError('A senha deve ter pelo menos 4 caracteres.'); return; }
    if (newPw !== confirmPw) { setPwError('As senhas não coincidem.'); return; }
    const updated = producers.map(p => p.id === loggedProducer.id ? { ...p, password: newPw } : p);
    setProducers(updated);
    setLoggedProducer({ ...loggedProducer, password: newPw });
    setNewPw(''); setConfirmPw(''); setShowChangePw(false); setPwSaved(true);
    setTimeout(() => setPwSaved(false), 2500);
  };

  const saveProfile = () => {
    const updated = producers.map(p => p.id === loggedProducer.id ? { ...p, ...profile } : p);
    setProducers(updated);
    setLoggedProducer({ ...loggedProducer, ...profile });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  const saveProduct = () => {
    if (editingProductId) {
      setProducts(products.map(p => p.id === editingProductId ? { ...newProduct, id: editingProductId, producerId: loggedProducer.id } : p));
      setEditingProductId(null);
    } else {
      setProducts([...products, { ...newProduct, id: Date.now(), producerId: loggedProducer.id }]);
    }
    setNewProduct({ name: '', type: '', price: '', img: '' });
    setAddingProduct(false);
  };

  const removeProduct = (id: number) => setProducts(products.filter(p => p.id !== id));

  // ─── LOGIN SCREEN ───────────────────────────────────────────────
  if (step === 'login') return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-surface flex flex-col">
      
      {/* Header da Tela de Login */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/10 bg-white">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-2xl">
            {loginType === 'admin' ? <Lock size={22} className="text-primary" /> : <Store size={22} className="text-primary" />}
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-primary leading-none">
              {loginType === 'admin' ? 'Painel Admin' : 'Área do Produtor'}
            </h1>
            <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mt-1 opacity-60">Acesso Restrito</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 bg-surface-container hover:bg-surface-container-high rounded-full text-on-surface-variant transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 space-y-10">
        
        {/* Seletor de Tipo de Login */}
        <div className="text-center w-full space-y-6">
          <div className="flex justify-center">
            <div className="bg-surface-container-high/50 p-1.5 rounded-[24px] flex gap-1 border border-outline-variant/20 shadow-inner">
              <button 
                onClick={() => { setLoginType('producer'); setLoginError(''); }}
                className={`px-8 py-3 rounded-[18px] text-[11px] font-black uppercase tracking-[0.1em] transition-all duration-300 ${loginType === 'producer' ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105' : 'text-on-surface-variant/60 hover:text-on-surface'}`}
              >
                Produtor
              </button>
              <button 
                onClick={() => { setLoginType('admin'); setLoginError(''); }}
                className={`px-8 py-3 rounded-[18px] text-[11px] font-black uppercase tracking-[0.1em] transition-all duration-300 ${loginType === 'admin' ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105' : 'text-on-surface-variant/60 hover:text-on-surface'}`}
              >
                Admin
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="font-display text-3xl font-bold text-on-surface tracking-tight">
              {loginType === 'admin' ? 'Olá, Admin' : 'Olá, Produtor'}
            </h2>
            <p className="text-on-surface-variant text-sm font-medium opacity-80">
              {loginType === 'admin' ? 'Entre para gerenciar toda a feira.' : 'Entre para gerenciar sua banca e produtos.'}
            </p>
          </div>
        </div>

        {/* Formulário de Login */}
        <div className="w-full max-w-sm space-y-4">
          <div className="space-y-1.5">
            <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-4 mb-1">Usuário</p>
            <input type="text" placeholder="Digite seu usuário..."
              value={username} onChange={e => { setUsername(e.target.value); setLoginError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              className="w-full p-4 rounded-2xl bg-surface-container border border-outline-variant/30 text-base outline-none focus:border-primary transition-all font-medium shadow-sm" />
          </div>

          <div className="space-y-1.5">
            <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-4 mb-1">Senha</p>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} placeholder="Digite sua senha..."
                value={password} onChange={e => { setPassword(e.target.value); setLoginError(''); }}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                className="w-full p-4 rounded-2xl bg-surface-container border border-outline-variant/30 text-base outline-none focus:border-primary transition-all pr-14 font-medium shadow-sm" />
              <button onClick={() => setShowPw(!showPw)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 hover:text-primary transition-colors">
                {showPw ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>
          </div>

          {loginError && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-error/10 border border-error/20 p-3 rounded-xl text-error text-xs text-center font-bold">
              {loginError}
            </motion.div>
          )}

          <button onClick={handleLogin}
            className="w-full py-4.5 bg-primary text-white rounded-2xl font-bold text-sm uppercase tracking-[0.2em] shadow-xl shadow-primary/20 active:scale-95 transition-all mt-4">
            Entrar no Painel
          </button>
        </div>

        <div className="w-full max-sm p-5 rounded-3xl bg-surface-container-low border border-outline-variant/20 flex gap-4 items-start">
          <div className="p-2 bg-primary/5 rounded-xl"><Info size={18} className="text-primary shrink-0" /></div>
          <p className="text-xs text-on-surface-variant/80 leading-relaxed font-medium">
            O acesso é restrito a parceiros oficiais. Se você esqueceu seus dados, fale com a coordenação da feira.
          </p>
        </div>
      </div>
    </motion.div>
  );

  // ─── DASHBOARD SCREEN (PRODUCER ONLY) ───────────────────────────
  return (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }}
      transition={{ type: 'spring', damping: 28, stiffness: 280 }}
      className="fixed inset-0 z-[200] bg-surface flex flex-col md:flex-row h-screen overflow-y-auto md:overflow-hidden">

      {/* ── SIDEBAR ── */}
      <div className="w-full md:w-80 bg-surface-container-low border-b md:border-b-0 md:border-r border-outline-variant/20 flex flex-col shrink-0 md:h-full">
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <RemoteImage src={loggedProducer.image || 'https://images.unsplash.com/photo-1595033003999-ed49fe57159c?auto=format&fit=crop&q=80&w=200'}
                alt={loggedProducer.name} className="w-14 h-14 rounded-[22px] object-cover border-2 border-primary/20 shadow-md" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-surface flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              </div>
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-on-surface leading-tight">{loggedProducer.name}</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Online</span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="md:hidden p-2 bg-surface-container hover:bg-surface-container-high rounded-full text-on-surface-variant transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="px-4 py-2 space-y-1 md:flex-1 md:overflow-y-auto">
          {NAV.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button key={item.id} onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all group ${
                  isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}>
                <Icon size={20} className={isActive ? 'text-white' : 'group-hover:text-primary transition-colors'} />
                <span className="font-bold text-sm tracking-tight">{item.label}</span>
                {isActive && <ChevronRight size={16} className="ml-auto opacity-60" />}
              </button>
            );
          })}
        </nav>

        <div className="p-6 border-t border-outline-variant/10">
          <button onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-2xl text-error font-bold text-sm hover:bg-error/5 transition-colors border border-transparent hover:border-error/10">
            <LogOut size={18} />
            <span>Sair do Painel</span>
          </button>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <main className="flex-1 md:overflow-y-auto bg-surface-container-lowest/30 pb-24 md:pb-8">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">

            {activeTab === 'overview' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-[32px] border border-outline-variant/20 shadow-sm space-y-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary"><ShoppingBag size={24} /></div>
                    <div>
                      <p className="text-3xl font-display font-black text-on-surface">{myProducts.length}</p>
                      <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mt-1">Produtos Ativos</p>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-[32px] border border-outline-variant/20 shadow-sm space-y-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600"><CalendarCheck size={24} /></div>
                    <div>
                      <p className="text-3xl font-display font-black text-on-surface">{Object.values(loggedProducer.confirmedDays || {}).filter(Boolean).length}</p>
                      <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mt-1">Presenças Marcadas</p>
                    </div>
                  </div>
                </div>

                <section className="bg-white rounded-[32px] border border-outline-variant/20 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-outline-variant/10 flex items-center gap-3">
                    <CalendarCheck className="text-primary" size={20} />
                    <h3 className="font-display text-lg font-bold">Minha Presença</h3>
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-on-surface-variant mb-6 font-medium leading-relaxed">
                      Marque abaixo os dias de feira que você estará presente. Isso ajuda seus clientes a se planejarem!
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {fairSchedules.map(s => {
                        const isConfirmed = loggedProducer.confirmedDays?.[s.id];
                        return (
                          <button key={s.id} onClick={() => toggleDay(s.id)}
                            className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl border-2 transition-all active:scale-95 ${
                              isConfirmed ? 'bg-emerald-50 text-emerald-700 border-emerald-500 shadow-sm' : 'bg-surface text-on-surface-variant border-outline-variant/20 hover:border-outline-variant hover:bg-surface-container'
                            }`}>
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${isConfirmed ? 'bg-emerald-500 text-white' : 'bg-outline-variant/20 text-transparent'}`}>
                              <Check size={14} strokeWidth={4} />
                            </div>
                            <div className="text-left">
                              <p className="text-xs font-black uppercase tracking-widest leading-none mb-1">{t(`home.days.${s.day}`)}</p>
                              <p className="text-[10px] font-bold opacity-60 leading-none">{s.location || 'Feira'}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </section>
              </>
            )}

            {activeTab === 'profile' && (
              <section className="bg-white rounded-[40px] border border-outline-variant/20 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-outline-variant/10 bg-surface-container-lowest/50">
                   <h3 className="font-display text-xl font-bold flex items-center gap-3">
                    <Edit2 className="text-primary" size={22} />
                    Editar Perfil da Banca
                  </h3>
                </div>
                <div className="p-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant ml-2">Nome da Banca</label>
                        <input type="text" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })}
                          className="w-full p-4 rounded-2xl bg-surface-container border border-outline-variant/30 text-sm font-bold outline-none focus:border-primary transition-all" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant ml-2">História / Bio</label>
                        <textarea value={profile.history} onChange={e => setProfile({ ...profile, history: e.target.value })}
                          className="w-full p-4 rounded-2xl bg-surface-container border border-outline-variant/30 text-sm font-medium h-32 resize-none outline-none focus:border-primary transition-all" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant ml-2">Localização (Origem)</label>
                        <div className="relative">
                          <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
                          <input type="text" value={profile.location} onChange={e => setProfile({ ...profile, location: e.target.value })}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-surface-container border border-outline-variant/30 text-sm font-bold outline-none focus:border-primary transition-all" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <ImageUploadField label="Foto da Banca / Perfil" value={profile.image} onChange={url => setProfile({ ...profile, image: url })} aspect={1} />
                      
                      <div className="p-6 rounded-3xl bg-surface-container-low border border-outline-variant/20 space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
                          <Lock size={14} /> Segurança
                        </h4>
                        <button onClick={() => setShowChangePw(true)}
                          className="w-full py-3.5 bg-white text-on-surface border border-outline-variant/40 rounded-xl text-xs font-bold hover:bg-surface transition-colors shadow-sm">
                          Alterar Senha de Acesso
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-outline-variant/10">
                    <button onClick={saveProfile}
                      className="px-10 py-4 bg-primary text-white rounded-2xl font-bold text-sm uppercase tracking-[0.1em] shadow-xl shadow-primary/20 active:scale-95 transition-all flex items-center gap-2">
                      {profileSaved ? <Check size={18} strokeWidth={3} /> : <Check size={18} />}
                      {profileSaved ? 'Perfil Salvo!' : 'Salvar Alterações'}
                    </button>
                  </div>
                </div>
              </section>
            )}

            {activeTab === 'products' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-2xl font-bold text-on-surface">Meus Produtos</h3>
                    <p className="text-sm text-on-surface-variant font-medium mt-1">Gerencie o catálogo da sua banca</p>
                  </div>
                  <button onClick={() => { setAddingProduct(true); setEditingProductId(null); setNewProduct({ name: '', type: '', price: '', img: '' }); }}
                    className="flex items-center gap-2 bg-primary text-white px-6 py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 active:scale-95 transition-all">
                    <Plus size={20} />
                    <span>Novo Produto</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myProducts.map(p => (
                    <motion.div key={p.id} layout className="bg-white rounded-[32px] border border-outline-variant/20 shadow-sm overflow-hidden group">
                      <div className="relative h-44">
                        <RemoteImage src={p.img} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute top-3 right-3 flex gap-2">
                          <button onClick={() => { setAddingProduct(true); setEditingProductId(p.id); setNewProduct(p); }}
                            className="p-2.5 bg-white/90 backdrop-blur-md rounded-xl text-primary shadow-lg active:scale-90 transition-transform">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => removeProduct(p.id)}
                            className="p-2.5 bg-white/90 backdrop-blur-md rounded-xl text-error shadow-lg active:scale-90 transition-transform">
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="absolute bottom-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[10px] font-black uppercase tracking-widest text-primary shadow-sm">
                          {p.type}
                        </div>
                      </div>
                      <div className="p-5 space-y-1">
                        <h4 className="font-bold text-on-surface leading-tight">{p.name}</h4>
                        <p className="text-primary font-black text-sm">{p.price || 'Preço sob consulta'}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </main>

      {/* Modal Adicionar/Editar Produto */}
      <AnimatePresence>
        {addingProduct && (
          <div className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-xl rounded-[40px] p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button onClick={() => setAddingProduct(false)} className="absolute top-6 right-6 p-2 bg-surface-container rounded-full"><X size={20} /></button>
              <h3 className="font-display text-2xl font-bold mb-8 flex items-center gap-3">
                <ShoppingBag className="text-primary" size={26} />
                {editingProductId ? 'Editar Produto' : 'Novo Produto'}
              </h3>
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant ml-2">Nome do Produto</label>
                  <input type="text" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="Ex: Alface Crespa Orgânica" className="w-full p-4 rounded-2xl bg-surface-container border border-outline-variant/30 text-sm font-bold" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant ml-2">Categoria</label>
                    <input type="text" value={newProduct.type} onChange={e => setNewProduct({ ...newProduct, type: e.target.value })}
                      placeholder="Ex: Verduras" className="w-full p-4 rounded-2xl bg-surface-container border border-outline-variant/30 text-sm font-bold" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant ml-2">Preço / Unidade</label>
                    <input type="text" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                      placeholder="Ex: R$ 5,00 / un" className="w-full p-4 rounded-2xl bg-surface-container border border-outline-variant/30 text-sm font-bold" />
                  </div>
                </div>
                <ImageUploadField label="Foto do Produto" value={newProduct.img} onChange={url => setNewProduct({ ...newProduct, img: url })} aspect={4/3} />
                <button onClick={saveProduct}
                  className="w-full py-5 bg-primary text-white rounded-2xl font-bold text-sm uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all mt-4">
                  {editingProductId ? 'Atualizar Produto' : 'Adicionar ao Catálogo'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Alterar Senha */}
      <AnimatePresence>
        {showChangePw && (
          <div className="fixed inset-0 z-[400] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl relative">
              <button onClick={() => setShowChangePw(false)} className="absolute top-6 right-6 p-2 bg-surface-container rounded-full"><X size={20} /></button>
              <h3 className="font-display text-xl font-bold mb-6 flex items-center gap-3">
                <Lock className="text-primary" size={24} />
                Alterar Senha
              </h3>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant ml-2">Nova Senha</label>
                  <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)}
                    className="w-full p-4 rounded-2xl bg-surface-container border border-outline-variant/30 text-sm font-bold" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant ml-2">Confirmar Senha</label>
                  <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
                    className="w-full p-4 rounded-2xl bg-surface-container border border-outline-variant/30 text-sm font-bold" />
                </div>
                {pwError && <p className="text-error text-xs font-bold text-center">{pwError}</p>}
                <button onClick={handleChangePw}
                  className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-sm uppercase tracking-widest shadow-xl shadow-primary/20 transition-all mt-4">
                  Confirmar Nova Senha
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Alerta de Sucesso (Password) */}
      <AnimatePresence>
        {pwSaved && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[500] bg-emerald-500 text-white px-8 py-4 rounded-full font-bold shadow-2xl flex items-center gap-3">
            <Check size={20} strokeWidth={4} />
            Senha alterada com sucesso!
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};
