import { useState } from "react";
import { TrendingUp, AlertCircle, Zap, ChevronRight, Gift, Copy, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast as sonnerToast } from "sonner";

const consumptionData = [
  { name: "Oca", tuketim: 320 },
  { name: "Şub", tuketim: 280 },
  { name: "Mar", tuketim: 245 },
  { name: "Nis", tuketim: 190 },
  { name: "May", tuketim: 165 },
  { name: "Haz", tuketim: 210 },
  { name: "Tem", tuketim: 285 },
  { name: "Ağu", tuketim: 310 },
  { name: "Eyl", tuketim: 245 },
  { name: "Eki", tuketim: 220 },
  { name: "Kas", tuketim: 290 },
  { name: "Ara", tuketim: 245 },
];

const savingsTips = [
  { tr: "💡 Cihazlarınızı bekleme modunda bırakmayın - yılda 50₺ tasarruf edin", en: "💡 Don't leave devices on standby - save 50₺/year" },
  { tr: "💡 LED ampuller ile elektrik faturanızda %80 tasarruf edin", en: "💡 Save 80% on lighting with LED bulbs" },
  { tr: "💡 Kış aylarında termostatı 1°C düşürün - %10 tasarruf", en: "💡 Lower thermostat by 1°C in winter - save 10%" },
];

export function QuickActions() {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const inviteCode = "REMUS2026";

  useEffect(() => {
    const tipIndex = Math.floor(Math.random() * savingsTips.length);
    const tip = savingsTips[tipIndex];
    
    const timer = setTimeout(() => {
      toast({
        description: language === "tr" ? tip.tr : tip.en,
        duration: 6000,
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    sonnerToast.success(t("copied"));
    setTimeout(() => setCopied(false), 2000);
  };

  const quickLinks = [
    {
      icon: Zap,
      title: language === "tr" ? "Aktif Tarife" : "Active Tariff",
      to: "/tarifeler",
    },
    {
      icon: TrendingUp,
      title: language === "tr" ? "Tüketim Analizi" : "Consumption",
      to: "/tuketim-analizi",
    },
    {
      icon: AlertCircle,
      title: language === "tr" ? "Destek" : "Support",
      to: "/ariza-destek",
    },
  ];
  return (
    <div className="bg-gradient-to-br from-primary/10 via-card to-card rounded-2xl border-2 border-primary/30 p-4 h-full ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
      {/* Referral Section - Main Focus */}
      <Link to="/referans" className="block mb-4">
        <div className="flex items-center justify-between p-3 rounded-xl bg-primary/10 hover:bg-primary/15 transition-colors">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Gift className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground text-sm">{t("referFriends")}</h4>
              <p className="text-xs text-muted-foreground">{t("referralDesc")}</p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-primary" />
        </div>
      </Link>

      {/* Invite Code */}
      <div className="bg-secondary/50 dark:bg-secondary/30 rounded-lg p-2.5 border border-border/50 mb-4">
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

      {/* Quick Links */}
      <div className="space-y-1">
        {quickLinks.map((link, index) => (
          <Link key={index} to={link.to}>
            <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-2">
                <link.icon className="h-4 w-4 text-primary" />
                <span className="text-sm text-foreground">{link.title}</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function QuickActionsChart() {
  const { language } = useLanguage();
  
  return (
    <Link to="/tuketim-analizi">
      <div className="bg-card rounded-2xl border border-border overflow-hidden card-hover cursor-pointer h-full p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="font-semibold text-foreground text-sm">
              {language === "tr" ? "Yıllık Tüketim" : "Yearly Consumption"}
            </h4>
            <p className="text-xs text-muted-foreground">
              {language === "tr" ? "Detaylı analiz için tıklayın" : "Click for detailed analysis"}
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={consumptionData}>
              <defs>
                <linearGradient id="dashboardGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                formatter={(value: number) => [`${value} kWh`, 'Tüketim']}
              />
              <Area 
                type="monotone" 
                dataKey="tuketim" 
                stroke="hsl(var(--primary))" 
                fillOpacity={1} 
                fill="url(#dashboardGradient)" 
                strokeWidth={2} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Link>
  );
}
