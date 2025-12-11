import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { HeroSection } from "@/components/dashboard/HeroSection";
import { ReferralWidget } from "@/components/dashboard/ReferralWidget";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { InvoiceWidget } from "@/components/dashboard/InvoiceWidget";
import { OnboardingStatusWidget } from "@/components/dashboard/OnboardingStatusWidget";
import { useLanguage } from "@/contexts/LanguageContext";
import { ApplicationStatus } from "@/contexts/OnboardingContext";
import { useEffect, useState } from "react";

const TOTAL_ONBOARDING_STEPS = 8;

const Index = () => {
  const { t } = useLanguage();
  
  // Read onboarding state from localStorage (safe approach without provider)
  const [onboardingState, setOnboardingState] = useState<{
    status: ApplicationStatus;
    step: number;
    rejectionNote: string;
  } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('onboardingData');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setOnboardingState({
          status: parsed.applicationStatus || 'PENDING',
          step: parsed.step || 1,
          rejectionNote: parsed.rejectionNote || '',
        });
      } catch {
        setOnboardingState(null);
      }
    }
  }, []);

  // Show hero if: no onboarding data, or application is accepted
  const showHero = !onboardingState || onboardingState.status === 'ACCEPTED';
  
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 min-h-[calc(100vh-8rem)]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          <div className="lg:col-span-2 min-h-[264px]">
            {showHero ? (
              <HeroSection />
            ) : (
              <OnboardingStatusWidget
                status={onboardingState.status}
                currentStep={onboardingState.step}
                totalSteps={TOTAL_ONBOARDING_STEPS}
                rejectionNote={onboardingState.rejectionNote}
              />
            )}
          </div>
          <div className="lg:col-span-1 min-h-[264px]">
            <InvoiceWidget />
          </div>
        </div>
        
        <section className="flex-1 flex flex-col">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            {t("quickActions")}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
            <QuickActions />
            <ReferralWidget />
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Index;
