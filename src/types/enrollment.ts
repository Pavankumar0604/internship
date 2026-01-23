export type InternshipDomainTitle =
    | 'Frontend Development'
    | 'Backend & Database';

export interface InternshipDomain {
    id: string;
    title: InternshipDomainTitle;
    subtitle: string;
    icon: string;
    features: string[];
    price: number;
    subcourses?: string[];
    recommended?: boolean;
}

export const QUALIFICATIONS = [
    'High School (10th)',
    'Higher Secondary (12th)',
    'Diploma',
    'B.Tech / B.E.',
    'B.Sc / BCA',
    'M.Tech / M.E.',
    'M.Sc / MCA',
    'Other',
] as const;

export type Qualification = (typeof QUALIFICATIONS)[number];

export interface StudentProfile {
    name: string;
    email?: string;
    phone: string;
    qualification: string;
    college?: string;
    resumeFile?: File;
}

export interface PaymentDetails {
    orderId: string;
    paymentId: string;
    signature: string;
    amount?: number;
}

export interface EnrollmentData {
    profile: StudentProfile;
    domains: InternshipDomain[];
    payment: PaymentDetails | null;
}

// Supabase Database Types
export type Enrollment = {
    id: string;
    enrollment_id: string;
    name: string;
    email: string | null;
    phone: string | null;
    qualification: string | null;
    college: string | null;
    resume_filename: string | null;
    resume_url: string | null;
    domain: string; // Keep as string for DB, will be comma-separated or JSON
    domains: string[]; // Add actual array for frontend use if needed, but the DB schema might be strict
    razorpay_order_id: string | null;
    razorpay_payment_id: string | null;
    amount: number;
    status: 'pending' | 'paid' | 'verified' | 'rejected';
    created_at: string;
    updated_at: string;
};

export type Domain = {
    name: string;
    description: string;
    price: number;
    seats_available: number;
};


export const INTERNSHIP_DOMAINS: InternshipDomain[] = [
    {
        id: 'frontend',
        title: 'Frontend Development',
        subtitle: 'Professional Web UI Training',
        icon: 'Code',
        price: 2500,
        recommended: true,
        features: [
            'Live Project Work',
            'Practical Skills',
            'Internship Certificate',
            'Job Ready Training',
        ],
        subcourses: [
            'HTML',
            'CSS',
            'JavaScript',
            'Responsive Design',
            'UI Basics',
        ],
    },
    {
        id: 'backend',
        title: 'Backend & Database',
        subtitle: 'Server-Side & Data Systems',
        icon: 'Database',
        price: 3500,
        features: [
            'Live Project Work',
            'Practical Skills',
            'Internship Certificate',
            'Job Ready Training',
        ],
        subcourses: [
            'Backend Fundamentals',
            'API Basics',
            'Database Concepts',
            'SQL',
            'Server-Side Logic',
        ],
    },
];
