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
import remusLogo from '@/assets/remus-logo.svg';
import { useTheme } from '@/contexts/ThemeContext';

const TOTAL_STEPS = 7;

const OnboardingContent = () => {
  const { data } = useOnboarding();

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

  const { theme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <img 
              src={remusLogo} 
              alt="Remus Enerji" 
              className={`h-10 ${theme === 'dark' ? 'brightness-0 invert' : ''}`}
            />
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="container mx-auto px-4 py-6">
        <OnboardingProgress currentStep={data.step} totalSteps={TOTAL_STEPS} />
      </div>

      {/* Content with animation */}
      <main className="container mx-auto px-4 pb-12 animate-fade-in">
        {renderStep()}
      </main>
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
