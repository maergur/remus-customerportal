import { useOnboardingIllustration } from '@/hooks/useOnboardingIllustration';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface OnboardingIllustrationProps {
  step: number;
  className?: string;
}

export const OnboardingIllustration = ({ step, className }: OnboardingIllustrationProps) => {
  const { imageUrl, isLoading, error } = useOnboardingIllustration(step);
  const [isImageVisible, setIsImageVisible] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  useEffect(() => {
    if (imageUrl && imageUrl !== currentImage) {
      // Fade out current image
      setIsImageVisible(false);
      
      // After fade out, update image and fade in
      const timeout = setTimeout(() => {
        setCurrentImage(imageUrl);
        setIsImageVisible(true);
      }, 300);

      return () => clearTimeout(timeout);
    }
  }, [imageUrl, currentImage]);

  return (
    <div 
      className={cn(
        'relative h-full w-full overflow-hidden rounded-3xl bg-gradient-to-br from-primary/5 via-background to-primary/10',
        className
      )}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--energy-blue)/0.1),transparent_50%)]" />
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
            <p className="text-sm text-muted-foreground animate-pulse">
              Görsel oluşturuluyor...
            </p>
          </div>
        </div>
      )}

      {/* Image */}
      {currentImage && (
        <div 
          className={cn(
            'absolute inset-0 flex items-center justify-center p-8 transition-all duration-500 ease-out',
            isImageVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          )}
        >
          <img
            src={currentImage}
            alt="Onboarding illustration"
            className="max-h-full max-w-full object-contain drop-shadow-2xl animate-float"
          />
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && !currentImage && (
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="text-center text-muted-foreground">
            <p className="text-sm">Görsel yüklenemedi</p>
          </div>
        </div>
      )}

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
      <div className="absolute top-4 right-4 h-16 w-16 rounded-full bg-primary/10 blur-2xl animate-pulse-glow" />
      <div className="absolute bottom-8 left-8 h-24 w-24 rounded-full bg-energy-blue/10 blur-3xl" />
    </div>
  );
};
