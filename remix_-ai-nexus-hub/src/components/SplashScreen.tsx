import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot } from 'lucide-react';

interface SplashScreenProps {
  lang: 'en' | 'ar';
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ lang, onComplete }) => {
  const [showGreeting, setShowGreeting] = useState(false);

  useEffect(() => {
    const greetingTimer = setTimeout(() => {
      setShowGreeting(true);
    }, 500);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3000); // 3 seconds total

    return () => {
      clearTimeout(greetingTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-50 dark:bg-[#0a0f1a] overflow-hidden"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Background ambient glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] bg-blue-600/20 dark:bg-blue-600/10 rounded-full blur-[100px] animate-pulse-glow"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Robot Animation */}
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.5 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 15,
            delay: 0.1
          }}
          className="relative mb-8"
        >
          <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-30 rounded-full animate-pulse"></div>
          <div className="relative bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-2xl border border-slate-200/50 dark:border-slate-800/50">
            <motion.div
              animate={{ 
                rotate: [0, -10, 10, -10, 10, 0],
                y: [0, -5, 0]
              }}
              transition={{ 
                duration: 1.5, 
                ease: "easeInOut",
                times: [0, 0.2, 0.4, 0.6, 0.8, 1],
                repeatDelay: 1,
                repeat: Infinity
              }}
            >
              <Bot className="w-20 h-20 text-blue-600 dark:text-blue-400" />
            </motion.div>
          </div>
        </motion.div>

        {/* Greeting Text */}
        <div className="h-24 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {showGreeting && (
              <motion.div
                key="greeting"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-2">
                  {lang === 'ar' ? 'مرحباً بك في' : 'Welcome to'}
                </h1>
                <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  AI Nexus Hub
                </h2>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Loading Dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="mt-8 flex gap-2"
        >
          <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2.5 h-2.5 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2.5 h-2.5 bg-cyan-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </motion.div>
      </div>
    </motion.div>
  );
};
