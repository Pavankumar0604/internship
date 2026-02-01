import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create supabase client - will fail gracefully if env vars are missing
export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder');

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
    role: 'student' | 'staff'; // Added Role
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
    approved_by?: string;
    approved_at?: string;
    meeting_link?: string;
    meeting_date?: string;
    meeting_time?: string;
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

// Update enrollment status (for Admin)
export const updateEnrollmentStatus = async (
    enrollmentId: string,
    status: 'approved' | 'rejected',
    approvedBy?: string
) => {
    const updates: any = {
        status,
        updated_at: new Date().toISOString(),
    };

    if (status === 'approved') {
        updates.approved_at = new Date().toISOString();
        updates.approved_by = approvedBy;
    }

    const { data, error } = await supabase
        .from('enrollments')
        .update(updates)
        .eq('enrollment_id', enrollmentId)
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
};

// End of client exports
