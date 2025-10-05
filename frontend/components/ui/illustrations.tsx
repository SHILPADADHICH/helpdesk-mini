import * as React from "react";
import { cn } from "@/lib/utils";

// Base illustration wrapper with animations
const IllustrationWrapper: React.FC<{
  children: React.ReactNode;
  className?: string;
  animated?: boolean;
}> = ({ children, className, animated = true }) => (
  <div className={cn("relative", animated && "animate-float", className)}>
    {children}
  </div>
);

// Empty State Illustrations
export const EmptyTicketsIllustration: React.FC<{ className?: string }> = ({
  className,
}) => (
  <IllustrationWrapper className={className}>
    <svg
      width="200"
      height="200"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* Background circles */}
      <circle
        cx="100"
        cy="100"
        r="80"
        fill="url(#emptyGradient1)"
        opacity="0.1"
        className="animate-pulse"
      />
      <circle
        cx="100"
        cy="100"
        r="60"
        fill="url(#emptyGradient2)"
        opacity="0.2"
        className="animate-pulse"
        style={{ animationDelay: "0.5s" }}
      />

      {/* Main ticket */}
      <rect
        x="60"
        y="70"
        width="80"
        height="60"
        rx="8"
        fill="url(#ticketGradient)"
        className="animate-bounce"
        style={{ animationDuration: "3s" }}
      />

      {/* Ticket holes */}
      <circle cx="70" cy="100" r="3" fill="white" opacity="0.8" />
      <circle cx="130" cy="100" r="3" fill="white" opacity="0.8" />

      {/* Ticket content */}
      <rect
        x="70"
        y="80"
        width="60"
        height="4"
        rx="2"
        fill="white"
        opacity="0.6"
      />
      <rect
        x="70"
        y="90"
        width="40"
        height="3"
        rx="1.5"
        fill="white"
        opacity="0.4"
      />
      <rect
        x="70"
        y="100"
        width="50"
        height="3"
        rx="1.5"
        fill="white"
        opacity="0.4"
      />

      {/* Floating elements */}
      <circle
        cx="40"
        cy="50"
        r="4"
        fill="url(#accentGradient)"
        className="animate-float"
        style={{ animationDelay: "1s" }}
      />
      <circle
        cx="160"
        cy="60"
        r="3"
        fill="url(#accentGradient)"
        className="animate-float"
        style={{ animationDelay: "2s" }}
      />
      <circle
        cx="50"
        cy="150"
        r="2"
        fill="url(#accentGradient)"
        className="animate-float"
        style={{ animationDelay: "1.5s" }}
      />

      {/* Gradients */}
      <defs>
        <linearGradient id="emptyGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5a189a" />
          <stop offset="100%" stopColor="#c77dff" />
        </linearGradient>
        <linearGradient id="emptyGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7b2cbf" />
          <stop offset="100%" stopColor="#e0aaff" />
        </linearGradient>
        <linearGradient id="ticketGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5a189a" />
          <stop offset="50%" stopColor="#7b2cbf" />
          <stop offset="100%" stopColor="#9d4edd" />
        </linearGradient>
        <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c77dff" />
          <stop offset="100%" stopColor="#e0aaff" />
        </linearGradient>
      </defs>
    </svg>
  </IllustrationWrapper>
);

