import { useOnboarding, OnboardingProvider } from '@/contexts/OnboardingContext';
import { OnboardingProgress } from '@/components/onboarding/OnboardingProgress';
import { PersonalInfoStep } from '@/components/onboarding/steps/PersonalInfoStep';
import { PhoneVerificationStep } from '@/components/onboarding/steps/PhoneVerificationStep';
import { TariffSelectionStep } from '@/components/onboarding/steps/TariffSelectionStep';
import { IdentityEtsoStep } from '@/components/onboarding/steps/IdentityEtsoStep';
import { CorporateInfoStep } from '@/components/onboarding/steps/CorporateInfoStep';
import { DocumentUploadStep } from '@/components/onboarding/steps/DocumentUploadStep';
import { ContractStep } from '@/components/onboarding/steps/ContractStep';
import { ApplicationStatusStep } from '@/components/onboarding/steps/ApplicationStatusStep';
import { IndustrialContactStep } from '@/components/onboarding/steps/IndustrialContactStep';
import { FloatingHelpButton } from '@/components/shared/FloatingHelpButton';
import remusLogo from '@/assets/remus-logo.svg';
import { useTheme } from '@/contexts/ThemeContext';
import { useEffect, useState, useRef } from 'react';
import { Zap, Sun, Leaf } from 'lucide-react';

const TOTAL_STEPS = 7;

const OnboardingContent = () => {
  const { data } = useOnboarding();
  const { setTheme } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const prevStep = useRef(data.step);

  // Force light theme on onboarding
  useEffect(() => {
    setTheme('light');
  }, [setTheme]);

  // Handle step transition animation
  useEffect(() => {
    if (prevStep.current !== data.step) {
      setDirection(data.step > prevStep.current ? 'forward' : 'backward');
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 50);
      prevStep.current = data.step;
      return () => clearTimeout(timer);
    }
  }, [data.step]);

  // Special case for industrial subscribers
  if (data.step === 99) {
    return <IndustrialContactStep />;
  }

  const renderStep = () => {
    switch (data.step) {
      case 1:
        return <PersonalInfoStep />;
      case 2:
        return <PhoneVerificationStep />;
      case 3:
        return <TariffSelectionStep />;
      case 4:
        return <IdentityEtsoStep />;
      case 5:
        return <CorporateInfoStep />;
      case 6:
        return <DocumentUploadStep />;
      case 7:
        return <ContractStep />;
      case 8:
        return <ApplicationStatusStep />;
      default:
        return <PersonalInfoStep />;
    }
  };

  const animationClass = isAnimating 
    ? 'opacity-0' 
    : direction === 'forward' 
      ? 'animate-slide-in-right' 
      : 'animate-slide-in-left';

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Energy-themed decorative illustrations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top right - sun/energy burst */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <Sun className="absolute top-16 right-12 w-8 h-8 text-primary/10 animate-pulse hidden md:block" style={{ animationDuration: '3s' }} />
        
        {/* Left side - zap/bolt */}
        <div className="absolute top-1/3 -left-16 w-48 h-48 bg-primary/5 rounded-full blur-2xl" />
        <Zap className="absolute top-1/4 left-8 w-6 h-6 text-primary/10 hidden md:block" style={{ transform: 'rotate(-15deg)' }} />
        
        {/* Bottom - leaf/eco element */}
        <div className="absolute -bottom-24 left-1/4 w-56 h-56 bg-primary/5 rounded-full blur-3xl" />
        <Leaf className="absolute bottom-20 left-16 w-7 h-7 text-primary/10 hidden md:block" style={{ transform: 'rotate(25deg)' }} />
        
        {/* Right side mid */}
        <Zap className="absolute top-1/2 right-8 w-5 h-5 text-primary/8 hidden lg:block" style={{ transform: 'rotate(15deg)' }} />
        
        {/* Bottom right glow */}
        <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-primary/5 rounded-full blur-2xl" />
      </div>

      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <img 
              src={remusLogo} 
              alt="Remus Enerji" 
              className="h-10"
            />
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="container mx-auto px-4 py-6 relative z-10">
        <OnboardingProgress currentStep={data.step} totalSteps={TOTAL_STEPS} />
      </div>

      {/* Content with step transition animation */}
      <main className="container mx-auto px-4 pb-12 relative z-10">
        <div key={data.step} className={`transition-all duration-300 ${animationClass}`}>
          {renderStep()}
        </div>
      </main>

      {/* Global floating help button */}
      <FloatingHelpButton />
    </div>
  );
};

const Onboarding = () => {
  return (
    <OnboardingProvider>
      <OnboardingContent />
    </OnboardingProvider>
  );
};

export default Onboarding;
