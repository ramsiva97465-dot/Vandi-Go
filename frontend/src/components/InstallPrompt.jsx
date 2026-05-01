import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Share } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if it's iOS
    const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(isIosDevice);

    // Listen for the Chrome/Android install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show the prompt after a short delay
      setTimeout(() => setIsVisible(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Hide if already installed
    window.addEventListener('appinstalled', () => {
      setIsVisible(false);
      setDeferredPrompt(null);
    });

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  if (!isVisible && !isIOS) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-4 right-4 z-[1000] md:left-auto md:right-6 md:w-[350px]"
        >
          <div className="bg-[#0B1E3F] text-white rounded-[32px] p-6 shadow-2xl border border-white/10 backdrop-blur-xl relative overflow-hidden">
            {/* Decorative background circle */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl" />
            
            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-4 right-4 p-1 text-white/40 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                <Download className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest">Install Vandi Go</h3>
                <p className="text-[10px] text-white/50 font-medium">Get the premium experience on your home screen</p>
              </div>
            </div>

            {isIOS ? (
              <div className="space-y-3">
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                  <div className="flex items-center gap-3 text-[11px] font-bold">
                    <span className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-[10px]">1</span>
                    Tap the <Share className="w-3.5 h-3.5 text-blue-400 inline" /> Share icon below
                  </div>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                  <div className="flex items-center gap-3 text-[11px] font-bold">
                    <span className="w-5 h-5 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 text-[10px]">2</span>
                    Select "Add to Home Screen"
                  </div>
                </div>
              </div>
            ) : (
              <button 
                onClick={handleInstallClick}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-blue-600/20 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Smartphone className="w-4 h-4" /> Install Now
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InstallPrompt;
