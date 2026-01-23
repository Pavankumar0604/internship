import { FC } from 'react';
import { motion } from 'framer-motion';

export interface CardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
    onClick?: () => void;
    selected?: boolean;
}

const Card: FC<CardProps> = ({
    children,
    className = '',
    hover = false,
    onClick,
    selected = false,
}) => {
    return (
        <motion.div
            whileHover={hover ? { scale: 1.02, y: -4 } : undefined}
            whileTap={onClick ? { scale: 0.98 } : undefined}
            onClick={onClick}
            className={`
        relative overflow-hidden
        bg-white shadow-card hover:shadow-card-hover
        border rounded-2xl
        ${selected ? 'border-primary-500 ring-2 ring-primary-500/20' : 'border-secondary-100'}
        ${hover ? 'cursor-pointer' : ''}
        transition-all duration-300
        ${className}
      `}
        >
            {/* Content */}
            <div className="relative z-10">{children}</div>

            {/* Selected indicator */}
            {selected && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 right-4 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center"
                >
                    <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </motion.div>
            )}
        </motion.div>
    );
};

export default Card;
