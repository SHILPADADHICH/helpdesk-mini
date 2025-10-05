"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div
      className={`transition-all duration-500 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      {children}
    </div>
  );
}

// Animated wrapper for components
export const AnimatedWrapper: React.FC<{
  children: React.ReactNode;
  delay?: number;
  className?: string;
}> = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transition-all duration-700 ease-out ${className} ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-8 scale-95"
      }`}
    >
      {children}
    </div>
  );
};

// Staggered animation for lists
export const StaggeredList: React.FC<{
  children: React.ReactNode[];
  delay?: number;
  className?: string;
}> = ({ children, delay = 100, className = "" }) => {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <AnimatedWrapper key={index} delay={index * delay}>
          {child}
        </AnimatedWrapper>
      ))}
    </div>
  );
};

// Loading state with smooth transitions
export const LoadingTransition: React.FC<{
  isLoading: boolean;
  children: React.ReactNode;
  loadingComponent?: React.ReactNode;
}> = ({ isLoading, children, loadingComponent }) => {
  const [showContent, setShowContent] = useState(!isLoading);

  useEffect(() => {
    if (isLoading) {
      setShowContent(false);
    } else {
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return (
    <div className="relative">
      {isLoading && (
        <div className="animate-fade-in">
          {loadingComponent || (
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <div className="text-lg text-muted-foreground">Loading...</div>
              </div>
            </div>
          )}
        </div>
      )}

      {showContent && !isLoading && (
        <div className="animate-fade-in">{children}</div>
      )}
    </div>
  );
};
