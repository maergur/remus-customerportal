import { useState } from "react";
import { TrendingUp, AlertCircle, Zap, ChevronRight, Gift, Copy, Check, Lightbulb, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, ReferenceLine } from "recharts";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast as sonnerToast } from "sonner";

// Current month index (December = 11)
const currentMonthIndex = 11;

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

// Create chart data with actual and forecast
const chartData = consumptionData.map((item, index) => ({
  name: item.name,
  actual: index <= currentMonthIndex ? item.tuketim : null,
  forecast: index >= currentMonthIndex ? item.tuketim : null,
}));

// Add forecast months
const forecastMonths = [
  { name: "Oca'27", actual: null, forecast: 335 },
  { name: "Şub'27", actual: null, forecast: 295 },
  { name: "Mar'27", actual: null, forecast: 260 },
];

const fullChartData = [...chartData, ...forecastMonths];

const savingsTips = [
  { tr: "Cihazlarınızı bekleme modunda bırakmayın - yılda 200₺'ye kadar tasarruf edin", en: "Don't leave devices on standby - save up to 200₺/year" },
  { tr: "LED ampuller ile elektrik faturanızda %80 tasarruf edin", en: "Save 80% on lighting with LED bulbs" },
  { tr: "Kış aylarında termostatı 1°C düşürün - %10 tasarruf", en: "Lower thermostat by 1°C in winter - save 10%" },
  { tr: "A+++ enerji sınıfı cihazlar %30 daha az enerji tüketir", en: "A+++ appliances consume 30% less energy" },
  { tr: "Çamaşır ve bulaşık makinenizi tam kapasiteyle çalıştırın", en: "Run washing machines at full capacity" },
  { tr: "Gece 23:00'ten sonra elektrik daha ucuz - bu saatleri kullanın", en: "Electricity is cheaper after 11 PM - use this time" },
  { tr: "Buzdolabı kapağını sık açmayın - her açılış enerji harcar", en: "Don't open fridge door often - each opening uses energy" },
  { tr: "Telefon şarjı dolunca fişi çekin - pil ömrü de uzar", en: "Unplug phone when charged - battery life extends too" },
  { tr: "Klima yazın 24-26°C'de sabit tutulmalı - sık açma kapama yapmayın", en: "Keep AC at 24-26°C in summer - avoid frequent on/off" },
  { tr: "Çamaşırları düşük sıcaklıkta yıkayın - aynı temizlik, az enerji", en: "Wash clothes at low temp - same clean, less energy" },
  { tr: "Ütüyü toplu yapın - her ısınma fazladan enerji harcar", en: "Iron in batches - each warmup uses extra energy" },
  { tr: "Gündüz doğal ışıktan maksimum faydalanın - perdeleri açın", en: "Maximize natural light during day - open curtains" },
  { tr: "Akıllı prizler ile cihazları otomatik kapatın - %10 tasarruf", en: "Smart plugs auto-off devices - save 10%" },
  { tr: "Klima ve kombi bakımı yaptırın - %15 verimlilik artışı", en: "Service AC and boiler - 15% efficiency boost" },
  { tr: "Isı yalıtımı olmayan evlerde %50'ye varan enerji kaybı olur", en: "Homes without insulation lose up to 50% energy" },
  { tr: "Eski beyaz eşyalarınızı yenileyin - yeni modeller çok daha verimli", en: "Replace old appliances - new models are more efficient" },
  { tr: "Hareket sensörlü lambalar kullanın - gereksiz aydınlatma biter", en: "Use motion sensor lights - no unnecessary lighting" },
  { tr: "Pencere contalarını kontrol edin - küçük açıklıklar büyük kayıp demek", en: "Check window seals - small gaps mean big losses" },
  { tr: "Bilgisayarı mesai bitiminde tamamen kapatın", en: "Completely shut down computer after work" },
  { tr: "Enerji takip uygulaması kullanın - hangi cihaz ne kadar harcıyor görün", en: "Use energy tracking apps - see which device uses how much" },
];

