import { Tv, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import digiturk from "@/assets/digiturk-campaign.jpg";

export function HeroSection() {
  const { language, t } = useLanguage();
  const [completionPercent, setCompletionPercent] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(5);

  useEffect(() => {
    const saved = localStorage.getItem('onboardingData');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        
        const items = [
          !!(data.personalInfo?.firstName && data.personalInfo?.lastName && data.personalInfo?.email),
          !!data.phoneVerified,
          !!data.addressConfirmed,
          !!data.selectedTariff,
          !!data.contractAccepted,
        ];
        
        const completed = items.filter(Boolean).length;
        setCompletedCount(completed);
        setTotalCount(items.length);
        setCompletionPercent(Math.round((completed / items.length) * 100));
      } catch {
        setCompletionPercent(0);
      }
    }
  }, []);

  const isComplete = completionPercent === 100;
  
  return (
    <section className="relative overflow-hidden rounded-2xl h-full min-h-[200px] flex flex-col">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${digiturk})` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a2e]/95 via-[#1a1a2e]/80 to-transparent" />

      {/* Profile Completion Bar - Top */}
      <Link 
        to="/profil" 
        className="relative z-20 bg-black/40 backdrop-blur-sm border-b border-white/10 px-4 py-2 flex items-center justify-between hover:bg-black/50 transition-colors"
      >
        <div className="flex items-center gap-3 flex-1">
          <div className="flex items-center gap-2">
            {isComplete ? (
              <CheckCircle2 className="h-4 w-4 text-primary" />
            ) : (
              <div className="h-4 w-4 rounded-full border-2 border-primary/50 flex items-center justify-center">
                <span className="text-[8px] font-bold text-primary">{completedCount}</span>
              </div>
            )}
            <span className="text-white text-sm font-medium">
              {isComplete 
                ? (language === "tr" ? "Profil Tamamlandı" : "Profile Complete")
                : (language === "tr" ? "Profilimi Tamamla" : "Complete My Profile")
              }
            </span>
          </div>
          <div className="flex-1 max-w-xs">
            <Progress value={completionPercent} variant="glow" className="h-1.5 bg-white/20" />
          </div>
          <span className="text-white/80 text-xs font-medium">{completionPercent}%</span>
        </div>
        <ArrowRight className="h-4 w-4 text-white/60" />
      </Link>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-start p-6 md:p-8">
        <div className="max-w-md">
          <div className="inline-flex items-center gap-2 bg-[#ff6b00]/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium text-white mb-3">
            <Tv className="h-4 w-4" />
            <span>{t("digiturk")}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {t("digiturk2MonthsFree")}
          </h2>
          <p className="text-white/90 text-sm md:text-base mb-4">
            {t("digiturkDesc")}
          </p>
          <Button variant="hero" size="lg" className="group bg-[#ff6b00] hover:bg-[#ff6b00]/90 text-white border-none">
            {t("applyNow")}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
}
