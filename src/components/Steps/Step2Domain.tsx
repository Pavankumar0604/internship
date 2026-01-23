import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Code, Database, Zap, Info } from 'lucide-react';
import Card from '../ui/Card';
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
            className="max-w-4xl mx-auto"
        >
            <div className="text-center mb-8">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="inline-block p-3 bg-primary-50 rounded-xl mb-3 border border-primary-100"
                >
                    <Zap className="w-6 h-6 text-primary-500" />
                </motion.div>
                <h2 className="text-3xl font-black text-secondary-900 mb-1">
                    Professional Course Selection
                </h2>
                <p className="text-secondary-500 font-medium text-sm">
                    Customize your training program. You can select one or both courses.
                </p>
            </div>

            {/* Domain Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {INTERNSHIP_DOMAINS.map((domain, index) => {
                    const Icon = iconMap[domain.icon as keyof typeof iconMap];
                    const isSelected = selectedDomains.some(d => d.id === domain.id);

                    return (
                        <motion.div
                            key={domain.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative"
                        >
                            {domain.recommended && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                                    <span className="bg-gradient-to-r from-primary-500 to-sky-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                                        Best Value / Recommended
                                    </span>
                                </div>
                            )}

                            <Card
                                selected={isSelected}
                                onClick={() => toggleDomain(domain)}
                                className={`p-6 h-full transition-all duration-500 cursor-pointer border-2 relative overflow-hidden ${isSelected
                                    ? 'border-primary-500 shadow-glow'
                                    : 'border-secondary-100 hover:border-primary-200'
                                    }`}
                            >


                                <div className="flex flex-col items-center text-center gap-4 mb-6">
                                    <div className={`p-4 rounded-2xl transition-colors ${isSelected ? 'bg-primary-50 text-primary-600' : 'bg-secondary-50 text-secondary-400'
                                        }`}>
                                        <Icon className="w-10 h-10" />
                                    </div>
                                    <div>
                                        <h3 className={`text-2xl font-bold mb-1 ${isSelected ? 'text-primary-900' : 'text-secondary-800'}`}>
                                            {domain.title}
                                        </h3>
                                        <p className="text-secondary-500 font-bold text-sm">{domain.subtitle}</p>
                                    </div>
                                    <div className="text-3xl font-black text-secondary-900">
                                        ₹{domain.price}
                                    </div>
                                </div>

                                <div className="space-y-4 border-t border-secondary-50 pt-6">
                                    <p className="text-xs font-black uppercase tracking-widest text-secondary-400 mb-2">Curriculum Includes:</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {domain.subcourses?.map((sc, idx) => (
                                            <div key={idx} className="flex items-center gap-1.5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                                                <span className="text-[11px] font-bold text-secondary-600">{sc}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            {/* Selection Summary */}
            <AnimatePresence>
                {selectedDomains.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-secondary-900 rounded-2xl p-6 mb-8 text-white shadow-xl relative overflow-hidden border border-white/5"
                    >
                        <div className="absolute -top-4 -right-4 p-4 opacity-[0.03]">
                            <Info className="w-20 h-20" />
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                            <div>
                                <p className="text-primary-400 font-black uppercase tracking-widest text-[10px] mb-2">Selected Programs</p>
                                <div className="flex flex-wrap gap-2">
                                    {selectedDomains.map(d => (
                                        <span key={d.id} className="bg-white/5 px-4 py-1 rounded-lg text-xs font-black border border-white/10 uppercase tracking-tight">
                                            {d.title}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-secondary-400 font-black text-[10px] mb-1 uppercase tracking-widest text-left md:text-right">Total Payable</p>
                                <p className="text-4xl font-black text-white">₹{totalPrice}</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
                <Button
                    variant="secondary"
                    size="md"
                    onClick={onBack}
                    className="flex-1"
                >
                    Previous Step
                </Button>
                <Button
                    variant="primary"
                    size="md"
                    onClick={handleContinue}
                    disabled={selectedDomains.length === 0}
                    className="flex-1"
                >
                    Proceed to Payment →
                </Button>
            </div>
        </motion.div>
    );
};

export default Step2Domain;
