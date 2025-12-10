import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { HeroSection } from "@/components/dashboard/HeroSection";
import { ReferralWidget } from "@/components/dashboard/ReferralWidget";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { InvoiceWidget } from "@/components/dashboard/InvoiceWidget";

const Index = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          <div className="lg:col-span-2">
            <HeroSection />
          </div>
          <div className="lg:col-span-1">
            <InvoiceWidget />
          </div>
        </div>
        
        <section>
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Hızlı İşlemler
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ReferralWidget />
            <QuickActions />
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Index;
