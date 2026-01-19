import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { HeroSection } from "@/components/dashboard/HeroSection";
import { QuickActions, QuickActionsChart } from "@/components/dashboard/QuickActions";
import { InvoiceWidget } from "@/components/dashboard/InvoiceWidget";
import { useLanguage } from "@/contexts/LanguageContext";
import { ApplicationStatus } from "@/contexts/OnboardingContext";
import { getSession } from "@/lib/mockCustomers";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // First check if user has an active session
    const session = getSession();
    if (session) {
      // User is logged in via auth flow
      setIsLoading(false);
      return;
    }

    // Fallback: Check onboarding data for legacy flow
    const saved = localStorage.getItem('onboardingData');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const status: ApplicationStatus = parsed.applicationStatus || 'PENDING';
        
        // Redirect to onboarding if application is not accepted
        if (status !== 'ACCEPTED') {
          navigate('/giris', { replace: true });
          return;
        }
        setIsLoading(false);
      } catch {
        // No valid data, redirect to login
        navigate('/giris', { replace: true });
        return;
      }
    } else {
      // No session and no onboarding data, redirect to login
      navigate('/giris', { replace: true });
      return;
    }
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
      <div className="flex flex-1 flex-col gap-4 animate-page-enter min-h-0">
        {/* Top Row: Hero + Quick Actions */}
        <div data-tour="dashboard-summary" className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <HeroSection />
          </div>
          <div className="lg:col-span-1">
            <QuickActions />
          </div>
        </div>

        {/* Second Row: Invoice + Chart */}
        <section className="flex flex-1 flex-col min-h-0">
          <h3 className="text-base font-semibold text-foreground mb-3">
            {t("quickActions")}
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 flex-1 min-h-0">
            <div data-tour="invoice-widget">
              <InvoiceWidget compact />
            </div>
            <div className="lg:col-span-4 h-full min-h-0">
              <QuickActionsChart />
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Index;
