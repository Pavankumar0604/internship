import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Shield, AlertCircle, CheckCircle, Zap, ArrowRight } from 'lucide-react';
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
            className="max-w-3xl mx-auto"
        >
            <div className="text-center mb-8">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="inline-flex p-4 bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl mb-4 border border-primary-200 shadow-inner"
                >
                    <CreditCard className="w-8 h-8 text-primary-600" />
                </motion.div>
                <h2 className="text-3xl font-black text-secondary-900 mb-2">Secure Payment</h2>
                <p className="text-secondary-500 font-medium">Complete your enrollment securely via Razorpay</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Summary Column */}
                <div className="md:col-span-2 space-y-6">
                    <Card className="p-0 overflow-hidden border-secondary-200 shadow-card hover:shadow-card-hover transition-all duration-300">
                        <div className="bg-secondary-50 p-6 border-b border-secondary-100">
                            <h3 className="text-lg font-black text-secondary-900 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-primary-500" />
                                Order Summary
                            </h3>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="flex justify-between items-center group">
                                <div>
                                    <p className="text-xs font-bold text-secondary-400 uppercase tracking-wider mb-1">Student</p>
                                    <p className="text-secondary-900 font-bold text-lg">{profile.name}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-secondary-400 uppercase tracking-wider mb-1">Contact</p>
                                    <p className="text-secondary-900 font-medium font-mono">{profile.phone}</p>
                                </div>
                            </div>

                            <div className="border-t border-dashed border-secondary-200 pt-6">
                                <p className="text-xs font-bold text-secondary-400 uppercase tracking-wider mb-3">Selected Programs</p>
                                <div className="space-y-3">
                                    {domains.map(d => (
                                        <div key={d.id} className="flex justify-between items-center bg-secondary-50 p-3 rounded-xl border border-secondary-100">
                                            <div>
                                                <p className="text-secondary-900 font-bold text-sm">{d.title}</p>
                                                <p className="text-secondary-500 text-[10px]">{d.subtitle}</p>
                                            </div>
                                            <p className="text-primary-600 font-black text-sm">₹{d.price}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t border-secondary-200 pt-6 mt-6">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-secondary-500 text-sm font-medium mb-1">Total Payable Amount</p>
                                        <div className="flex items-center gap-2 text-green-600 bg-green-50 px-2 py-1 rounded-lg w-fit">
                                            <Shield size={12} />
                                            <span className="text-[10px] font-bold uppercase tracking-wide">Secure SSL Encrypted</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-4xl font-black text-secondary-900 tracking-tight">₹{totalAmount}</p>
                                        <p className="text-secondary-400 text-xs mt-1">Inclusive of all taxes</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Trust Badges */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white border border-secondary-100 rounded-xl p-4 flex items-center gap-3 shadow-sm">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                <Shield size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-secondary-900">100% Secure</p>
                                <p className="text-[10px] text-secondary-500">Bank Grade Security</p>
                            </div>
                        </div>
                        <div className="bg-white border border-secondary-100 rounded-xl p-4 flex items-center gap-3 shadow-sm">
                            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                                <CheckCircle size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-secondary-900">Trusted Platform</p>
                                <p className="text-[10px] text-secondary-500">Razorpay Verified</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Column */}
                <div className="space-y-4">
                    <div className="bg-gradient-to-br from-secondary-900 to-secondary-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <CreditCard size={100} />
                        </div>

                        <h3 className="text-lg font-bold mb-6 relative z-10">Complete Payment</h3>

                        <div className="space-y-4 relative z-10">
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={handlePayment}
                                isLoading={isLoading}
                                disabled={!razorpayLoaded}
                                className="w-full shadow-lg shadow-primary-500/20 py-4 text-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                {isLoading ? (
                                    'Processing...'
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        Pay ₹{totalAmount}
                                        <ArrowRight size={18} />
                                    </span>
                                )}
                            </Button>

                            <Button
                                variant="secondary"
                                size="md"
                                onClick={onBack}
                                disabled={isLoading}
                                className="w-full bg-white/10 border-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
                            >
                                Change Selection
                            </Button>
                        </div>

                        {!razorpayLoaded && (
                            <div className="mt-4 p-3 bg-rose-500/20 border border-rose-500/30 rounded-xl flex items-center gap-2">
                                <AlertCircle size={14} className="text-rose-400 shrink-0" />
                                <p className="text-[10px] font-medium text-rose-200">Gateway loading...</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-primary-50 rounded-xl p-4 border border-primary-100">
                        <div className="flex gap-3">
                            <div className="p-2 bg-white rounded-lg shadow-sm h-fit">
                                <Zap size={16} className="text-primary-500" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-primary-800 mb-1">Instant Access</p>
                                <p className="text-secondary-600 text-xs">
                                    Your enrollment will be confirmed immediately after payment. You will receive login details via email.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Step3Payment;
