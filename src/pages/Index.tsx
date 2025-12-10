import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { HeroSection } from "@/components/dashboard/HeroSection";
import { ReferralWidget } from "@/components/dashboard/ReferralWidget";
import { QuickActions } from "@/components/dashboard/QuickActions";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="ml-64">
        <TopBar />
        
        <div className="p-6 space-y-6">
          {/* Hero + Referral Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <HeroSection />
            </div>
            <div className="lg:col-span-1">
              <ReferralWidget />
            </div>
          </div>

          {/* Quick Actions */}
          <section>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Hızlı İşlemler
            </h3>
            <QuickActions />
          </section>
        </div>
      </main>
    </div>
  );
};

export default Index;
