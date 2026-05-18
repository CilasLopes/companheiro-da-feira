import React, { useState } from 'react';
import { motion } from 'motion/react';
import { RefreshCw } from 'lucide-react';

export const PullToRefresh = ({ children, onRefresh }: { children: React.ReactNode, onRefresh: () => Promise<void> }) => {
  const [startY, setStartY] = useState(0);
  const [pulling, setPulling] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [distance, setDistance] = useState(0);
  const MAX_DISTANCE = 120;
  const THRESHOLD = 80;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY <= 0) {
      setStartY(e.touches[0].clientY);
      setPulling(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!pulling || refreshing) return;
    const y = e.touches[0].clientY;
    const diff = y - startY;
    
    // Only pull down
    if (diff > 0) {
      // Add friction to make pulling feel heavier
      const resistance = diff * 0.4;
      setDistance(Math.min(resistance, MAX_DISTANCE));
    } else {
      setDistance(0);
      setPulling(false); // Cancel if scrolling up
    }
  };

  const handleTouchEnd = async () => {
    if (!pulling || refreshing) return;
    setPulling(false);
    
    if (distance > THRESHOLD) {
      setRefreshing(true);
      if (navigator.vibrate) navigator.vibrate(50);
      await onRefresh();
      setRefreshing(false);
    }
    setDistance(0);
  };

  return (
    <div 
      className="relative w-full h-full min-h-screen"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        className="fixed top-0 left-0 right-0 flex justify-center items-start pt-10 overflow-hidden z-0 pointer-events-none"
        style={{ 
          opacity: refreshing ? 1 : distance / MAX_DISTANCE 
        }}
      >
        <motion.div 
          animate={{ 
            rotate: refreshing ? 360 : distance * 2,
            y: refreshing ? 20 : (distance > 0 ? (distance - 40) : -40)
          }}
          transition={refreshing ? { repeat: Infinity, duration: 1, ease: "linear" } : { type: "spring", stiffness: 300, damping: 20 }}
          className="text-primary bg-white/90 backdrop-blur-md p-2.5 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-white"
        >
          <RefreshCw size={22} strokeWidth={2.5} />
        </motion.div>
      </div>
      <motion.div 
        animate={{ y: refreshing ? 60 : distance }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        transformTemplate={(props, generated) => (!refreshing && distance === 0) ? 'none' : generated}
        className="w-full relative z-10 bg-surface min-h-screen"
        style={{ willChange: (!refreshing && distance === 0) ? 'auto' : 'transform' }}
      >
        {children}
      </motion.div>
    </div>
  );
};
