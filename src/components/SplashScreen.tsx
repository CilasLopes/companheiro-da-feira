import React from 'react';
import { motion } from 'motion/react';
import { Store, LeafyGreen, ShoppingBasket } from 'lucide-react';

export function SplashScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] bg-emerald-600 flex flex-items-center justify-center overflow-hidden"
    >
      {/* Decorative background elements */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 90, 180, 270, 360] 
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-20 -left-20 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          rotate: [360, 270, 180, 90, 0] 
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-20 -right-20 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl"
      />

      <div className="relative flex flex-col items-center">
        {/* Animated Logo Container */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.2 
          }}
          className="w-32 h-32 bg-white rounded-[40px] shadow-2xl flex items-center justify-center relative overflow-hidden"
        >
          <motion.div
            animate={{ 
              y: [0, -5, 0],
              rotate: [0, -5, 5, 0]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-emerald-600"
          >
            <Store size={64} strokeWidth={1.5} />
          </motion.div>
          
          {/* Floating fruits/leaves around the icon */}
          <motion.div
            animate={{ x: [0, 10, 0], y: [0, -10, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            className="absolute top-4 right-4 text-emerald-400"
          >
            <LeafyGreen size={20} />
          </motion.div>
          <motion.div
            animate={{ x: [0, -8, 0], y: [0, 12, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
            className="absolute bottom-4 left-4 text-emerald-400"
          >
            <ShoppingBasket size={20} />
          </motion.div>
        </motion.div>

        {/* App Name with reveal animation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          <h1 className="text-white text-3xl font-display font-black tracking-tight mb-1">
            Companheiro <span className="text-emerald-200">da Feira</span>
          </h1>
          <div className="flex items-center justify-center gap-2">
            <motion.div 
              animate={{ width: [0, 40, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-0.5 bg-emerald-300/50 rounded-full"
            />
            <p className="text-emerald-100/80 text-sm font-medium tracking-widest uppercase">
              Sabor & Tradição
            </p>
            <motion.div 
              animate={{ width: [0, 40, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              className="h-0.5 bg-emerald-300/50 rounded-full"
            />
          </div>
        </motion.div>

        {/* Loading dots */}
        <div className="flex gap-2 mt-12">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{ 
                duration: 1, 
                repeat: Infinity, 
                delay: i * 0.2 
              }}
              className="w-2 h-2 bg-white rounded-full"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
