import React from 'react';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
    return (
        <header className="relative bg-white border-b border-secondary-200 z-50 sticky top-0 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
                <div className="flex items-center justify-between">

                    {/* Logo Only */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex-shrink-0"
                    >
                        <div className="relative w-32 h-12 sm:w-40 sm:h-16 transition-transform hover:scale-105 duration-300">
                            <img
                                src="/logo.png"
                                alt="Company Logo"
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.parentElement?.classList.add('fallback-logo');
                                }}
                            />
                            <div className="hidden fallback-logo:block w-full h-full bg-secondary-100 rounded-lg flex items-center justify-center border border-secondary-200">
                                <span className="text-primary-600 font-bold text-xl">LOGO</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Limited Seats Badge */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <motion.div
                            animate={{
                                scale: [1, 1.05, 1],
                                boxShadow: [
                                    "0 0 0px rgba(14, 165, 233, 0)",
                                    "0 0 10px rgba(14, 165, 233, 0.3)",
                                    "0 0 0px rgba(14, 165, 233, 0)"
                                ]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="px-4 py-2 bg-primary-50 rounded-full border border-primary-100 cursor-default"
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-lg animate-pulse">🔥</span>
                                <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
                                    <span className="font-semibold text-primary-700 text-sm whitespace-nowrap">Limited Seats</span>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </header>
    );
};

export default Header;
