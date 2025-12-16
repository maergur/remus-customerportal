import { TrendingUp, AlertCircle, Zap, ChevronRight, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface QuickActionCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  value?: string;
  subValue?: string;
  delay?: string;
  to: string;
  accent?: boolean;
}

function QuickActionCard({ icon: Icon, title, description, value, subValue, delay = "0s", to, accent }: QuickActionCardProps) {
  return (
    <Link to={to}>
      <div 
        className={`bg-card rounded-2xl border overflow-hidden card-hover cursor-pointer animate-fade-in h-full flex flex-col ${accent ? 'border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10' : 'border-border'}`}
        style={{ animationDelay: delay }}
      >
        <div className="p-4 pb-3 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${accent ? 'bg-primary text-primary-foreground' : 'bg-primary/10'}`}>
                <Icon className={`h-5 w-5 ${accent ? '' : 'text-primary'}`} />
              </div>
              <div>
                <h4 className="font-semibold text-foreground text-sm">{title}</h4>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        {value && (
          <div className="p-4 pt-3 flex-1 flex flex-col justify-between">
            <div>
              <p className="text-2xl font-bold text-foreground">{value}</p>
              {subValue && <p className="text-xs text-muted-foreground mt-0.5">{subValue}</p>}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}

export function QuickActions() {
  const { language } = useLanguage();
  
  const actions = [
    {
      icon: Users,
      title: language === "tr" ? "Arkadaşını Davet" : "Invite Friends",
      description: language === "tr" ? "Kazan ve kazandır" : "Earn rewards together",
      value: language === "tr" ? "100 ₺ Kazan" : "Earn 100 ₺",
      subValue: language === "tr" ? "Her davet için bonus" : "Bonus for each invite",
      delay: "0s",
      to: "/referans",
      accent: true,
    },
    {
      icon: Zap,
      title: language === "tr" ? "Aktif Tarife" : "Active Tariff",
      description: language === "tr" ? "Mevcut paketiniz" : "Your current plan",
      value: language === "tr" ? "Yeşil Enerji Pro" : "Green Energy Pro",
      subValue: "0,85 ₺/kWh • " + (language === "tr" ? "Sabit Fiyat" : "Fixed Price"),
      delay: "0.1s",
      to: "/tarifeler",
      accent: false,
    },
    {
      icon: TrendingUp,
      title: language === "tr" ? "Tüketim Analizi" : "Consumption Analysis",
      description: language === "tr" ? "Bu ayki tüketiminiz" : "This month's consumption",
      value: "245 kWh",
      subValue: language === "tr" ? "Geçen aya göre %9 artış" : "9% increase from last month",
      delay: "0.2s",
      to: "/tuketim-analizi",
      accent: false,
    },
    {
      icon: AlertCircle,
      title: language === "tr" ? "Arıza Bildir" : "Report Issue",
      description: language === "tr" ? "7/24 destek hattı" : "24/7 support line",
      value: language === "tr" ? "Aktif Destek" : "Active Support",
      subValue: language === "tr" ? "Ortalama yanıt: 15 dk" : "Avg response: 15 min",
      delay: "0.3s",
      to: "/ariza-destek",
      accent: false,
    },
  ];

  return (
    <>
      {actions.map((action, index) => (
        <QuickActionCard key={index} {...action} />
      ))}
    </>
  );
}
