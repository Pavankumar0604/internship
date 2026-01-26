import React, { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, Clock, Monitor, Phone, ArrowRight } from 'lucide-react';
import Button from './ui/Button';

const ParticlesBackground = lazy(() => import('./ui/ParticlesBackground'));

const Hero: React.FC = () => {
    return (
        <div className="relative pt-10 pb-12 overflow-hidden bg-background transition-colors duration-300">
            {/* Dynamic Particles Background */}
            <Suspense fallback={null}>
                <ParticlesBackground />
            </Suspense>

            {/* Background Decorative Elements */}
            <div className="absolute top-0 inset-x-0 h-full overflow-hidden pointer-events-none opacity-40">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-24 -left-24 w-[600px] h-[600px] bg-primary-900/20 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, -90, 0],
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/2 -right-24 w-[500px] h-[500px] bg-red-900/10 rounded-full blur-[100px]"
                />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 z-10">
                <div className="text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4 text-white leading-tight">
                            15 Days Internship <br />
                            <span className="bg-gradient-to-r from-primary-600 via-primary-400 to-primary-600 bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent">
                                Training Program
                            </span>
                        </h1>

                        <p className="text-2xl md:text-3xl font-bold text-secondary-500 mb-6 font-sans">
                            For Students & Freshers
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-surface/60 backdrop-blur-md text-primary-500 px-6 py-2 rounded-xl inline-block border border-border shadow-sm mb-10"
                    >
                        <p className="text-sm font-bold flex items-center gap-2">
                            <span className="animate-bounce">💡</span>
                            <span>Students can select one or both courses</span>
                        </p>
                    </motion.div>

                    {/* Batch Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto mb-10">
                        {[
                            { icon: Calendar, text: "New Batch Starting This Monday", color: "text-primary-500" },
                            { icon: Clock, text: "Time: 7:00 PM – 8:00 PM", color: "text-sky-500" },
                            { icon: Monitor, text: "Mode: Online", color: "text-primary-500" }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + (i * 0.1) }}
                                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                className="flex flex-col items-center p-4 bg-surface/80 backdrop-blur-sm rounded-xl shadow-sm border border-border hover:border-primary-500/50 hover:shadow-md transition-all cursor-default group"
                            >
                                <item.icon className={`w-6 h-6 ${item.color} mb-2 group-hover:scale-110 transition-transform`} />
                                <p className="text-secondary-800 font-bold text-[10px] uppercase tracking-wider">{item.text}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Benefits Section Tag-style */}
                    <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto mb-12">
                        {[
                            "Live Project",
                            "Practical Skills",
                            "Internship Certificate",
                            "Job Ready Training"
                        ].map((benefit, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + (i * 0.1) }}
                                className="flex items-center gap-2 bg-surface/40 backdrop-blur-sm px-4 py-2 rounded-full border border-border hover:bg-surface/60 transition-colors"
                            >
                                <CheckCircle className="w-4 h-4 text-success" />
                                <span className="font-bold text-secondary-700 text-[10px] uppercase tracking-wider">{benefit}</span>
                            </motion.div>
                        ))}
                    </div>

                    <div className="flex flex-col items-center gap-6">
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={() => document.getElementById('enrollment-form')?.scrollIntoView({ behavior: 'smooth' })}
                            className="shadow-xl shadow-primary-500/20 group relative overflow-hidden h-[54px] min-w-[240px]"
                            aria-label="Start Registration Now"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2 font-black uppercase tracking-wider">
                                Start Registration Now
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Button>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="flex items-center gap-2 text-secondary-500 font-bold text-xs"
                        >
                            <div className="p-1.5 rounded-full bg-primary-100">
                                <Phone className="w-3.5 h-3.5 text-primary-600" />
                            </div>
                            <span>Questions? Call us: <a href="tel:+919098855355" className="text-primary-600 hover:underline focus:outline-none focus:ring-2 focus:ring-primary-500 rounded px-1 transition-all">+91 90988 55355</a></span>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
