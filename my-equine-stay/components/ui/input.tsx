import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftIcon, rightIcon, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-[var(--color-charcoal)] mb-1.5"
          >
            {label}
            {props.required && <span className="text-[var(--color-gold)] ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            className={cn(
              "input-base",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error &&
                "border-red-400 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]",
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p
            id={`${id}-error`}
            className="mt-1.5 text-sm text-red-600 flex items-center gap-1"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${id}-hint`} className="mt-1.5 text-sm text-[var(--color-muted)]">
            {hint}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  showCount?: boolean;
  maxCount?: number;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, showCount, maxCount, id, value, ...props }, ref) => {
    const charCount = typeof value === "string" ? value.length : 0;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-[var(--color-charcoal)] mb-1.5"
          >
            {label}
            {props.required && <span className="text-[var(--color-gold)] ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          value={value}
          className={cn(
            "input-base resize-y min-h-[120px]",
            error &&
              "border-red-400 focus:border-red-500",
            className
          )}
          aria-invalid={!!error}
          {...props}
        />
        <div className="flex justify-between items-start mt-1.5">
          <div>
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
            {hint && !error && (
              <p className="text-sm text-[var(--color-muted)]">{hint}</p>
            )}
          </div>
          {showCount && maxCount && (
            <p
              className={cn(
                "text-xs ml-auto",
                charCount > maxCount
                  ? "text-red-600"
                  : "text-[var(--color-muted-light)]"
              )}
            >
              {charCount}/{maxCount}
            </p>
          )}
        </div>
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Input, Textarea };
