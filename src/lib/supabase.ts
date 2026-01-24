import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
        'Missing Supabase environment variables. Please check your .env file.'
    );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Storage bucket name for resumes
export const RESUME_BUCKET = 'resumes';

// Upload resume to Supabase Storage
export const uploadResume = async (file: File, enrollmentId: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${enrollmentId}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
        .from(RESUME_BUCKET)
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
        });

    if (error) {
        throw error;
    }

    // Get public URL
    const {
        data: { publicUrl },
    } = supabase.storage.from(RESUME_BUCKET).getPublicUrl(filePath);

    return { path: data.path, url: publicUrl };
};

// Create enrollment in database
export const createEnrollment = async (enrollmentData: {
    enrollment_id: string;
    name: string;
    email?: string;
    phone: string;
    qualification: string;
    college?: string;
    resume_url?: string;
    domain: string;
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
    amount: number;
    status: string;
}) => {
    const { data, error } = await supabase
        .from('enrollments')
        .insert([enrollmentData])
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
};

// Update enrollment payment details
export const updateEnrollmentPayment = async (
    enrollmentId: string,
    paymentDetails: {
        razorpay_payment_id: string;
        razorpay_signature: string;
        status: string;
    }
) => {
    const { data, error } = await supabase
        .from('enrollments')
        .update({
            ...paymentDetails,
            updated_at: new Date().toISOString(),
        })
        .eq('enrollment_id', enrollmentId)
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
};

// Generate unique enrollment ID
export const generateEnrollmentId = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, '0');
    return `ENRL-${year}${month}${day}-${random}`;
};

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
