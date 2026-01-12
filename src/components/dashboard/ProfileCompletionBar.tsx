import { CheckCircle2, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export function ProfileCompletionBar() {
  const { language } = useLanguage();
  const [completionPercent, setCompletionPercent] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

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
        setCompletionPercent(Math.round((completed / items.length) * 100));
      } catch {
        setCompletionPercent(0);
      }
    }
  }, []);

  const isComplete = completionPercent === 100;

  return (
    <Link 
      to="/profil" 
      className="block bg-card border border-border rounded-xl px-4 py-3 hover:bg-secondary/50 transition-colors"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="flex items-center gap-2">
            {isComplete ? (
              <CheckCircle2 className="h-5 w-5 text-primary" />
            ) : (
              <div className="h-5 w-5 rounded-full border-2 border-primary flex items-center justify-center">
                <span className="text-[9px] font-bold text-primary">{completedCount}</span>
              </div>
            )}
            <span className="text-foreground text-sm font-medium">
              {isComplete 
                ? (language === "tr" ? "Profil Tamamlandı" : "Profile Complete")
                : (language === "tr" ? "Profilimi Tamamla" : "Complete My Profile")
              }
            </span>
          </div>
          <div className="flex-1 max-w-md">
            <Progress value={completionPercent} variant="glow" className="h-2" />
          </div>
          <span className="text-primary text-sm font-bold">{completionPercent}%</span>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground" />
      </div>
    </Link>
  );
}
