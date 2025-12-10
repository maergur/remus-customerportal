import { TrendingUp, AlertCircle, Zap, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

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
        className="bg-card rounded-2xl border border-border overflow-hidden card-hover cursor-pointer animate-fade-in h-full"
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
          <div className="p-4 pt-3">
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {subValue && <p className="text-xs text-muted-foreground mt-1">{subValue}</p>}
          </div>
        )}
      </div>
    </Link>
  );
}

export function QuickActions() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <QuickActionCard
        icon={Zap}
        title="Aktif Tarife"
        description="Mevcut paketiniz"
        value="Yeşil Enerji Pro"
        subValue="0,85 ₺/kWh • Sabit Fiyat"
        delay="0.1s"
        to="/tarifeler"
        accent
      />
      <QuickActionCard
        icon={TrendingUp}
        title="Tüketim Analizi"
        description="Bu ayki tüketiminiz"
        value="245 kWh"
        subValue="Geçen aya göre %9 artış"
        delay="0.2s"
        to="/tuketim-analizi"
      />
      <QuickActionCard
        icon={AlertCircle}
        title="Arıza Bildir"
        description="7/24 destek hattı"
        value="Aktif Destek"
        subValue="Ortalama yanıt: 15 dk"
        delay="0.3s"
        to="/ariza-destek"
      />
    </div>
  );
}