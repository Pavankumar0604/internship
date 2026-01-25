import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { QRCodeSVG } from 'qrcode.react';
import { CheckCircle, Copy, Download, Share2, Award, Clock, Calendar, ExternalLink, Monitor } from 'lucide-react';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

interface Step4SuccessProps {
    enrollmentId: string;
    studentName: string;
    domain: string;
    role?: 'student' | 'staff';
    meetingData?: {
        date: string;
        time: string;
        link: string;
    };
}

const Step4Success: React.FC<Step4SuccessProps> = ({
    enrollmentId,
    studentName,
    domain,
    role = 'student',
    meetingData,
}) => {
    const isStaff = role === 'staff';
    const [showConfetti, setShowConfetti] = useState(!isStaff);
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

        const timer = setTimeout(() => {
            setShowConfetti(false);
        }, 8000);

        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(timer);
        };
    }, []);

    const handleCopyEnrollmentId = () => {
        navigator.clipboard.writeText(enrollmentId);
        toast.success('Enrollment ID copied!');
    };

    const handleWhatsAppShare = () => {
        const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '9098855355';
        const message = isStaff
            ? `📄 Application Submitted! Enrollment ID: ${enrollmentId}. Waiting for approval.`
            : `🎉 I've successfully enrolled in the ${domain} internship program!\n\n📋 Enrollment ID: ${enrollmentId}\n\nLooking forward to starting this Monday! 🚀`;
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-3xl mx-auto px-4"
        >
            {!isStaff && showConfetti && (
                <Confetti
                    width={windowSize.width}
                    height={windowSize.height}
                    recycle={false}
                    numberOfPieces={600}
                    gravity={0.2}
                    colors={['#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd']}
                />
            )}

            <div className="text-center mb-10">
                <motion.div
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                        type: 'spring',
                        stiffness: 260,
                        damping: 20,
                        delay: 0.2,
                    }}
                    className="inline-block relative"
                >
                    {!isStaff ? (
                        <>
                            <div className="absolute inset-0 bg-primary-500 rounded-full blur-3xl opacity-30 animate-pulse" />
                            <div className="relative p-6 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full shadow-2xl">
                                <CheckCircle className="w-16 h-16 text-white" />
                            </div>
                        </>
                    ) : (
                        <div className="relative p-6 bg-amber-100 rounded-full shadow-xl border border-amber-200">
                            <Clock className="w-16 h-16 text-amber-600" />
                        </div>
                    )}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <h2 className="text-4xl font-black text-secondary-900 mt-6 mb-2 tracking-tight">
                        {isStaff ? 'Application Received' : 'You\'re All Set! 🎉'}
                    </h2>
                    <p className="text-secondary-500 text-lg font-medium max-w-lg mx-auto leading-relaxed">
                        {isStaff ? `Thank you, ${studentName}. We've received your application and will review it shortly.` : `Welcome to the Mind Mesh family, ${studentName}! Your journey starts here.`}
                    </p>
                </motion.div>

                {isStaff && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 }}
                        className="mt-6 inline-flex items-center gap-2 text-amber-600 font-black bg-amber-50 px-6 py-2.5 rounded-full border border-amber-100 uppercase tracking-[0.15em] text-[10px]"
                    >
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                        Awaiting Verification
                    </motion.div>
                )}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
            >
                <div className="glass p-6 sm:p-10 mb-8 rounded-[2rem] overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-700">
                        <Award className="w-48 h-48" />
                    </div>

                    <div className="grid md:grid-cols-2 gap-10 items-center">
                        <div className="space-y-8">
                            <div className="group/item">
                                <p className="text-secondary-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{isStaff ? 'Application Reference' : 'Official Enrollment ID'}</p>
                                <div className="flex items-center gap-3">
                                    <code className="text-2xl sm:text-3xl font-black text-primary-600 font-mono tracking-tighter">
                                        {enrollmentId}
                                    </code>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={handleCopyEnrollmentId}
                                        className="p-2 bg-secondary-50 rounded-xl hover:text-primary-500 transition-colors"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </motion.button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 bg-secondary-50/50 rounded-2xl border border-secondary-100/50">
                                    <p className="text-secondary-400 text-[10px] font-black uppercase tracking-widest mb-1.5">Selected Domain</p>
                                    <p className="text-lg font-black text-secondary-800">{domain}</p>
                                </div>

                                {!isStaff && (
                                    <div className="flex items-center gap-3 px-4 py-3 bg-primary-500/5 rounded-2xl border border-primary-500/10">
                                        <Award className="w-5 h-5 text-primary-500" />
                                        <div className="flex flex-col">
                                            <span className="font-black text-primary-600 text-xs uppercase tracking-tight">Verified Enrollment</span>
                                            <span className="text-[10px] text-secondary-500 font-medium">Certificate allocation initiated</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="relative p-6 bg-white rounded-[2.5rem] shadow-2xl shadow-primary-500/10 transition-transform hover:scale-105 duration-500">
                                <QRCodeSVG
                                    value={`ENROLLMENT:${enrollmentId}|NAME:${studentName}|DOMAIN:${domain}`}
                                    size={160}
                                    level="H"
                                    includeMargin={true}
                                />
                                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest whitespace-nowrap shadow-lg">
                                    Secure Passport
                                </div>
                            </div>
                            <p className="text-secondary-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-8">Digital Verification QR</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10"
            >
                <Button
                    variant="primary"
                    size="md"
                    onClick={handleWhatsAppShare}
                    className="w-full shadow-xl shadow-primary-500/10 !rounded-2xl py-4 h-auto group"
                >
                    <Share2 size={18} className="group-hover:rotate-12 transition-transform" />
                    <span className="font-black uppercase tracking-wider text-xs">{isStaff ? 'Contact Admin' : 'Share Success'}</span>
                </Button>

                {!isStaff && (
                    <Button
                        variant="secondary"
                        size="md"
                        onClick={() => toast.success('Sending receipt to your email...')}
                        className="w-full !rounded-2xl py-4 h-auto group text-secondary-800 border-secondary-100"
                    >
                        <Download size={18} className="group-hover:-translate-y-1 transition-transform" />
                        <span className="font-black uppercase tracking-wider text-xs">Receipt</span>
                    </Button>
                )}

                <Button
                    variant="secondary"
                    size="md"
                    onClick={() => {
                        window.print();
                    }}
                    className="w-full !rounded-2xl py-4 h-auto group text-secondary-800 border-secondary-100"
                >
                    <Download size={18} className="group-hover:scale-110 transition-transform" />
                    <span className="font-black uppercase tracking-wider text-xs">Print PDF</span>
                </Button>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="bg-white border border-secondary-100 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl shadow-secondary-200/50 relative overflow-hidden group"
            >
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-700">
                    <Clock className="w-40 h-40 text-secondary-900" />
                </div>

                <h3 className="text-2xl font-black text-secondary-900 mb-8 flex items-center gap-3">
                    <span className="p-2 bg-primary-50 rounded-xl">
                        <Monitor className="w-5 h-5 text-primary-500" />
                    </span>
                    Program Onboarding
                </h3>

                <div className="grid gap-6">
                    {!isStaff && meetingData && (
                        <div className="bg-primary-50/50 border border-primary-100 rounded-3xl p-6 hover:bg-primary-50 transition-colors">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="flex h-3 w-3 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500"></span>
                                </div>
                                <p className="font-black text-xs uppercase tracking-[0.3em] text-primary-600">Live Induction Link</p>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-8 mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 bg-white rounded-2xl shadow-sm">
                                        <Calendar className="w-6 h-6 text-primary-500" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-secondary-400 uppercase font-bold tracking-widest mb-0.5">Start Date</p>
                                        <p className="text-lg font-black text-secondary-800">{meetingData.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 bg-white rounded-2xl shadow-sm">
                                        <Clock className="w-6 h-6 text-primary-500" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-secondary-400 uppercase font-bold tracking-widest mb-0.5">Session Time</p>
                                        <p className="text-lg font-black text-secondary-800">{meetingData.time}</p>
                                    </div>
                                </div>
                            </div>

                            <motion.a
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                href={meetingData.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-3 w-full bg-primary-500 text-white font-black py-5 rounded-2xl hover:bg-primary-600 transition-all shadow-xl shadow-primary-500/20 uppercase tracking-widest text-xs"
                            >
                                Enter Induction Portal
                                <ExternalLink size={16} />
                            </motion.a>
                        </div>
                    )}

                    <div className="grid gap-4 mt-2">
                        {(isStaff ? [
                            "Administrator will review your profile credentials",
                            "Email confirmation will be dispatched upon status update",
                            "Access to internal tools will be provisioned post-approval"
                        ] : [
                            "Monitor your inbox for detailed program curriculum",
                            "Join the official WhatsApp community for live updates",
                            "Prepare your development environment by this Sunday"
                        ]).map((step, i) => (
                            <div key={i} className="flex items-center gap-4 group/step">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-primary-100 flex items-center justify-center text-xs font-black text-primary-500 group-hover/step:border-primary-500 group-hover/step:bg-primary-500 group-hover/step:text-white transition-all duration-300">
                                    {i + 1}
                                </div>
                                <p className="text-secondary-600 text-sm font-medium">{step}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Step4Success;
