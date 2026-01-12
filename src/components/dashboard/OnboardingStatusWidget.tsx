import { Clock, CheckCircle, XCircle, ArrowRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { ApplicationStatus } from "@/contexts/OnboardingContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
interface OnboardingStatusWidgetProps {
  status: ApplicationStatus;
  currentStep: number;
  totalSteps: number;
  rejectionNote?: string;
}

export function OnboardingStatusWidget({ 
  status, 
  currentStep, 
  totalSteps,
  rejectionNote 
}: OnboardingStatusWidgetProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const targetPercent = Math.round((currentStep / totalSteps) * 100);
  const [animatedPercent, setAnimatedPercent] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercent(targetPercent);
    }, 100);
    return () => clearTimeout(timer);
  }, [targetPercent]);
  
  const handleContinue = () => {
    navigate("/onboarding");
  };

  // Incomplete application - show progress
  if (status === 'PENDING' && currentStep < totalSteps) {
    return (
      <section className="relative overflow-hidden rounded-2xl h-full min-h-[264px] bg-gradient-to-br from-primary/10 via-background to-accent/10 border border-border">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        
        <div className="relative z-10 h-full flex flex-col justify-between p-6 md:p-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-3 py-1 text-sm font-medium text-primary mb-3">
              <FileText className="h-4 w-4" />
              <span>{t("continueApplication")}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              {t("completeYourApplication")}
            </h2>
            <p className="text-muted-foreground text-sm md:text-base mb-4">
              {t("applicationProgress")}: {currentStep}/{totalSteps} {t("stepsCompleted")}
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("progress")}</span>
                <span className="text-primary font-medium transition-all duration-700">{animatedPercent}%</span>
              </div>
              <Progress value={animatedPercent} variant="glow" className="h-2" />
            </div>
            
            <Button onClick={handleContinue} className="group">
              {t("continueApplication")}
              <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </section>
    );
  }

  // Under review
  if (status === 'UNDER_REVIEW') {
    return (
      <section className="relative overflow-hidden rounded-2xl h-full min-h-[264px] bg-gradient-to-br from-amber-500/10 via-background to-orange-500/10 border border-amber-500/20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent" />
        
        <div className="relative z-10 h-full flex flex-col justify-between p-6 md:p-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-500/10 rounded-full px-3 py-1 text-sm font-medium text-amber-600 dark:text-amber-400 mb-3">
              <Clock className="h-4 w-4 animate-pulse" />
              <span>{t("underReview")}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              {t("applicationUnderReview")}
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              {t("applicationUnderReviewDesc")}
            </p>
          </div>
          
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Clock className="h-5 w-5 text-amber-500" />
            <span>{t("estimatedReviewTime")}: 1-2 {t("businessDays")}</span>
          </div>
        </div>
      </section>
    );
  }

  // Rejected
  if (status === 'REJECTED') {
    return (
      <section className="relative overflow-hidden rounded-2xl h-full min-h-[264px] bg-gradient-to-br from-destructive/10 via-background to-red-500/10 border border-destructive/20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-destructive/5 via-transparent to-transparent" />
        
        <div className="relative z-10 h-full flex flex-col justify-between p-6 md:p-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-destructive/10 rounded-full px-3 py-1 text-sm font-medium text-destructive mb-3">
              <XCircle className="h-4 w-4" />
              <span>{t("applicationRejected")}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              {t("applicationNeedsCorrection")}
            </h2>
            {rejectionNote && (
              <p className="text-muted-foreground text-sm md:text-base mb-2">
                {t("reason")}: {rejectionNote}
              </p>
            )}
          </div>
          
          <Button onClick={handleContinue} variant="destructive" className="group w-fit">
            {t("correctAndResubmit")}
            <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </section>
    );
  }

  // Default - should not reach here if used correctly
  return null;
}
