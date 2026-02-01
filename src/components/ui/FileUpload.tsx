import React, { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, File, X, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export interface FileUploadProps {
    onFileSelect: (file: File | null) => void;
    accept?: string;
    maxSize?: number; // in bytes
    currentFile?: File | null;
}

const FileUpload: React.FC<FileUploadProps> = ({
    onFileSelect,
    accept = '.pdf,.doc,.docx',
    maxSize = 5 * 1024 * 1024, // 5MB default
    currentFile,
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    const validateFile = (file: File): boolean => {
        // Check file size
        if (file.size > maxSize) {
            toast.error(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
            return false;
        }

        // Check file type
        const acceptedTypes = accept.split(',').map((t) => t.trim());
        const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
        const isValidType = acceptedTypes.some(
            (type) =>
                type === fileExtension ||
                file.type.includes(type.replace('.', '').replace('*', ''))
        );

        if (!isValidType) {
            toast.error('Invalid file type. Please upload PDF or DOCX files only.');
            return false;
        }

        return true;
    };

    const handleFile = useCallback(
        (file: File) => {
            if (validateFile(file)) {
                setIsUploading(true);
                // Simulate upload progress
                let progress = 0;
                const interval = setInterval(() => {
                    progress += 10;
                    setUploadProgress(progress);
                    if (progress >= 100) {
                        clearInterval(interval);
                        setTimeout(() => {
                            setIsUploading(false);
                            setUploadProgress(0);
                            onFileSelect(file);
                            toast.success('Resume uploaded successfully!');
                        }, 300);
                    }
                }, 100);
            }
        },
        [onFileSelect]
    );

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFile(files[0]);
        }
    };

    const removeFile = () => {
        onFileSelect(null);
        toast.success('Resume removed');
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <div className="w-full">
            <AnimatePresence mode="wait">
                {!currentFile ? (
                    <motion.div
                        key="upload-zone"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`
              relative overflow-hidden group
              w-full p-8 transition-all duration-300 cursor-pointer bg-surface
              border-2 border-dashed rounded-2xl
              ${isDragging
                                ? 'border-primary-500 bg-primary-50/10'
                                : 'border-border hover:border-primary-300 hover:bg-secondary-50'
                            }
            `}
                    >
                        <input
                            type="file"
                            id="resume-upload"
                            accept={accept}
                            onChange={handleFileInput}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            disabled={isUploading}
                            aria-label="Upload your resume in PDF or DOCX format"
                        />

                        <div className="flex flex-col items-center justify-center text-center">
                            <motion.div
                                animate={{
                                    y: isDragging ? -10 : 0,
                                    scale: isDragging ? 1.1 : 1,
                                }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                <Upload
                                    className={`w-12 h-12 mb-4 ${isDragging ? 'text-primary-600' : 'text-primary-500'}`}
                                />
                            </motion.div>

                            {isUploading ? (
                                <div className="w-full max-w-xs">
                                    <p className="text-secondary-900 font-semibold mb-3">Uploading...</p>
                                    <div className="w-full h-2 bg-secondary-200 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${uploadProgress}%` }}
                                            className="h-full bg-primary-500"
                                        />
                                    </div>
                                    <p className="text-secondary-500 text-sm mt-2">{uploadProgress}%</p>
                                </div>
                            ) : (
                                <>
                                    <p className="text-secondary-900 font-semibold text-lg mb-2">
                                        {isDragging ? 'Drop your resume here' : 'Upload Resume'}
                                    </p>
                                    <p className="text-secondary-500 text-sm mb-4">
                                        Drag & drop or click to browse
                                    </p>
                                    <p className="text-secondary-400 text-xs">
                                        PDF or DOCX • Max {maxSize / (1024 * 1024)}MB
                                    </p>
                                </>
                            )}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="file-preview"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-surface border-2 border-primary-500/20 rounded-2xl p-6 relative overflow-hidden group hover:border-primary-500/40 transition-all duration-300"
                    >
                        {/* Background decoration */}
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                            <File className="w-24 h-24 text-primary-500" />
                        </div>

                        <div className="flex items-start gap-4 relative z-10">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center border border-primary-500/20 shadow-sm">
                                    <File className="w-6 h-6 text-primary-500" />
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-secondary-900 font-semibold truncate">
                                            {currentFile.name}
                                        </p>
                                        <p className="text-secondary-500 text-sm">
                                            {formatFileSize(currentFile.size)}
                                        </p>
                                    </div>
                                    <button
                                        onClick={removeFile}
                                        className="flex-shrink-0 p-2 hover:bg-background rounded-lg transition-colors text-secondary-400 hover:text-red-500"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="flex items-center gap-2 mt-3">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span className="text-green-600 text-sm font-medium">
                                        Ready to submit
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FileUpload;
