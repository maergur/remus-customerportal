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
import remusLogo from '@/assets/remus-logo.svg';
import solarHero from '@/assets/solar-hero.jpg';

const TOTAL_STEPS = 7;

const stepConfig: Record<number, { title: string; subtitle: string }> = {
  1: { title: 'Temiz Enerjiye', subtitle: 'Adım Atın' },
  2: { title: 'Güvenli', subtitle: 'Doğrulama' },
  3: { title: 'Size Özel', subtitle: 'Tarifeler' },
  4: { title: 'Hızlı', subtitle: 'Kimlik Doğrulama' },
  5: { title: 'Kurumsal', subtitle: 'Çözümler' },
  6: { title: 'Kolay', subtitle: 'Belge Yükleme' },
  7: { title: 'Son Adım', subtitle: 'Sözleşme' },
  8: { title: 'Tebrikler!', subtitle: 'Başvurunuz Alındı' },
  99: { title: 'Sanayi', subtitle: 'Çözümleri' }
};

const OnboardingContent = () => {
  const { data } = useOnboarding();
  const config = stepConfig[data.step] || stepConfig[1];

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
      case 99:
        return <IndustrialContactStep />;
      default:
        return <PersonalInfoStep />;
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Full screen background image */}
      <div className="fixed inset-0 -z-10">
        <img
          src={solarHero}
          alt="Background"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/30" />
      </div>

      {/* Header */}
      <header className="relative z-10 py-4 px-6">
        <img 
          src={remusLogo} 
          alt="Remus Enerji" 
          className="h-8 brightness-0 invert"
        />
      </header>

      {/* Main content */}
      <div className="relative z-10 min-h-[calc(100vh-72px)] flex items-center">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-16">
            {/* Left side - Title */}
            <div className="lg:flex-1 hidden lg:block">
              <h1 className="text-5xl xl:text-6xl font-bold text-white leading-tight">
                {config.title}
                <br />
                <span className="text-white/80">{config.subtitle}</span>
              </h1>
            </div>

            {/* Right side - Form */}
            <div className="w-full lg:w-[480px] lg:flex-shrink-0">
              <div className="bg-card/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 lg:p-8">
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
          </div>
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
