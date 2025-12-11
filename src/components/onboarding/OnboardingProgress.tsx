import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
}

const stepLabels = [
  'Kişisel Bilgiler',
  'Doğrulama',
  'Tarife Seçimi',
  'Kimlik & Adres',
  'Kurumsal Bilgiler',
  'Belgeler',
  'Sözleşme',
  'Sonuç',
];

export const OnboardingProgress = ({ currentStep, totalSteps }: OnboardingProgressProps) => {
  const progressPercent = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="w-full py-3">
      {/* Mobile: Simple progress bar with step indicator */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2 text-sm">
          <span className="font-medium text-foreground">
            {stepLabels[currentStep - 1]}
          </span>
          <span className="text-muted-foreground">
            {currentStep}/{totalSteps}
          </span>
        </div>
        <Progress value={progressPercent} className="h-2" />
      </div>

      {/* Desktop: Compact step indicators */}
      <div className="hidden md:block">
        <div className="flex items-center justify-center gap-2 mb-2">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-all',
                  step < currentStep
                    ? 'bg-primary text-primary-foreground'
                    : step === currentStep
                    ? 'bg-primary text-primary-foreground ring-2 ring-primary/30'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {step < currentStep ? <Check className="w-3 h-3" /> : step}
              </div>
              {step < totalSteps && (
                <div
                  className={cn(
                    'h-0.5 w-6 mx-0.5',
                    step < currentStep ? 'bg-primary' : 'bg-muted'
                  )}
                />
              )}
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-muted-foreground">
          {stepLabels[currentStep - 1]}
        </p>
      </div>
    </div>
  );
};