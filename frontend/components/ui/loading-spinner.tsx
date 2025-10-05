import * as React from "react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "gradient" | "pulse";
  className?: string;
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
  xl: "w-12 h-12",
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  variant = "default",
  className,
}) => {
  const baseClasses = "animate-spin rounded-full";

  const variantClasses = {
    default: "border-2 border-primary border-t-transparent",
    gradient: "border-2 border-transparent border-t-primary",
    pulse: "bg-primary animate-pulse",
  };

  return (
    <div
      className={cn(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    />
  );
};

export default LoadingSpinner;

// Additional loading components
export const LoadingDots: React.FC<{ className?: string }> = ({
  className,
}) => (
  <div className={cn("flex space-x-1", className)}>
    <div
      className="w-2 h-2 bg-primary rounded-full animate-bounce"
      style={{ animationDelay: "0ms" }}
    />
    <div
      className="w-2 h-2 bg-primary rounded-full animate-bounce"
      style={{ animationDelay: "150ms" }}
    />
    <div
      className="w-2 h-2 bg-primary rounded-full animate-bounce"
      style={{ animationDelay: "300ms" }}
    />
  </div>
);

export const LoadingPulse: React.FC<{ className?: string }> = ({
  className,
}) => (
  <div className={cn("flex space-x-1", className)}>
    <div
      className="w-3 h-3 bg-primary rounded-full animate-pulse"
      style={{ animationDelay: "0ms" }}
    />
    <div
      className="w-3 h-3 bg-primary rounded-full animate-pulse"
      style={{ animationDelay: "200ms" }}
    />
    <div
      className="w-3 h-3 bg-primary rounded-full animate-pulse"
      style={{ animationDelay: "400ms" }}
    />
  </div>
);

export const LoadingWave: React.FC<{ className?: string }> = ({
  className,
}) => (
  <div className={cn("flex space-x-1 items-end", className)}>
    <div
      className="w-1 h-4 bg-primary rounded-full animate-pulse"
      style={{ animationDelay: "0ms" }}
    />
    <div
      className="w-1 h-6 bg-primary rounded-full animate-pulse"
      style={{ animationDelay: "100ms" }}
    />
    <div
      className="w-1 h-8 bg-primary rounded-full animate-pulse"
      style={{ animationDelay: "200ms" }}
    />
    <div
      className="w-1 h-6 bg-primary rounded-full animate-pulse"
      style={{ animationDelay: "300ms" }}
    />
    <div
      className="w-1 h-4 bg-primary rounded-full animate-pulse"
      style={{ animationDelay: "400ms" }}
    />
  </div>
);

export const LoadingCard: React.FC<{ className?: string }> = ({
  className,
}) => (
  <div className={cn("gradient-card p-6 space-y-4", className)}>
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-muted rounded-full animate-pulse" />
      <div className="space-y-2 flex-1">
        <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
        <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-4 bg-muted rounded animate-pulse" />
      <div className="h-4 bg-muted rounded animate-pulse w-5/6" />
    </div>
    <div className="flex space-x-2">
      <div className="h-6 bg-muted rounded-full animate-pulse w-16" />
      <div className="h-6 bg-muted rounded-full animate-pulse w-20" />
    </div>
  </div>
);
