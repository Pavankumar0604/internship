import React, { useState, useEffect, Suspense, lazy } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Hero from './components/Hero';
import ProgressBar from './components/ui/ProgressBar';
import { StepSkeleton } from './components/ui/Skeleton';
import { useMultiStep } from './hooks/useMultiStep';
import { EnrollmentData, StudentProfile, InternshipDomain, PaymentDetails } from './types/enrollment';
import { generateEnrollmentId, createEnrollment, uploadResume, supabase } from './lib/db';
import toast from 'react-hot-toast';

// Lazy load steps for performance
const Step1Profile = lazy(() => import('./components/Steps/Step1Profile'));
const Step2Domain = lazy(() => import('./components/Steps/Step2Domain'));
const Step3Payment = lazy(() => import('./components/Steps/Step3Payment'));
const Step4Success = lazy(() => import('./components/Steps/Step4Success'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const AdminLogin = lazy(() => import('./components/AdminLogin'));

// Component to handle chunk load errors
class LazyImportWithErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: any) {
        // Check if the error is a chunk load error
        if (error.name === 'ChunkLoadError' || error.message?.includes('Failed to fetch dynamically imported module') || error.message?.includes('Importing a module script failed')) {
            return { hasError: true };
        }
        return { hasError: false };
    }

    componentDidCatch(error: any) {
        // If it's a chunk load error, reload the page once
        if (error.name === 'ChunkLoadError' || error.message?.includes('Failed to fetch dynamically imported module') || error.message?.includes('Importing a module script failed')) {
            console.log('Chunk load error detected, reloading page...');
            window.location.reload();
        }
    }

    render() {
        if (this.state.hasError) {
            return <StepSkeleton />;
        }
        return this.props.children;
    }
}

