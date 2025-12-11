import { ReactNode, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedStepWrapperProps {
  children: ReactNode;
  stepKey: number;
  className?: string;
}

export const AnimatedStepWrapper = ({ children, stepKey, className }: AnimatedStepWrapperProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentKey, setCurrentKey] = useState(stepKey);

  useEffect(() => {
    if (stepKey !== currentKey) {
      // Fade out
      setIsVisible(false);
      
      // After fade out, update key and fade in
      const timeout = setTimeout(() => {
        setCurrentKey(stepKey);
        setIsVisible(true);
      }, 200);

      return () => clearTimeout(timeout);
    } else {
      // Initial mount
      const timeout = setTimeout(() => setIsVisible(true), 50);
      return () => clearTimeout(timeout);
    }
  }, [stepKey, currentKey]);

  return (
    <div
      className={cn(
        'transition-all duration-300 ease-out',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
        className
      )}
    >
      {children}
    </div>
  );
};
