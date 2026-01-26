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



        return (
            <div className="relative w-full">
                {label && (
                    <label className="block mb-2 text-sm font-semibold text-text-secondary">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary z-10">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        id={props.id || props.name}
                        value={value}
                        onChange={handleChange}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        maxLength={maxLength}
                        aria-invalid={!!error}
                        aria-describedby={error ? `${props.id || props.name}-error` : undefined}
                        className={`
              w-full px-4 py-3.5 ${icon ? 'pl-12' : ''} 
              bg-surface 
              border-2 rounded-xl
              ${error ? 'border-red-500' : isFocused ? 'border-primary-500' : 'border-border'}
              text-secondary-900 placeholder:text-secondary-500
              focus:outline-none focus:ring-4 focus:ring-primary-500/10
              transition-all duration-300
              ${className}
            `}
                        {...props}
                    />
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.p
                            id={`${props.id || props.name}-error`}
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
