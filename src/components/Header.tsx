import React from 'react';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
    return (
        <header className="relative z-50 sticky top-0 transition-colors duration-300 bg-background/80 backdrop-blur-md border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
                <div className="flex items-center justify-between">

                    {/* Logo Only */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex-shrink-0"
                    >
                        <div className="relative w-40 h-16 sm:w-56 sm:h-20 transition-transform hover:scale-105 duration-300">
                            <img
                                src="/logo.png"
                                alt="Mind Mesh Logo"
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.parentElement?.classList.add('fallback-logo');
                                }}
                            />
                            <div className="hidden fallback-logo:block w-full h-full bg-gradient-to-r from-surface to-black rounded-lg flex items-center justify-center border border-white/10 shadow-inner">
                                <span className="text-white font-black text-xl tracking-tight">MIND <span className="text-primary-500">MESH</span></span>
                            </div>
                        </div>
                    </motion.div>

                    <div className="flex items-center gap-4">
                        {/* Limited Seats Badge */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <motion.div
                                animate={{
                                    scale: [1, 1.05, 1],
                                    boxShadow: [
                                        "0 0 0px rgba(235, 49, 54, 0)",
                                        "0 0 10px rgba(235, 49, 54, 0.2)",
                                        "0 0 0px rgba(235, 49, 54, 0)"
                                    ]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-primary-900/10 rounded-full border border-primary-500/20 cursor-default"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-base sm:text-lg animate-pulse">🔥</span>
                                    <span className="font-bold text-primary-500 text-xs sm:text-sm whitespace-nowrap tracking-wide uppercase">Limited Seats</span>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
