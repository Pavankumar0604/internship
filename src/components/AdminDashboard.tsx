import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Download,
    ArrowLeft,
    ExternalLink,
    TrendingUp,
    Clock,
    UserCheck,
    AlertCircle,
    ChevronRight,
    Search as SearchIcon,
    RefreshCw,
    Users,
    CreditCard,
    HandCoins,
    LayoutDashboard
} from 'lucide-react';
import { getAllEnrollments, getDashboardStats, getRazorpayData } from '../lib/admin';
import Skeleton from './ui/Skeleton';
import Button from './ui/Button';
import Card from './ui/Card';
import toast from 'react-hot-toast';

interface AdminDashboardProps {
    onBack: () => void;
}

import { updateEnrollmentStatus } from '../lib/db';
// ... existing imports

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
    const [enrollments, setEnrollments] = useState<any[]>([]);
    const [rzpPayments, setRzpPayments] = useState<any[]>([]);
    const [rzpSettlements, setRzpSettlements] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [activeTab, setActiveTab] = useState<'enrollments' | 'staff-approvals' | 'razorpay-payments' | 'razorpay-settlements'>('enrollments');

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'enrollments' || activeTab === 'staff-approvals') {
                const [data, dashboardStats] = await Promise.all([
                    getAllEnrollments(),
                    getDashboardStats()
                ]);
                setEnrollments(data);
                setStats(dashboardStats);
            } else if (activeTab === 'razorpay-payments') {
                const data = await getRazorpayData('payments');
                setRzpPayments(data.items || []);
            } else if (activeTab === 'razorpay-settlements') {
                const data = await getRazorpayData('settlements');
                setRzpSettlements(data.items || []);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast.error('Failed to load data. Ensure Edge Functions are deployed and keys are set.');
        } finally {
            setLoading(false);
        }
    };

    const handleApproval = async (id: string, status: 'approved' | 'rejected') => {
        try {
            await updateEnrollmentStatus(id, status, 'admin-user'); // Mock admin ID
            toast.success(`Staff application ${status} successfully`);
            fetchData();
        } catch (error) {
            console.error('Approval error:', error);
            toast.error('Failed to update status');
        }
    };

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const filteredEnrollments = enrollments.filter(e => {
        const matchesSearch =
            e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (e.email && e.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
            e.enrollment_id.toLowerCase().includes(searchQuery.toLowerCase());

        // For Staff Approvals, filter only 'waiting_approval' and 'staff' role
        if (activeTab === 'staff-approvals') {
            return matchesSearch && e.role === 'staff' && e.status === 'waiting_approval';
        }

        // For Enrollments tab, show students by default or everything except waiting staff?
        // Let's filter based on statusFilter, but maybe exclude 'waiting_approval' from main view if desired?
        // Let's keep existing logic but add role check if needed.
        const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
            case 'verified':
            case 'paid':
            case 'approved':
                return 'bg-primary-50 text-primary-600 border-primary-100';
            case 'pending':
            case 'waiting_approval':
                return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'rejected':
                return 'bg-rose-50 text-rose-600 border-rose-100';
            default:
                return 'bg-secondary-50 text-secondary-600 border-secondary-100';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-background pb-12"
        >
            {/* Header Code Omitted for Brevity - Keeping Wrapper */}
            {/* Premium Admin Header */}
            <div className="sticky top-0 z-50">
                <div className="absolute inset-0 bg-background/80 backdrop-blur-2xl border-b border-border shadow-sm" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <motion.button
                                whileHover={{ scale: 1.05, x: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={onBack}
                                className="group flex items-center justify-center p-2.5 bg-surface border border-border hover:border-primary-500/50 hover:bg-primary-500/10 rounded-2xl text-secondary-400 hover:text-primary-500 transition-all shadow-sm"
                            >
                                <ArrowLeft size={20} />
                            </motion.button>

                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-primary-500/20">
                                    <LayoutDashboard size={18} />
                                </div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-lg font-black text-white tracking-tight">Admin Console</h1>
                                    <div className="flex items-center bg-primary-900/30 px-2 py-0.5 rounded-full border border-primary-500/30">
                                        <span className="flex h-1.5 w-1.5 relative">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary-500"></span>
                                        </span>
                                        <span className="ml-1.5 text-[9px] font-black text-primary-600 uppercase tracking-widest">Live</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={fetchData}
                                    className="!rounded-xl border-secondary-100 !p-2 px-3 hover:!bg-white group"
                                >
                                    <RefreshCw size={14} className={`${loading ? 'animate-spin' : ''} text-secondary-500 group-hover:text-primary-500`} />
                                </Button>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={onBack}
                                    className="!rounded-xl !px-5 !h-9 shadow-md shadow-primary-500/10 group"
                                >
                                    <div className="flex items-center gap-2 text-xs">
                                        <span>View Site</span>
                                        <ExternalLink size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                    </div>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {/* Using the same stats array from original file */}
                    {[
                        {
                            label: 'Total Revenue',
                            value: `₹${stats?.totalRevenue?.toLocaleString() || 0}`,
                            icon: TrendingUp,
                            color: 'from-blue-500 to-indigo-600',
                            sub: 'Lifetime earnings'
                        },
                        {
                            label: 'Enrollments',
                            value: stats?.totalEnrollments || 0,
                            icon: Users,
                            color: 'from-primary-400 to-primary-600',
                            sub: 'Total registrations'
                        },
                        {
                            label: 'Verified Students',
                            value: stats?.completedEnrollments || 0,
                            icon: UserCheck,
                            color: 'from-sky-400 to-blue-600',
                            sub: 'Ready to start'
                        },
                        {
                            label: 'Pending Actions',
                            value: stats?.pendingPayments || 0, // Could add pending staff approvals here
                            icon: Clock,
                            color: 'from-amber-400 to-orange-500',
                            sub: 'Awaiting payment/approval'
                        }
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="p-0 overflow-hidden border-none shadow-card hover:shadow-card-hover transition-all group">
                                <div className={`h-1.5 bg-gradient-to-r ${stat.color}`} />
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.color} text-white shadow-lg shadow-blue-500/20`}>
                                            <stat.icon size={22} />
                                        </div>
                                        <div className="flex flex-col items-end text-right">
                                            <p className="text-secondary-400 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
                                            <h3 className="text-2xl font-black text-secondary-900 mt-1">{stat.value}</h3>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-secondary-50 flex items-center justify-between">
                                        <span className="text-secondary-400 text-[10px] font-medium">{stat.sub}</span>
                                        <ChevronRight size={14} className="text-secondary-300 group-hover:text-primary-500 transition-colors" />
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-1 bg-surface p-1.5 rounded-3xl mb-8 w-fit border border-border shadow-sm">
                    {[
                        { id: 'enrollments', label: 'Enrollments', icon: Users },
                        { id: 'staff-approvals', label: 'Staff Approvals', icon: UserCheck },
                        { id: 'razorpay-payments', label: 'Transactions', icon: CreditCard },
                        { id: 'razorpay-settlements', label: 'Settlements', icon: HandCoins }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all ${activeTab === tab.id
                                ? 'bg-primary-600 text-white shadow-md scale-[1.02]'
                                : 'text-secondary-400 hover:text-white hover:bg-secondary-800'
                                }`}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="bg-surface rounded-3xl shadow-card border border-border overflow-hidden">
                    {/* Table Filters */}
                    {(activeTab === 'enrollments' || activeTab === 'staff-approvals') && (
                        <div className="p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface/50 backdrop-blur-sm">
                            <div className="relative flex-1 max-w-md group">
                                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search by name, email or ID..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-secondary-50 hover:bg-white border-2 border-transparent focus:border-primary-500/20 focus:bg-white rounded-2xl text-sm font-medium transition-all outline-none"
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                {activeTab === 'enrollments' && (
                                    <div className="flex items-center gap-2 bg-secondary-50 p-1 rounded-2xl border border-secondary-100">
                                        {['all', 'completed', 'pending', 'waiting_approval'].map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => setStatusFilter(s)}
                                                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${statusFilter === s
                                                    ? 'bg-white text-primary-600 shadow-sm'
                                                    : 'text-secondary-400 hover:text-secondary-600'
                                                    }`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                <Button variant="secondary" size="sm" className="!rounded-xl border-secondary-200 !px-5">
                                    <Download size={16} />
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Content Implementation */}
                    {/* ... (Existing mobile views could be here) */}

                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        {(activeTab === 'enrollments' || activeTab === 'staff-approvals') && (
                            <table className="w-full text-left">
                                <thead className="bg-surface border-b border-border">
                                    <tr>
                                        <th className="px-6 py-5 text-[10px] font-black text-secondary-400 uppercase tracking-widest">Details</th>
                                        <th className="px-6 py-5 text-[10px] font-black text-secondary-400 uppercase tracking-widest">Role/Domain</th>
                                        <th className="px-6 py-5 text-[10px] font-black text-secondary-400 uppercase tracking-widest">Amount</th>
                                        {activeTab === 'enrollments' && <th className="px-6 py-5 text-[10px] font-black text-secondary-400 uppercase tracking-widest">Tx ID</th>}
                                        <th className="px-6 py-5 text-[10px] font-black text-secondary-400 uppercase tracking-widest text-center">Status</th>
                                        {activeTab === 'staff-approvals' && <th className="px-6 py-5 text-[10px] font-black text-secondary-400 uppercase tracking-widest text-right">Actions</th>}
                                        {activeTab === 'enrollments' && <th className="px-6 py-5 text-[10px] font-black text-secondary-400 uppercase tracking-widest">Date</th>}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    <AnimatePresence mode="popLayout">
                                        {filteredEnrollments.map((enrollment, idx) => (
                                            <motion.tr
                                                key={enrollment.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                className="hover:bg-primary-900/10 transition-colors group cursor-default"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 font-black text-sm">
                                                            {enrollment.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-white group-hover:text-primary-600 transition-colors">
                                                                {enrollment.name}
                                                            </p>
                                                            <p className="text-secondary-500 text-[11px] font-medium">{enrollment.enrollment_id}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-black uppercase text-secondary-400 mb-1">
                                                            {enrollment.role || 'student'}
                                                        </span>
                                                        <span className="text-xs font-bold text-secondary-700 block max-w-[200px] truncate">
                                                            {enrollment.domain}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm font-black text-white">₹{enrollment.amount}</span>
                                                </td>
                                                {activeTab === 'enrollments' && (
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col">
                                                            <span className="text-[11px] font-mono text-secondary-500 uppercase tracking-tight">
                                                                {enrollment.razorpay_payment_id || 'N/A'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                )}
                                                <td className="px-6 py-4">
                                                    <div className="flex justify-center">
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusColor(enrollment.status)}`}>
                                                            {enrollment.status.replace('_', ' ')}
                                                        </span>
                                                    </div>
                                                </td>
                                                {activeTab === 'staff-approvals' && (
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => handleApproval(enrollment.enrollment_id, 'approved')}
                                                                className="px-3 py-1.5 bg-primary-50 text-primary-600 text-[10px] font-bold uppercase rounded-lg hover:bg-primary-100 transition-colors"
                                                            >
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={() => handleApproval(enrollment.enrollment_id, 'rejected')}
                                                                className="px-3 py-1.5 bg-rose-50 text-rose-600 text-[10px] font-bold uppercase rounded-lg hover:bg-rose-100 transition-colors"
                                                            >
                                                                Reject
                                                            </button>
                                                        </div>
                                                    </td>
                                                )}
                                                {activeTab === 'enrollments' && (
                                                    <td className="px-6 py-4">
                                                        <p className="text-[11px] text-secondary-500 font-medium">
                                                            {new Date(enrollment.created_at).toLocaleDateString()}
                                                        </p>
                                                    </td>
                                                )}
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        )}

                        {/* Razorpay Tables Rendering Logic Reuse */}
                        {(activeTab === 'razorpay-payments' || activeTab === 'razorpay-settlements') && (
                            /* ... reusing existing table logic ... */
                            activeTab === 'razorpay-payments' ? (
                                <table className="w-full text-left">
                                    <thead className="bg-surface border-b border-border">
                                        <tr>
                                            <th className="px-6 py-5 text-[10px] font-black text-secondary-400 uppercase tracking-widest">Payment ID</th>
                                            <th className="px-6 py-5 text-[10px] font-black text-secondary-400 uppercase tracking-widest">Contact</th>
                                            <th className="px-6 py-5 text-[10px] font-black text-secondary-400 uppercase tracking-widest">Amount</th>
                                            <th className="px-6 py-5 text-[10px] font-black text-secondary-400 uppercase tracking-widest">Method</th>
                                            <th className="px-6 py-5 text-[10px] font-black text-secondary-400 uppercase tracking-widest text-center">Status</th>
                                            <th className="px-6 py-5 text-[10px] font-black text-secondary-400 uppercase tracking-widest">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-secondary-50">
                                        {rzpPayments.map((pay) => (
                                            <tr key={pay.id} className="hover:bg-secondary-50/50 transition-colors font-medium">
                                                <td className="px-6 py-4 text-xs font-mono text-primary-600">{pay.id}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs text-secondary-900">{pay.email}</span>
                                                        <span className="text-[10px] text-secondary-500">{pay.contact}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-black text-secondary-900">₹{pay.amount / 100}</td>
                                                <td className="px-6 py-4">
                                                    <span className="text-[10px] font-black uppercase text-secondary-500 bg-secondary-100 px-2 py-0.5 rounded-md">
                                                        {pay.method}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-tight border ${pay.status === 'captured' ? 'bg-primary-50 text-primary-600 border-primary-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                                        {pay.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-[11px] text-secondary-500">
                                                    {new Date(pay.created_at * 1000).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <table className="w-full text-left">
                                    <thead className="bg-surface border-b border-border">
                                        <tr>
                                            <th className="px-6 py-5 text-[10px] font-black text-secondary-400 uppercase tracking-widest">Settlement ID</th>
                                            <th className="px-6 py-5 text-[10px] font-black text-secondary-400 uppercase tracking-widest">Amount</th>
                                            <th className="px-6 py-5 text-[10px] font-black text-secondary-400 uppercase tracking-widest">Fees</th>
                                            <th className="px-6 py-5 text-[10px] font-black text-secondary-400 uppercase tracking-widest">Tax</th>
                                            <th className="px-6 py-5 text-[10px] font-black text-secondary-400 uppercase tracking-widest text-center">Status</th>
                                            <th className="px-6 py-5 text-[10px] font-black text-secondary-400 uppercase tracking-widest">Created At</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-secondary-50">
                                        {rzpSettlements.map((set) => (
                                            <tr key={set.id} className="hover:bg-secondary-50/50 transition-colors font-medium">
                                                <td className="px-6 py-4 text-xs font-mono text-primary-600">{set.id}</td>
                                                <td className="px-6 py-4 text-sm font-black text-secondary-900">₹{set.amount / 100}</td>
                                                <td className="px-6 py-4 text-xs text-rose-500">₹{set.fees / 100}</td>
                                                <td className="px-6 py-4 text-xs text-rose-400">₹{set.tax / 100}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-tight border ${set.status === 'processed' ? 'bg-primary-50 text-primary-600 border-primary-100' : 'bg-secondary-50 text-secondary-600 border-secondary-100'}`}>
                                                        {set.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-[11px] text-secondary-500">
                                                    {new Date(set.created_at * 1000).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )
                        )}


                        {(activeTab === 'enrollments' ? filteredEnrollments.length : activeTab === 'razorpay-payments' ? rzpPayments.length : activeTab === 'staff-approvals' ? filteredEnrollments.length : rzpSettlements.length) === 0 && !loading && (
                            <div className="py-20 flex flex-col items-center justify-center text-center">
                                <div className="w-16 h-16 bg-secondary-50 rounded-full flex items-center justify-center mb-4">
                                    <AlertCircle size={32} className="text-secondary-300" />
                                </div>
                                <h4 className="text-secondary-900 font-bold">No records found</h4>
                                <p className="text-secondary-500 text-sm">Data might be still syncing or no records exist</p>
                            </div>
                        )}

                        {loading && (
                            <div className="p-6 space-y-4">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="flex items-center gap-4 animate-pulse">
                                        <Skeleton className="h-12 w-full rounded-2xl bg-secondary-100/50" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};


export default AdminDashboard;
