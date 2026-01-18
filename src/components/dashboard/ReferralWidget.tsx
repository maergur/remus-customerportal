import { useState } from "react";
import { Gift, Copy, Check, Trophy, Flame, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { Progress } from "@/components/ui/progress";

export function ReferralWidget() {
  const { t, language } = useLanguage();
  const [copied, setCopied] = useState(false);
  const inviteCode = "REMUS2026";
  const earned = 200;
  const referralCount = 4;
  const rank = 42;
  const streak = 2;
  const nextMilestone = 5;
  const nextMilestoneReward = 50;

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    toast.success(t("copied"));
    setTimeout(() => setCopied(false), 2000);
  };

  const progress = (referralCount / nextMilestone) * 100;

  return (
    <Link to="/referans">
      <div 
        className="bg-gradient-to-br from-primary/10 via-card to-card rounded-2xl border-2 border-primary/30 overflow-hidden card-hover cursor-pointer animate-fade-in h-full flex flex-col relative"
        style={{ animationDelay: "0s" }}
      >
        {/* Header */}
        <div className="p-4 pb-3 border-b border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <Gift className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground text-sm">{t("referFriends")}</h4>
                <p className="text-xs text-muted-foreground">{t("referralDesc")}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {streak > 0 && (
                <div className="flex items-center gap-1 text-orange-500 bg-orange-500/10 px-2 py-1 rounded-full">
                  <Flame className="h-3.5 w-3.5" />
                  <span className="text-xs font-bold">{streak}</span>
                </div>
              )}
              <div className="flex items-center gap-1 text-amber-500">
                <Trophy className="h-4 w-4" />
                <span className="text-xs font-bold">#{rank}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="p-4 pt-3 flex-1 flex flex-col justify-between">
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-foreground">{earned} ₺</p>
            <span className="text-xs text-muted-foreground">
              ({referralCount} {language === "tr" ? "davet" : "invites"})
            </span>
          </div>
          
          {/* Progress to next milestone */}
          <div className="mt-2">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">
                {language === "tr" ? "Sonraki rozet" : "Next badge"}
              </span>
              <span className="text-primary font-medium">+{nextMilestoneReward} TL</span>
            </div>
            <Progress value={progress} className="h-1.5" />
            <p className="text-[10px] text-muted-foreground mt-1">
              {nextMilestone - referralCount} {language === "tr" ? "davet kaldı" : "more to go"}
            </p>
          </div>
          
          {/* Invite Code */}
          <div className="mt-3 bg-secondary/50 dark:bg-secondary/30 rounded-lg p-2.5 border border-border/50">
            <div className="flex items-center justify-between gap-2">
              <code className="text-sm font-bold text-foreground tracking-wider">{inviteCode}</code>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-7 px-2 text-xs"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
              </Button>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-3 flex items-center justify-center gap-1 text-primary text-xs font-medium">
            <span>{language === "tr" ? "Detayları gör" : "View details"}</span>
            <ArrowRight className="h-3 w-3" />
          </div>
        </div>
      </div>
    </Link>
  );
}
