import React from 'react';

const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
    return (
        <div className={`animate-pulse bg-secondary-200 rounded-lg ${className}`} />
    );
};

export const StepSkeleton = () => (
    <div className="max-w-2xl mx-auto space-y-8 p-4">
        <div className="flex flex-col items-center space-y-4">
            <Skeleton className="w-16 h-16 rounded-full" />
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
        </div>
        <div className="space-y-6">
            <Skeleton className="h-14 w-full rounded-xl" />
            <Skeleton className="h-14 w-full rounded-xl" />
            <Skeleton className="h-14 w-full rounded-xl" />
            <Skeleton className="h-12 w-32 mx-auto rounded-xl" />
        </div>
    </div>
);

export default Skeleton;
