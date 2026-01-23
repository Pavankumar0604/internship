import { useState, useCallback } from 'react';

export interface UseMultiStepReturn {
    currentStep: number;
    isFirstStep: boolean;
    isLastStep: boolean;
    nextStep: () => void;
    prevStep: () => void;
    goToStep: (step: number) => void;
    progress: number;
    totalSteps: number;
}

export const useMultiStep = (totalSteps: number): UseMultiStepReturn => {
    const [currentStep, setCurrentStep] = useState(1);

    const isFirstStep = currentStep === 1;
    const isLastStep = currentStep === totalSteps;
    const progress = (currentStep / totalSteps) * 100;

    const nextStep = useCallback(() => {
        setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }, [totalSteps]);

    const prevStep = useCallback(() => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    }, []);

    const goToStep = useCallback(
        (step: number) => {
            if (step >= 1 && step <= totalSteps) {
                setCurrentStep(step);
            }
        },
        [totalSteps]
    );

    return {
        currentStep,
        isFirstStep,
        isLastStep,
        nextStep,
        prevStep,
        goToStep,
        progress,
        totalSteps,
    };
};
