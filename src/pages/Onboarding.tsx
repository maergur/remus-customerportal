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
import { AnimatedStepWrapper } from '@/components/onboarding/AnimatedStepWrapper';
import { OnboardingIllustration } from '@/components/onboarding/OnboardingIllustration';
import remusLogo from '@/assets/remus-logo.svg';
import { useTheme } from '@/contexts/ThemeContext';

const TOTAL_STEPS = 7;

const OnboardingContent = () => {
  const { data } = useOnboarding();
  const { theme } = useTheme();

  // Special case for industrial subscribers
  if (data.step === 99) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-center lg:justify-start">
              <img 
                src={remusLogo} 
                alt="Remus Enerji" 
                className={`h-10 ${theme === 'dark' ? 'brightness-0 invert' : ''}`}
              />
            </div>
          </div>
        </header>
        <div className="flex min-h-[calc(100vh-73px)]">
          {/* Form Section */}
          <div className="flex-1 lg:w-1/2">
            <div className="container mx-auto px-4 py-6 lg:max-w-xl">
              <AnimatedStepWrapper stepKey={99}>
                <IndustrialContactStep />
              </AnimatedStepWrapper>
            </div>
          </div>
          {/* Illustration Section - Hidden on mobile */}
          <div className="hidden lg:block lg:w-1/2 p-6">
            <OnboardingIllustration step={99} className="h-full min-h-[500px]" />
          </div>
        </div>
      </div>
    );
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center lg:justify-start">
            <img 
              src={remusLogo} 
              alt="Remus Enerji" 
              className={`h-10 ${theme === 'dark' ? 'brightness-0 invert' : ''}`}
            />
          </div>
        </div>
      </header>

      {/* Main Content - Split Layout */}
      <div className="flex min-h-[calc(100vh-73px)]">
        {/* Form Section */}
        <div className="flex-1 lg:w-1/2 overflow-y-auto">
          <div className="container mx-auto px-4 py-6 lg:max-w-xl">
            {/* Progress - Only show for steps 1-7 */}
            {data.step <= TOTAL_STEPS && (
              <div className="mb-6">
                <OnboardingProgress currentStep={data.step} totalSteps={TOTAL_STEPS} />
              </div>
            )}

            {/* Step Content with Animation */}
            <AnimatedStepWrapper stepKey={data.step}>
              {renderStep()}
            </AnimatedStepWrapper>
          </div>
        </div>

        {/* Illustration Section - Hidden on mobile */}
        <div className="hidden lg:block lg:w-1/2 p-6 sticky top-0 h-screen">
          <OnboardingIllustration step={data.step} className="h-full min-h-[500px]" />
        </div>
      </div>
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
