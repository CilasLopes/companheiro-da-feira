import React from 'react';
import { Home, ShoppingBag, Map, ClipboardList, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { useTranslation } from 'react-i18next';

export const BottomNav = ({ activeTab, setActiveTab, listCount = 0 }: { activeTab: string, setActiveTab: (tab: string) => void, listCount?: number }) => {
  const { t } = useTranslation();
  const tabs = [
    { id: 'home', icon: Home, label: t('footer.home'), gradientFrom: '#059669', gradientTo: '#34D399' },
    { id: 'market', icon: ShoppingBag, label: t('footer.market'), gradientFrom: '#EA580C', gradientTo: '#FB923C' },
    { id: 'explorar', icon: Map, label: t('footer.map'), gradientFrom: '#4D7C0F', gradientTo: '#84CC16' },
    { id: 'list', icon: ClipboardList, label: t('footer.list'), gradientFrom: '#92400E', gradientTo: '#D97706' },
  ];

  return (
    <nav className="fixed bottom-3 left-4 right-4 z-[100] flex justify-center items-center px-2 py-1.5 bg-white/20 backdrop-blur-2xl border border-white/40 rounded-[28px] shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] transition-all animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <ul className="flex items-center gap-1.5 w-full justify-around">
        {tabs.map(({ id, label, icon: Icon, gradientFrom, gradientTo }) => {
          const isActive = activeTab === id;
          
          return (
            <motion.li
              key={id}
              layout
              onClick={() => setActiveTab(id)}
              style={{ 
                '--gradient-from': gradientFrom, 
                '--gradient-to': gradientTo 
              } as React.CSSProperties}
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
              className={`relative h-[44px] flex items-center justify-center cursor-pointer rounded-full overflow-hidden ${
                isActive ? 'flex-1 max-w-[140px] shadow-none' : 'w-[44px] bg-white/60'
              }`}
            >
              {/* Sliding Gradient background when active */}
              {isActive && (
                <>
                  <motion.div
                    layoutId="activeNavBackground"
                    className="absolute inset-0 rounded-full bg-[linear-gradient(45deg,var(--gradient-from),var(--gradient-to))]"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                  <motion.div
                    layoutId="activeNavGlow"
                    className="absolute top-[5px] inset-x-2 h-full rounded-full bg-[linear-gradient(45deg,var(--gradient-from),var(--gradient-to))] blur-[12px] -z-10"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                </>
              )}

              {/* Content Container */}
              <div className="relative z-10 flex items-center justify-center w-full h-full">
                {/* Icon Wrapper for Badge */}
                <div className="relative flex-shrink-0 flex items-center justify-center">
                  <span className={`transition-all duration-300 block ${
                    isActive ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]' : 'text-stone-700/80'
                  }`}>
                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  </span>
                  
                  {id === 'list' && listCount > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg shadow-red-900/20 border-2 ${isActive ? 'border-red-400' : 'border-white'}`}
                    >
                      {listCount}
                    </motion.span>
                  )}
                </div>

                {/* Title */}
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out whitespace-nowrap ${
                    isActive ? 'max-w-[100px] ml-2 opacity-100' : 'max-w-0 ml-0 opacity-0'
                  }`}
                >
                  <span className="text-white uppercase tracking-wider text-[10px] font-black block">
                    {label}
                  </span>
                </div>
              </div>
              
              {/* Simple dot for inactive items (optional aesthetic) */}
              {!isActive && (
                <div className="absolute bottom-1 w-1 h-1 bg-gray-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </motion.li>
          );
        })}
      </ul>
    </nav>
  );
};