export function QuickActions() {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const inviteCode = "REMUS2026";

  useEffect(() => {
    const tipIndex = Math.floor(Math.random() * savingsTips.length);
    const tip = savingsTips[tipIndex];
    
    const timer = setTimeout(() => {
      toast({
        title: language === "tr" ? "Tasarruf İpucu" : "Savings Tip",
        description: language === "tr" ? tip.tr : tip.en,
        duration: 30000,
        action: (
          <ToastAction 
            altText={language === "tr" ? "Tüm ipuçları" : "All tips"}
            onClick={() => navigate("/ipuclari")}
            className="p-2"
          >
            <ArrowRight className="h-4 w-4" />
          </ToastAction>
        ),
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
      value: language === "tr" ? "Yeşil Enerji Pro" : "Green Energy Pro",
      subValue: "0,85 ₺/kWh",
      to: "/tarifeler",
    },
    {
      icon: TrendingUp,
      title: language === "tr" ? "Bu Ay Tüketim" : "This Month",
      value: "245 kWh",
      subValue: language === "tr" ? "Geçen aya göre %9 ↑" : "9% vs last month",
      to: "/tuketim-analizi",
    },
    {
      icon: AlertCircle,
      title: language === "tr" ? "Destek" : "Support",
      value: language === "tr" ? "7/24 Aktif" : "24/7 Active",
      subValue: language === "tr" ? "Ort. yanıt: ~15 dk" : "Avg. response: ~15 min",
      to: "/ariza-destek",
    },
  ];
  return (
    <div className="bg-gradient-to-br from-primary/10 via-card to-card rounded-2xl border-2 border-primary/30 p-4 h-full min-h-[280px] flex flex-col ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
      {/* Referral Section - Main Focus */}
      <Link to="/referans" className="block mb-3">
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-primary/10 hover:bg-primary/15 transition-colors">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Gift className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground text-sm">{t("referFriends")}</h4>
              <p className="text-[11px] text-muted-foreground">{t("referralDesc")}</p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-primary" />
        </div>
      </Link>

      {/* Invite Code */}
      <div className="bg-secondary/50 dark:bg-secondary/30 rounded-lg p-2 border border-border/50 mb-3">
        <div className="flex items-center justify-between gap-2">
          <code className="text-sm font-bold text-foreground tracking-wider">{inviteCode}</code>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-6 px-2 text-xs"
          >
            {copied ? <Check className="h-3 w-3 text-primary" /> : <Copy className="h-3 w-3" />}
          </Button>
        </div>
      </div>

      {/* Quick Links with Details */}
      <div className="space-y-2 flex-1 flex flex-col justify-evenly">
        {quickLinks.map((link, index) => (
          <Link key={index} to={link.to}>
            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors border border-border/50">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center">
                  <link.icon className="h-3.5 w-3.5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">{link.title}</p>
                  <p className="text-[10px] text-muted-foreground">{link.subValue}</p>
                </div>
              </div>
              <div className="text-right flex items-center gap-1">
                <span className="text-xs font-semibold text-foreground">{link.value}</span>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function QuickActionsChart() {
  const { language } = useLanguage();
  
  const totalConsumption = consumptionData.reduce((sum, item) => sum + item.tuketim, 0);
  const avgConsumption = Math.round(totalConsumption / 12);
  const maxMonth = consumptionData.reduce((max, item) => item.tuketim > max.tuketim ? item : max, consumptionData[0]);
  const minMonth = consumptionData.reduce((min, item) => item.tuketim < min.tuketim ? item : min, consumptionData[0]);
  
  return (
    <Link to="/tuketim-analizi" className="sm:col-span-2">
      <div className="bg-card rounded-2xl border border-border overflow-hidden card-hover cursor-pointer h-full p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="font-semibold text-foreground text-sm">
              {language === "tr" ? "Yıllık Tüketim & Tahmin" : "Yearly Consumption & Forecast"}
            </h4>
            <p className="text-xs text-muted-foreground">
              {language === "tr" ? "Detaylı analiz için tıklayın" : "Click for detailed analysis"}
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                <span className="text-muted-foreground">{language === "tr" ? "Gerçek" : "Actual"}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-muted-foreground">{language === "tr" ? "Tahmin" : "Forecast"}</span>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        
        {/* Chart */}
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={fullChartData}>
              <defs>
                <linearGradient id="dashboardGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} width={35} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                formatter={(value: number, name: string) => [
                  `${value} kWh`,
                  name === 'actual' ? (language === "tr" ? 'Gerçek' : 'Actual') : (language === "tr" ? 'Tahmin' : 'Forecast')
                ]}
              />
              <ReferenceLine x="Ara" stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" />
              <Area 
                type="monotone" 
                dataKey="actual" 
                stroke="hsl(var(--primary))" 
                fillOpacity={1} 
                fill="url(#dashboardGradient)" 
                strokeWidth={2}
                connectNulls={false}
              />
              <Area 
                type="monotone" 
                dataKey="forecast" 
                stroke="hsl(38, 92%, 50%)" 
                fillOpacity={1} 
                fill="url(#forecastGradient)" 
                strokeWidth={2}
                strokeDasharray="5 5"
                connectNulls={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Link>
  );
}
