import * as React from "react";

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`bg-white/90 backdrop-blur-md rounded-3xl shadow-[var(--shadow-soft-teal)] overflow-hidden ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);
GlassCard.displayName = "GlassCard";
