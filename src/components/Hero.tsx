import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, Clock, Monitor, Phone } from 'lucide-react';
import Button from './ui/Button';

const Hero: React.FC = () => {
    return (
        <div className="relative pt-10 pb-12 overflow-hidden bg-white">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 inset-x-0 h-full overflow-hidden pointer-events-none opacity-40">
                <div className="absolute -top-12 -left-24 w-[600px] h-[600px] bg-primary-200/40 rounded-full blur-[100px]" />
                <div className="absolute top-1/2 -right-24 w-[500px] h-[500px] bg-sky-200/40 rounded-full blur-[100px]" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 z-10">
                <div className="text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-6xl font-black tracking-tight mb-4 text-secondary-900 leading-tight"
                    >
                        15 Days Internship <br />
                        <span className="bg-gradient-to-r from-primary-600 to-sky-500 bg-clip-text text-transparent">
                            Training Program
                        </span>
                    </motion.h1>

                    <p className="text-2xl md:text-3xl font-bold text-secondary-500 mb-6 font-sans">
                        For Students & Freshers
                    </p>

                    <div className="bg-primary-50/50 backdrop-blur-sm text-primary-700 px-6 py-2 rounded-xl inline-block border border-primary-100 shadow-sm mb-10">
                        <p className="text-sm font-bold flex items-center gap-2">
                            <span>💡</span>
                            <span>Students can select one or both courses</span>
                        </p>
                    </div>

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
                                transition={{ delay: 0.2 + (i * 0.1) }}
                                className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm border border-secondary-100 hover:border-primary-200 transition-colors"
                            >
                                <item.icon className={`w-6 h-6 ${item.color} mb-2`} />
                                <p className="text-secondary-800 font-bold text-xs uppercase tracking-tight">{item.text}</p>
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
                            <div key={i} className="flex items-center gap-2 bg-secondary-50/80 px-4 py-2 rounded-full border border-secondary-100">
                                <CheckCircle className="w-4 h-4 text-success" />
                                <span className="font-bold text-secondary-700 text-[10px] uppercase tracking-wider">{benefit}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        <Button
                            variant="primary"
                            size="md"
                            onClick={() => document.getElementById('enrollment-form')?.scrollIntoView({ behavior: 'smooth' })}
                            className="shadow-xl"
                        >
                            Start Registration Now
                        </Button>
                        <div className="flex items-center gap-2 text-secondary-500 font-bold text-xs">
                            <Phone className="w-4 h-4 text-primary-500" />
                            <span>Questions? Call us: +91 90988 55355</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
