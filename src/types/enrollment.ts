export type InternshipDomainTitle =
    | 'UI/UX Design'
    | 'Frontend Development'
    | 'Database Concepts'
    | 'Digital Marketing';

export interface InternshipDomain {
    id: string;
    title: InternshipDomainTitle;
    subtitle: string;
    icon: string;
    features: string[];
    price?: number;
    seatsAvailable?: number;
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
    domain: InternshipDomain | null;
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
    domain: string;
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
        id: 'ui-ux',
        title: 'UI/UX Design',
        subtitle: 'HTML/CSS Design Training',
        icon: 'Palette',
        features: [
            'Figma / Adobe XD',
            'Wireframing & Prototyping',
            'Design Systems',
            'User Research',
        ],
    },
    {
        id: 'frontend',
        title: 'Frontend Development',
        subtitle: 'HTML/CSS/JS Development',
        icon: 'Code',
        features: [
            'React.js Fundamentals',
            'Tailwind CSS',
            'Responsive Design',
            'State Management',
        ],
    },
    {
        id: 'database',
        title: 'Database Concepts',
        subtitle: 'HTML/SQL Database Training',
        icon: 'Database',
        features: [
            'SQL Basics',
            'PostgreSQL / MySQL',
            'Data Modeling',
            'Query Optimization',
        ],
    },
    {
        id: 'digital-marketing',
        title: 'Digital Marketing',
        subtitle: 'Digital Marketing Certification',
        icon: 'Megaphone',
        features: [
            'SEO & SEM',
            'Social Media Marketing',
            'Content Strategy',
            'Analytics & Reporting',
        ],
    },
];
