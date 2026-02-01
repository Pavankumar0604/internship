import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Shield, AlertCircle } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { loadRazorpay, createRazorpayOrder, openRazorpayCheckout, RazorpayResponse } from '@/lib/razorpay';
import { StudentProfile, InternshipDomain, PaymentDetails } from '@/types/enrollment';
import toast from 'react-hot-toast';

interface Step3PaymentProps {
    onNext: (payment: PaymentDetails) => void;
    onBack: () => void;
    profile: StudentProfile;
    domains: InternshipDomain[];
}

const Step3Payment: React.FC<Step3PaymentProps> = ({
    onNext,
    onBack,
    profile,
    domains,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);
    const totalAmount = domains.reduce((sum, d) => sum + d.price, 0);

    // DEBUG: Log loaded env vars (masked)
    useEffect(() => {
        console.log("DEBUG ENV:", {
            VITE_RAZORPAY_KEY_ID: import.meta.env.VITE_RAZORPAY_KEY_ID ? "Exists" : "Missing",
            ALL_ENV: import.meta.env
        });
    }, []);

    useEffect(() => {
        loadRazorpay().then((loaded) => {
            setRazorpayLoaded(loaded);
            if (!loaded) {
                toast.error('Failed to load payment gateway. Please refresh the page.');
            }
        });
    }, []);

    const handlePayment = async () => {
        if (!razorpayLoaded) {
            toast.error('Payment gateway not loaded. Please refresh the page.');
            return;
        }

        if (totalAmount <= 0) {
            toast.error('Invalid payment amount. Please select a valid course.');
            return;
        }

        setIsLoading(true);

        try {
            // Create order via Supabase Edge Function
            const receipt = `ENRL-${Date.now()}`;
            const order = await createRazorpayOrder(totalAmount, receipt);

            // Open Razorpay checkout
            openRazorpayCheckout(
                order,
                {
                    name: profile.name,
                    email: profile.email,
                    phone: profile.phone,
                },
                (response: RazorpayResponse) => {
                    // Payment successful
                    const paymentDetails: PaymentDetails = {
                        orderId: response.razorpay_order_id,
                        paymentId: response.razorpay_payment_id,
                        signature: response.razorpay_signature,
                    };
                    toast.success('Payment successful!');
                    onNext(paymentDetails);
                },
                () => {
                    // Payment dismissed
                    setIsLoading(false);
                    toast.error('Payment cancelled');
                }
            );
        } catch (error) {
            console.error('Payment error:', error);
            toast.error(error instanceof Error ? error.message : 'Payment failed. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-2xl mx-auto"
        >
            <div className="text-center mb-6">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="inline-block p-3 bg-surface rounded-xl mb-3 border border-primary-500/30"
                >
                    <CreditCard className="w-6 h-6 text-primary-500" />
                </motion.div>
                <h2 className="text-2xl font-black text-white mb-1">Payment</h2>
                <p className="text-secondary-500 text-sm">Secure your seat in the program</p>
            </div>

            {/* Enrollment Summary */}
            <Card className="p-5 mb-5">
                <h3 className="text-lg font-black text-white mb-3">Enrollment Summary</h3>

                <div className="space-y-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-secondary-500 text-sm">Student Name</p>
                            <p className="text-white font-semibold">{profile.name}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-secondary-500 text-sm">Contact</p>
                            <p className="text-white font-semibold">{profile.phone}</p>
                        </div>
                    </div>

                    <div className="border-t border-border pt-4">
                        <p className="text-secondary-500 text-sm mb-2">Selected Domains</p>
                        <div className="space-y-2">
                            {domains.map(d => (
                                <div key={d.id} className="bg-primary-50 border border-primary-100 rounded-xl p-3">
                                    <p className="text-primary-700 font-bold">{d.title}</p>
                                    <p className="text-secondary-600 text-xs">{d.subtitle}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-border pt-4">
                        <div className="flex justify-between items-center text-lg font-bold">
                            <p className="text-white">Total Payable Amount</p>
                            <p className="text-primary-600">₹{totalAmount}</p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Security Badge */}
            <div className="bg-surface border border-border rounded-xl p-3 mb-5 shadow-sm">
                <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-primary-500" />
                    <div>
                        <p className="text-white font-bold text-[13px]">Secure Payment</p>
                        <p className="text-secondary-500 text-[11px]">
                            Powered by Razorpay • 256-bit SSL Encryption
                        </p>
                    </div>
                </div>
            </div>

            {/* Payment Button */}
            <div className="flex flex-col gap-4">
                <Button
                    variant="primary"
                    size="md"
                    onClick={handlePayment}
                    isLoading={isLoading}
                    disabled={!razorpayLoaded}
                    className="w-full shadow-lg"
                >
                    {isLoading ? (
                        'Processing Payment...'
                    ) : (
                        <>
                            <CreditCard size={20} />
                            Pay ₹{totalAmount} Now
                        </>
                    )}
                </Button>

                <Button
                    variant="secondary"
                    size="md"
                    onClick={onBack}
                    disabled={isLoading}
                    className="w-full bg-surface border-border text-secondary-400 hover:text-white hover:bg-surface/80"
                >
                    ← Back to Domain Selection
                </Button>
            </div>

            {/* Payment Info */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-6 space-y-3"
            >
                <div className="flex items-start gap-2 text-secondary-500 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-secondary-400" />
                    <p>
                        You'll receive a confirmation email and WhatsApp message after successful payment
                    </p>
                </div>
                <div className="flex items-start gap-2 text-secondary-500 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-secondary-400" />
                    <p>
                        Accepted payment methods: Credit/Debit Cards, UPI, Net Banking, Wallets
                    </p>
                </div>
            </motion.div>

            {/* Starts Monday Badge */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 text-center"
            >
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-sky-500 px-6 py-3 rounded-full shadow-lg shadow-primary-500/20">
                    <span className="text-2xl">📅</span>
                    <p className="text-white font-bold">
                        New Batch Starting This Monday!
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Step3Payment;
