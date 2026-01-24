import { supabase } from './db';

// ADMIN: Fetch all enrollments
export const getAllEnrollments = async () => {
    const { data, error } = await supabase
        .from('enrollments')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
};

// ADMIN: Fetch dashboard stats
export const getDashboardStats = async () => {
    const { data: enrollments, error } = await supabase
        .from('enrollments')
        .select('amount, status');

    if (error) throw error;

    const stats = {
        totalRevenue: enrollments.reduce((sum, e) => sum + (e.amount || 0), 0),
        totalEnrollments: enrollments.length,
        completedEnrollments: enrollments.filter(e => e.status === 'completed' || e.status === 'verified').length,
        pendingPayments: enrollments.filter(e => e.status === 'pending').length
    };

    return stats;
};

// ADMIN: Fetch Razorpay data via Edge Function
export const getRazorpayData = async (type: 'payments' | 'settlements', count: number = 20) => {
    const { data, error } = await supabase.functions.invoke('razorpay-fetch-data', {
        body: { type, count }
    });

    if (error) throw error;
    return data;
};
