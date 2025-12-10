import { CreditCard, TrendingUp, AlertCircle } from "lucide-react";

interface QuickActionCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  value?: string;
  delay?: string;
}

function QuickActionCard({ icon: Icon, title, description, value, delay = "0s" }: QuickActionCardProps) {
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
    </div>
  );
}

export function QuickActions() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
        description="Bu ayki tüketiminiz: 245 kWh"
        delay="0.2s"
      />
      <QuickActionCard
        icon={AlertCircle}
        title="Arıza Bildir"
        description="7/24 destek hattı"
        delay="0.3s"
      />
    </div>
  );
}
