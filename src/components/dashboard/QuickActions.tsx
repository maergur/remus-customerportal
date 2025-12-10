import { CreditCard, TrendingUp, Camera, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickActionCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  value?: string;
  trend?: React.ReactNode;
  delay?: string;
}

function QuickActionCard({ icon: Icon, title, description, value, trend, delay = "0s" }: QuickActionCardProps) {
  return (
    <div 
      className="bg-card rounded-2xl p-5 border border-border card-hover cursor-pointer animate-fade-in"
      style={{ animationDelay: delay }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        {value && (
          <span className="text-lg font-bold text-foreground">{value}</span>
        )}
      </div>
      <h4 className="font-semibold text-foreground mb-1">{title}</h4>
      <p className="text-sm text-muted-foreground">{description}</p>
      {trend && <div className="mt-3">{trend}</div>}
    </div>
  );
}

// Mini Sparkline Component
function MiniSparkline() {
  const data = [30, 45, 35, 55, 40, 60, 45, 70, 55, 65];
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;
  
  const points = data.map((value, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((value - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox="0 0 100 40" className="w-full h-10">
      <defs>
        <linearGradient id="sparklineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(142 71% 45%)" />
          <stop offset="100%" stopColor="hsl(199 89% 48%)" />
        </linearGradient>
      </defs>
      <polyline
        points={points}
        fill="none"
        stroke="url(#sparklineGradient)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function QuickActions() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <QuickActionCard
        icon={CreditCard}
        title="Fatura Öde"
        description="Güncel borcunuz"
        value="₺342,50"
        delay="0.1s"
      />
      <QuickActionCard
        icon={TrendingUp}
        title="Tüketim Analizi"
        description="Bu ayki tüketiminiz"
        trend={<MiniSparkline />}
        delay="0.2s"
      />
      <QuickActionCard
        icon={Camera}
        title="Endeks Bildir"
        description="Son bildirim: 3 gün önce"
        delay="0.3s"
      />
      <QuickActionCard
        icon={AlertCircle}
        title="Arıza Bildir"
        description="7/24 destek hattı"
        delay="0.4s"
      />
    </div>
  );
}
