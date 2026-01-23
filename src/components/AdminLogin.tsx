import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import Button from './ui/Button';
import Card from './ui/Card';

interface AdminLoginProps {
    onLogin: (password: string) => void;
    onBack: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onBack }) => {
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!password) {
            setError('Please enter the administrator password');
            return;
        }

        setIsSubmitting(true);
        // Simulate a small delay for premium feel
        await new Promise(resolve => setTimeout(resolve, 800));

        onLogin(password);
        setIsSubmitting(false);
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-secondary-50/50">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <Card className="p-8 shadow-2xl border-none relative overflow-hidden bg-white/80 backdrop-blur-xl">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 via-primary-600 to-primary-700" />
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary-50 rounded-full blur-3xl opacity-50" />
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-50 rounded-full blur-3xl opacity-50" />

                    <div className="relative z-10">
                        <div className="flex flex-col items-center mb-8">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", damping: 12 }}
                                className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600 mb-4 shadow-inner"
                            >
                                <ShieldCheck size={32} />
                            </motion.div>
                            <h2 className="text-2xl font-black text-secondary-900 tracking-tight">Admin Access</h2>
                            <p className="text-secondary-500 text-sm font-medium mt-1">Authorized personnel only</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[11px] font-black text-secondary-400 uppercase tracking-widest mb-2 ml-1">
                                        Secure Key
                                    </label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter administrator password..."
                                            className={`w-full pl-12 pr-4 py-4 bg-secondary-50 hover:bg-white border-2 border-transparent focus:border-primary-500/20 focus:bg-white rounded-2xl text-sm font-bold transition-all outline-none ${error ? 'border-rose-100 !bg-rose-50/30' : ''}`}
                                        />
                                    </div>
                                    {error && (
                                        <motion.p
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="text-rose-500 text-[11px] font-black mt-2 flex items-center gap-1 ml-1"
                                        >
                                            <AlertCircle size={12} /> {error}
                                        </motion.p>
                                    )}
                                </div>
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full !rounded-2xl py-6 !text-sm group"
                                isLoading={isSubmitting}
                            >
                                Verify Identity <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>

                            <button
                                type="button"
                                onClick={onBack}
                                className="w-full text-secondary-400 hover:text-secondary-600 text-xs font-bold transition-colors"
                            >
                                Return to Enrollment Flow
                            </button>
                        </form>
                    </div>
                </Card>

                <p className="text-center mt-8 text-secondary-400 text-[10px] font-medium uppercase tracking-[0.2em]">
                    Encrypted Session • Secure Access Protocol
                </p>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
