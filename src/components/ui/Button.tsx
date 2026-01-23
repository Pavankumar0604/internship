import { ButtonHTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = 'primary',
            size = 'md',
            isLoading = false,
            disabled,
            className = '',
            children,
            ...props
        },
        ref
    ) => {
        const baseStyles =
            'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed';

        const variantStyles = {
            primary:
                'bg-primary-500 text-white shadow-lg shadow-primary-500/30 hover:bg-primary-600 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]',
            secondary:
                'bg-white text-secondary-700 border border-secondary-200 shadow-sm hover:bg-secondary-50 hover:border-secondary-300',
            outline:
                'bg-transparent border-2 border-primary-500 text-primary-500 hover:bg-primary-50',
            ghost: 'bg-transparent text-primary-500 hover:bg-primary-50',
        };

        const sizeStyles = {
            sm: 'px-3 py-1.5 text-xs gap-1.5',
            md: 'px-4 py-2 text-sm gap-2',
            lg: 'px-6 py-2.5 text-base gap-2',
        };

        return (
            <motion.div
                whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
                whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
                className="inline-block w-full sm:w-auto" // Added w-full sm:w-auto for better mobile handling
            >
                <button
                    ref={ref}
                    className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
                    disabled={disabled || isLoading}
                    {...props}
                >
                    {isLoading && <Loader2 className="animate-spin" size={size === 'sm' ? 16 : 20} />}
                    {children}
                </button>
            </motion.div>
        );
    }
);

Button.displayName = 'Button';

export default Button;
