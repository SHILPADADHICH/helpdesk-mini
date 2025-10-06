import { cn } from "@/lib/utils";
import * as React from "react";

// Animated Icon wrapper
const AnimatedIcon: React.FC<{
  children: React.ReactNode;
  animation?: "spin" | "bounce" | "pulse" | "float" | "wiggle" | "twinkle";
  className?: string;
}> = ({ children, animation = "pulse", className }) => {
  const animationClasses = {
    spin: "animate-spin",
    bounce: "animate-bounce",
    pulse: "animate-pulse",
    float: "animate-float",
    wiggle: "animate-wiggle",
    twinkle: "animate-twinkle",
  };

  return (
    <div className={cn(animationClasses[animation], className)}>{children}</div>
  );
};

// Custom animated icons
export const AnimatedTicketIcon: React.FC<{ className?: string }> = ({
  className,
}) => (
  <AnimatedIcon animation="float" className={className}>
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <path
        d="M2 9C2 7.89543 2.89543 7 4 7H20C21.1046 7 22 7.89543 22 9V15C22 16.1046 21.1046 17 20 17H4C2.89543 17 2 16.1046 2 15V9Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-draw"
      />
      <path
        d="M6 7V17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="animate-draw"
        style={{ animationDelay: "0.5s" }}
      />
      <path
        d="M18 7V17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="animate-draw"
        style={{ animationDelay: "0.5s" }}
      />
      <circle
        cx="12"
        cy="12"
        r="1"
        fill="currentColor"
        className="animate-twinkle"
        style={{ animationDelay: "1s" }}
      />
    </svg>
  </AnimatedIcon>
);

export const AnimatedUserIcon: React.FC<{ className?: string }> = ({
  className,
}) => (
  <AnimatedIcon animation="bounce" className={className}>
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <path
        d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-draw"
      />
      <circle
        cx="12"
        cy="7"
        r="4"
        stroke="currentColor"
        strokeWidth="2"
        className="animate-draw"
        style={{ animationDelay: "0.3s" }}
      />
    </svg>
  </AnimatedIcon>
);

export const AnimatedClockIcon: React.FC<{ className?: string }> = ({
  className,
}) => (
  <AnimatedIcon animation="spin" className={className}>
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2"
        className="animate-draw"
      />
      <path
        d="M12 6V12L16 14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-draw"
        style={{ animationDelay: "0.5s" }}
      />
    </svg>
  </AnimatedIcon>
);

export const AnimatedCheckIcon: React.FC<{ className?: string }> = ({
  className,
}) => (
  <AnimatedIcon animation="bounce" className={className}>
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <path
        d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.7088 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2401 3.61096 17.4111C2.43727 15.5821 1.87979 13.4116 2.02168 11.2339C2.16356 9.0561 2.99721 6.95472 4.39828 5.29134C5.79935 3.62797 7.69279 2.49011 9.79619 2.03637C11.8996 1.58262 14.1003 1.83691 16.07 2.75999"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-draw"
      />
      <path
        d="M22 4L12 14.01L9 11.01"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-draw"
        style={{ animationDelay: "0.5s" }}
      />
    </svg>
  </AnimatedIcon>
);

export const AnimatedAlertIcon: React.FC<{ className?: string }> = ({
  className,
}) => (
  <AnimatedIcon animation="wiggle" className={className}>
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <path
        d="M10.29 3.86L1.82 18C1.64547 18.3024 1.5729 18.6453 1.61211 18.9873C1.65132 19.3293 1.80054 19.6547 2.04019 19.9105C2.27984 20.1663 2.59912 20.3398 2.94806 20.4053C3.297 20.4708 3.65964 20.4253 3.98 20.275L21.18 12.275C21.5053 12.1225 21.7787 11.8802 21.9652 11.5779C22.1517 11.2756 22.2439 10.9268 22.2301 10.5743C22.2163 10.2218 22.0972 9.88126 21.8881 9.59876C21.679 9.31626 21.3889 9.10391 21.06 8.99L10.29 3.86Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-draw"
      />
      <path
        d="M22 12L12 2L9 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-draw"
        style={{ animationDelay: "0.3s" }}
      />
    </svg>
  </AnimatedIcon>
);

export const AnimatedStarIcon: React.FC<{ className?: string }> = ({
  className,
}) => (
  <AnimatedIcon animation="twinkle" className={className}>
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <path
        d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-draw"
      />
    </svg>
  </AnimatedIcon>
);

// Decorative animated elements
export const AnimatedDots: React.FC<{ className?: string }> = ({
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

export const AnimatedWave: React.FC<{ className?: string }> = ({
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

export const AnimatedProgressBar: React.FC<{
  progress: number;
  className?: string;
  animated?: boolean;
}> = ({ progress, className, animated = true }) => (
  <div className={cn("w-full bg-muted rounded-full h-2", className)}>
    <div
      className={cn(
        "h-2 bg-gradient-primary rounded-full transition-all duration-1000 ease-out",
        animated && "animate-pulse"
      )}
      style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
    />
  </div>
);

// Add wiggle animation to CSS
const wiggleKeyframes = `
@keyframes wiggle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(5deg); }
  75% { transform: rotate(-5deg); }
}
`;

// Inject the animation into the document
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = wiggleKeyframes;
  document.head.appendChild(style);
}
