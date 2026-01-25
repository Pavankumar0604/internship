import { z } from 'zod';
import DOMPurify from 'dompurify';

// Input sanitization helper
export const sanitizeInput = (val: string) => {
    if (typeof window === 'undefined') return val;
    return DOMPurify.sanitize(val.trim(), {
        ALLOWED_TAGS: [], // No HTML allowed
        ALLOWED_ATTR: [],
    });
};

// File validation
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

// Step 1: Student Profile Schema
export const studentProfileSchema = z.object({
    role: z.enum(['student', 'staff']),
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must be less than 100 characters')
        .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes")
        .transform(sanitizeInput),
    email: z
        .string()
        .email('Invalid email address')
        .transform(sanitizeInput)
        .optional()
        .or(z.literal('').transform(() => '')),
    phone: z
        .string()
        .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian phone number')
        .length(10, 'Phone number must be exactly 10 digits')
        .transform(sanitizeInput),
    qualification: z.string().min(1, 'Please select your qualification').transform(sanitizeInput),
    college: z.string().max(200, 'College name is too long').optional().transform(v => v ? sanitizeInput(v) : v),
    resumeFile: z
        .instanceof(File)
        .optional()
        .refine(
            (file) => !file || file.size <= MAX_FILE_SIZE,
            'File size must be less than 5MB'
        )
        .refine(
            (file) => !file || ACCEPTED_FILE_TYPES.includes(file.type),
            'Only PDF and DOCX files are accepted'
        ),
});

// Step 2: Domain Selection Schema
export const domainSelectionSchema = z.object({
    domainId: z.string().min(1, 'Please select an internship domain').transform(sanitizeInput),
});

// Combined Enrollment Schema
export const enrollmentSchema = studentProfileSchema.merge(domainSelectionSchema);

export type StudentProfileFormData = z.infer<typeof studentProfileSchema>;
export type DomainSelectionFormData = z.infer<typeof domainSelectionSchema>;
export type EnrollmentFormData = z.infer<typeof enrollmentSchema>;
