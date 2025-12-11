import { useOnboarding, OnboardingProvider } from '@/contexts/OnboardingContext';
import { OnboardingProgress } from '@/components/onboarding/OnboardingProgress';
import { PersonalInfoStep } from '@/components/onboarding/steps/PersonalInfoStep';
import { PhoneVerificationStep } from '@/components/onboarding/steps/PhoneVerificationStep';
import { TariffSelectionStep } from '@/components/onboarding/steps/TariffSelectionStep';
import { IdentityStep } from '@/components/onboarding/steps/IdentityStep';
import { EtsoCodeStep } from '@/components/onboarding/steps/EtsoCodeStep';
import { AddressConfirmStep } from '@/components/onboarding/steps/AddressConfirmStep';
import { CorporateInfoStep } from '@/components/onboarding/steps/CorporateInfoStep';
import { DocumentUploadStep } from '@/components/onboarding/steps/DocumentUploadStep';
import { ContractStep } from '@/components/onboarding/steps/ContractStep';
import { ApplicationStatusStep } from '@/components/onboarding/steps/ApplicationStatusStep';
import { IndustrialContactStep } from '@/components/onboarding/steps/IndustrialContactStep';
import { Zap } from 'lucide-react';

const TOTAL_STEPS = 10;

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
        return <IdentityStep />;
      case 5:
        return <EtsoCodeStep />;
      case 6:
        return <AddressConfirmStep />;
      case 7:
        return <CorporateInfoStep />;
      case 8:
        return <DocumentUploadStep />;
      case 9:
        return <ContractStep />;
      case 10:
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
          <div className="flex items-center justify-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Remus Enerji</span>
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="container mx-auto px-4 py-6">
        <OnboardingProgress currentStep={data.step} totalSteps={TOTAL_STEPS} />
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 pb-12">
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
