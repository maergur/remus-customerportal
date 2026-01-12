import { TrendingUp, TrendingDown, AlertCircle, Zap, ChevronRight, Calendar, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

const savingsTips = [
  { tr: "💡 Cihazlarınızı bekleme modunda bırakmayın - yılda 50₺ tasarruf edin", en: "💡 Don't leave devices on standby - save 50₺/year" },
  { tr: "💡 LED ampuller ile elektrik faturanızda %80 tasarruf edin", en: "💡 Save 80% on lighting with LED bulbs" },
  { tr: "💡 Kış aylarında termostatı 1°C düşürün - %10 tasarruf", en: "💡 Lower thermostat by 1°C in winter - save 10%" },
];

export function QuickActions() {
  const { language } = useLanguage();
  const { toast } = useToast();

  useEffect(() => {
    const tipIndex = Math.floor(Math.random() * savingsTips.length);
    const tip = savingsTips[tipIndex];
    
    const timer = setTimeout(() => {
      toast({
        title: language === "tr" ? "Tasarruf İpucu" : "Savings Tip",
        description: language === "tr" ? tip.tr : tip.en,
        duration: 8000,
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden h-full">
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <h4 className="font-semibold text-foreground">
          {language === "tr" ? "Hesap Özeti" : "Account Summary"}
        </h4>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Active Tariff */}
        <Link to="/tarifeler">
          <div className="flex items-center justify-between p-3 rounded-xl bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-colors">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {language === "tr" ? "Yeşil Enerji Pro" : "Green Energy Pro"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {language === "tr" ? "Yıllık Sabit Tarife" : "Annual Fixed Rate"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-primary">0,85 ₺/kWh</p>
              <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
            </div>
          </div>
        </Link>

        {/* Consumption Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Link to="/tuketim-analizi">
            <div className="p-3 rounded-xl bg-secondary/50 hover:bg-secondary/70 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">
                  {language === "tr" ? "Bu Ay" : "This Month"}
                </span>
              </div>
              <p className="text-lg font-bold text-foreground">245 kWh</p>
              <p className="text-xs text-primary flex items-center gap-1">
                <TrendingDown className="h-3 w-3" /> 
                {language === "tr" ? "%12 azaldı" : "12% down"}
              </p>
            </div>
          </Link>

          <Link to="/faturalar">
            <div className="p-3 rounded-xl bg-secondary/50 hover:bg-secondary/70 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="h-4 w-4 text-amber-500" />
                <span className="text-xs text-muted-foreground">
                  {language === "tr" ? "Bekleyen" : "Pending"}
                </span>
              </div>
              <p className="text-lg font-bold text-foreground">847 ₺</p>
              <p className="text-xs text-amber-600 flex items-center gap-1">
                <Calendar className="h-3 w-3" /> 
                {language === "tr" ? "5 gün kaldı" : "5 days left"}
              </p>
            </div>
          </Link>
        </div>

        {/* Support */}
        <Link to="/ariza-destek">
          <div className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary/50 transition-colors border border-border">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  {language === "tr" ? "Destek Hattı" : "Support"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {language === "tr" ? "7/24 aktif • ~15 dk yanıt" : "24/7 active • ~15 min response"}
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </Link>
      </div>
    </div>
  );
}
