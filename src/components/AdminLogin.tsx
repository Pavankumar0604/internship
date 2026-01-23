import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, ChevronLeft } from 'lucide-react';
import Button from './ui/Button';

interface AdminLoginProps {
    onLogin: (credentials: { email: string; password: string }) => void;
    onBack: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onBack }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please provide both administrator credentials');
            return;
        }

        setIsSubmitting(true);
        // Premium artificial delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        onLogin({ email, password });
        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-[#f8fafc]">
            {/* Unique Mesh Background Effect */}
            <div className="absolute inset-0 z-0 opacity-40">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="mesh-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#mesh-grid)" />
                </svg>
                {/* Animated Gradient Orbs for depth */}
                <motion.div
                    animate={{
                        x: [0, 50, 0],
                        y: [0, 30, 0],
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[10%] left-[15%] w-[400px] h-[400px] bg-primary-100/50 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{
                        x: [0, -40, 0],
                        y: [0, 50, 0],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-blue-50/60 rounded-full blur-[120px]"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[380px] relative z-10"
            >
                {/* Header Section Removed - Button relocated */}

                <div className="relative">
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl rounded-3xl shadow-2xl border border-white/50 -rotate-1 scale-[1.02] z-0" />

                    <div className="relative bg-white/80 backdrop-blur-2xl border border-white p-8 rounded-3xl shadow-xl z-10">
                        {/* Branding */}
                        <div className="flex flex-col items-center mb-6">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", damping: 15 }}
                                className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-200 mb-4"
                            >
                                <ShieldCheck size={28} />
                            </motion.div>
                            <h2 className="text-2xl font-black text-secondary-900 tracking-tight">Admin</h2>
                            <p className="text-secondary-500 text-xs font-semibold mt-1">Authorized Access Protocol</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-4">
                                {/* Email Field */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-secondary-400 uppercase tracking-widest ml-1">
                                        Email Address
                                    </label>
                                    <div className="relative group/input">
                                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-300 group-focus-within/input:text-primary-500 transition-colors" size={16} />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="admin@mindmesh.com"
                                            className="w-full pl-10 pr-4 py-3 bg-secondary-50 hover:bg-white focus:bg-white border text-sm border-transparent focus:border-primary-100 rounded-xl text-secondary-900 font-bold transition-all outline-none placeholder:text-secondary-300"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-secondary-400 uppercase tracking-widest ml-1">
                                        Password
                                    </label>
                                    <div className="relative group/input">
                                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-300 group-focus-within/input:text-primary-500 transition-colors" size={16} />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••••••"
                                            className="w-full pl-10 pr-4 py-3 bg-secondary-50 hover:bg-white focus:bg-white border text-sm border-transparent focus:border-primary-100 rounded-xl text-secondary-900 font-bold transition-all outline-none placeholder:text-secondary-300"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </div>
                            </div>

                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="bg-rose-50 rounded-xl p-3 flex items-center gap-2 border border-rose-100"
                                    >
                                        <AlertCircle className="text-rose-500 shrink-0" size={14} />
                                        <p className="text-rose-600 text-[10px] font-black uppercase tracking-tight">{error}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <motion.div
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                            >
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="w-full !rounded-xl py-3.5 !text-xs group shadow-lg"
                                    isLoading={isSubmitting}
                                >
                                    Launch Control Panel
                                    <ArrowRight size={16} className="ml-2 group-hover:translate-x-1.5 transition-transform" />
                                </Button>
                            </motion.div>

                            <div className="text-center mt-2">
                                <motion.button
                                    type="button"
                                    onClick={onBack}
                                    className="text-secondary-400 hover:text-primary-600 text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 mx-auto"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <ChevronLeft size={12} />
                                    Return to Enrollment
                                </motion.button>
                            </div>
                        </form>
                    </div>
                </div>

                <p className="text-center mt-8 text-secondary-300 text-[10px] font-black uppercase tracking-[0.4em]">
                    Mind Mesh Internship
                </p>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