function App() {
    const { currentStep, nextStep, prevStep } = useMultiStep(4);
    const [view, setView] = useState<'enrollment' | 'admin'>('enrollment');
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

    // Dynamic Meeting Logic
    const getNextMeetingDetails = () => {
        const now = new Date();
        const nextDate = new Date();

        // Example: Meetings are at 10:00 AM daily
        // If it's after 10:00 AM today, show tomorrow's date
        if (now.getHours() >= 10) {
            nextDate.setDate(now.getDate() + 1);
        }

        const dateString = nextDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

        return {
            date: dateString,
            time: '10:00 AM (IST)',
            link: 'https://meet.google.com/abc-defg-hij',
        };
    };

    const meetingData = getNextMeetingDetails();
    const [enrollmentData, setEnrollmentData] = useState<EnrollmentData>({
        profile: {} as StudentProfile,
        domains: [],
        payment: null,
    });
    const [enrollmentId, setEnrollmentId] = useState<string>('');

    // Handle Step 1: Profile submission
    const handleProfileSubmit = (profile: StudentProfile) => {
        setEnrollmentData((prev) => ({ ...prev, profile }));
        nextStep();
    };

    // Handle Step 2: Domain selection
    const handleDomainSubmit = async (domains: InternshipDomain[]) => {
        setEnrollmentData((prev) => ({ ...prev, domains }));

        // If Role is Staff, skip payment and submit immediately
        if (enrollmentData.profile.role === 'staff') {
            try {
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

                await createEnrollment({
                    enrollment_id: newEnrollmentId,
                    role: 'staff',
                    name: enrollmentData.profile.name,
                    email: enrollmentData.profile.email,
                    phone: enrollmentData.profile.phone,
                    qualification: enrollmentData.profile.qualification,
                    college: enrollmentData.profile.college,
                    resume_url: resumeUrl,
                    domain: domains.map(d => d.title).join(', '),
                    amount: 0,
                    status: 'waiting_approval',
                });

                // Move directly to success step
                // Find index of success step (Step 4)
                // Note: currentStep is 1-based index. 
                // Step 1: Profile, Step 2: Domain, Step 3: Payment, Step 4: Success
                // handleDomainSubmit is called at end of Step 2.
                // We want to skip Step 3 and go to Step 4.
                // But useMultiStep doesn't seem to expose setStep directly easily or we can just call nextStep twice?
                // Depending on implementation of useMultiStep. Let's assume calling nextStep moves to 3, then need to move to 4.
                // Or better, let's look at how useMultiStep works. If it just increments, strict navigation might be needed.
                // For now, let's assume we can jump or just render differently.
                // Actually, the simplest way is to let "nextStep" go to Step 3, but if we are staff, Step 3 component should redirect or we should manually manipulate state if possible.
                // But I see `nextStep` is available.
                // Let's trying calling nextStep() twice if needed, or better, change logic in render to show Step 4 if role is staff and step is 3.
                // However, I can't wait for state update in this function easily to trigger next step again.
                // Let's rely on state: if role is staff and we are on step 3 payment, auto-advance?
                // No, that causes flash.
                // Let's modify the render logic in App.tsx instead of trying to skip here. 
                // BUT, we need to create enrollment HERE if we skip payment.

                toast.success('Application submitted successfully!');
                // We need to force step to 4.
                // Since I can't see useMultiStep internal, I will assume I can call nextStep() then quickly another mechanism or just change the Render logic to render Success when currentStep is 3 AND role is staff.
                // Actually, let's look at App.tsx render logic.

            } catch (error: any) {
                console.error('Staff enrollment error details:', {
                    message: error.message,
                    details: error.details,
                    hint: error.hint,
                    code: error.code
                });
                toast.error(`Failed to submit application: ${error.message || 'Unknown error'}`);
                return; // Don't advance
            }
        }

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
            const totalAmount = enrollmentData.domains.reduce((sum, d) => sum + d.price, 0);
            await createEnrollment({
                enrollment_id: newEnrollmentId,
                role: 'student',
                name: enrollmentData.profile.name,
                email: enrollmentData.profile.email,
                phone: enrollmentData.profile.phone,
                qualification: enrollmentData.profile.qualification,
                college: enrollmentData.profile.college,
                resume_url: resumeUrl,
                domain: enrollmentData.domains.map(d => d.title).join(', '),
                razorpay_order_id: payment.orderId,
                razorpay_payment_id: payment.paymentId,
                razorpay_signature: payment.signature,
                amount: totalAmount,
                status: 'completed',
            });

            // Trigger Notification (SMS/WhatsApp)
            try {
                await supabase.functions.invoke('send-notification', {
                    body: {
                        phone: enrollmentData.profile.phone,
                        name: enrollmentData.profile.name,
                        meetingDetails: {
                            date: 'Coming Monday', // Standard start date
                            time: '10:00 AM',
                            link: 'https://meet.google.com/abc-defg-hij', // Default link
                        },
                        type: 'enrollment_confirmation'
                    }
                });
                console.log('Notification triggered successfully');
            } catch (e) {
                console.error("Notification trigger failed", e);
            }

            setEnrollmentData((prev) => ({ ...prev, payment }));
            toast.success('Enrollment completed successfully!');
            nextStep();
        } catch (error: any) {
            console.error('Enrollment error details:', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code
            });
            toast.error(`Failed to complete enrollment: ${error.message || 'Unknown error'}`);
        }
    };

    // Scroll to top on step change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentStep]);

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

    const handleAdminLogin = ({ email, password }: { email: string; password: string }) => {
        // Mock authentication logic - in a real app, use Supabase Auth
        const adminEmail = 'admin@mindmesh.com';
        const adminPassword = 'admin123';

        if (email === adminEmail && password === adminPassword) {
            setIsAdminAuthenticated(true);
            toast.success('Access Granted. Welcome back, Admin.');
        } else {
            toast.error('Invalid credentials. Access Denied.');
        }
    };

    if (view === 'admin') {
        if (!isAdminAuthenticated) {
            return (
                <div className="min-h-screen bg-secondary-50">
                    <Header />
                    <Suspense fallback={<StepSkeleton />}>
                        <AdminLogin
                            onLogin={(credentials) => handleAdminLogin(credentials)}
                            onBack={() => setView('enrollment')}
                        />
                    </Suspense>
                    <Toaster position="top-center" />
                </div>
            );
        }

        return (
            <Suspense fallback={<StepSkeleton />}>
                <AdminDashboard onBack={() => {
                    setView('enrollment');
                    setIsAdminAuthenticated(false); // Log out when leaving
                }} />
            </Suspense>
        );
    }

    return (
        <div className="min-h-screen bg-secondary-50 text-secondary-800 font-sans transition-colors duration-300">
            {/* Toast Notifications */}
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#1e293b',
                        color: '#fff',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: '500',
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
            <AnimatePresence>
                {currentStep === 1 && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Hero />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Progress Bar - Made static as per user request */}
            {currentStep < (enrollmentData.profile.role === 'staff' ? 3 : 4) && (
                <div className="px-4 pt-4 mb-8">
                    <ProgressBar
                        currentStep={currentStep}
                        totalSteps={enrollmentData.profile.role === 'staff' ? 3 : 4}
                        seatsLeft={8}
                        role={enrollmentData.profile.role}
                    />
                </div>
            )}

            {/* Main Content */}
            <main id="enrollment-form" className="container mx-auto px-4 py-8 pb-16 max-w-4xl relative z-10">
                <AnimatePresence mode="wait">
                    <Suspense fallback={<StepSkeleton />}>
                        <LazyImportWithErrorBoundary>
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
                                    initialData={enrollmentData.domains[0] || null}
                                    role={enrollmentData.profile.role}
                                />
                            )}

                            {currentStep === 3 && enrollmentData.profile.role !== 'staff' && (
                                <Step3Payment
                                    key="step3"
                                    onNext={handlePaymentSubmit}
                                    onBack={prevStep}
                                    profile={enrollmentData.profile}
                                    domains={enrollmentData.domains}
                                />
                            )}

                            {(currentStep === 4 || (currentStep === 3 && enrollmentData.profile.role === 'staff')) && (
                                <Step4Success
                                    key="step4"
                                    enrollmentId={enrollmentId}
                                    studentName={enrollmentData.profile.name}
                                    domain={enrollmentData.domains.map(d => d.title).join(', ')}
                                    role={enrollmentData.profile.role}
                                    meetingData={meetingData}
                                />
                            )}
                        </LazyImportWithErrorBoundary>
                    </Suspense>
                </AnimatePresence>
            </main>

            {/* Footer */}
            <footer className="border-t border-secondary-200 py-8 bg-white transition-colors duration-300">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-secondary-500 text-sm font-medium">
                        © 2026 Mind Mesh Internship Program. All rights reserved.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-6">
                        <button
                            onClick={() => setView('admin')}
                            className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary-300 hover:text-primary-500 transition-colors"
                        >
                            Admin Access
                        </button>
                        <div className="h-px w-8 bg-secondary-200 hidden sm:block"></div>
                        <p className="text-secondary-400 text-xs flex items-center justify-center gap-1.5 font-medium">
                            <span>Powered by</span>
                            <span className="font-bold text-secondary-600">Mind Mesh</span>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;
