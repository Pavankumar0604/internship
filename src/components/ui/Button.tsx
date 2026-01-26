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
            'inline-flex items-center justify-center font-extrabold rounded-2xl transition-all duration-500 focus:outline-none focus:ring-4 focus:ring-primary-400/30 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest relative overflow-hidden group';

        const variantStyles = {
            primary:
                'bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 text-white shadow-[0_10px_20px_-5px_rgba(235,49,54,0.4)] hover:shadow-[0_15px_30px_-5px_rgba(235,49,54,0.6)] border-t border-white/20',
            secondary:
                'bg-surface text-secondary-800 border-2 border-border hover:border-primary-200 hover:bg-primary-50/10 shadow-sm hover:shadow-md text-secondary-900',
            outline:
                'bg-transparent border-2 border-primary-500 text-primary-600 hover:bg-primary-500 hover:text-white shadow-sm',
            ghost: 'bg-transparent text-primary-600 hover:bg-primary-50 rounded-xl',
        };

        const sizeStyles = {
            sm: 'px-6 py-2.5 text-[10px] gap-2',
            md: 'px-10 py-4 text-xs gap-3',
            lg: 'px-14 py-5 text-sm gap-4',
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
                    aria-busy={isLoading}
                    aria-disabled={disabled || isLoading}
                    {...props}
                >
                    {/* Unique Shine Effect */}
                    {variant === 'primary' && (
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shine transition-transform duration-1000" />
                    )}

                    <span className="relative z-10 flex items-center justify-center gap-3">
                        {isLoading && <Loader2 className="animate-spin" size={size === 'sm' ? 14 : 18} />}
                        {children}
                    </span>
                </button>
            </motion.div>
        );
    }
);

Button.displayName = 'Button';

export default Button;
