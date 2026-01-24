import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Code, Database, Zap, Info } from 'lucide-react';
import Button from '../ui/Button';
import { InternshipDomain, INTERNSHIP_DOMAINS } from '@/types/enrollment';

interface Step2DomainProps {
    onNext: (domains: InternshipDomain[]) => void;
    onBack: () => void;
    initialData?: InternshipDomain | null;
}

const iconMap = {
    Palette: Palette,
    Code: Code,
    Database: Database,
    Zap: Zap,
};

const Step2Domain: React.FC<Step2DomainProps> = ({
    onNext,
    onBack,
    initialData,
}) => {
    const [selectedDomains, setSelectedDomains] = useState<InternshipDomain[]>(
        initialData ? [initialData] : []
    );

    const toggleDomain = (domain: InternshipDomain) => {
        if (selectedDomains.some(d => d.id === domain.id)) {
            setSelectedDomains(selectedDomains.filter(d => d.id !== domain.id));
        } else {
            setSelectedDomains([...selectedDomains, domain]);
        }
    };

    const handleContinue = () => {
        if (selectedDomains.length > 0) {
            onNext(selectedDomains);
        }
    };

    const totalPrice = selectedDomains.reduce((sum, d) => sum + d.price, 0);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-5xl mx-auto"
        >
            <div className="text-center mb-10">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="inline-flex p-4 bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl mb-4 border border-primary-200 shadow-inner"
                >
                    <Zap className="w-8 h-8 text-primary-600" />
                </motion.div>
                <h2 className="text-4xl font-black text-secondary-900 mb-3 tracking-tight">
                    Professional Course Selection
                </h2>
                <p className="text-secondary-500 font-medium text-lg max-w-xl mx-auto leading-relaxed">
                    Customize your training program. You can select one or both courses to accelerate your career.
                </p>
            </div>

            {/* Domain Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                {INTERNSHIP_DOMAINS.map((domain, index) => {
                    const Icon = iconMap[domain.icon as keyof typeof iconMap];
                    const isSelected = selectedDomains.some(d => d.id === domain.id);

                    return (
                        <motion.div
                            key={domain.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative group"
                        >
                            {domain.recommended && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                                    <span className="bg-gradient-to-r from-primary-600 to-sky-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-primary-500/20">
                                        Best Value / Recommended
                                    </span>
                                </div>
                            )}

                            <div
                                onClick={() => toggleDomain(domain)}
                                className={`
                                    h-full relative overflow-hidden rounded-3xl transition-all duration-300 cursor-pointer
                                    ${isSelected
                                        ? 'ring-4 ring-primary-500/20 shadow-xl shadow-primary-500/10 -translate-y-1'
                                        : 'hover:-translate-y-1 hover:shadow-xl shadow-md bg-white border border-secondary-100'
                                    }
                                `}
                            >
                                {/* Background Effect for Selected State */}
                                {isSelected && (
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-primary-50 z-0" />
                                )}

                                <div className="relative z-10 p-8 flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className={`
                                            p-4 rounded-2xl transition-all duration-300
                                            ${isSelected
                                                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30 rotate-3'
                                                : 'bg-secondary-50 text-secondary-400 group-hover:bg-primary-50 group-hover:text-primary-500'
                                            }
                                        `}>
                                            <Icon className="w-8 h-8" />
                                        </div>
                                        {isSelected && (
                                            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                                                <div className="w-4 h-4 rounded-full bg-primary-500" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-6 flex-1">
                                        <h3 className={`text-2xl font-bold mb-2 ${isSelected ? 'text-primary-900' : 'text-secondary-900'}`}>
                                            {domain.title}
                                        </h3>
                                        <p className="text-secondary-500 font-medium text-sm leading-relaxed">{domain.subtitle}</p>
                                    </div>

                                    <div className="space-y-4 border-t border-secondary-200/50 pt-6">
                                        <div className="flex items-end justify-between">
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-secondary-400 mb-1">Tuition Fee</p>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-3xl font-black text-secondary-900">₹{domain.price}</span>
                                                    <span className="text-secondary-400 text-sm font-medium line-through">₹{domain.price * 2}</span>
                                                </div>
                                            </div>
                                            <p className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">50% Scholarship</p>
                                        </div>

                                        <div className="space-y-2">
                                            {domain.subcourses?.slice(0, 3).map((sc, idx) => (
                                                <div key={idx} className="flex items-center gap-2">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-primary-500' : 'bg-secondary-300'}`} />
                                                    <span className="text-xs font-bold text-secondary-600">{sc}</span>
                                                </div>
                                            ))}
                                            {domain.subcourses && domain.subcourses.length > 3 && (
                                                <p className="text-[10px] font-bold text-primary-600 pl-3.5">+ {domain.subcourses.length - 3} more modules</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Selection Summary */}
            <AnimatePresence>
                {selectedDomains.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-0 left-0 right-0 p-4 z-50 pointer-events-none"
                    >
                        <div className="max-w-3xl mx-auto bg-secondary-900/90 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-white/10 text-white pointer-events-auto flex items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="hidden md:block p-3 bg-white/10 rounded-xl">
                                    <Info className="w-6 h-6 text-primary-400" />
                                </div>
                                <div>
                                    <p className="text-secondary-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Selection</p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-2xl font-black text-white">₹{totalPrice}</p>
                                        <span className="text-xs font-medium text-secondary-400">for {selectedDomains.length} course(s)</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={onBack}
                                    className="bg-transparent border-white/20 text-white hover:bg-white/10"
                                >
                                    Back
                                </Button>
                                <Button
                                    variant="primary"
                                    size="lg"
                                    onClick={handleContinue}
                                    className="shadow-lg shadow-primary-500/20"
                                >
                                    Continue
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Empty State / Prompt (when nothing selected, show buttons normally) */}
            {selectedDomains.length === 0 && (
                <div className="flex justify-center mt-8">
                    <Button
                        variant="secondary"
                        size="md"
                        onClick={onBack}
                        className="text-secondary-500 hover:text-secondary-900"
                    >
                        Go Back
                    </Button>
                </div>
            )}
        </motion.div>
    );
};

export default Step2Domain;
