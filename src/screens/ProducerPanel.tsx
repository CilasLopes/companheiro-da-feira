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
  const [step, setStep] = useState<'login' | 'dashboard'>('login');
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
      setLoginError('Usuário ou senha incorretos. Contate o administrador.');
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

  // ─── LOGIN ───────────────────────────────────────────────
  if (step === 'login') return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-surface flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-2xl"><Store size={20} className="text-primary" /></div>
          <h1 className="font-display text-xl font-bold text-primary">Área do Produtor</h1>
        </div>
        <button onClick={onClose} className="p-2 text-on-surface-variant/60 active:scale-95 transition-transform"><X size={22} /></button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 space-y-8">
        <div className="text-center space-y-3">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Store size={40} className="text-primary" />
          </div>
          <h2 className="font-display text-2xl font-bold text-on-surface">Fazer Login</h2>
          <p className="text-on-surface-variant text-sm font-medium">Acesso restrito a administradores e produtores.</p>
          <div className="p-3 bg-primary/5 border border-primary/20 rounded-xl">
            <p className="text-xs text-primary font-bold">Usuários normais não precisam fazer login.</p>
            <p className="text-xs text-on-surface-variant mt-1">Basta fechar esta tela e navegar normalmente pelo aplicativo.</p>
          </div>
        </div>

        <div className="w-full max-w-sm space-y-3">
          <input type="text" placeholder="Usuário"
            value={username} onChange={e => { setUsername(e.target.value); setLoginError(''); }}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            className="w-full p-4 rounded-2xl bg-surface-container border border-outline-variant/30 text-base outline-none focus:border-primary transition-colors font-medium" />

          <div className="relative">
            <input type={showPw ? 'text' : 'password'} placeholder="Senha"
              value={password} onChange={e => { setPassword(e.target.value); setLoginError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              className="w-full p-4 rounded-2xl bg-surface-container border border-outline-variant/30 text-base outline-none focus:border-primary transition-colors pr-14 font-medium" />
            <button onClick={() => setShowPw(!showPw)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50">
              {showPw ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {loginError && <p className="text-error text-sm text-center font-medium">{loginError}</p>}

          <button onClick={handleLogin}
            className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-sm uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-transform">
            Entrar
          </button>
        </div>

        <div className="w-full max-w-sm p-4 rounded-2xl bg-primary/5 border border-primary/10 flex gap-3">
          <Info size={16} className="text-primary mt-0.5 shrink-0" />
          <p className="text-xs text-on-surface-variant leading-relaxed">
            As credenciais são definidas pelo administrador da feira. Caso não as saiba, entre em contato.
          </p>
        </div>
      </div>
    </motion.div>
  );

  // ─── DASHBOARD ───────────────────────────────────────────
  return (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }}
      transition={{ type: 'spring', damping: 28, stiffness: 280 }}
      className="fixed inset-0 z-[200] bg-surface flex flex-col md:flex-row h-screen">

      {/* ── SIDEBAR ── */}
      <div className="w-full md:w-72 bg-surface-container-low border-b md:border-b-0 md:border-r border-outline-variant/20 flex flex-col">
        {/* Producer identity */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <RemoteImage src={loggedProducer.image || 'https://images.unsplash.com/photo-1595033003999-ed49fe57159c?auto=format&fit=crop&q=80&w=200'}
                alt={loggedProducer.name} className="w-12 h-12 rounded-2xl object-cover border-2 border-primary/20" />
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-surface ${loggedProducer.confirmed ? 'bg-emerald-500' : 'bg-outline-variant'}`} />
            </div>
            <div>
              <p className="font-bold text-on-surface text-sm">{loggedProducer.name}</p>
              <p className="text-xs text-on-surface-variant flex items-center gap-1">
                <MapPin size={10} /> {loggedProducer.location || 'Localização'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={handleLogout} className="p-2 text-on-surface-variant/50 active:scale-95 transition-transform" title="Sair">
              <LogOut size={18} />
            </button>
            <button onClick={onClose} className="p-2 text-on-surface-variant/50 active:scale-95 transition-transform">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Per-day presence */}
        <div className="mx-4 mb-4 p-4 rounded-2xl bg-surface border border-outline-variant/20 space-y-3">
          <p className="text-xs font-black uppercase tracking-widest text-on-surface-variant">Minha Presença</p>
          {fairSchedules.length === 0 && (
            <p className="text-xs text-on-surface-variant/60 italic">Nenhum dia de feira cadastrado pelo admin.</p>
          )}
          {fairSchedules.map((day: any) => {
            const confirmed = !!(loggedProducer.confirmedDays?.[day.id]);
            return (
              <div key={day.id}
                className={`flex items-center justify-between p-3 rounded-2xl border-2 cursor-pointer transition-all ${confirmed ? 'bg-emerald-50 border-emerald-400' : 'border-outline-variant/20'}`}
                onClick={() => toggleDay(day.id)}>
                <div>
                  <p className={`text-sm font-bold ${confirmed ? 'text-emerald-700' : 'text-on-surface'}`}>
                    {t(`home.days.${day.day}`) || day.day || day.name || `Dia ${day.id}`}
                  </p>
                  {day.time && <p className="text-[10px] text-on-surface-variant">{day.time}</p>}
                  {(day.startTime || day.endTime) && (
                    <p className="text-[10px] text-on-surface-variant">{day.startTime}{day.endTime ? ` – ${day.endTime}` : ''}</p>
                  )}
                  {day.location && (
                    <p className={`text-[10px] font-semibold flex items-center gap-1 mt-0.5 ${confirmed ? 'text-emerald-600' : 'text-on-surface-variant'}`}>
                      📍 {day.location}
                    </p>
                  )}
                </div>
                <div className={`relative w-10 h-5 rounded-full transition-all ${confirmed ? 'bg-emerald-500' : 'bg-outline-variant/30'}`}>
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${confirmed ? 'right-0.5' : 'left-0.5'}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-4 pb-6 space-y-1 hidden md:block">
          {NAV.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all text-left ${activeTab === item.id ? 'bg-primary/10 text-primary' : 'text-on-surface hover:bg-surface-container-high'}`}>
              <item.icon size={18} />
              <span className="font-bold text-sm">{item.label}</span>
              {activeTab !== item.id && <ChevronRight size={14} className="ml-auto opacity-30" />}
            </button>
          ))}
        </nav>

        {/* Mobile nav tabs */}
        <div className="flex md:hidden border-t border-outline-variant/10">
          {NAV.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 font-bold transition-all ${activeTab === item.id ? 'text-primary border-t-2 border-primary -mt-px' : 'text-on-surface-variant'}`}>
              <item.icon size={16} />
              <span className="text-[9px] uppercase tracking-wider">{item.id === 'overview' ? 'Visão' : item.id === 'profile' ? 'Perfil' : 'Produtos'}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 overflow-y-auto bg-surface">
        <AnimatePresence mode="wait">

          {/* ── VISÃO GERAL ── */}
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
              className="p-6 md:p-10 space-y-8">
              <div>
                <h2 className="text-2xl font-display font-bold text-on-surface">Olá, {loggedProducer.name.split(' ')[0]}! 👋</h2>
                <p className="text-on-surface-variant text-sm">Gerencie sua barraca com facilidade.</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-3xl bg-amber-50 border border-amber-100 space-y-2">
                  <div className="w-10 h-10 bg-amber-100 rounded-2xl flex items-center justify-center">
                    <ShoppingBag size={20} className="text-amber-500" />
                  </div>
                  <p className="text-3xl font-display font-bold text-amber-700">{myProducts.length}</p>
                  <p className="text-xs font-bold text-amber-500 uppercase tracking-widest">Produtos</p>
                </div>
                <div className={`p-5 rounded-3xl border space-y-2 ${loggedProducer.confirmed ? 'bg-emerald-50 border-emerald-100' : 'bg-surface-container/40 border-outline-variant/20'}`}>
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${loggedProducer.confirmed ? 'bg-emerald-100' : 'bg-surface-container'}`}>
                    <CalendarCheck size={20} className={loggedProducer.confirmed ? 'text-emerald-500' : 'text-on-surface-variant'} />
                  </div>
                  <p className={`text-lg font-display font-bold ${loggedProducer.confirmed ? 'text-emerald-700' : 'text-on-surface-variant'}`}>
                    {loggedProducer.confirmed ? 'Confirmado' : 'Pendente'}
                  </p>
                  <p className={`text-xs font-bold uppercase tracking-widest ${loggedProducer.confirmed ? 'text-emerald-500' : 'text-on-surface-variant'}`}>Esta semana</p>
                </div>
              </div>

              {/* Profile preview */}
              <div className="rounded-3xl overflow-hidden border border-outline-variant/20">
                {loggedProducer.image && (
                  <RemoteImage src={loggedProducer.image} alt={loggedProducer.name} className="w-full h-48 object-cover" />
                )}
                {!loggedProducer.image && (
                  <div className="w-full h-48 bg-primary/5 flex flex-col items-center justify-center gap-2 text-primary/40">
                    <Camera size={32} />
                    <p className="text-sm font-medium">Adicione uma foto no seu perfil</p>
                  </div>
                )}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-display text-xl font-bold text-on-surface">{loggedProducer.name}</h3>
                    <p className="text-sm text-on-surface-variant flex items-center gap-1"><MapPin size={12} />{loggedProducer.location || 'Localização não informada'}</p>
                  </div>
                  {loggedProducer.history && (
                    <p className="text-sm text-on-surface leading-relaxed">{loggedProducer.history}</p>
                  )}
                  {Array.isArray(loggedProducer.products) && loggedProducer.products.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {loggedProducer.products.map((tag: string) => (
                        <span key={tag} className="px-3 py-1 bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-widest rounded-full">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <button onClick={() => setActiveTab('profile')}
                className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-sm uppercase tracking-widest active:scale-95 transition-transform">
                Editar Perfil
              </button>
            </motion.div>
          )}

          {/* ── PERFIL ── */}
          {activeTab === 'profile' && profile && (
            <motion.div key="profile" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
              className="p-6 md:p-10 space-y-6">
              <div>
                <h2 className="text-2xl font-display font-bold text-on-surface">Meu Perfil</h2>
                <p className="text-on-surface-variant text-sm">Informações exibidas para os clientes da feira.</p>
              </div>

              {/* Photo preview + URL */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Foto da Barraca / Produtor</label>
                {profile.image ? (
                  <div className="relative rounded-3xl overflow-hidden h-52">
                    <RemoteImage src={profile.image} alt="preview" className="w-full h-full" />
                    <button onClick={() => setProfile({ ...profile, image: '' })}
                      className="absolute top-3 right-3 p-2 bg-black/50 text-white rounded-full">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="h-52 rounded-3xl bg-primary/5 border-2 border-dashed border-primary/20 flex flex-col items-center justify-center gap-2 text-primary/40">
                    <Camera size={32} />
                    <p className="text-sm">Clique no ícone de câmera para enviar</p>
                  </div>
                )}
                <ImageUploadField 
                  label="Foto da Barraca" 
                  value={profile.image || ''} 
                  onChange={url => setProfile({ ...profile, image: url })} 
                  aspect={1}
                  targetWidth={800}
                  targetHeight={800}
                  category="Perfil"
                />
              </div>

              {/* Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Nome da Barraca / Produtor</label>
                <input type="text" placeholder="Ex: Família Silva"
                  value={profile.name || ''}
                  onChange={e => setProfile({ ...profile, name: e.target.value })}
                  className="w-full p-3 rounded-2xl bg-surface-container border border-outline-variant/30 text-sm outline-none focus:border-primary transition-colors font-medium" />
              </div>

              {/* Location */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Localização / Origem</label>
                <input type="text" placeholder="Ex: Sítio Novo Horizonte, Jundiaí"
                  value={profile.location || ''}
                  onChange={e => setProfile({ ...profile, location: e.target.value })}
                  className="w-full p-3 rounded-2xl bg-surface-container border border-outline-variant/30 text-sm outline-none focus:border-primary transition-colors" />
              </div>

              {/* History */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Nossa História</label>
                <textarea rows={5} placeholder="Conte um pouco sobre sua produção, tradição e missão..."
                  value={profile.history || ''}
                  onChange={e => setProfile({ ...profile, history: e.target.value })}
                  className="w-full p-3 rounded-2xl bg-surface-container border border-outline-variant/30 text-sm outline-none resize-none focus:border-primary transition-colors leading-relaxed" />
              </div>

              {/* Products tags */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Especialidades (separadas por vírgula)</label>
                <input type="text"
                  placeholder="Ex: Hortaliças, Ovos Caipira, Mel"
                  value={Array.isArray(profile.products) ? profile.products.join(', ') : profile.products || ''}
                  onChange={e => setProfile({ ...profile, products: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) })}
                  className="w-full p-3 rounded-2xl bg-surface-container border border-outline-variant/30 text-sm outline-none focus:border-primary transition-colors" />
                {Array.isArray(profile.products) && profile.products.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {profile.products.map((tag: string) => (
                      <span key={tag} className="px-3 py-1 bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-widest rounded-full">{tag}</span>
                    ))}
                  </div>
                )}
              </div>

              <button onClick={saveProfile}
                className={`w-full py-4 rounded-2xl font-bold text-sm uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-2 ${profileSaved ? 'bg-emerald-500 text-white' : 'bg-primary text-white shadow-lg shadow-primary/20'}`}>
                {profileSaved ? <><Check size={16} /> Salvo!</> : 'Salvar Perfil'}
              </button>

              {/* Change password */}
              <div className="pt-2 border-t border-outline-variant/20 space-y-3">
                <button onClick={() => setShowChangePw(!showChangePw)}
                  className="flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">
                  <Lock size={15} />
                  {showChangePw ? 'Cancelar troca de senha' : 'Trocar minha senha'}
                </button>
                <AnimatePresence>
                  {showChangePw && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden">
                      <div className="p-4 rounded-2xl bg-surface-container space-y-3">
                        <input type="password" placeholder="Nova senha"
                          value={newPw} onChange={e => { setNewPw(e.target.value); setPwError(''); }}
                          className="w-full p-3 rounded-xl bg-surface border border-outline-variant/30 text-sm outline-none focus:border-primary transition-colors" />
                        <input type="password" placeholder="Confirmar nova senha"
                          value={confirmPw} onChange={e => { setConfirmPw(e.target.value); setPwError(''); }}
                          className="w-full p-3 rounded-xl bg-surface border border-outline-variant/30 text-sm outline-none focus:border-primary transition-colors" />
                        {pwError && <p className="text-error text-xs font-medium">{pwError}</p>}
                        {pwSaved && <p className="text-emerald-600 text-xs font-bold">✓ Senha alterada com sucesso!</p>}
                        <button onClick={handleChangePw}
                          className="w-full py-3 bg-primary text-white rounded-xl font-bold text-xs uppercase tracking-widest active:scale-95 transition-transform">
                          Confirmar Nova Senha
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* ── PRODUTOS ── */}
          {activeTab === 'products' && (
            <motion.div key="products" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
              className="p-6 md:p-10 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-display font-bold text-on-surface">Meus Produtos</h2>
                  <p className="text-on-surface-variant text-sm">{myProducts.length} produto{myProducts.length !== 1 ? 's' : ''} cadastrado{myProducts.length !== 1 ? 's' : ''}</p>
                </div>
                <button onClick={() => {
                    if (addingProduct) {
                      setAddingProduct(false);
                      setEditingProductId(null);
                      setNewProduct({ name: '', type: '', price: '', img: '' });
                    } else {
                      setAddingProduct(true);
                    }
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-sm active:scale-95 transition-transform ${addingProduct ? 'bg-surface-container text-on-surface-variant' : 'bg-primary text-white'}`}>
                  <Plus size={16} /> {addingProduct ? 'Cancelar' : 'Novo'}
                </button>
              </div>

              {/* Add product form */}
              <AnimatePresence>
                {addingProduct && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden">
                    <div className="p-5 rounded-3xl bg-amber-50 border border-amber-100 space-y-3">
                      <h3 className="font-bold text-amber-700 text-sm">{editingProductId ? 'Editar Produto' : 'Adicionar Produto'}</h3>
                      <input type="text" placeholder="Nome do produto *"
                        value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                        className="w-full p-3 rounded-xl bg-surface border border-outline-variant/30 text-sm outline-none focus:border-amber-400 transition-colors" />
                      <div className="grid grid-cols-2 gap-2">
                        <input type="text" placeholder="Categoria"
                          value={newProduct.type} onChange={e => setNewProduct({ ...newProduct, type: e.target.value })}
                          className="w-full p-3 rounded-xl bg-surface border border-outline-variant/30 text-sm outline-none focus:border-amber-400 transition-colors" />
                        <input type="text" placeholder="Preço (R$ 5,00)"
                          value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                          className="w-full p-3 rounded-xl bg-surface border border-outline-variant/30 text-sm outline-none focus:border-amber-400 transition-colors" />
                      </div>
                      <ImageUploadField 
                        label="Foto do Produto" 
                        value={newProduct.img} 
                        onChange={url => setNewProduct({ ...newProduct, img: url })} 
                        aspect={1}
                        targetWidth={800}
                        targetHeight={800}
                        category="Produtos"
                      />
                      <button onClick={saveProduct}
                        className="w-full py-3 bg-amber-500 text-white rounded-xl font-bold text-sm active:scale-95 transition-transform flex items-center justify-center gap-2">
                        <Check size={16} /> Confirmar
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Products list */}
              {myProducts.length === 0 && !addingProduct && (
                <div className="py-16 text-center space-y-3">
                  <ShoppingBag size={48} className="mx-auto text-outline-variant opacity-30" />
                  <p className="text-on-surface-variant font-medium">Nenhum produto ainda</p>
                  <p className="text-sm text-on-surface-variant/60">Clique em "Novo" para adicionar seu primeiro produto.</p>
                </div>
              )}

              <div className="space-y-3">
                <AnimatePresence>
                  {myProducts.map(p => (
                    <motion.div key={p.id}
                      initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                      className="flex items-center gap-4 p-4 rounded-3xl bg-surface-container/40 border border-outline-variant/20">
                      {p.img ? (
                        <RemoteImage src={p.img} alt={p.name} className="w-16 h-16 rounded-2xl shrink-0" />
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0">
                          <ShoppingBag size={24} className="text-amber-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-on-surface truncate">{p.name}</p>
                        <p className="text-sm text-on-surface-variant">{p.type}</p>
                        <p className="text-sm font-bold text-primary">{p.price}</p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button onClick={() => {
                            setEditingProductId(p.id);
                            setNewProduct({ name: p.name || '', type: p.type || p.cat || '', price: p.price || '', img: p.img || p.image || '' });
                            setAddingProduct(true);
                          }}
                          className="p-2.5 text-primary/60 active:text-primary active:scale-95 transition-all">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => removeProduct(p.id)}
                          className="p-2.5 text-error/40 active:text-error active:scale-95 transition-all">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </motion.div>
  );
};
