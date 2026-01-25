import React from 'react';
import { motion } from 'framer-motion';

export interface ProgressBarProps {
    currentStep: number;
    totalSteps: number;
    seatsLeft?: number;
    role?: 'student' | 'staff';
}

const ProgressBar: React.FC<ProgressBarProps> = ({
    currentStep,
    totalSteps,
    seatsLeft = 8,
    role = 'student',
}) => {
    const isStaff = role === 'staff';
    const progress = (currentStep / totalSteps) * 100;

    return (
        <div className="w-full py-4 bg-secondary-50 border-b border-secondary-100">
            <div className="max-w-4xl mx-auto px-4">
                {/* Step Indicators */}
                <div className="flex items-center justify-between mb-4">
                    {Array.from({ length: totalSteps }).map((_, index) => {
                        const stepNumber = index + 1;
                        const isActive = stepNumber === currentStep;
                        const isCompleted = stepNumber < currentStep;

                        return (
                            <React.Fragment key={stepNumber}>
                                <motion.div
                                    initial={false}
                                    animate={{
                                        scale: isActive ? 1.1 : 1,
                                    }}
                                    className="relative flex flex-col items-center"
                                >
                                    <div
                                        aria-label={`Step ${stepNumber}: ${isActive ? 'Current' : isCompleted ? 'Completed' : 'Upcoming'}`}
                                        className={`
                      w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm
                      transition-all duration-500 z-10
                      ${isCompleted
                                                ? 'bg-primary-500 text-white shadow-md'
                                                : isActive
                                                    ? 'bg-white text-primary-600 border-2 border-primary-500 shadow-md ring-4 ring-primary-500/10'
                                                    : 'bg-secondary-200 text-secondary-400'
                                            }
                    `}
                                    >
                                        {isCompleted ? (
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        ) : (
                                            stepNumber
                                        )}
                                    </div>
                                    <span className={`text-xs mt-2 hidden sm:block font-medium ${isActive ? 'text-primary-600' : 'text-secondary-400'}`}>
                                        {stepNumber === 1 && 'Profile'}
                                        {stepNumber === 2 && 'Domain'}
                                        {isStaff ? (
                                            stepNumber === 3 && 'Success'
                                        ) : (
                                            <>
                                                {stepNumber === 3 && 'Payment'}
                                                {stepNumber === 4 && 'Success'}
                                            </>
                                        )}
                                    </span>
                                </motion.div>
                                {index < totalSteps - 1 && (
                                    <div className="flex-1 h-1 mx-2 bg-secondary-200 rounded-full overflow-hidden relative">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{
                                                width: stepNumber < currentStep ? '100%' : '0%',
                                            }}
                                            transition={{ duration: 0.5 }}
                                            className="absolute top-0 left-0 h-full bg-primary-500"
                                        />
                                    </div>
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>

                {/* Progress percentage and seats left */}
                <div className="flex items-center justify-between text-sm">
                    <motion.div
                        key={progress}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-secondary-500 font-medium"
                    >
                        {Math.round(progress)}% Complete
                    </motion.div>
                    {!isStaff && (
                        <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="bg-red-50 px-3 py-1 rounded-full border border-red-100 items-center flex gap-1.5"
                        >
                            <span className="text-red-500 text-lg">🔥</span>
                            <span className="text-red-600 font-bold text-xs sm:text-sm">
                                Only {seatsLeft} Seats Left!
                            </span>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProgressBar;
