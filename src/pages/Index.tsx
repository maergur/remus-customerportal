import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { HeroSection } from "@/components/dashboard/HeroSection";
import { ReferralWidget } from "@/components/dashboard/ReferralWidget";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { InvoiceWidget } from "@/components/dashboard/InvoiceWidget";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const { t } = useLanguage();
  
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 min-h-[calc(100vh-8rem)]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="lg:col-span-2 min-h-[264px]">
          <HeroSection />
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
