import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { QRCodeSVG } from 'qrcode.react';
import { CheckCircle, Copy, Download, Share2, Award } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import toast from 'react-hot-toast';

interface Step4SuccessProps {
    enrollmentId: string;
    studentName: string;
    domain: string;
}

const Step4Success: React.FC<Step4SuccessProps> = ({
    enrollmentId,
    studentName,
    domain,
}) => {
    const [showConfetti, setShowConfetti] = useState(true);
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);

        // Stop confetti after 5 seconds
        const timer = setTimeout(() => {
            setShowConfetti(false);
        }, 5000);

        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(timer);
        };
    }, []);

    const handleCopyEnrollmentId = () => {
        navigator.clipboard.writeText(enrollmentId);
        toast.success('Enrollment ID copied to clipboard!');
    };

    const handleWhatsAppShare = () => {
        const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '9098855355';
        const message = `🎉 I've successfully enrolled in the ${domain} internship program!\n\n📋 Enrollment ID: ${enrollmentId}\n\nLooking forward to starting this Monday! 🚀`;
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    const handleDownloadReceipt = () => {
        toast.success('Receipt download will be available via email shortly!');
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="max-w-3xl mx-auto"
        >
            {/* Confetti */}
            {showConfetti && (
                <Confetti
                    width={windowSize.width}
                    height={windowSize.height}
                    recycle={false}
                    numberOfPieces={500}
                    gravity={0.3}
                />
            )}

            {/* Success Icon */}
            <div className="text-center mb-8">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                        type: 'spring',
                        stiffness: 200,
                        delay: 0.2,
                    }}
                    className="inline-block relative"
                >
                    <div className="absolute inset-0 bg-green-500 rounded-full blur-2xl opacity-20 animate-pulse" />
                    <div className="relative p-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-lg">
                        <CheckCircle className="w-16 h-16 text-white" />
                    </div>
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-4xl font-bold text-secondary-900 mt-6 mb-2"
                >
                    Enrollment Successful! 🎉
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-secondary-500 text-lg"
                >
                    Welcome aboard, {studentName}!
                </motion.p>
            </div>

            {/* Enrollment Details Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
            >
                <Card className="p-8 mb-6 bg-white border-secondary-100 shadow-xl">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Left: Details */}
                        <div className="space-y-6">
                            <div>
                                <p className="text-secondary-500 text-sm mb-2">Enrollment ID</p>
                                <div className="flex items-center gap-2">
                                    <code className="text-2xl font-bold text-primary-600 font-mono">
                                        {enrollmentId}
                                    </code>
                                    <button
                                        onClick={handleCopyEnrollmentId}
                                        className="p-2 hover:bg-secondary-50 rounded-lg transition-colors"
                                        title="Copy to clipboard"
                                    >
                                        <Copy className="w-5 h-5 text-secondary-400 hover:text-primary-500" />
                                    </button>
                                </div>
                            </div>

                            <div>
                                <p className="text-secondary-500 text-sm mb-2">Selected Domain</p>
                                <div className="bg-primary-50 border border-primary-100 rounded-xl p-4">
                                    <p className="text-primary-700 font-bold text-lg">{domain}</p>
                                </div>
                            </div>

                            <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                                <div className="flex items-center gap-2 text-green-600">
                                    <Award className="w-5 h-5" />
                                    <p className="font-semibold">Certificate Guaranteed</p>
                                </div>
                                <p className="text-green-600/80 text-sm mt-1">
                                    Complete the program to receive your certificate
                                </p>
                            </div>
                        </div>

                        {/* Right: QR Code */}
                        <div className="flex flex-col items-center justify-center">
                            <p className="text-secondary-500 text-sm mb-4">Scan for Verification</p>
                            <div className="bg-white p-4 rounded-2xl shadow-lg border border-secondary-100">
                                <QRCodeSVG
                                    value={`ENROLLMENT:${enrollmentId}|NAME:${studentName}|DOMAIN:${domain}`}
                                    size={180}
                                    level="H"
                                    includeMargin={false}
                                />
                            </div>
                            <p className="text-secondary-400 text-xs mt-3">Enrollment QR Code</p>
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
            >
                <Button
                    variant="primary"
                    size="md"
                    onClick={handleWhatsAppShare}
                    className="w-full bg-[#25D366] hover:bg-[#128C7E] shadow-none"
                    style={{ background: '#25D366' }} // Force WhatsApp color
                >
                    <Share2 size={18} />
                    WhatsApp
                </Button>
                <Button
                    variant="secondary"
                    size="md"
                    onClick={handleDownloadReceipt}
                    className="w-full"
                >
                    <Download size={18} />
                    Receipt
                </Button>
                <Button
                    variant="secondary"
                    size="md"
                    onClick={handleCopyEnrollmentId}
                    className="w-full"
                >
                    <Copy size={18} />
                    Copy ID
                </Button>
            </motion.div>

            {/* Next Steps */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="bg-secondary-50 border border-secondary-200 rounded-2xl p-6"
            >
                <h3 className="text-xl font-bold text-secondary-900 mb-4">📋 What's Next?</h3>
                <div className="space-y-3">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            1
                        </div>
                        <p className="text-secondary-600">
                            Check your email for enrollment confirmation and program details
                        </p>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            2
                        </div>
                        <p className="text-secondary-600">
                            Join our WhatsApp group for updates and announcements
                        </p>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            3
                        </div>
                        <p className="text-secondary-600">
                            Prepare for the program starting this Monday!
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Social Proof */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="mt-8 text-center"
            >
                <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-sm border border-secondary-100">
                    <span className="text-2xl">🎓</span>
                    <p className="text-secondary-600 font-medium">
                        You're now part of <span className="text-primary-600 font-bold">500+</span> certified students!
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Step4Success;