export const LoginIllustration: React.FC<{ className?: string }> = ({
  className,
}) => (
  <IllustrationWrapper className={className}>
    <svg
      width="300"
      height="200"
      viewBox="0 0 300 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* Background */}
      <rect width="300" height="200" fill="url(#loginBg)" />

      {/* Floating shapes */}
      <circle
        cx="50"
        cy="50"
        r="20"
        fill="url(#shape1)"
        opacity="0.3"
        className="animate-float"
      />
      <circle
        cx="250"
        cy="80"
        r="15"
        fill="url(#shape2)"
        opacity="0.4"
        className="animate-float"
        style={{ animationDelay: "1s" }}
      />
      <circle
        cx="80"
        cy="150"
        r="12"
        fill="url(#shape3)"
        opacity="0.3"
        className="animate-float"
        style={{ animationDelay: "2s" }}
      />

      {/* Main illustration - Shield with checkmark */}
      <g className="animate-scale-in" style={{ animationDelay: "0.5s" }}>
        <path
          d="M150 30 L180 50 L180 120 C180 140 150 160 150 160 C150 160 120 140 120 120 L120 50 Z"
          fill="url(#shieldGradient)"
          className="animate-pulse"
        />
        <path
          d="M140 100 L145 105 L160 90"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-draw"
          style={{ animationDelay: "1s" }}
        />
      </g>

      {/* Decorative elements */}
      <rect
        x="20"
        y="20"
        width="4"
        height="4"
        fill="url(#accent)"
        className="animate-twinkle"
      />
      <rect
        x="280"
        y="30"
        width="3"
        height="3"
        fill="url(#accent)"
        className="animate-twinkle"
        style={{ animationDelay: "0.5s" }}
      />
      <rect
        x="30"
        y="170"
        width="2"
        height="2"
        fill="url(#accent)"
        className="animate-twinkle"
        style={{ animationDelay: "1s" }}
      />

      <defs>
        <linearGradient id="loginBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10002b" />
          <stop offset="50%" stopColor="#240046" />
          <stop offset="100%" stopColor="#3c096c" />
        </linearGradient>
        <linearGradient id="shape1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5a189a" />
          <stop offset="100%" stopColor="#c77dff" />
        </linearGradient>
        <linearGradient id="shape2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7b2cbf" />
          <stop offset="100%" stopColor="#e0aaff" />
        </linearGradient>
        <linearGradient id="shape3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9d4edd" />
          <stop offset="100%" stopColor="#c77dff" />
        </linearGradient>
        <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5a189a" />
          <stop offset="50%" stopColor="#7b2cbf" />
          <stop offset="100%" stopColor="#9d4edd" />
        </linearGradient>
        <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c77dff" />
          <stop offset="100%" stopColor="#e0aaff" />
        </linearGradient>
      </defs>
    </svg>
  </IllustrationWrapper>
);

export const SuccessIllustration: React.FC<{ className?: string }> = ({
  className,
}) => (
  <IllustrationWrapper className={className}>
    <svg
      width="200"
      height="200"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* Background circle */}
      <circle
        cx="100"
        cy="100"
        r="80"
        fill="url(#successBg)"
        opacity="0.1"
        className="animate-pulse"
      />

      {/* Success checkmark */}
      <g className="animate-scale-in">
        <circle
          cx="100"
          cy="100"
          r="60"
          fill="url(#successCircle)"
          className="animate-bounce"
          style={{ animationDuration: "2s" }}
        />
        <path
          d="M75 100 L90 115 L125 80"
          stroke="white"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-draw"
          style={{ animationDelay: "0.5s" }}
        />
      </g>

      {/* Confetti */}
      <g className="animate-confetti">
        <rect
          x="40"
          y="40"
          width="4"
          height="8"
          fill="url(#confetti1)"
          transform="rotate(45 42 44)"
        />
        <rect
          x="160"
          y="50"
          width="3"
          height="6"
          fill="url(#confetti2)"
          transform="rotate(-30 161.5 53)"
        />
        <rect
          x="50"
          y="160"
          width="3"
          height="7"
          fill="url(#confetti3)"
          transform="rotate(60 51.5 163.5)"
        />
        <rect
          x="150"
          y="150"
          width="4"
          height="5"
          fill="url(#confetti4)"
          transform="rotate(-45 152 152.5)"
        />
      </g>

      <defs>
        <linearGradient id="successBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5a189a" />
          <stop offset="100%" stopColor="#c77dff" />
        </linearGradient>
        <linearGradient id="successCircle" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5a189a" />
          <stop offset="50%" stopColor="#7b2cbf" />
          <stop offset="100%" stopColor="#9d4edd" />
        </linearGradient>
        <linearGradient id="confetti1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c77dff" />
          <stop offset="100%" stopColor="#e0aaff" />
        </linearGradient>
        <linearGradient id="confetti2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5a189a" />
          <stop offset="100%" stopColor="#7b2cbf" />
        </linearGradient>
        <linearGradient id="confetti3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9d4edd" />
          <stop offset="100%" stopColor="#c77dff" />
        </linearGradient>
        <linearGradient id="confetti4" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7b2cbf" />
          <stop offset="100%" stopColor="#e0aaff" />
        </linearGradient>
      </defs>
    </svg>
  </IllustrationWrapper>
);

