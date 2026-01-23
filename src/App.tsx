import { useState, useEffect, Suspense, lazy } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Hero from './components/Hero';
import ProgressBar from './components/ui/ProgressBar';
import { StepSkeleton } from './components/ui/Skeleton';
import { useMultiStep } from './hooks/useMultiStep';
import { EnrollmentData, StudentProfile, InternshipDomain, PaymentDetails } from './types/enrollment';
import { generateEnrollmentId, createEnrollment, uploadResume } from './lib/supabase';
import toast from 'react-hot-toast';

// Lazy load steps for performance
const Step1Profile = lazy(() => import('./components/Steps/Step1Profile'));
const Step2Domain = lazy(() => import('./components/Steps/Step2Domain'));
const Step3Payment = lazy(() => import('./components/Steps/Step3Payment'));
const Step4Success = lazy(() => import('./components/Steps/Step4Success'));

function App() {
    const { currentStep, nextStep, prevStep } = useMultiStep(4);
    const [enrollmentData, setEnrollmentData] = useState<EnrollmentData>({
        profile: {} as StudentProfile,
        domain: null,
        payment: null,
    });
    const [enrollmentId, setEnrollmentId] = useState<string>('');

    // Handle Step 1: Profile submission
    const handleProfileSubmit = (profile: StudentProfile) => {
        setEnrollmentData((prev) => ({ ...prev, profile }));
        nextStep();
    };

    // Handle Step 2: Domain selection
    const handleDomainSubmit = (domain: InternshipDomain) => {
        setEnrollmentData((prev) => ({ ...prev, domain }));
        nextStep();
    };

    // Handle Step 3: Payment completion
    const handlePaymentSubmit = async (payment: PaymentDetails) => {

        try {
            // Generate enrollment ID
            const newEnrollmentId = generateEnrollmentId();
            setEnrollmentId(newEnrollmentId);

            // Upload resume if provided
            let resumeUrl: string | undefined;
            if (enrollmentData.profile.resumeFile) {
                const { url } = await uploadResume(
                    enrollmentData.profile.resumeFile,
                    newEnrollmentId
                );
                resumeUrl = url;
            }

            // Create enrollment record
            await createEnrollment({
                enrollment_id: newEnrollmentId,
                name: enrollmentData.profile.name,
                email: enrollmentData.profile.email,
                phone: enrollmentData.profile.phone,
                qualification: enrollmentData.profile.qualification,
                college: enrollmentData.profile.college,
                resume_url: resumeUrl,
                domain: enrollmentData.domain?.title || '',
                razorpay_order_id: payment.orderId,
                razorpay_payment_id: payment.paymentId,
                razorpay_signature: payment.signature,
                status: 'completed',
            });

            setEnrollmentData((prev) => ({ ...prev, payment }));
            toast.success('Enrollment completed successfully!');
            nextStep();
        } catch (error) {
            console.error('Enrollment error:', error);
            toast.error('Failed to complete enrollment. Please contact support.');
        }
    };

    // Detect offline status
    useEffect(() => {
        const handleOffline = () => {
            toast.error('You are offline. Please check your internet connection.');
        };

        const handleOnline = () => {
            toast.success('Connection restored!');
        };

        window.addEventListener('offline', handleOffline);
        window.addEventListener('online', handleOnline);

        return () => {
            window.removeEventListener('offline', handleOffline);
            window.removeEventListener('online', handleOnline);
        };
    }, []);

    return (
        <div className="min-h-screen bg-secondary-50 text-secondary-800 font-sans">
            {/* Toast Notifications */}
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#1e293b',
                        color: '#fff',
                        borderRadius: '8px',
                    },
                    success: {
                        iconTheme: {
                            primary: '#0ea5e9',
                            secondary: '#fff',
                        },
                    },
                }}
            />

            {/* Header */}
            <Header />

            {/* Hero Section */}
            {currentStep === 1 && <Hero />}

            {/* Progress Bar */}
            {currentStep < 4 && (
                <ProgressBar currentStep={currentStep} totalSteps={4} seatsLeft={8} />
            )}

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 pb-16 max-w-4xl relative z-10">
                <AnimatePresence mode="wait">
                    <Suspense fallback={<StepSkeleton />}>
                        {currentStep === 1 && (
                            <Step1Profile
                                key="step1"
                                onNext={handleProfileSubmit}
                                initialData={enrollmentData.profile}
                            />
                        )}

                        {currentStep === 2 && (
                            <Step2Domain
                                key="step2"
                                onNext={handleDomainSubmit}
                                onBack={prevStep}
                                initialData={enrollmentData.domain}
                            />
                        )}

                        {currentStep === 3 && (
                            <Step3Payment
                                key="step3"
                                onNext={handlePaymentSubmit}
                                onBack={prevStep}
                                profile={enrollmentData.profile}
                                domain={enrollmentData.domain!}
                            />
                        )}

                        {currentStep === 4 && (
                            <Step4Success
                                key="step4"
                                enrollmentId={enrollmentId}
                                studentName={enrollmentData.profile.name}
                                domain={enrollmentData.domain?.title || ''}
                            />
                        )}
                    </Suspense>
                </AnimatePresence>
            </main>

            {/* Footer */}
            <footer className="border-t border-secondary-200 py-8 mt-12 bg-white">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-secondary-500 text-sm">
                        © 2026 Mind Mesh Internship Program. All rights reserved.
                    </p>
                    <p className="text-secondary-400 text-xs mt-2 flex items-center justify-center gap-1">
                        <span>Powered by</span>
                        <span className="font-bold text-secondary-600">Mind Mesh</span>
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default App;
