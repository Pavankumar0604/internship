import React from 'react';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
    return (
        <div className="relative pt-12 pb-16 overflow-hidden bg-white border-b border-secondary-100">
            {/* Background Elements - Subtle Gradients for Light Mode */}
            <div className="absolute top-0 inset-x-0 h-full overflow-hidden pointer-events-none opacity-30">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary-200/40 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-sky-200/40 rounded-full blur-[100px]" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 text-center z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="mb-6 inline-block"
                    >
                        <span className="px-4 py-1.5 rounded-full bg-primary-50 border border-primary-100 text-primary-600 text-sm font-semibold tracking-wide uppercase shadow-sm">
                            Enrollments Open for 2026 Batch
                        </span>
                    </motion.div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-secondary-900">
                        <span className="block mb-2">
                            Internship
                        </span>
                        <span className="bg-gradient-to-r from-primary-600 to-sky-500 bg-clip-text text-transparent">
                            Program
                        </span>
                    </h1>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-col items-center gap-4"
                    >
                        <div className="h-1.5 w-24 bg-primary-500 rounded-full mb-2" />
                        <p className="text-xl sm:text-2xl text-secondary-600 font-normal max-w-2xl mx-auto leading-relaxed">
                            15-Day Professional Training in UI/UX, Frontend & More
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default Hero;
