import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ai" | "outline";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", children, ...props }, ref) => {
    let baseStyles = "inline-flex items-center justify-center gap-2 focus:outline-none transition-all duration-200";
    
    // Size logic
    let sizeStyles = "";
    if (size === "sm") sizeStyles = " px-3 py-1.5 text-xs";
    else if (size === "md") sizeStyles = " px-4 py-2 text-sm";
    else if (size === "lg") sizeStyles = " px-6 py-3 text-base";

    if (variant === "primary") {
      baseStyles += ` rounded-full font-bold text-white bg-[linear-gradient(135deg,var(--color-brand-emerald)_0%,var(--color-brand-teal)_100%)] hover:opacity-90 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-soft-teal)] hover:-translate-y-0.5 focus:ring-2 focus:ring-[var(--color-brand-emerald)] focus:ring-offset-2 ${sizeStyles}`;
    } else if (variant === "secondary") {
      baseStyles += ` rounded-xl font-semibold text-[var(--color-brand-ink)] bg-white border border-[var(--color-brand-border)] hover:bg-[var(--color-brand-pastel)] hover:border-[var(--color-brand-teal)]/30 shadow-[var(--shadow-card)] ${sizeStyles}`;
    } else if (variant === "outline") {
      baseStyles += ` rounded-xl font-semibold text-[var(--color-brand-slate)] bg-transparent border border-[var(--color-brand-border)] hover:text-[var(--color-brand-ink)] hover:border-[var(--color-brand-ink)]/30 ${sizeStyles}`;
    } else if (variant === "ai") {
      baseStyles += ` rounded-full font-bold text-[var(--color-brand-teal)] bg-[var(--color-brand-pastel)] border border-[var(--color-brand-emerald)]/30 hover:bg-[#E0E7FF] hover:scale-105 shadow-[var(--shadow-card)] ${sizeStyles}`;
    }

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
