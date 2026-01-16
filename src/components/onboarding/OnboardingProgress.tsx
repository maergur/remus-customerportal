import { Check, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useOnboarding } from '@/contexts/OnboardingContext';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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
  const { goToStep, resetOnboarding } = useOnboarding();
  const progressPercent = ((currentStep - 1) / (totalSteps - 1)) * 100;

  const handleStepClick = (step: number) => {
    // Sadece geçmiş adımlara veya mevcut adıma gidilebilir
    if (step <= currentStep) {
      goToStep(step);
    }
  };

  const handleReset = () => {
    if (confirm('Tüm onboarding verilerini sıfırlamak istediğinize emin misiniz?')) {
      resetOnboarding();
    }
  };

  return (
    <div className="w-full py-3">
      {/* Mobile: Simple progress bar with step indicator */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2 text-sm">
          <span className="font-medium text-foreground">
            {stepLabels[currentStep - 1]}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">
              {currentStep}/{totalSteps}
            </span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={handleReset}
                  >
                    <RotateCcw className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Baştan Başla</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <Progress value={progressPercent} className="h-2" />
        {/* Mobile step navigation */}
        <div className="flex justify-center gap-1 mt-3">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
            <button
              key={step}
              onClick={() => handleStepClick(step)}
              disabled={step > currentStep}
              className={cn(
                'w-2 h-2 rounded-full transition-all',
                step === currentStep
                  ? 'bg-primary w-4'
                  : step < currentStep
                  ? 'bg-primary/60 hover:bg-primary cursor-pointer'
                  : 'bg-muted cursor-not-allowed'
              )}
            />
          ))}
        </div>
      </div>

      {/* Desktop: Compact step indicators */}
      <div className="hidden md:block">
        <div className="flex items-center justify-center gap-2 mb-2">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
            <div key={step} className="flex items-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => handleStepClick(step)}
                      disabled={step > currentStep}
                      className={cn(
                        'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-all',
                        step < currentStep
                          ? 'bg-primary text-primary-foreground hover:ring-2 hover:ring-primary/30 cursor-pointer'
                          : step === currentStep
                          ? 'bg-primary text-primary-foreground ring-2 ring-primary/30'
                          : 'bg-muted text-muted-foreground cursor-not-allowed',
                        step <= currentStep && 'hover:scale-110'
                      )}
                    >
                      {step < currentStep ? <Check className="w-3 h-3" /> : step}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{stepLabels[step - 1]}</p>
                    {step > currentStep && (
                      <p className="text-xs text-muted-foreground">Henüz tamamlanmadı</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
          
          {/* Reset button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 ml-2"
                  onClick={handleReset}
                >
                  <RotateCcw className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Baştan Başla</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="text-center text-xs text-muted-foreground">
          {stepLabels[currentStep - 1]}
        </p>
      </div>
    </div>
  );
};
