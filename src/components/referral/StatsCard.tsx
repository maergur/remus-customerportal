import { Users, TrendingUp, Clock, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReferralStats } from "@/lib/referralData";

interface StatsCardProps {
  stats: ReferralStats;
}

export function StatsCard({ stats }: StatsCardProps) {
  const statItems = [
    {
      label: "Toplam Kazanç",
      value: `${stats.totalEarned} ₺`,
      icon: TrendingUp,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      label: "Toplam Davet",
      value: stats.totalReferrals.toString(),
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Bekleyen",
      value: stats.pendingReferrals.toString(),
      icon: Clock,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      label: "Sıralaman",
      value: `#${stats.rank}`,
      subtext: `/ ${stats.totalUsers}`,
      icon: Trophy,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {statItems.map((item) => (
        <div
          key={item.label}
          className="bg-card rounded-xl p-4 border border-border hover:border-primary/30 transition-colors"
        >
          <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center mb-3", item.bgColor)}>
            <item.icon className={cn("h-5 w-5", item.color)} />
          </div>
          <div className="flex items-baseline gap-1">
            <p className="text-xl font-bold text-foreground">{item.value}</p>
            {item.subtext && (
              <span className="text-xs text-muted-foreground">{item.subtext}</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
