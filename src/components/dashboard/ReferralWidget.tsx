import { useState } from "react";
import { Gift, Copy, Check, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

export function ReferralWidget() {
  const { t, language } = useLanguage();
  const [copied, setCopied] = useState(false);
  const inviteCode = "REMUS2024";
  const earned = 200;
  const referralCount = 4;
  const rank = 42;

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    toast.success(t("copied"));
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Link to="/referans">
      <div 
        className="bg-gradient-to-br from-primary/10 via-card to-card rounded-2xl border-2 border-primary/30 overflow-hidden card-hover cursor-pointer animate-fade-in h-full flex flex-col relative ring-2 ring-primary/20 ring-offset-2 ring-offset-background"
        style={{ animationDelay: "0s" }}
      >
        {/* Highlight badge */}
        <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">
          🎁 BONUS
        </div>
        
        <div className="p-4 pb-3 border-b border-primary/20">
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
            <div className="flex items-center gap-1 text-amber-500">
              <Trophy className="h-4 w-4" />
              <span className="text-xs font-bold">#{rank}</span>
            </div>
          </div>
        </div>
        <div className="p-4 pt-3 flex-1 flex flex-col justify-between">
          <div>
            <p className="text-2xl font-bold text-foreground">{earned} ₺</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {referralCount} {language === "tr" ? "arkadaş davet edildi" : "friends invited"}
            </p>
          </div>
          
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
        </div>
      </div>
    </Link>
  );
}
