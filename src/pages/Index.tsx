import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { HeroSection } from "@/components/dashboard/HeroSection";
import { QuickActions, QuickActionsChart } from "@/components/dashboard/QuickActions";
import { InvoiceWidget } from "@/components/dashboard/InvoiceWidget";
import { useLanguage } from "@/contexts/LanguageContext";
import { ApplicationStatus } from "@/contexts/OnboardingContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('onboardingData');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const status: ApplicationStatus = parsed.applicationStatus || 'PENDING';
        
        // Redirect to onboarding if application is not accepted
        if (status !== 'ACCEPTED') {
          navigate('/onboarding', { replace: true });
          return;
        }
      } catch {
        // No valid data, redirect to onboarding
        navigate('/onboarding', { replace: true });
        return;
      }
    } else {
      // No onboarding data at all, redirect to onboarding
      navigate('/onboarding', { replace: true });
      return;
    }
    setIsLoading(false);
  }, [navigate]);

  // Show loading while checking status
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 animate-page-enter">
        {/* Top Row: Hero + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <HeroSection />
          </div>
          <div className="lg:col-span-1">
            <QuickActions />
          </div>
        </div>
        
        {/* Second Row: Invoice + Chart */}
        <section>
          <h3 className="text-base font-semibold text-foreground mb-3">
            {t("quickActions")}
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <InvoiceWidget compact />
            <div className="lg:col-span-3">
              <QuickActionsChart />
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Index;
