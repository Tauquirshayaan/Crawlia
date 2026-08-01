import * as React from "react";

export interface StatusPillProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: "success" | "warning" | "error" | "info" | "brand" | "neutral";
}

export const StatusPill = React.forwardRef<HTMLSpanElement, StatusPillProps>(
  ({ className = "", status, children, ...props }, ref) => {
    let styles = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ";
    
    switch (status) {
      case "neutral":
        styles += "bg-gray-100 text-gray-800 border border-gray-200";
        break;
      case "success":
        styles += "bg-green-100 text-green-800 border border-green-200";
        break;
      case "warning":
        styles += "bg-amber-100 text-amber-800 border border-amber-200";
        break;
      case "error":
        styles += "bg-red-100 text-red-800 border border-red-200";
        break;
      case "info":
        styles += "bg-blue-100 text-blue-800 border border-blue-200";
        break;
      case "brand":
        styles += "bg-[var(--color-brand-pastel)] text-[var(--color-brand-teal)] border border-[var(--color-brand-emerald)]/20";
        break;
    }

    return (
      <span ref={ref} className={`${styles} ${className}`} {...props}>
        {children}
      </span>
    );
  }
);
StatusPill.displayName = "StatusPill";
