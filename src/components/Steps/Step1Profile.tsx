import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Phone, Building2 } from 'lucide-react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import FileUpload from '../ui/FileUpload';
import { studentProfileSchema, StudentProfileFormData } from '@/lib/validation';
import { StudentProfile, QUALIFICATIONS } from '@/types/enrollment';

interface Step1ProfileProps {
    onNext: (data: StudentProfile) => void;
    initialData?: StudentProfile;
}

const Step1Profile: React.FC<Step1ProfileProps> = ({ onNext, initialData }) => {
    const [resumeFile, setResumeFile] = useState<File | null>(
        initialData?.resumeFile || null
    );

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
    } = useForm<StudentProfileFormData>({
        resolver: zodResolver(studentProfileSchema),
        defaultValues: {
            name: initialData?.name || '',
            email: initialData?.email || '',
            phone: initialData?.phone || '',
            qualification: initialData?.qualification || '',
            college: initialData?.college || '',
        },
    });

    const onSubmit = (data: StudentProfileFormData) => {
        onNext({
            ...data,
            resumeFile: data.resumeFile || undefined,
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-2xl mx-auto"
        >
            <div className="text-center mb-6">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="inline-block p-3 bg-primary-50 rounded-xl mb-3 border border-primary-100"
                >
                    <User className="w-6 h-6 text-primary-500" />
                </motion.div>
                <h2 className="text-2xl font-black text-secondary-900 mb-1">Student Profile</h2>
                <p className="text-secondary-500 text-sm">
                    Let's start with your basic information
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Full Name */}
                <Input
                    {...register('name')}
                    label="Full Name"
                    placeholder="Enter your full name"
                    icon={<User size={20} />}
                    error={errors.name?.message}
                    maxLength={100}
                />

                {/* Email */}
                <Input
                    {...register('email')}
                    label="Email Address"
                    type="email"
                    placeholder="your.email@example.com"
                    icon={<Mail size={20} />}
                    error={errors.email?.message}
                />

                {/* Phone */}
                <Input
                    {...register('phone')}
                    label="Phone Number"
                    type="tel"
                    placeholder="10-digit mobile number"
                    icon={<Phone size={20} />}
                    error={errors.phone?.message}
                    maxLength={10}
                    showCounter
                />

                {/* Qualification */}
                <Select
                    {...register('qualification')}
                    label="Qualification"
                    options={QUALIFICATIONS.map((q) => ({ value: q, label: q }))}
                    error={errors.qualification?.message}
                />

                {/* College/University */}
                <Input
                    {...register('college')}
                    label="College/University (Optional)"
                    placeholder="Your institution name"
                    icon={<Building2 size={20} />}
                    error={errors.college?.message}
                    maxLength={200}
                />

                {/* Resume Upload */}
                <div>
                    <label className="block mb-3 text-sm font-semibold text-secondary-700">
                        Upload Resume
                    </label>
                    <FileUpload
                        onFileSelect={(file) => {
                            setResumeFile(file);
                            setValue('resumeFile', file || undefined);
                        }}
                        currentFile={resumeFile}
                    />
                    {errors.resumeFile && (
                        <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                            <span>⚠</span> {errors.resumeFile.message}
                        </p>
                    )}
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                    <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        isLoading={isSubmitting}
                        className="w-full shadow-lg hover:shadow-xl transition-shadow"
                    >
                        Continue to Domain Selection →
                    </Button>
                </div>
            </form>

            {/* Social Proof */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 text-center"
            >
                <p className="text-secondary-400 text-sm">
                    ✨ Join <span className="text-primary-600 font-bold">500+</span> students
                    who have completed our program
                </p>
            </motion.div>
        </motion.div>
    );
};

export default Step1Profile;
