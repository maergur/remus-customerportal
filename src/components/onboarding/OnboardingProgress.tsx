import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
}

const stepLabels = [
  'Kişisel Bilgiler',
  'Doğrulama',
  'Tarife Seçimi',
  'Kimlik & Adres',
  'Fatura Bilgileri',
  'Belgeler',
  'Sözleşme',
  'Sonuç',
];

export const OnboardingProgress = ({ currentStep, totalSteps }: OnboardingProgressProps) => {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between mb-2">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all',
                step < currentStep
                  ? 'bg-primary text-primary-foreground'
                  : step === currentStep
                  ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {step < currentStep ? <Check className="w-4 h-4" /> : step}
            </div>
            {step < totalSteps && (
              <div
                className={cn(
                  'h-1 w-8 md:w-16 mx-1',
                  step < currentStep ? 'bg-primary' : 'bg-muted'
                )}
              />
            )}
          </div>
        ))}
      </div>
      <p className="text-center text-sm text-muted-foreground mt-2">
        {stepLabels[currentStep - 1] || `Adım ${currentStep}`}
      </p>
    </div>
  );
};