export const LoadingIllustration: React.FC<{ className?: string }> = ({
  className,
}) => (
  <IllustrationWrapper className={className}>
    <svg
      width="200"
      height="200"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* Rotating gear */}
      <g className="animate-spin" style={{ animationDuration: "3s" }}>
        <circle cx="100" cy="100" r="60" fill="url(#gearBg)" opacity="0.1" />
        <path
          d="M100 40 L110 50 L120 40 L130 50 L120 60 L110 50 Z"
          fill="url(#gearGradient)"
        />
        <circle cx="100" cy="100" r="8" fill="url(#gearCenter)" />
      </g>

      {/* Orbiting dots */}
      <circle
        cx="100"
        cy="100"
        r="80"
        stroke="url(#orbit)"
        strokeWidth="1"
        fill="none"
        opacity="0.3"
      />
      <circle
        cx="180"
        cy="100"
        r="4"
        fill="url(#dot1)"
        className="animate-orbit"
        style={{ animationDuration: "2s" }}
      />
      <circle
        cx="20"
        cy="100"
        r="3"
        fill="url(#dot2)"
        className="animate-orbit"
        style={{ animationDuration: "2s", animationDelay: "1s" }}
      />

      <defs>
        <linearGradient id="gearBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5a189a" />
          <stop offset="100%" stopColor="#c77dff" />
        </linearGradient>
        <linearGradient id="gearGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5a189a" />
          <stop offset="50%" stopColor="#7b2cbf" />
          <stop offset="100%" stopColor="#9d4edd" />
        </linearGradient>
        <linearGradient id="gearCenter" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c77dff" />
          <stop offset="100%" stopColor="#e0aaff" />
        </linearGradient>
        <linearGradient id="orbit" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5a189a" />
          <stop offset="100%" stopColor="#c77dff" />
        </linearGradient>
        <linearGradient id="dot1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c77dff" />
          <stop offset="100%" stopColor="#e0aaff" />
        </linearGradient>
        <linearGradient id="dot2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7b2cbf" />
          <stop offset="100%" stopColor="#9d4edd" />
        </linearGradient>
      </defs>
    </svg>
  </IllustrationWrapper>
);

export const ErrorIllustration: React.FC<{ className?: string }> = ({
  className,
}) => (
  <IllustrationWrapper className={className}>
    <svg
      width="200"
      height="200"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* Background */}
      <circle
        cx="100"
        cy="100"
        r="80"
        fill="url(#errorBg)"
        opacity="0.1"
        className="animate-pulse"
      />

      {/* Error icon */}
      <g className="animate-shake">
        <circle
          cx="100"
          cy="100"
          r="60"
          fill="url(#errorCircle)"
          className="animate-bounce"
          style={{ animationDuration: "1s" }}
        />
        <path
          d="M80 80 L120 120 M120 80 L80 120"
          stroke="white"
          strokeWidth="6"
          strokeLinecap="round"
          className="animate-draw"
          style={{ animationDelay: "0.3s" }}
        />
      </g>

      {/* Warning sparks */}
      <g className="animate-sparkle">
        <path
          d="M50 50 L55 45 L60 50 L55 55 Z"
          fill="url(#spark1)"
          className="animate-twinkle"
        />
        <path
          d="M150 60 L155 55 L160 60 L155 65 Z"
          fill="url(#spark2)"
          className="animate-twinkle"
          style={{ animationDelay: "0.5s" }}
        />
        <path
          d="M60 150 L65 145 L70 150 L65 155 Z"
          fill="url(#spark3)"
          className="animate-twinkle"
          style={{ animationDelay: "1s" }}
        />
      </g>

      <defs>
        <linearGradient id="errorBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#fca5a5" />
        </linearGradient>
        <linearGradient id="errorCircle" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="50%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#b91c1c" />
        </linearGradient>
        <linearGradient id="spark1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <linearGradient id="spark2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <linearGradient id="spark3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
    </svg>
  </IllustrationWrapper>
);

// Decorative elements
export const FloatingShapes: React.FC<{ className?: string }> = ({
  className,
}) => (
  <div
    className={cn(
      "absolute inset-0 overflow-hidden pointer-events-none",
      className
    )}
  >
    <div className="absolute top-10 left-10 w-4 h-4 bg-primary/20 rounded-full animate-float" />
    <div
      className="absolute top-20 right-20 w-3 h-3 bg-accent/30 rounded-full animate-float"
      style={{ animationDelay: "1s" }}
    />
    <div
      className="absolute bottom-20 left-20 w-2 h-2 bg-secondary/40 rounded-full animate-float"
      style={{ animationDelay: "2s" }}
    />
    <div
      className="absolute bottom-10 right-10 w-5 h-5 bg-primary/10 rounded-full animate-float"
      style={{ animationDelay: "0.5s" }}
    />
  </div>
);

export const GradientOrb: React.FC<{
  size?: "sm" | "md" | "lg";
  className?: string;
}> = ({ size = "md", className }) => {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  return (
    <div
      className={cn(
        "gradient-primary rounded-full animate-pulse",
        sizeClasses[size],
        className
      )}
      style={{
        background:
          "radial-gradient(circle, rgba(90,24,154,0.8) 0%, rgba(199,125,255,0.4) 50%, transparent 100%)",
        animation: "pulse 3s ease-in-out infinite",
      }}
    />
  );
};
