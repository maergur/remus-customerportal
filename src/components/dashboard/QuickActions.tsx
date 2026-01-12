import { TrendingUp, AlertCircle, Zap, ChevronRight, Lightbulb, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

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
  { tr: "Cihazlarınızı bekleme modunda bırakmayın", en: "Don't leave devices on standby" },
  { tr: "LED ampuller ile %80 tasarruf edin", en: "Save 80% with LED bulbs" },
  { tr: "Kış aylarında termostatı 1°C düşürün", en: "Lower thermostat by 1°C in winter" },
];

export function QuickActions() {
  const { language } = useLanguage();

  const quickLinks = [
    {
      icon: Zap,
      title: language === "tr" ? "Aktif Tarife" : "Active Tariff",
      value: language === "tr" ? "Yeşil Enerji Pro" : "Green Energy Pro",
      subValue: "0,85 ₺/kWh",
      to: "/tarifeler",
    },
    {
      icon: TrendingUp,
      title: language === "tr" ? "Bu Ay Tüketim" : "This Month",
      value: "245 kWh",
      subValue: language === "tr" ? "%9 artış" : "9% increase",
      to: "/tuketim-analizi",
    },
    {
      icon: AlertCircle,
      title: language === "tr" ? "Destek" : "Support",
      value: language === "tr" ? "7/24 Aktif" : "24/7 Active",
      subValue: language === "tr" ? "~15 dk yanıt" : "~15 min response",
      to: "/ariza-destek",
    },
  ];

  return (
    <>
      {/* Combined Quick Links Card */}
      <div className="sm:col-span-2 lg:col-span-1 bg-card rounded-2xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-primary" />
            </div>
            <h4 className="font-semibold text-foreground text-sm">
              {language === "tr" ? "Hızlı Erişim" : "Quick Access"}
            </h4>
          </div>
        </div>
        <div className="divide-y divide-border/50">
          {quickLinks.map((link, index) => (
            <Link key={index} to={link.to}>
              <div className="p-3 hover:bg-muted/50 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <link.icon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{link.title}</p>
                    <p className="text-xs text-muted-foreground">{link.subValue}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{link.value}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Consumption Chart Card */}
      <Link to="/tuketim-analizi" className="sm:col-span-2 lg:col-span-1">
        <div className="bg-card rounded-2xl border border-border overflow-hidden card-hover cursor-pointer h-full">
          <div className="p-4 border-b border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm">
                    {language === "tr" ? "Tüketim Grafiği" : "Consumption Chart"}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {language === "tr" ? "Yıllık görünüm" : "Yearly view"}
                  </p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <div className="p-4 pt-2">
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={consumptionData}>
                  <defs>
                    <linearGradient id="dashboardGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" hide />
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
        </div>
      </Link>

      {/* Savings Tips Card */}
      <div className="sm:col-span-2 lg:col-span-1 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl border border-primary/20 overflow-hidden">
        <div className="p-4 border-b border-primary/10">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
              <Lightbulb className="h-4 w-4" />
            </div>
            <h4 className="font-semibold text-foreground text-sm">
              {language === "tr" ? "Tasarruf İpuçları" : "Savings Tips"}
            </h4>
          </div>
        </div>
        <div className="p-4 space-y-3">
          {savingsTips.map((tip, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-semibold text-primary">{index + 1}</span>
              </div>
              <p className="text-sm text-foreground">{language === "tr" ? tip.tr : tip.en}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
