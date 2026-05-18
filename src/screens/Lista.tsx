import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Check, Edit2, Trash2, Plus, ShoppingBasket, Send, Eraser, Save, History, Search, FileText, X } from 'lucide-react';

export const Lista = ({ items, setItems, savedLists, setSavedLists }: { items: any[], setItems: any, savedLists: any[], setSavedLists: any }) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [showSavedLists, setShowSavedLists] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({ title: '', message: '', onConfirm: () => {} });
  const [tempListName, setTempListName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [newItem, setNewItem] = useState({ name: '', desc: '', category: 'Outros' });

  const toggleItem = (id: number) => {
    setItems(items.map((item: any) => item.id === id ? { ...item, found: !item.found, bought: !item.found } : item));
  };

  const addItem = () => {
    if (!newItem.name.trim()) return;
    setItems([...items, { id: Date.now(), ...newItem, found: false, bought: false }]);
    setNewItem({ name: '', desc: '', category: 'Outros' });
    setIsEditing(false);
  };

  const deleteItem = (id: number) => {
    setItems(items.filter((item: any) => item.id !== id));
  };

  const clearList = () => {
    setConfirmConfig({
      title: 'Limpar Lista',
      message: 'Tem certeza que deseja apagar todos os itens da sua lista atual?',
      onConfirm: () => {
        setItems([]);
        setShowConfirmModal(false);
      }
    });
    setShowConfirmModal(true);
  };

  const handleSaveClick = () => {
    if (items.length === 0) return;
    setTempListName(`Lista ${new Date().toLocaleDateString('pt-BR')}`);
    setShowSaveModal(true);
  };

  const confirmSaveList = () => {
    if (!tempListName.trim()) return;

    const newList = {
      id: Date.now(),
      name: tempListName,
      date: new Date().toISOString(),
      items: [...items]
    };

    setSavedLists([newList, ...savedLists]);
    setShowSaveModal(false);
  };

  const loadSavedList = (list: any) => {
    const doLoad = () => {
      setItems(list.items);
      setShowSavedLists(false);
      setShowConfirmModal(false);
    };

    if (items.length > 0) {
      setConfirmConfig({
        title: 'Carregar Lista',
        message: `Deseja substituir sua lista atual pela lista "${list.name}"?`,
        onConfirm: doLoad
      });
      setShowConfirmModal(true);
    } else {
      doLoad();
    }
  };

  const deleteSavedList = (id: number, name: string) => {
    setConfirmConfig({
      title: 'Excluir Salva',
      message: `Tem certeza que deseja excluir permanentemente a lista "${name}"?`,
      onConfirm: () => {
        setSavedLists(savedLists.filter((l: any) => l.id !== id));
        setShowConfirmModal(false);
      }
    });
    setShowConfirmModal(true);
  };

  const filteredSavedLists = savedLists.filter((l: any) => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const shareOnWhatsApp = () => {
    if (items.length === 0) return;
    
    // Removendo emojis para garantir compatibilidade total com o sistema do usuário
    const title = "*LISTA DE COMPRAS - FEIRA VIVA*\n" + "--------------------------\n\n";
    
    const itemsList = items.map(item => {
      const icon = item.bought ? "[X]" : "[ ]";
      const name = item.bought ? `~${item.name}~` : `*${item.name}*`;
      return `${icon} ${name}${item.desc ? ` _(${item.desc})_` : ''}`;
    }).join("\n");
    
    const footer = "\n\n--------------------------\n" + "_Gerado pelo app Companheiro da Feira_";
    
    const text = encodeURIComponent(title + itemsList + footer);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const totalItems = items.length;
  const boughtItems = items.filter((i: any) => i.bought).length;
  const progress = totalItems === 0 ? 0 : (boughtItems / totalItems) * 100;

  return (
    <div className="pt-4 pb-40 space-y-6 px-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="font-display text-4xl text-primary font-bold tracking-tight">{t('list.title')}</h2>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            <p className="text-on-surface-variant text-sm font-medium">
              {t('list.status', { count: boughtItems, total: totalItems })}
            </p>
          </div>
        </div>

        {/* Botões de Ação com Labels */}
        <div className="grid grid-cols-5 gap-2 pt-2">
          <div className="flex flex-col items-center gap-1.5 text-center">
            <button 
              onClick={() => setShowSavedLists(true)}
              className="w-12 h-12 flex items-center justify-center bg-stone-100 text-stone-600 rounded-2xl active:scale-95 transition-all shadow-sm border border-stone-200/50"
            >
              <History size={20} />
            </button>
            <span className="text-[9px] font-black text-stone-500 uppercase tracking-tighter">{t('list.saved')}</span>
          </div>

          <div className="flex flex-col items-center gap-1.5 text-center">
            <button 
              onClick={handleSaveClick}
              disabled={items.length === 0}
              className={`w-12 h-12 flex items-center justify-center rounded-2xl active:scale-95 transition-all shadow-sm border ${
                items.length > 0 ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-stone-50 text-stone-300 border-stone-100 opacity-50'
              }`}
            >
              <Save size={20} />
            </button>
            <span className="text-[9px] font-black text-emerald-600 uppercase tracking-tighter">{t('list.save')}</span>
          </div>

          <div className="flex flex-col items-center gap-1.5 text-center">
            <button 
              onClick={clearList}
              disabled={items.length === 0}
              className={`w-12 h-12 flex items-center justify-center rounded-2xl active:scale-95 transition-all shadow-sm border ${
                items.length > 0 ? 'bg-red-50 text-red-600 border-red-100' : 'bg-stone-50 text-stone-300 border-stone-100 opacity-50'
              }`}
            >
              <Eraser size={20} />
            </button>
            <span className="text-[9px] font-black text-red-500 uppercase tracking-tighter">{t('list.clear')}</span>
          </div>

          <div className="flex flex-col items-center gap-1.5 text-center">
            <button 
              onClick={shareOnWhatsApp}
              disabled={items.length === 0}
              className={`w-12 h-12 flex items-center justify-center rounded-2xl active:scale-95 transition-all shadow-sm border ${
                items.length > 0 ? 'bg-[#004D40] text-white border-[#004D40]' : 'bg-stone-50 text-stone-300 border-stone-100 opacity-50'
              }`}
            >
              <svg viewBox="0 0 24 24" size={20} className="w-6 h-6 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            </button>
            <span className="text-[9px] font-black text-[#25D366] uppercase tracking-tighter">{t('list.share')}</span>
          </div>

          <div className="flex flex-col items-center gap-1.5 text-center">
            <button 
              onClick={() => setIsEditing(true)}
              className="w-12 h-12 flex items-center justify-center bg-primary text-white rounded-2xl active:scale-95 transition-all shadow-sm border border-primary"
            >
              <Plus size={20} />
            </button>
            <span className="text-[9px] font-black text-primary uppercase tracking-tighter">{t('list.new')}</span>
          </div>
      {/* Progress Bar Container - Premium Static Card */}
      <div className="bg-gradient-to-br from-emerald-50/70 to-teal-50/20 border border-emerald-100/50 p-5 rounded-[28px] shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <div>
            <span className="text-[10px] font-bold text-emerald-800/80 uppercase tracking-widest block mb-0.5">
              Status da Feira
            </span>
            <p className="text-sm text-stone-600 font-semibold">
              {boughtItems} de {totalItems} itens no carrinho
            </p>
          </div>
          <span className="text-sm font-black text-emerald-700 bg-emerald-100/60 px-3 py-1 rounded-2xl">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full bg-stone-200/40 h-3 rounded-full overflow-hidden shadow-inner relative">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full shadow-[0_1px_4px_rgba(5,150,105,0.2)]"
          />
        </div>
      </div>

      <AnimatePresence>
        {isEditing && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-surface-container-low p-4 rounded-[24px] border border-outline-variant/30 space-y-4"
          >
            <input 
              type="text" 
              placeholder="Nome do item" 
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="w-full bg-transparent border-b border-outline-variant py-2 outline-none font-medium text-primary placeholder:text-outline-variant"
            />
            <input 
              type="text" 
              placeholder="Descrição (ex: 1 dúzia)" 
              value={newItem.desc}
              onChange={(e) => setNewItem({ ...newItem, desc: e.target.value })}
              className="w-full bg-transparent border-b border-outline-variant py-2 outline-none text-sm text-on-surface-variant placeholder:text-outline-variant"
            />
            <select 
              value={newItem.category}
              onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              className="w-full bg-surface-container p-2 rounded-xl text-sm text-primary outline-none"
            >
              <option value="Frutas">Frutas</option>
              <option value="Legumes">Legumes</option>
              <option value="Mercearia">Mercearia</option>
              <option value="Outros">Outros</option>
            </select>
            <div className="flex gap-2">
              <button onClick={() => setIsEditing(false)} className="flex-1 py-3 text-on-surface-variant font-bold text-xs uppercase tracking-widest">Cancelar</button>
              <button onClick={addItem} className="flex-1 py-3 bg-primary text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg">Adicionar</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-outline-variant">
            <ShoppingBasket size={48} className="opacity-30 mb-4" />
            <p className="font-medium">{t('list.empty')}</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {items.map((item: any) => (
              <motion.div 
                layout
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-colors ${
                  item.bought ? 'bg-surface-container/50 border-transparent opacity-60' : 'bg-surface border-outline-variant/20 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-4 flex-1" onClick={() => toggleItem(item.id)}>
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center border-2 transition-colors ${
                    item.bought ? 'bg-primary border-primary text-white' : 'border-outline-variant text-transparent'
                  }`}>
                    <Check size={14} strokeWidth={3} />
                  </div>
                  <div>
                    <h4 className={`font-bold text-lg ${item.bought ? 'text-on-surface-variant line-through' : 'text-primary'}`}>{item.name}</h4>
                    <p className="text-xs text-on-surface-variant">{item.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 pl-4">
                  <button onClick={() => deleteItem(item.id)} className="p-2 text-error/70 hover:text-error hover:bg-error/10 rounded-lg transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
      {/* Modal de Confirmação (Personalizado) */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-white rounded-[32px] shadow-2xl overflow-hidden border border-white/20"
            >
              <div className="p-8 space-y-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center shadow-inner">
                    <Trash2 size={32} />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-primary">{confirmConfig.title}</h3>
                  <p className="text-sm text-on-surface-variant font-medium leading-relaxed">{confirmConfig.message}</p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={() => setShowConfirmModal(false)}
                    className="flex-1 py-4 bg-stone-100 text-stone-600 rounded-2xl font-bold active:scale-95 transition-all"
                  >
                    Não, cancelar
                  </button>
                  <button 
                    onClick={confirmConfig.onConfirm}
                    className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-bold shadow-lg shadow-red-900/20 active:scale-95 transition-all"
                  >
                    Sim, confirmar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Salvar Lista (Personalizado) */}
      <AnimatePresence>
        {showSaveModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-white rounded-[32px] shadow-2xl overflow-hidden border border-white/20"
            >
              <div className="p-8 space-y-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner">
                    <Save size={32} />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-primary">Salvar Lista</h3>
                  <p className="text-sm text-on-surface-variant font-medium">Como você quer chamar esta lista?</p>
                </div>

                <div className="relative">
                  <input 
                    autoFocus
                    type="text" 
                    value={tempListName}
                    onChange={(e) => setTempListName(e.target.value)}
                    placeholder="Nome da lista..."
                    className="w-full bg-stone-100 border-2 border-transparent focus:border-emerald-500 rounded-2xl py-4 px-6 outline-none transition-all font-bold text-primary placeholder:text-stone-400"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') confirmSaveList();
                      if (e.key === 'Escape') setShowSaveModal(false);
                    }}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={() => setShowSaveModal(false)}
                    className="flex-1 py-4 bg-stone-100 text-stone-600 rounded-2xl font-bold active:scale-95 transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={confirmSaveList}
                    className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-900/20 active:scale-95 transition-all"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Listas Salvas */}
      <AnimatePresence>
        {showSavedLists && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="w-full max-w-lg bg-surface rounded-t-[32px] sm:rounded-[32px] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
            >
              {/* Header do Modal */}
              <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center bg-stone-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                    <History size={20} />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-primary">Listas Salvas</h3>
                    <p className="text-xs text-on-surface-variant font-medium">{savedLists.length} listas encontradas</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowSavedLists(false)}
                  className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm active:scale-90 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Busca */}
              <div className="p-4 bg-stone-50/50">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant" size={18} />
                  <input 
                    type="text" 
                    placeholder="Pesquisar lista pelo nome..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-outline-variant/30 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-primary transition-colors text-sm"
                  />
                </div>
              </div>

              {/* Lista */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {filteredSavedLists.length === 0 ? (
                  <div className="py-12 flex flex-col items-center justify-center text-outline-variant text-center px-6">
                    <FileText size={48} className="opacity-20 mb-4" />
                    <p className="font-medium text-sm">Nenhuma lista salva encontrada.</p>
                    <p className="text-xs mt-1">Suas listas salvas aparecerão aqui para você reutilizar na próxima feira.</p>
                  </div>
                ) : (
                  filteredSavedLists.map((list: any) => (
                    <div 
                      key={list.id}
                      className="bg-white border border-outline-variant/20 p-4 rounded-[24px] flex items-center justify-between group hover:border-primary/30 transition-all shadow-sm"
                    >
                      <div className="flex-1 min-w-0" onClick={() => loadSavedList(list)}>
                        <h4 className="font-bold text-primary truncate">{list.name}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] text-on-surface-variant bg-stone-100 px-2 py-0.5 rounded-full font-medium">
                            {new Date(list.date).toLocaleDateString()}
                          </span>
                          <span className="text-[10px] text-primary/70 font-bold uppercase tracking-wider">
                            {list.items.length} itens
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => deleteSavedList(list.id, list.name)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                        <button 
                          onClick={() => loadSavedList(list)}
                          className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md active:scale-95 transition-all"
                        >
                          Carregar
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <div className="p-4 bg-stone-50 border-t border-stone-100">
                <p className="text-[10px] text-center text-on-surface-variant font-medium">
                  As listas são salvas apenas no seu aparelho para sua privacidade.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
