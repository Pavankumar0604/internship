import { InputHTMLAttributes, forwardRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
    maxLength?: number;
    showCounter?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            error,
            icon,
            maxLength,
            showCounter = false,
            className = '',
            value,
            onChange,
            ...props
        },
        ref
    ) => {
        const [isFocused, setIsFocused] = useState(false);
        const [currentLength, setCurrentLength] = useState(
            value ? String(value).length : 0
        );

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setCurrentLength(e.target.value.length);
            if (onChange) {
                onChange(e);
            }
        };

        const hasValue = value !== undefined && value !== '';

        return (
            <div className="relative w-full">
                <div className="relative">
                    {icon && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        value={value}
                        onChange={handleChange}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        maxLength={maxLength}
                        className={`
              w-full px-4 py-4 ${icon ? 'pl-12' : ''} 
              bg-white 
              border-2 rounded-xl
              ${error ? 'border-red-500' : isFocused ? 'border-primary-500' : 'border-secondary-200'}
              text-secondary-900 placeholder-transparent
              focus:outline-none focus:ring-4 focus:ring-primary-500/10
              transition-all duration-300
              ${className}
            `}
                        {...props}
                    />
                    {label && (
                        <motion.label
                            initial={false}
                            animate={{
                                top: isFocused || hasValue ? '0' : '50%',
                                y: isFocused || hasValue ? '-50%' : '-50%',
                                scale: isFocused || hasValue ? 0.85 : 1,
                                left: isFocused || hasValue ? (icon ? '3rem' : '1rem') : icon ? '3rem' : '1rem',
                            }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            className={`
                absolute origin-left pointer-events-none bg-white px-1
                ${isFocused || hasValue ? 'text-primary-600' : 'text-secondary-400'}
                font-medium transition-colors duration-300
              `}
                        >
                            {label}
                        </motion.label>
                    )}
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mt-2 text-sm text-red-400 flex items-center gap-1"
                        >
                            <span>⚠</span> {error}
                        </motion.p>
                    )}
                </AnimatePresence>

                {showCounter && maxLength && (
                    <div className="mt-1 text-right text-xs text-gray-400">
                        {currentLength}/{maxLength}
                    </div>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
