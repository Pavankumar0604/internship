import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Code, Database, Megaphone, ChevronRight } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { InternshipDomain, INTERNSHIP_DOMAINS } from '@/types/enrollment';

interface Step2DomainProps {
    onNext: (domain: InternshipDomain) => void;
    onBack: () => void;
    initialData?: InternshipDomain | null;
}

const iconMap = {
    Palette: Palette,
    Code: Code,
    Database: Database,
    Megaphone: Megaphone,
};

const Step2Domain: React.FC<Step2DomainProps> = ({
    onNext,
    onBack,
    initialData,
}) => {
    const [selectedDomain, setSelectedDomain] = useState<InternshipDomain | null>(
        initialData || null
    );
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const handleDomainSelect = (domain: InternshipDomain) => {
        setSelectedDomain(domain);
        setExpandedId(domain.id);
    };

    const handleContinue = () => {
        if (selectedDomain) {
            onNext(selectedDomain);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-5xl mx-auto"
        >
            <div className="text-center mb-8">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="inline-block p-4 bg-primary-50 rounded-2xl mb-4 border border-primary-100"
                >
                    <Code className="w-8 h-8 text-primary-500" />
                </motion.div>
                <h2 className="text-3xl font-bold text-secondary-900 mb-2">
                    Choose Your Domain
                </h2>
                <p className="text-secondary-500">
                    Select the internship track that matches your interests
                </p>
            </div>

            {/* Domain Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {INTERNSHIP_DOMAINS.map((domain, index) => {
                    const Icon = iconMap[domain.icon as keyof typeof iconMap];
                    const isSelected = selectedDomain?.id === domain.id;
                    const isExpanded = expandedId === domain.id;

                    return (
                        <motion.div
                            key={domain.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card
                                hover
                                selected={isSelected}
                                onClick={() => handleDomainSelect(domain)}
                                className="p-6 h-full"
                            >
                                <div className="flex items-start gap-4 mb-4">
                                    <div
                                        className={`
                    flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center
                    transition-all duration-300
                    ${isSelected
                                                ? 'bg-primary-50 text-primary-600 ring-2 ring-primary-100'
                                                : 'bg-secondary-50 text-secondary-400'
                                            }
                  `}
                                    >
                                        <Icon
                                            className={`w-7 h-7 ${isSelected ? 'text-primary-600' : 'text-secondary-400'
                                                }`}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className={`text-xl font-bold mb-1 ${isSelected ? 'text-primary-900' : 'text-secondary-800'}`}>
                                            {domain.title}
                                        </h3>
                                        <p className={`text-sm font-semibold ${isSelected ? 'text-primary-600' : 'text-secondary-500'}`}>
                                            {domain.subtitle}
                                        </p>
                                    </div>
                                </div>

                                {/* Features List */}
                                <AnimatePresence>
                                    {(isExpanded || isSelected) && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="space-y-2 mt-4"
                                        >
                                            <p className={`text-sm font-semibold mb-3 ${isSelected ? 'text-primary-700' : 'text-secondary-600'}`}>
                                                What you'll learn:
                                            </p>
                                            {domain.features.map((feature, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                    className="flex items-start gap-2"
                                                >
                                                    <ChevronRight className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isSelected ? 'text-primary-500' : 'text-secondary-300'}`} />
                                                    <span className={`text-sm ${isSelected ? 'text-secondary-700' : 'text-secondary-500'}`}>
                                                        {feature}
                                                    </span>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            {/* Selection Summary */}
            <AnimatePresence>
                {selectedDomain && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-primary-50 border border-primary-200 rounded-2xl p-6 mb-6"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <p className="text-secondary-800 font-semibold">Selected Domain:</p>
                        </div>
                        <p className="text-2xl font-bold text-primary-700">
                            {selectedDomain.title}
                        </p>
                        <p className="text-secondary-600 mt-1">{selectedDomain.subtitle}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex gap-4">
                <Button variant="secondary" size="lg" onClick={onBack} className="flex-1 bg-white border-secondary-200 text-secondary-700 hover:bg-secondary-50">
                    ← Back
                </Button>
                <Button
                    variant="primary"
                    size="lg"
                    onClick={handleContinue}
                    disabled={!selectedDomain}
                    className="flex-1 shadow-lg"
                >
                    Continue to Payment →
                </Button>
            </div>

            {/* Certificate Badge */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 text-center"
            >
                <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full border border-secondary-100 shadow-sm">
                    <span className="text-2xl">🏆</span>
                    <p className="text-secondary-600 text-sm">
                        <span className="font-bold text-primary-600">Certificate</span> on
                        completion
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Step2Domain;
